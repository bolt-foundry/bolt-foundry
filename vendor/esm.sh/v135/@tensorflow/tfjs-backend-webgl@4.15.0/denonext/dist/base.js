/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/base) denonext production */
import{device_util as e,registerBackend as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MathBackendWebGL as o}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/backend_webgl.js";import{version as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/version.js";export*from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl.js";import{forceHalfFloat as t}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl.js";e.isBrowser()&&r("webgl",()=>new o,2);var s={forceHalfFloat:t};export{n as version_webgl,s as webgl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/base.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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
//# sourceMappingURL=base.js.map