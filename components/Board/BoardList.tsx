import classNames from "classnames";
import CreateBoardForm from "./CreateBoardForm";

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
    <div className="flex flex-col gap-4 p-6 sm:p-8 md:p-16">
      <div className="flex justify-between flex-wrap gap-8 mb-8 md:mt-4 mt-16">
        <h1 className="text-black font-extralight text-5xl dark:text-white">
          {title}
        </h1>
        <CreateBoardForm />
      </div>

      {!boards.length && (
        <div className="text-black dark:text-white mt-8 text-xl text-center">
          {`No boards. Use the "Create a new board" button to get started!`}
        </div>
      )}

      {boards?.map &&
        boards?.map(({ boardName, id, isOwner }, index) => (
          <a href={`./board/${id}`} key={`board-${index}`}>
            <div className="p-10 text-2xl bg-black dark:text-white text-black flex flex-col-reverse md:flex-row justify-between md:items-center bg-opacity-20">
              {boardName}
              <div
                className={classNames(
                  "bg-red-500 px-2 py-1 rounded-md text-sm font-bold w-fit md:ml-4 md:mb-0 mb-4",
                  { invisible: !isOwner }
                )}
              >
                Owner
              </div>
            </div>
          </a>
        ))}
    </div>
  );
}
