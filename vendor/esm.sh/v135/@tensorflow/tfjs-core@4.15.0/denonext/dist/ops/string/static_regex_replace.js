/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/string/static_regex_replace) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{StaticRegexReplace as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function m(t,e,r,o=!0){let c=a(t,"input","staticRegexReplace","string"),n={pattern:e,rewrite:r,replaceGlobal:o};return i.runKernel(p,{x:c},n)}var g=s({staticRegexReplace_:m});export{g as staticRegexReplace};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/string/static_regex_replace.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=static_regex_replace.js.map