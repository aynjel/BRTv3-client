export type Transaction = {
  txnDateTime: Date; // Date of Transaction
  dateTimeIN: Date; // Date of syncing
  startStnCode: string;
  endStnCode: string;
  tripDistance: number; //
  pax: number;
  fareAmt: number;
  discountAmt: number;
  totalAmt: number;
  location?: string;
};

export type ZreadingNotes = {
  txnID: string;
  dateTimeIN: Date;
  TxnDateTime: Date;
  Outlet: string;
  UserID: string;
  GrossCount: number;
  GrossAmount: number;
  DiscountCount: number;
  DiscountAmt: number;
  NetAmount: number;
  TotalPassenger: number;
  RFIDCount: number;
  RFIDAmount: number;
  UnliCount: number;
  UnliAmount: number;
  QRCount: number;
  QRAmount: number;
  cashCount: number;
};

export type HourlyTransaction = {
  txnDate: Date;
  txnHour: number;
  stnFrom?: string;
  tranCount: number;
  grossAmt: number;
  paxCount: number;
  cctvEnter: number;
  cctvExit: number;
};

export type TransactionTotal = {
  currency: boolean;
  label: string;
  distance?: boolean;
  value: number;
};

export type Zreading = {
  reportData: string;
  dateTimeIN: Date;
};
