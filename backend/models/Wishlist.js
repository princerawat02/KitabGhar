const mongoose = require("mongoose");
const { getISTDate } = require("../utils/date.js");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  createdAt: {
    type: String,
    default: getISTDate,
  },
  updatedAt: {
    type: String,
    default: getISTDate,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
