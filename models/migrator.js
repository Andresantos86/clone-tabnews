import database from "infra/database";
import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"), // ajusta o caminho de acordo com o sistema
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

export async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClient,
      dryRun: false,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}
