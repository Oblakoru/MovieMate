const axios = require('axios');

const REVIEW_SERVICE_URL = "http://localhost:8080/reviews"; 

const reviewOwnershipMiddleware = async (ctx, next) => {
  const reviewId = ctx.params.id;
  const loggedInUserId = ctx.state.user.userId; 

  try {
    const response = await axios.get(`${REVIEW_SERVICE_URL}/${reviewId}`);
    const review = response.data;

    if (!review) {
      ctx.status = 404;
      ctx.body = { error: "Review not found." };
      return;
    }

    const reviewUserId = review.userId;

    if (ctx.state.user.role === "admin" || reviewUserId == loggedInUserId) {
      await next();
    } else {
      console.log("Review ID:", reviewId);
      console.log("Review User ID:", reviewUserId);
      console.log("Logged In User ID:", loggedInUserId);
      ctx.status = 403;
      ctx.body = { error: "Access denied. You do not have permission to manage this review." };
      return;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      ctx.status = 404;
      ctx.body = { error: "Review not found." };
    } else {
      console.error("Error fetching review:", error);
      ctx.status = 500;
      ctx.body = { error: "Internal server error while checking review ownership." };
    }
    return;
  }
};

module.exports = reviewOwnershipMiddleware;