import { User } from "../context/AuthContext";
import { WalletBalance, Transaction } from "../context/WalletContext";

export const mockUser: User = {
  id: "user-123",
  email: "trader@example.com",
  name: "John Trader",
  accountStatus: "active",
  createdAt: new Date("2024-01-15"),
  referralCode: "REF0ABCD1234",
};

// export const mockWalletBalance: WalletBalance = {
//   mainWallet: 5000.0,
//   activeDeposit: 46500.0,
//   profitBalance: 1200.0,
//   referralBonus: 300.0,
//   totalInvestment: 46500.0,
// };

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1001",
    type: "deposit",
    amount: 50000,
    fee: 500,
    netAmount: 49500,
    status: "completed",
    timestamp: new Date("2024-12-20"),
    description: "Deposit via Bank Transfer",
  },
  {
    id: "txn-1002",
    type: "profit",
    amount: 5000,
    fee: 50,
    netAmount: 4950,
    status: "completed",
    timestamp: new Date("2024-12-18"),
    description: "Monthly Profit Distribution",
  },
  {
    id: "txn-1003",
    type: "deposit",
    amount: 25000,
    fee: 250,
    netAmount: 24750,
    status: "completed",
    timestamp: new Date("2024-12-15"),
    description: "Deposit via Credit Card",
  },
  {
    id: "txn-1004",
    type: "referral",
    amount: 1500,
    fee: 0,
    netAmount: 1500,
    status: "completed",
    timestamp: new Date("2024-12-10"),
    description: "Referral Bonus",
  },
  {
    id: "txn-1005",
    type: "withdrawal",
    amount: 10000,
    fee: 100,
    netAmount: 9900,
    status: "completed",
    timestamp: new Date("2024-12-05"),
    description: "Profit Withdrawal",
  },
  {
    id: "txn-1006",
    type: "profit",
    amount: 7450.5,
    fee: 74.5,
    netAmount: 7376,
    status: "completed",
    timestamp: new Date("2024-11-20"),
    description: "Monthly Profit Distribution",
  },
];

export const mockChartData = [
  { time: "00:00", price: 45230, volume: 1200 },
  { time: "04:00", price: 45450, volume: 1500 },
  { time: "08:00", price: 45120, volume: 1800 },
  { time: "12:00", price: 45680, volume: 2100 },
  { time: "16:00", price: 45890, volume: 1900 },
  { time: "20:00", price: 46120, volume: 1600 },
  { time: "24:00", price: 46450, volume: 1400 },
];

export const mockReferralData = {
  totalReferred: 42,
  totalBonus: 12450.25,
  rank: "Silver Partner",
  nextRankTarget: 50,
  referralLink: "https://trading-platform.com/ref/REF0ABCD1234",
  referrals: [
    {
      id: "ref-1",
      name: "Alice Johnson",
      email: "alice@example.com",
      joinedDate: new Date("2024-11-15"),
      status: "active",
      bonus: 2500,
    },
    {
      id: "ref-2",
      name: "Bob Smith",
      email: "bob@example.com",
      joinedDate: new Date("2024-11-20"),
      status: "active",
      bonus: 1800,
    },
    {
      id: "ref-3",
      name: "Carol Williams",
      email: "carol@example.com",
      joinedDate: new Date("2024-12-01"),
      status: "active",
      bonus: 950,
    },
  ],
};
