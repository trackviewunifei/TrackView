import { Injectable } from '@angular/core';
import { BehaviorSubject} from'rxjs'
import { AngularNeo4jService } from 'angular-neo4j';
import * as d3 from 'd3';
import configs from './../assets/configs.json';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  
  //Declaration of the variables for Neo4j
  private query;
  private url = 'bolt://footstep.io::7687';
  private username = 'neo4j';
  private password = 'senha';
  private encrypted = false;

  //Declaration of the variables necessaries
  private ajustedData:any[] = [];
  private receivedData:any[] = [];
  private questionaryData:any[] = [];
  private eventsQuery: string = "";
  private dashsInfo: any[] = [];

  constructor(private neo4j: AngularNeo4jService) {
    this.dashsInfo = configs;
  }
  
  //Get the data from the Neo4j passing the query
  public async getDBData(query:string){
    this.query = query;
    var response;
    await this.neo4j
        .connect(
          this.url,
          this.username,
          this.password,
          this.encrypted
        )
        .then(driver => {
          if (driver) {}
        });

        try{
          response = this.neo4j.run(this.query);
        }catch(err){
          console.log(err);
        }

    return response;
  }

  //Close the connection openned on getData
  public closeConnection(){
    this.neo4j.disconnect();
  }

  //Method used by the single page dash to get the data
  public async getDataSinglePageDash(query:string){

    if(this.eventsQuery == query)
      return this.ajustedData;
    
    this.eventsQuery = query;
    this.receivedData = await this.getDBData(this.eventsQuery);
    await this.getQuestionary();
    await this.getQuestionaryAnswers();
    return this.ajustedData;
  }

  //Get the configuration by the informed dash
  public getDashConfig(dash) {
    //@ts-ignore
    return this.dashsInfo.Dashs[dash];
  }

  //Get the colors in the config files
  public getColorsConfig() {
    //@ts-ignore
    return this.dashsInfo.Colors;
  }


  //Get the correct answers about the questionary
  private async getQuestionary(){
    var objects:any[] = [], obj;
    
    await d3.csv("../../assets/areasForm.csv").then((data)=> {//Read CSV
      data.forEach(element => {//For each CSV element, it will create a object, containing the properties of the CSV
        obj = new Object();
        obj["AreaAtuacao"] = element.AreaAtuacao;
        obj["Area"] = element.Area.split(";");
        obj["Technology"] = element.Technology.split(";");
        obj['Client'] = element.Client.split(";");
        obj["Perfil"] = element.Perfil.split(";");
        objects.push(obj);  
      }); 
    });

    this.questionaryData = objects;
  }

  //Get the questionary answers 
  private async getQuestionaryAnswers(){
    this.ajustedData = new Array();
    var obj, i = 0;
    await d3.csv("../../assets/form.csv").then((data)=> {//Read tue CSV
      data.forEach(element => {//For each CSV element, it will create a object
        var array = this.separateEventsArea(element.Name);//Make an array with the time in the element desired and time out

        if(array != null){
          obj = new Object();//Create a object for each user
          obj["Time"] = element.Timestamp;//Add the time of the answear
          obj["Name"] = element.Name;//The name of the user
          obj["Area"] = element.Area.split(";");//The areas entered
          obj["EventArea"] = array;//The events it self, time in, out and the area accessed
          obj["Coherence"] = this.classifyQuestions(array, obj["Area"], element.Technology.split(";"), element.Client.split(";"), element.Perfil.split(";"));//get the coherence for each area
          obj["CoherenceValue"] = this.calcCoherence(obj["Coherence"]);//Get the total coherence
          obj["InfoEvents"] = this.info_events(obj["Name"]);//Get all events, including the ones without a direct relation to the objective

          this.ajustedData.push(obj);
          i++;
        }
      }); 
    });
  }

  //Separate the events of the specified client
  private separateEventsArea(clientName: string){
    var events:any[] = [], start = "", end = "", obj, element;
    var i, j, clientsLength = this.receivedData.length, eventsLength;
    
    for(j = 0; j < clientsLength; j++)
      if(this.receivedData[j][0].includes(clientName))
        break;
    
    if(j == clientsLength)
      return null;

    element = this.receivedData[j][1];
    eventsLength = element.length;
    
    for(i = 0; i < eventsLength; i++){
      obj = new Object();
      if(start == "" && element[i][1].includes("portfolio") && i+1 < eventsLength && this.receivedData[j][1][i+1][1].includes("Modal"))
      start = element[i][0];
      
      if(start != "" && element[i][1].includes("Modal")){
        if(i+1 > eventsLength || (i+1 < eventsLength && !this.receivedData[j][1][i+1][1].includes("Modal"))){
          end = element[i][0];
          obj["inicio"] = start;
          obj["fim"] = end;
          obj["area"] = this.convertObjective(element[i][1], 0);//originally it was convertModal_Area
          events.push(obj);
          start = ""; 
        }
      }
    }

    return events;
  }

  //Given the element, it will return the representation name
  private convertModal_Area(modal:string, type=0){
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

  private convertObjective(modal:string, type=0){
    //@ts-ignore
    this.dashsInfo.Objectives[type].Values.forEach(element => {
      if(modal.includes(element.Name))
        return element.ConvertTo;
    });
  }

  //Classify the answers provided by the user
  private classifyQuestions(events, area, tech, client, perfil){
    var accessedAreas:string[] = [];
    var chosenAreas:any[] = [];
    var i, obj;

    events.forEach(element => {//get the accessed areas name's from the events for a comparative
      if(!accessedAreas.includes(element.area))
      accessedAreas.push(element.area);
    });

    area.forEach(element =>{//goes through the selected areas in the answers
      i = 0;
      if(accessedAreas.includes(element))//if there's a relation between the choosen in the questionary and accessed areas, add 1 if not add 0
        i = 1;

      obj = new Object();//create an array of objects that contains all the areas and coherence
      obj["area"] = element;
      obj['coherenceArea'] = i;
      obj["coherenceTech"] = 0;
      obj["coherenceClient"] = 0;
      obj["coherencePerfil"] = 0;
      chosenAreas.push(obj);
    });

    chosenAreas.forEach(element => {//for each area it will calculate the coherence
      this.questionaryData.forEach(data=>{
        if(data["Area"].includes(element["area"])){
          i = 0;
          data["Technology"].forEach(element => {//If the choosen technology is in the accessed areas, increase the coherence 
            if(tech.includes(element))
              i++;
          });

          element["coherenceTech"] = i/data["Technology"].length;//After analyze everyone it will calculate the coherence
          i = 0;

          data["Client"].forEach(element => {//repeat the process for the others
            if(client.includes(element))
              i++;
          });

          element["coherenceClient"] = i/data["Client"].length;
          i = 0;

          data["Perfil"].forEach(element => {
            if(perfil.includes(element))
              i++;
          });

          element["coherencePerfil"] = i/data["Perfil"].length;
        }
      });
    });

    return chosenAreas;
  }

  //Calculate the coherence, of the given areas
  private calcCoherence(chosenAreas){
    var coherence = 0;

    chosenAreas.forEach(element => {//Assigns weights to the questions
      coherence += element["coherenceArea"] * 0.2;
      coherence += element["coherenceTech"] * 0.3;
      coherence += element["coherenceClient"] * 0.2;
      coherence += element["coherencePerfil"] * 0.3;
    });

    coherence /= chosenAreas.length;
    return coherence;
  }

  //Assign the time of the first and last event, the total of events, and the events it self
  private info_events(clientName: string){
    var j, clientsLength = this.receivedData.length, length = 0;
    var obj = new Object();
    for(j = 0; j < clientsLength; j++)
      if(this.receivedData[j][0].includes(clientName))
        break;
    length = this.receivedData[j][1].length;

    obj["firstEvent"] = this.receivedData[j][1][0][0];
    obj["lastEvent"] = this.receivedData[j][1][length-1][0];
    obj["Events"] = this.receivedData[j][1];
    obj["eventsQuantity"] = length;
    
    return obj;
  }


  //---------------------SECTION OF FATEC DASHBOARDS------------------------------
  //Get the events of the dashboard about multi pages
  public async getEventsFatec(query:string){

    if(this.eventsQuery == query)
      return this.ajustedData;
    
    this.eventsQuery = query;
    this.receivedData = await this.getDBData(this.eventsQuery);
    await this.getMultiPagesEvents();
    return this.ajustedData;
  }

  //Ajust the events for each client
  private async getMultiPagesEvents(){
    this.ajustedData = new Array();
    var obj, arr:any = [];
    this.receivedData.forEach(element => {
      arr = this.divideEvents(element[1])
      obj = new Object();
      obj["Name"] = element[0];
      obj["Pages"] = this.getPages(element[1]);
      obj["Events"] = arr;
      obj["TotalTime"] = this.getTotalTime(arr);
      obj["TotalEvents"] = element[1].length;
      this.ajustedData.push(obj);
      
    });
  }

  //Get the name of the accessed pages
  private getPages(elements: any[]){
    var pages:string[] = [], page;
    elements.forEach(element => {
      page = this.convertObjective(element[1], 1);//orignally wass convert_page_name
      if (!pages.includes(page))
        pages.push(page);

    });

    return pages;
  }

  //Get the total time spent on the website
  private getTotalTime(elements: any[]){
    var time = 0;
    var data1, data2;
    for(var i = 0; i < elements.length; i ++){
      data1 = new Date(elements[i]["EventsData"][0][0]);
      data2 = new Date(elements[i]["EventsData"][elements[i]["EventsData"].length-1][0]);
      time += data2.getTime() - data1.getTime();
    }

    time /= 1000;
    time /= 60;
    return time;
  }

  //Given the events of the user, it will separate a way that make easier to manipulate
  private divideEvents(clientData: any[]){
    var events:any[] = []
    var i, j;
    var obj, data: string[];

    clientData.forEach(element => {
      j = -1;
      for(i = 0; i < events.length; i++)
        if(element[0].includes(events[i]["Date"])){
          j = 1;
          break;
        }
      //j = -1 means that the events happened on the same day, j = 1, means the events happened in different days   
      if(j == -1){
        obj = new Object();
        data = element[0].split(":");
        obj["Date"] = data[0];
        obj["EventsData"] = [];
        obj["EventsData"].push(element);
        events.push(obj);
      }else//
        events[i]["EventsData"].push(element);
         
    });

    return events;
  }

  //Get name of the page by the url
  private convert_page_name(pag:string){
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

}
