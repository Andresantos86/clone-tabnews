import database from 'infra/database'
import migrationRunner from 'node-pg-migrate'
import { error } from 'node:console';
import { join } from "node:path"

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"), // ajusta o caminho de acordo com o sistema
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations"
    }

    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions)
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      })

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    throw error
  } finally {
    await dbClient.end();
  }
}