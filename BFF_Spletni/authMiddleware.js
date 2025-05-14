const jwt = require("jsonwebtoken");

const jwtMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token after 'Bearer'

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Missing token for access." };
    return;
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded; // Add the decoded user to ctx.state
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: "Invalid or expired token." };
  }
};

module.exports = jwtMiddleware;