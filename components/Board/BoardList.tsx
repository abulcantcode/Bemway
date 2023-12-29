export default function BoardList({
  boards,
  title,
}: {
  boards: { boardName: string; id: string }[];
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-16 bg-white">
      <h1 className="text-black font-bold text-3xl underline underline-offset-8">
        {title}
      </h1>
      {!boards.length && (
        <div className="text-black mt-16 text-xl">
          No boards.{" "}
          <a href="/boards/create" className="underline ">
            Click here to create a board.
          </a>
        </div>
      )}
      {boards?.map &&
        boards?.map(({ boardName, id }, index) => (
          <a href={`./boards/${id}`} key={`board-${index}`}>
            <div className="p-10 text-2xl bg-black text-white">{boardName}</div>
          </a>
        ))}
    </div>
  );
}
