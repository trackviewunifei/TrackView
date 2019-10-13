import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor() { }


  public getAverageCoherence(clientsData:any[]){
    var coherence = 0;
    clientsData.forEach(element => {
      coherence += element["CoherenceValue"];
    });

    return coherence/clientsData.length;
  }

  public getAverageTimeOnArea(clientsData: any[]){
    var contMed = 0;
    var timeMed = 0;
    var data1, data2;

    clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      timeMed += data2.getTime() - data1.getTime(); 
      contMed ++;
    }); 
    
    timeMed /= 1000;
    timeMed /= 60;

    return timeMed/contMed;
  }

  public getAverageTime(clientsData:any[]){
    var contMed = 0;
    var timeMed = 0;
    var data1, data2;

    clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      timeMed += data2.getTime() - data1.getTime(); 
      contMed ++;
    }); 
    
    timeMed /= 1000;
    timeMed /= 60;

    return timeMed/contMed;
  }

  public setStartEndDate(startTime:Date, endTime:Date, clientsData:any[]){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(clientsData[0]["InfoEvents"]["firstEvent"])
    firstEvent = data1.getTime();
    //Obter Menor e maior evento
    clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      
      if(data2.getTime() > lastEvent)
        lastEvent = data2
      
      if(data1.getTime() < firstEvent)
        firstEvent = data1;
    });

    data1 = new Date(firstEvent);
    data2 = new Date(lastEvent);

    startTime = this.dataAjust(data1);
    endTime = this.dataAjust(data2);
  }

  public dataAjust(date:Date){
    var str1:string[];
    var dateAna;

    str1 = (date+"").split(":");//isso para separar hora - minuto - segundo
    dateAna = str1["0"]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }

}
