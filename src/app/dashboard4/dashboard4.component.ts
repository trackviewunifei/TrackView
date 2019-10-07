import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from '../dados.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-dashboard4',
  templateUrl: './dashboard4.component.html',
  styleUrls: ['./dashboard4.component.css']
})
export class Dashboard4Component implements OnChanges {

  @Input()
  private clientsData:any[] = [];

  //Variáveis que resultaram nos gráficos
  private grafBullet:any[];
  private pieChart:any[];
  private bulletChart:any[];
  private grafLine:any[];
  private nomesLinhas:string[] = [];
  private grafLinha:any[];

  //Variáveis auxiliares
  private  consulta: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  private dados:any[];
  private card1:string[];
  private card2:string[];
  private card3:string[];
  private card4:string[];
  private linha:any[];

  constructor(private neo4j: AngularNeo4jService, private _dados: DadosService) { 
    this.cardAjust();
    this.obDados();
  }

  ngOnChanges() {
    if(!this.clientsData)
      return;
    this.obDados();
  }

  private async obDados(){
    await this.obtemDados(this.consulta);
    this._dados.closeConnection();
    this.pieAjust();
    this.bulletAjust();
  }

  private async obtemDados(consulta :string){
    this.clientsData = await this._dados.obtemDados();
    this.linha = await this._dados.getDados("match (e:Event)-[a:AT]->(u:UserAgent) where e.date_str <= '2019-09-15' and e.date_str >= '2019-01-01' return left(e.date_str, 10) as data, u.id as navegador, count(distinct e) as eventos order by data");
    this.ajustaArrayLinha();
    this.dados = await this._dados.getDados(consulta);
    
  }

  private cardAjust(){
    this.ajustaCard("Acessos", "42 Acessos", " test1",1);
    this.ajustaCard("Aoba", "2 Acessos", " test2",2);
    this.ajustaCard("Páginas", "31 Acessos", " teste3",3);
    this.ajustaCard("Users", "32 Acessos", " teste4",4);
  }

  private ajustaCard(nomeCard:string, valorCard:string, attExtra:string, cardOpt){
    var lista:string[] = [];
    
    lista.push(nomeCard);
    lista.push(valorCard);
    lista.push(attExtra);

    if(cardOpt == 1)
      this.card1 = lista;
    else if(cardOpt == 2)
      this.card2 = lista;
    else if(cardOpt == 3)
      this.card3 = lista;
    else
      this.card4 = lista;
  }

  private ajustaArrayLinha(){
    this.grafLinha = [];
    var str:string[];
    this.linha.forEach(element => {//Obtem os nomes dos navegadores
      str = element[1].split("(");
      str = str[1].split(";");
      str = str[0].split(" ");
      if(!this.nomesLinhas.includes(str[0]))
        this.nomesLinhas.push(str[0]);
    });

    this.linha.forEach(element => {
      if(!this.grafLinha.find(ele => ele[0] == element[0])){  
        var obj:any[] = [];
        obj.push(element[0]);
        obj.push(0);
        obj.push(0);
        obj.push(0);
        for(var i = this.linha.indexOf(element); i < this.linha.length; i++){
          if(element[0] == this.linha[i][0]){
            str = this.linha[i][1].split("(");
            str = str[1].split(";");
            str = str[0].split(" ");
            obj[this.nomesLinhas.indexOf(str[0])+1] = this.linha[i][2];
          }
        }
        this.grafLinha.push(obj);
      }
    });
    //console.log(this.grafLinha);
  }

  private bulletAjust(){
    this.bulletChart = [];
    var contPlus = 0, contMinus = 0;
    var timePlus = 0, timeMinus = 0, med = 0;
    var obj = [], data1, data2;

    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      if(element["CoherenceValue"] >= 0.5){
        timePlus += data2.getTime() - data1.getTime(); 
        contPlus ++;
      }else{
        timeMinus += data2.getTime() - data1.getTime(); 
        contMinus ++;
      }
    }); 
    
    timePlus /= 1000;
    timePlus /= 60;

    timeMinus /= 1000;
    timeMinus /= 60;

    med = timePlus/contPlus;
    med += timeMinus/contMinus;
    med /= 2;
    obj.push("Média");
    obj.push(med);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Mais de 50% de Coerência");
    obj.push(timePlus/contPlus);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Menos de 50% de Coerência");
    obj.push(timeMinus/contMinus);
    this.bulletChart.push(obj);
  }

  private pieAjust(){
    this.pieChart = [];
    var contPlus = 0, contMinus = 0;
    var obj = [];
    this.clientsData.forEach(element => {
      if(element["CoherenceValue"] >= 0.5)
        contPlus ++;
      else
        contMinus ++;
    }); 
    
    obj.push("Mais de 50% de Coerência");
    obj.push(contPlus);

    this.pieChart.push(obj);
    obj = [];

    obj.push("Menos de 50% de Coerência");
    obj.push(contMinus);

    this.pieChart.push(obj);
  }

  private areaAjust(){

  }

  private lineAjust(){

  }

  private calcMed(){

  }

  private calcDeviation(){

  }
}
