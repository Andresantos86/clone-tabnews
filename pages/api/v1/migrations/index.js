import controller from "infra/controller";
import { listPendingMigrations, runPendingMigrations } from "models/migrator";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
