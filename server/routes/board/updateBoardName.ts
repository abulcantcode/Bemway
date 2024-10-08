import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";

export default function updateBoardName(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/board/updateNames",
    validateSession(async (req, res) => {
      try {
        const { id, name } = req.body;
        console.log("test");
        await pool.query(
          `
UPDATE "board"
SET "boardName" = $2
WHERE "id" = $1
`,
          [id, name]
        );
        res.status(200).send({ message: "Successfully updated board name" });
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
