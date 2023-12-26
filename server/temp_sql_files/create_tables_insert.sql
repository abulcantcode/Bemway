-- Active: 1703614797495@@127.0.0.1@5432@postgres
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


INSERT INTO "user" ("firstName", "lastName") VALUES ('kha', 'abs');

INSERT INTO "task" ("title", "status") VALUES ('do sumn', 'In-Progress');

INSERT INTO "userTask" ("taskId", "userId") VALUES ( (SELECT "id" FROM "task" WHERE "title" = 'do sumn'), (SELECT "id" FROM "user" WHERE "firstName"= 'sab'));

SELECT * FROM "task" 
JOIN "userTask" ON "userTask"."taskId" = "task"."id"
JOIN "user" ON "user"."id" = "userTask"."userId"
WHERE "user"."lastName" = 'ch';

SELECT "task".*, to_jsonb("userTask")||jsonb_build_object('user', "user") as "userTask"
from "task"
left join "userTask" on "userTask"."taskId" = "task"."id"
left join "user" on "user"."id" = "userTask"."userId";

SELECT * as "userTask" from "task" left join "userTask" on "userTask"."taskId" = "task"."id" left join "user" on "user"."id" = "userTask"."userId";


SELECT
*,
(
    SELECT
    json_agg(
        to_jsonb("userTask") || jsonb_build_object('user',"user")
    ) as "userTask"
    FROM "userTask"
    left join "user" on "user"."id" = "userTask"."userId"
    WHERE "userTask"."taskId" = "task"."id"
) as "userTask"
FROM "task";

SELECT to_json("task") FROM;

Select * from "user";

DROP * ;
