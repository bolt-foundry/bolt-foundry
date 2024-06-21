/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/stack) denonext production */
import{ENGINE as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Pack as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensorArray as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function f(s,o=0){let t=c(s,"tensors","stack","string_or_numeric");r.assert(t.length>=1,()=>"Pass at least one tensor to tf.stack"),t.length>0&&r.assert(o<=t[0].rank,()=>"Axis must be <= rank of the tensor");let n=t,e={axis:o};return a.runKernel(i,n,e)}var g=m({stack_:f});export{g as stack};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/stack.js:
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
//# sourceMappingURL=stack.js.map