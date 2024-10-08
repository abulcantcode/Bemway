"use client";
import classNames from "classnames";
import React, { useState } from "react";
import { FiEdit, FiSave, FiXCircle } from "react-icons/fi";
import BackendRequest from "@/utils/backend";
import { useRouter } from "next/navigation";

const BoardItem = ({
  id,
  boardName,
  isOwner,
}: {
  id: string;
  boardName: string;
  isOwner: boolean;
}) => {
  const { refresh } = useRouter();
  const [isEditMode, setEditMode] = useState(false);
  const [name, setName] = useState(boardName);

  const handleUpdate = async () => {
    //setSubmitting(true);

    try {
      const response = await BackendRequest.post("board/updateNames", {
        id,
        name,
      });
      if (response.status === 200 && response.statusText === "OK") {
        console.log("Board name updated successfully");
        //setError(false);
        setEditMode(!isEditMode);
        refresh();
      } else {
        console.error("Board create failed");
        //setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      //setError(true);
      setEditMode(!isEditMode);
    }
  };

  return (
    <a href={`./board/${id}`}>
      <div className='p-10 text-2xl bg-black dark:text-white text-black flex flex-col-reverse md:flex-row justify-between md:items-center bg-opacity-20'>
        <div className='flex items-center'>
          {isEditMode ? (
            <input
              value={name}
              onClick={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className='bg-transparent dark:border-white border-black border-solid border-2 rounded-md'
            />
          ) : (
            <span>{boardName}</span>
          )}
          <div className='flex mx-2'>
            {isEditMode ? (
              <>
                <FiSave
                  className={classNames("ml-1", {
                    "cursor-not-allowed": name === boardName || !name,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    if (name !== boardName && !!name) {
                      handleUpdate();
                    }
                  }}
                />
                <FiXCircle
                  className='ml-1'
                  onClick={(e) => {
                    e.preventDefault();
                    setEditMode(!isEditMode);
                    setName(boardName);
                  }}
                />
              </>
            ) : (
              <FiEdit
                onClick={(e) => {
                  e.preventDefault();
                  setEditMode(!isEditMode);
                }}
              />
            )}
          </div>
        </div>
        <div
          className={classNames(
            "bg-red-500 px-2 py-1 rounded-md text-sm font-bold w-fit md:ml-4 md:mb-0 mb-4",
            { invisible: !isOwner }
          )}
        >
          Owner
        </div>
      </div>
    </a>
  );
};

export default BoardItem;
