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

import { Bluetooth } from './bluetooth';
import { PrinterType } from './printertype';

export const BTGENERIC: PrinterType = {
  name: 'Generic Bluetooth Receipt Printer',
  createWebDevice: () =>
    new Bluetooth({
      services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2'],
      characteristic: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
      buffersize: 20
    })
};
