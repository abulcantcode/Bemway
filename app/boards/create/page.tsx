import CreateBoardForm from "@/components/Board/CreateBoardForm";
import { cookies } from "next/headers";

export default function CreateBoard() {
  const userId = cookies().get("userId")?.value || "";

  return <CreateBoardForm userId={userId} />;
}
