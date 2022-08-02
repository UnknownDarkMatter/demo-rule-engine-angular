import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './components/main-header/main-header-component';
import { MainPageComponent } from './pages/main-page/main-page-component';
import { GuiManager } from './business/gui-manager';
import { AppEngine } from './business/app-engine';
import { AppLoader } from './business/app-loader';
import { PackmanService } from './business/packman/packman-service';
import { GuiBlockComponent } from './components/gui-block/gui-block.component';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainPageComponent,
    GuiBlockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [GuiManager, AppEngine, AppLoader, PackmanService],
  bootstrap: [AppComponent]
})
export class AppModule { }
