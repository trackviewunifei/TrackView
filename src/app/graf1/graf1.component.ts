import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-graf1',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graf1.component.html',
  styleUrls: ['./graf1.component.css']
})
export class Graf1Component implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  
  @Input()
  private dados:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:string[] = [];

  margin = {top: 20, right: 20, bottom: 70, left: 50};

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
        .attr('height', 250);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map((d, i) => this.dados[i][0]));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);
    /*
    const colorScale = d3.scaleOrdinal(d3.schemeRdYlBu[9])
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);
    */
    const colorScale = d3.scaleOrdinal()
      .domain(["0", "1", "2", "3", "4", "5"])
      .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5],]);


    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .style("fill", function (d, i) { return ""+colorScale(i+""); });

    g.append('g')//Preenche o eixo y
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr("y", 0 - this.margin.left)
        .attr('dy', '0.31em')
        .attr('text-anchor', 'middle')
        .text('Quantidade');

    g.selectAll('.bar')//Preenche o grafico com as barras
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(this.dados[i][0]))
        .attr('y', (d, i) => y(this.dados[i][1]))
        .attr('width', x.bandwidth())
        .attr('height', (d, i) => contentHeight - y(this.dados[i][1]))
        .style("fill", function (d, i) { return ""+colorScale(i+""); });

    svg.append("text")//Coloca o que o eixo x representa
        .attr("text-anchor", "middle")
        .attr("x", contentWidth+25)
        .attr("y", contentHeight + this.margin.top + 55)
        .text(this.axisNames[0])
        .style("font-size", 12)
        .style("fill", "#69a3b2");

    svg.append("text")//Coloca o que o eixo y representa
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 16)
        .attr("x", -50)
        .text(this.axisNames[1])
        .style("font-size", 12)
        .style("fill", "#69a3b2");
  }

  /*//versao anterior utilizando json
  private createChart(): void {

    const element = this.chartContainer.nativeElement;
    const data = this.myData;
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', 250);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.name));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.age)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr("y", 0 - this.margin.left)
        .attr('dy', '0.31em')
        .attr('text-anchor', 'middle')
        .text('idade');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.age))
        .attr('width', x.bandwidth())
        .attr('height', d => contentHeight - y(d.age));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", contentWidth-130)
        .attr("y", contentHeight + this.margin.top + 35)
        .text("Pessoas")
        .style("font-size", 12)
        .style("fill", "#69a3b2");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -100)
        .text("Idade")
        .style("font-size", 12)
        .style("fill", "#69a3b2");
  }*/
}
