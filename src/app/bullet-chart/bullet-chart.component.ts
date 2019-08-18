import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel, MyDataModel } from 'src/app/data/data.model';
import { DadosService } from '../dados.service';

@Component({
  selector: 'app-bullet-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bullet-chart.component.html',
  styleUrls: ['./bullet-chart.component.css']
})
export class BulletChartComponent implements OnChanges {

  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input()
  query: string;
  @Input()
  private dados:any[] = [];

  margin = {top: 20, right: 20, bottom: 40, left: 70};

  constructor(private _dados: DadosService) { }

  ngOnChanges(): void {
    //this._dados.dadoAtual.subscribe(dadoNovo => this.dados = dadoNovo);
    this.createChart();
  }

  private createChart(){
    //this.dados = await this._dados.getDados(this.query);
    if (!this.dados) { return; }
    //console.log("Dados originais: "+this.dados);
    
    const element = this.chartContainer.nativeElement;
    const data = this.dados;
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', 250);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleLinear()
      .range([0, contentWidth])
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);

    const y = d3
      .scaleBand()
      .range([contentHeight, 0])
      .padding(0.1)
      .domain(data.map((d, i) => this.dados[i][0]));

    const colorScale = d3.scaleOrdinal(d3.schemePaired)
      .domain([0, d3.max(data, (d, i) => this.dados[i][1])]);

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
        .style("fill", function (d, i) { return colorScale(d[1]); });


    // add the x Axis
    g.append("g")
      .attr("transform", "translate(0," + contentHeight + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    g.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")//Coloca o que o eixo x representa
        .attr("text-anchor", "middle")
        .attr("x", contentWidth+25)
        .attr("y", contentHeight + this.margin.top + 35)
        .text("Produtos")
        .style("font-size", 12)
        .style("fill", "#69a3b2");

    svg.append("text")//Coloca o que o eixo y representa
        .attr("text-anchor", "top")
        .attr("y", 15)
        .attr("x", 15)
        .text("Valor")
        .style("font-size", 12)
        .style("fill", "#69a3b2");
  }
}
