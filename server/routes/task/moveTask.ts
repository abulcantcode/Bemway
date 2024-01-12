import { Express } from "express";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import * as z from "zod";
import { updateOrderValues } from "./orderTask";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getBoardSocket } from "../../utils/getSocketRoom";

const moveTaskSchema = z.object({
  taskId: z.string().min(1),
  stageId: z.string().min(1),
  newOrder: z.number().int().nonnegative().safe().finite(),
});

export default async function moveTask(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/task/move",
    validateSession(async (req, res) => {
      const { taskId, stageId, newOrder } = req.body;

      // zod validate = new order greater or eq that 0

      const validation = moveTaskSchema.safeParse(req.body);

      if (!validation.success) {
        console.error("Task move validation failed");
        return res.status(400).send({ error: "Validation failed" });
      }

      // get task + left join to stage to get boardId,
      // check prev stage
      // skip if same stage id and same order id
      // do a func for same stage, and for diff stage
      // if diff stage, check new stage is on same boardId (do a where stageId = $1 AND boardId = $2, if rows.count === 0)

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const task = await client.query<{
          id: string;
          boardId: string;
          stageId: string;
          order: number;
        }>(
          `SELECT "task"."id", "task"."stageId", "stage"."boardId", "task"."order" FROM "task"
          LEFT JOIN "stage" ON "stage"."id" = "task"."stageId"
          WHERE "task"."id" = $1`,
          [taskId]
        );

        if (task.rowCount === 0) {
          console.error("No task found on task move");
          return res.status(400).send({ error: "No task found from ID" });
        }

        let verifiedStageId = stageId;

        if (task.rows[0].stageId !== stageId) {
          // check new stage is in board
          const newStage = await client.query<{ id: String }>(
            `
            SELECT "id" FROM "stage"
            WHERE "id" = $1 AND "boardId" = $2  
        `,
            [stageId, task.rows[0].boardId]
          );

          if (newStage.rowCount === 0) {
            console.error("Move task: new stage not found");
            return res
              .status(400)
              .send({ error: "New stage not found in board" });
          }

          verifiedStageId = newStage.rows[0].id;
        }

        // add 1 to x > newPos
        // change stageId and taskNo
        // subtract 1 from everything > new Pos
        // run order task

        await client.query(
          `
          UPDATE "task" SET "order" = "order" - 1 WHERE "task"."order" > $1 AND "task"."stageId" = $2
          `,
          [task.rows[0].order, task.rows[0].stageId]
        );

        await client.query(
          `
          UPDATE "task" SET "order" = "order" + 1 WHERE "task"."order" >= $1 AND "task"."stageId" = $2
          `,
          [newOrder, verifiedStageId]
        );

        await client.query(
          `
          UPDATE "task" SET "order" = $2, "stageId" = $3 WHERE "task"."id" = $1
          `,
          [task.rows[0].id, newOrder, verifiedStageId]
        );

        await client.query("COMMIT");

        await updateOrderValues(task.rows[0].stageId);
        if (task.rows[0].stageId !== verifiedStageId) {
          await updateOrderValues(verifiedStageId);
        }

        const { rows: prevStageTaskOrder } = await pool.query<{
          order: number;
          id: string;
          stageId: string;
        }>(
          `SELECT "order", "id", "stageId" FROM "task" WHERE "stageId" = $1 ORDER BY "order"`,
          [task.rows[0].stageId]
        );

        const { rows: newStageTaskOrder } = await pool.query<{
          order: number;
          id: string;
          stageId: string;
        }>(
          `SELECT "order", "id", "stageId" FROM "task" WHERE "stageId" = $1 ORDER BY "order"`,
          [verifiedStageId]
        );

        io.to(getBoardSocket(task.rows[0].boardId)).emit("moveTask", {
          newStageTaskOrder,
          newStageId: verifiedStageId,
          prevStageTaskOrder,
          prevStageId: task.rows[0].stageId,
        });
        return res.sendStatus(200);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).send({ error: "Move task failed in server" });
      } finally {
        client.release();
      }
    })
  );
}
