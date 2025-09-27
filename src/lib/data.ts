export type Strategy = {
  id: string;
  name: string;
  active: boolean;
  mode: "live" | "paper";
  pairs: string[];
  timeframeSec: number;
  stakeType: "fixed" | "percent";
  stakeValue: number;
  expirationSec: 60 | 120 | 300;
  gales: number;
  galeMultiplier: number;
  stopLossValue: number;
  stopWinValue: number;
  thUp: number;
  thDown: number;
  minEdge: number;
  updatedAt: Date;
};

export type TradeOrder = {
  id: string;
  ts: Date;
  pair: string;
  side: "CALL" | "PUT";
  entryPrice: number;
  stake: number;
  expirationSec: number;
  ml: {
    pUp: number;
    pDown: number;
    uncertainty: number;
  };
  result: "win" | "loss" | "void";
  pnl: number;
  balanceAfter: number;
};

export type AiModel = {
  id: string;
  type: "gbm" | "tcn" | "transformer";
  createdAt: Date;
  dataWindow: string;
  metrics: {
    auc: number;
    brier: number;
    ece: number;
    winrateBacktest: number;
  };
  uri: string;
  status: "production" | "staging" | "archived";
};

export const dashboardStats = {
  balance: 11250.50,
  pnlDay: 250.50,
  winrateDay: 68.5,
  tradesDay: 25,
};

export const equityData = [
  { date: "2024-07-01", balance: 10000.00 },
  { date: "2024-07-02", balance: 10150.30 },
  { date: "2024-07-03", balance: 10120.10 },
  { date: "2024-07-04", balance: 10300.50 },
  { date: "2024-07-05", balance: 10450.00 },
  { date: "2024-07-06", balance: 10600.75 },
  { date: "2024-07-07", balance: 10550.25 },
  { date: "2024-07-08", balance: 10780.90 },
  { date: "2024-07-09", balance: 10950.40 },
  { date: "2024-07-10", balance: 11250.50 },
];

export const chartData = [
  { time: "16:30", value: [1.0742, 1.0745], low: 1.0741, high: 1.0746 },
  { time: "16:31", value: [1.0745, 1.0743], low: 1.0742, high: 1.0747 },
  { time: "16:32", value: [1.0743, 1.0748], low: 1.0742, high: 1.0749 },
  { time: "16:33", value: [1.0748, 1.0747], low: 1.0746, high: 1.0750 },
  { time: "16:34", value: [1.0747, 1.0751], low: 1.0746, high: 1.0752 },
  { time: "16:35", value: [1.0751, 1.0750], low: 1.0749, high: 1.0753 },
  { time: "16:36", value: [1.0750, 1.0755], low: 1.0749, high: 1.0756 },
  { time: "16:37", value: [1.0755, 1.0754], low: 1.0753, high: 1.0757 },
  { time: "16:38", value: [1.0754, 1.0752], low: 1.0751, high: 1.0755 },
  { time: "16:39", value: [1.0752, 1.0758], low: 1.0751, high: 1.0759 },
  { time: "16:40", value: [1.0758, 1.0757], low: 1.0756, high: 1.0760 },
  { time: "16:41", value: [1.0757, 1.0762], low: 1.0756, high: 1.0763 },
  { time: "16:42", value: [1.0762, 1.0761], low: 1.0760, high: 1.0764 },
  { time: "16:43", value: [1.0761, 1.0759], low: 1.0758, high: 1.0762 },
  { time: "16:44", value: [1.0759, 1.0763], low: 1.0758, high: 1.0764 },
  { time: "16:45", value: [1.0763, 1.0765], low: 1.0762, high: 1.0766 },
];


