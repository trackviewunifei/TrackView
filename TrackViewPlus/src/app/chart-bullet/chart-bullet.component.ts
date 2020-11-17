import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-bullet',
  templateUrl: './chart-bullet.component.html',
  styleUrls: ['./chart-bullet.component.css']
})
export class ChartBulletComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;

  @Input()
  private data:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:string[] = [];

  @Input()
  private height;

  private margin = {top: 20, right: 20, bottom: 60, left: 150};

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
        .attr('height', this.height);

    //Define the length
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = this.height - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleLinear()
      .range([0, contentWidth])
      .domain([0, d3.max(data, (d, i) => this.data[i][1])]);

    const y = d3
      .scaleBand()
      .range([contentHeight, 0])
      .padding(0.1)
      .domain(data.map((d, i) => this.data[i][0]));

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

    g.selectAll('.bar')//Fill the bullets
      .data(data)
      .enter().append('rect')
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) {return x(d[1]); } )
        .attr("y", function(d) { return y(d[0]); })
        .attr("height", y.bandwidth())
        .style("fill", function (d, i) { return ""+colorScale(i+""); });

    g.append("g")//Assigns the values to the x axis
      .attr("transform", "translate(0," + contentHeight + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");

    g.append("g")//Assigns the values to the y axis
      .call(d3.axisLeft(y))
      .selectAll("text")
        .attr("transform", "translate(-10,-15)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill",function (d, i) { return ""+colorScale(i+""); });

    svg.append("text")//Define what the x axis represents
        .attr("text-anchor", "middle")
        .attr("x", contentWidth + 75)
        .attr("y", contentHeight + this.margin.top + 45)
        .text(this.axisNames[0])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    svg.append("text")//Define what the y axis represents
        .attr("text-anchor", "top")
        .attr("y", 15)
        .attr("x", 55)
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
