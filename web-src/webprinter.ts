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

import { PrinterType, WebDevice } from './printertype';
import { arrays8append } from './typedarrays';

const ESCPOS = {
  encoderText: new TextEncoder(),
  NEW_LINE: new Uint8Array([0x0d, 0x0a]),
  PARTIAL_CUT_1: new Uint8Array([0x1b, 0x69]),

  CHAR_SIZE_0: new Uint8Array([0x1d, 0x21, 0x00]),
  CHAR_SIZE_1: new Uint8Array([0x1d, 0x21, 0x01]),
  CHAR_SIZE_2: new Uint8Array([0x1d, 0x21, 0x30]),
  CHAR_SIZE_3: new Uint8Array([0x1d, 0x21, 0x31]),

  BOLD_SET: new Uint8Array([0x1b, 0x45, 0x01]),
  BOLD_RESET: new Uint8Array([0x1b, 0x45, 0x00]),
  UNDERLINE_SET: new Uint8Array([0x1b, 0x2d, 0x01]),
  UNDERLINE_RESET: new Uint8Array([0x1b, 0x2d, 0x00]),

  CENTER_JUSTIFICATION: new Uint8Array([0x1b, 0x61, 0x01]),
  LEFT_JUSTIFICATION: new Uint8Array([0x1b, 0x61, 0x00]),
  RIGHT_JUSTIFICATION: new Uint8Array([0x1b, 0x61, 0x02]),

  DRAWER_OPEN: new Uint8Array([0x1b, 0x70, 0x00, 0x32, -0x06])
};

export class WEBPrinter {
  webdevice: WebDevice;

  constructor(printertype: PrinterType) {
    this.webdevice = printertype.createWebDevice();
  }

  connected() {
    return this.webdevice.connected();
  }

  async request() {
    await this.webdevice.request();
  }

  async print(doc: string): Promise<void> {
    const parser: DOMParser = new DOMParser();
    const dom: Document = parser.parseFromString(doc, 'application/xml');

    if (dom.documentElement.nodeName === 'parsererror') {
      throw 'Error while parsing XML template.';
    }

    const printerdocs: Uint8Array = await this.processDOM(dom);
    if (printerdocs.length > 0) {
      await this.webdevice.sendData(printerdocs);
    }
  }

  async processDOM(dom: Document): Promise<Uint8Array> {
    for (let el of dom.children) {
      if (el.nodeName === 'output') {
        return await this.processOutput(el);
      }
    }
    return new Uint8Array();
  }

  async processOutput(dom: Element): Promise<Uint8Array> {
    let output = new Uint8Array();
    for (let el of dom.children) {
      if (el.nodeName === 'ticket') {
        output = arrays8append(output, await this.processTicket(el));
      } else if (el.nodeName === 'opendrawer') {
        output = arrays8append(output, ESCPOS.DRAWER_OPEN);
      }
    }
    return output;
  }

  async processTicket(dom: Element): Promise<Uint8Array> {
    let output = new Uint8Array();
    for (let el of dom.children) {
      if (el.nodeName === 'line') {
        output = arrays8append(output, await this.processLine(el));
        output = arrays8append(output, ESCPOS.NEW_LINE);
      }
    }
    output = arrays8append(output, ESCPOS.NEW_LINE);
    output = arrays8append(output, ESCPOS.NEW_LINE);
    output = arrays8append(output, ESCPOS.NEW_LINE);
    output = arrays8append(output, ESCPOS.NEW_LINE);
    output = arrays8append(output, ESCPOS.PARTIAL_CUT_1);
    return output;
  }

  async processLine(dom: Element): Promise<Uint8Array> {
    let output: Uint8Array = new Uint8Array();
    const fontsize: string | null = dom.getAttribute('size');

    if (fontsize === '1') {
      output = arrays8append(output, ESCPOS.CHAR_SIZE_1);
    } else if (fontsize === '2') {
      output = arrays8append(output, ESCPOS.CHAR_SIZE_2);
    } else if (fontsize === '3') {
      output = arrays8append(output, ESCPOS.CHAR_SIZE_3);
    } else {
      output = arrays8append(output, ESCPOS.CHAR_SIZE_0);
    }
    for (let el of dom.children) {
      if (el.nodeName === 'text') {
        const txt = el.textContent;

        if (txt) {
          const bold = el.getAttribute('bold');
          const uderline = el.getAttribute('underline');

          if (bold === 'true') {
            output = arrays8append(output, ESCPOS.BOLD_SET);
          }
          if (uderline === 'true') {
            output = arrays8append(output, ESCPOS.UNDERLINE_SET);
          }
          output = arrays8append(output, ESCPOS.encoderText.encode(txt));
          if (bold === 'true') {
            output = arrays8append(output, ESCPOS.BOLD_RESET);
          }
          if (uderline === 'true') {
            output = arrays8append(output, ESCPOS.UNDERLINE_RESET);
          }
        }
      }
    }
    return output;
  }
}
