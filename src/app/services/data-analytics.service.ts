import { computed, Injectable, signal } from '@angular/core';
import {
  HistoricalData,
  PAOAnalytics,
  RouteAnalytics,
} from '../models/historicalData.model';

export enum AnalyticsTableEnumFilter {
  BUSES = 'Buses',
  ROUTES = 'Routes',
  PAO = 'PAO',
}

export interface AnalyticsTableData {
  data: HistoricalData[] | RouteAnalytics[] | PAOAnalytics[];
  filter: AnalyticsTableEnumFilter;
}

@Injectable({
  providedIn: 'root',
})
export class DataAnalyticsService {
  private tableBusData = signal<HistoricalData[]>([]);
  private tableRouteData = signal<RouteAnalytics[]>([]);
  private tablePAOData = signal<PAOAnalytics[]>([]);

  activeTable = signal(AnalyticsTableEnumFilter.BUSES);

  tableHeaderList = computed(() => {
    switch (this.activeTable()) {
      case AnalyticsTableEnumFilter.BUSES:
        return [
          'Remarks',
          'Outlet',
          'IMEI',
          'Route',
          'PAO',
          'POS Tran AMT',
          'POS Tran Count',
          'POS Pass Count',
          'ZRead Tran Count',
          'ZRead Pass Count',
          'Cash Count',
          'ZRead Net Amount',
          'Difference (Cash - ZRead)',
          'CCTV Count',
        ];
      case AnalyticsTableEnumFilter.ROUTES:
        return [
          'Route Code',
          'Route Name',
          'POS Tran Count',
          'POS Pass Count',
          'POS Tran Amount',
          'ZRead Tran Count',
          'ZRead Pass Count',
          'ZRead Net Amount',
        ];
      case AnalyticsTableEnumFilter.PAO:
        return ['PAO', 'POS Sales', 'Cash Count'];
      default:
        return [];
    }
  });

  constructor() {}

  setTableFilter(filter: AnalyticsTableEnumFilter): void {
    this.activeTable.set(filter);
  }

  setTableData(data: AnalyticsTableData): void {
    switch (data.filter) {
      case AnalyticsTableEnumFilter.BUSES:
        this.tableBusData.set(data.data as HistoricalData[]);
        break;
      case AnalyticsTableEnumFilter.ROUTES:
        this.tableRouteData.set(data.data as RouteAnalytics[]);
        break;
      case AnalyticsTableEnumFilter.PAO:
        this.tablePAOData.set(data.data as PAOAnalytics[]);
        break;
      default:
        break;
    }
  }

  getTableData(
    filter: AnalyticsTableEnumFilter
  ): HistoricalData[] | RouteAnalytics[] | PAOAnalytics[] {
    switch (filter) {
      case AnalyticsTableEnumFilter.BUSES:
        return this.tableBusData();
      case AnalyticsTableEnumFilter.ROUTES:
        return this.tableRouteData();
      case AnalyticsTableEnumFilter.PAO:
        return this.tablePAOData();
      default:
        return [];
    }
  }
}
