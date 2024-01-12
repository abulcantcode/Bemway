import { TBoardData } from "@/server/routes/board";
import BackendRequest from "@/utils/backend";
import { cloneDeep } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";

export default function useLazyFetch({
  res,
  boardId,
}: {
  res: TBoardData;
  boardId: string;
}) {
  const { refresh } = useRouter();
  const getBoardInfoFromRes = (res: TBoardData) => {
    const { stage, ...boardInfo } = res;
    return boardInfo;
  };

  const [stageData, setStageData] = useState<TBoardData["stage"]>(res.stage);
  const [boardInfo, setBoardInfo] = useState<Omit<TBoardData, "stage">>(
    getBoardInfoFromRes(res)
  );

  useEffect(() => {
    setStageData(res.stage);
    setBoardInfo(getBoardInfoFromRes(res));
  }, [res]);

  const matchColumnOrder = ({ stageOrder: newStageData }: TMoveStage) => {
    console.log("moveStage", { newStageData });
    if (newStageData?.length !== stageData?.length) {
      console.error("Stage orders (by length) do not match");
      return refresh();
    }
    if (
      newStageData.find((curr) => !stageData.find(({ id }) => id === curr.id))
    ) {
      console.error("Stage order ID lists do not match");
      return refresh();
    }

    setStageData((prev) => {
      const orderMatches = newStageData?.every((fetchedStage, index) => {
        return (
          fetchedStage.order === prev?.[index]?.order &&
          fetchedStage.id === prev?.[index]?.id
        );
      });

      if (orderMatches) return prev;
      console.log("Column ordering did not match after update, fixing it now!");

      const yan = prev
        .map((stage) => ({
          ...stage,
          order: newStageData.find(({ id }) => id === stage.id)?.order!,
        }))
        .sort((a, b) => a.order - b.order);
      return yan;
    });
  };

  const matchTaskOrder = ({
    newStageTaskOrder,
    prevStageTaskOrder,
    newStageId,
    prevStageId,
  }: TMoveTask) => {
    console.log("Socket: move task", {
      newStageTaskOrder,
      prevStageTaskOrder,
      newStageId,
      prevStageId,
    });
    setStageData((prev) => {
      const prevStageData = prev.find(({ id }) => id === prevStageId)?.task;
      const newStageData = prev.find(({ id }) => id === newStageId)?.task;

      if (!prevStageData || !newStageData) {
        console.error("Missing stage from update");
        refresh();
        return prev;
      }
      if (
        newStageData?.length + prevStageData?.length !==
        newStageTaskOrder?.length + prevStageTaskOrder?.length
      ) {
        console.error("Number of total task differs to database");
        refresh();
        return prev;
      }
      if (
        [...newStageTaskOrder, ...prevStageTaskOrder].find(
          (curr) =>
            ![...newStageData, ...prevStageData].find(
              ({ id }) => id === curr.id
            )
        )
      ) {
        console.error("Stage has a mismatch of IDs in list");
        refresh();
        return prev;
      }

      const orderMatches =
        prevStageData?.length === prevStageTaskOrder?.length &&
        newStageData?.length === newStageTaskOrder?.length &&
        prevStageTaskOrder?.every(
          (fetchedStage, index) =>
            fetchedStage.order === prevStageData?.[index]?.order &&
            fetchedStage.id === prevStageData?.[index]?.id
        ) &&
        newStageTaskOrder?.every(
          (fetchedStage, index) =>
            fetchedStage.order === newStageData?.[index]?.order &&
            fetchedStage.id === newStageData?.[index]?.id
        );

      if (orderMatches) {
        return prev;
      }
      console.log("Difference in the task ordering, fixing it now!");

      const stageDataCopy = cloneDeep(prev);
      const allTasks = [...newStageData, ...prevStageData];
      const newCol = stageDataCopy.findIndex(({ id }) => id === newStageId);
      const prevCol = stageDataCopy.findIndex(({ id }) => id === prevStageId);
      stageDataCopy[newCol].task = newStageTaskOrder.map(({ id, order }) => ({
        ...allTasks.find(({ id: taskId }) => id === taskId)!,
        id,
        order,
      }));
      stageDataCopy[prevCol].task = prevStageTaskOrder.map(({ id, order }) => ({
        ...allTasks.find(({ id: taskId }) => id === taskId)!,
        id,
        order,
      }));

      return stageDataCopy;
    });
  };

  // needed on create new task, delete task or edit
  const refetchStage = async ({ stageId }: { stageId: string }) => {
    try {
      const response = await BackendRequest.get<TBoardData["stage"][0]>(
        `stage/${stageId}`
      );
      if (response.statusText === "OK") {
        setStageData((prev) =>
          prev.map((stage) => (stage.id === stageId ? response.data : stage))
        );
      } else {
        console.error("Error in refetch stage", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refetchBoardInfo = async () => {
    try {
      const response = await BackendRequest.get(`board/info/${boardId}`);
      if (response.statusText === "OK") {
        setBoardInfo(response.data);
      } else {
        console.error("Error in fetch", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addStage = (stage: TBoardData["stage"][0]) => {
    setStageData((prev) => [...prev, stage]);
  };

  const updateTaskOrder = async (draggedItem: DropResult) => {
    setStageData((prev) => {
      const sourceOrder = draggedItem.source.index;
      const sourceId = draggedItem.source.droppableId;
      const sourceColumn = prev.findIndex(({ id }) => id === sourceId);
      const destOrder = draggedItem.destination?.index!;
      const destId = draggedItem.destination?.droppableId!;
      const destColumn = prev.findIndex(({ id }) => id === destId);
      const newStageData = cloneDeep(prev);
      const removedItem = newStageData[sourceColumn].task.splice(
        sourceOrder,
        1
      )[0];
      newStageData[destColumn].task.splice(destOrder, 0, removedItem);
      return newStageData.map(({ task, ...stage }) => ({
        ...stage,
        task: task.map((task, idx) => ({ ...task, order: idx })),
      }));
    });
    try {
      await BackendRequest.post("task/move", {
        taskId: draggedItem.draggableId,
        stageId: draggedItem.destination?.droppableId,
        newOrder: draggedItem.destination?.index,
      });
    } catch (error) {
      console.error(error);
      refresh();
    }
  };

  const updateColumnOrder = async (draggedItem: DropResult) => {
    setStageData((prev) => {
      const sourceOrder = draggedItem.source.index;
      const destOrder = draggedItem.destination?.index!;
      const newStageData = cloneDeep(prev);
      const removedItem = newStageData.splice(sourceOrder, 1)[0];
      newStageData.splice(destOrder, 0, removedItem);
      return newStageData.map((stage, idx) => ({ ...stage, order: idx }));
    });

    try {
      await BackendRequest.post("stage/move", {
        stageId: draggedItem?.draggableId,
        newOrder: draggedItem?.destination?.index,
      });
    } catch (error) {
      console.error(error);
      refresh();
    }
  };

  return {
    stageData,
    setStageData,
    boardInfo,
    setBoardInfo,
    refetchBoardInfo,
    refetchStage,
    updateColumnOrder,
    updateTaskOrder,
    matchColumnOrder,
    matchTaskOrder,
    addStage,
    // refetchColumnOrder,
  };
}

export type TMoveTask = {
  newStageId: string;
  newStageTaskOrder: {
    order: number;
    id: string;
    stageId: string;
  }[];
  prevStageId: string;
  prevStageTaskOrder: {
    order: number;
    id: string;
    stageId: string;
  }[];
};

export type TMoveStage = {
  stageOrder: {
    order: number;
    id: string;
  }[];
};

// const refetchColumnOrder = async () => {
//   // dont delete, needed for sockets

//   // if fail, then reorder the columns, if lengths different then do a refresh!
//   try {
//     const response = await BackendRequest.get(`board/${boardId}/columnOrder`);
//     if (response.statusText === "OK") {
//       const orderMatches = (response?.data as TBoardData["stage"])?.every(
//         (fetchedStage, index) => {
//           return (
//             fetchedStage.order === stageData?.[index]?.order &&
//             fetchedStage.id === stageData?.[index]?.id
//           );
//         }
//       );
//       // if fail, then reorder the columns, if lengths different then do a refresh!

//       if (!orderMatches || response?.data?.length !== stageData?.length) {
//         console.error("Error in the column ordering");
//         refresh();
//       }
//     } else {
//       console.error("Error in fetch", response);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
