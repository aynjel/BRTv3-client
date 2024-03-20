export type MonthlyRoutes = { // used on monthly sales on the dashboard
  routeCode: string;
  grossSales: number;
};

export type Routes = { // used on setup
  ID: number;
  routeCode: string;
  minFare: number;
};
