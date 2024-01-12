import { Response } from "express";

export default function removeClientSession(res: Response) {
  return res.clearCookie("connect.sid");
}
