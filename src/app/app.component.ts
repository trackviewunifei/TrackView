import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel, MyDataModel, LineModel } from 'src/app/data/data.model';
import { AngularNeo4jService } from 'angular-neo4j';
import { DadosService } from './dados.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TrackView';

  data: Observable<DataModel>;
  myData: Observable<MyDataModel>;
  lineData: Observable<LineModel>;
  
  consulta: string = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return pag.name, count(r) as numProdutos";
  consulta1: string = "match(p:person)-[rel:access]->(pa:page) where pa.name = 'Main' or pa.name ='Search' return pa.name, rel.time_in, rel.time_out";
  
  private dados:any[] = [];
  
  dash1:boolean = true;
  dash2:boolean = false;
  dash3:boolean = false;

  constructor(private http: HttpClient, private neo4j: AngularNeo4jService, private _dados: DadosService) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.myData = this.http.get<MyDataModel>('./assets/mydata.json');
    this.lineData = this.http.get<LineModel>('./assets/line.json');
    this.obtemDados();
  }

  private async obtemDados(){
    this.dados = await this._dados.getDados(this.consulta);
    this._dados.closeConnection();
  }
  
  onChange(event){
    if(event.target.value == "Dashboard 1"){
      this.dash1 = true;
      this.dash2 = false;
      this.dash3 = false;
      this.consulta = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return pag.name, count(r) as numProdutos";
    }else if(event.target.value == "Dashboard 2"){
      this.dash1 = false;
      this.dash2 = true;
      this.dash3 = false; 
      this.consulta = "match (p:product)<-[r:search_for|pays_for|saw]-(pag:page)return p.name, count(r) as numPesquisa";
    }else if(event.target.value == "Dashboard 3"){
      this.dash1 = false;
      this.dash2 = false;
      this.dash3 = true;
      this.consulta = "match (p:product)<-[re: pays_for]-(pag:page)return p.name, re.quantity*p.price  as ValorTotal";    
    }
    this.obtemDados();
  }

}
