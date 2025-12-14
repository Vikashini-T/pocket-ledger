import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { useToast } from '@/hooks/use-toast';
import expenseService, { Expense, ExpenseInput } from '@/services/expenseService';
import { Wallet, Sparkles } from 'lucide-react';

const Home = () => {
  // State for expenses data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for form operations
  const [isSaving, setIsSaving] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  // Fetch all expenses on component mount
  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseService.getAllExpenses();
      // Sort by date (newest first)
      const sorted = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenses(sorted);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch expenses';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle form submission (create or update)
  const handleSubmit = async (expenseData: ExpenseInput) => {
    try {
      setIsSaving(true);

      if (editingExpense) {
        // Update existing expense
        const updated = await expenseService.updateExpense(
          editingExpense._id,
          expenseData
        );
        setExpenses((prev) =>
          prev.map((exp) => (exp._id === updated._id ? updated : exp))
        );
        setEditingExpense(null);
        toast({
          title: 'Success',
          description: 'Expense updated successfully!',
        });
      } else {
        // Create new expense
        const created = await expenseService.createExpense(expenseData);
        setExpenses((prev) => [created, ...prev]);
        toast({
          title: 'Success',
          description: 'Expense added successfully!',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save expense';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit button click
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Handle delete expense
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      toast({
        title: 'Deleted',
        description: 'Expense deleted successfully.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete expense';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Expense Tracker
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Track your spending smartly
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Expense Form */}
          <section>
            <ExpenseForm
              onSubmit={handleSubmit}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
              isLoading={isSaving}
            />
          </section>

          {/* Expense List */}
          <section>
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              error={error}
              deletingId={deletingId}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Personal Expense Tracker — Keep your finances in check</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
