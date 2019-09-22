import { Component, OnInit } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './../dados.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {

  //Variáveis que resultaram nos gráficos
  private grafRadar:any[];

  //Variáveis auxiliares
  private radar:any[];
  private cons1:any[];
  private cons2:any[];
  private cons3:any[];
  private cons4:any[];
  private  consulta: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  private dados:any[];

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
      this.cons1 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct e) as eventos order by eventos desc");
      this.cons2 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.cons3 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.cons4 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) match (e:Event)-[o:ON]->(l:Element) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.dados = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return e.client_id, e.date_str as data order by data");
      this.radar = [];
      this.uneRadar("Pagina", '#26AF32');

      this.cons3 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct e) as eventos order by eventos desc");
      this.uneRadar("Pagina 2", '#762712');

      this.cons1 = await this._dados.getDados("match (e:Event)-[i:IN]->(p:Page) match (e:Event)<-[t:TRIGGERED]-(u:User) match (e:Event)-[o:ON]->(l:Element) where e.date_str <= '2019-09-27' and e.date_str >= '2019-01-01' and p.id = 'guilheeeeeeerme.github.io/footstep' return p.id as pagina, count(distinct u.client_id) as qtdUsuarios");
      this.uneRadar("Pagina 3", '#2a2fd4');
      this.grafRadar = this.radar;
      console.log(this.grafRadar);
      this.ajustaDataRadar();
      this.dados = await this._dados.getDados(consulta);
    }
  }

  
  private ajustaDataRadar(){
    var cont = 0;
    var str1:string[];
    var str2:string[];
    var tempo = 0;
    for(var i = 0; i < this.dados.length-1; i++){
      if(this.dados[i][0] == this.dados[i+1][0]){
        str1 = this.dados[i][1].split("T");//isso para pegar apenas o dia/mes/ano
        str2 = this.dados[i+1][1].split("T");
        
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
  

}
