import { Component, OnChanges } from '@angular/core';
import { DadosService } from '../dados.service';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'app-dash-estrutura-paginas',
  templateUrl: './dash-estrutura-paginas.component.html',
  styleUrls: ['./dash-estrutura-paginas.component.css']
})
export class DashEstruturaPaginasComponent implements OnChanges {
    private clientsData: any[] = [];
    private areasData: any[] = [];

    //Chart Variables 
    private pieChart: any[];
    private bulletChart: any[];
    private barChart: any[];
    private donutChart: any[];

    //Extra Variables
    private axisNamesBullet: string[];
    private axisNamesBar: string[];
    private bulletHeight = 450;
    private card1: string[];
    private card2: string[];
    private card3: string[];
    private card4: string[];
    private colors: any[];
    public configs: any[];

    constructor(private _dados: DadosService, private _tooltip: TooltipService) {
        this.cardsAjust();
        this.getDash();
    }

    //On changes it will get the most recent data
    ngOnChanges() {
        if (!this.clientsData)
            return;

        this.getDash();
    }

    //Method responsable for call the responsable methods to form the dash
    private async getDash() {
        this.configs = this._dados.getDashConfig(6);
        //@ts-ignore
        this.clientsData = await this._dados.getEventsFromNeo4j(this.configs.Query);//Get the data from the query configured to this dash
        this._dados.closeConnection();
        this.areasData = this._tooltip.convertClientsDataToPages(this.clientsData);

        //Call a method to create every chart
        this.donutAjust();
        this.pieAjust();
        this.bulletAjust();
        this.barAjust();
        this.cardInsertData();
        this.fillAxis();
    }

    //Initiate the cards empty
    private cardsAjust() {
        this.cardAjust("", "", "", "", "", 1);
        this.cardAjust("", "", "", "", "", 2);
        this.cardAjust("", "", "", "", "", 3);
        this.cardAjust("", "", "", "", "", 4);
    }

    //As cards are an separate component, it's necessary to passa the data for them, so this methods split to each card
    private cardInsertData() {
        var totalAreas = this.areasData.length;
        var medEvents = 0;
        var medClients = 0;
        var medTime = 0;
        var medPages = this.areasAccess(this.clientsData);

        this.areasData.forEach(element => {
            medEvents += element["Events"].length;
            medTime += (element["Time"]) / element["Clients"].length;
            medClients += element["Clients"].length;
        });

        medEvents /= totalAreas;
        medClients /= totalAreas;
        //@ts-ignore
        this.cardAjust(this.configs.Cards[0].Title, (medClients).toFixed(2), this.configs.Cards[0].Text_1, (this.calcDeviationClients(medClients, totalAreas)).toFixed(2), this.configs.Cards[0].Text_2, 1);
        //@ts-ignore
        this.cardAjust(this.configs.Cards[1].Title, (medEvents).toFixed(2), this.configs.Cards[1].Text_1, this.calcDeviationEvents(medEvents, totalAreas).toFixed(2), this.configs.Cards[1].Text_2, 2);
        //@ts-ignore
        this.cardAjust(this.configs.Cards[2].Title, (medTime).toFixed(2), this.configs.Cards[2].Text_1, this.calcDeviationTime(medTime, totalAreas).toFixed(2), this.configs.Cards[2].Text_2, 3);
        //@ts-ignore
        this.cardAjust(this.configs.Cards[3].Title, (medPages).toFixed(2), this.configs.Cards[3].Text_1, this.calcDeviationPages(medPages, totalAreas).toFixed(2), this.configs.Cards[3].Text_2, 4);
    }

    //As cards are an separate component, it's necessary to passa the data for them, so this methods split to each card
    private cardAjust(cardName: string, cardValue: string, info: string, extraInfo: string, extraValue: string, cardOpt) {
        var lista: string[] = [];

        lista.push(cardName);
        lista.push(cardValue);
        lista.push(info);
        lista.push(extraInfo);
        lista.push(extraValue);

        if (cardOpt == 1)
            this.card1 = lista;
        else if (cardOpt == 2)
            this.card2 = lista;
        else if (cardOpt == 3)
            this.card3 = lista;
        else
            this.card4 = lista;
    }

