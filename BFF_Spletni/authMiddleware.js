const jwt = require("jsonwebtoken");

const jwtMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Missing token for access." };
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded; 
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: "Invalid or expired token." };
  }
};

module.exports = jwtMiddleware;