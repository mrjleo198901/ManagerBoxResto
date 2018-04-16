import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-pipe-render',
  template: `{{ renderValue | number : '1.2-2'}}`
})
export class PipeRenderComponent implements OnInit {

  public renderValue;
  @Input() value;

  constructor() { }

  ngOnInit() {
    this.renderValue = this.value;
  }

}