    //Method that fill the axis of charts
    private fillAxis() {
        this.axisNamesBullet = [];
        this.axisNamesBar = [];

        //@ts-ignore
        this.configs.Charts[1].Legends.forEach(element => {
            this.axisNamesBar.push(element.Value);
        });

        //@ts-ignore
        this.configs.Charts[0].Legends.forEach(element => {
            this.axisNamesBullet.push(element.Value);
        });

        this.colors = [];
        this._dados.getColorsConfig().forEach(element => {
            this.colors.push(element.Value);
        });
    }

    //Method that ajust the data for the bullet chart
    private bulletAjust() {
        var arr;
        this.bulletChart = [];

        this.areasData.forEach(element => {
            arr = [];
            arr.push(element["Name"]);
            arr.push(element["Clients"].length);
            this.bulletChart.push(arr);
        });

    }

    //Method that ajust the data for the pie chart
    private pieAjust() {
        var arr: any[], cont;
        this.pieChart = [];
        this.areasData.forEach(element => {
            console.log(element)
            arr = [];
            cont = 0;
            element["Clients"].forEach(data => {
                cont += data["QtdEvents"];
            });

            arr.push(element["Name"]);
            arr.push(cont);
            this.pieChart.push(arr);
        });
    }

    //Method that ajust the data for the donut chart
    private donutAjust() {
        var arr: any;
        this.donutChart = [];
        this.areasData.forEach(element => {
            //console.log(element)
            arr = [];
            arr.push(element["Name"]);
            arr.push(element["Clients"].length);
            this.donutChart.push(arr);
        });
    }

    //Method that ajust the data for the bar chart
    private barAjust() {
        var arr;
        this.barChart = [];

        this.areasData.forEach(element => {
            arr = [];
            arr.push(element["Name"]);
            arr.push(element["Time"] / element["Clients"].length);
            this.barChart.push(arr);
        });
    }

    //Method that calculate the deviation on time
    private calcDeviationTime(medium, total) {
        var deviation = 0;
        this.areasData.forEach(element => {
            deviation += Math.pow(element["Time"] - medium, 2);
        });

        deviation /= total;
        deviation = Math.pow(deviation, 1 / 2);

        return deviation;
    }

    //Method that calculate the deviation on Clients
    private calcDeviationClients(medium, total) {
        var deviation = 0;

        this.areasData.forEach(element => {
            deviation += Math.pow(element["Clients"].length - medium, 2);
        });

        deviation /= total;
        deviation = Math.pow(deviation, 1 / 2);

        return deviation;
    }

    //Method that calculate the deviation on Pages
    private calcDeviationPages(medium, total) {
        var deviation = 0, test: boolean, lengthEvents;
        var events: any[];
        var arr: any[];

        events = [];

        this.clientsData.forEach(element => {
            test = false;
            lengthEvents = element["Pages"].length;
            events.forEach(data => {
                if (data[0] == lengthEvents) {
                    data[1]++;
                    test = true;
                }
            });

            if (!test) {
                arr = [];
                arr.push(lengthEvents);
                arr.push(1);
                events.push(arr);
            }
        });

        events.forEach(element => {
            deviation += Math.pow(element[0] - medium, 2) * element[1];
        });

        deviation /= total;
        deviation = Math.pow(deviation, 1 / 2);

        return deviation;
    }

    //Method that calculate the deviation on events
    private calcDeviationEvents(medium, total) {
        var deviation = 0, test: boolean, lengthEvents;
        var events: any[];
        var arr: any[];

        events = [];

        this.areasData.forEach(element => {
            test = false;
            lengthEvents = element["Events"].length;
            events.forEach(data => {
                if (data[0] == lengthEvents) {
                    data[1]++;
                    test = true;
                }
            });

            if (!test) {
                arr = [];
                arr.push(lengthEvents);
                arr.push(1);
                events.push(arr);
            }
        });

        events.forEach(element => {
            deviation += Math.pow(element[0] - medium, 2) * element[1];
        });

        deviation /= total;
        deviation = Math.pow(deviation, 1 / 2);

        return deviation;

    }

    private areasAccess(clientsData: any[]) {
        var areas = 0;
        clientsData.forEach(element => {
            areas += element["Pages"].length;
        });

        return areas / clientsData.length;
    }
}
