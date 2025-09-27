"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AccountType = "real" | "demo";

interface BrokerContextType {
  connectionStatus: "disconnected" | "connecting" | "connected" | "failed";
  setConnectionStatus: (status: "disconnected" | "connecting" | "connected" | "failed") => void;
  balances: {
    real: number;
    demo: number;
  };
  updateBalances: (balances: { real: number; demo: number }) => void;
  activeAccount: AccountType;
  setActiveAccount: (account: AccountType) => void;
}

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "failed">("disconnected");
  const [balances, setBalances] = useState({ real: 0, demo: 10000 });
  const [activeAccount, setActiveAccount] = useState<AccountType>("demo");

  const updateBalances = (newBalances: { real: number; demo: number }) => {
    setBalances(newBalances);
  };

  return (
    <BrokerContext.Provider
      value={{
        connectionStatus,
        setConnectionStatus,
        balances,
        updateBalances,
        activeAccount,
        setActiveAccount,
      }}
    >
      {children}
    </BrokerContext.Provider>
  );
};

export const useBroker = () => {
  const context = useContext(BrokerContext);
  if (context === undefined) {
    throw new Error("useBroker must be used within a BrokerProvider");
  }
  return context;
};
