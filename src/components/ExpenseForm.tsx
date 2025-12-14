import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, X } from 'lucide-react';
import type { Expense, ExpenseInput } from '@/services/expenseService';

// Predefined expense categories
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseInput) => Promise<void>;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
  isLoading?: boolean;
}

const ExpenseForm = ({
  onSubmit,
  editingExpense,
  onCancelEdit,
  isLoading = false,
}: ExpenseFormProps) => {
  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      // Format date for input field (YYYY-MM-DD)
      setDate(editingExpense.date.split('T')[0]);
      setNotes(editingExpense.notes || '');
    }
  }, [editingExpense]);

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setNotes('');
    setErrors({});
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const expenseData: ExpenseInput = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      notes: notes.trim(),
    };

    await onSubmit(expenseData);
    
    // Reset form after successful submission (only for new expenses)
    if (!editingExpense) {
      resetForm();
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-xl flex items-center gap-2">
          {editingExpense ? (
            <>
              <Save className="h-5 w-5 text-primary" />
              Edit Expense
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-primary" />
              Add New Expense
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                'Saving...'
              ) : editingExpense ? (
                <>
                  <Save className="h-4 w-4" />
                  Update Expense
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Expense
                </>
              )}
            </Button>
            
            {editingExpense && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
