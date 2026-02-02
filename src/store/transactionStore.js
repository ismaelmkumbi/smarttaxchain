import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Transaction store for persistent multi-transaction support
const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      fraudAlerts: [],
      aggregatedStats: {
        totalTransactions: 0,
        totalRevenue: 0,
        totalVAT: 0,
        fraudDetected: 0,
        complianceRate: 100,
      },

      // Add a new transaction
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          blockNumber: get().transactions.length + 1,
          status: 'confirmed',
        };

        set((state) => {
          const updatedTransactions = [...state.transactions, newTransaction];
          const updatedFraudAlerts = transaction.fraudDetected 
            ? [...state.fraudAlerts, { ...newTransaction, alertType: 'VAT_MISMATCH' }]
            : state.fraudAlerts;

          // Update aggregated stats
          const totalRevenue = updatedTransactions.reduce((sum, tx) => sum + tx.originalAmount, 0);
          const totalVAT = updatedTransactions.reduce((sum, tx) => sum + tx.calculatedVAT, 0);
          const fraudCount = updatedTransactions.filter(tx => tx.fraudDetected).length;
          const complianceRate = updatedTransactions.length > 0 
            ? ((updatedTransactions.length - fraudCount) / updatedTransactions.length) * 100 
            : 100;

          return {
            transactions: updatedTransactions,
            fraudAlerts: updatedFraudAlerts,
            aggregatedStats: {
              totalTransactions: updatedTransactions.length,
              totalRevenue,
              totalVAT,
              fraudDetected: fraudCount,
              complianceRate: Math.round(complianceRate * 100) / 100,
            },
          };
        });

        return newTransaction;
      },

      // Clear all transactions (for demo purposes)
      clearTransactions: () => set({
        transactions: [],
        fraudAlerts: [],
        aggregatedStats: {
          totalTransactions: 0,
          totalRevenue: 0,
          totalVAT: 0,
          fraudDetected: 0,
          complianceRate: 100,
        },
      }),

      // Get recent transactions (last N)
      getRecentTransactions: (limit = 10) => {
        const { transactions } = get();
        return transactions.slice(-limit).reverse();
      },

      // Get fraud alerts
      getFraudAlerts: () => get().fraudAlerts,

      // Mark fraud alert as resolved
      resolveFraudAlert: (transactionId) => set((state) => ({
        fraudAlerts: state.fraudAlerts.filter(alert => alert.id !== transactionId),
      })),
    }),
    {
      name: 'smart-tax-chain-transactions',
      version: 1,
    }
  )
);

export default useTransactionStore;
