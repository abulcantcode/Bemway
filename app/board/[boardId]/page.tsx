import Board from "@/components/Board";
import { TBoardData } from "@/server/routes/board";
import ServerBackendRequest from "@/utils/serverBackend";
import { cookies } from "next/headers";

export default async function tasksPage({
  params,
}: {
  params: { boardId: string };
}) {
  const res: TBoardData = (
    await ServerBackendRequest(cookies).get(`board/${params.boardId}`)
  ).data;

  return (
    <main className="bg-neutral-700">
      <Board res={res} boardId={params.boardId} />
    </main>
  );
}
