import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dashboard-fatecoins4',
  templateUrl: './dashboard-fatecoins4.component.html',
  styleUrls: ['./dashboard-fatecoins4.component.css']
})
export class DashboardFatecoins4Component implements OnChanges {

  @Input()
  private clientsData:any[] = [];

  @Input()
  private choosenArea:string = "";
  private areasTitle:string[] = [];

  private areasData:any[] = [];

  //Variáveis que resultarão nos gráficos
  //Variáveis que resultarão nos gráficos
  private pieChart:any[];
  private bulletChart:any[];
  private areaChart:any[];
  private lineChart:any[];

  //Variáveis auxiliares
  private nomesLinhas:string[] = [];
  private areasNames:string[];
  private axisNamesBullet: string[];
  private axisNamesLine: string[];
  private axisNamesArea: string[];
  private bulletHeight = 250;
  private card1:string[];
  private card2:string[];
  private card3:string[];
  private card4:string[];
  private colors:any[];
  private startTime;
  private endTime;

  constructor(private _dados: DadosService, private _tooltip: TooltipService) { 
    this.choosenArea = "Gaming";
    this.cardsAjust();
    this.obDados();
  }

  ngOnChanges() {
    if(!this.clientsData)
      return;
    this.obDados();
  }

  private async obDados(){
    await this.obtemDados();
    this._dados.closeConnection();
    this.areasData = this._tooltip.convertClientsDataToArea(this.clientsData);

    this.setStartEndDate();
    this.areasTitle = this._tooltip.getAreas(this.areasData);
    this.areaAjust();
    this.pieAjust();
    this.bulletAjust();
    this.lineAjust();
    this.cardInsertData();
    this.fillAxis();
  }

