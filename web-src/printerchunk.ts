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

export type PrintChunk = (data: Uint8Array) => Promise<void>;

export async function arrays8print(
  printChunk: PrintChunk,
  size: number,
  data: Uint8Array
) {
  for (let i = 0; i < data.length; i += size) {
    await printChunk(data.slice(i, i + size));
  }
}
