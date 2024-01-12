import bcrypt from "bcrypt";
import { Express } from "express";
import * as z from "zod";
import { pool } from "../../db";
import { CustomRequest } from "../../utils/sessions";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const authSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export default function authUser(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post("/user/auth", async (req, res) => {
    const { password }: z.infer<typeof authSchema> = req.body;
    const email = (req.body?.email as string)?.toLocaleLowerCase();

    try {
      const validation = authSchema.safeParse({
        email,
        password,
      });

      if (!validation?.success) {
        return res.sendStatus(401);
      }

      const matchingUser = await pool.query<{ id: string; email: string }>(
        `SELECT "id", "email" FROM "user" WHERE "email" = $1;`,
        [email]
      );

      if (matchingUser.rowCount === 0) {
        return res.sendStatus(401);
      }

      const userPasswordHash = await pool.query<{ password: string }>(
        `SELECT "password" FROM "user" WHERE "id" = $1;`,
        [matchingUser.rows[0].id]
      );

      if (userPasswordHash.rowCount === 0) {
        return res.sendStatus(401);
      }

      bcrypt.compare(
        password,
        userPasswordHash.rows[0].password,
        async (err, result) => {
          if (err || !result) {
            return res.sendStatus(401);
          }

          const attatchSessionValues = () => {
            (req as CustomRequest).session.userId = matchingUser.rows[0].id;
            (req as CustomRequest).session.email = matchingUser.rows[0].email;
            (req as CustomRequest).session.valid = true;
            (req as CustomRequest).session.loggedIn = true;
          };

          req.session.regenerate((regenError) => {
            if (regenError) {
              console.error("Error regenErating session:", regenError);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            attatchSessionValues();

            console.log(
              "Auth successful, here is the new session: ",
              req.session
            );
            req.session.save(() => {
              res.status(200).send({ message: "Successfully logged in user" });
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  //DELETE
}
