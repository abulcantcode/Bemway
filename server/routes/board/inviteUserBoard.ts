import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import { getBoardSocket } from "../../utils/getSocketRoom";

export default function inviteUserBoard(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/board/invite",
    validateSession(async (req, res) => {
      const { email, boardId } = req.body;
      console.log("add user to board email:", email);
      try {
        const user = await pool.query<{ id: string }>(
          `
SELECT "id" FROM "user"
WHERE "user"."email" = $1
`,
          [email] // can later change do nothing to change the status of the connection ("ACTIVE" or "ARCHIVED")
        );

        if (user.rowCount === 0) {
          return res
            .status(400)
            .send({ email: "A user with this email does not exist." });
        }

        const data = await pool.query<{ id: string }>(
          `
INSERT INTO "userBoard" ("userId", "boardId")
VALUES ($1, $2)
ON CONFLICT ("userId", "boardId") DO NOTHING
RETURNING "id";
`,
          [user.rows[0].id, boardId] // can later change do nothing to change the status of the connection ("ACTIVE" or "ARCHIVED")
        );

        if (data.rowCount === 0) {
          const conflictUser = await pool.query(
            `
  SELECT * FROM "userBoard"
  WHERE "userId" = $1::uuid AND "boardId" = $2::uuid
  `,
            [user.rows[0].id, boardId] // can later change do nothing to change the status of the connection ("ACTIVE" or "ARCHIVED")
          );
          if (conflictUser.rowCount !== 0) {
            return res
              .status(400)
              .send({ email: "This user has already been invited." });
          }
          return res
            .status(400)
            .send({ email: "Failed to invite user, please try again!" });
        }

        io.to(getBoardSocket(boardId)).emit("inviteUser");
        res.status(200).send(data.rows);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
