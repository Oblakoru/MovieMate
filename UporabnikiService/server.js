const express = require("express");
const usersRouter = require("./routes/users");
const morgan = require("morgan");
const UserRepository = require("./src/infrastructure/UserRepository");
const setupSwagger = require("./swagger");

const app = express();
app.use(express.json());

setupSwagger(app);

app.use(morgan('dev')); 

const userRepository = new UserRepository();

app.use("/users", usersRouter(userRepository)); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server teče na http://localhost:${PORT}`));

