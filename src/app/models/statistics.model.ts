export interface Statistics {
  value: number;
  label: string;
  currency: boolean;
  key: 'totalBus' | 'posTrans' | 'totalPass' | 'cctvCount' | 'grossSales' | 'monthlyGrossSales' | 'monthlyZReading' | 'grossCount' | 'zReading' | 'netAmt' | 'passCount' | 'revenue';
  imgUrl?: string;
}

export type StatisticsData = {
  activeBus: number;
  inactiveBus: number;
  cctvCount: number;
  posTrans: number;
  grossSales: number;
  totalPass: number;
  zReading: number;
}
/** KEYS
 * TotalBus - Total number of buses
 * POSTrans - POS transaction sales
 * TotalPass - POS passenger count
 * GrossSales - POS transaction sales
 * MonthlyGrossSales - POS transaction Sales of the month
 * GrossCount - Zreading transaction count
 * GrossAmt - Zreading gross transaction sales
 * PassCount - Zreading passenger count
 * NetAmt - Zreading net transaction sales
 * MonthlyZreading - Zreading transaction sales of the month
 * CCTVCount - CCTV Count
 * Revenue - Average revenue / hour
 */
