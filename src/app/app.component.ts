import { Component } from '@angular/core';
import { BluetoothService } from './services/bluetooth.service';
import { DeviceInformationService } from './services/device-information.service';
import { DeviceInfo } from './models/device-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trena-boch';
  deviceInfo?: any;


  constructor(
    private bluetoothService: BluetoothService,
    private deviceInformationService: DeviceInformationService

  ) {}

  async connect2() {
    await this.bluetoothService.connect([
      '02a6c0d0-0451-4000-b000-fb3210111989',
      '02a6c0f0-0451-4000-b000-fb3210111989',
      //'02a6c0d0-0451-4000-b000-fb3210111989',
      //'02a6c0d1-0451-4000-b000-fb3210111989',
      'device_information'
     // 0x180A // <--- use hexadecimal diretamente
    ]);
    

    //this.deviceInfo = await this.deviceInformationService.getDeviceInformation();
   // this.deviceInfo = await this.deviceInformationService.getDeviceInformation();
    this.deviceInfo = await this.deviceInformationService.getModelNumber(this.bluetoothService.device!); // Ensure getModelNumber returns a string
    //NimBLEUUID svcUUID = NimBLEUUID("02a6c0d0-0451-4000-b000-fb3210111989");
     //NimBLEUUID charUUID = NimBLEUUID("02a6c0d1-0451-4000-b000-fb3210111989");
  }

  async connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['device_information']
      });
  
      console.log('Dispositivo selecionado:', device.name);
  
      // Busca todas as informações de uma só vez
      this.deviceInfo = await this.deviceInformationService.getAllDeviceInformation(device);
  
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  }
}
