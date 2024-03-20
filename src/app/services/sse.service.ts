import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, catchError, delay, throwError } from 'rxjs';
import environment from 'src/environments/environment';
import { queryParams } from '../config/convertObjectToQuery';
import { decodeFromBase64 } from '../config/encryption';
import { getMerchant } from '../config/getMerchantData';
import { ResponseData } from '../models/response.model';
import { storage } from '../config/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource!: EventSource;
  responseSubject$: Subject<ResponseData> = new Subject<ResponseData>();

  constructor (private router: Router, private zone: NgZone) { }

  connect(url: string, params?: any): Observable<ResponseData> {
    const merchant = getMerchant();

    if (!merchant) {
      return throwError(() => new Error('No Merchant selected!'));
    }

    const auth = { auth: storage.get('auth') };
    const newParams = { ...params, ...auth, merchantID: merchant.merchantID };

    this.eventSource = new EventSource(environment.apiUrl + url + queryParams(newParams));

    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        this.responseSubject$.next(decodeFromBase64(event.data));
      });
    };

    this.eventSource.onerror = (error) => {
      console.error(error);
      this.eventSource.close();
      this.zone.run(() => {
        return throwError(() => new Error('Connection interrupted'));
      });
    };

    return this.responseSubject$.asObservable().pipe(
      delay(500),
      catchError(error => {
        console.error('SSE Error:', error);

        if (error.status && error.status === 401) {
          storage.remove('auth');
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }

  disconnect() {
    if (!this.eventSource) return;
    this.eventSource.close();
  }
}
