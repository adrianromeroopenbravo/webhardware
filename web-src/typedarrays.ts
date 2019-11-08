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

export function arrays8append(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  const tmp = new Uint8Array(a1.length + a2.length);
  tmp.set(a1, 0);
  tmp.set(a2, a1.byteLength);
  return tmp;
}
