const Router = require("koa-router");
const axios = require("axios");

const userRouter = new Router({
  prefix: "/users",
});

const USER_SERVICE_URL = "http://localhost:3000/users";

// POST /users/register
userRouter.post("/register", async (ctx) => {
  const userData = ctx.request.body;
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/register`, userData);
    ctx.status = response.status;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = error.response?.status || 500;
    ctx.body = error.response?.data || { error: "Napaka pri registraciji." };
  }
});

// POST /users/login
userRouter.post("/login", async (ctx) => {
  const loginData = ctx.request.body;
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, loginData);
    ctx.status = response.status;
    ctx.body = response.data;
  } catch (error) {
    ctx.status = error.response?.status || 500;
    ctx.body = error.response?.data || { error: "Napaka pri prijavi." };
  }
});

// GET /users
userRouter.get("/", async (ctx) => {
  const response = await axios.get(`${USER_SERVICE_URL}`);
  ctx.body = response.data;
});

// GET /users/:id
userRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const response = await axios.get(`${USER_SERVICE_URL}/${id}`);
  ctx.body = response.data;
});

// PUT /users/:id
userRouter.put("/:id", async (ctx) => {
  const { id } = ctx.params;
  const updatedUser = ctx.request.body;
  const response = await axios.put(`${USER_SERVICE_URL}/${id}`, updatedUser);
  ctx.body = response.data;
});

// DELETE /users/:id
userRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params;
  const response = await axios.delete(`${USER_SERVICE_URL}/${id}`);
  ctx.status = response.status;
  ctx.body = response.data;
});

module.exports = userRouter;