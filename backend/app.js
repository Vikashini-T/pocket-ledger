const express = require("express");
const expenseRoutes = require("./routes/expense.routes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/expenses');
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true
}));


module.exports = app;