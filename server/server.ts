import "dotenv/config";
import express from "express";
import session from "express-session";
import { pool } from "./db";
import board from "./routes/board";
import task from "./routes/task";
import user from "./routes/user";
import CustomPostgresStore, { CustomRequest } from "./utils/sessions";
import cors from "cors";
import checkSession from "./routes/session";
import stage from "./routes/stage";
import { Server } from "socket.io";
import http from "http";
import { getBoardSocket } from "./utils/getSocketRoom";
import { checkSessionValid } from "./utils/validateSession";

const app = express();

// --------------------------------------------------------------------
// Settings

app.set("trust proxy", 1);

// --------------------------------------------------------------------
// Middleware

const corsPolicy = {
  credentials: true,
  origin: "http://localhost:3000",
};

app.use(cors(corsPolicy));

app.use(express.json());

const sessionMiddleware = session({
  store: new CustomPostgresStore(),
  secret: "bemway_secrets",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
});

app.use(sessionMiddleware);

// Websocket stuff
// --------------------------------------------------------------------

const server = http.createServer(app);

const io = new Server(server, { cors: corsPolicy });

io.engine.use(sessionMiddleware);

const SESSION_RELOAD_INTERVAL = 3 * 60 * 1000;

io.on("connection", (socket) => {
  console.log(
    "socket connection userid + sessionId is: ",
    (socket.request as CustomRequest)?.session?.userId,
    (socket.request as CustomRequest)?.session?.id
  );

  if (!checkSessionValid(socket.request)) {
    console.log("Not a valid connection, disconnecting");
    return socket.disconnect();
  } else {
    console.log("Valid connection", socket.id);
    socket.join((socket.request as CustomRequest)?.session?.id);
  }

  // socket.join( (socket.request as CustomRequest)?.session?.userId)

  const periodicValidation = setInterval(() => {
    (socket.request as CustomRequest).session.reload((err) => {
      if (err || !checkSessionValid(socket.request)) {
        console.log("Invalid session on periodic check, connection is closing");
        socket.conn.close();
        // you can also use socket.disconnect(), but in that case the client
        // will not try to reconnect -> to reconnect use socket.conn.close() => forces the client to reconnect
      }
    });
  }, SESSION_RELOAD_INTERVAL);

  console.log("A user connected", socket.id);

  // On join board:

  socket.on("joinBoard", (boardId) => {
    // Join a room based on the boardId
    if (checkSessionValid(socket.request)) {
      socket.join(getBoardSocket(boardId));
      console.log(`User joined board ${socket.id}, boardId: ${boardId}`);
    } else {
      console.log(
        "Did not join board due to invalid session, boardId:",
        boardId
      );
    }
  });

  socket.on("disconnect", () => {
    clearInterval(periodicValidation);
    console.log("user disconnected", socket.id);
  });

  // Handle socket events here
});

// --------------------------------------------------------------------
// Imported Routes

task(app, io);
user(app, io);
board(app, io);
checkSession(app, io);
stage(app, io);

// --------------------------------------------------------------------
// Base route
// TODO: DELETE

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

// --------------------------------------------------------------------
// Set Server live

const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`Server has started on port: ${port}`));
