/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/confusion_matrix) denonext production */
import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{cast as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{matMul as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mat_mul.js";import{oneHot as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/one_hot.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{transpose as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/transpose.js";function h(a,p,t){let e=n(a,"labels","confusionMatrix"),r=n(p,"predictions","confusionMatrix");o.assert(t==null||t>0&&Number.isInteger(t),()=>`If provided, numClasses must be a positive integer, but got ${t}`),o.assert(e.rank===1,()=>`Expected the rank of labels to be 1, but got ${e.rank}`),o.assert(r.rank===1,()=>`Expected the rank of predictions to be 1, but got ${r.rank}`),o.assert(e.shape[0]===r.shape[0],()=>`Mismatch in the number of examples: ${e.shape[0]} vs. ${r.shape[0]}. Labels and predictions should have the same number of elements.`),o.assert(t>0&&Number.isInteger(t),()=>`numClasses is required to be a positive integer, but got ${t}`);let c=s(i(e,"int32"),t),u=s(i(r,"int32"),t),b=d(c),m=f(b,u);return i(m,"int32")}var H=l({confusionMatrix_:h});export{H as confusionMatrix,h as confusionMatrix_};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/confusion_matrix.js:
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
//# sourceMappingURL=confusion_matrix.js.map