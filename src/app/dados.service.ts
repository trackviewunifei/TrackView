import { Injectable } from '@angular/core';
import {BehaviorSubject} from'rxjs'
import { AngularNeo4jService } from 'angular-neo4j';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  private dados = new BehaviorSubject("");
  dadoAtual = this.dados.asObservable();
  
  private query;
  private url = 'bolt://localhost:7687';
  private username = 'admin';
  private password = 'admin';
  private encrypted = false;


  constructor(private neo4j: AngularNeo4jService) { }

  mudaDados(dadoNovo: any){
    this.dados.next(dadoNovo);
  }
  
  async getDados(consulta:string){
    this.query = consulta;
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
          response = await this.neo4j.run(this.query);
          //this.neo4j.disconnect();
        }catch(err){
          console.log(err);
        }finally{
          //this.neo4j.disconnect();
        }
        
    //this.neo4j.disconnect();
    return response;
  }

  closeConnection(){
    this.neo4j.disconnect();
  }
}
