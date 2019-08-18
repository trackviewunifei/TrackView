import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel, MyDataModel } from 'src/app/data/data.model';
import { DadosService } from '../dados.service';
import * as d3tip from '../../assets/d3.tip.v0.7.1.js'

@Component({
  selector: 'app-donut-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnChanges{

  @ViewChild('chart')
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
  data: DataModel[];
  @Input()
  myData: MyDataModel[];
  @Input()
  query: string 
  @Input()
  dados:any[] = [];
  margin = {top: 10, right: 10, bottom: 10, left: 10};

  constructor(private _dados: DadosService) { }

  ngOnChanges(): void {
    this.createChart();
  }

  private createChart(){
    //this.dados = await this._dados.getDados(this.query);
    if (!this.dados) { return; }
    //console.log("Dados originais: "+this.dados);
    
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
    let pieColor = d3.scaleOrdinal(d3.schemeCategory10);
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

}
