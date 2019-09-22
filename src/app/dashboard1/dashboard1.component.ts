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
  private grafBullet:any[];
  private grafArea:any[];
  private grafLine:any[];

  //Variáveis auxiliares
  private  consulta: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  private dados:any[];
  private area1:any[];
  private area2:any[];
  private linha:any[];
  private nomesLinhas:string[];

  constructor(private neo4j: AngularNeo4jService, private _dados: DadosService) { 
    this.obDados();
  }

  ngOnInit() {
  }

  private async obDados(){
    await this.obtemDados(this.consulta, true);
    //await this.obtemDados(this.consulta1, false);
    //await this.obtemDados(this.consulta2);
    this._dados.closeConnection();
  }

  private async obtemDados(consulta :string, opt: boolean){
    if(opt == false){
      this.dados = await this._dados.getDados(consulta);
      //console.log(this.dados);
     
    }else{
      this.dados = await this._dados.getDados(consulta);
      this.area1 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, left(e.date_str, 10) as data, count(distinct e) as eventos order by data");
      this.area2 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct e) as eventos order by eventos desc");
      this.uneArrayArea();
      this.linha = await this._dados.getDados("match (e:Event)-[a:AT]->(u:UserAgent) where e.date_str <= '2019-09-15' and e.date_str >= '2019-01-01' return left(e.date_str, 10) as data, u.id as navegador, count(distinct e) as eventos order by data");
      this.ajustaArrayLinha();
    }
  }

  private uneArrayArea(){
    var media = this.area2[0][1]/this.area1.length;
    this.grafArea = [];

    this.area1.forEach(element => {
      var obj:any[] = [];
      obj.push(element[1]);
      obj.push(element[2]);
      obj.push(media);
      this.grafArea.push(obj);
    });
  }

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
  
  

}
