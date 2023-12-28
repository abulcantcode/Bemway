import { Express } from "express";
import { pool } from "../../db";

export default function task(app: Express) {
  app.post("/task/", async (req, res) => {
    const { title, description } = req.body;
    try {
      await pool.query(
        `INSERT INTO "task" ("title", "description") VALUES ($1, $2)`,
        [title, description]
      );
      res.status(200).send({ message: "Successfully created task" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
