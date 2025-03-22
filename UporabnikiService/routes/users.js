const express = require("express");
const UserRepository = require("../src/infrastructure/UserRepository");
const RegisterUser = require("../src/application/RegisterUser");
const LoginUser = require("../src/application/LoginUser");

const router = express.Router();
const userRepository = new UserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await registerUser.execute(name, email, password);
        res.status(201).json({ message: "Uporabnik uspešno registriran.", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser.execute(email, password);
        res.status(200).json({ message: "Prijava uspešna.", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

module.exports = router;