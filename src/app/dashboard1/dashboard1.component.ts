import { Component, OnInit } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './../dados.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit {

  //Variáveis que resultaram nos gráficos
  private grafDonut:any[];
  private grafBar:any[];
  private grafArea:any[];
  private grafLine:any[];

  //Variáveis auxiliares
  private consultaBar: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  private consultaDonut: string = "match (c:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[a:AT]->(u:UserAgent) where e.date_str =~ '.*2019-09-20.*' and p.id = 'guilheeeeeeerme.github.io/footstep' return u.id, count(distinct c) as qtdUsers";
  private consultaArea1: string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) where e.date_str =~ '.*2019-09-20.*' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, right(left(e.date_str, 13),2) as data, count(distinct u) as qtdUsers order by data";
  private consultaArea2: string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) where e.date_str =~ '.*2019-09.*' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, right(left(e.date_str, 13),2) as data, count(distinct u) as qtdUsers order by data";
  
  private area1:any[];
  private area2:any[];
  private dados:any[];
  /*
  private linha:any[];
  private nomesLinhas:string[];
  */
  constructor(private neo4j: AngularNeo4jService, private _dados: DadosService) { 
    this.obDados();
  }

  ngOnInit() {
  }

  private async obDados(){
    await this.obtemDados();
    this._dados.closeConnection();
  }

  private async obtemDados(){
      this.uneArrayArea();
      /*
      this.linha = await this._dados.getDados("match (e:Event)-[a:AT]->(u:UserAgent) where e.date_str <= '2019-09-15' and e.date_str >= '2019-01-01' return left(e.date_str, 10) as data, u.id as navegador, count(distinct e) as eventos order by data");
      this.ajustaArrayLinha();
      this.linha = await this._dados.getDados("match (e:Event)-[a:AT]->(u:UserAgent) where e.date_str <= '2019-09-15' and e.date_str >= '2019-01-01' return left(e.date_str, 10) as data, u.id as navegador, count(distinct e) as eventos order by data");
      */
      
  }

  private ajusteDonut(){

  }

  private AjustaBar(){
    
  }

  private ajustaArrayArea(hora){
    var obj:any[] ;
    
    if (hora >= 24)
      hora = 23;
    
      for(var i = 0; i <= hora; i++){
      obj = [];//pre aloca o vetor que conterá os dados
      obj.push(i);
      obj.push(0);
      obj.push(0);
      this.grafArea.push(obj); 
    }
  }
  
  private uneArrayArea(){
    this.grafArea = [];
    this.ajustaArrayArea(23);

    this.area1.forEach(element => {
      this.grafArea[parseInt(element[1])][1] = element[2];
    });

    this.area2.forEach(element => {
      this.grafArea[parseInt(element[1])][2] = element[2]/20;//dividir pelo numero de dias do mês para dar uma média
    });
  }

  /*
  private ajustaArrayLinha(){
    this.grafLine = [];
    var str:string[];
    this.nomesLinhas = [];
    this.linha.forEach(element => {//Obtem os nomes dos navegadores
      str = element[1].split("(");
      str = str[1].split(";");
      str = str[0].split(" ");
      if(!this.nomesLinhas.includes(str[0]))
        this.nomesLinhas.push(str[0]);
    });

    this.linha.forEach(element => {
      if(!this.grafLine.find(ele => ele[0] == element[0])){  
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

        this.grafLine.push(obj);
      }
    });
  }
  */
}
