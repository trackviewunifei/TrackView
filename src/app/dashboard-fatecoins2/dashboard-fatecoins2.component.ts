import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dashboard-fatecoins2',
  templateUrl: './dashboard-fatecoins2.component.html',
  styleUrls: ['./dashboard-fatecoins2.component.css']
})
export class DashboardFatecoins2Component implements OnChanges {

  @Input()
  private group1Data:any[] = [];
  private group2Data:any[] = [];

  //private queryGroup2:string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-10-14' and e.date_str >= '2019-10-13T00:25' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
  //private queryGroup1:string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-10-02T18' and e.date_str >= '2019-10-02T16' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
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
  private bulletHeight = 170;
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
    
    this.areaAjust();
    this.lineAjust();
    this.cardInsertData();
    this.fillAxis();
    this.radarAjust();
    this.bulletAjust();
  }

  private async obtemDados(){
    this.group1Data = await this._dados.getEventsFatec("match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where p.id =~ '.*fate.*'and  e.date_str <= '2019-11-30' and e.date_str >= '2019-10-22'  return cliente, collect([data, l.id, l.tag_classes]) as dados");
    this.separateGroups();
    //this.group2Data = await this._dados.obtemDados(this.queryGroup2);
  }

  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "", 3);
    this.cardAjust("", "", "","", "", 4);
  }

  private cardInsertData(){
    this.cardAjust("Usuários", this.group1Data.length+ "", " Usuários que não voltaram", this.group2Data.length + "", " Usuários que voltaram", 1);
    this.cardAjust("Eventos", (this._tooltip.getAverageEventsPerClientFatec(this.group1Data)).toFixed(2), " Média de Eventos G1", (this._tooltip.getAverageEventsPerClientFatec(this.group2Data)).toFixed(2), " Média de Eventos G2",2);
    this.cardAjust("Tempo", (this._tooltip.getAverageTimeFatec(this.group1Data)).toFixed(2)+" minutos", " Média de Tempo G1", (this._tooltip.getAverageTimeFatec(this.group2Data)).toFixed(2) +" minutos", " Média de Tempo G2 ", 3);
    this.cardAjust("Conversão", (this._tooltip.getAverageConversion(this.group1Data)*100).toFixed(2)+"%", " Conversão G1", (this._tooltip.getAverageConversion(this.group2Data)*100).toFixed(2)+"%", " Conversão G2", 4);
    
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

    this.axisNamesBullet.push("Tempo (dias)");
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

    this.radarChart.push(this.singleRadar(this.group1Data, "Não retornou", this.colors[0]));
    this.radarChart.push(this.singleRadar(this.group2Data, "Retornou", this.colors[1]));
  }

  private singleRadar(clientsDate:any[], pag :string, color: string){
    var obj = new Object();
    var arr:any[] = [];
    
    var axis1 = new Object();
    var axis2 = new Object();
    var axis3 = new Object();
    var axis4 = new Object();
    
    obj["name"] = pag;
    axis1["axis"] = "Média de Conversão";
    axis1["value"] = (this._tooltip.getAverageConversion(clientsDate)*10).toFixed(2);
    arr.push(axis1);
    
    axis3["axis"] = "Média de Eventos pelo tempo";
    axis3["value"] = (this.getEventsPerTime(clientsDate)/4).toFixed(2);
    arr.push(axis3);

    axis2["axis"] = "Tempo Médio";
    axis2["value"] = (this._tooltip.getAverageTimeFatec(clientsDate)).toFixed(2);
    arr.push(axis2);
    
    axis4["axis"] = "Média de Páginas Acessadas";
    axis4["value"] = this.areasAccess(clientsDate);
    arr.push(axis4);
    
    obj["axes"] = arr;
    obj["color"] = color;
    console.log(arr);
    return obj;
  }

  private areasAccess(clientsData:any[]){
    var areas = 0;
    clientsData.forEach(element => {
      areas += element["Pages"].length;
    });
    
    return areas/clientsData.length;
  }

  private getEventsPerTime(clientsData:any[]){
    var events = 0;
    var timeMed = 0;

    clientsData.forEach(element => {
      timeMed += element["TotalTime"]; 
      events += element["TotalEvents"];
    }); 

    return events/timeMed;
  }

  private lineAjust(){
    var n, lineGroup1:any[], lineGroup2:any[], arr:any[];
    this.lineChart = [];

    this.nomesLinhas.push("Grupo 1 (Não retornou no site)");
    this.nomesLinhas.push("Grupo 2 (Retornou no site)");
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
    var arr:any[], lines:any[] = [], dateAux:Date, i, month, date;
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 86400000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      arr = [];//pre aloca o vetor que conterá os dados
      month = dateAux.getMonth()+1;
      arr.push(dateAux.getDate()+"/"+month);
      arr.push(0);
      lines.push(arr);
    }
    clientsData.forEach(element => {// para cada cliente irá percorrer seus eventos e lançar a qual posição eles pertencem
      element["Events"].forEach(event => {
        lines.forEach(data => {
          date = data[0].split("/");
          if(event["Date"].includes(date[1]+"-"+date[0]))
            data[1] += event["EventsData"].length;
          
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
    this.areasNames.push("Grupo 1 (Não retornou no site)");
    this.areasNames.push("Grupo 2 (Retornou no site)");

  }

  private singleArea(clientsData:any[], startTime:Date, endTime:Date){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [], i, month, date;
    
    stateArray = [];
    areas = [];
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 86400000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];//pre aloca o vetor que conterá os dados
      month = dateAux.getMonth()+1;
      arr.push(dateAux.getDate()+"/"+month);
      arr.push(0);
      arr.push(0);
      areas.push(arr);
    }
    
    clientsData.forEach(element => {
      element["Events"].forEach(event => {
        i = 0;
        areas.forEach(data => {
          date = data[0].split("/");
          if(event["Date"].includes(date[1] + "-" + date[0])){
            data[1] += event["EventsData"].length;
            
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
    var timeG1 = 0, timeG2 = 0, med = 0;
    var obj = [];

    this.group1Data.forEach(element => {
        timeG1 += element["TotalTime"];
    });
    
    this.group2Data.forEach(element => {
        timeG2 += element["TotalTime"];
    });

    med = timeG1;
    med += timeG2;
    med /= this.group1Data.length + this.group2Data.length;

    obj.push("Não Retornou");
    obj.push(timeG1/this.group1Data.length);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Retornou");
    obj.push(timeG2/this.group2Data.length);
    this.bulletChart.push(obj);

    obj = [];
    obj.push("Média");
    obj.push(med);
    this.bulletChart.push(obj);

  }

  private setStartEndDate(clientsData:any[], group){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(clientsData[0]["Events"][0]["EventsData"][0][0])
    firstEvent = data1.getTime();
    //Obter Menor e maior evento
    clientsData.forEach(element => {
      data1 = new Date(element["Events"][0]["EventsData"][0][0]);
      data2 = new Date(element["Events"][element["Events"].length-1]["EventsData"][element["Events"][element["Events"].length-1]["EventsData"].length-1][0]);
            
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

  private separateGroups(){//grupos foram divididos entre os que voltaram no site e os que não voltaram
    var groupLen = this.group1Data.length;
    this.group2Data = [];

    for(var i = 0; i < groupLen; i++)
      if(this.group1Data[i]["Events"].length>1){
        this.group2Data.push(this.group1Data[i]);
        this.group1Data.splice(i, 1);
        i -= 1;
        groupLen -= 1;
      }
  }

}

