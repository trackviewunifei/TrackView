import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.css']
})
export class ChartLineComponent implements OnChanges{

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;

  private host: any;
  private svg: any;
  private width: number;
  private height: number;
  private htmlElement: HTMLElement;
  private xScale: any;
  private yScale: any;
  private line: any;
  private dataset: any;
  
  @Input()
  private types: string[];

  @Input()
  data:any [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:string[] = [];

  private margin = {top: 50, right: 20, bottom: 65, left: 60};

  constructor() { }

  ngOnChanges(): void {
    if (!this.data || !this.types) 
      return;
      
    this.htmlElement = this.chartContainer.nativeElement;//receive the div that will contains the svg
    this.host = d3.select(this.htmlElement);

    //Define the length
    this.width = this.htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = 250 - this.margin.top - this.margin.bottom;

    this.dataset = this.types.map((typeName)=>{
      return{
        name:typeName,
        values:this.data.map((d)=>{
          var indice = this.types.indexOf(typeName);
          if(indice == 0)
            return {data: d[0], value:+d[indice+1]};
          else if(indice == 1)
            return {data: d[0], value:+d[indice+1]};
          else return {data: d[0], value:+d[indice+1]};
        })
      };
    });
    
    this.xScale = d3.scalePoint()
        .domain(this.data.map(d => {return d[0];}))
        .range([0, this.width]);
    
    this.yScale = d3.scaleLinear()
        .domain([0, this.MaxOf3()])
        .range([this.height, 0]);
         
    this.host.html("");
      this.svg = this.host.append("svg") //Append the svg in the html
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    var myColor = d3.scaleOrdinal()
        .domain(this.types)
        .range([this.colors[0], this.colors[1], this.colors[2]]);

    this.svg.append("g")//Add x axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.xScale))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", 14)
          .style("fill", "#D7DBDD");

    this.svg.append("g")//Add y axis
        .attr("class", "y axis")
        .call(d3.axisLeft(this.yScale))
        .selectAll("text")
          .style("font-size", 14)
          .style("fill","#D7DBDD");

    this.line = d3.line()
       // @ts-ignore
        .x( (d) => { return this.xScale(d.data);})
        // @ts-ignore
        .y( (d) => { return this.yScale(d.value); });
    
    this.svg.selectAll("myLines")    
        .data(this.dataset)
        .enter()
        .append("path")
        .attr("class", (d)=>{return d.name}) 
        .attr("d", (d)=>{return this.line(d.values);})
        .attr("stroke", (d)=>{return myColor(d.name);})
        .style("stroke-width", 4)
        .style("fill", "none");
  
    this.svg.selectAll("myLegend")
        .data(this.dataset)
        .enter()
          .append('g')
          .append("text")
            .attr('x', (d,i)=>{ return 50})
            .attr('y', (d,i)=> -15*i)
            .text((d)=> { return d.name; })
            .style("fill", (d)=>{ return myColor(d.name) })
            .style("font-size", 16)
          .on("click", (d)=>{
            var currentOpacity = d3.selectAll("." + d.name).style("opacity")
            // @ts-ignore
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        })

    this.svg.append("text")//Define what the x axis represents
        .attr("text-anchor", "middle")
        .attr("x", this.width - this.margin.left - this.margin.right + 10)
        .attr("y", this.height + 52)
        .text(this.axisNames[0])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    this.svg.append("text")//Define what the y axis represents
        .attr("text-anchor", "top")
        .attr("y", -9)
        .attr("x", -22)
        .text(this.axisNames[1])
        .style("font-size", 14)
        .style("fill", "#69a3b2");
  }

  private MaxOf3(){
    var max_x = d3.max(this.data, d => {return d[1];});
    var max_y = d3.max(this.data, d => {return d[2];});
    var max_z = d3.max(this.data, d => {return d[3];});
    if(max_x >= max_y){
      if(max_x >= max_z) return max_x;
      else return max_z;
    }else{
      if(max_y >= max_z) return max_y;
      else return max_z;
    } 
  }
}
