"use client";

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
        const res = await fetch(`http://localhost:8080/user/${id}`, {
          credentials: "include",
        });
        console.log(res, res.status);
        const message = await res.text();
        console.log(message);
        console.log(document.cookie);
      }}
    >
      <p className="text-xl">{userName}</p>
      <p>{firstName}</p>
      <p>{lastName}</p>
    </div>
  );
}
