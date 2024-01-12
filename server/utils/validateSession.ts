import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./sessions";
import removeClientSession from "./removeClientSession";

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
    if (req.session && req.session?.cookie?.expires) {
      // console.log(
      //   "THIS IS MIDDLEWARE",
      //   req.cookies,
      //   "HERE IS SESSION",
      //   req.session,
      //   req.session?.cookie?.expires,
      //   new Date(),
      //   req.session?.cookie?.expires > new Date()
      // );
      if (
        (req as CustomRequest).session?.userId &&
        (req as CustomRequest).session?.loggedIn &&
        (req as CustomRequest).session?.valid &&
        req.session?.cookie?.expires > new Date()
      ) {
        return pipe(req, res);
      }
      // User is authenticated, proceed to the next middleware or route
    }
    console.error("User not valid");
    // User is not authenticated, send an unauthorized response

    // return pipe(req, res);
    removeClientSession(res);
    return res.status(401).send({ error: "Unauthorized" });
    // next();
    // res.redirect("/asadsad");
  };

export default validateSession;
