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
export class AdminInterceptor implements HttpInterceptor {

  constructor(public router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let admin_token : any = sessionStorage.getItem('admin_user_hib_token');
    if (sessionStorage.getItem('isAdminLoggedin')) {
			request = this.addToken(request,admin_token);
    }
    return next.handle(request);
  }

  /*private addToken(request: HttpRequest<any>, token : string ){       
    return request = request.clone({
      setHeaders: {  
        'Authorization': `Bearer `+ token,
        'Content-Type': `application/json`  
      }
    });

  }*/

  private addToken(request: HttpRequest<any>, token : string ){       
    return request = request.clone({
      setHeaders: {  
        Authorization: `Bearer SQD5SNtPDuOBg6dg6JCBZLOPFB1H1Xxe2teADjyEj9TsBdHxvVzWoWSCoEMn`
        
      }
    });

  }
}
