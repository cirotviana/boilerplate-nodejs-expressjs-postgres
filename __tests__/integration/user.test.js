const request = require("supertest");
const faker = require("faker");

const app = require("../../src/app");
const factory = require("../utils/factories");
const truncate = require("../utils/truncate");

describe("User > UserController.js", () => {
  beforeEach(async () => {
    await truncate();
  });

  describe("Store", () => {
    it("User registered with success", async () => {
      const response = await request(app)
        .post("/api")
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: faker.internet.password()
        });

      expect(response.status).toBe(201);
    });

    it("WHERE parameter email has invalid undefined value", async () => {
      const response = await request(app)
        .post("/api")
        .send({
          name: faker.name.findName(),
          email: undefined,
          password: faker.internet.password()
        });

      expect(response.status).toBe(500);
    });

    it("Already exist a user with email", async () => {
      const user = await factory.create("User", {
        email: "joe@nothing.com"
      });

      const response = await request(app)
        .post("/api")
        .send({
          name: faker.name.findName(),
          email: user.email,
          password: faker.internet.password()
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Update", () => {
    it("User updated with success", async () => {
      const user = await factory.create("User", {
        email: "john@nothing.com"
      });

      const response = await request(app)
        .put(`/api/${user.id}`)
        .send({
          name: faker.name.findName(),
          password: faker.internet.password()
        });

      expect(response.status).toBe(200);
    });

    it("No user found", async () => {
      const response = await request(app)
        .put("/api/0")
        .send({
          name: faker.name.findName(),
          password: faker.internet.password()
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Get", () => {
    it("User successfully found", async () => {
      const user = await factory.create("User", {
        email: "snow@nothing.com"
      });

      const response = await request(app).get(`/api/${user.id}`);

      expect(response.status).toBe(200);
    });

    it("No user found", async () => {
      const response = await request(app).get("/api/0");

      expect(response.status).toBe(400);
    });
  });

  describe("Destroy", () => {
    it("User deleted with success", async () => {
      const user = await factory.create("User", {
        email: "stark@nothing.com"
      });

      const response = await request(app).delete(`/api/${user.id}`);

      expect(response.status).toBe(200);
    });

    it("No user found", async () => {
      const response = await request(app).delete("/api/0");

      expect(response.status).toBe(400);
    });
  });
});
