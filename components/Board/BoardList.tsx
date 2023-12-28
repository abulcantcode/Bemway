export default function BoardList({
  boards,
}: {
  boards: { boardName: string; id: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 p-16 bg-white">
      {boards?.map &&
        boards?.map(({ boardName, id }, index) => (
          <a href={`./boards/${id}`} key={`board-${index}`}>
            <div className="p-10 text-2xl bg-black text-white">{boardName}</div>
          </a>
        ))}
    </div>
  );
}
