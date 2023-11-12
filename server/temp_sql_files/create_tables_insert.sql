-- Active: 1699820285331@@127.0.0.1@5432@postgres@public
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" TEXT NOT NULL DEFAULT E'',
    "lastName" TEXT NOT NULL DEFAULT E'',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE IF NOT EXISTS "Status" AS ENUM ('Not_Started', 'Done', 'In-Progress', 'Blocked');


CREATE TABLE "task" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL DEFAULT E'',
    "description" TEXT,
    "status" "Status" DEFAULT 'Not_Started',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "userTask" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "taskId" UUID REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO "user" ("firstName", "lastName") VALUES ('sab', 'ch');

INSERT INTO "task" ("title", "status") VALUES ('go gym', 'In-Progress');

INSERT INTO "userTask" ("taskId", "userId") VALUES ( (SELECT "id" FROM "task" WHERE "title" = 'go gym'), (SELECT "id" FROM "user" WHERE "firstName"= 'sab'));