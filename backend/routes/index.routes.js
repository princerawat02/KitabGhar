const router = require("express").Router();

const authRoutes = require("./authRoutes");
const bookRoutes = require("./bookRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const database = require("../middleware/database");

router.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "kitabghar-api" }),
);

router.use(database);
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
