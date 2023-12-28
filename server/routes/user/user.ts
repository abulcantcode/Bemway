import { Express } from "express";
import { pool } from "../../db";

export default function user(app: Express) {
  app.post("/user/", async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
      await pool.query(
        `INSERT INTO "user" ("firstName", "lastName") VALUES ($1, $2)`,
        [firstName, lastName]
      );
      res.status(200).send({ message: "Successfully created user" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
