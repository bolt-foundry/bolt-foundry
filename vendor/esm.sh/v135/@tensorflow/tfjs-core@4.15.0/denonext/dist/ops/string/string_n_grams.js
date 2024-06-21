/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/string/string_n_grams) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{StringNGrams as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as G}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function w(n,o,i,e,m,p,d,f){let t=a(n,"data","stringNGrams","string");if(t.dtype!=="string")throw new Error("Data must be of datatype string");if(t.shape.length!==1)throw new Error(`Data must be a vector, saw: ${t.shape}`);let r=a(o,"dataSplits","stringNGrams");if(r.dtype!=="int32")throw new Error("Data splits must be of datatype int32");let c={separator:i,nGramWidths:e,leftPad:m,rightPad:p,padWidth:d,preserveShortSequences:f},g={data:t,dataSplits:r},s=l.runKernel(u,g,c);return{nGrams:s[0],nGramsSplits:s[1]}}var y=G({stringNGrams_:w});export{y as stringNGrams};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/string/string_n_grams.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=string_n_grams.js.map