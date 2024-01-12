"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { Moon, Sun } from "react-feather";
import "./ThemeToggle.css";

type Theme = "light" | "dark";

function ThemeToggle({ initialValue }: { initialValue: Theme }) {
  const [theme, setTheme] = useState(initialValue);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;`;
      const bodyClass = `${document
        ?.querySelector("body")
        ?.getAttribute("class")
        ?.split(" ")
        .filter((prevClass) => prevClass !== "light" && prevClass !== "dark")
        .join(" ")} ${theme}`;

      document?.querySelector("body")?.setAttribute("class", bodyClass);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }
  }, [theme]);

  return (
    <div
      className={classNames("cursor-pointer opacity-0 duration-500", {
        "opacity-100": enabled,
      })}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="h-12 w-12 mt-2 mr-2 rounded-full overflow-clip relative">
        <div className="moonTheme absolute bg-black hover:bg-neutral-900 rounded-full w-full h-full flex items-center justify-center dark:z-10">
          <Moon size={28} />
        </div>{" "}
        <div
          className={classNames(
            "sunTheme h-full w-full bg-white rounded-full hover:bg-yellow-50",
            "absolute flex items-center justify-center text-yellow-300"
          )}
        >
          <Sun size={30} />
        </div>
      </div>
    </div>
  );
}

export default ThemeToggle;
