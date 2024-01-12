import { Express } from "express";
import { pool } from "../../db";
import createUser from "./createUser";
import authUser from "./authUser";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function user(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  createUser(app, io);
  authUser(app, io);

  //DELETE ALL BELOW

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
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });
      res.status(200).send("cookie has been set");
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
