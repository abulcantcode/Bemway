import { TBoardData } from "@/server/routes/board";
import Task from "./Task";
import Droppable from "@/components/Shared/Droppable";
import { Draggable } from "react-beautiful-dnd";

interface TTaskGroup {
  tasks: TBoardData["stage"][0]["task"];
  title: string | null;
  id: string;
  stageOrder: number;
}

export default function TaskGroup({
  tasks,
  title,
  id,
  stageOrder,
}: TTaskGroup) {
  return (
    <Draggable draggableId={id} index={stageOrder}>
      {(provided) => (
        <div
          {...provided?.draggableProps}
          {...provided?.dragHandleProps}
          ref={provided?.innerRef}
        >
          <Droppable droppableId={id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided?.innerRef}
                className="flex flex-col bg-gray-500 p-4 pt-10 rounded-md relative h-full mr-8"
                {...provided?.droppableProps}
              >
                <h3 className="absolute top-0 mx-2 mt-4">{title}</h3>
                <div className="w-[272px]" />
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
