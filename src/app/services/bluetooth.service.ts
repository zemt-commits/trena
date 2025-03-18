import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  public device: BluetoothDevice | null = null;
  public server: BluetoothRemoteGATTServer | null = null;

  constructor() { }

  // Conecta ao dispositivo Bluetooth e retorna uma referência
  async connect(serviceUuids: BluetoothServiceUUID[]): Promise<void> {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, 
        optionalServices: serviceUuids
      });

      if (!this.device.gatt) {
        throw new Error('GATT não disponível.');
      }

      this.server = await this.device.gatt.connect();
      console.log('✅ Conectado ao dispositivo:', this.device.name);
    } catch (error) {
      console.error('❌ Erro ao conectar:', error);
    }
  }

  // Desconecta do dispositivo Bluetooth
  disconnect(): void {
    if (this.device && this.device.gatt && this.device.gatt.connected) {
      this.device.gatt.disconnect();
      console.log('🔌 Dispositivo desconectado');
    }
  }

  // Método genérico para obter um serviço específico
  async getService(serviceUuid: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService | null> {
    if (!this.server) {
      throw new Error('Servidor GATT não conectado.');
    }
    return this.server.getPrimaryService(serviceUuid);
  }

  // Método genérico para obter uma característica específica
  async getCharacteristic(serviceUuid: BluetoothServiceUUID, characteristicUuid: BluetoothCharacteristicUUID)
  : Promise<BluetoothRemoteGATTCharacteristic | null> {
    const service = await this.getService(serviceUuid);
    if (!service) return null;
    return service.getCharacteristic(characteristicUuid);
  }

  // Habilita notificações
  async enableNotifications(characteristic: BluetoothRemoteGATTCharacteristic, callback: (event: Event) => void) {
    characteristic.addEventListener('characteristicvaluechanged', callback);
    await characteristic.startNotifications();
    console.log('🔔 Notificações habilitadas para:', characteristic.uuid);
  }
}
