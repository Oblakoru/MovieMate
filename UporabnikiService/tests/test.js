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

    it("should login an existing user", async () => {
        await request(app).post("/users/register").send(testUser);

        const response = await request(app).post("/users/login").send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("user");
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
