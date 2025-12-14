const express = require("express");
const expenseRoutes = require("./routes/expense.routes");
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:8080',
      'http://localhost:5173',
      'https://pocket-ledger-a8gkmtv9s-vikashinis-projects-b530bf2a.vercel.app'
    ];
    
    // Allow dynamic Vercel preview URLs for your project
    const isVercelPreview = origin && /^https:\/\/pocket-ledger-.*-vikashinis-projects-b530bf2a\.vercel\.app$/.test(origin);

    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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

module.exports = app;