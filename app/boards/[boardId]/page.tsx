import Task, { TTask } from "@/components/Task";
import TaskGroup from "@/components/TaskGroup";

type TBoard = {
  id: string;
  boardName: string;
  ownerId: string;
  created: Date;
  updated: Date;
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

  console.log(res);

  return (
    <main className="bg-neutral-700">
      <h1 className="ml-8 py-8 text-4xl">{res.boardName}</h1>
      <div className="flex p-8 bg-emerald-900 gap-8 w-full overflow-y-auto">
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
