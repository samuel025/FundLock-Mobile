import {
  BudgetAnalytics,
  CategoryBreakdown,
  TopCategory,
  WeeklySpending,
  getBudgetAnalytics,
} from "@/services/analytics";
import { useQuery } from "@tanstack/react-query";

// Configuration flag - set to false when API is ready
const USE_MOCK_DATA = true;

// Mock data generator
function generateMockAnalytics(month: number, year: number): BudgetAnalytics {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate category breakdown
  const categories = [
    { name: "Food & Dining", color: "#F97316" },
    { name: "Transportation", color: "#3B82F6" },
    { name: "Shopping", color: "#A855F7" },
    { name: "Entertainment", color: "#EC4899" },
    { name: "Bills & Utilities", color: "#EAB308" },
    { name: "Health & Medical", color: "#EF4444" },
    { name: "Education", color: "#06B6D4" },
    { name: "Groceries", color: "#10B981" },
  ];

  const categoryBreakdown: CategoryBreakdown[] = categories.map((cat, idx) => {
    const budgeted = Math.floor(Math.random() * 50000) + 20000;
    const spent = Math.floor(budgeted * (0.3 + Math.random() * 0.6));
    const remaining = budgeted - spent;
    const percentUsed = (spent / budgeted) * 100;

    return {
      categoryId: `cat-${idx}`,
      categoryName: cat.name,
      budgeted,
      spent,
      remaining,
      percentUsed,
    };
  });

  // Calculate totals
  const totalBudgeted = categoryBreakdown.reduce(
    (sum, cat) => sum + cat.budgeted,
    0,
  );
  const totalSpent = categoryBreakdown.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  // Generate weekly spending data (4-5 weeks per month)
  const daysInMonth = new Date(year, month, 0).getDate();
  const numberOfWeeks = Math.ceil(daysInMonth / 7);
  const weeklySpending: WeeklySpending[] = [];

  for (let week = 1; week <= numberOfWeeks; week++) {
    const weekStartDay = (week - 1) * 7 + 1;
    const weekEndDay = Math.min(week * 7, daysInMonth);

    const startDate = new Date(year, month - 1, weekStartDay);
    const endDate = new Date(year, month - 1, weekEndDay);

    // Random spending between 5k and 25k per week
    const amount = Math.floor(Math.random() * 20000) + 5000;

    weeklySpending.push({
      weekNumber: week,
      weekLabel: `Week ${week}`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      amount,
    });
  }

  // Sort categories by spending to get top categories
  const sortedBySpending = [...categoryBreakdown].sort(
    (a, b) => b.spent - a.spent,
  );

  const topCategories: TopCategory[] = sortedBySpending
    .slice(0, 5)
    .map((cat) => {
      const percentage = (cat.spent / totalSpent) * 100;
      return {
        categoryName: cat.categoryName,
        amount: cat.spent,
        percentage,
      };
    });

  return {
    month: monthNames[month - 1],
    year,
    totalBudgeted,
    totalSpent,
    totalRemaining,
    categoryBreakdown,
    weeklySpending,
    topCategories,
  };
}

// Fetch function for TanStack Query
async function fetchBudgetAnalytics(
  month: number,
  year: number,
): Promise<BudgetAnalytics> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateMockAnalytics(month, year);
  } else {
    return await getBudgetAnalytics(month, year);
  }
}

export function useBudgetAnalytics(month: number, year: number) {
  return useQuery({
    queryKey: ["budgetAnalytics", month, year],
    queryFn: () => fetchBudgetAnalytics(month, year),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
