/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/flags) denonext production */
import __Process$ from "node:process";
import"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import*as r from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/device_util.js";import{env as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/environment.js";var e=a();e.registerFlag("DEBUG",()=>!1,t=>{t&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});e.registerFlag("IS_BROWSER",()=>r.isBrowser());e.registerFlag("IS_NODE",()=>typeof __Process$<"u"&&typeof __Process$.versions<"u"&&typeof __Process$.versions.node<"u");e.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));e.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));e.registerFlag("PROD",()=>!1);e.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>e.getBool("DEBUG"));e.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);e.registerFlag("IS_TEST",()=>!1);e.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>e.getBool("DEBUG"));e.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);e.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);e.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);
/*! Bundled license information:

@tensorflow/tfjs-core/dist/flags.js:
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
//# sourceMappingURL=flags.js.map