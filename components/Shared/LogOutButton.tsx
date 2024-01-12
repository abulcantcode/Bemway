"use client";

import BackendRequest from "@/utils/backend";
import classNames from "classnames";
import { redirect, usePathname, useRouter } from "next/navigation";
import { LogOut } from "react-feather";

export default function LogOutButton() {
  // have code in here to hide on auth and login page, and redirect
  const { refresh, replace } = useRouter();
  const router = usePathname();
  const isLoggedOut = ["/", "/auth"].some(
    (path) => path.toLowerCase() === router.toLowerCase()
  );
  return (
    <div
      className={classNames(
        "h-12 w-12 mt-2 mr-2 rounded-full cursor-pointer flex justify-center items-center text-red-400",
        "dark:bg-red-950 duration-500 hover:text-white bg-white hover:bg-red-400 dark:hover:bg-red-400",
        { hidden: isLoggedOut }
      )}
      onClick={async () => {
        BackendRequest.get("logout")
          .then((res) => {
            if (res.statusText === "OK") {
              replace("/auth");
            } else {
              refresh();
            }
          })
          .catch((error) => {
            console.error(error);
            refresh();
          });
      }}
    >
      <LogOut />
    </div>
  );
}
