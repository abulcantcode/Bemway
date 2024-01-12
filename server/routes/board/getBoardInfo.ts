import { Express } from "express";
import { QueryResult } from "pg";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as s from "zapatos/schema";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import { TBoardData } from "./getBoardData";
import * as z from "zod";

const getBoardInfoSchema = z.object({ boardId: z.string().min(1) });

export default function getBoardInfo(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get(
    "/board/info/:boardId",
    validateSession(async (req, res) => {
      const { boardId } = req.params;

      const valid = getBoardInfoSchema.safeParse({ boardId });

      if (!valid.success) {
        console.error("Get board info failed fetch");
        return res.status(400).send({ error: "Validation failed" });
      }

      try {
        const data: QueryResult<Omit<TBoardData, "stage">> = await pool.query(
          `
SELECT
*,
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
