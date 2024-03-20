import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../models/auth.model';
import { HttpService } from './http.service';
import { storage } from '../config/storage';
import { decodeFromBase64 } from '../config/encryption';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private httpService: HttpService) { }

}
