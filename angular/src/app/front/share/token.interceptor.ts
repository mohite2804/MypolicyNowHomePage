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
export class TokenInterceptor implements HttpInterceptor {

  constructor(public router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let user_token : any = sessionStorage.getItem('user_token');
    let admin_token : any = sessionStorage.getItem('admin_user_hib_token');
    if (sessionStorage.getItem('isUserLoggedin')) {
			request = this.addToken(request,user_token);

    }

    if (sessionStorage.getItem('isAdminLoggedin')) {
			request = this.addToken(request,admin_token);
      
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>, token : string ){       
    return request = request.clone({
      setHeaders: {  
        'Authorization': 'Bearer '+ token
       
        
      }

      
    });

  }

}
