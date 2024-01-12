import { Express } from "express";
import { QueryResult } from "pg";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as s from "zapatos/schema";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import * as z from "zod";

export type TBoardData = s.board.Selectable & {
  users: (s.userBoard.Selectable & { user: s.user.Selectable })[];
  stage: (s.stage.Selectable & {
    task: (s.task.Selectable & {
      userBoardTask: (s.userBoardTask.Selectable & {
        userBoard: s.userBoard.Selectable & { user: s.user.Selectable };
      })[];
    })[];
  })[];
};

const getBoardDataSchema = z.object({ boardId: z.string().min(1) });

export default function getBoardData(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get(
    "/board/:boardId",
    validateSession(async (req, res) => {
      const { boardId } = req.params;

      const valid = getBoardDataSchema.safeParse({ boardId });

      if (!valid.success) {
        console.error("Get board data failed fetch");
        return res.status(400).send({ error: "Validation failed" });
      }

      try {
        const data: QueryResult<TBoardData> = await pool.query(
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
                    ORDER BY "task"."order"

                )
                FROM "task"
                WHERE "task"."stageId" = "stage"."id"
                ),
                '[]'::json
            )
        )
        ORDER BY "stage"."order"
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

        if (data.rowCount === 0) {
          console.error("board not found");
          res.status(400).send({ error: "board not found" });
        }

        res.status(200).send(data.rows[0]);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
