const express = require("express");
const expenseRoutes = require("./routes/expense.routes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

module.exports = app;
