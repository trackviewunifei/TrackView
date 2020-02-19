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
    this.getData();
  }

  private async getData(){
    var consulta = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-11-01' and e.date_str >= '2019-10-31T18' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";
    var dados = await this._dados.getDataSinglePageDash(consulta);//for some reason just get the values on the dash, doesn't work always, so getting before normally worked
  }

}
