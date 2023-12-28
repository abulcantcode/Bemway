import { GetServerSideProps } from "next";
import BoardList from "@/components/Board/BoardList";

export const getData = async (
  userId: string
): Promise<
  {
    id: string;
    boardName: string;
  }[]
> => {
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
      const data: { id: string; boardName: string }[] = await response.json();

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

  return [];
};

export default async function Boards() {
  const data = await getData("42b64d23-bbd8-470f-a8fa-450dec2ca6c9");
  console.log(data);
  return <BoardList boards={data} />;
}
