import { Express } from "express";
import { pool } from "../../db";
import createUser from "./createUser";
import authUser from "./authUser";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import logout from "./logOut";

export default function user(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  createUser(app, io);
  authUser(app, io);
  logout(app, io);
}
