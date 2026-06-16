const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUsers,
  getProfile,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
