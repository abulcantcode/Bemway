import ServerBackendRequest from "@/utils/serverBackend";
import ImpersonateUser from "./_impersonateUser";
import { cookies } from "next/headers";

export default async function ImpersonateUserPage() {
  const allUsers = (
    await ServerBackendRequest(cookies).get("http://localhost:8080/user")
  ).data;
  return (
    <>
      {allUsers.map(
        (
          props: {
            firstName: string;
            lastName: string;
            id: string;
            userName: string | null;
          },
          index: number
        ) => (
          <ImpersonateUser {...props} key={`user-to-impersonate-${index}`} />
        )
      )}
    </>
  );
}
