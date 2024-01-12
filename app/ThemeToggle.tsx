"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function ThemeToggle({ initialValue }: { initialValue: Theme }) {
  const [theme, setTheme] = useState(initialValue);

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
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      Toggle Theme
    </button>
  );
}

export default ThemeToggle;
