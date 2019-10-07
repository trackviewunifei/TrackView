import { Injectable } from '@angular/core';
import { BehaviorSubject} from'rxjs'
import { AngularNeo4jService } from 'angular-neo4j';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  private dados = new BehaviorSubject("");
  dadoAtual = this.dados.asObservable();
  
  private query;
  private url = 'bolt://footstep.io::7687';
  private username = 'neo4j';
  private password = 'senha';
  private encrypted = false;

  private clientsData:any[] = [];
  private dadosClientes:any[] = [];
  private dadosQuestionarios:any[] = [];
  private consultaEventos: string = "match (u:User)-[t:TRIGGERED]->(e:Event)-[i:IN]->(p:Page) match (e:Event)-[o:ON]->(l:Element) with u.client_id as cliente, e.date_str as data, l order by data where e.date_str <= '2019-10-25' and e.date_str >= '2019-10-02' and p.id = 'guilheeeeeeerme.github.io/footstep' return cliente, collect([data, l.id, l.tag_classes]) as dados";

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
          response = this.neo4j.run(this.query);
        }catch(err){
          console.log(err);
        }finally{
          //this.neo4j.disconnect();
        }
    return response;
  }

  closeConnection(){
    this.neo4j.disconnect();
  }

  async obtemDados(){
    
    if(this.clientsData.length != 0)
      return this.clientsData;

    this.dadosClientes = await this.getDados(this.consultaEventos);
    await this.leituraRespostasQuestionario();
    await this.leituraEventos();
    return this.clientsData;
  }

  private async leituraRespostasQuestionario(){
    var objects:any[] = [];
    var obj;
    await d3.csv("../../assets/areasForm.csv").then((data)=> {//Le o csv
      data.forEach(element => {//para cada elemento vindo do csv ira
        obj = new Object();
        obj["AreaAtuacao"] = element.AreaAtuacao;
        obj["Area"] = this.particionaPalavra(element.Area, ";");
        obj["Technology"] = this.particionaPalavra(element.Technology, ";");
        obj['Client'] = this.particionaPalavra(element.Client, ";");
        obj["Perfil"] = this.particionaPalavra(element.Perfil, ";");
        objects.push(obj);  
      }); 
    });
    this.dadosQuestionarios = objects;
    //console.log(objects);
  }

  private async leituraEventos(){
    this.clientsData = new Array();
    var obj, i = 0;
    await d3.csv("../../assets/formsGoogle.csv").then((data)=> {//Le o csv
      data.forEach(element => {//para cada elemento vindo do csv ira
        //replace(/[\\"]/g, ''); possivel necessidade disso depois
        var array = this.separaEventosArea(element.Name);
        if(array != null){
          obj = new Object();
          obj["Time"] = element.Timestamp;
          obj["Name"] = element.Name;
          obj["Area"] = this.particionaPalavra(element.Area, ";");
          //obj["Technology"] = this.particionaPalavra(element.Technology, ";");
          //obj["Client"] = this.particionaPalavra(element.Client, ";");
          //obj["Perfil"] = this.particionaPalavra(element.Perfil, ";");
          obj["EventArea"] = array;
          obj["Coherence"] = this.classificaQuestoes(array, obj["Area"], this.particionaPalavra(element.Technology, ";"),this.particionaPalavra(element.Client, ";"), this.particionaPalavra(element.Perfil, ";"));
          obj["CoherenceValue"] = this.calcCoherence(obj["Coherence"]);
          obj["InfoEvents"] = this.info_events(obj["Name"]);
          this.clientsData.push(obj);
          i++;
        }
      }); 
    });
  }

  private particionaPalavra(palavra:string, split:string){
    var stringSplit: string[] = palavra.split(split);
    var item:string[] = [];
    stringSplit.forEach(element => {
      item.push(element);
    });
    return item;
  }

  private separaEventosArea(clientName: string){
    var events:any[] = []
    var i, j, tamanhoClientes = this.dadosClientes.length, tamanhoEventos;
    var inicio = "", fim = "";
    var obj, element;
    for(j = 0; j < tamanhoClientes; j++)
      if(this.dadosClientes[j][0].includes(clientName))
        break;
    
    if(j == tamanhoClientes)
      return null;

    //for(var j = 0; j < tamanhoClientes; j++){
      element = this.dadosClientes[j][1];
      tamanhoEventos = element.length;
      //console.log(element + " Tamanho: "+ tamanhoEventos);
      for(i = 0; i < tamanhoEventos; i++){
        obj = new Object();
        if(inicio == "" && element[i][1].includes("portfolio") && i+1 < tamanhoEventos && this.dadosClientes[j][1][i+1][1].includes("Modal"))
          inicio = element[i][0];
        
        if(inicio != "" && element[i][1].includes("Modal")){
          if(i+1 > tamanhoEventos || (i+1 < tamanhoEventos && !this.dadosClientes[j][1][i+1][1].includes("Modal"))){
            fim = element[i][0];
            obj["inicio"] = inicio;
            obj["fim"] = fim;
            obj["area"] = this.convertModal_Area(element[i][1]);
            
            events.push(obj);
            inicio = ""; 
          }
        }
      //}
    }

    return events;
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

  private classificaQuestoes(events, area, tech, client, perfil){
    var areasAcessadas:string[] = [];
    var chosenAreas:any[] = [];
    var i, obj;

    events.forEach(element => {//obtem os nomes das areas acessadas nos eventos para o comparativo
      if(!areasAcessadas.includes(element.area))
        areasAcessadas.push(element.area);
    });

    area.forEach(element =>{//irá percorrer as areas selecionadas no questionário
      i = 0;
      if(areasAcessadas.includes(element))//se houver relação das áreas selecionadas com as que ele acessou, adiciona 1 senão 0
        i = 1;

      obj = new Object();//Criar um vetor de objetos que contém todas as áreas e coerências dessas áreas, começa a prenche-lo com as áreas
      obj["area"] = element;
      obj['coherenceArea'] = i;
      obj["coherenceTech"] = 0;
      obj["coherenceClient"] = 0;
      obj["coherencePerfil"] = 0;
      chosenAreas.push(obj);
    });

    chosenAreas.forEach(element => {//para cada área irá obter a coerência com relação as respostas
      this.dadosQuestionarios.forEach(data=>{//Percorre os dados que dizem respeito a página, com relação a área e clientes/tecnologias/perfil
        if(data["Area"].includes(element["area"])){
          i = 0;
          data["Technology"].forEach(element => {//Se perceber que a tecnologia que escolheu está nas da área irá incrementa o acerto
            if(tech.includes(element))
              i++;
          });

          element["coherenceTech"] = i/data["Technology"].length;//Após analisar todos irá calcular a coerencia
          i = 0;

          data["Client"].forEach(element => {//repete o processo para os demais
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

  private calcCoherence(chosenAreas){
    var coherence = 0;

    chosenAreas.forEach(element => {
      coherence += element["coherenceArea"] * 0.2;
      coherence += element["coherenceTech"] * 0.3;
      coherence += element["coherenceClient"] * 0.2;
      coherence += element["coherencePerfil"] * 0.3;
    });

    coherence /= chosenAreas.length;
    return coherence;
  }

  private info_events(clientName: string){
    var j, tamanhoClientes = this.dadosClientes.length, length = 0;
    var obj = new Object();
    for(j = 0; j < tamanhoClientes; j++)
      if(this.dadosClientes[j][0].includes(clientName))
        break;
    length = this.dadosClientes[j][1].length;

    obj["firstEvent"] = this.dadosClientes[j][1][0][0];
    obj["lastEvent"] = this.dadosClientes[j][1][length-1][0];
    obj["eventsQuantity"] = length;
    
    return obj;
  }


}
