// routes/gameRoutes.js
const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { startGame, playMove, getGameState } = require("../controllers/gamecontroller")

router.post("/start", protect, startGame)
router.post("/move", protect, playMove)
router.get("/state", protect, getGameState)

module.exports = router
