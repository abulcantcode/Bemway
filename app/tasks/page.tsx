import { TTask } from "@/components/Task";
import TaskGroup from "@/components/TaskGroup";

const tasks: TTask[] = [
  {
    title: "Car fix",
    description: "fix the car",
    status: "Not started",
    owners: [
      { firstName: "Abul", lastName: "Ch", userId: "1" },
      { firstName: "Sabir", lastName: "Ch", userId: "2" },
    ],
  },
  {
    title: "Tidy Room",
    description: "Do laundry and vacuum",
    status: "Blocked",
  },
  {
    title: "Go home",
    description: "ignore if already home",
    status: "In-progress",
    owners: [{ firstName: "Sabir", lastName: "Ch", userId: "1" }],
  },
  {
    title: "Grow taller",
    description: "keep going up!",
    status: "Done",
    owners: [{ firstName: "Abul", lastName: "Ch", userId: "1" }],
  },
];

export default function tasksPage() {
  return (
    <main className="bg-neutral-700">
      <h1 className="ml-8 py-8 text-4xl">Tasks</h1>
      <div className="flex p-8 bg-emerald-900 gap-8 w-full overflow-y-auto">
        <TaskGroup tasks={tasks} />
        <TaskGroup tasks={tasks} status="Not started" />
        <TaskGroup tasks={tasks} status="In-progress" />
        <TaskGroup tasks={tasks} status="Blocked" />
        <TaskGroup tasks={tasks} status="Done" />
      </div>
    </main>
  );
}
