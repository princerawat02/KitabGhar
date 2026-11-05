const Book = require("../models/Book");
const { getISTDate } = require("../utils/date");

exports.list = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.search)
      query.$or = [
        { title: new RegExp(req.query.search, "i") },
        { author: new RegExp(req.query.search, "i") },
      ];
    if (req.query.category && req.query.category !== "All Books")
      query.category = req.query.category;
    if (req.query.condition) query.condition = req.query.condition;
    if (req.query.maxPrice)
      query.sellingPrice = { $lte: Number(req.query.maxPrice) };
    const sort =
      req.query.sort === "price-low"
        ? { sellingPrice: 1 }
        : req.query.sort === "price-high"
          ? { sellingPrice: -1 }
          : { createdAt: -1 };
    res.json({
      books: await Book.find(query)
        .populate("seller", "name email phone profileImage")
        .sort(sort),
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "seller",
      "name email phone profileImage",
    );
    if (!book)
      return res.status(404).json({ message: "Book listing not found." });
    res.json({ book });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const now = getISTDate();
    res.status(201).json({
      book: await Book.create({
        ...req.body,
        seller: req.userId,
        createdAt: now,
        updatedAt: now,
      }),
    });
  } catch (error) {
    next(error);
  }
};

exports.mine = async (req, res, next) => {
  try {
    res.json({
      books: await Book.find({ seller: req.userId }).sort({ createdAt: -1 }),
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const editableFields = [
      "title",
      "author",
      "category",
      "description",
      "originalPrice",
      "sellingPrice",
      "condition",
      "image",
      "status",
    ];
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => Object.hasOwn(req.body, field))
        .map((field) => [field, req.body[field]]),
    );
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      updates,
      { returnDocument: "after", runValidators: true },
    );
    if (!book)
      return res
        .status(404)
        .json({ message: "Listing not found or not owned by you." });
    res.json({ book });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId,
    });
    if (!book)
      return res
        .status(404)
        .json({ message: "Listing not found or not owned by you." });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
