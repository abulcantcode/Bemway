import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "default";
}

export default function Button({
  children,
  className,
  size = "md",
  theme = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        className,
        "rounded focus:outline-none focus:shadow-outline flex justify-center items-center",
        {
          "cursor-not-allowed": props?.disabled,
          "text-sm px-2 py-1": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-4 text-xl": size === "lg",
          "px-6 py-4 text-2xl": size === "xl",
          "bg-gray-800 text-white rounded": theme === "default",
          "hover:bg-gray-700": !props?.disabled && theme === "default",
        }
      )}
    >
      {children}
    </button>
  );
}
