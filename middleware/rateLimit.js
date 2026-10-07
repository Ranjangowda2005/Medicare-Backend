import rateLimit from "express-rate-limit";

export const rateLimitation = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: {
    message: "Too many request... try to login later",
  },
});