export const recentTrades: TradeOrder[] = [
  {
    id: "ord_1",
    ts: new Date(Date.now() - 1 * 60000),
    pair: "EURUSD",
    side: "CALL",
    entryPrice: 1.0750,
    stake: 100,
    expirationSec: 60,
    ml: { pUp: 0.68, pDown: 0.32, uncertainty: 0.12 },
    result: "win",
    pnl: 87,
    balanceAfter: 11250.50,
  },
  {
    id: "ord_2",
    ts: new Date(Date.now() - 3 * 60000),
    pair: "GBPJPY",
    side: "PUT",
    entryPrice: 201.123,
    stake: 100,
    expirationSec: 60,
    ml: { pUp: 0.35, pDown: 0.65, uncertainty: 0.15 },
    result: "loss",
    pnl: -100,
    balanceAfter: 11163.50,
  },
  {
    id: "ord_3",
    ts: new Date(Date.now() - 5 * 60000),
    pair: "EURUSD",
    side: "CALL",
    entryPrice: 1.0745,
    stake: 100,
    expirationSec: 60,
    ml: { pUp: 0.72, pDown: 0.28, uncertainty: 0.09 },
    result: "win",
    pnl: 87,
    balanceAfter: 11263.50,
  },
  {
    id: "ord_4",
    ts: new Date(Date.now() - 8 * 60000),
    pair: "AUDCAD",
    side: "CALL",
    entryPrice: 0.9120,
    stake: 50,
    expirationSec: 300,
    ml: { pUp: 0.61, pDown: 0.39, uncertainty: 0.20 },
    result: "win",
    pnl: 43.5,
    balanceAfter: 11176.50,
  },
  {
    id: "ord_5",
    ts: new Date(Date.now() - 15 * 60000),
    pair: "GBPJPY",
    side: "PUT",
    entryPrice: 201.200,
    stake: 100,
    expirationSec: 60,
    ml: { pUp: 0.40, pDown: 0.60, uncertainty: 0.18 },
    result: "void",
    pnl: 0,
    balanceAfter: 11133.00,
  },
];

export const strategies: Strategy[] = [
  {
    id: "strat_1",
    name: "EURUSD Scalper",
    active: true,
    mode: "live",
    pairs: ["EURUSD"],
    timeframeSec: 60,
    stakeType: "fixed",
    stakeValue: 100,
    expirationSec: 60,
    gales: 1,
    galeMultiplier: 2.1,
    stopLossValue: 500,
    stopWinValue: 1000,
    thUp: 0.65,
    thDown: 0.65,
    minEdge: 0.15,
    updatedAt: new Date(),
  },
  {
    id: "strat_2",
    name: "Multi-Pair Momentum",
    active: false,
    mode: "live",
    pairs: ["GBPJPY", "AUDCAD", "USDJPY"],
    timeframeSec: 300,
    stakeType: "percent",
    stakeValue: 2,
    expirationSec: 300,
    gales: 0,
    galeMultiplier: 2,
    stopLossValue: 1000,
    stopWinValue: 2000,
    thUp: 0.60,
    thDown: 0.60,
    minEdge: 0.10,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
  },
  {
    id: "strat_3",
    name: "Paper Trader",
    active: true,
    mode: "paper",
    pairs: ["EURUSD"],
    timeframeSec: 60,
    stakeType: "fixed",
    stakeValue: 50,
    expirationSec: 60,
    gales: 2,
    galeMultiplier: 2,
    stopLossValue: 250,
    stopWinValue: 500,
    thUp: 0.55,
    thDown: 0.55,
    minEdge: 0.05,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
  }
];

export const aiModels: AiModel[] = [
    {
        id: "gbm-v3",
        type: "gbm",
        createdAt: new Date("2024-07-10T10:00:00Z"),
        dataWindow: "4 weeks",
        metrics: { auc: 0.68, brier: 0.21, ece: 0.03, winrateBacktest: 62.1 },
        uri: "gs://bucket/models/gbm-v3.pkl",
        status: "production",
    },
    {
        id: "gbm-v4-candidate",
        type: "gbm",
        createdAt: new Date("2024-07-15T14:00:00Z"),
        dataWindow: "4 weeks",
        metrics: { auc: 0.69, brier: 0.20, ece: 0.02, winrateBacktest: 63.5 },
        uri: "gs://bucket/models/gbm-v4-candidate.pkl",
        status: "staging",
    },
    {
        id: "tcn-v1-exp",
        type: "tcn",
        createdAt: new Date("2024-07-12T09:00:00Z"),
        dataWindow: "12 weeks",
        metrics: { auc: 0.71, brier: 0.19, ece: 0.04, winrateBacktest: 65.2 },
        uri: "gs://bucket/models/tcn-v1-exp.pb",
        status: "staging",
    },
    {
        id: "gbm-v2",
        type: "gbm",
        createdAt: new Date("2024-06-10T10:00:00Z"),
        dataWindow: "4 weeks",
        metrics: { auc: 0.65, brier: 0.23, ece: 0.05, winrateBacktest: 59.8 },
        uri: "gs://bucket/models/gbm-v2.pkl",
        status: "archived",
    }
]
