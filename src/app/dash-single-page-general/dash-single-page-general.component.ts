import { Component, OnChanges } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dash-single-page-general',
  templateUrl: './dash-single-page-general.component.html',
  styleUrls: ['./dash-single-page-general.component.css']
})
export class DashSinglePageGeneralComponent implements OnChanges {

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
    this.configs = this._dados.getDashConfig(0);
    //@ts-ignore
    this.clientsData = await this._dados.getDataSinglePageDash(this.configs.Query);//Get the data from the query configured to this dash
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
    var clientsLength  = this.clientsData.length;
    var countClientsCoeherence = 0;
    var medEvents = 0;
    var medCoherence = 0;
    var medTime = 0; 

    this.clientsData.forEach(element => {
      if(element["CoherenceValue"] >= 0.6)
        countClientsCoeherence ++;
      medCoherence += element["CoherenceValue"];
      medEvents += element["InfoEvents"]["Events"].length;
    });
    
    medEvents /= clientsLength;
    medCoherence = this._tooltip.getAverageCoherence(this.clientsData);
    medTime = this.calcMedTime();
    //@ts-ignore
    this.cardAjust(this.configs.Cards[0].Title, (countClientsCoeherence), this.configs.Cards[0].Text_1, (clientsLength-countClientsCoeherence) + "", this.configs.Cards[0].Text_2, 1);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[1].Title, (medEvents).toFixed(2), this.configs.Cards[1].Text_1, this.calcDeviationEvents(medEvents, clientsLength).toFixed(2), this.configs.Cards[1].Text_2,2);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[2].Title, (medTime).toFixed(2), this.configs.Cards[2].Text_1, this.calcDeviationTime(medTime, clientsLength).toFixed(2), this.configs.Cards[2].Text_2, 3);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[3].Title, (medCoherence*100).toFixed(2), this.configs.Cards[3].Text_1, (this.calcDeviationCoherence(medCoherence, clientsLength)*100).toFixed(2), this.configs.Cards[3].Text_2, 4);
    
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
    var obj = [], data1, data2;

    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      if(element["CoherenceValue"] >= 0.6){
        timePlus += data2.getTime() - data1.getTime(); 
        contPlus ++;
      }else{
        timeMinus += data2.getTime() - data1.getTime(); 
        contMinus ++;
      }
    }); 
    
    timePlus /= 1000;//Ajust because time is in milliseconds
    timePlus /= 60;
    timeMinus /= 1000;
    timeMinus /= 60;

    med = timePlus/contPlus;
    med += timeMinus/contMinus;
    med /= 2;
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
      if(element["CoherenceValue"] >= 0.6)
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
    this.areaChart = [], i;
    
    stateArray = [];
    areas = [];
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){//its 60.000 because time is in millisecond and this way will go a minute in each execution
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];
      arr.push(dateAux.getHours()+":"+dateAux.getMinutes());
      arr.push(0);
      arr.push(0);
      arr.push(0);
      arr.push(0);
      areas.push(arr);
    }
    
    this.clientsData.forEach(element => {
      element["InfoEvents"]["Events"].forEach(event => {
        i = 0;
        areas.forEach(data => {
          if(event[0].includes(data[0])){
            if(element["CoherenceValue"] >= 0.6)
              data[1] += 1;
            else
              data[2] += 1;

            if(stateArray[i] == 0){
              if(element["CoherenceValue"] >= 0.6){
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
    var obj;
    var dateAux;
    this.lineChart = [];

    //@ts-ignore
    this.configs.Charts[1].Text.forEach(element => {
      this.lineNames.push(element.Value);
    });
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){
      dateAux = new Date(i);
      obj = [];
      obj.push(dateAux.getHours()+":"+dateAux.getMinutes());
      obj.push(0);
      obj.push(0);
      obj.push(0);
      this.lineChart.push(obj);
    }

    this.clientsData.forEach(element => {
      element["InfoEvents"]["Events"].forEach(event => {
        this.lineChart.forEach(data => {
          if(event[0].includes(data[0])){
            if(element["CoherenceValue"] >= 0.6)
              data[1] += 1;
            else
              data[2] += 1;

            data[3] += 1;
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
    
    data1 = new Date(this.clientsData[0]["InfoEvents"]["firstEvent"])
    firstEvent = data1.getTime();
    //Gets Smaller e and bigger event
    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      
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

  //Method that calculate the average
  private calcMedTime(){
    var contMed = 0;
    var timeMed = 0;
    var data1, data2;

    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      timeMed += data2.getTime() - data1.getTime(); 
      contMed ++;
    }); 
    
    timeMed /= 1000;
    timeMed /= 60;

    return timeMed/contMed;
  }

  //Method that calculate the deviation on time
  private calcDeviationTime(medium, total){
    var data1:Date, data2:Date, deviation = 0;
    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      deviation += Math.pow((data2.getTime() - data1.getTime()) - (medium * 60 * 1000), 2);// balance the minutes, because timeMed is in milliseconds
    }); 

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);
    deviation /= 1000;//Ajust so the time is back to minutes
    deviation /= 60;

    return deviation; 
  }

  //Method that calculate the deviation on coherence
  private calcDeviationCoherence(medium, total){
    var deviation = 0;

    this.clientsData.forEach(element => {
      deviation += Math.pow(element["CoherenceValue"]-medium, 2) ;
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
      lengthEvents = element["InfoEvents"]["Events"].length;
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

    str1 = (date+"").split(":");//split hour - minute - second
    dateAna = str1["0"]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }
}
