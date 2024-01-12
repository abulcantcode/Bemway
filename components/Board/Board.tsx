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
    refetchStage,
    refetchBoardInfo,
    updateTaskOrder,
    updateColumnOrder,
    stageData,
  } = useLazyFetch({
    res,
    boardId,
  });
  return (
    <>
      <div className="flex flex-col dark:bg-black dark:bg-opacity-50 bg-opacity-50 bg-stone-300">
        <h1 className="ml-8 pt-16 sm:pt-8 mb-4 text-2xl md:text-4xl dark:text-white text-black font-light dark:font-extralight">
          {boardInfo.boardName}
        </h1>

        <div className="flex mb-4 ml-8 gap-2 flex-wrap">
          {boardInfo.users.map(({ user }, idx) => (
            <UserProfile
              {...user}
              key={`users-for-board-${idx}`}
              baseSize="md"
              size="sm"
            />
          ))}
        </div>
        <div className="flex gap-4 mb-4 ml-8 flex-wrap">
          <InviteUserModal
            boardId={boardId}
            refetchBoardInfo={refetchBoardInfo}
          />
          <CreateTaskModal
            boardData={{ ...boardInfo, stage: stageData }}
            refetchStage={refetchStage}
          />
        </div>
      </div>
      <TaskBoard
        stages={stageData}
        boardId={boardId}
        updateTaskOrder={updateTaskOrder}
        updateColumnOrder={updateColumnOrder}
        // matchColumnOrder={matchColumnOrder}
        // matchTaskOrder={matchTaskOrder}
        // addStage={addStage}
        // refetchStage={refetchStage}
        // refetchBoardInfo={refetchBoardInfo}
      />
    </>
  );
}
