import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class TableExportService {
  constructor() {}

  exportTableToExcel(
    tableId: string,
    fileName: string,
    sheetName?: string
  ): Observable<void> {
    const table = document.getElementById(tableId);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    return new Observable(observer => observer.next());
  }

  async exportAOAToExcel(
    data: any[],
    fileName: string,
    sheetName?: string
  ): Promise<void> {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
