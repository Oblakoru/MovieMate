module.exports = (userRepository) => {
    const express = require("express");
    const RegisterUser = require("../src/application/RegisterUser");
    const LoginUser = require("../src/application/LoginUser");
    const GetAllUsers = require("../src/application/GetAllUsers");
    const GetUser = require("../src/application/GetUser");
    const UpdateUser = require("../src/application/UpdateUser");
    const DeleteUser = require("../src/application/DeleteUser");

  
    const router = express.Router();
    const registerUser = new RegisterUser(userRepository);
    const loginUser = new LoginUser(userRepository);
    const getAllUsers = new GetAllUsers(userRepository);
    const getUser = new GetUser(userRepository);
    const updateUser = new UpdateUser(userRepository);
    const deleteUser = new DeleteUser(userRepository);

    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           description: The user's name
     *         email:
     *           type: string
     *           description: The user's email
     *         password:
     *           type: string
     *           description: The user's password
     *       required:
     *         - email
     *         - password
     */

    /**
     * @swagger
     * /users/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: User successfully registered
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Registration error
     */
    router.post("/register", async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const user = await registerUser.execute(name, email, password);
            res.status(201).json({ message: "Uporabnik uspešno registriran.", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Login a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Login failed
     */
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await loginUser.execute(email, password);
            res.status(200).json({ message: "Prijava uspešna.", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });



    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retrieve all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: A list of users
     *       400:
     *         description: Error retrieving users
     */
    router.get("/", async (req, res) => {
        try {
            const users = await getAllUsers.execute();
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retrieve a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User ID
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *       404:
     *         description: User not found
     */
    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const user = await getUser.execute(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User ID
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User updated successfully
     *       400:
     *         description: Update error
     */
    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { name, email, password } = req.body;
        try {
            const user = await updateUser.execute(id, { name, email, password });
            res.status(200).json({ message: "User updated successfully.", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: User ID
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       400:
     *         description: Deletion error
     */
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await deleteUser.execute(id);
            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    return router;
};
