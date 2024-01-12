import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { pool } from "../../db";
import { CustomRequest } from "../../utils/sessions";
import validateSession from "../../utils/validateSession";

export default function createBoard(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/board/",
    validateSession(async (req, res) => {
      const { boardName } = req.body;
      const { userId } = (req as CustomRequest).session;
      try {
        await pool.query(
          `
WITH new_board AS (
    INSERT INTO "board" ("ownerId", "boardName")

    VALUES (
        $1::uuid,
        $2
    )
    RETURNING "id"
),
new_user_board AS (
    INSERT INTO "userBoard"
    ("userId", "boardId")
    VALUES (
        $1::uuid,
        (SELECT "id" from new_board)
    )
    RETURNING "boardId"
)
INSERT INTO "stage" ("stageName","boardId")
SELECT 'Not started', "id" from new_board
UNION ALL
SELECT 'In-progress', "id" from new_board
UNION ALL
SELECT 'Done', "id" from new_board;
`,
          [userId, boardName]
        );
        res.status(200).send({ message: "Successfully created board" });
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
