import controller from "infra/controller";
import database from "infra/database.js";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const conectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = conectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const connectionsOpenedResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
    values: [databaseName],
  });
  const openedConections = connectionsOpenedResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConections,
      },
    },
  });
}
