import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NotAuthorizeComponent } from './pages/not-authorize/not-authorize.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { authGuard } from './guards/auth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: 'home',
    component: LandingPageComponent,
    // canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'setup',
    loadChildren: () =>
      import('./modules/setup/setup.module').then(m => m.SetupModule),
    canActivate: [authGuard],
  },
  {
    path: 'map',
    loadChildren: () =>
      import('./modules/map/map.module').then(m => m.MapModule),
    canActivate: [authGuard],
  },
  {
    path: 'alerts',
    loadChildren: () =>
      import('./modules/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate: [authGuard],
  },
  {
    path: 'historical',
    loadChildren: () =>
      import('./modules/historical/historical.module').then(
        m => m.HistoricalModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'print',
    loadChildren: () =>
      import('./modules/print/print.module').then(m => m.PrintModule),
    // canActivate: [authGuard]
  },
  { path: 'notFound', component: NotFoundComponent },
  { path: 'unauthorized', component: NotAuthorizeComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // redirect back to dashboard page if empty
  { path: '**', redirectTo: 'notFound' }, // 404 page if not known routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: false })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule {}
