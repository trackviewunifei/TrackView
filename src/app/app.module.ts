import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularNeo4jModule } from 'angular-neo4j';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Graf1Component } from './graf1/graf1.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { BulletChartComponent } from './bullet-chart/bullet-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import {DadosService} from './dados.service';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { TableComponent } from './table/table.component'

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
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularNeo4jModule, 
    HttpClientModule
  ],
  providers: [DadosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
