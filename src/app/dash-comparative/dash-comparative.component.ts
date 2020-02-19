import { Component, OnChanges } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dash-comparative',
  templateUrl: './dash-comparative.component.html',
  styleUrls: ['./dash-comparative.component.css']
})
export class DashComparativeComponent implements OnChanges {

  private group1Data:any[] = [];
  private group2Data:any[] = [];

  //Chart Variables
  private radarChart:any[];
  private areaChart:any[];  
  private lineChart:any[];
  private bulletChart:any[];

  //Extra Variables
  private lineNames:string[] = [];
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
  public configs:any[];
  private startTimeG1;
  private endTimeG1;
  private startTimeG2;
  private endTimeG2;

  constructor(private _dados: DadosService, private _tooltip: TooltipService) { 
    this.cardsAjust();
    this.getDash();
  }

  //On changes it will get the most recent data
  ngOnChanges() {
    if(!this.group1Data || !this.group2Data)
      return;

    this.getDash();
  }

  //Method responsable for call the responsable methods to form the dash
  private async getDash(){
    this.configs = this._dados.getDashConfig(5);
    //@ts-ignore
    this.group1Data = await this._dados.getEventsFatec(this.configs.Query);
    this.separateGroups();
    this._dados.closeConnection();

    this.setStartEndDate(this.group1Data, 1);
    this.setStartEndDate(this.group2Data, 2);
    
    //Call a method to create every chart
    this.areaAjust();
    this.lineAjust();
    this.radarAjust();
    this.bulletAjust();
    this.cardInsertData();
    this.fillAxis();
  }

  //Initiate the cards empty
  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "", 3);
    this.cardAjust("", "", "","", "", 4);
  }

  //Method that inserts data into the cards
  private cardInsertData(){
    //@ts-ignore
    this.cardAjust(this.configs.Cards[0].Title, this.group1Data.length+ "", this.configs.Cards[1].Text_1, this.group2Data.length + "", this.configs.Cards[0].Text_2, 1);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[1].Title, (this._tooltip.getAverageEventsPerClientFatec(this.group1Data)).toFixed(2), this.configs.Cards[1].Text_1, (this._tooltip.getAverageEventsPerClientFatec(this.group2Data)).toFixed(2), this.configs.Cards[1].Text_2,2);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[2].Title, (this._tooltip.getAverageTimeFatec(this.group1Data)).toFixed(2), this.configs.Cards[2].Text_1, (this._tooltip.getAverageTimeFatec(this.group2Data)).toFixed(2), this.configs.Cards[2].Text_2, 3);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[3].Title, (this._tooltip.getAverageConversion(this.group1Data)*100).toFixed(2), this.configs.Cards[3].Text_1, (this._tooltip.getAverageConversion(this.group2Data)*100).toFixed(2), this.configs.Cards[3].Text_2, 4);
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
    this.axisNamesLine = [];
    this.axisNamesBullet = [];

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

  //Method that ajust the data for the line chart
  private radarAjust(){
    this.radarChart = [];
    //@ts-ignore
    this.radarChart.push(this.singleRadar(this.group1Data, this.configs.Charts[3].Text[0].Value, this.colors[0]));
    //@ts-ignore
    this.radarChart.push(this.singleRadar(this.group2Data, this.configs.Charts[3].Text[1].Value, this.colors[1]));
  }

  //The logic was generalized so it would be easier to manipulate by two different groups
  private singleRadar(clientsDate:any[], pag :string, color: string){
    var obj = new Object();
    var arr:any[] = [];
    
    var axis1 = new Object();
    var axis2 = new Object();
    var axis3 = new Object();
    var axis4 = new Object();
    
    obj["name"] = pag;
    //@ts-ignore
    axis3["axis"] = this.configs.Charts[3].Legends[0].Value;
    axis1["value"] = (this._tooltip.getAverageConversion(clientsDate)*10).toFixed(2);
    arr.push(axis1);
    
    //@ts-ignore
    axis3["axis"] = this.configs.Charts[3].Legends[1].Value;
    axis3["value"] = (this.getEventsPerTime(clientsDate)/4).toFixed(2);
    arr.push(axis3);

    //@ts-ignore
    axis3["axis"] = this.configs.Charts[3].Legends[2].Value;
    axis2["value"] = (this._tooltip.getAverageTimeFatec(clientsDate)).toFixed(2);
    arr.push(axis2);
    
    //@ts-ignore
    axis3["axis"] = this.configs.Charts[3].Legends[3].Value;
    axis4["value"] = this.areasAccess(clientsDate);
    arr.push(axis4);
    
    obj["axes"] = arr;
    obj["color"] = color;
    console.log(arr);
    return obj;
  }

  //Method the get the areas accessed
  private areasAccess(clientsData:any[]){
    var areas = 0;
    clientsData.forEach(element => {
      areas += element["Pages"].length;
    });
    
    return areas/clientsData.length;
  }

  //Method the gets the events per time
  private getEventsPerTime(clientsData:any[]){
    var events = 0;
    var timeMed = 0;

    clientsData.forEach(element => {
      timeMed += element["TotalTime"]; 
      events += element["TotalEvents"];
    }); 

    return events/timeMed;
  }

  //Method that ajust the data for the line chart
  private lineAjust(){
    var n, lineGroup1:any[], lineGroup2:any[], arr:any[];
    this.lineChart = [];

    //@ts-ignore
    this.configs.Charts[1].Text.forEach(element => {
      this.lineNames.push(element.Value);
    });
    
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

  //The logic was generalized so it would be easier to manipulate by two different groups
  private singleLine(clientsData:any[], startTime:Date, endTime:Date){
    var arr:any[], lines:any[] = [], dateAux:Date, i, month, date;
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 86400000){
      dateAux = new Date(i);
      arr = [];
      month = dateAux.getMonth()+1;
      arr.push(dateAux.getDate()+"/"+month);
      arr.push(0);
      lines.push(arr);
    }
    clientsData.forEach(element => {
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

  //Method that ajust the data for the area chart
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
    //@ts-ignore
    this.configs.Charts[0].Text.forEach(element => {
      this.areasNames.push(element.Value);
    });

  }

  //The logic was generalized so it would be easier to manipulate by two different groups
  private singleArea(clientsData:any[], startTime:Date, endTime:Date){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [], i, month, date;
    
    stateArray = [];
    areas = [];
    
    for(i = startTime.getTime(); i <= endTime.getTime(); i += 86400000){
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];
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

  //Method that ajust the data for the bullet chart
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

    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[0].Value);
    this.bulletChart.push(obj);

    obj = [];
    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[1].Value);
    obj.push(timeG2/this.group2Data.length);
    this.bulletChart.push(obj);

    obj = [];
    //@ts-ignore
    obj.push(this.configs.Charts[2].Text[2].Value);
    obj.push(med);
    this.bulletChart.push(obj);

  }

  //Method that get the start and end of the data
  private setStartEndDate(clientsData:any[], group){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(clientsData[0]["Events"][0]["EventsData"][0][0])
    firstEvent = data1.getTime();
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

  //Method that splits the groups   
  private separateGroups(){
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


