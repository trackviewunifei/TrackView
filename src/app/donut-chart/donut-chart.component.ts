import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3tip from '../../assets/d3.tip.v0.7.1.js'

@Component({
  selector: 'app-donut-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnChanges{

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  private host: any;
  private svg: any;
  private width: number;
  private height: number;
  private contentWidth: number;
  private contentHeight: number;
  private radius: number;
  private htmlElement: HTMLElement;
  private tip:any;

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
      let innerRadius = this.radius * 0.3;
      let outerRadius = this.radius * 0.7;

      //let pieColor = d3.scaleOrdinal(d3.schemeCategory10);//Define o tipo de escala
      
      var pieColor = d3.scaleOrdinal()
        .domain([0+"",1+"", 2+"",3+"", 4+"",5+""])
        .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5]]);

      let arc = d3.arc()//Define o tamanho do circulo
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
      
      let outerArc = d3.arc()
          .innerRadius(this.radius * 0.9)
          .outerRadius(this.radius * 0.9);
      
      const tooltip = d3.select("#tooltip")

      arcSelection.append("path")//Coloca as cores
          .attr("d", arc)
          .attr("fill", (d, index) => {
              return pieColor(index+"");
          })
          .on('mouseover',onMouseEnter)
          .on('mouseout',onMouseLeave);

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
        .style("font-size", 16)
        .style("fill", "#69a3b2");

      arcSelection.append("polyline")//Atribui as linhas para os tipos
          .attr("points", d =>{
            var pos = outerArc.centroid(d);
            pos[0] = this.radius * 0.8 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arc.centroid(d), outerArc.centroid(d), pos]
        })

      function onMouseEnter(datum){
        console.log("aoba");
        tooltip.style("opacity", 1)
        tooltip.select("#range")
        .text([
            datum.x0 < 0
              ? `Under-estimated by`
              : `Over-estimated by`,
          Math.abs(datum.x0),
          "to",
          Math.abs(datum.x1),
          "hours",
        ].join(" "))
      }

      function onMouseLeave(){
        console.log("saiu");
      }

      function midAngle(d) { 
        return d.startAngle + (d.endAngle - d.startAngle) / 2; 
      } 
   
  }
  /*
  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  private host: any;
  private svg: any;
  private width: number;
  private height: number;
  private contentWidth: number;
  private contentHeight: number;
  private radius: number;
  private htmlElement: HTMLElement;
  private tip:any;

  @Input()
  dados:any[] = [];

  @Input()
  private colors:string[] = [];

  margin = {top: 10, right: 10, bottom: 10, left: 10};

  constructor() { }

  ngOnChanges(): void {
    this.createChart();
  }

  private createChart(){
    if (!this.dados) 
      return;
    
    this.htmlElement = this.chartContainer.nativeElement;
    this.host = d3.select(this.htmlElement);
    
    this.width = this.htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = 250-this.margin.top - this.margin.bottom;
    
    this.radius = Math.min(this.width, this.height)/2;//Define o raio
    
    this.tip = d3tip()//Codigo que ao passar o mouse sobre um arc mostrará infor sobre ele
      .attr('class', 'd3-tip')
      .offset([0, 0])
      .html(function(d, i) {
        return d.data[0] + ": <span style='color:orangered'>" + d.data[1] + "</span>";
    });
    let maiorValor = this.calcMaiorValor();//Atribui as variaveis valores de calculos necessarios
    let media = this.calcMedia();
    
    this.host.html("");
    this.svg = this.host.append("svg") //Atribui o svg com os tamanhos 
      .data([this.dados])
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${(this.width + this.margin.left + this.margin.right)/2},${(this.height+ this.margin.top + this.margin.bottom)/2})`);

    this.svg.call(this.tip);//Aplica a codigo de atribuir informações

    let pie = d3.pie()//Chama o metodo que definirá o donut
      .sort(null) 
      .value((d:any) => {return (maiorValor+d[1])/media;});//Para que nao haja muita descrepancia sobre a largura dos arcos, foi utilizado este calculo

    let innerRadius = this.radius * 0.4;
    let raid = this.radius
    //let pieColor = d3.scaleOrdinal(d3.schemeCategory10);
    
    var pieColor = d3.scaleOrdinal()
    .domain([0+"",1+"", 2+"",3+"", 4+"",5+""])
    .range([this.colors[0], this.colors[1], this.colors[2], this.colors[3], this.colors[4], this.colors[5]]);

    let arc = d3.arc()//Define o comprimento do arco
      .innerRadius(innerRadius)
      .outerRadius(function (d){
        // @ts-ignore
        return (raid - innerRadius) *(d.data[1]/maiorValor) + innerRadius;
      });
    
    let outerArc = d3.arc()//Define o outer arc
      .innerRadius(innerRadius)
      .outerRadius(this.radius);
    
    let arcSelection = this.svg.selectAll(".arc")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "arc");
    
    arcSelection.append("path")//Coloca as cores dos arcos
      .attr("d", arc)
      .attr("fill", (d, index) => {
          return pieColor(index);
      })
      .attr("stroke", "gray")
      .on('mouseover',this.tip.show)
      .on('mouseout',this.tip.hide);
    
    var outerPath = this.svg.selectAll(".outlineArc")
        .data(pie(this.dados))//Atribui as linhas aos redores dos arcos
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outerArc);
    
    this.svg.append("svg:text")//Atribui o texto central
      .attr("class", "aster-score")
      .attr("dy", ".35em")
      .attr("text-anchor","middle")
      .attr("fill", "gray")
      .text("Média: " + media.toFixed(0));
  }
  private calcMaiorValor(){//Funcao que encontra o maior valor
    var valor = 0;
    this.dados.forEach(element => {
      if(element[1]>valor)
        valor = element[1];
    });
    return valor;
  }
  private calcMedia(){//Funcao que calcula a media
    var media = 0;
    this.dados.forEach(element=>{
      media += element[1];
    });
    return (media/this.dados.length);
  }
*/
}
