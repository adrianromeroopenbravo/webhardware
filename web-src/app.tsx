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

export interface AppProps {}

export interface AppState {
  data: string[];
}

export class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);

    this.state = {
      data:[]
    };

    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    console.log('Hello  ');
  }

  render(): JSX.Element {
    return <button onClick={this.handleClick}>Press me</button>;
  }
}
