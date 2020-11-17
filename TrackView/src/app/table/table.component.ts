import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {

  @Input()
  private dados: any[] = [];
  private headElements = ["Nome ", "Valor"];
  constructor() { }

  ngOnChanges() {
  }
}
