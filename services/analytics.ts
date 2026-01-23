import { API } from "@/lib/api";
import axios, { AxiosError } from "axios";

export interface BudgetAnalytics {
  month: string;
  year: number;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  categoryBreakdown: CategoryBreakdown[];
  weeklySpending: WeeklySpending[];
  topCategories: TopCategory[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export interface WeeklySpending {
  weekNumber: number; // 1, 2, 3, 4, 5
  weekLabel: string; // "Week 1", "Week 2", etc.
  startDate: string;
  endDate: string;
  amount: number;
}

export interface TopCategory {
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsResponse {
  status: string;
  message: string;
  data: BudgetAnalytics;
}

interface ErrorResponse {
  status: string;
  message: string;
  data: {
    error: string;
  };
}

export async function getBudgetAnalytics(
  month: number,
  year: number,
): Promise<BudgetAnalytics> {
  try {
    const response = await API.get<AnalyticsResponse>(
      "/api/v1/fundlock/analytics/budgets",
      {
        params: {
          month,
          year,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (!axiosError.response) {
        const customError: any = new Error(
          "Network error. Please check your internet connection.",
        );
        customError.status = 0;
        throw customError;
      }

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.data?.error ||
        "Failed to fetch analytics";

      const customError: any = new Error(errorMessage);
      customError.status = axiosError.response?.status;
      throw customError;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
