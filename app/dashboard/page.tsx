import BoardList from "@/components/Board/BoardList";
import CreateBoardForm from "@/components/Board/CreateBoardForm";
import ServerBackendRequest from "@/utils/serverBackend";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

const getData = async (): Promise<{
  boards: {
    id: string;
    ownerId: string;
    boardName: string;
    isOwner: boolean;
  }[];
}> => {
  try {
    const response = await ServerBackendRequest(cookies).get(`board/user`);

    if (response.statusText === "OK" && response.status === 200) {
      const data = response.data;

      return data;
    } else {
      if (response.status === 401) {
        redirect("/");
      }
      console.error("Board get failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  return { boards: [] };
};

export default async function Boards() {
  const data = await getData();

  return (
    <main>
      {" "}
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
      <BoardList boards={data.boards} title="My Boards" />
    </main>
  );
}
