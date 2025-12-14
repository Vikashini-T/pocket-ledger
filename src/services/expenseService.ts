import axios from 'axios';

// Base URL = backend origin only
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Axios instance
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
    const response = await api.get('/api/expenses');

    // response.data is the payload object
    const payload = response.data;

    // Normalize: return the array in payload.data or [] as fallback
    if (payload && Array.isArray(payload.data)) {
      return payload.data as Expense[];
    }

    // If backend changed in future, handle array root too
    if (Array.isArray(payload)) {
      return payload as Expense[];
    }

    return [];
  },

  // Fetch single expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/api/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expense: ExpenseInput): Promise<Expense> => {
    const response = await api.post<Expense>('/api/expenses', expense);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (id: string, expense: ExpenseInput): Promise<Expense> => {
    const response = await api.put<Expense>(`/api/expenses/${id}`, expense);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/api/expenses/${id}`);
  },
};

export default expenseService;
