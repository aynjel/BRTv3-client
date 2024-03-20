import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { storage } from './config/storage';

const hideHeaderPages = ['notFound', 'login', 'home', 'unauthorized', 'print'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showHeader = false;
  loading: boolean = false;

  constructor(private router: Router) {
    // if (!storage.get('done')) {
    //   this.router.navigate(['/home']);
    // }
  }

  private navigationInterceptor(event: RouterEvent) {
    switch (true) {
      case event instanceof NavigationStart:
        console.log('start');

        this.loading = true;
        break;
      case event instanceof NavigationEnd:
      case event instanceof NavigationCancel:
      case event instanceof NavigationError:
        console.log('end');

        this.loading = false;
        break;
      default:
        break;
    }
  }

  checkPage() {
    const currentUrl = this.router.url;
    const hideHeader = hideHeaderPages.some(page => currentUrl.includes(page));
    return hideHeader;
  }
}
