import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import createBoard from "./createBoard";
import getBoardData from "./getBoardData";
import getBoardList from "./getBoardList";
import inviteUserBoard from "./inviteUserBoard";
import getBoardInfo from "./getBoardInfo";
import updateBoardName from "./updateBoardName";
export type { TBoardData } from "./getBoardData";

export default function board(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  getBoardList(app, io);
  getBoardInfo(app, io);
  getBoardData(app, io);
  createBoard(app, io);
  inviteUserBoard(app, io);
  updateBoardName(app, io);
}
