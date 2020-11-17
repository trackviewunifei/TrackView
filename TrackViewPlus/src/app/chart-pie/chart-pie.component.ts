import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.css']
})
export class ChartPieComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  private host: any;
  private svg: any;
  private width: number;
  private height: number;
  private radius: number;
  private htmlElement: HTMLElement;
  
  @Input()
  private data:any[] = [];

  @Input()
  private colors:string[] = [];

  margin = {top: 30, right: 20, bottom: 30, left: 40};

  constructor() { }
  
  ngOnChanges(): void {
    if (!this.data) 
     return;
    
    this.htmlElement = this.chartContainer.nativeElement;//receive the div that will contains the svg
    this.host = d3.select(this.htmlElement);

    this.width = this.htmlElement.offsetWidth;
    this.height = 500;
    this.radius = Math.min(this.width, this.height)/2;//Determina o raio

    this.host.html("");
    this.svg = this.host.append("svg")//Append the svg in the html
        .data([this.data])  
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .append("g")
        .attr("transform", `translate(${this.width/2},${this.height/2})`);

    let pie = d3.pie()//Define the values
        .sort(null)    
        .value((d:any) => {return d[1];});

    let arcSelection = this.svg.selectAll(".arc")
        .data(pie)//Aply the values as arcs 
        .enter()
        .append("g")
        .attr("class", "arc");

    let innerRadius = 0;
    let outerRadius = this.radius * 0.7;

    /*static way of distributing the colors, was the previous one
    const pieColor = d3.scaleOrdinal()
      .domain([0+"",1+"", 2+"",3+"", 4+"",5+""])
      .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5]]);
    */
   const pieColor = d3.scaleOrdinal()//Define the colors
   .domain(this.returnIndexColors())
   .range(this.colors);

    let arc = d3.arc()//Define the size of the arc
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    
    let outerArc = d3.arc()
        .innerRadius(this.radius * 0.9)
        .outerRadius(this.radius * 0.9);
    
    arcSelection.append("path")//Put the colors
        .attr("d", arc)
        .attr("fill", (d, index) => {
            return pieColor(index+"");
        });

    arcSelection.append("text")//Assigns the types of each arc
        .attr("transform", d=> {
          var pos = outerArc.centroid(d);
          pos[0] = this.radius * 0.8 * (midAngle(d) < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
      })
        .text((d:any, index:number) => {return this.data[index][0];})
        .style('text-anchor', function(d) {
          return (midAngle(d)) < Math.PI ? 'start' : 'end';
      })
      .style("font-size", 16)
      .style("fill", "#69a3b2");

    arcSelection.append("polyline")//Assigns the lines for each type
        .attr("points", d =>{
          var pos = outerArc.centroid(d);
          pos[0] = this.radius * 0.8 * (midAngle(d) < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos]
      })

    function midAngle(d) { 
      return d.startAngle + (d.endAngle - d.startAngle) / 2; 
    } 
  }

  private returnIndexColors()
  {
    var colorsIndex:string[] = [];
    for(var i = 0; i < this.colors.length; i ++)
      colorsIndex.push(i + "");
    
    return colorsIndex
  }
}
