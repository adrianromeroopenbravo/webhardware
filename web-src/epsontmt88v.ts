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

import { USB } from './usb';
import { PrinterType } from './printertype';

export const EPSONTMT88V: PrinterType = {
  name: 'EPSON TM T88V',
  createWebDevice: () =>
    new USB({
      vendorId: 0x04b8,
      productId: 0x0202
    })
};
