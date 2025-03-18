import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { MeasurementsComponent } from './measurements/measurements.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceInfoComponent,
    MeasurementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
