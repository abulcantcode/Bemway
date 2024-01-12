// model session {
//     id                 String    @id @default(uuid())
//     expiresAt          DateTime?
//     handle             String    @unique
//     userId             String?
//     hashedSessionToken String?
//     antiCSRFToken      String?
//     publicData         String?
//     privateData        String?
//     role               Role      @default(TUTOR)
//     created            DateTime  @default(now())
//     updated            DateTime  @updatedAt
//     user               user?     @relation(fields: [userId], references: [id])
//   }

import { Store, SessionData, Session } from "express-session";
import { pool } from "../db";
import { Request } from "express";

// Extend the Session interface to include custom properties

// Extend the Request interface to include the extended session

interface CustomSessionData {
  userId?: string;
  email?: string;
  valid?: boolean;
  loggedIn?: boolean;
  //   email?: string;
  //   id: string;
  //   userId: string;
  //   created: Date;
  //   updated: Date;
  //   hashedSessionToken: string;
  //   antiCSRFToken: string;
}

interface CombinedSessionData extends SessionData, CustomSessionData {}

export interface CustomRequest extends Request {
  session: CombinedSessionData & Request["session"];
}

interface SessionRow {
  sid: string;

  sess: CombinedSessionData;
  expire: Date;
}

// "sid" varchar NOT NULL COLLATE "default",
// "sess" json NOT NULL,
// "expire" timestamp(6) NOT NULL

class CustomPostgresStore extends Store {
  async get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ): Promise<void> {
    try {
      const result = await pool.query<SessionRow>(
        `SELECT * FROM session WHERE "sid" = $1`,
        [sid]
      );

      if (result.rows.length > 0 && result.rows[0].expire > new Date()) {
        callback(null, result.rows[0].sess);
      } else {
        callback(null, null);
      }
    } catch (error) {
      callback(error);
    }
  }

  async set(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    const expires = new Date(Date.now() + (session.cookie.maxAge || 86400000));

    try {
      await pool.query(
        `INSERT INTO "session" ("sid", "sess", "expire") VALUES ($1, $2, $3) ON CONFLICT ("sid") DO UPDATE SET "sess" = $2, "expire" = $3`,
        [sid, session, expires]
      );

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    try {
      await pool.query(`DELETE FROM "session" WHERE "sid" = $1`, [sid]);
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async touch(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    const expires = new Date(Date.now() + (session.cookie.maxAge || 86400000));

    try {
      await pool.query(`UPDATE "session" SET "expire" = $1 WHERE "sid" = $2`, [
        expires,
        sid,
      ]);

      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async all(
    callback: (err?: any, result?: { [sid: string]: SessionData }) => void
  ): Promise<void> {
    try {
      const result = await pool.query<SessionRow>(`SELECT * FROM "session"`);

      const sessions: { [sid: string]: SessionData } = {};
      result.rows.forEach((row) => {
        if (row.expire > new Date()) {
          sessions[row.sid] = row.sess;
        }
      });

      callback(null, sessions);
    } catch (error) {
      callback(error);
    }
  }

  async length(callback: (err?: any, length?: number) => void): Promise<void> {
    try {
      const result = await pool.query<{ count: number }>(
        `SELECT COUNT(*) FROM "session" WHERE "expire" > NOW()`
      );

      callback(null, result.rows[0].count);
    } catch (error) {
      callback(error);
    }
  }

  async clear(callback?: (err?: any) => void): Promise<void> {
    try {
      await pool.query(`DELETE FROM "session" WHERE "expire" < NOW()`);
      if (callback) callback();
    } catch (error) {
      if (callback) callback(error);
    }
  }

  async load(
    sid: string,
    callback: (err?: any, session?: SessionData) => void
  ): Promise<void> {
    try {
      const result = await pool.query<SessionRow>(
        `SELECT * FROM "session" WHERE "sid" = $1`,
        [sid]
      );

      if (result.rows.length > 0 && result.rows[0].expire > new Date()) {
        callback(null, result.rows[0].sess);
      } else {
        callback(null);
      }
    } catch (error) {
      callback(error);
    }
  }
}

export default CustomPostgresStore;
