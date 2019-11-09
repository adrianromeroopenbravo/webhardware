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
  <line size="2">
    <text>Lorem ipsum</text>
  </line>
  <line>
    <text>dolor sit amet,</text>
  </line>  
  <line>
    <text>consectetur adipiscing elit,</text>
  </line>  
  <line>
    <text>do eiusmod </text>
    <text bold="true">tempor incididunt</text>
  </line>
  <line>
    <text>ut </text>
    <text underline="true">labore et dolore</text>
    <text> magna aliqua.</text>
  </line> 
  </ticket>
</output>`
    };

    this.usbwebprinter = new WEBPrinter(EPSONTMT88V);
    this.btwebprinter = new WEBPrinter(BTGENERIC);
  }

  async printText(printer: WEBPrinter) {
    try {
      if (!printer.connected()) {
        await printer.request();
      }
      await printer.print(this.state.text);
      alert('Success.');
    } catch (error) {
      alert('Cannot print.');
    }
  }

  async handleClickUSB(
    evt: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    await this.printText(this.usbwebprinter);
  }

  async handleClickBT(evt: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    await this.printText(this.btwebprinter);
  }

  updateText(evt: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({
      text: evt.target.value
    });
  }

  render(): JSX.Element {
    return (
      <div>
        <h1 className="title">Openbravo Web Hardware</h1>
        <div>
          <button className="action" onClick={evt => this.handleClickUSB(evt)}>
            PRINT (WebUSB)
          </button>
          <button className="action" onClick={evt => this.handleClickBT(evt)}>
            PRINT (WebBluetooth)
          </button>
        </div>
        <div>
          <textarea
            className="document-editor"
            onChange={evt => this.updateText(evt)}
            rows={30}
            cols={40}
          >
            {this.state.text}
          </textarea>
        </div>
      </div>
    );
  }
}
