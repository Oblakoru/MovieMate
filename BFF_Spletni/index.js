const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require('koa-cors');
const logger = require('koa-logger');
require('dotenv').config();

const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const movieRoutes = require("./routes/movies"); 

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());
app.use(logger());

router.get("/", (ctx) => {
  ctx.body = { message: "BFF je živ! 🔥" };
});

app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(reviewRoutes.routes()).use(reviewRoutes.allowedMethods());
app.use(movieRoutes.routes()).use(movieRoutes.allowedMethods())
app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
  console.log("✅ BFF za web posluša na http://localhost:3001");
});
