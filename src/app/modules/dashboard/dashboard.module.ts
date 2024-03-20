import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { BusRoutesComponent } from 'src/app/pages/bus-routes/bus-routes.component';
import { BusesComponent } from 'src/app/pages/buses/buses.component';
import { RouteDetailsComponent } from 'src/app/pages/route-details/route-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'routes', component: BusRoutesComponent, },
  { path: 'routes/:route', component: RouteDetailsComponent, },
  { path: 'buses', component: BusesComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
