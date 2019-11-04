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

  //--------------------start methods fatec----------------------

  public getAverageConversion(clientsData:any[]){
    var coherence = 0;
    clientsData.forEach(element => {
      if(element["Pages"].includes("Checkout"))
        coherence ++;
    });

    return coherence/clientsData.length;
  }

  public getAverageTimeFatec(clientsData:any[]){
    var timeMed = 0;

    clientsData.forEach(element => {
      timeMed += element["TotalTime"]; 
    }); 
    
    return timeMed/clientsData.length;
  }

  public getAverageEventsPerClientFatec(clientsData:any[]){
    var events = 0;
    clientsData.forEach(element =>{
      events += element["TotalEvents"];
    });

    return events/clientsData.length;
  }

  //---------------------------end-------------------------------

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
    dateAna = str1[0]+":"+str1[1]+":00 GMT-0300";
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

  public getAreas(areaData:any[]){
    var areas:any[] = [];
    areaData.forEach(element => {
      areas.push(element["Name"]);
    });

    return areas;
  }

  //-------------------------------------------------Metodos relativos ao experimento da Fatec---------------------------------
  public convertClientsDataToPages(clientsData:any[]){
    var areaData:any[] = [], areas:any[] = [];
    var objArea:Object, objClient:Object, index;
    var verify;

    clientsData.forEach(element => {
      element["Events"].forEach(event => {
        element["Pages"].forEach(page => {
          if(page != "Checkout") // não é desejado que a página de checkout apareça nas áreas com eventos visto que ela é o objetivo final
            if(areas.includes(page)){
              index = areas.indexOf(page);
              
              areaData[index]["Time"] += this.separaEventosPage(event["EventsData"], this.convert_page_name(page));
              verify = 0;
              
              areaData[index]["Clients"].forEach(client => {
                if(client["ClientName"] == element["Name"])
                  verify = 1
              });
    
              if(verify == 0){
    
                objClient = new Object();
                objClient["ClientName"] = element["Name"];
            
                objClient["Choose"] = 0;
                if(element["Pages"].includes("Checkout"))
                  objClient["Choose"] = 1;
            
                objClient["QtdEvents"] = element["TotalEvents"];
                areaData[index]["Clients"].push(objClient);
              }
            }else{
              areas.push(page);
              
              objArea = new Object();
              objArea["Name"] = page;
              objArea["Time"] = this.separaEventosPage(event["EventsData"], this.convert_page_name(page));
              objArea["Events"] = [];
              objArea["Clients"] = [];
    
              objClient = new Object();
              objClient["ClientName"] = element["Name"];
    
              objClient["Choose"] = 0;
              if(element["Pages"].includes("Checkout"))
                objClient["Choose"] = 1;
            
              objClient["QtdEvents"] = element["TotalEvents"];
    
              objArea["Clients"].push(objClient);
              areaData.push(objArea);
            }
        });
      });
    });

    this.calcEventsAreaFatec(areaData, clientsData);
    console.log(areaData);
    return areaData;
  }

  private calcEventsAreaFatec(areaData:any[], clientsData:any[]){
    var namePage;
    clientsData.forEach(element => {
      element["Events"].forEach(data => {
        data["EventsData"].forEach(event => {
          namePage = this.convert_page(event[1]);
          areaData.forEach(area => {
            if(area["Name"] == namePage)
              area["Events"].push(event[0]);
          });          
        });
      });
    });
  }

  private convert_page_name(pag:string){
    if(pag.includes("Cart"))
      return "cart";
    else if(pag.includes("Login"))
      return "login";
    else if(pag.includes("Checkout"))
      return "checkout";
    else if(pag.includes("Oferta"))
      return "oferta";
    else
      return "Demais";
  }

  private convert_page(pag:string){
    if(pag.includes("cart"))
      return "Cart";
    else if(pag.includes("login"))
      return "Login";
    else if(pag.includes("checkout"))
      return "Checkout";
    else if(pag.includes("oferta"))
      return "Oferta";
    else
      return "Demais";
  }

  private separaEventosPage(events:any[], pageName: string){
    var i = 0, tamanhoEventos = events.length, time = 0;
    var inicio = "", fim = "";
    var data1, data2;

    for(i = 0; i < tamanhoEventos; i++){
      if(inicio == "" && i+1 < tamanhoEventos && events[i][1].includes(pageName))
        inicio = events[i][0];
      
      if(inicio != "" && events[i][1].includes(pageName)){
        if(i+1 > tamanhoEventos || (i+1 < tamanhoEventos && !events[i+1][1].includes(pageName))){
          fim = events[i][0];
          data1 = new Date(inicio);
          data2 = new Date(fim);
          time += data2.getTime() - data1.getTime();
          inicio = ""; 
        }
      }
    }
    
    return (time/60)/1000;
  }

}
