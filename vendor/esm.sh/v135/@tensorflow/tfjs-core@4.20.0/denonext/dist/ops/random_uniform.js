/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/random_uniform) denonext production */
import{assertNonNegativeIntegerDimensions as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{buffer as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/buffer.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{UniformRandom as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/rand_util.js";function p(n,t=0,e=1,m="float32",f){s(n);let o=a(n,m),i=new u(t,e,null,f);for(let r=0;r<o.values.length;r++)o.values[r]=i.nextValue();return o.toTensor()}var U=l({randomUniform_:p});export{U as randomUniform};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/random_uniform.js:
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
//# sourceMappingURL=random_uniform.js.map