import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-landign-page-old',
  templateUrl: './landign-page-old.component.html',
  styleUrls: ['./landign-page-old.component.css']
})
export class LandignPageOldComponent implements OnInit {

  mainJsPath = environment.mainJsPath;
  constructor() {
    this.loadScripts();
  }

  ngOnInit(): void {
  }

  loadScripts() {
    //const externalScriptArray = ['/assets/front/js/main.js'];
    const externalScriptArray = [this.mainJsPath];
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }

}
