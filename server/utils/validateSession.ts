import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./sessions";
import removeClientSession from "./removeClientSession";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";

const validateSession =
  (
    pipe: (
      req: Request,
      res: Response
    ) =>
      | void
      | Response<any, Record<string, any>>
      | Promise<Response<any, Record<string, any>> | void | undefined>
      | undefined
  ) =>
  async (req: Request, res: Response) => {
    // Check if a user is logged in based on your session setup
    // console.log(
    //   "THIS IS MIDDLEWARE",
    //   req.cookies,
    //   "HERE IS SESSION",
    //   req.session,
    //   req.session?.cookie?.expires,
    //   new Date(),
    //   req.session?.cookie?.expires > new Date()
    // );

    if (checkSessionValid(req)) return pipe(req, res);

    console.error("User not valid");
    // User is not authenticated, send an unauthorized response

    // return pipe(req, res);
    removeClientSession(res);
    return res.status(401).send({ error: "Unauthorized" });
    // next();
    // res.redirect("/asadsad");
  };

export default validateSession;

export const checkSessionValid = (req: any) => {
  if (req?.session && req?.session?.cookie?.expires) {
    if (
      (req as CustomRequest).session?.userId &&
      (req as CustomRequest).session?.loggedIn &&
      (req as CustomRequest).session?.valid &&
      req.session?.cookie?.expires > new Date()
    ) {
      return true;
    }
  }
  return false;
};

// export const validateSocketConnection = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>{
//   const timer = setInterval(() => {
//     socket?.request?.session?.reload((err) => {
//       if (err) {
//         // forces the client to reconnect
//         socket.conn.close();
//         // you can also use socket.disconnect(), but in that case the client
//         // will not try to reconnect
//       }
//     });
//   }, SESSION_RELOAD_INTERVAL);

// }
