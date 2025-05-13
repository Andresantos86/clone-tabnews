import controller from "infra/controller";
import user from "models/user.js";

import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.patch(pacthHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  return response.status(200).json(userFound);
}

async function pacthHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;
  const updateUser = await user.update(username, userInputValues);
  return response.status(200).json(updateUser);
}
