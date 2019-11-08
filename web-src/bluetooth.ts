/*
 ************************************************************************************
 * Copyright (C) 2019 Openbravo S.L.U.
 * Licensed under the Apache Software License version 2.0
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to  in writing,  software  distributed
 * under the License is distributed  on  an  "AS IS"  BASIS,  WITHOUT  WARRANTIES  OR
 * CONDITIONS OF ANY KIND, either  express  or  implied.  See  the  License  for  the
 * specific language governing permissions and limitations under the License.
 ************************************************************************************
 */

import { PrintChunk, arrays8print } from './printerchunk';
import { WebDevice } from './printertype';

export interface BTPrinterType {
  services: string[];
  characteristic: string;
  buffersize: number;
}
export class Bluetooth implements WebDevice {
  printertype: BTPrinterType;
  size: number;
  device: BluetoothDevice | null;
  server: BluetoothRemoteGATTServer | null;
  service: BluetoothRemoteGATTService | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;

  constructor(printertype: BTPrinterType) {
    this.printertype = printertype;
    this.size = this.printertype.buffersize;
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
  }

  connected(): boolean {
    return this.device !== null;
  }

  async request(): Promise<void> {
    if (!navigator.bluetooth || !navigator.bluetooth.requestDevice) {
      return Promise.reject('Bluetooth not supported.');
    }

    this.device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: this.printertype.services
        }
      ]
    });
  }

  async sendData(data: Uint8Array): Promise<void> {
    if (!this.device || !this.device.gatt) {
      throw 'Device is not connected.';
    }

    try {
      if (this.characteristic) {
        await arrays8print(this.printChunk(), this.size, data);
      } else {
        this.server = await this.device.gatt.connect();
        this.service = await this.server.getPrimaryService(
          this.printertype.services[0]
        );
        this.characteristic = await this.service.getCharacteristic(
          this.printertype.characteristic
        );
        await arrays8print(this.printChunk(), this.size, data);
      }
    } catch (error) {
      this.onDisconnected();
      throw error;
    }
  }

  printChunk(): PrintChunk {
    return async (chunk: Uint8Array) => {
      if (this.characteristic === null) {
        throw 'device is null';
      }
      await this.characteristic.writeValue(chunk);
    };
  }

  onDisconnected() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
  }
}
