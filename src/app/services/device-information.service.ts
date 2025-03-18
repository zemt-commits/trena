import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { DeviceInfo } from '../models/device-info';

@Injectable({ providedIn: 'root' })
export class DeviceInformationService {


  private DEVICE_INFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
  private MODEL_NUMBER_UUID = '00002a24-0000-1000-8000-00805f9b34fb';
  private CHARACTERISTICS = {
    modelNumber: 0x2A24,
    serialNumber: 0x2A25,
    firmwareVersion: 0x2A26,
    hardwareVersion: 0x2A27,
    softwareVersion: 0x2A28,
    manufacturerName: 0x2A29,
  };

  constructor(private bluetoothService: BluetoothService) {}

  async getDeviceInformation(): Promise<DeviceInfo> {
    const deviceInfo: DeviceInfo = {};

    try {
      for (const [key, uuid] of Object.entries(this.CHARACTERISTICS)) {
        const characteristic = await this.bluetoothService.getCharacteristic(this.DEVICE_INFO_SERVICE, uuid);
        if (characteristic) {
          const value = await characteristic.readValue();
          (deviceInfo[key as keyof DeviceInfo] as string) = this.decodeString(value);
        }
      }

      deviceInfo.timestamp = new Date();
      deviceInfo.id = this.bluetoothService.device?.id;
      deviceInfo.name = this.bluetoothService.device?.name;
      deviceInfo.connected = this.bluetoothService.device?.gatt?.connected;

      console.log('📌 Device Info obtido:', deviceInfo);

      return deviceInfo;
    } catch (error) {
      console.error('Erro ao buscar Device Information:', error);
      throw error;
    }
  }

  async getModelNumber(device: BluetoothDevice): Promise<string> {
    try {
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(this.DEVICE_INFO_SERVICE);
      const characteristic = await service.getCharacteristic(this.MODEL_NUMBER_UUID);
      const value = await characteristic.readValue();
  
      const decoder = new TextDecoder('utf-8');
      const modelNumber = decoder.decode(value.buffer);
  
      console.log('📌 Model Number obtido:', modelNumber);
      return modelNumber;
    } catch (error) {
      console.error('Erro ao obter Model Number:', error);
      return 'Indisponível';
    }
  }
  async getAllDeviceInformation(device: BluetoothDevice): Promise<any> {
    console.log('🔍 Buscando informações do dispositivo:', device);
    const DEVICE_INFO_SERVICE = 'device_information';
    const characteristicsUUIDs = {
      modelNumber: '00002a24-0000-1000-8000-00805f9b34fb',
      serialNumber: '00002a25-0000-1000-8000-00805f9b34fb',
      firmwareRevision: '00002a26-0000-1000-8000-00805f9b34fb',
      hardwareRevision: '00002a27-0000-1000-8000-00805f9b34fb',
      softwareRevision: '00002a28-0000-1000-8000-00805f9b34fb',
      manufacturerName: '00002a29-0000-1000-8000-00805f9b34fb',
    };
  
    const decoder = new TextDecoder('utf-8');
    const deviceInfo: { [key: string]: string } = {};
  
    try {
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(DEVICE_INFO_SERVICE);
  
      for (const [key, uuid] of Object.entries(characteristicsUUIDs)) {
        try {
          const characteristic = await service.getCharacteristic(uuid);
          const value = await characteristic.readValue();
          deviceInfo[key] = decoder.decode(value.buffer);
        } catch (charError) {
          deviceInfo[key] = 'Não disponível';
          console.warn(`⚠️ Característica ${key} não disponível.`);
        }
      }
  
      console.log('✅ Device Info Completo:', deviceInfo);
      return deviceInfo;
  
    } catch (error) {
      console.error('Erro ao buscar informações do dispositivo:', error);
      throw error;
    }
  }
  
  

  private decodeString(value: DataView): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(value.buffer);
  }
}
