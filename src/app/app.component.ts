import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel, MyDataModel, LineModel } from 'src/app/data/data.model';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './dados.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TrackView';

  data: Observable<DataModel>;
  myData: Observable<MyDataModel>;
  lineData: Observable<LineModel>;
  
  //consulta: string = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return pag.name, count(r) as numProdutos";
  consulta: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  consulta1: string = "match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-08-27' and e.date_str >= '2019-08-20' return p.id as Pagina, count(distinct e)/count(distinct left(e.date_str, 10)) as eventos order by eventos desc";
  consulta2: string = "match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-08-27' and e.date_str >= '2019-08-01' return p.id, left(e.date_str, 10) as data, count(distinct e) as eventos order by eventos desc";
  
  private dados:any[] = [];
  private dados2:any[] = [];

  private area1:any[] = [];
  private area2:any[] = [];
  private nomesLinhas:string[] = [];
  private grafArea:any[];
  private grafLinha:any[];
  private grafRadar:any[];
  private linha:any[] = [];
  private radar:any[];
  private cons1:any[];
  private cons2:any[];
  private cons3:any[];
  private cons4:any[];

  dash1:boolean = true;
  dash2:boolean = false;
  dash3:boolean = false;

  constructor(private http: HttpClient, private neo4j: AngularNeo4jService, private _dados: DadosService) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.myData = this.http.get<MyDataModel>('./assets/mydata.json');
    this.lineData = this.http.get<LineModel>('./assets/line.json');
    this.obDados();
  }

  private async obDados(){
    this.leituraRespostasQuestionario();
    await this.obtemDados(this.consulta, true);
    //await this.obtemDados(this.consulta1, false);
    //await this.obtemDados(this.consulta2);
    this._dados.closeConnection();
  }

  private async obtemDados(consulta :string, opt: boolean){
    if(opt == true){
      this.dados = await this._dados.getDados(consulta);
      //console.log(this.dados);
      this.cons1 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct e) as eventos order by eventos desc");
      this.cons2 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.cons3 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.cons4 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) match (e:Event)-[o:ON]->(l:Element) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.dados2 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return e.client_id, e.date_str as data order by data");
      this.radar = [];
      this.uneRadar("Pagina", '#26AF32');

      this.cons3 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct e) as eventos order by eventos desc");
      this.uneRadar("Pagina 2", '#762712');

      this.cons1 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) match (e:Event)-[o:ON]->(l:Element) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.uneRadar("Pagina 3", '#2a2fd4');
      this.grafRadar = this.radar;
      console.log(this.grafRadar);
      this.ajustaDataRadar();
    }else{
      this.dados2 = await this._dados.getDados(consulta);
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
    console.log(this.grafLinha);
  }
  
  private ajustaDataRadar(){
    var cont = 0;
    var str1:string[];
    var str2:string[];
    var tempo = 0;
    for(var i = 0; i < this.dados2.length-1; i++){
      if(this.dados2[i][0] == this.dados2[i+1][0]){
        str1 = this.dados2[i][1].split("T");//isso para pegar apenas o dia/mes/ano
        str2 = this.dados2[i+1][1].split("T");
        
        if(str1[0] == str2[0]){
          str1 = str1[1].split(":");//isso para separar hora - minuto - segundo
          str2 = str2[1].split(":");
          
          if(str1[0] != str2[0] && (parseInt(str2[0])-parseInt(str1[0])) == 1)//verifica se a hora é igual ou com no maximo uma hora de diferença
            tempo += parseInt(str2[1]) + 60 - parseInt(str1[1]);
          else//soma a diferença de minutos no tempo
            tempo += parseInt(str2[1]) - parseInt(str1[1]);

          cont++;
        }
      }
    }
    //console.log(tempo + " tempo/cont" + tempo/cont);
    //return pagina/tempo ->radar chart
  }

  private uneRadar(pag :string, color: string){
    var obj = new Object();
    obj["name"] = pag;
    var arr:any[] = [];
    
    var obj1 = new Object();
    var obj2 = new Object();
    var obj3 = new Object();
    var obj4 = new Object();
    obj1["axis"] = "Total Eventos";
    obj1["value"] = this.cons1[0][1];
    arr.push(obj1);
    obj2["axis"] = "Tempo Médio";
    obj2["value"] = this.cons2[0][1];
    arr.push(obj2);
    obj3["axis"] = "Elementos foram clicados";
    obj3["value"] = this.cons3[0][1];
    arr.push(obj3);
    obj4["axis"] = "Eventos por usuário";
    obj4["value"] = this.cons4[0][1];
    arr.push(obj4);
    obj["axes"] = arr;
    obj["color"] = color;
    this.radar.push(obj);
  } 

  private leituraRespostasQuestionario(){
    var objects:any[] = [];
    var obj;
    d3.csv("../../assets/form.csv").then((data)=> {//Le o csv
      data.forEach(element => {//para cada elemento vindo do csv ira
        obj = new Object();
        //replace(/[\\"]/g, ''); possivel necessidade disso depois
        obj["Time"] = element.Timestamp;
        obj["Name"] = element.Name;
        obj["Area"] = this.particionaPalavra(element.Area, ";");
        obj["Technology"] = this.particionaPalavra(element.Technology, ";");
        obj["Perfil"] = this.particionaPalavra(element.Perfil, ";");
        objects.push(obj);
      }); 
    });
    console.log(objects);
  }

  private particionaPalavra(palavra:string, split:string){
    var stringSplit: string[] = palavra.split(split);
    var item:string[] = [];
    stringSplit.forEach(element => {
      item.push(element);
    });
    return item;
  }

  onChange(event){
    if(event.target.value == "Dashboard 1"){
      this.dash1 = true;
      this.dash2 = false;
      this.dash3 = false;
      this.consulta = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
      //this.consulta = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return pag.name, count(r) as numProdutos";
    }else if(event.target.value == "Dashboard 2"){
      this.dash1 = false;
      this.dash2 = true;
      this.dash3 = false; 
      this.consulta = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
      //this.consulta = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return p.name, count(r) as numPesquisa";
    }else if(event.target.value == "Dashboard 3"){
      this.dash1 = false;
      this.dash2 = false;
      this.dash3 = true;
      this.consulta = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
      //this.consulta = "match (p:product)<-[re: pays_for]-(pag:page)return p.name, re.quantity*p.price  as ValorTotal";    
    }
    
    this.obDados();
  }

}
