import { Express } from "express";
import { pool } from "../../db";

// check privelages
export default function task(app: Express) {
  app.post("/task/", async (req, res) => {
    const { taskName, creatorUserId, stageId, userBoardId } = req.body;
    try {
      await pool.query(
        `WITH newTask AS (INSERT INTO "task" ("taskName", "creatorUserId", "stageId") 
        VALUES ($1, $2, $3)
        RETURNING "id")
        INSERT INTO "userBoardTask" ("taskId", "userBoardId")
        VALUES ((SELECT "id" FROM newTask), $4::uuid)`,
        [taskName, creatorUserId, stageId, userBoardId]
      );
      res.status(200).send({ message: "Successfully created task" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
