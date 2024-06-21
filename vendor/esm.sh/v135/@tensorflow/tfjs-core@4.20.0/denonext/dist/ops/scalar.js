/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/scalar) denonext production */
import{isTypedArray as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{makeTensor as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor_ops_util.js";function m(r,n){if((e(r)&&n!=="string"||Array.isArray(r))&&n!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(n==="string"&&e(r)&&!(r instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return a(r,[],[],n)}export{m as scalar};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/scalar.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=scalar.js.map