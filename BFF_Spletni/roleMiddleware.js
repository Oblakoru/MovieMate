const roleMiddleware = async (ctx, next) => {
  // If the user is an admin OR the user owns the resource, allow the operation
  if (ctx.state.user.role === "admin" || ctx.state.user.userId == ctx.params.id) {
    await next();
  } else {
    console.log(ctx.params.id)
    console.log(ctx.state.user.userId);  // Log userId for debugging
    ctx.status = 403;
    ctx.body = { error: "Access denied. Insufficient permissions." };
    return;
  }
};

module.exports = roleMiddleware;