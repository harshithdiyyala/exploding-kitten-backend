// routes/userRoutes.js
const express = require("express")
const router = express.Router()
const { getLeaderboard, getUserProfile } = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")

router.get("/leaderboard", getLeaderboard)
router.get("/profile", protect, getUserProfile)

module.exports = router
