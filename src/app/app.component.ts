import { Component } from '@angular/core';
import { AppLoader } from './business/app-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private appLoader: AppLoader) {
    this.appLoader.loadApp();
   }
}
