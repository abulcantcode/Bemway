import classNames from "classnames";
import { HTMLAttributes, LabelHTMLAttributes } from "react";
import ReactSelect, { Props } from "react-select";

interface SelectProps extends Props {
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement> & {
    textColor?: string;
    overrideClass?: string;
  };
  errorProps?: HTMLAttributes<HTMLParagraphElement>;
  error?: string;
  errorByName?: Record<string, string>;
  valueFromOptions?: string[] | string;
}

export default function Select({
  label,
  error,
  errorByName,
  name,
  labelProps,
  valueFromOptions,
  errorProps,
  ...props
}: SelectProps) {
  const inputError = (name && errorByName?.[name]) || error;

  const optionValue = !props.isMulti
    ? props?.options?.find((opt: any) => opt?.value === valueFromOptions)
    : (valueFromOptions as string[])
        ?.map((val) => props?.options?.find((opt: any) => opt?.value === val))
        .filter((opts) => !!opts);

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
      <ReactSelect
        {...props}
        name={name}
        value={props.value || (valueFromOptions && optionValue) || undefined}
      />{" "}
      <p
        className="text-red-500 text-xs font-medium min-h-[16px]"
        {...errorProps}
      >
        {inputError}
      </p>{" "}
    </label>
  );
}
