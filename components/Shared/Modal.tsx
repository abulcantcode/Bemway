"use client";

import classNames from "classnames";
import { Attributes, HTMLAttributes, ReactNode, useEffect } from "react";
import { X } from "react-feather";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  modalTitle?: ReactNode;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeModal: () => void;
}

export default function Modal({
  modalTitle,
  closeModal,
  size = "md",
  children,
}: ModalProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prevOverflow = document.body.style.overflowY;
      document.body.style.overflowY = "hidden";
      return () => {
        document.body.style.overflowY = prevOverflow;
      };
    }
  }, []);
  return (
    <>
      <div className="bg-black opacity-70 inset-0 fixed z-[999]"></div>
      <div
        className="inset-0 fixed z-[1000] flex flex-col items-center justify-evenly text-black overflow-auto"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        }}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={classNames(
            "flex flex-col bg-neutral-100 max-w-full min-w-fit relative rounded-lg pt-12",
            {
              "w-1/3 p-6": size === "sm",
              "w-1/2 p-8": size === "md",
              "w-3/5 p-10": size === "lg",
              "w-3/4 p-10": size === "xl",
            }
          )}
        >
          <button
            className="absolute top-1 right-1"
            onClick={() => closeModal()}
          >
            <X height={36} width={36} />
          </button>
          {modalTitle && (
            <>
              <h1 className="text-4xl">{modalTitle}</h1>
              <hr className="w-full my-2 border-2" />
            </>
          )}

          {children}
        </div>
        <div />
      </div>
    </>
  );
}
