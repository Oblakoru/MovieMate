const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/users");

const UserRepository = require("../src/infrastructure/UserRepository");

const app = express();
const userRepository = new UserRepository();

app.use(express.json());
app.use("/users", userRoutes(userRepository));

beforeEach(async () => {
    await new Promise((resolve, reject) => {
        userRepository.db.run("DELETE FROM users", (err) => {
            if (err) reject(err);
            resolve();
        });
    });
});

afterAll(async () => {
    await new Promise((resolve) => userRepository.db.close(resolve));
});

describe("User Registration & Login", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
    };

    it("should register a new user", async () => {
        const response = await request(app).post("/users/register").send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.email).toBe(testUser.email);
    });

    it("should not allow duplicate registration", async () => {
        await request(app).post("/users/register").send(testUser);
        const response = await request(app).post("/users/register").send(testUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should not login with incorrect password", async () => {
        await request(app).post("/users/register").send(testUser);

        const response = await request(app).post("/users/login").send({
            email: testUser.email,
            password: "wrongpassword",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should not login a non-existent user", async () => {
        const response = await request(app).post("/users/login").send({
            email: "nonexistent@example.com",
            password: "password123",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});

describe("User Management (GET, UPDATE, DELETE)", () => {
    let userId;

    beforeEach(async () => {
        const response = await request(app).post("/users/register").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123",
        });
        userId = response.body.user.id;
    });

    it("should get an existing user by ID", async () => {
        const response = await request(app).get(`/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", userId);
        expect(response.body).toHaveProperty("email", "testuser@example.com");
    });

    it("should return 404 for a non-existent user", async () => {
        const response = await request(app).get("/users/9999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });

    it("should update a user successfully", async () => {
        const updatedUser = {
            name: "Updated User",
            email: "updateduser@example.com",
            password: "newpassword123",
        };

        const response = await request(app).put(`/users/${userId}`).send(updatedUser);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User updated successfully.");
        expect(response.body.user).toHaveProperty("name", "Updated User");
        expect(response.body.user).toHaveProperty("email", "updateduser@example.com");
    });

    it("should return 400 when updating a non-existent user", async () => {
        const response = await request(app).put("/users/9999").send({
            name: "Nonexistent",
            email: "nonexistent@example.com",
            password: "password123",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should delete an existing user", async () => {
        const response = await request(app).delete(`/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User deleted successfully.");
    });

    it("should return 400 when trying to delete a non-existent user", async () => {
        const response = await request(app).delete("/users/9999");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});