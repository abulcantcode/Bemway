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

  //DELETE

  app.get("/user/", async (req, res) => {
    try {
      const users = await pool.query(`SELECT * FROM "user";`);
      res.status(200).send(users.rows);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("update userid cookie", userId);
    try {
      res.cookie("userId", userId, {
        maxAge: 900000,
        httpOnly: true,
      });
      res.status(200).send("cookie has been set");
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
