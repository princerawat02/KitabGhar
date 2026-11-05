const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    originalPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    condition: {
      type: String,
      enum: ["Like New", "Good", "Acceptable"],
      required: true,
    },
    image: { type: String, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["available", "sold"], default: "available" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
