import ImpersonateUser from "./_impersonateUser";

export default async function ImpersonateUserPage() {
  const allUsers = await (await fetch("http://localhost:8080/user")).json();
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
