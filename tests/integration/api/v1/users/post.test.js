import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "andresantos",
          email: "teste@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "andresantos",
        email: "teste@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabese = await user.findOneByUsername("andresantos");
      const corretPasswordMatch = await password.compare(
        "abc123",
        userInDatabese.password,
      );

      expect(corretPasswordMatch).toBe(true);

      const inCorretPasswordMatch = await password.compare(
        "abc123456",
        userInDatabese.password,
      );

      expect(inCorretPasswordMatch).toBe(false);
    });

    test("With duplicated email", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@teste.com",
          password: "abc123",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userduplicado",
          email: "duplicado_user@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userDuplicado",
          email: "duplicado_user1@teste.com",
          password: "abc123",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
