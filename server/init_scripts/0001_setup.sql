CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- user table
CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userName" VARCHAR(255),
    "firstName" TEXT NOT NULL DEFAULT E'',
    "lastName" TEXT NOT NULL DEFAULT E'',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- board table
CREATE TABLE "board" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "boardName" VARCHAR(255),
    "ownerId" UUID REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Privileges ENUM type
CREATE TYPE "Privileges" AS ENUM ('READ_ONLY', 'LOCAL_EDIT', 'GLOBAL_EDIT');

-- userBoard table (many-to-many relationship between user and board)
CREATE TABLE "userBoard" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "boardId" UUID REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "privileges" "Privileges" DEFAULT 'READ_ONLY', -- Add privileges column
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("userId", "boardId") -- Ensures uniqueness for the combination of userId and boardId
);

-- stage table
CREATE TABLE "stage" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "stageName" VARCHAR(255),
    "boardId" UUID REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- task table
CREATE TABLE "task" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "taskName" VARCHAR(255),
    "creatorUserId" UUID REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "stageId" UUID REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- userboardtask table (associates tasks with users and boards)
CREATE TABLE "userBoardTask" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "taskId" UUID REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "userBoardId" UUID REFERENCES "userBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "assigneeUserId" UUID REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);