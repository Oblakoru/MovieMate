const express = require("express");
const usersRouter = require("./routes/users");
const UserRepository = require("./src/infrastructure/UserRepository");

const app = express();
app.use(express.json());

const userRepository = new UserRepository();

app.use("/users", usersRouter(userRepository)); r

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server teče na http://localhost:${PORT}`));

