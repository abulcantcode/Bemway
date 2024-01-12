import { TBoardData } from "@/server/routes/board";
import UserProfile from "../../User/UserProfile";
import { Draggable } from "react-beautiful-dnd";

export default function Task({
  taskName,
  description,
  due,
  dueStart,
  taskPriority,
  userBoardTask,
  id,
  index,
}: TBoardData["stage"][0]["task"][0] & { index: number }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided?.innerRef}
          className="text-sm dark:bg-neutral-900 bg-zinc-200 rounded-[5px] shadow-lg flex flex-col gap-2 p-4 mx-2 mt-2 dark:text-white text-black opacity-90"
          {...provided?.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4
            lang="de"
            className="hyphens-auto overflow-clip max-w-[302px] font-semibold"
          >
            {taskName}
          </h4>
          <hr className="dark:border-slate-500 border-slate-900" />
          <p>{description} </p>
          {/* <p>{status}</p> */}
          <p>{due?.toString()}</p>
          {dueStart && <p>{dueStart?.toString()}</p>}
          {taskPriority && <p>{taskPriority}</p>}
          <div className="flex gap-2">
            {userBoardTask?.map(({ userBoard }, idx) => (
              <UserProfile
                size="sm"
                firstName={userBoard?.user?.firstName}
                lastName={userBoard?.user?.lastName}
                profile={userBoard?.user?.profile}
                key={`${idx}-owner`}
              />
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
}
