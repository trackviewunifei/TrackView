import { Component, OnChanges } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dash-details',
  templateUrl: './dash-details.component.html',
  styleUrls: ['./dash-details.component.css']
})
export class DashDetailsComponent implements OnChanges {

  private clientsData:any[] = [];
  private choosenArea:string = "";
  private areasTitle:string[] = [];

  private areasData:any[] = [];

  //Chart Variables
  private pieChart:any[];
  private bulletChart:any[];
  private areaChart:any[];
  private lineChart:any[];

  //Extra Variables
  private lineNames:string[] = [];
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
  public configs:any[];

  constructor(private _dados: DadosService, private _tooltip: TooltipService) { 
    this.choosenArea = "Cart";
    this.cardsAjust();
    this.getDash();
  }

  //On changes it will get the most recent data
  ngOnChanges() {
    if(!this.clientsData)
      return;

    this.getDash();
  }

  //Method responsable for call the responsable methods to form the dash
  private async getDash(){
    this.configs = this._dados.getDashConfig(7);
    //@ts-ignore
    this.clientsData = await this._dados.getEventsFatec(this.configs.Query);//Get the data from the query configured to this dash
    this._dados.closeConnection();
    this.areasData = this._tooltip.convertClientsDataToPages(this.clientsData);

    this.setStartEndDate();
    this.areasTitle = this._tooltip.getAreas(this.areasData);
    //Call a method to create every chart
    this.fillAxis();
    this.areaAjust();
    this.pieAjust();
    this.bulletAjust();
    this.lineAjust();
    this.cardInsertData();
  }

  //Initiate the cards empty
  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "",3);
    this.cardAjust("", "", "","", "",4);
  }

  //Method that inserts data into the cards
  private cardInsertData(){
    var totalAreas = this.areasData.length;
    var areaAccess = 0;
    var totalClients = 0;
    var areaInterest = 0;
    var areaEvents = 0;
    var medInterest = 0;
    var medAccess = 0;
    var medEvents = 0;

    this.areasData.forEach(element => {
      medAccess += element['Clients'].length;
      medEvents += element['Events'].length;
      element['Clients'].forEach(data => {
        medInterest += data['Choose']
      });

      if(element['Name'] == this.choosenArea){
        areaAccess = element['Clients'].length;
        areaEvents = element['Events'].length;
        element['Clients'].forEach(data => {
          areaInterest += data['Choose'];
        });
        
      }
    });
    
    this.clientsData.forEach(element => {
      if(element["Pages"].includes("Checkout")){
        totalClients ++;
      }
    });

    //@ts-ignore
    this.cardAjust(this.configs.Cards[0].Title, areaInterest+"", this.configs.Cards[0].Text_1, (areaInterest/totalClients*100).toFixed(2), this.configs.Cards[0].Text_2, 1);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[1].Title, (areaEvents/areaAccess).toFixed(2), this.configs.Cards[1].Text_1,(medEvents/medAccess).toFixed(2), this.configs.Cards[1].Text_2,3);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[2].Title, ((areaAccess*100)/this.clientsData.length).toFixed(2), this.configs.Cards[2].Text_1, ((medAccess*100/totalAreas)/this.clientsData.length).toFixed(2), this.configs.Cards[2].Text_2, 2);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[3].Title, ((areaInterest*100)/areaAccess).toFixed(2), this.configs.Cards[3].Text_1, ((medInterest*100)/medAccess).toFixed(2), this.configs.Cards[3].Text_2, 4);
  }

  //As cards are an separate component, it's necessary to passa the data for them, so this methods split to each card
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

  //Method that fill the axis of charts
  private fillAxis(){
    this.axisNamesArea = [];
    this.axisNamesBullet = [];
    this.axisNamesLine = [];
    this.lineNames = [];
    //@ts-ignore
    this.configs.Charts[0].Legends.forEach(element => {
      this.axisNamesArea.push(element.Value);
    });
    
    //@ts-ignore
    this.configs.Charts[1].Legends.forEach(element => {
      this.axisNamesLine.push(element.Value);
    });

    //@ts-ignore
    this.configs.Charts[2].Legends.forEach(element => {
      this.axisNamesBullet.push(element.Value);
    });

    this.colors = [];
    this._dados.getColorsConfig().forEach(element => {
      this.colors.push(element.Value);
    });
  }

  //Method that ajust the data for the bullet chart
  private bulletAjust(){
    var arr;
    var cont = 0;
    var clients = 0;
    this.bulletChart = [];

    this.areasData.forEach(element => {
      cont += element["Time"];
      clients += element["Clients"].length;
      if(element["Name"] == this.choosenArea){  
        arr = [];
        arr.push(element["Name"]);
        arr.push(element["Time"]/element["Clients"].length);
        this.bulletChart.push(arr);
      }
    });

    arr = [];
    //@ts-ignore
    arr.push(this.configs.Charts[2].Text[0].Value);   
    arr.push(cont/clients);
    this.bulletChart.push(arr);
  }

  //Method that ajust the data for the pie chart
  private pieAjust(){
    var arr:any[], cont = 0;
    this.pieChart = [];
    this.areasData.forEach(element => {
      
      if(element["Name"] == this.choosenArea){
        arr = [];
        arr.push(this.choosenArea);
        arr.push(element["Events"].length);
        this.pieChart.push(arr);
      }else{
        cont += element["Events"].length;
      }
    });

    arr = [];
    //@ts-ignore
    arr.push(this.configs.Charts[3].Text[0].Value);  
    arr.push(cont);
    this.pieChart.push(arr);
  }

  //Method that ajust the data for the area chart
  private areaAjust(){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [];
    var date, month;
    this.areaChart = [], i;
    
    stateArray = [];
    areas = [];
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 86400000){
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];
      month = dateAux.getMonth()+1;
      arr.push(dateAux.getDate()+"/"+month);
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
          date = data[0].split("/");
          if(event.includes(date[1] + "-" + date[0])){
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
    //@ts-ignore
    this.areasNames.push(this.configs.Charts[0].Text[0].Value);

    this.areaChart = areas;
  }

  //Method that ajust the data for the line chart
  private lineAjust(){
    var obj;
    var dateAux;
    var date, month;
    this.lineChart = [];

    this.lineNames.push(this.choosenArea);
    //@ts-ignore
    this.configs.Charts[1].Text.forEach(element => {
      this.lineNames.push(element.Value);
    });
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 86400000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      obj = [];//pre aloca o vetor que conterá os dados
      month = dateAux.getMonth()+1;
      obj.push(dateAux.getDate()+"/"+month);
      obj.push(0);
      obj.push(0);
      obj.push(0);
      this.lineChart.push(obj);
    }

    this.areasData.forEach(element => {// para cada cliente irá percorrer seus eventos e lançar a qual posição eles pertencem
      element["Events"].forEach(event => {
        this.lineChart.forEach(data => {
          date = data[0].split("/");
          if(event.includes(date[1] + "-" + date[0])){
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

  //Method that get the start and end of the data
  private setStartEndDate(){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(this.areasData[0]["Events"][0])
    firstEvent = data1.getTime();
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

  //Because Footstep ajust the time in a specific way, it's necessary an ajustment
  private dataAjust(date:Date){
    var str1:string[];
    var dateAna;

    str1 = (date+"").split(":");
    dateAna = str1[0]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }

  //On change of the selection on the title, it will change the charts
  onChange(event){
    this.choosenArea = event.target.value;    
    this.getDash();
  }

}
