import BoardList from "@/components/Board/BoardList";
import CreateBoardForm from "@/components/Board/CreateBoardForm";
import ServerBackendRequest from "@/utils/serverBackend";
import { cookies } from "next/headers";
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
    <>
      <BoardList boards={data.boards} title="My boards" />
    </>
  );
}
