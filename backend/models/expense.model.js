const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true // creates createdAt & updatedAt
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
