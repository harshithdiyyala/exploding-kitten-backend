// controllers/userController.js
const User = require("../models/user")

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(10)
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const user = req.user // Obtained from authMiddleware
  res.json({
    _id: user._id,
    username: user.username,
    points: user.points,
  })
}
