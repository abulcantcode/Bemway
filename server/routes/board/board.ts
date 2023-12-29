import { Express } from "express";
import { pool } from "../../db";

export default function board(app: Express) {
  app.post("/board/", async (req, res) => {
    const { userId, boardName } = req.body;
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
  });

  app.get("/board/user/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("UserId:", userId);
    try {
      const data = await pool.query(
        `
SELECT "board"."id", "board"."boardName" FROM "board"
WHERE "board"."ownerId" = $1::uuid;
`,

        [userId]
      );

      const allBoards = await pool.query(
        `
SELECT "board"."id", "board"."boardName" FROM "board"
LEFT JOIN "userBoard" ON "userBoard"."boardId" = "board"."id"
WHERE "userBoard"."userId" = $1::uuid;
`,
        [userId]
      );
      res.status(200).send({ owner: data.rows, all: allBoards.rows });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.post("/board/invite", async (req, res) => {
    const { userId, boardId } = req.body;
    console.log("add user to board UserId:", userId);
    try {
      const data = await pool.query(
        `
INSERT INTO "userBoard" ("userId", "boardId")
VALUES ($1, $2)
ON CONFLICT ("userId", "boardId") DO NOTHING;
`,
        [userId, boardId] // can later change do nothing to change the status of the connection ("ACTIVE" or "ARCHIVED")
      );
      res.status(200).send(data.rows);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get("/board/:boardId", async (req, res) => {
    const { boardId } = req.params;
    console.log("boardId:", boardId);
    try {
      const data = await pool.query(
        `
SELECT
*,
(
    SELECT
    json_agg(
        to_jsonb("stage") || 
        jsonb_build_object(
            'task',
            COALESCE((
                SELECT json_agg(
                    to_jsonb("task") || 
                    jsonb_build_object(
                        'userBoardTask',
                        COALESCE((
                            SELECT 
                                json_agg(
                                    to_jsonb("userBoardTask") ||
                                    jsonb_build_object(
                                        'userBoard',to_jsonb("userBoard") || jsonb_build_object('user',"user")
                                    )
                                )
                            FROM "userBoardTask"
                            LEFT JOIN "userBoard" ON "userBoard"."id" = "userBoardTask"."userBoardId"
                            LEFT JOIN "user" ON "user"."id" = "userBoard"."userId"
                            WHERE "userBoardTask"."taskId" = "task"."id"
                            ),
                            '[]'::json
                        )
                    )
                )
                FROM "task"
                WHERE "task"."stageId" = "stage"."id"
                ),
                '[]'::json)
            )
    ) as "stage"
    FROM "stage"
    WHERE "stage"."boardId" = "board"."id"
) as "stage",
(
    SELECT json_agg(
        to_jsonb("userBoard") ||
        jsonb_build_object('user', "user")
    )
    FROM "userBoard"
    LEFT JOIN "user" ON "user"."id" = "userBoard"."userId"
    WHERE "userBoard"."boardId" = "board"."id"
) as "users"
FROM "board"
WHERE "board"."id" = $1::uuid;
`,
        [boardId]
      );
      res.status(200).send(data.rows);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
