import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BusDetails, BusGeneral } from 'src/app/models/bus.model';

@Component({
  selector: 'app-bus-details',
  templateUrl: './bus-details.component.html',
  styleUrls: ['./bus-details.component.scss']
})
export class BusDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() busData!: BusDetails;

  constructor () { }

  ngOnInit(): void {
    console.log(this.busData);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
