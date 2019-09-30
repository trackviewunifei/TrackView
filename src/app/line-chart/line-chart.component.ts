import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges{

  @ViewChild('chart')
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
  private tipos: string[];

  @Input()
  dados:any [];

  margin = {top: 40, right: 20, bottom: 60, left: 40};

  constructor() { }

  ngOnChanges(): void {
    if (!this.dados || !this.tipos) 
      return;
    this.htmlElement = this.chartContainer.nativeElement;
    this.host = d3.select(this.htmlElement);
    this.setup();
    this.buildSVG();
    this.buildLine();
  }

  private setup(): void {
    this.width = this.htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = 250 - this.margin.top - this.margin.bottom;

    this.dataset = this.tipos.map((nomeTipo)=>{
      return{
        name:nomeTipo,
        values:this.dados.map((d)=>{
          var indice = this.tipos.indexOf(nomeTipo);
          if(indice == 0)
            return {data: d[0], value:+d[indice+1]};
          else if(indice == 1)
            return {data: d[0], value:+d[indice+1]};
          else return {data: d[0], value:+d[indice+1]};
        })
      };
    });
    console.log(this.dataset);
    this.xScale = d3.scalePoint()
        .domain(this.dados.map(d => {return d[0];}))
        .range([0, this.width]);
    
    this.yScale = d3.scaleLinear()
        .domain([0, this.MaxOf3()])
        .range([this.height, 0]);
  }
  private buildSVG(): void {
      this.host.html("");
      this.svg = this.host.append("svg") 
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  private buildLine(): void {
    var myColor = d3.scaleOrdinal()
      .domain(this.tipos)
      .range(d3.schemeCategory10);

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.xScale))
        .selectAll("text")
          .attr("transform", "translate(-10,10)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", 10)
          .style("fill", "#69a3b2");

    this.svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(this.yScale));

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

    this.svg.selectAll("myDots")
          .data(this.dataset)
          .enter()
            .append("g")
            .style("fill", (d)=>{return myColor(d.name);})
            .attr("class", (d)=>{return d.name;})
          .selectAll("myPoints")
          .data((d)=>{return d.values;}) 
          .enter()
          .append("circle")
            .attr("cx", (d) => { return this.xScale(d.data); })
            .attr("cy", (d) => { return this.yScale(d.value); })
            .attr("r", 3)
            .attr("stroke", "white");
    /*
    this.svg.selectAll("myLabels")
        .data(this.dataset)
        .enter()
          .append('g')
          .append("text")
            .attr("class", (d)=>{ return d.name })
            .datum((d) =>{ return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time sery
            .attr("transform", (d)=> { return "translate(" + this.xScale(d.value.data) + "," + this.yScale(d.value.value) + ")rotate(-45)"; }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .attr("y", (d, i)=> -8*i)
            .text((d) =>{ return d.name; })
            .style("fill", (d)=>{ return myColor(d.name) })
            .style("font-size", 10)
      */
          // Add a legend (interactive)
    this.svg.selectAll("myLegend")
        .data(this.dataset)
        .enter()
          .append('g')
          .append("text")
            .attr('x', (d,i)=>{ return 10 + i*50})
            .attr('y', (d,i)=> -13*i)
            .text((d)=> { return d.name; })
            .style("fill", (d)=>{ return myColor(d.name) })
            .style("font-size", 12)
          .on("click", (d)=>{
            var currentOpacity = d3.selectAll("." + d.name).style("opacity")
            // @ts-ignore
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        })
    this.svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left+15)
        .attr("x", -this.margin.top)
        .text("Valor")
        .style("font-size", 10)
        .style("fill", "#69a3b2");
  }

  private MaxOf3(){
    var max_x = d3.max(this.dados, d => {return d[1];});
    var max_y = d3.max(this.dados, d => {return d[2];});
    var max_z = d3.max(this.dados, d => {return d[3];});
    if(max_x >= max_y){
      if(max_x >= max_z) return max_x;
      else return max_z;
    }else{
      if(max_y >= max_z) return max_y;
      else return max_z;
    } 
  }
}
