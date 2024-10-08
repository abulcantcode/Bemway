import classNames from "classnames";
import CreateBoardForm from "./CreateBoardForm";
import BoardItem from "./BoardItem";

export default function BoardList({
  boards,
  title,
}: {
  boards: {
    boardName: string;
    id: string;
    ownerId: string;
    isOwner: boolean;
  }[];
  title: string;
}) {
  return (
    <div className='flex flex-col gap-4 p-6 sm:p-8 md:p-16'>
      <div className='flex justify-between flex-wrap gap-8 mb-8 md:mt-4 mt-16'>
        <h1 className='text-black font-extralight text-5xl dark:text-white'>
          {title}
        </h1>
        <CreateBoardForm />
      </div>

      {!boards.length && (
        <div className='text-black dark:text-white mt-8 text-xl text-center'>
          {`No boards. Use the "Create a new board" button to get started!`}
        </div>
      )}

      {boards?.map &&
        boards?.map((board, index) => (
          <BoardItem key={`board-${index}`} {...board} />
        ))}
    </div>
  );
}
