-- Active: 1699820285331@@127.0.0.1@5432@postgres
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


INSERT INTO "user" ("firstName", "lastName", "id") VALUES ('kha', 'abs', '42b64d23-bbd8-470f-a8fa-450dec2ca6c9');
INSERT INTO "user" ("firstName", "lastName") VALUES ('kha', 'abs',);

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
SELECT to_json("task") FROM;

Select * from "user";

INSERT
INTO
"userBoard"
("boardId", "userId")
VALUES
((INSERT INTO "board"
    ("boardName", "ownerId")
    VALUES
    ('House Stuff', '42b64d23-bbd8-470f-a8fa-450dec2ca6c9')
    RETURNING "id"
),
'42b64d23-bbd8-470f-a8fa-450dec2ca6c9');

INSERT INTO "board"
    ("boardName", "ownerId")
    VALUES
    ('House Stuff 2', '42b64d23-bbd8-470f-a8fa-450dec2ca6c9')
RETURNING "id";


INSERT
INTO
"userBoard"
("boardId", "userId")
VALUES
(
    (
        INSERT INTO "board"
    ("boardName", "ownerId")
    VALUES
    ('House Stuff 2', '42b64d23-bbd8-470f-a8fa-450dec2ca6c9')
RETURNING "id";
    ),
'42b64d23-bbd8-470f-a8fa-450dec2ca6c9');


INSERT INTO "userBoard" ("boardId", "userId")
VALUES (
    (
        INSERT INTO "board" ("boardName", "ownerId")
        VALUES ('House Stuff 2', '42b64d23-bbd8-470f-a8fa-450dec2ca6c9')
        RETURNING "id"
    ),
    '42b64d23-bbd8-470f-a8fa-450dec2ca6c9'
);



WITH inserted_board AS (
    INSERT INTO "board" ("boardName", "ownerId")
    VALUES ('House Stuff 2', 'd82b63d9-a021-4c2f-abbe-8e3892b2313e')
    RETURNING *
)
-- INSERT INTO "userBoard" ("boardId", "userId")
SELECT * FROM inserted_board;
-- RETURNING "boardId", "userId";



WITH new_board AS (
    INSERT INTO "board" ("ownerId", "boardName")#

    VALUES (
        '42b64d23-bbd8-470f-a8fa-450dec2ca6c9'::uuid,
        'Test new'
    )
    RETURNING "id"
),
new_user_board AS (
    INSERT INTO "userBoard"
    ("userId", "boardId")
    VALUES (
        '42b64d23-bbd8-470f-a8fa-450dec2ca6c9'::uuid,
        (SELECT "id" from new_board)
    )
    RETURNING "boardId"
)
INSERT INTO "stage" ("stageName","boardId")
SELECT 'Not started', "id" from new_board
UNION ALL
SELECT 'In-progress', "id" from new_board
UNION ALL
SELECT 'Done', "id" from new_board;



SELECT "board"."id", "board"."boardName", "stage"."id" FROM "board"
LEFT JOIN "stage" ON "stage"."boardId" = "board"."id"
WHERE "board"."ownerId" = '42b64d23-bbd8-470f-a8fa-450dec2ca6c9'::uuid;

SELECT
*,
(
    SELECT
    json_agg(
        to_jsonb("stage") || 
        jsonb_build_object(
            'task',
            COALESCE((
                SELECT json_agg(
                    to_jsonb("task") || 
                    jsonb_build_object(
                        'userBoardTask',
                        COALESCE((
                            SELECT 
                                json_agg(
                                    to_jsonb("userBoardTask") ||
                                    jsonb_build_object(
                                        'userBoard',to_jsonb("userBoard") || jsonb_build_object('user',"user")
                                    )
                                )
                            FROM "userBoardTask"
                            LEFT JOIN "userBoard" ON "userBoard"."id" = "userBoardTask"."userBoardId"
                            LEFT JOIN "user" ON "user"."id" = "userBoard"."userId"
                            WHERE "userBoardTask"."taskId" = "task"."id"
                            ),
                            '[]'::json
                        )
                    )
                    ORDER BY "task"."order"
                )
                FROM "task"
                WHERE "task"."stageId" = "stage"."id"
                
                ),
                '[]'::json)
            )
    ) as "stage"
    FROM "stage"
    WHERE "stage"."boardId" = "board"."id"
) as "stage",
(
    SELECT json_agg(
        to_jsonb("userBoard") ||
        jsonb_build_object('user', "user")
    )
    FROM "userBoard"
    LEFT JOIN "user" ON "user"."id" = "userBoard"."userId"
    WHERE "userBoard"."boardId" = "board"."id"
) as "users"
FROM "board"
WHERE "board"."id" = '552fb941-d93b-4db2-a6a2-189431790b13';






INSERT INTO "task" ("taskName", "creatorUserId", "stageId") VALUES ('test task 2','ffe530cc-9410-4ca5-b848-7750c9bba2c7','c543c885-bc5b-4de1-8913-131f42714bcd');


WITH newTask AS (INSERT INTO "task" ("taskName", "creatorUserId", "stageId") 
VALUES ('test task 2','ffe530cc-9410-4ca5-b848-7750c9bba2c7','c543c885-bc5b-4de1-8913-131f42714bcd')
RETURNING "id")
INSERT INTO "userBoardTask" ("taskId", "userBoardId")
VALUES ((SELECT "id" FROM newTask), '51145387-c258-480f-b776-4126510fa982'::uuid)
SELECT json_agg("user") from "user";

INSERT INTO "user" ("firstName", "lastName", "email", "password")
        VALUES ('a', 'b', 'c', 'd')
        RETURNING "id", "email"




UPDATE "task"
   SET "order" = 1
   WHERE "stageId" = '383061ee-d82f-43ab-8409-87810c353b77';


SELECT "task"."id", "stage"."boardId" FROM "task"
          LEFT JOIN "stage" ON "stage"."id" = "task"."stageId"
          WHERE "task"."id" = '1a7e7838-86f4-4232-b9de-21bb169189a4';


SELECT COUNT(*) 
FROM "stage" 
WHERE "boardId" = 'c49c399a-dba8-4002-807f-631ec8ddd3b0';


SELECT "id", "order" FROM "stage"
          WHERE "id" = 'd6f8955f-2fab-44f2-aceb-fc62ea953bfc';