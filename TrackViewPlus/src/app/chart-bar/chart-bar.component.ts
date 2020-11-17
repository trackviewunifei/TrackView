import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css']
})
export class ChartBarComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  
  @Input()
  private data:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:string[] = [];

  margin = {top: 20, right: 20, bottom: 20, left: 70};

  constructor() { }

  ngOnChanges(): void {
    this.createChart();
  }

  private createChart(){
    if (!this.data) 
      return;
    
    const element = this.chartContainer.nativeElement;//receive the div that will contains the svg
    const data = this.data;
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')//Append the svg in the html
        .attr('width', element.offsetWidth)
        .attr('height', 350);

    //Define the length
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map((d, i) => this.data[i][0]));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, (d, i) => this.data[i][1])]);
    
    /*static way of distributing the colors, was the previous one
    const colorScale = d3.scaleOrdinal()//Define the colors
      .domain(["0", "1", "2", "3", "4", "5"])
      .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5]]);
    */

   const colorScale = d3.scaleOrdinal()//Define the colors
      .domain(this.returnIndexColors())
      .range(this.colors);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')//Assigns the values to the y axis
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", function (d, i) { return ""+colorScale(i+""); });

    g.append('g')//Assigns the values to the y axis
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .selectAll('text')
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");

    g.selectAll('.bar')//Fill the bars
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(this.data[i][0]))
        .attr('y', (d, i) => y(this.data[i][1]))
        .attr('width', x.bandwidth())
        .attr('height', (d, i) => contentHeight - y(this.data[i][1]))
        .style("fill", function (d, i) { return ""+colorScale(i+""); });

    svg.append("text")//Define what the x axis represents
        .attr("text-anchor", "middle")
        .attr("x", contentWidth+25)
        .attr("y", contentHeight + this.margin.top + 55)
        .text(this.axisNames[0])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    svg.append("text")//Define what the y axis represents
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 16)
        .attr("x", -30)
        .text(this.axisNames[1])
        .style("font-size", 14)
        .style("fill", "#69a3b2");
  }

  private returnIndexColors()
  {
    var colorsIndex:string[] = [];
    for(var i = 0; i < this.colors.length; i ++)
      colorsIndex.push(i + "");
    
    return colorsIndex
  }
}
