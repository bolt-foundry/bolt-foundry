/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/globals) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{env as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/environment.js";import{setDeprecationWarningFn as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor.js";import{getTensorsInContainer as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";function f(){t().set("PROD",!0)}function x(){t().set("DEBUG",!0)}function m(){t().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function c(e){t().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}i(c);function l(){n.disposeVariables()}function k(){return n}function B(){return n.memory()}function b(e){return n.profile(e)}function g(e,r){return n.tidy(e,r)}function E(e){a(e).forEach(o=>o.dispose())}function N(e){return n.keep(e)}function D(e){return n.time(e)}function y(e){return n.setBackend(e)}function w(){return n.ready()}function A(){return n.backendName}function I(e){n.removeBackend(e)}function P(e){return n.findBackend(e)}function W(e){return n.findBackendFactory(e)}function R(e,r,o=1){return n.registerBackend(e,r,o)}function v(){return n.backend}function F(e,r){t().setPlatform(e,r)}export{v as backend,c as deprecationWarn,m as disableDeprecationWarnings,E as dispose,l as disposeVariables,x as enableDebugMode,f as enableProdMode,k as engine,P as findBackend,W as findBackendFactory,A as getBackend,N as keep,B as memory,b as profile,w as ready,R as registerBackend,I as removeBackend,y as setBackend,F as setPlatform,g as tidy,D as time};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/globals.js:
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
//# sourceMappingURL=globals.js.map