/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/kernel_registry) denonext production */
import{env as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/environment.js";import{getGlobal as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/global_util.js";import*as c from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/log.js";var o=g("kernelRegistry",()=>new Map),i=g("gradRegistry",()=>new Map);function w(e,r){let t=a(e,r);return o.get(t)}function x(e){return i.get(e)}function k(e){let r=o.entries(),t=[];for(;;){let{done:n,value:s}=r.next();if(n)break;let[f,l]=s,[d]=f.split("_");d===e&&t.push(l)}return t}function p(e){let{kernelName:r,backendName:t}=e,n=a(r,t);o.has(n)&&c.warn(`The kernel '${r}' for backend '${t}' is already registered`),o.set(n,e)}function b(e){let{kernelName:r}=e;i.has(r)&&u().getBool("DEBUG")&&c.warn(`Overriding the gradient for '${r}'`),i.set(r,e)}function $(e,r){let t=a(e,r);if(!o.has(t))throw new Error(`The kernel '${e}' for backend '${r}' is not registered`);o.delete(t)}function m(e){if(!i.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);i.delete(e)}function K(e,r){k(e).forEach(n=>{let s=Object.assign({},n,{backendName:r});p(s)})}function a(e,r){return`${r}_${e}`}export{K as copyRegisteredKernels,x as getGradient,w as getKernel,k as getKernelsForBackend,b as registerGradient,p as registerKernel,m as unregisterGradient,$ as unregisterKernel};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/kernel_registry.js:
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
//# sourceMappingURL=kernel_registry.js.map