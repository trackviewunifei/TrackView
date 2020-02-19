import { Component, OnChanges, Input } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dashboard5',
  templateUrl: './dashboard5.component.html',
  styleUrls: ['./dashboard5.component.css']
})
export class Dashboard5Component implements OnChanges {

  @Input()
  private group1Data:any[] = [];
  private group2Data:any[] = [];

  private queryGroup2:string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-11-01' and e.date_str >= '2019-10-31T18' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
  private queryGroup1:string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-10-02T18' and e.date_str >= '2019-10-02T16' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
  //Variáveis que resultarão nos gráficos
  private radarChart:any[];
  private areaChart:any[];  
  private lineChart:any[];
  private bulletChart:any[];

  //Variáveis auxiliares
  private nomesLinhas:string[] = [];
  private areasNames:string[];
  private axisNamesLine:string[];
  private axisNamesArea:string[];
  private axisNamesBullet:string[];
  private bulletHeight = 180;
  private card1:string[];
  private card2:string[];
  private card3:string[];
  private card4:string[];
  private colors:any[];

  private startTimeG1;
  private endTimeG1;
  private startTimeG2;
  private endTimeG2;

  constructor(private _dados: DadosService, private _tooltip: TooltipService) { 
    this.cardsAjust();
    this.obDados();
  }

  ngOnChanges() {
    if(!this.group1Data || !this.group2Data)
      return;

    this.obDados();
  }

  private async obDados(){
    await this.obtemDados();
    this._dados.closeConnection();

    this.setStartEndDate(this.group1Data, 1);
    this.setStartEndDate(this.group2Data, 2);
    console.log(this.group2Data);
    this.areaAjust();
    this.lineAjust();
    this.cardInsertData();
    this.fillAxis();
    this.radarAjust();
    this.bulletAjust();
  }

