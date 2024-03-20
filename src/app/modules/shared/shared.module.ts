import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { BusCardComponent } from 'src/app/shared/bus-card/bus-card.component';
import { RouterModule } from '@angular/router';
import { StatisticsComponent } from 'src/app/shared/statistics/statistics.component';
import { LineGraphComponent } from 'src/app/shared/graph/line-graph/line-graph.component';
import { DonutGraphComponent } from 'src/app/shared/graph/donut-graph/donut-graph.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { NumberFormatPipe } from 'src/app/pipes/number-format.pipe';
import { DecimalFormatPipe } from 'src/app/pipes/decimal-format.pipe';
import { NgChartsModule } from 'ng2-charts';
import { BarGraphComponent } from 'src/app/shared/graph/bar-graph/bar-graph.component';
import { TopBulletinComponent } from 'src/app/shared/top-bulletin/top-bulletin.component';
import { MasterListComponent } from 'src/app/shared/master-list/master-list.component';
import { MasterListTooltipComponent } from 'src/app/shared/tooltip/master-list-tooltip/master-list-tooltip.component';
import { CursorFollowDirective } from 'src/app/directives/cursor-follow.directive';
import { BusSummaryComponent } from 'src/app/shared/bus-summary/bus-summary.component';
import { TransactionLogsComponent } from 'src/app/shared/modals/transaction-logs/transaction-logs.component';
import { ZreadingLogsComponent } from 'src/app/shared/modals/zreading-logs/zreading-logs.component';
import { CctvHourlyComponent } from 'src/app/shared/modals/cctv-hourly/cctv-hourly.component';
import { HourlySummaryComponent } from 'src/app/shared/modals/hourly-summary/hourly-summary.component';
import { TimeDecimalPipe } from 'src/app/pipes/time-decimal.pipe';
import { SelectMerchantComponent } from 'src/app/shared/modals/select-merchant/select-merchant.component';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { MapViewComponent } from 'src/app/shared/map-view/map-view.component';
import { ViewStatisticsComponent } from 'src/app/shared/modals/view-statistics/view-statistics.component';
import { PerformanceAnalysisComponent } from 'src/app/shared/modals/performance-analysis/performance-analysis.component';
import { BusesComponent } from 'src/app/pages/buses/buses.component';
import { BusRoutesComponent } from 'src/app/pages/bus-routes/bus-routes.component';
import { RouteDetailsComponent } from 'src/app/pages/route-details/route-details.component';
import { ImeiAnalyticsDetailsComponent } from 'src/app/shared/modals/imei-analytics-details/imei-analytics-details.component';
import { CashCountAnalyticsDetailsComponent } from 'src/app/shared/modals/cash-count-analytics-details/cash-count-analytics-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';
import { NotAuthorizeComponent } from 'src/app/pages/not-authorize/not-authorize.component';
import { LandingPageComponent } from 'src/app/pages/landing-page/landing-page.component';
import { IndeterminateDirective } from 'src/app/directives/indeterminate.directive';
import { RemarksAnalyticsComponent } from 'src/app/shared/modals/remarks-analytics/remarks-analytics.component';
import { NgxPrintModule } from 'ngx-print';
import { HourPipe } from 'src/app/pipes/hour.pipe';
import { DifferencePipe } from 'src/app/pipes/difference.pipe';
import { BusDetailsComponent } from 'src/app/shared/tooltip/bus-details/bus-details.component';
import { ToastComponent } from 'src/app/shared/toast/toast.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BusCardComponent,
    StatisticsComponent,
    LineGraphComponent,
    DonutGraphComponent,
    BarGraphComponent,
    TopBulletinComponent,
    MasterListComponent,
    MasterListTooltipComponent,
    BusSummaryComponent,
    TransactionLogsComponent,
    ZreadingLogsComponent,
    CctvHourlyComponent,
    HourlySummaryComponent,
    SelectMerchantComponent,
    LoadingSpinnerComponent,
    MapViewComponent,
    ViewStatisticsComponent,
    PerformanceAnalysisComponent,
    BusesComponent,
    BusRoutesComponent,
    RouteDetailsComponent,
    ImeiAnalyticsDetailsComponent,
    CashCountAnalyticsDetailsComponent,
    NotFoundComponent,
    NotAuthorizeComponent,
    LandingPageComponent,
    RemarksAnalyticsComponent,
    BusDetailsComponent,
    ToastComponent,

    CurrencyFormatPipe,
    NumberFormatPipe,
    DecimalFormatPipe,
    TimeDecimalPipe,
    HourPipe,
    DifferencePipe,

    CursorFollowDirective,
    IndeterminateDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    NgxPrintModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HeaderComponent,
    BusCardComponent,
    StatisticsComponent,
    LineGraphComponent,
    DonutGraphComponent,
    BarGraphComponent,
    TopBulletinComponent,
    MasterListComponent,
    MasterListTooltipComponent,
    BusSummaryComponent,
    TransactionLogsComponent,
    ZreadingLogsComponent,
    CctvHourlyComponent,
    HourlySummaryComponent,
    SelectMerchantComponent,
    LoadingSpinnerComponent,
    MapViewComponent,
    ViewStatisticsComponent,
    PerformanceAnalysisComponent,
    BusesComponent,
    BusRoutesComponent,
    RouteDetailsComponent,
    ImeiAnalyticsDetailsComponent,
    CashCountAnalyticsDetailsComponent,
    NotFoundComponent,
    NotAuthorizeComponent,
    LandingPageComponent,
    RemarksAnalyticsComponent,
    BusDetailsComponent,
    ToastComponent,

    CurrencyFormatPipe,
    NumberFormatPipe,
    DecimalFormatPipe,
    TimeDecimalPipe,
    HourPipe,
    DifferencePipe,

    IndeterminateDirective,
  ],
})
export class SharedModule {}
