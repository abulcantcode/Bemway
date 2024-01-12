import { Express } from "express";
import { pool } from "../../db";
import * as z from "zod";
import * as s from "zapatos/schema";
import { CustomRequest } from "../../utils/sessions";
import bcrypt from "bcrypt";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const AllProfiles: s.every.Profile = [
  "BLUE",
  "GREEN",
  "LIGHTGRAY",
  "MAROON",
  "NAVY",
  "ORANGE",
  "PINK",
  "PURPLE",
  "RED",
  "SILVER",
];
const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8, "Password must contain at least 8 characters"),
  profile: z.enum(AllProfiles),
});

export default function createUser(
  app: Express,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  app.post("/user/create", async (req, res) => {
    const {
      firstName,
      lastName,
      password,
      profile,
    }: z.infer<typeof signupSchema> = req.body;

    const email = (req.body?.email as string)?.toLocaleLowerCase();
    try {
      const validation = signupSchema.safeParse({
        firstName,
        lastName,
        email,
        password,
        profile,
      });

      if (!validation?.success) {
        const errorMessage = validation.error.issues.reduce(
          (prev, issue) => ({ ...prev, [issue.path[0]]: issue.message }),
          {}
        );
        return res.status(400).send(errorMessage);
      }

      const matchingEmail = await pool.query(
        `SELECT * FROM "user" WHERE "email" = $1;`,
        [email]
      );
      if (matchingEmail.rowCount !== 0) {
        return res.status(409).send({ email: "Email already in use" });
      }

      bcrypt.hash(password, 12, async (err, passwordHash) => {
        if (err) {
          return res.sendStatus(500);
        }

        const attatchSessionValues = () => {
          (req as CustomRequest).session.userId = userData.rows[0].id;
          (req as CustomRequest).session.email = userData.rows[0].email;
          (req as CustomRequest).session.valid = true;
          (req as CustomRequest).session.loggedIn = true;
        };

        const userData = await pool.query<{ id: string; email: string }>(
          `INSERT INTO "user" ("firstName", "lastName", "email", "password", "profile")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING "id", "email"`,
          [firstName, lastName, email, passwordHash, profile]
        );

        console.log(userData.rows);
        console.log("before", req.session);

        req.session.regenerate((err) => {
          if (err || !userData.rows[0].id) {
            return res.sendStatus(500);
          }

          attatchSessionValues();
          console.log("after", req.session);

          res.status(200).send({ message: "Successfully created user" });
        });
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  //DELETE
}
