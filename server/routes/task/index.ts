import { Express } from "express";
import createTask from "./createTask";
import moveTask from "./moveTask";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function task(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  createTask(app, io);
  moveTask(app, io);
}
