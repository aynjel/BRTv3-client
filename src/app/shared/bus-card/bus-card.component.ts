import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { identifyBusColor } from 'src/app/config/busColor';
import { assetsUrl } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';

@Component({
  selector: 'app-bus-card',
  templateUrl: './bus-card.component.html',
  styleUrls: ['./bus-card.component.scss']
})
export class BusCardComponent implements OnInit {
  readonly paoIcon = assetsUrl + 'detail_pao.svg';
  readonly salesIcon = assetsUrl + 'detail_sales.svg';
  readonly averageIcon = assetsUrl + 'detail_average.svg';
  readonly lastUpdateIcon = assetsUrl + 'detail_lastupdate.svg';
  readonly slantedIcon = assetsUrl + 'slanted.svg';
  readonly gpsIcon = assetsUrl + 'gps_signal.svg';

  @Input() busDetails!: BusDetails;
  @Input() maximize: boolean = false;

  @Output() busCount: EventEmitter<string> = new EventEmitter<string>(); // Emits the bus count
  @Output() emitRevCount: EventEmitter<boolean> = new EventEmitter<boolean>(false); // Emits true if the average revenue is not 0

  busColor: string = '';
  lastGPSUpdate: boolean = false;
  activeCCTV: boolean = false;

  constructor () {

  }

  ngOnInit(): void {
    this.busColor = this.checkLastBusTransaction(this.busDetails);
    this.lastGPSUpdate = this.getLastGPS();
    this.activeCCTV = this.getCCTVStatus();
  }

  private getCCTVStatus() {
    if (!this.busDetails.cctvUpdate) return false;
    return true;
  }

  private getLastGPS() {
    if (!this.busDetails.lastGPS) return false;

    const gpsDate = new Date(this.busDetails.lastGPS);
    const gpsActive = (new Date().getTime() - gpsDate.getTime()) / 1000;

    return gpsActive < 60; // Display GPS icon if difference between now and last GPS update is less than a minute
  }

  private checkLastBusTransaction = (bus: BusDetails) => {
    const className = identifyBusColor(bus);

    this.busCount.emit(className);
    return className;
  };
}
