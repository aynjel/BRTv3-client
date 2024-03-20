import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HistoricalComponent } from 'src/app/pages/historical/historical.component';
import { SharedModule } from '../shared/shared.module';
import { ViewAnalyticsComponent } from 'src/app/pages/view-analytics/view-analytics.component';
import { TimelapseComponent } from 'src/app/pages/timelapse/timelapse.component';
import { BusesComponent } from 'src/app/pages/buses/buses.component';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BusRoutesComponent } from 'src/app/pages/bus-routes/bus-routes.component';

const routes: Routes = [
  { path: '', component: HistoricalComponent },
  { path: ':date/timelapse', component: TimelapseComponent },
  {
    path: ':date/analytics',
    component: ViewAnalyticsComponent,
  },
  { path: ':date/buses', component: BusesComponent },
  { path: ':date/routes', component: BusRoutesComponent },
];

@NgModule({
  declarations: [
    HistoricalComponent,
    ViewAnalyticsComponent,
    TimelapseComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxSliderModule,
  ],
  exports: [RouterModule],
})
export class HistoricalModule {}
