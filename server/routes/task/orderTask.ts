import { pool } from "../../db";

export const updateOrderValues = async (stageId: string) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query<{ order: number; id: string }>(
      `SELECT "order", "id" FROM "task" WHERE "stageId" = $1 ORDER BY "order"`,
      [stageId]
    );

    await Promise.all(
      orderResult.rows.map(async ({ order, id }, expectedOrder) => {
        if (order !== expectedOrder) {
          await client.query(`UPDATE "task" SET "order" = $1 WHERE id = $2`, [
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
