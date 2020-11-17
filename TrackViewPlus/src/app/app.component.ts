import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './dados.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    constructor(private http: HttpClient, private neo4j: AngularNeo4jService, private _dados: DadosService) {
        this.insertDataFromAPI();
        this.getData();
    }

    private async getData() {
        var consulta = "match (u: Event) with u.event_client_id as cliente, u.event_date_str as data, u order by data return cliente, collect([data, u.element_id, u.tag_classes]) as dados"
        var consultaOriginal = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-11-01' and e.date_str >= '2019-10-31T18' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
        var dados = await this._dados.getDataSinglePageDash(consulta);//for some reason just get the values on the dash, doesn't work always, so getting before normally worked
    }

    private async insertDataFromAPI() {
        var query = "LOAD CSV WITH HEADERS FROM " +
            "'https://footsteps.website/api/reports/InitialEventOnPage?page=1&limit=5000&format=csv' as row " +
            "MERGE (e:Event {event_id: row.`event.id`}) " +
            "SET " +
            "e.event_date_str = row.`event.date_str`, " +
            "e.event_dateLow = row.`event.date.low`, " +
            "e.event_dateHigh = row.`event.date.high`, " +
            "e.event_interaction_id = row.`event.interaction_id`, " +
            "e.event_event = row.`event.event`, " +
            "e.event_client_id = row.`event.client_id`, " +
            "e.event_mouse_position_topLow = row.`event.mouse_position_top.low`, " +
            "e.event_mouse_position_topHigh = row.`event.mouse_position_top.high`, " +
            "e.event_mouse_position_leftLow = row.`event.mouse_position_left.low`, " +
            "e.event_mouse_position_leftHigh = row.`event.mouse_position_left.high`, " +
            "e.element_parent_id = row.`element.parent_id`, " +
            "e.element_tag_offset_leftLow = row.`element.tag_offset_left.low`, " +
            "e.element_tag_offset_leftHigh = row.`element.tag_offset_left.high`, " +
            "e.element_tag_offset_topLow = row.`element.tag_offset_top.low`, " +
            "e.element_tag_offset_topHigh = row.`element.tag_offset_top.high`, " +
            "e.element_indexLow = row.`element.index.low`, " +
            "e.element_indexHigh = row.`element.index.high`, " +
            "e.element_tag = row.`element.tag`, " +
            "e.element_id = row.`element.id`, " +
            "e.element_client_id = row.`element.client_id`, " +
            "e.element_tag_type = row.`element.tag_type`, " +
            "e.element_tag_classes = row.`element.tag_classes`, " +
            "e.element_tag_href = row.`element.tag_href`, " +
            "e.element_tag_id = row.`element.tag_id`, " +
            "e.page_host = row.`page.host`, " +
            "e.page_id = row.`page.id`, " +
            "e.page_uri = row.`page.uri`, " +
            "e.page_url = row.`page.url`, " +
            "e.page_client_id = row.`page.client_id` " +
            "RETURN count(e)"
            await this._dados.insertData(query);
            //this.fixData();
    }

    private async fixData() {
        var query = "MATCH (e:Event) WHERE e.id = 'event.id' DETACH DELETE e"
        await this._dados.removeWrongNode(query);
    }

}
