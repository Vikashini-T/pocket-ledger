import axios from 'axios';

// Configurable base URL - change this to your backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expense interface
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// Type for creating/updating expense (without _id)
export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// API service functions
export const expenseService = {
  // Fetch all expenses
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses');
    return response.data;
  },

  // Fetch single expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expense: ExpenseInput): Promise<Expense> => {
    const response = await api.post<Expense>('/expenses', expense);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (id: string, expense: ExpenseInput): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}`, expense);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

export default expenseService;
