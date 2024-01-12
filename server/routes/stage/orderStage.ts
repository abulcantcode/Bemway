import { pool } from "../../db";

export const updateStageOrderValues = async (boardId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query<{ order: number; id: string }>(
      `SELECT "order", "id" FROM "stage" WHERE "boardId" = $1 ORDER BY "order"`,
      [boardId]
    );

    await Promise.all(
      orderResult.rows.map(async ({ order, id }, expectedOrder) => {
        if (order !== expectedOrder) {
          await client.query(`UPDATE "stage" SET "order" = $1 WHERE id = $2`, [
            expectedOrder,
            id,
          ]);
        }
      })
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
