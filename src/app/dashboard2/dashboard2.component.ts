import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './../dados.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnChanges {

  //Variáveis que resultaram nos gráficos
  private grafRadar:any[];
  private grafPizza:any[];
  private grafBar:any[];
  private grafLine:any[];
  private nomesLinhas:string[] = [];
  private grafLinha:any[];
  private card1:string[];
  private card2:string[];
  private card3:string[];
  private card4:string[];

  //Variáveis auxiliares
  private radar:any[];
  private cons1:any[];
  private cons2:any[];
  private cons3:any[];
  private cons4:any[];
  private linha:any[];
  private consulta: string = "match (e:Event)-[r:IN]->(p:Page) return p.host, e.date limit 5";
  private dados:any[];

  constructor(private neo4j: AngularNeo4jService, private _dados: DadosService) { 
    this.obDados();
  }

  ngOnChanges() {
    this.obDados();
  }

  private async obDados(){
    await this.obtemDados(this.consulta);
    //await this.obtemDados(this.consulta1, false);
    //await this.obtemDados(this.consulta2);
    this._dados.closeConnection();
  }

  private async obtemDados(consulta :string){

    this.ajustaCard("Acessos", "42 Acessos", " test1",1);
    this.ajustaCard("Aoba", "2 Acessos", " test2",2);
    this.ajustaCard("Páginas", "31 Acessos", " teste3",3);
    this.ajustaCard("Users", "32 Acessos", " teste4",4);

    this.ajustaArrayLinha();
    this.radar = [];
    this.uneRadar("Pagina", '#26AF32');

    this.uneRadar("Pagina 2", '#762712');

    this.uneRadar("Pagina 3", '#2a2fd4');
    this.grafRadar = this.radar;
    console.log(this.grafRadar);
    this.ajustaDataRadar();
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

}
