import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularNeo4jModule } from 'angular-neo4j';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { Graf1Component } from './graf1/graf1.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { BulletChartComponent } from './bullet-chart/bullet-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import {DadosService} from './dados.service';
import {TooltipService} from './tooltip.service';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { TableComponent } from './table/table.component';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { CardComponent } from './card/card.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'
import { MatDatepickerModule, MatNativeDateModule, MatInputModule, MatRippleModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersComponent } from './filters/filters.component';
import { DashboardFatecoins1Component } from './dashboard-fatecoins1/dashboard-fatecoins1.component';
import { DashboardFatecoins2Component } from './dashboard-fatecoins2/dashboard-fatecoins2.component';
import { DashboardFatecoins3Component } from './dashboard-fatecoins3/dashboard-fatecoins3.component';
import { DashboardFatecoins4Component } from './dashboard-fatecoins4/dashboard-fatecoins4.component';

@NgModule({
  declarations: [
    AppComponent,
    Graf1Component,
    PieChartComponent,
    DonutChartComponent,
    BulletChartComponent,
    LineChartComponent,
    RadarChartComponent,
    BubbleChartComponent,
    TableComponent,
    Dashboard1Component,
    Dashboard2Component,
    CardComponent,
    NavComponent,
    routingComponents,
    FiltersComponent,
    DashboardFatecoins1Component,
    DashboardFatecoins2Component,
    DashboardFatecoins3Component,
    DashboardFatecoins4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularNeo4jModule, 
    HttpClientModule, 
    NoopAnimationsModule, 
    LayoutModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatListModule, 
    MatInputModule,
    MatRippleModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DadosService, TooltipService, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
