import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class FrontInterceptor implements HttpInterceptor {

  constructor(public router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let user_token : any = sessionStorage.getItem('user_token');
    if (sessionStorage.getItem('isUserLoggedin')) {
			request = this.addToken(request,user_token);
    }else{
      	request = this.addToken(request,user_token);
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>, token : string ){
    return request = request.clone({
      setHeaders: {
        Authorization: `Bearer `+ token
      }
    });

  }

  // private addToken(request: HttpRequest<any>, token : string ){
  //   return request = request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer SQD5SNtPDuOBg6dg6JCBZLOPFB1H1Xxe2teADjyEj9TsBdHxvVzWoWSCoEMn`

  //     }
  //   });

  // }
}
