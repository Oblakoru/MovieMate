const Router = require("koa-router");
const client = require("../client");
const jwtMiddleware = require("../authMiddleware");
const roleMiddleware = require("../roleMiddleware");


const router = new Router({
  prefix: "/movies",
});

// Create movie
router.post("/", jwtMiddleware, async (ctx) => {
  const data = ctx.request.body;
  await new Promise((resolve, reject) => {
    client.CreateMovie(data, (err, res) => {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
        return reject(err);
      }
      ctx.body = res;
      resolve();
    });
  });
});

// Get movie by ID
router.get("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  await new Promise((resolve, reject) => {
    client.GetMovieById({ id }, (err, res) => {
      if (err) {
        ctx.status = 404;
        ctx.body = { error: err.message };
        return reject(err);
      }
      ctx.body = res;
      resolve();
    });
  });
});

// Search movies
router.get("/", async (ctx) => {
  const query = ctx.query.q;
  if (!query) {
    ctx.status = 400;
    ctx.body = { error: "Missing search query (?q=)" };
    return;
  }

  await new Promise((resolve, reject) => {
    client.SearchMovies({ query }, (err, res) => {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
        return reject(err);
      }
      ctx.body = res.movies;
      resolve();
    });
  });
});

// Update movie
router.put("/:id", jwtMiddleware, roleMiddleware, async (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const data = { ...ctx.request.body, id };

  await new Promise((resolve, reject) => {
    client.UpdateMovie(data, (err, res) => {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
        return reject(err);
      }
      ctx.body = res;
      resolve();
    });
  });
});

// Delete movie
router.delete("/:id", jwtMiddleware, roleMiddleware, async (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  await new Promise((resolve, reject) => {
    client.DeleteMovie({ id }, (err, res) => {
      if (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
        return reject(err);
      }
      ctx.body = res;
      resolve();
    });
  });
});

module.exports = router;
