const Router = require("koa-router");
const axios = require("axios");

const reviewRouter = new Router({
  prefix: "/reviews",
});

const REVIEW_SERVICE_URL = "http://localhost:8080/reviews"; // prilagodi port tvoji Quarkus storitvi

// GET /reviews
reviewRouter.get("/", async (ctx) => {
  const res = await axios.get(`${REVIEW_SERVICE_URL}`);
  ctx.body = res.data;
});

// GET /reviews/:id
reviewRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const res = await axios.get(`${REVIEW_SERVICE_URL}/${id}`);
  ctx.body = res.data;
});

// GET /reviews/movie/:movieId
reviewRouter.get("/movie/:movieId", async (ctx) => {
  const { movieId } = ctx.params;
  const res = await axios.get(`${REVIEW_SERVICE_URL}/movie/${movieId}`);
  ctx.body = res.data;
});

// POST /reviews
reviewRouter.post("/", async (ctx) => {
  const review = ctx.request.body;
  const res = await axios.post(`${REVIEW_SERVICE_URL}`, review);
  ctx.status = res.status;
});

// PUT /reviews/:id
reviewRouter.put("/:id", async (ctx) => {
  const { id } = ctx.params;
  const updatedReview = ctx.request.body;
  const res = await axios.put(`${REVIEW_SERVICE_URL}/${id}`, updatedReview);
  ctx.status = res.status;
});

// DELETE /reviews/:id
reviewRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params;
  const res = await axios.delete(`${REVIEW_SERVICE_URL}/${id}`);
  ctx.status = res.status;
});

module.exports = reviewRouter;
