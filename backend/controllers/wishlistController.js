const Wishlist = require("../models/Wishlist");

exports.get = async (req, res, next) => {
  try {
    res.json({
      books:
        (
          await Wishlist.findOne({ user: req.userId }).populate({
            path: "books",
            populate: { path: "seller", select: "name email phone" },
          })
        )?.books || [],
    });
  } catch (error) {
    next(error);
  }
};
exports.add = async (req, res, next) => {
  try {
    const list = await Wishlist.findOneAndUpdate(
      { user: req.userId },
      { $addToSet: { books: req.params.bookId } },
      { upsert: true, new: true },
    );
    res.json(list);
  } catch (error) {
    next(error);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const list = await Wishlist.findOneAndUpdate(
      { user: req.userId },
      { $pull: { books: req.params.bookId } },
      { new: true },
    );
    res.json(list || { books: [] });
  } catch (error) {
    next(error);
  }
};
