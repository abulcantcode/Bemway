import BoardList from "@/components/Board/BoardList";
import { cookies } from "next/headers";

const getData = async (
  userId?: string
): Promise<{
  owner: {
    id: string;
    boardName: string;
  }[];
  all: {
    id: string;
    boardName: string;
  }[];
}> => {
  if (!userId) {
    return { owner: [], all: [] };
  }
  // Fetch data from your backend API
  try {
    // const response = await fetch(`http://localhost:8080/board/userId/${userId}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     userId,
    //   }),
    // });

    const response = await fetch(`http://localhost:8080/board/user/${userId}`);

    if (response.ok) {
      // Handle success, e.g., show a success message
      const data = await response.json();

      // Pass the data to the page component
      return data;
    } else {
      console.error("Board get failed");
      // Handle failure, e.g., show an error message
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle error, e.g., show an error message
  }

  return { owner: [], all: [] };
};

export default async function Boards() {
  const userId = cookies().get("userId")?.value;
  console.log(userId);

  const data = await getData(userId);
  // console.log(data);
  return (
    <>
      <BoardList boards={data.owner} title='Owner' />
      <BoardList boards={data.all} title='All' />
    </>
  );
}
