import { Component, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { DadosService } from '../dados.service';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnChanges {

  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input()
  query: string;
 
  private dados:any[] = [];

  margin = {top: 20, right: 20, bottom: 40, left: 50};

  constructor(private _dados: DadosService) { }

  ngOnChanges() {
    this.createChart();
  }
  private createChart(){
    //this.dados = await this._dados.getDados(this.query);
    //console.log(this.dados);

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
      .domain(["PVkW", "TBLkW"])
      .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.65)"]);
    
    var parseDate = d3.timeParse("%Y/%m/%d %H:%M");//Define questoes de hora para a manipulacao do eixo x
    var x = d3.scaleTime().range([0, contentWidth]),
      y = d3.scaleLinear().range([contentHeight, 0]),
      z = color;
    
    d3.csv("../../assets/area.csv").then((data)=> {//Le o csv
      data.forEach(element => {//para cada elemento vindo do csv ira
        // @ts-ignore
        element.date = parseDate(element.date);
        // @ts-ignore
        element.PVkW = parseInt(element.PVkW);
        // @ts-ignore
        element.TBLkW = parseInt(element.TBLkW); 
      }); 
      var sources = data.columns.slice(1).map((id)=> {//fara a uniao dos valores para cada tipo
        return {//tendo assim um array de objetis [{tipos, [datas]},...]
          id: id,
          values: data.map((d)=> {
            return {date: d.date, kW: d[id]};
          })
        };
      });
      
      //console.log(sources);
      // @ts-ignore
      x.domain(d3.extent(data, (d)=> { return d.date; }));
      y.domain([
        0,
        // @ts-ignore
        d3.max(sources, (c)=> { return d3.max(c.values, (d)=> { return d.kW; }); })
      ]);
      z.domain(sources.map((c)=> { return c.id; }));
    
      g.append("g")//Atribui os valores ao eixo horizontal
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + contentHeight + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", 10);
    
      g.append("g")//Atribui os valores ao eixo vertical
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("fill", "gray")
          .text("Power, kW");
    
      var source = g.selectAll(".area")
          .data(sources)
          .enter().append("g")
          .attr("class", (d)=> { return `area ${d.id}`; })
    
      source.append("path")
            // @ts-ignore
            .attr("d", (d)=> { return area(d.values); })
            // @ts-ignore
            .style("fill", (d)=> { return z(d.id); });
    });
    var area = d3.area()
      .curve(d3.curveMonotoneX)
      // @ts-ignore
      .x((d)=> { return x(d.date); })
      .y0(y(0))
      // @ts-ignore
      .y1((d)=> { return y(d.kW); });
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