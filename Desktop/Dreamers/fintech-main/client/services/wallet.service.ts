import { apiClient } from "./api";
import { WalletBalance, Transaction } from "../context/WalletContext";

export interface DepositRequest {
  amount: number;
  paymentMethod: string;
}

export interface DepositResponse {
  transactionId: string;
  grossAmount: number;
  fee: number;
  netAmount: number;
  timestamp: Date;
}

export interface WithdrawalRequest {
  amount: number;
  type: "PROFIT" | "PRINCIPAL";
}

export interface WithdrawalResponse {
  id: string;
  type: string;
  requested_amount: number;
  platform_fee: number;
  penalty_fee: number;
  net_amount: number;
  status: string;
  ticket_raised_date: string;
  created_at: string;
}

class WalletService {
  async getBalance(): Promise<WalletBalance> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await apiClient.get<WalletBalance>("/wallet/balance");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await apiClient.get<Transaction[]>("/wallet/transactions");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deposit(data: DepositRequest): Promise<DepositResponse> {
    try {
      // TODO: Replace with actual API endpoint
      const response = await apiClient.post<DepositResponse>("/wallet/deposit", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async initiateWithdrawal(data: WithdrawalRequest): Promise<WithdrawalResponse> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; data: WithdrawalResponse }>(
        "/withdrawals/request",
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  isWithdrawalWindowOpen(): boolean {
    const today = new Date();
    const dayOfMonth = today.getDate();
    // Withdrawals allowed from 1st to 5th of month
    return dayOfMonth >= 1 && dayOfMonth <= 5;
  }
}

export const walletService = new WalletService();
