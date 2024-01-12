-- Active: 1699820285331@@127.0.0.1@5432@postgres
ALTER TABLE "task"
    ADD COLUMN "order" INT NOT NULL;

ALTER TABLE "stage"
    ADD COLUMN "order" INT NOT NULL;


ALTER TABLE "userBoard"
    ALTER COLUMN "privileges" DROP DEFAULT;


ALTER TABLE "userBoard"
    ALTER COLUMN "privileges" SET DEFAULT 'GLOBAL_EDIT';