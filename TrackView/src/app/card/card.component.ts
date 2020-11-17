import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnChanges {


  @Input()
  private strings:string[]

  constructor() { }

  ngOnChanges() {
    this.attStrings();
  }

  attStrings(){
    if(!this.strings)
      return;
  }

}
