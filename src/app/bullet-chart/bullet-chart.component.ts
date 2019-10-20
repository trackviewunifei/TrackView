import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bullet-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bullet-chart.component.html',
  styleUrls: ['./bullet-chart.component.css']
})
export class BulletChartComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;

  @Input()
  private dados:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:string[] = [];

  @Input()
  private height;

  private margin = {top: 20, right: 20, bottom: 40, left: 100};

  constructor() { }

  ngOnChanges(): void {
    this.createChart();
  }

  private createChart(){
    if (!this.dados) 
      return; 
    
    const element = this.chartContainer.nativeElement;
    const data = this.dados;
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', this.height);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = this.height - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleLinear()
      .range([0, contentWidth])
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);

    const y = d3
      .scaleBand()
      .range([contentHeight, 0])
      .padding(0.1)
      .domain(data.map((d, i) => this.dados[i][0]));
    /*
    const colorScale = d3.scaleOrdinal(d3.schemePaired)
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);*/

    const colorScale = d3.scaleOrdinal()
      .domain(["0", "1", "2", "3", "4", "5"])
      .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5],]);

    const color:string[] = this.colors;

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.selectAll('.bar')//Preenche o grafico com as barras
      .data(data)
      .enter().append('rect')
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) {return x(d[1]); } )
        .attr("y", function(d) { return y(d[0]); })
        .attr("height", y.bandwidth())
        .style("fill", function (d, i) { return ""+colorScale(i+""); });


    // add the x Axis
    g.append("g")
      .attr("transform", "translate(0," + contentHeight + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .style("fill", "#D7DBDD");

    // add the y Axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
        .attr("transform", "translate(-10,-15)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .style("fill",function (d, i) { return ""+colorScale(i+""); });

    svg.append("text")//Coloca o que o eixo x representa
        .attr("text-anchor", "middle")
        .attr("x", contentWidth + 75)
        .attr("y", contentHeight + this.margin.top + 35)
        .text(this.axisNames[0])
        .style("font-size", 12)
        .style("fill", "#69a3b2");

    svg.append("text")//Coloca o que o eixo y representa
        .attr("text-anchor", "top")
        .attr("y", 15)
        .attr("x", 55)
        .text(this.axisNames[1])
        .style("font-size", 12)
        .style("fill", "#69a3b2");
  }
  
}
