import { Express } from "express";
import { pool } from "../../db";
import validateSession from "../../utils/validateSession";
import * as z from "zod";
import { CustomRequest } from "../../utils/sessions";
import { updateOrderValues } from "./orderTask";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getBoardSocket } from "../../utils/getSocketRoom";

const createTaskSchema = z.object({
  taskName: z.string().min(1),
  creatorUserId: z.string().min(1),
  stageId: z.string().min(1),
  assignees: z.array(z.string()),
});

// check privelages
export default function createTask(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post(
    "/task/",
    validateSession(async (req, res) => {
      try {
        const {
          taskName,
          stageId,
          assignees,
        }: z.infer<typeof createTaskSchema> = req.body;

        const creatorUserId = (req as CustomRequest).session.userId;

        const validateSchema = createTaskSchema.safeParse({
          taskName,
          creatorUserId,
          stageId,
          assignees,
        });

        if (!validateSchema?.success) {
          console.error("schema validate on create task failed", req.body);
          return res.status(400).send({ error: "Validation failed" });
        }

        // Check creator user id exists

        const creator = await pool.query<{ id: string }>(
          `
SELECT "id" FROM "user"
WHERE "user"."id" = $1::uuid
        `,
          [creatorUserId]
        );

        if (creator.rowCount === 0) {
          console.error("Create Task: task creator does not exist");
          return res
            .status(400)
            .send({ error: "Create Task: task creator does not exist" });
        }

        // Check stageId exists

        const stage = await pool.query<{ id: string; boardId: string }>(
          `
SELECT "id", "boardId" FROM "stage"
WHERE "stage"."id" = $1::uuid

        `,
          [stageId]
        );

        if (stage.rowCount === 0) {
          console.error("Create Task: stage does not exist");
          return res
            .status(400)
            .send({ error: "Create Task: stage does not exist" });
        }

        // Update order to put task at top

        await pool.query(
          `
        UPDATE "task"
        SET "order" = "order" + 1
        WHERE "stageId" = $1;
        `,
          [stage.rows[0].id]
        );

        // Create the task

        const task = await pool.query<{ id: string }>(
          `INSERT INTO "task" ("taskName", "creatorUserId", "stageId", "order")
          VALUES ($1, $2, $3, 0)
          RETURNING "id"`,
          [taskName, creator.rows[0].id, stage.rows[0].id]
        );

        if (task.rowCount === 0) {
          console.error("Create Task: failed to create task");
          return res
            .status(400)
            .send({ error: "Create Task: task create failed" });
        }

        // Check order of all tasks

        // Check all assignees exist, and verify the boardId from stage is the same

        await Promise.all(
          assignees.map(async (userBoardId) => {
            const userBoard = await pool.query<{ id: string }>(
              `
              SELECT "id" FROM "userBoard"
              WHERE "userBoard"."id" = $1::uuid AND "userBoard"."boardId" = $2::uuid
    
            `,
              [userBoardId, stage.rows[0].boardId]
            );

            if (userBoard.rowCount !== 0) {
              await pool.query(
                `
                INSERT INTO "userBoardTask" ("taskId", "userBoardId")
                VALUES ($1::uuid, $2::uuid)`,
                [task.rows[0].id, userBoard.rows[0].id]
              );
            } else {
              console.error(
                userBoardId,
                "skipped due to it not being found in database for this board",
                stage.rows[0].boardId,
                userBoardId
              );
            }
          })
        );

        await updateOrderValues(stage.rows[0].id);

        io.to(getBoardSocket(stage.rows[0].boardId)).emit("createTask", {
          stageId: stage.rows[0].id,
        });

        return res.sendStatus(200);
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    })
  );
}
