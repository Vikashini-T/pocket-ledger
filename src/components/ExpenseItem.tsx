import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import type { Expense } from '@/services/expenseService';

// Category color mapping for visual distinction
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'bg-orange-100 text-orange-700',
  'Transportation': 'bg-blue-100 text-blue-700',
  'Shopping': 'bg-pink-100 text-pink-700',
  'Entertainment': 'bg-purple-100 text-purple-700',
  'Bills & Utilities': 'bg-yellow-100 text-yellow-700',
  'Healthcare': 'bg-red-100 text-red-700',
  'Education': 'bg-indigo-100 text-indigo-700',
  'Travel': 'bg-cyan-100 text-cyan-700',
  'Other': 'bg-gray-100 text-gray-700',
};

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const ExpenseItem = ({ expense, onEdit, onDelete, isDeleting }: ExpenseItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format amount with currency
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get category color classes
  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    onDelete(expense._id);
    setIsDialogOpen(false);
  };

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Expense Details */}
          <div className="flex-1 space-y-2">
            {/* Title and Amount */}
            <div className="flex items-start justify-between sm:justify-start sm:gap-4">
              <h3 className="font-display font-semibold text-foreground text-lg">
                {expense.title}
              </h3>
              <span className="font-display font-bold text-primary text-xl sm:hidden">
                {formatAmount(expense.amount)}
              </span>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  expense.category
                )}`}
              >
                <Tag className="h-3 w-3" />
                {expense.category}
              </span>

              {/* Date */}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(expense.date)}
              </span>

              {/* Notes indicator */}
              {expense.notes && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Has notes
                </span>
              )}
            </div>

            {/* Notes Preview */}
            {expense.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {expense.notes}
              </p>
            )}
          </div>

          {/* Amount (Desktop) and Actions */}
          <div className="flex items-center gap-4">
            {/* Amount - Desktop only */}
            <span className="hidden sm:block font-display font-bold text-primary text-2xl min-w-[100px] text-right">
              {formatAmount(expense.amount)}
            </span>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(expense)}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              {/* Delete with Confirmation Dialog */}
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Delete Expense?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{expense.title}"? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;
