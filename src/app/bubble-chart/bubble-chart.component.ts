import { Component, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnChanges {

  @ViewChild('chart', {static:false})
  private chartContainer: ElementRef;
  
  @Input()
  data:any[] = [];

  @Input()
  private axisNames:string[] = [];

  @Input()
  private colors:any[] = [];

  @Input()
  private areasName:string[] = [];

  private dados:any[] = [];

  private margin = {top: 50, right: 20, bottom: 50, left: 60};

  constructor() { }

  ngOnChanges() {
    this.createChart();
  }
  private createChart(){
    if(!this.data)
      return;
      
    const element = this.chartContainer.nativeElement;//recebe a div que contera o svg
    d3.select(element).select('svg').remove();
    
    //Define os tamanhos
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    const svg = d3.select(element).append('svg')//Coloca o svg nessa div
        .attr('width', element.offsetWidth)
        .attr('height', contentHeight + this.margin.top + this.margin.bottom);
    const g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    var opacity = 0.55;

    var color = d3.scaleOrdinal()//Define as cores
      .domain(["1", "2"])
      .range([this.colors[0], this.colors[1]]);
    
    var x = d3.scalePoint().rangeRound([0, contentWidth]),
      y = d3.scaleLinear().rangeRound([contentHeight, 0]);
      
    // @ts-ignore
    x.domain(this.data.map((d) => d[0]));
    y.domain([0, this.maxOf2()]);
  
    g.append("g")//Atribui os valores ao eixo horizontal
        .attr("class", "x axis")
        .attr("transform", "translate(0," + contentHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");

        svg.append("text")//Coloca o que o eixo x representa
        .attr("text-anchor", "middle")
        .attr("x", contentWidth)
        .attr("y", contentHeight + 92)
        .text(this.axisNames[0])
        .style("font-size", 14)
        .style("fill", "#69a3b2");

    g.append("g")//Atribui os valores ao eixo vertical
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .selectAll("text")
        .style("font-size", 14)
        .style("fill", "#D7DBDD");
     

    svg.append("text")//Coloca o que o eixo y representa
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

      //Definição da legenda e sua posição
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
/* 
//Recebe os dados separados e junta eles, formando um array de objetos
    //sendo que cada objeto contem o nome e os tempos
    function convertDate(dadosOriginais){
      var dados = [];
      var num:number;
      var obj;
      var datas:number;
      dadosOriginais.forEach(element => {
        num = verifica(dados, element[0]);
        datas = calculaDatas(element[1], element[2]);
        if(num == -1){
          obj = {
            nome:element[0],
            tempo:[]
          };
          obj.tempo.push(datas);
          dados.push(obj);
        }else{
          obj = dados[num];
          obj.tempo.push(datas);
        }
      });
      return dados;
    }
    function calculaDatas(dat1:string, dat2:string){
      //Falta a comparação caso a diferença seja tipo maior q uma hora
      var primDat = parseInt(dat1.substr(3,4));
      var seguDat = parseInt(dat2.substr(3,4));
      var datas:number;
      if(primDat <= seguDat){
        datas = seguDat-primDat;
      }else{
        datas = 60 - seguDat + primDat;
      }
      return datas;
    }

    function verifica(dados:any, tipo:string){
      var cont = -1;
      var verifica = 0;
      if(dados.length == 0) return -1;
      dados.forEach(element =>{
        cont ++;
        if(element.nome == tipo && verifica == 0){
          verifica = 1;
        }
      });
      if(verifica == 1)
        return cont;
      else
        return -1;
    }
*/