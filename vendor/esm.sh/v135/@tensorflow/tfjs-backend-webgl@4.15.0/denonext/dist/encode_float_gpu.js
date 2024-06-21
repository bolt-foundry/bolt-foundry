/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/encode_float_gpu) denonext production */
import{getGlslDifferences as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/glsl_version.js";import{ENCODE_FLOAT_SNIPPET as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";import{TextureUsage as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/tex_util.js";var t=class{constructor(e){this.variableNames=["A"],this.outTexUsage=i.DOWNLOAD;let o=s();this.outputShape=e,this.userCode=`
      ${r}

      void main() {
        float x = getAAtOutCoords();
        ${o.output} = encode_float(x);
      }
    `}};export{t as EncodeFloatProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/encode_float_gpu.js:
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
//# sourceMappingURL=encode_float_gpu.js.map