"use client";

import BackendRequest from "@/utils/backend";
import fetch from "isomorphic-fetch";

export default function ImpersonateUser({
  firstName,
  lastName,
  id,
  userName,
}: {
  firstName: string;
  lastName: string;
  id: string;
  userName: string | null;
}) {
  return (
    <div
      className="flex gap-4 p-8 m-4 bg-white text-black rounded-xl cursor-pointer"
      onClick={async () => {
        const res = await BackendRequest.get(`user/${id}`);
        console.log(res, res.status);
        const message = res.data;
        console.log(message);
        // console.log(document.cookie);
      }}
    >
      <p className="text-xl">{userName}</p>
      <p>{firstName}</p>
      <p>{lastName}</p>
    </div>
  );
}
