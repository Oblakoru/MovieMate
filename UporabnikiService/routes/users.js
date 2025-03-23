module.exports = (userRepository) => {
    const express = require("express");
    const RegisterUser = require("../src/application/RegisterUser");
    const LoginUser = require("../src/application/LoginUser");

    const router = express.Router();
    const registerUser = new RegisterUser(userRepository);
    const loginUser = new LoginUser(userRepository);

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
     * /register:
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
     * /login:
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

    return router;
};
