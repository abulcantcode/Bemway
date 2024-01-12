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
          className="bg-slate-800 rounded-md shadow-lg flex flex-col gap-2 p-4 m-4 w-60"
          {...provided?.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4>{taskName}</h4>
          <hr />
          <p>{description}</p>
          {/* <p>{status}</p> */}
          <p>{due?.toString()}</p>
          <p>{dueStart?.toString()}</p>
          <p>{taskPriority}</p>
          <div className="flex gap-2">
            {userBoardTask?.map(({ userBoard }, idx) => (
              <UserProfile
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
