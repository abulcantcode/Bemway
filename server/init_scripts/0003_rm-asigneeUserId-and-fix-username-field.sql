ALTER TABLE "user" 
    RENAME COLUMN "userName" TO "email";

ALTER TABLE "userBoardTask" 
    DROP COLUMN "assigneeUserId";