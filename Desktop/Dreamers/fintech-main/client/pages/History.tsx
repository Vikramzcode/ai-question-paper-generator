import { useEffect, useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { formatCurrency, formatDate } from "@/utils/formatting";
import { Eye, Filter, Loader2 } from "lucide-react";
import { apiClient } from "@/services/api";

interface Transaction {
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

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get<{ data: Transaction[] }>(
          "/users/transaction/history?limit=100"
        );

        setTransactions(res.data.data);
        setFilteredTransactions(res.data.data);
      } catch (error: any) {
        console.error("Failed to fetch transactions", error);
        setError(error.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((txn) => {
        const type = txn.type?.toLowerCase() || "";
        if (filter === "deposit") {
          return type.includes("deposit");
        } else if (filter === "withdrawal") {
          return type.includes("withdrawal");
        } else if (filter === "profit") {
          return type.includes("interest") || type.includes("profit");
        } else if (filter === "investment") {
          return type.includes("investment");
        } else if (filter === "transfer") {
          return type.includes("transfer");
        }
        return false;
      });
      setFilteredTransactions(filtered);
    }
  }, [filter, transactions]);

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your deposits, withdrawals, and profits
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "deposit", "withdrawal", "profit", "investment", "transfer"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 border border-white/10 hover:border-white/20 text-muted-foreground"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <GlassCard heavy className="p-8 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading transactions...</span>
          </GlassCard>
        )}

        {error && (
          <GlassCard heavy className="p-4 border-loss/50 flex items-start gap-4">
            <div className="text-loss">⚠️</div>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Transactions Table */}
        {!loading && !error && (
          <GlassCard heavy className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-muted-foreground text-xs uppercase font-semibold">
                  <th className="text-left py-3 px-4">Date & Time</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Fee</th>
                  <th className="text-right py-3 px-4">Net Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-card/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{formatDate(txn.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(txn.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-sm font-medium">
                        {txn.type?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-muted-foreground">
                        {txn.description || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold">
                        {formatCurrency(txn.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-loss">
                        {txn.fee > 0 ? `-${formatCurrency(txn.fee)}` : "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-profit">
                        {formatCurrency(txn.netAmount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                          txn.status?.toLowerCase() === "completed"
                            ? "bg-profit/20 text-profit"
                            : txn.status?.toLowerCase() === "pending"
                            ? "bg-warning/20 text-warning"
                            : "bg-loss/20 text-loss"
                        }`}
                      >
                        {txn.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && !loading && (
              <div className="text-center py-12">
                <Filter
                  className="mx-auto text-muted-foreground opacity-50 mb-3"
                  size={32}
                />
                <p className="text-muted-foreground">
                  {filter === "all" ? "No transactions found" : `No ${filter} transactions found`}
                </p>
              </div>
            )}
          </GlassCard>
        )}

        {/* Summary Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Deposits</p>
              <p className="text-2xl font-bold mt-2 text-profit">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("deposit"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Withdrawn</p>
              <p className="text-2xl font-bold mt-2 text-loss">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("withdrawal"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Profit</p>
              <p className="text-2xl font-bold mt-2 text-profit">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type?.toLowerCase().includes("interest"))
                    .reduce((sum, t) => sum + t.netAmount, 0),
                )}
              </p>
            </GlassCard>
            <GlassCard heavy className="p-6">
              <p className="text-muted-foreground text-sm">Total Transactions</p>
              <p className="text-2xl font-bold mt-2">{transactions.length}</p>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
