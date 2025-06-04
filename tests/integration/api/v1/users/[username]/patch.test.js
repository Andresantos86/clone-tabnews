import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "andreteste",
          email: "andreteste@teste.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "andreteste",
        email: "andreteste@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabese = await user.findOneByUsername("andreteste");
      const correctPass = await password.compare(
        "abc123",
        userInDatabese.password,
      );

      const inCorrectPass = await password.compare(
        "errado-abc123",
        userInDatabese.password,
      );

      expect(correctPass).toBe(true);
      expect(inCorrectPass).toBe(false);
    });

    test("With nonexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
        {
          method: "PATCH",
        },
      );

      expect(response2.status).toBe(404);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "verifique se o username está digitado corretamente",
        status_code: 404,
      });
    });

    test("With duplicated username", async () => {
      await orchestrator.createUser({
        username: "user1",
      });

      await orchestrator.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated email", async () => {
      await orchestrator.createUser({
        email: "duplicadouser1@teste.com",
      });

      const createduser2 = await orchestrator.createUser({
        email: "duplicadouser2@teste.com",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${createduser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "duplicadouser1@teste.com",
          }),
        },
      );

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With unique username", async () => {
      const createUser = await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: createUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique email", async () => {
      const createUser = await orchestrator.createUser();

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueemail2@teste.com",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createUser.username,
        email: "uniqueemail2@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new password", async () => {
      const createUser = await orchestrator.createUser({
        password: "abc123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createUser.username,
        email: createUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabese = await user.findOneByUsername(createUser.username);
      const correctPass = await password.compare(
        "newPassword2",
        userInDatabese.password,
      );

      const inCorrectPass = await password.compare(
        "abc123",
        userInDatabese.password,
      );

      expect(correctPass).toBe(true);
      expect(inCorrectPass).toBe(false);
    });
  });
});
