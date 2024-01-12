"use client";

import { TBoardData } from "@/server/routes/board";
import TaskGroup from "@/components/Board/Task/TaskGroup";
import {
  DragDropContext,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import Droppable from "@/components/Shared/Droppable";
import BackendRequest from "@/utils/backend";
import { useRouter } from "next/navigation";
import CreateStage from "@/components/Board/CreateStage";
import {
  MouseEvent,
  RefObject,
  UIEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button from "@/components/Shared/Button";
import {
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRight,
  ArrowRightCircle,
} from "react-feather";
import classNames from "classnames";
import io from "socket.io-client";
import { TMoveStage, TMoveTask } from "../helper/useLazyFetch";

export default function TaskBoard({
  stages,
  boardId,
  updateTaskOrder,
  updateColumnOrder,
}: {
  stages?: TBoardData["stage"];
  boardId: string;
  updateTaskOrder: (draggedItem: DropResult) => Promise<void>;
  updateColumnOrder: (draggedItem: DropResult) => Promise<void>;
  // matchColumnOrder: (e: TMoveStage) => void;
  // matchTaskOrder: (e: TMoveTask) => void;
  // addStage: (e: TBoardData["stage"][0]) => void;
  // refetchStage: (e: { stageId: string }) => Promise<void>;
  // refetchBoardInfo: () => Promise<void>;
}) {
  const [scrollEnd, setScrollEnd] = useState({ left: true, right: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScrollBoard = () => {
      setScrollEnd((prev) => getScrollAtBoundry(scrollRef) || prev);
    };
    const mooves = scrollRef?.current;

    const updateEndBoundries = setTimeout(() => {
      onScrollBoard();
    }, 500);

    mooves?.addEventListener("scroll", onScrollBoard);
    document.addEventListener("scrollend", onScrollBoard);
    return () => {
      mooves?.removeEventListener("scroll", onScrollBoard);
      document.removeEventListener("scrollend", onScrollBoard);
      clearInterval(updateEndBoundries);
    };
  }, [scrollRef]);

  const mouseDownScroll =
    (left: number) =>
    (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      const scrollingInterval = setInterval(() => {
        scrollRef?.current?.scrollBy({ left, behavior: "smooth" });
      }, 350);
      document.addEventListener(
        "mouseup",
        () => clearInterval(scrollingInterval),
        { once: true }
      );
    };

  const onDragEnd: OnDragEndResponder = async (draggedItem) => {
    if (
      !draggedItem?.destination?.droppableId ||
      (draggedItem?.destination?.droppableId ===
        draggedItem?.source?.droppableId &&
        draggedItem?.destination?.index === draggedItem?.source?.index)
    ) {
      return;
    }

    if (draggedItem?.type === "task") {
      await updateTaskOrder(draggedItem);
    } else if (draggedItem?.type === "column") {
      await updateColumnOrder(draggedItem);
    } else {
      throw new Error("No acceptable drag type matched");
    }
  };

  return (
    <div
      className="w-full flex overflow-x-auto overflow-y-hidden relative"
      ref={scrollRef}
    >
      <Button
        className={classNames(
          "sticky left-0 top-0 bottom-0 z-10 flex-col justify-around rounded-none",
          "duration-500 md:flex hidden bg-neutral-500 text-white",
          {
            "opacity-0 cursor-default": scrollEnd.left,
            "opacity-70": !scrollEnd.left,
          }
        )}
        size="zero"
        theme="none"
        onClick={() => {
          scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
        }}
        onMouseDown={mouseDownScroll(-300)}
      >
        {Array.from(
          {
            length: Math.floor(
              (scrollRef?.current?.clientHeight || 1000) / 300
            ),
          },
          (un, idx) => (
            <ArrowLeft size={30} key={idx} />
          )
        )}
        <ArrowLeft size={30} />
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-cols" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              ref={provided?.innerRef}
              {...provided?.droppableProps}
              className="flex w-fit min-h-screen my-4 pb-20"
            >
              {stages?.map(({ stageName, task, id, order }, stageIndex) => (
                <TaskGroup
                  id={id}
                  key={`${id}`}
                  tasks={task}
                  title={stageName}
                  stageOrder={order}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>{" "}
        <CreateStage boardId={boardId} />
      </DragDropContext>
      <Button
        className={classNames(
          "sticky right-0 top-0 bottom-0 z-10 justify-around flex-col rounded-none",
          "duration-500 md:flex hidden bg-neutral-500 text-white",
          {
            "opacity-0 cursor-default": scrollEnd.right,
            "opacity-70": !scrollEnd.right,
          }
        )}
        size="zero"
        onClick={(e) => {
          scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
        }}
        theme="none"
        onMouseDown={mouseDownScroll(300)}
      >
        {Array.from(
          {
            length: Math.floor(
              (scrollRef?.current?.clientHeight || 1000) / 300
            ),
          },
          (un, idx) => (
            <ArrowRight size={30} key={idx} />
          )
        )}
        <ArrowRight size={30} />
      </Button>
    </div>
  );
}

const getScrollAtBoundry = (ref: RefObject<HTMLDivElement>) => {
  if (
    ref?.current?.scrollLeft !== undefined &&
    ref?.current?.scrollWidth &&
    ref?.current?.offsetWidth
  ) {
    return {
      left: ref.current.scrollLeft < 10,
      right:
        ref.current?.scrollWidth - ref.current.scrollLeft <
        ref.current.offsetWidth + 10,
    };
  }
};
