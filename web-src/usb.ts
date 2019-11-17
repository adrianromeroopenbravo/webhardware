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

export interface USBPrinterType {
  vendorId: number;
  productId: number;
}

export class USB implements WebDevice {
  printertype: USBPrinterType;
  device: USBDevice | null;

  constructor(printertype: USBPrinterType) {
    this.printertype = printertype;
    this.device = null;

    if (navigator.usb && navigator.usb.addEventListener) {
      navigator.usb.addEventListener(
        'disconnect',
        (event: USBConnectionEvent) => {
          if (event.device === this.device) {
            this.onDisconnected();
          }
        }
      );
    }
  }

  connected(): boolean {
    return this.device !== null;
  }

  async request(): Promise<void> {
    if (!navigator.usb || !navigator.usb.requestDevice) {
      throw 'USB not supported.';
    }

    this.device = await navigator.usb.requestDevice({
      filters: [
        {
          vendorId: this.printertype.vendorId,
          productId: this.printertype.productId
        }
      ]
    });
  }

  async sendData(data: Uint8Array): Promise<void> {
    if (!this.device) {
      throw 'Device is not connected.';
    }
    try {
      await this.device.open();

      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);
      await arrays8print(this.printChunk(), 64, data);
      await this.device.close();
    } catch (error) {
      this.onDisconnected();
      throw error;
    }
  }

  printChunk(): PrintChunk {
    return async (chunk: Uint8Array) => {
      if (this.device === null) {
        throw 'device is null';
      }
      await this.device.transferOut(1, chunk.buffer);
    };
  }

  onDisconnected(): void {
    this.device = null;
  }
}
