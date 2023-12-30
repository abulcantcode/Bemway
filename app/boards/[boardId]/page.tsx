import Task, { TTask } from "@/components/Task";
import TaskGroup from "@/components/TaskGroup";
import InviteUser from "./_inviteUser";
import CreateTask from "./_createTask";
import { cookies } from "next/headers";

export type TBoard = {
  id: string;
  boardName: string;
  ownerId: string;
  created: Date;
  updated: Date;
  users: {
    id: string;
    user: {
      id: string;
      created: Date;
      updated: Date;
      lastName: string;
      userName: string | null;
      firstName: string;
    };
    userId: string;
    boardId: string;
    created: Date;
    updated: Date;
    privileges: "READ_ONLY" | "LOCAL_EDIT" | "GLOBAL_EDIT";
  }[];
  stage: {
    id: string;
    task: TTask[];
    boardId: string;
    created: Date;
    updated: Date;
    stageName: string;
  }[];
};

// const tasks: TTask[] = [
//   {
//     title: "Car fix",
//     description: "fix the car",
//     status: "Not started",
//     owners: [
//       { firstName: "Abul", lastName: "Ch", userId: "1" },
//       { firstName: "Sabir", lastName: "Ch", userId: "2" },
//     ],
//   },
//   {
//     title: "Tidy Room",
//     description: "Do laundry and vacuum",
//     status: "Blocked",
//   },
//   {
//     title: "Go home",
//     description: "ignore if already home",
//     status: "In-progress",
//     owners: [{ firstName: "Sabir", lastName: "Ch", userId: "1" }],
//   },
//   {
//     title: "Grow taller",
//     description: "keep going up!",
//     status: "Done",
//     owners: [{ firstName: "Abul", lastName: "Ch", userId: "1" }],
//   },
// ];

export default async function tasksPage({
  params,
}: {
  params: { boardId: string };
}) {
  const [res]: TBoard[] = await (
    await fetch(`http://localhost:8080/board/${params.boardId}`)
  ).json();
  const allUsers = await (await fetch("http://localhost:8080/user")).json();
  const userId = cookies().get("userId")?.value;
  console.log(res);

  return (
    <main className='bg-neutral-700'>
      <h1 className='ml-8 py-8 text-4xl'>{res.boardName}</h1>
      <CreateTask
        boardId={params.boardId}
        boardData={res}
        userId={userId || ""}
      />
      <InviteUser boardId={params.boardId} allUsers={allUsers} />
      <div className='flex mb-4 ml-8 gap-2'>
        {res.users.map(({ user }, idx) => (
          <div
            key={`users-for-board-${idx}`}
            className='rounded-full h-10 w-10 text-center flex items-center justify-center'
            style={{ backgroundColor: "#345678" }}
          >
            <p>{user?.firstName?.charAt(0).toUpperCase()}</p>
            <p>{user?.lastName?.charAt(0).toUpperCase()}</p>
          </div>
        ))}
      </div>
      <div className='flex p-8 bg-emerald-900 gap-8 w-full overflow-y-auto'>
        {res?.stage?.map(({ stageName, task }, stageIndex) => (
          <TaskGroup
            key={`stage-${stageIndex}`}
            tasks={task}
            title={stageName}
          />
        ))}
        {/* <TaskGroup tasks={tasks} />
        <TaskGroup tasks={tasks} />
        <TaskGroup tasks={tasks} />
        <TaskGroup tasks={tasks} />
        <TaskGroup tasks={tasks} /> */}
      </div>
    </main>
  );
}
