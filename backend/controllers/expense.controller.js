const mongoose = require("mongoose");
const Expense = require("../models/expense.model");

/**
 * @desc Create new expense
 * @route POST /api/expenses
 */
exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, amount and category are required"
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      notes
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all expenses (with pagination, filter, sort)
 * @route GET /api/expenses
 */
exports.getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, sortBy = "date" } = req.query;

    const query = {};
    if (category) query.category = category;

    const expenses = await Expense.find(query)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get expense by ID
 * @route GET /api/expenses/:id
 */
exports.getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID"
      });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update expense
 * @route PUT /api/expenses/:id
 */
exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID"
      });
    }

    const expense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete expense
 * @route DELETE /api/expenses/:id
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID"
      });
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
