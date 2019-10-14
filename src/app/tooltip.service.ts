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

  public getAverageEventsPerClient(clientsData:any[]){
    var events = 0;
    clientsData.forEach(element =>{
      events += element["InfoEvents"]["Events"].length;
    });

    return events/clientsData.length;
  }

  public getAverageTimeOnArea(clientsData: any[]){//TODO: make a method do capture the time in a modal
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

  public convertClientsDataToArea(clientsData:any[]){
    var areaData:any[] = [], areas:any[] = [], coherenceClients = [];
    var objArea:Object, objClient:Object, index;
    var date1:Date, date2:Date, verify;

    clientsData.forEach(element => {
      element["EventArea"].forEach(data => {
        if(areas.includes(data["area"])){
          index = areas.indexOf(data["area"]);
          
          date1 = new Date(data["inicio"]);
          date2 = new Date(data["fim"]);
          
          areaData[index]["Time"]+=((date2.getTime() - date1.getTime())/1000)/60;
          verify = 0;
          
          areaData[index]["Clients"].forEach(client => {
            if(client["ClientName"] == element["Name"])
              verify = 1
          });

          if(verify == 0){
            coherenceClients[index] += 1;
            areaData[index]["Coherence"] += element["CoherenceValue"];

            objClient = new Object();
            objClient["ClientName"] = element["Name"];

            objClient["Choose"] = 0;
            if(element["Area"].includes(data["area"]))
            objClient["Choose"] = 1;

            objClient["QtdEvents"] = element["InfoEvents"]["Events"].length;
            objClient["CoherenceValue"] = element["CoherenceValue"];
            areaData[index]["Clients"].push(objClient);
          }
        }else{
          areas.push(data["area"]);
          coherenceClients.push(1);
          date1 = new Date(data["inicio"]);
          date2 = new Date(data["fim"]);
          
          objArea = new Object();
          objArea["Name"] = data["area"];
          objArea["Time"] = ((date2.getTime() - date1.getTime())/1000)/60;//begin, end, events
          objArea["Coherence"] = element["CoherenceValue"];
          objArea["Events"] = [];
          objArea["Clients"] = [];

          objClient = new Object();
          objClient["ClientName"] = element["Name"];

          objClient["Choose"] = 0;
          if(element["Area"].includes(data["area"]))
          objClient["Choose"] = 1;

          objClient["QtdEvents"] = element["InfoEvents"]["Events"].length;
          objClient["CoherenceValue"] = element["CoherenceValue"];

          objArea["Clients"].push(objClient);
          areaData.push(objArea);
        }
      });
    });

    for(var i = 0; i < coherenceClients.length; i++)
      areaData[i]["Coherence"] /= coherenceClients[i];

    this.calcEventsArea(areaData, clientsData);

    return areaData;
  }

  private convertModal_Area(modal:string){
    if(modal.includes("Modal1"))
      return "Embarcados";
    else if(modal.includes("Modal2"))
      return "Robótica";
    else if(modal.includes("Modal3"))
      return "Plataformas";
    else if(modal.includes("Modal4"))
      return "Realidade Virtual";
    else if(modal.includes("Modal5"))
      return "Gaming";
    else if(modal.includes("Modal6"))
      return "Servidores";
  }

  private calcEventsArea(areaData:any[], clientsData:any[]){
    var nameModal;
    clientsData.forEach(element => {
      element["InfoEvents"]["Events"].forEach(data => {
        if(data[1].includes("Modal")){
          nameModal = this.convertModal_Area(data[1]);
          areaData.forEach(area => {
            if(area["Name"] == nameModal)
              area["Events"].push(data[0]);
          });
        }
      });
    });
  }

}
