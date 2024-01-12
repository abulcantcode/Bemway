import { Express } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { pool } from "../../db";
import { CustomRequest } from "../../utils/sessions";
import validateSession from "../../utils/validateSession";

export default function getBoardList(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.get(
    "/board/user",
    validateSession(async (req, res) => {
      const { userId } = (req as CustomRequest).session;

      try {
        type TBoardList = { id: string; boardName: string; ownerId: string };

        const boardList = await pool.query<TBoardList>(
          `
SELECT "board"."id", "board"."boardName", "board"."ownerId" FROM "board"
LEFT JOIN "userBoard" ON "userBoard"."boardId" = "board"."id"
WHERE "userBoard"."userId" = $1::uuid;
`,
          [userId]
        );

        const boards = boardList.rows.map(({ ownerId, ...data }) => ({
          ownerId,
          ...data,
          isOwner: ownerId === userId,
        }));

        console.log(boards, userId, (req as CustomRequest).session.email);

        res.status(200).send({ boards });
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    })
  );
}
