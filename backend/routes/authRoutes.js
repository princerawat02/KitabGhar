const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/authController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", auth, controller.me);
router.put("/profile", auth, controller.update);
module.exports = router;
