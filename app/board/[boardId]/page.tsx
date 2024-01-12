import Board from "@/components/Board";
import { TBoardData } from "@/server/routes/board";
import ServerBackendRequest from "@/utils/serverBackend";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function tasksPage({
  params,
}: {
  params: { boardId: string };
}) {
  const res: TBoardData = (
    await ServerBackendRequest(cookies).get(`board/${params.boardId}`)
  ).data;

  return (
    <main className="">
      <div className="fixed -z-40 dark:opacity-0 opacity-100 bg-white duration-500 ">
        <Image
          src={"/bg-light.jpg"}
          alt="background image"
          width={3840}
          height={2400}
          className="object-cover h-screen w-screen object-top opacity-30"
        />
      </div>
      <div className="fixed -z-40 dark:opacity-100 opacity-0 duration-500 bg-black">
        <Image
          src={"/bg-dark.png"}
          alt="background image"
          width={3840}
          height={2400}
          className="object-cover h-screen w-screen object-top opacity-30"
        />
      </div>
      <Board res={res} boardId={params.boardId} />
    </main>
  );
}
