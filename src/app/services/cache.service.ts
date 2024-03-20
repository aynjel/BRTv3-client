import { Injectable } from '@angular/core';
import { currentDate } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [key: string]: any; } = {};

  save(key: string, data: any, expirationMins: number) {
    const expirationTime = currentDate.getTime() + expirationMins * 60 * 1000;
    const cached = { data, expirationTime };
    this.cache[key] = cached;
  }

  load(key: string): unknown {
    if (!this.cache[key]) return null;

    const { data, expirationTime } = this.cache[key];
    if (expirationTime < currentDate.getTime()) return null;

    return data;
  }
}
