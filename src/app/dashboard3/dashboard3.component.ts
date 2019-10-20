import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './../dados.service';
import { TooltipService } from '../tooltip.service';
@Component({
  selector: 'app-dashboard3',
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component implements OnChanges {

  @Input()
  private clientsData:any[] = [];
  private areasData:any[] = [];

  //Variáveis que resultarão nos gráficos
  private pieChart:any[];
  private bulletChart:any[];
  private barChart:any[];
  private donutChart:any[];

  //Variáveis auxiliares
  private axisNamesBullet: string[];
  private axisNamesBar: string[];
  private bulletHeight = 250;
  private card1:string[];
  private card2:string[];
  private card3:string[];
  private card4:string[];
  private colors:any[];

  constructor(private _dados: DadosService, private _tooltip: TooltipService) { 
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

    this.donutAjust();
    this.pieAjust();
    this.bulletAjust();
    this.barAjust();
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
    
    var medEvents = 0;
    var medCoherence = 0;
    var medTime = 0; 
    var medChoose = 0

    this.areasData.forEach(element => {
      medCoherence += element["Coherence"];
      medEvents += element["Events"].length;
      medTime += (element["Time"])/element["Clients"].length;
      element["Clients"].forEach(data => {
        medChoose += data["Choose"];
      });
    });
    
    medEvents /= totalAreas;
    medCoherence /= totalAreas;
    medChoose /= totalAreas

    this.cardAjust("Coerência", (100*medCoherence).toFixed(2)+"%", " Média por área", (this.calcDeviationCoherence(medCoherence, totalAreas)*100).toFixed(2)+"%", " Desvio Padrão", 1);
    this.cardAjust("Eventos", (medEvents).toFixed(2), " Média por área", this.calcDeviationEvents(medEvents, totalAreas).toFixed(2), " Desvio Padrão ",2);
    this.cardAjust("Tempo", (medTime).toFixed(2) +" minutos", "Média por área", this.calcDeviationTime(medTime, totalAreas).toFixed(2), " Desvio Padrão ", 3);
    this.cardAjust("Escolha", (medChoose).toFixed(2), " escolhas em Média", this.calcDeviationCoherence(medCoherence, totalAreas).toFixed(2), " Desvio Padrão", 4);
    
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
    this.axisNamesBullet = [];
    this.axisNamesBar = [];

    this.axisNamesBullet.push("Coerência");
    this.axisNamesBullet.push("Áreas");
    
    this.axisNamesBar.push("Áreas");
    this.axisNamesBar.push("Tempo Médio por Cliente");
    
    this.colors = [];
    this.colors.push("#F1C40F");
    this.colors.push("#2980B9");
    this.colors.push("#2ECC71");
    this.colors.push("#E74C3C");
    this.colors.push("#ECF0F1");
    this.colors.push("#AEB6BF");
  }

  private bulletAjust(){
    var arr;
    this.bulletChart = [];

    this.areasData.forEach(element => {
      arr = [];
      arr.push(element["Name"]);
      arr.push(element["Coherence"]);
      this.bulletChart.push(arr);
    });

  }

  private pieAjust(){
    var arr:any[], cont;
    this.pieChart = [];
    this.areasData.forEach(element => {
      arr = [];
      cont = 0;
      element["Clients"].forEach(data => {
        cont += data["Choose"];
      });

      arr.push(element["Name"]);
      arr.push(cont);
      this.pieChart.push(arr);
    });
  }

  private donutAjust(){
    var arr:any;
    this.donutChart = [];

    this.areasData.forEach(element => {
      arr = [];
      arr.push(element["Name"]);
      arr.push(element["Events"].length);
      this.donutChart.push(arr);
    });
  }

  private barAjust(){
    var arr;
    this.barChart = [];

    this.areasData.forEach(element => {
      arr = [];
      arr.push(element["Name"]);
      arr.push(element["Time"]/element["Clients"].length);
      this.barChart.push(arr);
    });
  }

  private calcDeviationTime(medium, total){
    var deviation = 0;
    this.areasData.forEach(element => {
      deviation += Math.pow(element["Time"] - medium , 2);// faz a conta para balancear novamente os minutos, ja que timeMed esta em milisegundos
    }); 

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);

    return deviation; 
  }

  private calcDeviationCoherence(medium, total){
    var deviation = 0;

    this.areasData.forEach(element => {
      deviation += Math.pow(element["Coherence"]-medium, 2) ;
    });

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);

    return deviation;
  }

  private calcDeviationChoose(medium, total){
    var deviation = 0, test:boolean, lengthChoose;
    var events:any[];
    var arr:any[];

    events = [];

    this.areasData.forEach(element => {
      test = false;
      lengthChoose = 0;
      element["Clients"].forEach(data => {
        lengthChoose += data["Choose"];
      });
      events.forEach(data => {
        if(data[0] == lengthChoose){
          data[1] ++;
          test = true;
        }
      });

      if(!test){
        arr = [];
        arr.push(lengthChoose);
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

  private calcDeviationEvents( medium, total){
    var deviation = 0, test:boolean, lengthEvents;
    var events:any[];
    var arr:any[];

    events = [];

    this.areasData.forEach(element => {
      test = false;
      lengthEvents = element["Events"].length;
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

}
