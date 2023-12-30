"use client";

import { useRouter } from "next/navigation";
import { TBoard } from "./page";
import { useState } from "react";

export default function CreateTask({
  userId,
  boardId,
  boardData,
}: {
  boardId: string;
  boardData: TBoard;
  userId: string;
}) {
  const [title, setTitle] = useState("");
  const [stage, setStage] = useState("select");
  const [assignee, setAssignee] = useState("select");

  const { refresh } = useRouter();
  console.log("this the cookie", document.cookie);

  const postTask = async () => {
    await fetch(`http://localhost:8080/task`, {
      body: JSON.stringify({
        taskName: title,
        creatorUserId: userId,
        stageId: stage,
        userBoardId: assignee,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log("this ran", "target.value");
    refresh();
  };
  return (
    <div className='ml-8 cursor-pointer bg-white text-black font-bold text-xl p-2 rounded-md w-fit mb-4'>
      <label>
        Task Name:{" "}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></input>
      </label>
      <label>
        Stage:{" "}
        <select value={stage} onChange={({ target }) => setStage(target.value)}>
          <option disabled value='select'>
            {" "}
            -- select an option --{" "}
          </option>
          {boardData.stage.map(({ stageName, id }, index) => (
            <option value={id} key={`stage-option-${index}`}>
              {stageName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Assignee:{" "}
        <select
          value={assignee}
          onChange={({ target }) => setAssignee(target.value)}
        >
          <option disabled value='select'>
            {" "}
            -- select an option --{" "}
          </option>
          {boardData.users.map(({ id, user }, index) => (
            <option value={id} key={`user-option-${index}`}>
              {user.firstName + " " + user.lastName}
            </option>
          ))}
        </select>
      </label>

      <button
        disabled={!title || stage === "select" || assignee === "select"}
        className={
          ((!title || stage === "select" || assignee === "select") &&
            "opacity-70") ||
          ""
        }
        onClick={postTask}
      >
        Submit
      </button>
    </div>
  );
}