  private async obtemDados(){
    this.clientsData = await this._dados.obtemDados("match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-10-02T18' and e.date_str >= '2019-10-02T16' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados");    
  }

  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "",3);
    this.cardAjust("", "", "","", "",4);
  }

  private cardInsertData(){
    var totalAreas;
    totalAreas = this.areasData.length;
    var areaAccess = 0;
    var areaCoherence = 0;
    var areaInterest = 0;

    var medCoherence = 0;
    var medInterest = 0;
    var medAccess = 0;
    
    this.areasData.forEach(element => {
      medCoherence += element["Coherence"];
      medAccess += element['Clients'].length;
      element['Clients'].forEach(data => {
        medInterest += data['Choose']
      });

      if(element['Name'] == this.choosenArea){
        areaCoherence = element['Coherence'];
        areaAccess = element['Clients'].length;
        element['Clients'].forEach(data => {
          areaInterest += data['Choose'];
        });
      }

    });
  
    this.cardAjust("Usuários", areaInterest+"", " Escolheram", (medInterest/totalAreas).toFixed(2), " Média", 1);
    this.cardAjust("Coerência", (areaCoherence*100).toFixed(2)+"%"," Coerência",((medCoherence/totalAreas)*100).toFixed(2)+"%", "Coerência Média",3);
    this.cardAjust("Representatividade", ((areaInterest*100)/medInterest).toFixed(2)+"% do total", " Interesse", ((areaAccess*100)/medAccess).toFixed(2)+"% do total", " Acesso", 2);
    this.cardAjust("Interesse", ((areaInterest*100)/areaAccess).toFixed(2)+"%", " Conversão", ((medInterest*100)/medAccess).toFixed(2) + "%", " Média", 4);
    
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
    this.axisNamesBullet = [];
    this.axisNamesLine = [];

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
    this.colors.push("#E74C3C");
    this.colors.push("#ECF0F1");
    this.colors.push("#7D3C98");
  }

  private bulletAjust(){
    var arr;
    var cont = 0;
    this.bulletChart = [];

    this.areasData.forEach(element => {
      cont += element["Time"]/element["Clients"].length;
      if(element["Name"] == this.choosenArea){  
        arr = [];
        arr.push(element["Name"]);
        arr.push(element["Time"]/element["Clients"].length);
        this.bulletChart.push(arr);
      }
    });

    arr = [];
    arr.push("Média das demais áreas");    
    arr.push(cont/this.areasData.length);
    this.bulletChart.push(arr);
  }

  private pieAjust(){

    var arr:any[], cont = 0;
    this.pieChart = [];
    this.areasData.forEach(element => {
      cont += element["Events"].length;
      if(element["Name"] == this.choosenArea){
        arr = [];
        arr.push(this.choosenArea);
        arr.push(element["Events"].length);
        this.pieChart.push(arr);
      }
    });

    arr = [];
    arr.push("Demais áreas");
    arr.push(cont);
    this.pieChart.push(arr);
  }

  private areaAjust(){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [];
    this.areaChart = [], i;
    
    stateArray = [];
    areas = [];
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];//pre aloca o vetor que conterá os dados
      arr.push(dateAux.getHours()+":"+dateAux.getMinutes());
      arr.push(0);
      arr.push(0);
      arr.push(0);
      arr.push(0);
      areas.push(arr);
    }
    
    this.areasData.forEach(element => {
      element["Events"].forEach(event => {
        i = 0;
        areas.forEach(data => {
          if(event.includes(data[0])){
            if(element["Name"] == this.choosenArea)
              data[1] += 1;
            
            data[2] += 1;

            if(stateArray[i] == 0){
              if(element["Name"] == this.choosenArea){
                stateArray[i] = 3;
                data[stateArray[i]] += 1;
              }
              
              stateArray[i] = 4;
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
      if(element[1] != 0 && element[3] != 0)
        element[1] /= element[3];

      if(element[2] != 0 && element[4] != 0)
        element[2] /= element[4];
    });

    this.areasNames = [];
    this.areasNames.push(this.choosenArea);
    this.areasNames.push("Demais Áreas");

    this.areaChart = areas;
  }

  private lineAjust(){
    var obj;
    var dateAux;
    this.lineChart = [];

    this.nomesLinhas.push(this.choosenArea);
    this.nomesLinhas.push("Demais");
    this.nomesLinhas.push("Média");
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      obj = [];//pre aloca o vetor que conterá os dados
      obj.push(dateAux.getHours()+":"+dateAux.getMinutes());
      obj.push(0);
      obj.push(0);
      obj.push(0);
      this.lineChart.push(obj);
    }

    this.areasData.forEach(element => {// para cada cliente irá percorrer seus eventos e lançar a qual posição eles pertencem
      element["Events"].forEach(event => {
        this.lineChart.forEach(data => {
          if(event.includes(data[0])){
            if(element["Name"] == this.choosenArea)
              data[1] += 1;
           
            data[2] += 1;
            data[3] += 1;
          }
        });
      });      
    });

    this.lineChart.forEach(data => {
      data[3] /= this.areasData.length;      
    });
  }

  private setStartEndDate(){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(this.areasData[0]["Events"][0])
    firstEvent = data1.getTime();
    //Obter Menor e maior evento
    this.areasData.forEach(element => {
      if(element["Name"] == this.choosenArea){  
        element['Events'].forEach(event => {
          data1 = new Date(event);
          data2 = new Date(event);
          
          if(data2.getTime() > lastEvent)
            lastEvent = data2.getTime();
          
          if(data1.getTime() < firstEvent)
            firstEvent = data1.getTime();
        });
      }
    });

    data1 = new Date(firstEvent);
    data2 = new Date(lastEvent);

    this.startTime = this.dataAjust(data1);
    this.endTime = this.dataAjust(data2);
  }

  private dataAjust(date:Date){
    var str1:string[];
    var dateAna;

    str1 = (date+"").split(":");//isso para separar hora - minuto - segundo
    dateAna = str1["0"]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }

  onChange(event){
    this.choosenArea = event.target.value;    
    this.obDados();
  }

}
