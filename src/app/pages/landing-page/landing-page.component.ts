import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { storage } from 'src/app/config/storage';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  imagePath = 'assets/img/BRT.png';

  isLoading = false;

  constructor (private activatedRoute: ActivatedRoute) {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   const user = decodeFromBase64(params['data']);
    //   console.log(params);
    //   console.log(user);

    // });
  }

  ngOnInit() {
    if (storage.get('done')) {
      this.navigateTo('/dashboard');
    }
  }

  navigateTo(path: string) {
    this.isLoading = true;
    storage.set('done', true);

    setTimeout(() => {
      this.isLoading = false;
      window.location.href = path;
    }, 1000);
  }
}
