// app.js
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const cors = require("cors")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Initialize Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/games", require("./routes/gameRoutes"))

// Error Handling Middleware (optional)
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
app.use(notFound)
app.use(errorHandler)

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
