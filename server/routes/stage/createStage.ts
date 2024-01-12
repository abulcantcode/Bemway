import { Express } from "express";
import * as z from "zod";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import { updateStageOrderValues } from "./orderStage";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as s from "zapatos/schema";
import { getBoardSocket } from "../../utils/getSocketRoom";

const createStageSchema = z.object({
  stageName: z.string().min(1),
  boardId: z.string().min(1),
});

// check privelages
export default function createStage(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/stage/",
    validateSession(async (req, res) => {
      try {
        const { stageName, boardId }: z.infer<typeof createStageSchema> =
          req.body;

        const validateSchema = createStageSchema.safeParse({
          stageName,
          boardId,
        });

        if (!validateSchema?.success) {
          console.error("schema validate on create stage failed", req.body);
          return res.status(400).send({ error: "Validation failed" });
        }

        // Check board exists

        const board = await pool.query<{ id: string; boardId: string }>(
          `
        SELECT "id" FROM "board"
        WHERE "board"."id" = $1::uuid

        `,
          [boardId]
        );

        if (board.rowCount === 0) {
          console.error("Create Stage: board does not exist");
          return res
            .status(400)
            .send({ error: "Create Stage: board does not exist" });
        }

        // Find the order it should be

        const numCols = await pool.query<{ count: number }>(
          `
          SELECT COUNT(*) 
          FROM "stage" 
          WHERE "boardId" = $1;
        `,
          [board.rows[0].id]
        );

        const newOrder = numCols.rows[0].count || 0;

        // Create the stage

        const newStage = await pool.query<s.stage.Selectable>(
          `INSERT INTO "stage" ("stageName", "boardId", "order")
          VALUES ($1, $2, $3)
          RETURNING *`,
          [stageName, board.rows[0].id, newOrder]
        );

        if (newStage.rowCount === 0) {
          console.error("Create Stage: failed to create stage");
          return res
            .status(400)
            .send({ error: "Create Stage: stage create failed" });
        }

        // Check order of all stages

        await updateStageOrderValues(board.rows[0].id);

        io.to(getBoardSocket(board.rows[0].id)).emit("createStage", {
          ...newStage.rows[0],
          task: [],
        });
        return res.sendStatus(200);
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    })
  );
}
