/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/rand) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{sizeFromShape as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{assertNonNegativeIntegerDimensions as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{op as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function f(e,i,r){m(e);let n=a(e),o=null;if(r==null||r==="float32")o=new Float32Array(n);else if(r==="int32")o=new Int32Array(n);else if(r==="bool")o=new Uint8Array(n);else throw new Error(`Unknown data type ${r}`);for(let t=0;t<n;t++)o[t]=i();return l.makeTensor(o,e,r)}var A=s({rand_:f});export{A as rand};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/rand.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=rand.js.map