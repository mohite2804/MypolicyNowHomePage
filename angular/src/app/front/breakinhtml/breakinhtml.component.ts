import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breakinhtml',
  templateUrl: './breakinhtml.component.html',
  styleUrls: ['./breakinhtml.component.css']
})
export class BreakinhtmlComponent implements OnInit {

  @Input('policy_subtype_label') policy_subtype_label: any;
  @Input('is_breakin') is_breakin: any;
  @Input('selected_product_type_id') selected_product_type_id: any;


  constructor() { }

  ngOnInit(): void {
  }

}
