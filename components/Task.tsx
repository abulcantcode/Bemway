import { TBoardData } from "@/server/routes/board/board";

// export interface TTask {
//   id: string;
//   due: Date | null;
//   created: Date;
//   stageId: string;
//   updated: Date;
//   dueStart: Date | null;
//   taskName: string | null;
//   description: string | null;
//   taskPriority: null;
//   creatorUserId: string;
//   userBoardTask?: [
//     {
//       id: string;
//       taskId: string;
//       created: Date;
//       updated: Date;
//       userBoard: {
//         id: string;
//         user: {
//           id: string;
//           created: Date;
//           updated: Date;
//           lastName: string | null;
//           userName: string | null;
//           firstName: string | null;
//         };
//         userId: string;
//         boardId: string;
//         created: Date;
//         updated: Date;
//         privileges: "READ_ONLY" | "LOCAL_EDIT" | "GLOBAL_EDIT";
//       };
//       userBoardId: string;
//       assigneeUserId: string;
//     }
//   ];
// }

// TODO: get types from DB

export default function Task({
  taskName,
  description,
  due,
  dueStart,
  taskPriority,
  userBoardTask,
}: TBoardData["stage"][0]["task"][0]) {
  return (
    <div className="bg-slate-800 rounded-md shadow-lg flex flex-col gap-2 p-4 m-4 w-60">
      <h4>{taskName}</h4>
      <hr />
      <p>{description}</p>
      {/* <p>{status}</p> */}
      <p>{due?.toString()}</p>
      <p>{dueStart?.toString()}</p>
      <p>{taskPriority}</p>
      <div className="flex gap-2">
        {userBoardTask?.map(({ userBoard }, idx) => (
          <div
            className="rounded-full h-10 w-10 text-center flex items-center justify-center"
            key={`${idx}-owner`}
            style={{ backgroundColor: "#345678" }}
          >
            <p>{userBoard?.user?.firstName?.charAt(0).toUpperCase()}</p>
            <p>{userBoard?.user?.lastName?.charAt(0).toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
