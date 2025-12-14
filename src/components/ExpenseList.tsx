import ExpenseItem from '@/components/ExpenseItem';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import type { Expense } from '@/services/expenseService';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  deletingId?: string | null;
}

const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  isLoading,
  error,
  deletingId,
}: ExpenseListProps) => {
  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Format total amount
  const formatTotal = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="shadow-card border-destructive/20 bg-destructive/5">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">
            Failed to Load Expenses
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-12 text-center">
          <Receipt className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">
            No Expenses Yet
          </h3>
          <p className="text-muted-foreground">
            Start tracking your spending by adding your first expense above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <h2 className="font-display font-semibold text-xl flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Your Expenses
          <span className="text-muted-foreground font-normal text-base">
            ({expenses.length})
          </span>
        </h2>
        <div className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-muted-foreground">Total:</span>
          <span className="font-display font-bold text-primary">
            {formatTotal(totalAmount)}
          </span>
        </div>
      </div>

      {/* Expense Items */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === expense._id}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
