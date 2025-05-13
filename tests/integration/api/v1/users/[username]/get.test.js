import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exect case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmocase@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response2.status).toBe(200);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "MesmoCase",
        email: "mesmocase@teste.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });
      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With  case mismatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "difCase",
          email: "diferente@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/difcase",
      );

      expect(response2.status).toBe(200);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "difCase",
        email: "diferente@teste.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });
      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With noneexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
      );

      expect(response2.status).toBe(404);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "verifique se o username está digitado corretamente",
        status_code: 404,
      });
      // expect(uuidVersion(responseBody2.id)).toBe(4);
      // expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      // expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });
  });
});
