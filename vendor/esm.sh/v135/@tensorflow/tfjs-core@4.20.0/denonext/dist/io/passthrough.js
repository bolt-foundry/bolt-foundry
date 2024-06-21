/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/passthrough) denonext production */
var t=class{constructor(o){this.modelArtifacts=o}load(){return this.modelArtifacts}},n=class{constructor(o){this.saveHandler=o}save(o){return this.saveHandler(o)}},l=class{constructor(o){o.load&&(this.load=()=>Promise.resolve(o.load())),o.save&&(this.save=r=>Promise.resolve(o.save(r)))}};function u(e,o,r,a){let s=arguments;return new l(i(...s))}function i(e,o,r,a){return arguments.length===1?e.modelTopology!=null||e.weightSpecs!=null?new t(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new t({modelTopology:e})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new t({modelTopology:e,weightSpecs:o,weightData:r,trainingConfig:a}))}function f(e){return new n(e)}function m(e){return new n(e)}export{u as fromMemory,i as fromMemorySync,f as withSaveHandler,m as withSaveHandlerSync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/passthrough.js:
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
//# sourceMappingURL=passthrough.js.map