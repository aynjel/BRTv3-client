export interface Personnel {
  ID: number,
  dateTimeIn: Date,
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  contact: string;
  position?: 'PAO' | 'DRIVER';
  license: string;
  status?: boolean | string;
  violationCode?: string;
  violationMsg?: string;
  issued?: Date;
}
