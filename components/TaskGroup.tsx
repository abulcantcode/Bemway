import { TBoardData } from "@/server/routes/board/board";
import Task from "./Task";

interface TTaskGroup {
  tasks: TBoardData["stage"][0]["task"];
  title: string | null;
  // status?: TTask["status"];
}

// TODO: get types from DB

export default function TaskGroup({ tasks, title }: TTaskGroup) {
  console.log(tasks);
  return (
    <div className="flex flex-col bg-gray-500 p-4 gap-4 rounded-md">
      <h3>{title}</h3>
      {tasks
        // .filter((task) => (status ? task.status === status : true))
        .map((task, taskNo) => (
          <Task {...task} key={`task-no-${taskNo}`} />
        ))}
    </div>
  );
}
