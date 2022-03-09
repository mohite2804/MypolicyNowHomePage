import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-managemotor-loader',
  templateUrl: './managemotor-loader.component.html',
  styleUrls: ['./managemotor-loader.component.css']
})
export class ManagemotorLoaderComponent implements OnInit {

  @Input() loaderActive: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
