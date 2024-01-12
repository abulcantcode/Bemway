"use client";

import Button from "@/components/Shared/Button";
import Input from "@/components/Shared/Input";
import Modal from "@/components/Shared/Modal";
import Select from "@/components/Shared/Select";
import { TBoardData } from "@/server/routes/board";
import BackendRequest from "@/utils/backend";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "react-feather";

export default function CreateTaskModal({
  boardData,
  refetchStage,
}: {
  boardData: TBoardData;
  refetchStage: ({ stageId }: { stageId: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [stage, setStage] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);

  const postTask = async () => {
    try {
      const response = await BackendRequest.post(`task`, {
        taskName: title,
        stageId: stage,
        assignees: assignees,
      });
      if (response?.statusText === "OK") {
        await refetchStage({ stageId: stage });
        setTitle("");
        setStage("");
        setAssignees([]);
        setOpenModal(false);
      }
    } catch (error: any) {
      console.error("Create task failed", error);
    }
  };

  return (
    <>
      {openModal && (
        <Modal
          modalTitle="Create a Task"
          closeModal={() => {
            setTitle("");
            setStage("");
            setAssignees([]);
            setOpenModal(false);
          }}
        >
          <div className="cursor-pointer bg-white text-black font-bold text-xl p-2 rounded-md w-[300px] md:w-[500px] mx-auto my-8">
            <Input
              label="Task"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <Select
              label="Stage"
              onChange={(e: any) => setStage(e?.value)}
              valueFromOptions={stage}
              options={boardData.stage.map(({ stageName, id }) => ({
                value: id,
                label: stageName,
              }))}
            />
            <Select
              label="Assignee(s)"
              isMulti
              onChange={(e: any) =>
                setAssignees(e.map((opt: any) => opt?.value))
              }
              labelProps={{ className: "max-w-full" }}
              options={boardData.users.map(({ id, user }, index) => ({
                value: id,
                label: user?.firstName + " " + user?.lastName,
              }))}
              valueFromOptions={assignees}
              maxMenuHeight={150}
            />
          </div>
          <Button
            disabled={!title || stage === ""}
            className={classNames("mt-4 w-full", {
              "opacity-70": !title || stage === "",
            })}
            onClick={postTask}
          >
            Submit
          </Button>
        </Modal>
      )}
      <Button onClick={() => setOpenModal(true)} className="flex gap-2">
        <Plus />
        Create task
      </Button>
    </>
  );
}
