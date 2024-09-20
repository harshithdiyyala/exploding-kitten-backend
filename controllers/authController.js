// controllers/authController.js
const User = require("../models/user")
const generateToken = require("../utils/generateToken")

// Register User
exports.registerUser = async (req, res) => {
  const { username, password } = req.body

  try {
    let userExists = await User.findOne({ username })
    if (userExists) return res.status(400).json({ msg: "Username already exists" })

    const user = await User.create({ username, password })
    res.status(201).json({
      msg: "User registered",
      user: {
        _id: user._id,
        username: user.username,
        points: user.points,
        token: generateToken(user._id),
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Login User
exports.loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (user && (await user.matchPassword(password))) {
      res.json({
        msg: "User logged in",
        user: {
          _id: user._id,
          username: user.username,
          points: user.points,
          token: generateToken(user._id),
        },
      })
    } else {
      res.status(401).json({ msg: "Invalid credentials" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