  private async obtemDados(){
    this.group1Data = await this._dados.getDataSinglePageDash(this.queryGroup1);
    this.group2Data = await this._dados.getDataSinglePageDash(this.queryGroup2);
    console.log(this.group2Data);
  }

  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "", 3);
    this.cardAjust("", "", "","", "", 4);
  }

  private cardInsertData(){
    this.cardAjust("Distribuição dos Usuários", this.group1Data.length+ "", " Usuários COM22O", this.group2Data.length + "", " Usuários COM242", 1);
    this.cardAjust("Eventos", (this._tooltip.getAverageEventsPerClient(this.group1Data)).toFixed(2), " de Média para COM220", (this._tooltip.getAverageEventsPerClient(this.group2Data)).toFixed(2), " de Média para COM242",2);
    this.cardAjust("Tempo Total", (this._tooltip.getAverageTime(this.group1Data)).toFixed(2)+" minutos de", " Média para COM220", (this._tooltip.getAverageTime(this.group2Data)).toFixed(2) +" minutos de", " Média para COM242 ", 3);
    this.cardAjust("Coerência para os Grupos", (this._tooltip.getAverageCoherence(this.group1Data)*100).toFixed(2)+"%", " de Média para COM220", (this._tooltip.getAverageCoherence(this.group2Data)*100).toFixed(2)+"%", " de Média para COM242", 4);
    
  }

  private cardAjust(cardName:string, cardValue:string, info:string, extraInfo:string, extraValue:string, cardOpt){
    var lista:string[] = [];
    
    lista.push(cardName);
    lista.push(cardValue);
    lista.push(info);
    lista.push(extraInfo);
    lista.push(extraValue);

    if(cardOpt == 1)
      this.card1 = lista;
    else if(cardOpt == 2)
      this.card2 = lista;
    else if(cardOpt == 3)
      this.card3 = lista;
    else
      this.card4 = lista;
  }

  private fillAxis(){
    this.axisNamesArea = [];
    this.axisNamesLine = [];
    this.axisNamesBullet = [];

    this.axisNamesArea.push("Tempo");
    this.axisNamesArea.push("Média de eventos por usuários");

    this.axisNamesBullet.push("Tempo (minutos)");
    this.axisNamesBullet.push("Tipo");

    this.axisNamesLine.push("Tempo");
    this.axisNamesLine.push("Eventos");
    
    this.colors = [];
    this.colors.push("#F1C40F");
    this.colors.push("#2980B9");
    this.colors.push("#2ECC71");
  }

  private radarAjust(){
    this.radarChart = [];

    this.radarChart.push(this.singleRadar(this.group1Data, "COM220", this.colors[0]));
    this.radarChart.push(this.singleRadar(this.group2Data, "COM242", this.colors[1]));
  }

  private singleRadar(clientsDate:any[], pag :string, color: string){
    var obj = new Object();
    var arr:any[] = [];
    
    var axis1 = new Object();
    var axis2 = new Object();
    var axis3 = new Object();
    var axis4 = new Object();
    
    obj["name"] = pag;
    axis1["axis"] = "Média de Coerência";
    axis1["value"] = (this._tooltip.getAverageCoherence(clientsDate)*10).toFixed(2);
    arr.push(axis1);
    
    axis3["axis"] = "Média de Eventos pelo tempo";
    axis3["value"] = this.getEventsPerTime(clientsDate).toFixed(2);
    arr.push(axis3);

    axis2["axis"] = "Tempo Médio";
    axis2["value"] = (this._tooltip.getAverageTime(clientsDate)).toFixed(2);
    arr.push(axis2);
    
    axis4["axis"] = "Média de Páginas Acessadas";
    axis4["value"] = this.areasAccess(clientsDate);
    arr.push(axis4);
    
    obj["axes"] = arr;
    obj["color"] = color;
    
    return obj;
  }

  private areasAccess(clientsData:any[]){
    var areas = 0;
    clientsData.forEach(element => {
      areas += element["EventArea"].length;
    });
    
    return areas/clientsData.length;
  }

  private getEventsPerTime(clientsData:any[]){
    var events = 0;
    var timeMed = 0;
    var data1, data2;

    clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      timeMed += data2.getTime() - data1.getTime(); 
      events += element["InfoEvents"]["Events"].length;
    }); 

    timeMed /= 1000;
    timeMed /= 60;

    return events/timeMed;
  }

  private lineAjust(){
    var n, lineGroup1:any[], lineGroup2:any[], arr:any[];
    this.lineChart = [];

    this.nomesLinhas.push("Grupo COM220");
    this.nomesLinhas.push("Grupo COM242");
    this.nomesLinhas.push("Média");
    
    lineGroup1 = this.singleLine(this.group1Data, this.startTimeG1, this.endTimeG1);
    lineGroup2 = this.singleLine(this.group2Data, this.startTimeG2, this.endTimeG2);
    n = lineGroup1.length;
    if(n > lineGroup2.length)
      n = lineGroup2.length;

    for(var i = 0; i < n; i++){
      arr = [];
      arr.push(i);
      arr.push(lineGroup1[i][1]);
      arr.push(lineGroup2[i][1]);
      arr.push((lineGroup1[i][1] + lineGroup2[i][1])/2);
      this.lineChart.push(arr);
    }
  }

  private singleLine(clientsData:any[], startTime:Date, endTime:Date){
    var arr:any[], lines:any[] = [], dateAux:Date, i;
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      arr = [];//pre aloca o vetor que conterá os dados
      arr.push(dateAux.getHours()+":"+dateAux.getMinutes());
      arr.push(0);
      lines.push(arr);
    }
    clientsData.forEach(element => {// para cada cliente irá percorrer seus eventos e lançar a qual posição eles pertencem
      element["InfoEvents"]["Events"].forEach(event => {
        lines.forEach(data => {
          if(event[0].includes(data[0]))
            data[1] += 1;
          
        });
      });      
    });

    return lines;
  }

  private areaAjust(){
    var areaG1:any[], areaG2:any[];
    var arr:any[], n; 
    this.areaChart = [];

    areaG1 = this.singleArea(this.group1Data, this.startTimeG1, this.endTimeG1);
    areaG2 = this.singleArea(this.group2Data, this.startTimeG2, this.endTimeG2);

    n = areaG1.length;
    if(n > areaG2.length)
      n = areaG2.length;

    for(var i = 0; i < n; i++){
      arr = [];
      arr.push(i);
      arr.push(areaG1[i][1]);
      arr.push(areaG2[i][1]);
      this.areaChart.push(arr);
    }
    
    this.areasNames = [];
    this.areasNames.push("Grupo COM220");
    this.areasNames.push("Grupo COM242");

  }

  private singleArea(clientsData:any[], startTime:Date, endTime:Date){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [], i;
    
    stateArray = [];
    areas = [];
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];//pre aloca o vetor que conterá os dados
      arr.push(dateAux.getHours()+":"+dateAux.getMinutes());
      arr.push(0);
      arr.push(0);
      areas.push(arr);
    }
    
    clientsData.forEach(element => {
      element["InfoEvents"]["Events"].forEach(event => {
        i = 0;
        areas.forEach(data => {
          if(event[0].includes(data[0])){
            data[1] += 1;
            
            if(stateArray[i] == 0){
              stateArray[i] = 2;
              data[stateArray[i]] += 1;
            }
          }
          i++;
        });
      });

      for(i = 0; i < areas.length; i++)
        if(stateArray[i] != 0 )
          stateArray[i] = 0;
        
    });

    areas.forEach(element => {
      if(element[1] != 0 && element[2] != 0)
        element[1] /= element[2];
    });

    return areas; 
  }

  private bulletAjust(){
    this.bulletChart = [];
    var contG1 = 0, contG2 = 0;
    var timeG1 = 0, timeG2 = 0, med = 0;
    var obj = [], data1, data2;

    this.group1Data.forEach(element => {
      element["EventArea"].forEach(data => {
        data1 = new Date(data["inicio"]);
        data2 = new Date(data["fim"]);
        timeG1 += data2.getTime() - data1.getTime(); 
        contG1 ++;
      });
    });
    
    this.group2Data.forEach(element => {
      element["EventArea"].forEach(data => {
        data1 = new Date(data["inicio"]);
        data2 = new Date(data["fim"]);
        timeG2 += data2.getTime() - data1.getTime(); 
        contG2 ++;
      });
    });

    timeG1 /= 1000;//Ajustes visto que o tempo obtido esta em milisegundos
    timeG1 /= 60;
    timeG2 /= 1000;
    timeG2 /= 60;

    med = timeG1 + timeG2;
    med /= contG1 + contG2;

    obj.push("Grupo COM220");
    obj.push(timeG1/contG1);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Grupo COM242");
    obj.push(timeG2/contG2);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Média");
    obj.push(med);
    this.bulletChart.push(obj);

  }

  private setStartEndDate(clientsData:any[], group){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(clientsData[0]["InfoEvents"]["firstEvent"])
    firstEvent = data1.getTime();
    //Obter Menor e maior evento
    clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      
      if(data2.getTime() > lastEvent)
        lastEvent = data2.getTime();
      
      if(data1.getTime() < firstEvent)
        firstEvent = data1.getTime();
    });

    data1 = new Date(firstEvent);
    data2 = new Date(lastEvent);

    if(group == 1){
      this.startTimeG1 = this._tooltip.dataAjust(data1);
      this.endTimeG1 = this._tooltip.dataAjust(data2);
    }else{
      this.startTimeG2 = this._tooltip.dataAjust(data1);
      this.endTimeG2 = this._tooltip.dataAjust(data2);
    }
  }

}
