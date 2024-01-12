import { Express } from "express";
import { QueryResult } from "pg";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as s from "zapatos/schema";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import * as z from "zod";
import { TBoardData } from "../board";

const getStageSchema = z.object({ stageId: z.string().min(1) });

export default function getStage(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get(
    "/stage/:stageId",
    validateSession(async (req, res) => {
      const { stageId } = req.params;

      const validation = getStageSchema.safeParse({ stageId });

      if (!validation.success) {
        console.error("Validation failed on get stage");
        return res.status(400).send({ error: "validation failed" });
      }

      try {
        const data: QueryResult<TBoardData["stage"][0]> = await pool.query(
          `
SELECT
*,
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
) as "task"
FROM "stage"
WHERE "stage"."id" = $1
`,
          [stageId]
        );

        if (data.rowCount === 0) {
          console.error("stage not found");
          res.status(400).send({ error: "stage not found" });
        }

        res.status(200).send(data.rows[0]);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
