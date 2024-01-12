import { Express } from "express";
import createStage from "./createStage";
import moveStage from "./moveStage";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import getStage from "./getStage";

export default function stage(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  createStage(app, io);
  moveStage(app, io);
  getStage(app, io);
}
