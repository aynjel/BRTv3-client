import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CacheService } from "../services/cache.service";
import { Observable, catchError, of, tap, throwError } from "rxjs";

const cacheDuration = 1; // Cache Duration (minute)

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor (private cacheService: CacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') return next.handle(req);

    const cachedResponse = this.cacheService.load(req.url);
    if (!!cachedResponse) return of(new HttpResponse({ body: cachedResponse }));

    const updatedRequest = req.clone({
      headers: req.headers.set('Content-Type', 'application/json')
    });

    console.log('api request:', updatedRequest);

    return next.handle(req).pipe(
      tap(ev => {
        if (ev instanceof HttpResponse) {
          console.log(ev);

          console.log(req.url);
          console.log(ev.body);

          // this.cacheService.save(req.url, ev.body, cacheDuration);
        }
      }),
      catchError(
        (error: HttpErrorResponse): Observable<any> => {
          console.error(error);

          // we expect 404, it's not a failure for us.
          if (error.status === 404) {
            // return of(null);
            console.log('not found');

          } else if (error.status === 401) {
            // redirect to login
            console.log('unauthorized');

          }

          // other errors we don't know how to handle and throw them further.
          return throwError(() => error);
        },
      ),
    );
  }
}
