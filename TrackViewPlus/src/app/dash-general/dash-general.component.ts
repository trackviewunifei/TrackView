import { Component, OnChanges } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dash-general',
  templateUrl: './dash-general.component.html',
  styleUrls: ['./dash-general.component.css']
})
export class DashGeneralComponent implements OnChanges {

  private clientsData:any[] = [];

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
    this.configs = this._dados.getDashConfig(4);
    //@ts-ignore
    this.clientsData = await this._dados.getEventsFromNeo4j(this.configs.Query);//Get the data from the query configured to this dash
    this._dados.closeConnection();

    this.setStartEndDate();//Set the time limits of the charts

    //Call a method to create every chart
    this.areaAjust();
    this.pieAjust();
    this.bulletAjust();
    this.lineAjust();
    this.cardInsertData();
    this.fillAxis();
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
    var clientsLength = this.clientsData.length;
    var countClientsConversion = 0;
    var medEvents = 0;
    var numPages = 0;
    var medTime = 0; 

    this.clientsData.forEach(element => {
      if(element["Pages"].includes("Checkout")){
        countClientsConversion ++;
        numPages += element["Pages"].length;
      }
      medTime += element["TotalTime"]; 
      medEvents += element["TotalEvents"];
    });
    
    medEvents /= clientsLength;
    medTime /= clientsLength;
    //@ts-ignore
    this.cardAjust(this.configs.Cards[0].Title, countClientsConversion + "", this.configs.Cards[0].Text_1, (clientsLength-countClientsConversion) + "", this.configs.Cards[0].Text_2, 1);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[1].Title, (medEvents).toFixed(2), this.configs.Cards[1].Text_1, this.calcDeviationEvents(medEvents, clientsLength).toFixed(2), this.configs.Cards[1].Text_2,2);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[2].Title, (medTime).toFixed(2),this.configs.Cards[2].Text_1, this.calcDeviationTime(medTime, clientsLength).toFixed(2), this.configs.Cards[2].Text_2, 3);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[3].Title, (countClientsConversion/clientsLength*100).toFixed(2), this.configs.Cards[3].Text_1,  (numPages/countClientsConversion).toFixed(2), this.configs.Cards[3].Text_2, 4);
    
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
    this.bulletChart = [];
    var contPlus = 0, contMinus = 0;
    var timePlus = 0, timeMinus = 0, med = 0;
    var obj = [];

    this.clientsData.forEach(element => {
      if(element["Pages"].includes("Checkout")){
        timePlus += element["TotalTime"]; 
        contPlus ++;
      }else{
        timeMinus += element["TotalTime"]; 
        contMinus ++;
      }
    }); 

    med = timePlus;
    med += timeMinus;
    med /= contPlus+contMinus;

    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[0].Value);
    obj.push(timePlus/contPlus);
    this.bulletChart.push(obj);

    obj = [];
    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[1].Value);
    obj.push(timeMinus/contMinus);
    this.bulletChart.push(obj);

    obj = [];
    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[2].Value);
    obj.push(med);
    this.bulletChart.push(obj);

  }

  //Method that ajust the data for the pie chart
  private pieAjust(){
    this.pieChart = [];
    var contPlus = 0, contMinus = 0;
    var obj = [];

    this.clientsData.forEach(element => {
      if(element["Pages"].includes("Checkout"))
        contPlus ++;
      else
        contMinus ++;
    }); 
    
    //@ts-ignore
    obj.push(this.configs.Charts[3].Text[0].Value);
    obj.push(contPlus);

    this.pieChart.push(obj);
    obj = [];

    //@ts-ignore
    obj.push(this.configs.Charts[3].Text[1].Value);
    obj.push(contMinus);

    this.pieChart.push(obj);
  }

  //Method that ajust the data for the area chart
  private areaAjust(){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [];
    var date, month;
    this.areaChart = [], i;
    
    stateArray = [];
    areas = [];
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 86400000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];//pre aloca o vetor que conterá os dados
      month = dateAux.getMonth()+1;
      arr.push(dateAux.getDate()+"/"+month);
      arr.push(0);
      arr.push(0);
      arr.push(0);
      arr.push(0);
      areas.push(arr);
    }
    
    this.clientsData.forEach(element => {
      element["Events"].forEach(event => {
        i = 0;
        areas.forEach(data => {
          date = data[0].split("/");
          if(event["Date"].includes(date[1] + "-" + date[0])){
            if(element["Pages"].includes("Checkout"))
              data[1] += event["EventsData"].length;
            else
              data[2] += event["EventsData"].length;

            if(stateArray[i] == 0){
              if(element["Pages"].includes("Checkout")){
                stateArray[i] = 3;
                data[stateArray[i]] += 1;
              }else{
                stateArray[i] = 4;
                data[stateArray[i]] += 1;
              }
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
    //@ts-ignore
    this.configs.Charts[0].Text.forEach(element => {
      this.areasNames.push(element.Value);
    });

    this.areaChart = areas;
  }

  //Method that ajust the data for the line chart
  private lineAjust(){
    var obj, date;
    var dateAux, month;
    this.lineChart = [];

    //@ts-ignore
    this.configs.Charts[1].Text.forEach(element => {
      this.lineNames.push(element.Value);
    });

    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 86400000){
      dateAux = new Date(i);
      obj = [];
      month = dateAux.getMonth()+1;
      obj.push(dateAux.getDate()+"/"+month);
      obj.push(0);
      obj.push(0);
      obj.push(0);
      this.lineChart.push(obj);
    }

    this.clientsData.forEach(element => {
      element["Events"].forEach(event => { 
        this.lineChart.forEach(data => {
          date = data[0].split("/");
          if(event["Date"].includes(date[1]+"-"+date[0])){
            if(element["Pages"].includes("Checkout"))
              data[1] += event["EventsData"].length;
            else
              data[2] += event["EventsData"].length;

            data[3] += event["EventsData"].length;
          }
        });
      });      
    });

    this.lineChart.forEach(data => {
      data[3] /= 2;      
    });
  }

  //Method that get the start and end of the data
  private setStartEndDate(){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(this.clientsData[0]["Events"][0]["EventsData"][0][0])
    firstEvent = data1.getTime();
    this.clientsData.forEach(element => {
      data1 = new Date(element["Events"][0]["EventsData"][0][0]);
      data2 = new Date(element["Events"][element["Events"].length-1]["EventsData"][element["Events"][element["Events"].length-1]["EventsData"].length-1][0]);
      if(data2.getTime() > lastEvent)
        lastEvent = data2.getTime();
      
      if(data1.getTime() < firstEvent)
        firstEvent = data1.getTime();
    });

    data1 = new Date(firstEvent);
    data2 = new Date(lastEvent);

    this.startTime = this.dataAjust(data1);
    this.endTime = this.dataAjust(data2);
  }

  //Method that calculate the deviation on time
  private calcDeviationTime(medium, total){
    var deviation = 0;
    this.clientsData.forEach(element => {
      deviation += Math.pow(element["TotalTime"] - (medium ), 2);
    }); 

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);

    return deviation; 
  }

  //Method that calculate the deviation on events
  private calcDeviationEvents( medium, total){
    var deviation = 0, test:boolean, lengthEvents;
    var events:any[];
    var arr:any[];

    events = [];

    this.clientsData.forEach(element => {
      test = false;
      lengthEvents = element["TotalEvents"];
      events.forEach(data => {
        if(data[0] == lengthEvents){
          data[1] ++;
          test = true;
        }
      });

      if(!test){
        arr = [];
        arr.push(lengthEvents);
        arr.push(1);
        events.push(arr);
      }
    });
    
    events.forEach(element => {
      deviation += Math.pow(element[0] - medium, 2)*element[1];
    });

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);

    return deviation;

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
}
