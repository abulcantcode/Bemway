"use client";

import { useRouter } from "next/navigation";

export default function InviteUser({
  boardId,
  allUsers,
}: {
  boardId: string;
  allUsers: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}) {
  const { refresh } = useRouter();

  return (
    <select
      className="ml-8 cursor-pointer bg-white text-black font-bold text-xl p-2 rounded-md w-fit mb-4"
      defaultValue={"select"}
      onChange={async ({ target }) => {
        await fetch(`http://localhost:8080/board/invite`, {
          body: JSON.stringify({
            userId: target.value,
            boardId: boardId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        console.log("this ran", target.value);
        refresh();
      }}
    >
      {" "}
      <option disabled value="select">
        {" "}
        -- select an option --{" "}
      </option>
      {allUsers.map(({ id, firstName, lastName }, index) => (
        <option value={id} key={`inviteUser-${index}`}>
          {firstName} {lastName}
        </option>
      ))}
    </select>
  );
}
