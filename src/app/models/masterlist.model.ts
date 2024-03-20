// export type MasterList<T> = T extends 'Personnel'
//   ? Personnel
//   : T extends 'POS'
//   ? POS
//   : T extends 'Sales'
//   ? Sales
//   : T extends 'Violation'
//   ? Violation
//   : never;

import { Personnel } from "./personnel.model";

export type MasterList = {
  [key in masterListType]: key extends 'PAO'
  ? Personnel[]
  : key extends 'Driver'
  ? Personnel[]
  : key extends 'POS'
  ? POS[]
  : key extends 'Sales'
  ? Sales[]
  : key extends 'Violation'
  ? Violation[]
  : never;
  // [key in masterListType]: (Personnel | POS | Sales | Violation)[];
};

type masterListType = 'PAO' | 'Driver' | 'POS' | 'Sales' | 'Violation';

interface POS {
  IMEI: number;
  enrolled: Date;
  operator?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Sales {
  month: Date;
  PAO?: string;
  sales: number;
}

interface Violation {
  name: string,
  position: 'PAO' | 'DRIVER';
  violationCount: number;
  violationMsg: string;
  issued: Date;
}
