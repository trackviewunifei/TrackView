import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  private host: any;
  private svg: any;
  private width: number;
  private height: number;
  private contentWidth: number;
  private contentHeight: number;
  private radius: number;
  private htmlElement: HTMLElement;
  
  @Input()
  private dados:any[] = [];

  @Input()
  private colors:string[] = [];

  margin = {top: 30, right: 20, bottom: 30, left: 40};

  constructor() { }
  
  ngOnChanges(): void {
    this.createChart();
  }

  private createChart(){
    if (!this.dados) 
     return;
    
    this.htmlElement = this.chartContainer.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.setup();
    this.buildSVG();
    this.buildPie();
  }

  private setup(): void {
    this.contentWidth = this.width - this.margin.left - this.margin.right;
    this.contentHeight = this.height - this.margin.top - this.margin.bottom;

    this.width = this.htmlElement.offsetWidth;
    this.height = 250;
    this.radius = Math.min(this.width, this.height)/2;//Determina o raio
  }

  private buildSVG(): void {
      this.host.html("");//Limpa o espaço do gráfico
      this.svg = this.host.append("svg")//Coloca um svg nesse local
          .data([this.dados])  
          .attr("viewBox", `0 0 ${this.width} ${this.height}`)
          .append("g")
          .attr("transform", `translate(${this.width/2},${this.height/2})`);
  }

  private buildPie(): void {
      let pie = d3.pie()//Define o conjunto de valores
          .sort(null)    
          .value((d:any) => {return d[1];});

      let arcSelection = this.svg.selectAll(".arc")
          .data(pie)//Aplica os valores como arcos 
          .enter()
          .append("g")
          .attr("class", "arc");

      this.populatePie(arcSelection);
  }

  private populatePie(arcSelection: any): void {
      let innerRadius = 0;
      let outerRadius = this.radius * 0.7;

      //let pieColor = d3.scaleOrdinal(d3.schemeCategory10);//Define o tipo de escala
      
      var pieColor = d3.scaleOrdinal()
        .domain([0+"",1+""])
        .range([this.colors[0], this.colors[1]]);

      let arc = d3.arc()//Define o tamanho do circulo
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
      
      let outerArc = d3.arc()
          .innerRadius(this.radius * 0.9)
          .outerRadius(this.radius * 0.9);
      
      arcSelection.append("path")//Coloca as cores
          .attr("d", arc)
          .attr("fill", (d, index) => {
              return pieColor(index+"");
          });

      arcSelection.append("text")//Atribui o tipos de cada arco
          .attr("transform", d=> {
            var pos = outerArc.centroid(d);
            pos[0] = this.radius * 0.8 * (midAngle(d) < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
          .text((d:any, index:number) => {return this.dados[index][0];})
          .style('text-anchor', function(d) {
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        })
        .style("font-size", 12)
        .style("fill", "#69a3b2");

      arcSelection.append("polyline")//Atribui as linhas para os tipos
          .attr("points", d =>{
            var pos = outerArc.centroid(d);
            pos[0] = this.radius * 0.8 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arc.centroid(d), outerArc.centroid(d), pos]
        })

      function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; } 
   
  }
  /*
  ngOnChanges(): void {
    if (!this.data) { return; }
    this.htmlElement = this.chartContainer.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.setup();
    this.buildSVG();
    this.buildPie();
  }

  private setup(): void {
    this.contentWidth = this.width - this.margin.left - this.margin.right;
    this.contentHeight = this.height - this.margin.top - this.margin.bottom;

    this.width = this.htmlElement.offsetWidth;
    this.height = 250;
    this.radius = Math.min(this.width, this.height)/2;
  }

  private buildSVG(): void {
      this.host.html("");
      this.svg = this.host.append("svg")
          .data([this.myData])  
          .attr("viewBox", `0 0 ${this.width} ${this.height}`)
          .append("g")
          .attr("transform", `translate(${this.width/2},${this.height/2})`);
  }

  private buildPie(): void {
      let pie = d3.pie()
          .value((d:any) => {return d.age;});

      let arcSelection = this.svg.selectAll(".arc")
          .data(pie)
          .enter()
          .append("g")
          .attr("class", "arc");

      this.populatePie(arcSelection);
  }

  private populatePie(arcSelection: any): void {
      let innerRadius = 0;
      let outerRadius = this.radius - 10;
      let pieColor = d3.scaleOrdinal(d3.schemeCategory10);
      let arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
      
      arcSelection.append("path")
          .attr("d", arc)
          .attr("fill", (d, index) => {
              return pieColor(index);
          });

      arcSelection.append("text")
          .attr("transform", d=> {
              d.innerRadius = innerRadius;
              d.outerRadius = outerRadius;
              return "translate(" + arc.centroid(d) + ")";
          })
          .text((d:any, index:number) => {return this.myData[index].name;})
          .attr("text-anchor", "middle");
  }
  */
}
