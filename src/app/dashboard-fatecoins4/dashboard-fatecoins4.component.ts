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
    this.choosenArea = "Cart";
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
    this.areasData = this._tooltip.convertClientsDataToPages(this.clientsData);

    this.setStartEndDate();
    this.fillAxis();
    this.areaAjust();
    this.pieAjust();
    this.bulletAjust();
    this.lineAjust();
    this.cardInsertData();
  }

  private async obtemDados(){
    this.clientsData = await this._dados.getEventsFatec("match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where p.id =~ '.*fate.*'and  e.date_str <= '2019-11-03' and e.date_str >= '2019-10-22'  return cliente, collect([data, l.id, l.tag_classes]) as dados");
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

    this.cardAjust("Caminho", areaInterest+"", " Usaram no caminho da compra", (areaInterest/totalClients*100).toFixed(2), "% que convergiram passaram", 1);
    this.cardAjust("Eventos", (areaEvents/areaAccess).toFixed(2)," Eventos por acesso",(medEvents/medAccess).toFixed(2), "Média Eventos por acesso",3);
    this.cardAjust("Representatividade", ((areaAccess*100)/this.clientsData.length).toFixed(2)+"% dos usuários acessaram", "", ((medAccess*100/totalAreas)/this.clientsData.length).toFixed(2)+"% de Média", " para as demais", 2);
    this.cardAjust("Conversão", ((areaInterest*100)/areaAccess).toFixed(2)+"%", " de Média dessa Página", ((medInterest*100)/medAccess).toFixed(2) + "%", " de Média para as demais", 4);
    
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
    this.nomesLinhas = [];
    this.axisNamesArea.push("Tempo");
    this.axisNamesArea.push("Média de eventos por usuários");

    this.axisNamesBullet.push("Tempo (minutos)");
    this.axisNamesBullet.push("Tipo");
    
    this.axisNamesLine.push("Tempo");
    this.axisNamesLine.push("Eventos");

    this.areasTitle = this._tooltip.getAreas(this.areasData);
    
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
    arr.push("Média das demais páginas");    
    arr.push(cont/clients);
    this.bulletChart.push(arr);
  }

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
    arr.push("Demais Páginas");
    arr.push(cont);
    this.pieChart.push(arr);
  }

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
    this.areasNames.push("Demais Páginas");

    this.areaChart = areas;
  }

  private lineAjust(){
    var obj;
    var dateAux;
    var date, month;
    this.lineChart = [];

    this.nomesLinhas.push(this.choosenArea);
    this.nomesLinhas.push("Demais");
    this.nomesLinhas.push("Média");
    
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
    dateAna = str1[0]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }

  onChange(event){
    this.choosenArea = event.target.value;    
    this.obDados();
  }

}
