"use client";

import UserProfile from "@/components/User/UserProfile";
import InviteUserModal from "@/components/Board/InviteUserModal";
import CreateTaskModal from "@/components/Board/Task/CreateTaskModal";
import TaskBoard from "@/components/Board/TaskBoard";
import { TBoardData } from "@/server/routes/board";
import useLazyFetch from "./helper/useLazyFetch";

export default function Board({
  res,
  boardId,
}: {
  res: TBoardData;
  boardId: string;
}) {
  const {
    boardInfo,
    addStage,
    refetchStage,
    refetchBoardInfo,
    updateTaskOrder,
    updateColumnOrder,
    stageData,
    matchColumnOrder,
    matchTaskOrder,
  } = useLazyFetch({
    res,
    boardId,
  });
  return (
    <>
      <h1 className="ml-8 py-8 text-4xl">{boardInfo.boardName}</h1>

      <div className="flex mb-4 ml-8 gap-2">
        {boardInfo.users.map(({ user }, idx) => (
          <UserProfile {...user} key={`users-for-board-${idx}`} />
        ))}
      </div>
      <div className="flex gap-4 mb-4 ml-8">
        <InviteUserModal
          boardId={boardId}
          refetchBoardInfo={refetchBoardInfo}
        />
        <CreateTaskModal
          boardData={{ ...boardInfo, stage: stageData }}
          refetchStage={refetchStage}
        />
      </div>
      <TaskBoard
        stages={stageData}
        boardId={boardId}
        updateTaskOrder={updateTaskOrder}
        updateColumnOrder={updateColumnOrder}
        matchColumnOrder={matchColumnOrder}
        matchTaskOrder={matchTaskOrder}
        addStage={addStage}
        refetchStage={refetchStage}
        refetchBoardInfo={refetchBoardInfo}
      />
    </>
  );
}
