import { Component, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnChanges {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  
  @Input()
  data:any[] = [];

  private dados:any[] = [];

  margin = {top: 20, right: 20, bottom: 40, left: 50};

  constructor() { }

  ngOnChanges() {
    this.createChart();
  }
  private createChart(){

    const element = this.chartContainer.nativeElement;//recebe a div que contera o svg
    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')//Coloca o svg nessa div
        .attr('width', element.offsetWidth)
        .attr('height', 250);
    const g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    //Define os tamanhos
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = 250 - this.margin.top - this.margin.bottom;

    var color = d3.scaleOrdinal()//Define as cores
      .domain(["Eventos", "Média de Eventos"])
      .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"]);
    
    var x = d3.scalePoint().rangeRound([0, contentWidth]),
      y = d3.scaleLinear().rangeRound([contentHeight, 0]);
      
    if(!this.data)
      return;
      
    // @ts-ignore
    x.domain(this.data.map((d) => d[0]));
    y.domain([0, d3.max(this.data, (d) => d[1])]);
  
    g.append("g")//Atribui os valores ao eixo horizontal
        .attr("class", "x axis")
        .attr("transform", "translate(0," + contentHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "end")
        .style("font-size", 10);
  
    g.append("g")//Atribui os valores ao eixo vertical
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "gray")
        .text("Acessos");

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
          .style("fill", "rgba(249, 208, 87, 0.7)");
    
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
          .style("fill", "rgba(54, 174, 175, 0.65)");
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