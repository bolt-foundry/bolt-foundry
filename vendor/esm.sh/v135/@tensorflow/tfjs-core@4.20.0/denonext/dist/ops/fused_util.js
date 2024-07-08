/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/fused_util) denonext production */
import*as t from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/broadcast_util.js";import{elu as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/elu.js";import{leakyRelu as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/leaky_relu.js";import{mul as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{prelu as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/prelu.js";import{relu as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/relu.js";import{relu6 as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/relu6.js";import{reshape as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{sigmoid as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sigmoid.js";import{step as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/step.js";import{sum as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sum.js";function _(r,e,o){if(o==null||o==="linear")return r;if(o==="relu")return s(r,g(e));throw new Error(`Cannot compute gradient for fused activation ${o}.`)}function $(r,e){let o=e,u=t.getReductionAxes(r.shape,e.shape);return u.length>0&&(o=h(o,u)),i(o,r.shape)}function b(r,e,o,u){if(e==="linear")return r;if(e==="relu")return m(r);if(e==="elu")return l(r);if(e==="relu6")return p(r);if(e==="prelu")return f(r,o);if(e==="leakyrelu")return n(r,u);if(e==="sigmoid")return d(r);throw new Error(`Unknown fused activation ${e}.`)}var B=(r,e)=>!(r>0)||e==="linear";export{b as applyActivation,$ as getFusedBiasGradient,_ as getFusedDyActivation,B as shouldFuse};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/fused_util.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=fused_util.js.map