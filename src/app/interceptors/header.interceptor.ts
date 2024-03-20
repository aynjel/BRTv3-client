import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, delay, map, tap, throwError } from 'rxjs';
import { decodeFromBase64, decryptData, encodeToBase64, generateKey, } from '../config/encryption';
import { Encryption } from '../models/encryption.model';
import environment from 'src/environments/environment';
import { getMerchant } from '../config/getMerchantData';
import { Router } from '@angular/router';
import { storage } from '../config/storage';

const checkURL = (url: string) => environment.apiUrl + 'request/merchants' === url; // Check url that do not require a Merchant
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor (private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requireMerchant = checkURL(request.url);
    const merchant = getMerchant();
    let headers = this.generateHeaders(request);

    if (requireMerchant) { // Select Merchant
      const data = environment.production ? new HttpParams().set('data', encodeToBase64('.')) : new HttpParams();

      headers = headers.clone({
        params: data
      });
      return next.handle(headers).pipe(
        delay(500),
        catchError(error => {
          if (error.status && error.status === 401) {
            storage.remove('auth');
            this.router.navigate(['/unauthorized']);
          }

          return throwError(() => error);
        }),
        map(event => this.handleHttpEvents(event))
      );
    }

    if (!merchant) {
      return throwError(() => new Error('No Merchant selected!'));
    }

    switch (request.method) {
      case 'POST':
      case 'PUT':
        const payload = { ...request.body as {}, merchantID: merchant.merchantID };
        headers = headers.clone({
          body: environment.production ? { payload: encodeToBase64(payload) } : payload
        });
        break;
      case 'GET':
      case 'DELETE':
        // const params = headers.params
        const params = headers.params.append('merchantID', merchant.merchantID);

        const data = environment.production ? new HttpParams().set('data', encodeToBase64(params.toString())) : params;

        headers = headers.clone({
          params: data
        });
        break;
      default: return throwError(() => new Error('No request applied!'));
    }

    return next.handle(headers).pipe(
      delay(800),
      catchError(error => {
        if (error.status && error.status === 401) {
          storage.remove('auth');
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      }),
      map((event) => this.handleHttpEvents(event))
    );
  }

  private generateHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Authorization', `Basic ${storage.get('auth')}`),
    });
  }

  private handleHttpEvents(event: HttpEvent<any>) {
    if (event instanceof HttpResponse && typeof event.body === 'string') {
      const decodedResponse = environment.production ? decodeFromBase64(event.body) : event.body;
      console.log(event.url, decodedResponse);

      return event.clone({ body: decodedResponse });
    }

    return event;
  }
}
