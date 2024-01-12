import { Express } from "express";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import * as z from "zod";
import { updateStageOrderValues } from "./orderStage";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getBoardSocket } from "../../utils/getSocketRoom";

const moveStageSchema = z.object({
  stageId: z.string().min(1),
  newOrder: z.number().int().nonnegative().safe().finite(),
});

export default async function moveStage(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/stage/move",
    validateSession(async (req, res) => {
      const { stageId, newOrder } = req.body;

      // zod validate = new order greater or eq that 0

      const validation = moveStageSchema.safeParse(req.body);

      if (!validation.success) {
        console.error("Stage move validation failed");
        return res.status(400).send({ error: "Validation failed" });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const stage = await client.query<{
          id: string;
          order: number;
          boardId: string;
        }>(
          `SELECT "id", "order", "boardId" FROM "stage"
          WHERE "id" = $1`,
          [stageId]
        );

        if (stage.rowCount === 0) {
          console.error("No stage found for stageId on Stage move");
          return res.status(400).send({ error: "No stage found from ID" });
        }

        // add 1 to x > newPos
        // change stageId and StageNo
        // subtract 1 from everything > new Pos
        // run order Stage

        await client.query(
          `
          UPDATE "stage" SET "order" = "order" - 1 WHERE "stage"."order" > $1 AND "stage"."boardId" = $2
          `,
          [stage.rows[0].order, stage.rows[0].boardId]
        );

        await client.query(
          `
          UPDATE "stage" SET "order" = "order" + 1 WHERE "stage"."order" >= $1 AND "stage"."boardId" = $2
          `,
          [newOrder, stage.rows[0].boardId]
        );

        await client.query(
          `
          UPDATE "stage" SET "order" = $2 WHERE "stage"."id" = $1
          `,
          [stage.rows[0].id, newOrder]
        );

        await client.query("COMMIT");

        await updateStageOrderValues(stage.rows[0].boardId);

        const { rows: stageOrder } = await client.query<{
          order: number;
          id: string;
        }>(
          `SELECT "order", "id" FROM "stage" WHERE "boardId" = $1 ORDER BY "order"`,
          [stage.rows[0].boardId]
        );

        io.to(getBoardSocket(stage.rows[0].boardId)).emit("moveStage", {
          stageOrder,
        });

        return res.sendStatus(200);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).send({ error: "Error in server move stage" });
      } finally {
        client.release();
      }
    })
  );
}
