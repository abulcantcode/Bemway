import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { pool } from "../../db";
import { CustomRequest } from "../../utils/sessions";
import validateSession from "../../utils/validateSession";
import removeClientSession from "../../utils/removeClientSession";

export default function logout(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get(
    "/logout",
    validateSession((req, res) => {
      const sessionId = req.session.id;
      console.log("remove this: ", sessionId);
      req.session.destroy(() => {
        io.in(sessionId).disconnectSockets();
        removeClientSession(res);
        return res.status(204).end();
      });
    })
  );
}
