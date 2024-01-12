CREATE TYPE "Profile" AS ENUM ('BLUE', 'NAVY', 'MAROON', 'RED', 'GREEN', 'ORANGE', 'PINK', 'SILVER', 'PURPLE', 'LIGHTGRAY');


ALTER TABLE "user" 
  ADD COLUMN "password" TEXT,
  ADD COLUMN "profile" "Profile" DEFAULT 'BLUE';