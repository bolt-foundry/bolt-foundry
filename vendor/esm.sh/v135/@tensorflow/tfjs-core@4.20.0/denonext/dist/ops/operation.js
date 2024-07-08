/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/operation) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{isPromise as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";var p="__op";function u(r){let o=Object.keys(r);if(o.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${o.length} keys.`);let e=o[0],s=r[e];e.endsWith("_")&&(e=e.substring(0,e.length-1)),e=e+p;let i=(...c)=>{n.startScope(e);try{let t=s(...c);return a(t)&&console.error("Cannot return a Promise inside of tidy."),n.endScope(t),t}catch(t){throw n.endScope(null),t}};return Object.defineProperty(i,"name",{value:e,configurable:!0}),i}export{p as OP_SCOPE_SUFFIX,u as op};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/operation.js:
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
//# sourceMappingURL=operation.js.map