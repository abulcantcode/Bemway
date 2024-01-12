import { TBoardData } from "@/server/routes/board";
import Task from "./Task";
import Droppable from "@/components/Shared/Droppable";
import { Draggable } from "react-beautiful-dnd";
import DragHandle from "@/components/Shared/DragHandleIcon";
import { profileClassNames } from "@/utils/profileColor";
import classNames from "classnames";

const generateNumberFromStr = (inputString: string) =>
  inputString
    .split("")
    .reduce((result, letter) => letter.charCodeAt(0) + result, 0);

interface TTaskGroup {
  tasks: TBoardData["stage"][0]["task"];
  title: string | null;
  id: string;
  stageOrder: number;
}

const stageBgColors = [
  "dark:bg-green-400 bg-emerald-800",
  "dark:bg-lime-400 bg-lime-800",
  "dark:bg-slate-400 bg-slate-800",
  "dark:bg-purple-400 bg-violet-900",
  "dark:bg-red-400 bg-red-800",
  "dark:bg-yellow-500 bg-yellow-800",
  "dark:bg-orange-400 bg-orange-800",
  "dark:bg-blue-400 bg-sky-800",
];

export default function TaskGroup({
  tasks,
  title,
  id,
  stageOrder,
}: TTaskGroup) {
  return (
    <Draggable draggableId={id} index={stageOrder}>
      {(provided) => (
        <div {...provided?.draggableProps} ref={provided?.innerRef}>
          <div
            className="h-5 bg-zinc-600 dark:bg-stone-400 fill-white dark:fill-black mr-4 flex justify-center items-center rounded-t-[4px] opacity-40"
            {...provided?.dragHandleProps}
          >
            <DragHandle height={10} />
          </div>
          <Droppable droppableId={id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided?.innerRef}
                className={classNames(
                  "flex flex-col shadow-sm dark:shadow-slate-900 shadow-gray-400 pt-8",
                  "rounded-b-[4px] relative h-full mr-4 dark:bg-opacity-10 bg-opacity-10",
                  stageBgColors?.[
                    generateNumberFromStr(title + "random") %
                      (stageBgColors.length - 1)
                  ]
                )}
                {...provided?.droppableProps}
              >
                <h3
                  lang="en"
                  className="absolute top-2 left-4 right-4 hyphens-auto overflow-clip whitespace-nowrap text-ellipsis dark:text-white text-black font-light"
                >
                  {title}
                </h3>
                <hr className="w-[350px] opacity-10 border-black mb-1" />
                {tasks
                  // .filter((task) => (status ? task.status === status : true))
                  .map((task, taskNo) => (
                    <Task {...task} key={`${task.id}`} index={task.order} />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
