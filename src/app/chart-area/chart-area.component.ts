import { Component, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.css']
})
export class ChartAreaComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  
  @Input()
  private data:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:any[] = [];

  @Input()
  private areasName:string[] = [];

  private margin = {top: 50, right: 20, bottom: 50, left: 60};

  constructor() { }

  ngOnChanges() {
    this.createChart();
  }
  private createChart(){
    if(!this.data)
      return;
      
    const element = this.chartContainer.nativeElement;//receive the div that will contains the svg
    d3.select(element).select('svg').remove();
    
    //Define the length
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const svg = d3.select(element).append('svg')//Append the svg in the html
        .attr('width', element.offsetWidth)
        .attr('height', contentHeight + this.margin.top + this.margin.bottom);
    const g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    var opacity = 0.55;

    var color = d3.scaleOrdinal()//Define the colors
      .domain(["1", "2"])
      .range([this.colors[0], this.colors[1]]);
    
    var x = d3.scalePoint().rangeRound([0, contentWidth]),
      y = d3.scaleLinear().rangeRound([contentHeight, 0]);

    //without the ts ignore Angular will point errors that doesn't exist in D3.js
    // @ts-ignore
    x.domain(this.data.map((d) => d[0]));
    y.domain([0, this.maxOf2()]);
  
    g.append("g")//Assigns the value to the horizontal axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + contentHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");

        svg.append("text")//Define what the x axis represents
        .attr("text-anchor", "middle")
        .attr("x", contentWidth)
        .attr("y", contentHeight + 92)
        .text(this.axisNames[0])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    g.append("g")//Assigns the values to the vertical axis
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .selectAll("text")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");
     

    svg.append("text")//Define what the y axis represents
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 16)
        .attr("x", -30)
        .text(this.axisNames[1])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    g.append("path")
      .datum(this.data)
          // @ts-ignore
          .attr("d", d3.area()
            .curve(d3.curveMonotoneX)
            // @ts-ignore
            .x((d)=> x(d[0]))
            .y0(y(0))
            // @ts-ignore
            .y1((d)=> y(d[1])))
          // @ts-ignore
          .style("fill", color("1"))
          .style("opacity", opacity);
    
    g.append("path")
      .datum(this.data)
          // @ts-ignore
          .attr("d", d3.area()
            .curve(d3.curveMonotoneX)
            // @ts-ignore
            .x((d)=> x(d[0]))
            .y0(y(0))
            // @ts-ignore
            .y1((d)=> y(d[2])))
          // @ts-ignore
          .style("fill", color("2"))
          .style("opacity", opacity);

      //Assigns the labels to its places
      svg.append("circle")
        .attr("cx",170)
        .attr("cy",20)
        .attr("r", 6)
        .style("fill", this.colors[0]);
      
      svg.append("circle")
        .attr("cx",170)
        .attr("cy",40)
        .attr("r", 6)
        .style("fill", this.colors[1]);
      
      svg.append("text")
        .attr("x", 180)
        .attr("y", 20)
        .text(this.areasName[0])
        .style("font-size", 16)
        .style("fill", this.colors[0])
        .attr("alignment-baseline","middle");
      
      svg.append("text")
        .attr("x", 180)
        .attr("y", 40)
        .text(this.areasName[1])
        .style("font-size", 16)
        .style("fill", this.colors[1])
        .attr("alignment-baseline","middle");
          
  }

  private maxOf2(){
    var max1 = d3.max(this.data, d => {return d[1];});
    var max2 = d3.max(this.data, d => {return d[2];});
    
    if(max1> max2)
      return max1;

    return max2;
  }
}
