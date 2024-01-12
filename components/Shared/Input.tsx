"use client";

import classNames from "classnames";
import {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";

interface TInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement> & {
    textColor?: string;
    overrideClass?: string;
  };
  errorProps?: HTMLAttributes<HTMLParagraphElement>;
  error?: string;
  errorByName?: Record<string, string>;
}

export default function Input({
  label,
  error,
  errorByName,
  name,
  labelProps,
  errorProps,
  ...props
}: TInput) {
  const inputError = (name && errorByName?.[name]) || error;
  return (
    <label
      {...labelProps}
      className={classNames(
        labelProps?.overrideClass || "flex text-sm font-bold flex-col",
        {
          "text-red-500": inputError,
          [labelProps?.textColor || "text-gray-700"]: !inputError,
        },
        labelProps?.className
      )}
    >
      {label}
      <input
        type="text"
        {...props}
        className={classNames(
          "appearance-none border rounded py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-normal",
          { "border-red-500 outline-red-500": !!inputError },
          props.className
        )}
        name={name}
      />{" "}
      <p
        className="text-red-500 text-xs font-medium min-h-[16px]"
        {...errorProps}
      >
        {inputError}
      </p>
    </label>
  );
}
