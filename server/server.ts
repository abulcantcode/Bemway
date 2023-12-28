import express from "express";
import { pool } from "./db";
import "dotenv/config";
import user from "./routes/user/user";
import task from "./routes/task/task";
import board from "./routes/board/board";

// import cors from "cors";

const port = 8080;

const app = express();
app.use(express.json());
// app.use(cors());
//routes
app.get("/", async (req, res) => {
  console.log("Server is running");
  try {
    //const data = await pool.query('SELECT * FROM "user"');
    const data = await pool.query(
      `
SELECT
*,
(
    SELECT
    json_agg(
        to_jsonb("userBoard") || jsonb_build_object('user',"user")
    ) as "userBoard"
    FROM "userBoard"
    left join "user" on "user"."id" = "userBoard"."userId"
    WHERE "userBoard"."boardId" = "board"."id"
) as "userBoard"
FROM "board";
`
    );

    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

task(app);
user(app);
board(app);

app.listen(port, () => console.log(`Server has started on port: ${port}`));
