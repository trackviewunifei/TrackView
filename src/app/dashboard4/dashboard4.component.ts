import { Component, OnChanges, Input } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dashboard4',
  templateUrl: './dashboard4.component.html',
  styleUrls: ['./dashboard4.component.css']
})
export class Dashboard4Component implements OnChanges {

  @Input()
  private clientsData:any[] = [];

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
  public configs:any[];

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
    this.configs = this._dados.getDashConfig(0);
    console.log(this.configs);
    await this.obtemDados();
    this._dados.closeConnection();

    this.setStartEndDate();

    this.areaAjust();
    this.pieAjust();
    this.bulletAjust();
    this.lineAjust();
    this.cardInsertData();
    this.fillAxis();
  }

  private async obtemDados(){
    //@ts-ignore
    this.clientsData = await this._dados.obtemDados(this.configs.Query);    
  }

  private cardsAjust(){
    this.cardAjust("", "", "", "", "",1);
    this.cardAjust("", "", "","", "", 2);
    this.cardAjust("", "", "","", "",3);
    this.cardAjust("", "", "","", "",4);
  }

  private cardInsertData(){
    var cardValue, cardExtra; //card 1
    cardValue = this.clientsData.length;
    cardExtra = 0;
    
    var medEvents = 0;
    var medCoherence = 0;
    var medTime = 0; 

    this.clientsData.forEach(element => {
      if(element["CoherenceValue"] >= 0.6)
        cardExtra ++;
      medCoherence += element["CoherenceValue"];
      medEvents += element["InfoEvents"]["Events"].length;
    });
    
    medEvents /= cardValue;
    medCoherence = this._tooltip.getAverageCoherence(this.clientsData);
    medTime = this.calcMedTime();
    //@ts-ignore
    this.cardAjust(this.configs.Cards[0].Title , (cardExtra), this.configs.Cards[0].Text_1, (cardValue-cardExtra) + "", this.configs.Cards[0].Text_2, 1);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[1].Title, (medEvents).toFixed(2), this.configs.Cards[1].Text_1, this.calcDeviationEvents(medEvents, cardValue).toFixed(2), this.configs.Cards[1].Text_2,2);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[2].Title, (medTime).toFixed(2), this.configs.Cards[2].Text_1, this.calcDeviationTime(medTime, cardValue).toFixed(2), this.configs.Cards[2].Text_2, 3);
    //@ts-ignore
    this.cardAjust(this.configs.Cards[3].Title, (medCoherence*100).toFixed(2), this.configs.Cards[3].Text_1, (this.calcDeviationCoherence(medCoherence, cardValue)*100).toFixed(2), this.configs.Cards[3].Text_2, 4);
    
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
    
    timePlus /= 1000;//Ajustes visto que o tempo obtido esta em milisegundos
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
    obj.push("Média");
    obj.push(med);
    this.bulletChart.push(obj);

  }

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

  private areaAjust(){
    var arr:any[], areas:any[], dateAux:Date, stateArray:any [];
    this.areaChart = [], i;
    
    stateArray = [];
    areas = [];
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      stateArray.push(0);
      arr = [];//pre aloca o vetor que conterá os dados
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

  private lineAjust(){
    var obj;
    var dateAux;
    this.lineChart = [];

    //@ts-ignore
    this.configs.Charts[1].Text.forEach(element => {
      this.nomesLinhas.push(element.Value);
    });
    
    for(var i = this.startTime.getTime(); i <= this.endTime.getTime(); i += 60000){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      obj = [];//pre aloca o vetor que conterá os dados
      obj.push(dateAux.getHours()+":"+dateAux.getMinutes());
      obj.push(0);
      obj.push(0);
      obj.push(0);
      this.lineChart.push(obj);
    }

    this.clientsData.forEach(element => {// para cada cliente irá percorrer seus eventos e lançar a qual posição eles pertencem
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

  private setStartEndDate(){
    var firstEvent = 0, lastEvent = 0; 
    var data1, data2;
    
    data1 = new Date(this.clientsData[0]["InfoEvents"]["firstEvent"])
    firstEvent = data1.getTime();
    //Obter Menor e maior evento
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

  private calcDeviationTime(medium, total){
    var data1:Date, data2:Date, deviation = 0;
    this.clientsData.forEach(element => {
      data1 = new Date(element["InfoEvents"]["firstEvent"]);
      data2 = new Date(element["InfoEvents"]["lastEvent"]);
      deviation += Math.pow((data2.getTime() - data1.getTime()) - (medium * 60 * 1000), 2);// faz a conta para balancear novamente os minutos, ja que timeMed esta em milisegundos
    }); 

    deviation /= total;
    deviation = Math.pow(deviation, 1/2);
    deviation /= 1000;//Faz os ajustes para devolver em minutos
    deviation /= 60;

    return deviation; 
  }

  private calcDeviationCoherence(medium, total){
    var deviation = 0, test:boolean;
    var events:any[];
    var arr:any[];

    events = [];

    this.clientsData.forEach(element => {
      deviation += Math.pow(element["CoherenceValue"]-medium, 2) ;
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

  private dataAjust(date:Date){
    var str1:string[];
    var dateAna;

    str1 = (date+"").split(":");//isso para separar hora - minuto - segundo
    dateAna = str1["0"]+":"+str1[1]+":00 GMT-0300";
    date = new Date(dateAna);
    return date;
  }

    /*
  private lineAjust(){
    this.lineChart = [];
    var str:string[];
    var obj:any[], areas:any[], elementsX:any[], elementsY:any[], dateAux:Date, dateProx:Date, dateEvent:Date;
    var difTime = this.endTime.getTime() - this.startTime.getTime(); 

    for(var i = this.startTime.getTime(); i <= this.endTime.getTime() - difTime/5; i += difTime/5){//Percorre criando os espaços que conterão eixo x e valores do y
      dateAux = new Date(i);
      dateProx = new Date(i+difTime/5);
      obj = [];
      obj.push(dateAux.getHours()+":"+dateAux.getMinutes());
      areas = [];
      elementsX = [];
      elementsY = [];
      this.clientsData.forEach(element => {
        element["EventArea"].forEach(data => {
          dateEvent = new (data["inicio"]);
          if(dateEvent.getMinutes() >= dateAux.getMinutes() && dateEvent.getMinutes() < dateProx.getMinutes() && dateEvent.getHours() == dateAux.getHours()){
            if(areas.includes(data["area"])){
              //pegar indice da data area
              //jogar valores nos vetores de x ou y q ele seja
            }else{
              //jogar no areas essa area
            }
          }

        });
      });
    }


    this.linha.forEach(element => {//Obtem os nomes dos navegadores
      str = element[1].split("(");
      str = str[1].split(";");
      str = str[0].split(" ");
      if(!this.nomesLinhas.includes(str[0]))
        this.nomesLinhas.push(str[0]);
    });

    this.linha.forEach(element => {
      if(!this.grafLinha.find(ele => ele[0] == element[0])){  
        var obj:any[] = [];
        obj.push(element[0]);
        obj.push(0);
        obj.push(0);
        obj.push(0);
        for(var i = this.linha.indexOf(element); i < this.linha.length; i++){
          if(element[0] == this.linha[i][0]){
            str = this.linha[i][1].split("(");
            str = str[1].split(";");
            str = str[0].split(" ");
            obj[this.nomesLinhas.indexOf(str[0])+1] = this.linha[i][2];
          }
        }
        this.grafLinha.push(obj);
      }
    });
    //console.log(this.grafLinha);
  }

  */
}
