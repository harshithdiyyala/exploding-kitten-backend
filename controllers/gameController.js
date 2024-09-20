// controllers/gameController.js
const Game = require("../models/game")
const user = require("../models/user")
const User = require("../models/user")

// Start a new game
exports.startGame = async (req, res) => {
  const userId = req.user._id

  // Initialize deck with codes
  const cards = ["CAT", "DEFUSE", "SHUFFLE", "BOMB"]
  const deck = []
  for (let i = 0; i < 5; i++) {
    deck.push(cards[Math.floor(Math.random() * cards.length)])
  }

  const gameState = {
    deck,
    defuseCard: false,
  }

  try {
    // Check if there's an existing in-progress game
    let game = await Game.findOne({ userId, status: "in_progress" })

    if (game) {
      // Return existing game
      return res.status(200).json({
        msg: "Resuming existing game",
        gameId: game._id,
        gameState: game.gameState,
      })
    }

    // Create a new game
    game = new Game({
      userId,
      gameState,
      status: "in_progress",
    })

    await game.save()

    res.status(201).json({ msg: "Game started", gameId: game._id, gameState: game.gameState })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Play a move (draw a card)
exports.playMove = async (req, res) => {
  const { gameId } = req.body
  const userId = req.user._id

  try {
    const game = await Game.findOne({ _id: gameId, userId, status: "in_progress" })

    if (!game) return res.status(404).json({ msg: "Game not found or already completed" })

    let { deck, defuseCard } = game.gameState

    if (deck.length === 0) {
      return res.status(400).json({ msg: "No more cards to draw" })
    }

    const card = deck.shift() // Draw the top card
    let message = ""
    let gameOver = false
    let didWin = false

    switch (card) {
      case "CAT":
        message = "You drew a Cat card."
        break
      case "DEFUSE":
        defuseCard = true
        message = "You drew a Defuse card!"
        break
      case "SHUFFLE":
        // Debugging: Log the deck before shuffling
        console.log("Deck before shuffle:", deck)

        // Reshuffle the deck
        deck = deck.sort(() => Math.random() - 0.5)

        // Debugging: Log the deck after shuffling
        console.log("Deck after shuffle:", deck)

        message = "Deck shuffled!"
        break
      case "BOMB":
        if (defuseCard) {
          defuseCard = false
          message = "You defused the Exploding Kitten!"
        } else {
          message = "You drew an Exploding Kitten and lost!"
          gameOver = true
        }
        break
      default:
        message = "Unknown card."
    }

    // Update game state
    game.gameState.deck = deck
    game.gameState.defuseCard = defuseCard
    game.updatedAt = Date.now()

    if (deck.length === 0 && !gameOver) {
      // Player wins
      gameOver = true
      didWin = true
      message = "You have drawn all cards and won the game!"
    }

    if (gameOver) {
      game.status = "completed"
      await game.save()

      // Update user points if they won
      if (didWin) {
        const user = await User.findById(userId)
        user.points += 1
        await user.save()
      }

      return res.status(200).json({
        msg: message,
        gameOver: true,
        didWin,
        points: didWin ? user.points : undefined,
      })
    }

    await game.save()

    res.status(200).json({
      msg: message,
      deckSize: deck.length,
      gameState: game.gameState,
      gameOver: false,
    })
  } catch (err) {
    console.error("Error in playMove:", err)
    res.status(500).json({ error: err.message })
  }
}

// Retrieve current game state
exports.getGameState = async (req, res) => {
  const userId = req.user._id

  try {
    const game = await Game.findOne({ userId, status: "in_progress" })

    if (!game) return res.status(404).json({ msg: "No ongoing game found" })

    res.status(200).json({ gameId: game._id, gameState: game.gameState })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
