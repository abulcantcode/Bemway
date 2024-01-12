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
    <div className="flex flex-col gap-4 p-16 bg-white">
      <h1 className="text-black font-bold text-3xl underline underline-offset-8">
        {title}
      </h1>
      <CreateBoardForm />

      {!boards.length && (
        <div className="text-black mt-16 text-xl">
          No boards.{" "}
          <a href="/boards/create" className="underline ">
            Click here to create a board.
          </a>
        </div>
      )}

      {boards?.map &&
        boards?.map(({ boardName, id, isOwner }, index) => (
          <a href={`./board/${id}`} key={`board-${index}`}>
            <div className="p-10 text-2xl bg-black text-white flex justify-between items-center">
              {boardName}
              <div
                className={classNames(
                  "bg-red-500 px-2 py-1 rounded-md text-sm font-bold w-fit ml-4",
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
