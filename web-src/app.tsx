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

import React, { Component } from 'react';
import { WEBPrinter } from './webprinter';
import { EPSONTMT88V } from './epsontmt88v';
import { BTGENERIC } from './btgeneric';

export interface AppProps {}

export interface AppState {
  text: string;
}

export class App extends Component<AppProps, AppState> {
  usbwebprinter: WEBPrinter;
  btwebprinter: WEBPrinter;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      text: `<?xml version="1.0" encoding="UTF-8"?>
  <output>
    <ticket>
    <line>
    <text>This is the first line</text>
    </line>  
    <line size="2">
    <text>This is the second line</text>
    </line>
    <line>
    <text>This is the second line</text>
    </line> 
    </ticket>
  </output>
    `
    };

    this.usbwebprinter = new WEBPrinter(EPSONTMT88V);
    this.btwebprinter = new WEBPrinter(BTGENERIC);
  }

  async printText(printer: WEBPrinter) {
    if (!printer.connected()) {
      await printer.request();
    }
    await printer.print(this.state.text);
  }

  async handleClickUSB(
    evt: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    await this.printText(this.usbwebprinter);
    alert('Success');
  }

  async handleClickBT(evt: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    try {
      await this.printText(this.btwebprinter);
      alert('Success.');
    } catch (error) {
      alert('Cannot print.');
    }
  }

  updateText(evt: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({
      text: evt.target.value
    });
  }

  render(): JSX.Element {
    return (
      <div>
        <h1>Openbravo Web Hardware</h1>
        <div>
          <button onClick={evt => this.handleClickUSB(evt)}>
            WebUSB print
          </button>
          <button onClick={evt => this.handleClickBT(evt)}>
            WebBluetooth print
          </button>
        </div>
        <div>
          <textarea onChange={evt => this.updateText(evt)} rows={30} cols={60}>
            {this.state.text}
          </textarea>
        </div>
      </div>
    );
  }
}
