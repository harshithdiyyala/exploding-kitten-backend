// models/Game.js
const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gameState: {
    deck: { type: [String], required: true },
    defuseCard: { type: Boolean, default: false },
  },
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Game", GameSchema)
