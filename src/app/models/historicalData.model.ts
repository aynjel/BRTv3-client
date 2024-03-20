import { HourlyData } from "./hourly.model";

export type HistoricalData = {
  checked: boolean;
  ID: number;
  IMEI: string;
  branchID: string; // Bus name / Outlet
  routeCode: string;
  routeName: string;

  timeIn: string;
  timeOut: string;
  dateTimeIn: Date;
  txnDate: string; // YYYY-MM-DD
  PAO: string;
  action: string;
  recommendation: string;
  concern: string;

  cashCount: number;
  cctvCount: number;
  fuelConsume: number;
  lastGPS: string;
  odomEnd: number;
  odomStart: number;

  grossCount: number; // Zread tran count
  grossAmt: number; // Zread Sales
  netAmt: number; // Zread net amt
  passCount: number; // Zread passenger count
  zReadCashCount: number; // Zread cash count

  grossSales: number; // POS sales
  tranCount: number; // POS tran count
  totalPass: number; // POS passenger count
  hourlyData: HourlyData[];
};

export type RouteAnalytics = {
  routeCode: string;
  routeName: string;
  tranCount: number;
  totalPass: number;
  grossSales: number;
  grossCount: number;
  passCount: number;
  netAmt: number;
};

export type PAOAnalytics = {
  PAO: string;
  grossSales: number;
  cashCount: number;
};
