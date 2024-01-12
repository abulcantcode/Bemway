"use client";

import Modal from "@/components/Shared/Modal";
import BackendRequest from "@/utils/backend";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../Shared/Input";
import Button from "../Shared/Button";
import { Plus, User, UserPlus } from "react-feather";
import classNames from "classnames";

export default function InviteUserModal({
  boardId,
  refetchBoardInfo,
}: {
  boardId: string;
  refetchBoardInfo: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [errorByName, setErrorByName] = useState<Record<string, string>>({});

  return (
    <>
      {isOpen && (
        <Modal
          modalTitle="Invite a User to Collaborate on this Board"
          closeModal={() => {
            setEmail("");
            setErrorByName({});
            setSuccessEmail("");
            setIsSubmitting(false);
            setIsOpen(false);
          }}
        >
          {" "}
          <Input
            disabled={isSubmitting}
            label="Email"
            labelProps={{ className: "text-xl mt-8 mb-2 px-8" }}
            placeholder="Enter the email of the user you wish to invite"
            value={email}
            name="email"
            errorByName={errorByName}
            onChange={(e) => setEmail(e.target.value)}
            errorProps={{ className: " text-base h-[30px]" }}
          />
          <p
            className={classNames(
              "text-lg text-green-600 font-bold mb-4 w-3/4 mx-auto text-center",
              {
                invisible: !successEmail,
              }
            )}
          >
            {`${successEmail} has successfully been invited!`}
          </p>
          <Button
            disabled={isSubmitting}
            type="button"
            size="lg"
            // className="px-4 py-3 text-xl rounded-lg bg-orange-700 text-white font-bold"
            onClick={async () => {
              setIsSubmitting(true);
              try {
                const response = await BackendRequest.post(`board/invite`, {
                  email,
                  boardId,
                });
                if (response.statusText === "OK") {
                  setEmail((prev) => {
                    setSuccessEmail(prev);
                    return "";
                  });

                  setErrorByName({});
                  await refetchBoardInfo();
                } else {
                  setSuccessEmail("");
                }
              } catch (error: any) {
                console.log("error", error, error?.response);
                if (error?.response) {
                  setErrorByName(error?.response?.data);
                  setSuccessEmail("");
                }
              }
              setIsSubmitting(false);
            }}
          >
            <User className="mr-2" /> Invite user
          </Button>
        </Modal>
      )}
      <Button
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus />
        Invite User
      </Button>
    </>
  );
}
