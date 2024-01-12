"use client";
import BackendRequest from "@/utils/backend";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "../Shared/Modal";
import Button from "../Shared/Button";
import { Plus } from "react-feather";
import Input from "../Shared/Input";
import classNames from "classnames";

const CreateBoardForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    boardName: "",
  });

  const { refresh } = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const response = await BackendRequest.post("board", formData);

      if (response.status === 200 && response.statusText === "OK") {
        console.log("Board created successfully");
        setError(false);
        setFormData({ boardName: "" });
        refresh();
        setSubmitting(false);
        setIsOpen(false);
      } else {
        console.error("Board create failed");
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex gap-1">
        <Plus />
        Create a new board
      </Button>
      {isOpen && (
        <Modal
          modalTitle="Create a New Board"
          closeModal={() => {
            setFormData({
              boardName: "",
            });
            setSubmitting(false);
            setError(false);
            setIsOpen(false);
          }}
        >
          <div className="w-full flex flex-col items-center">
            <Input
              label="Board Name"
              type="text"
              name="boardName"
              labelProps={{ className: "w-full" }}
              value={formData.boardName}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <h3
              className={classNames("text-red-500 font-semibold text-sm", {
                invisible: !error,
              })}
            >
              Internal server error. Please try again.
            </h3>

            <Button
              disabled={!formData?.boardName || isSubmitting}
              className="mt-2 w-full flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Plus /> Create new board
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateBoardForm;
