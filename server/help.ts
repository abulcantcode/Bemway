// // app/sessions.js
// import { createSessionStorage, redirect } from "@remix-run/node";
// import { v4 as uuid } from "uuid";
// import type {
//   AgencyMode,
//   AgencyType,
//   Feature,
//   Permission,
//   Role,
//   Status,
// } from "~/utils/db.server";
// import db from "~/utils/db.server";
// import { addDays } from "./dates";

// // TODO: improve handling of session secrets and use something other than a hardcoded string.
// // const sessionSecret = process?.env?.SESSION_SECRET || "mySecret";
// const sessionSecret = "mySecret";

// export interface Session {
//   userId: string;
//   role: Role;
//   firstName: string;
//   lastName: string;
//   email: string;
//   username?: string;
//   onboardingModalComplete: boolean;
//   usedLearningPath: boolean;
//   features: Array<Feature>;
//   agency: {
//     id: string;
//     shortId: string;
//     name: string;
//     status: Status;
//     agencyType: AgencyType;
//     remainingLessons: number;
//     stripeCustomerId: string | null;
//     mode: AgencyMode;
//     currency: string;
//   };
//   permissions: Array<Permission>;
//   timezone: string;
// }

// function createDatabaseSessionStorage({ cookie }) {
//   return createSessionStorage({
//     cookie,
//     async createData(data) {
//       const newSession = await db.session.create({
//         data: {
//           expiresAt: addDays(new Date(), 60),
//           userId: data.userId,
//           publicData: JSON.stringify(data),
//           handle: uuid(),
//         },
//       });
//       return newSession.id;
//     },
//     async readData(id) {
//       const foundSession = await db.session.findFirst({ where: { id } });
//       if (foundSession) {
//         return JSON.parse(foundSession.publicData as string);
//       }
//       return null;
//     },
//     async updateData(id, data) {
//       await db.session.update({
//         where: { id },
//         data: {
//           publicData: JSON.stringify(data),
//           expiresAt: addDays(new Date(), 60),
//         },
//       });
//     },
//     async deleteData(id) {
//       await db.session.delete({ where: { id } });
//     },
//   });
// }

// const { getSession, commitSession, destroySession } =
//   createDatabaseSessionStorage({
//     cookie: {
//       name: "__session",
//       secrets: [sessionSecret],
//       path: "/",
//       sameSite: "lax",
//       expires: addDays(new Date(), 90),
//     },
//   });

// export const getUserSession = async (request: Request) => {
//   const session = await getSession(request.headers.get("Cookie"));
//   return session.data;
// };

// export const createUserSession = async (data: Session, redirectTo: string) => {
//   let session = await getSession();
//   Object.entries(data).map(([key, value]) => session.set(key, value));
//   return redirect(redirectTo, {
//     headers: { "Set-Cookie": await commitSession(session) },
//   });
// };

// export { getSession, commitSession, destroySession };
