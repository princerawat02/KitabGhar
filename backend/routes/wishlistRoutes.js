const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/wishlistController");
router.use(auth);
router.get("/", controller.get);
router.post("/:bookId", controller.add);
router.delete("/:bookId", controller.remove);
module.exports = router;
