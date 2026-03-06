import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { apiClient } from "@/services/api";
import { useAuth } from "./AuthContext";
export interface WalletBalance {
  mainWallet: number;
  inscrease_mainWallet : number;
  inscrease_percentage_mainWallet_possitive : boolean;
  activeDeposit: number;
  inscrease_percentage_activeDeposit: number;
  increase_activeDeposit_positive :boolean;
  profitBalance: number;
  inscrease_percentage_profitBalance: number;
  inscrease_profitBalance_positive: boolean;
  referralBonus: number;
  inscrease_percentage_referralBonus: number;
  inscrease_referralBonus_positive: boolean;
  totalInvestment: number;
  inscrease_percentage_totalInvestment: number;
  inscrease_percentage_totalInvestment_positive: boolean;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "profit" | "referral";
  amount: number;
  fee: number;
  netAmount: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  description: string;
}

export interface WalletState {
  balance: WalletBalance;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

type WalletAction =
  | { type: "SET_BALANCE"; payload: WalletBalance }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_BALANCE"; payload: Partial<WalletBalance> };

const initialState: WalletState = {
  balance: {
    mainWallet: 0,
  inscrease_mainWallet : 0,
  inscrease_percentage_mainWallet_possitive : false,
  activeDeposit: 0,
  inscrease_percentage_activeDeposit: 0,
  increase_activeDeposit_positive :false,
  profitBalance: 0,
  inscrease_percentage_profitBalance: 0,
  inscrease_profitBalance_positive: false,
  referralBonus:0,
  inscrease_percentage_referralBonus: 0,
  inscrease_referralBonus_positive: false,
  totalInvestment: 0,
  inscrease_percentage_totalInvestment: 0,
  inscrease_percentage_totalInvestment_positive:false,
  },
  transactions: [],
  isLoading: false,
  error: null,
};

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "SET_BALANCE":
      return { ...state, balance: action.payload };
    case "UPDATE_BALANCE":
      return {
        ...state,
        balance: { ...state.balance, ...action.payload },
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface WalletContextType extends WalletState {
  updateBalance: (partial: Partial<WalletBalance>) => void;
  addTransaction: (transaction: Transaction) => void;
  getTransactionHistory: () => Promise<void>;
  fetchWalletBalance: () => Promise<void>; // 👈 add this
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const { user } = useAuth();

  const updateBalance = (partial: Partial<WalletBalance>) => {
    dispatch({ type: "UPDATE_BALANCE", payload: partial });
  };

  const fetchWalletBalance = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const res = await apiClient.get<WalletBalance>(`/users/wallet/balance`);

      dispatch({
        type: "SET_BALANCE",
        payload: res.data,
      });

      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load wallet balance",
      });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });
  };

  const getTransactionHistory = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to load transactions",
      });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: WalletContextType = {
    ...state,
    updateBalance,
    addTransaction,
    getTransactionHistory,
    fetchWalletBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
