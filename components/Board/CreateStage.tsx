"use client";

import { Columns, Plus } from "react-feather";
import Button from "../Shared/Button";
import { useState } from "react";
import Modal from "../Shared/Modal";
import Input from "../Shared/Input";
import { useRouter } from "next/navigation";
import BackendRequest from "@/utils/backend";

export default function CreateStage({ boardId }: { boardId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stageName, setStageName] = useState("");
  const { refresh } = useRouter();

  const createStage = async () => {
    try {
      const response = await BackendRequest.post("stage", {
        stageName,
        boardId,
      });
      if (response?.statusText === "OK") {
        setStageName("");
        refresh();
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Button className="mt-8 h-[100px] mr-60" onClick={() => setIsOpen(true)}>
        <div className="w-[272px] flex  justify-center items-center">
          <Plus size={16} />
          <Columns className="mr-2" />
          Create New Stage
        </div>
      </Button>
      {isOpen && (
        <Modal
          modalTitle="Create a New Stage"
          closeModal={() => {
            setStageName("");
            setIsOpen(false);
          }}
          size="sm"
        >
          <Input
            label="Stage Name"
            labelProps={{ className: "mt-4" }}
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            placeholder="Enter the new stage name"
          />
          <Button className="mt-4" disabled={!stageName} onClick={createStage}>
            Create Stage
          </Button>
        </Modal>
      )}
    </>
  );
}
