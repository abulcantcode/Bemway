"use client";

import { LogOut } from "react-feather";

export default function LogOutButton() {
  // have code in here to hide on auth and login page, and redirect
  return (
    <div className="h-12 w-12 mt-2 mr-2 rounded-full cursor-pointer flex justify-center items-center text-red-400 dark:bg-red-950 duration-500 hover:text-white bg-white hover:bg-red-400 dark:hover:bg-red-400">
      <LogOut />
    </div>
  );
}
