import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loaderadmin',
  templateUrl: './loaderadmin.component.html',
  styleUrls: ['./loaderadmin.component.css']
})
export class LoaderadminComponent implements OnInit {
  @Input() loaderActive: any;
  constructor() { }

  ngOnInit(): void {
  }

}
