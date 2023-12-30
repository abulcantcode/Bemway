CREATE TYPE priority_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW');


ALTER TABLE "task"
ADD COLUMN "description" TEXT,
ADD COLUMN "due" DATE,
ADD COLUMN "dueStart" DATE,
ADD COLUMN "taskPriority" priority_enum;