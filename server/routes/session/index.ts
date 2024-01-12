import { Express } from "express";
import { CustomRequest } from "../../utils/sessions";
import removeClientSession from "../../utils/removeClientSession";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function checkSession(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get("/session", async (req, res) => {
    try {
      if (
        !!(req as CustomRequest).session.userId &&
        !!(req as CustomRequest).session.email &&
        (req as CustomRequest).session?.valid === true &&
        (req as CustomRequest).session?.loggedIn === true
      ) {
        console.log("ping session check OK!");
        // TODO: eventually check if the user is active here with a database query
        return res.sendStatus(200);
      } else {
        console.log("Remove current session variable");

        removeClientSession(res);
        return res.sendStatus(401);
      }
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  });

  //DELETE
}
