"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface MoneyState {
  balance: number;
  transactions: Transaction[];
}

const moneyAtom = atomWithStorage<Record<string, MoneyState>>(
  "penal:money",
  {},
);

export function useMoney(widgetId: string) {
  const [all, setAll] = useAtom(moneyAtom);
  const state = all[widgetId] ?? { balance: 0, transactions: [] };

  const update = (updater: (prev: MoneyState) => MoneyState) => {
    setAll((prev) => ({
      ...prev,
      [widgetId]: updater(prev[widgetId] ?? { balance: 0, transactions: [] }),
    }));
  };

  const setBalance = (balance: number) => {
    update((prev) => ({ ...prev, balance }));
  };

  const addTransaction = (title: string, amount: number) => {
    const today = new Date().toISOString().slice(0, 10);
    update((prev) => ({
      balance: prev.balance + amount,
      transactions: [
        { id: `tx-${Date.now()}`, title, amount, date: today },
        ...prev.transactions,
      ],
    }));
  };

  const removeTransaction = (id: string) => {
    update((prev) => {
      const tx = prev.transactions.find((t) => t.id === id);
      return {
        balance: tx ? prev.balance - tx.amount : prev.balance,
        transactions: prev.transactions.filter((t) => t.id !== id),
      };
    });
  };

  return {
    balance: state.balance,
    transactions: state.transactions,
    setBalance,
    addTransaction,
    removeTransaction,
  };
}
