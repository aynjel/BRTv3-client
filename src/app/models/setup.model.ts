import { Personnel } from './personnel.model';
import { Routes } from './routes.model';

export type SetupListType = 'PAO' | 'Driver' | 'IMEI' | 'Routes' | 'Merchant';

export type SetupMasterList = {
  [key in SetupListType]: key extends 'PAO'
    ? Personnel[]
    : key extends 'Driver'
    ? Personnel[]
    : key extends 'IMEI'
    ? IMEI[]
    : key extends 'Routes'
    ? Routes[]
    : key extends 'Merchant'
    ? Personnel[]
    : never;
};

export type IMEI = {
  ID: number;
  dateTimeIn: Date;
  IMEI: string;
  status: string;
};
