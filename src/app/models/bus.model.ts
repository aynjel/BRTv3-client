import { HourlyData } from './hourly.model';

export type BusGeneral = {
  ID: number;
  IMEI: number; // POS ID
  branchID: string; // Bus name / Outlet
  routeCode: string; // Route Code of the bus' path
  txnDate: string; // YYYY-MM-DD
};

type BusOptional = {
  averageRev?: number; // Average POS sales
  duration?: number; // duration of the bus' shift
  cashCount?: number;
  cctvUpdate?: Date;
};

export type BusDetails = BusGeneral &
  BusOptional & {
    checked: boolean; // checkbox for calculating total
    timeIn: string;
    timeOut: string;

    revenueCount: boolean;
    routeName: string;
    timeDiff: Date;

    // PAO
    PAO: string;
    lastPAO: string; // Last PAO
    lastDatePAO: Date; // Last PAO used on this POS

    // POS
    firstTransact: Date; // First transaction to be used as Date/Time IN
    lastTransact: Date; // Last Transaction Update
    tranCount: number; // Number of transactions
    totalPass: number; // Number of passengers
    grossSales: number; // Amount of sales
    // totalTxnCount: number;
    // totalPassCount: number;
    // totalGrossSales: number;

    // ZREADING
    lastZread: Date; // Time of Zreading
    grossCount: number; // Total transactions during that Zreading
    grossAmt: number; // Total sales generated during that Zreading
    netAmt: number; // Total sales generated deducted with discounts during that Zreading
    passCount: number; // Total passengers during that Zreading
    logCount: number; // Zreading log count

    // CCTV
    cctvTime: string; // Last CCTV Update
    cctvUpdate: boolean; // Check if cctv is actively running at this hour
    cctvCount: number; // CCTV count
    totalCctvCount: number; // Total CCTV count

    // Distance
    odomStart: number; // Odometer start
    odomEnd: number; // Odometer end
    fuelConsume: number; // Fuel consumption
    lastGPS: string; // Last GPS sent
  };

export type BusRoutes = {
  checked: boolean;
  indeterminate: boolean;
  routeCode: string;
  routeName: string;
  totalBusCount: number;
  totalTxnCount?: number;
  totalPassCount?: number;
  totalSales?: number;
  buses: BusDetails[];
  hourlyData?: HourlyData[];
};

// TimeLapse
export type TBusModel = {
  IMEI: string;
  branchID: string;
  coordinates: string;
  pax: number;
  syncDate: string;
  totalAmount: number;
  transactDate: string;
  routeCode: string;
};

export type TBusDTO = {
  checked: boolean;
  branchID: string;
  list: TBusModel[];
};
