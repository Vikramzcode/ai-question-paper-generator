import { apiClient } from "./api";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  fee: number;
  penalty: number;
  netAmount: number;
  status: string;
  referenceId: string | null;
  sourceWallet: string | null;
  destinationWallet: string | null;
  description: string | null;
  timestamp: string;
}

export interface TransactionHistoryResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

class TransactionService {
  /**
   * Get transaction history with optional filters
   */
  async getTransactionHistory(
    filters?: TransactionFilters
  ): Promise<TransactionHistoryResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.type) params.append("type", filters.type);
      if (filters?.status) params.append("status", filters.status);

      const queryString = params.toString();
      const url = `/users/transaction/history${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<TransactionHistoryResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<{ data: Transaction }>(
        `/users/transaction/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
