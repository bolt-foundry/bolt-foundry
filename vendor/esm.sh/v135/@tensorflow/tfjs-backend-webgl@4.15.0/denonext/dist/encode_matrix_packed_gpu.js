/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/encode_matrix_packed_gpu) denonext production */
import{getGlslDifferences as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/glsl_version.js";import{useShapeUniforms as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import*as l from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";var f=class{constructor(s,u=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];let a=n();this.outputShape=s,this.enableShapeUniforms=c(this.outputShape.length);let r="",i="result";u&&(i="floor(result * 255. + 0.5)");for(let e=0;e<=1;e++)for(let t=0;t<=1;t++){let o=e*2+t;r+=`
          localCoords = coords;
          if(localCoords[2] + ${t} < ${this.enableShapeUniforms?"outShape[2]":`${s[2]}`}) {
          localCoords[2] += ${t};
          if (localCoords[1] + ${e} < ${this.enableShapeUniforms?"outShape[1]":`${s[1]}`}) {
            localCoords[1] += ${e};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${a.texture2D}(A, uv);

            if (offset == 0) {
              result[${o}] = values[0];
            } else if (offset == 1) {
              result[${o}] = values[1];
            } else if (offset == 2) {
              result[${o}] = values[2];
            } else {
              result[${o}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?l.getFlatIndexFrom3DOutput():l.getFlatIndexFrom3D(s)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${r}

          ${a.output} = ${i};
        }
    `}};export{f as EncodeMatrixPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/encode_matrix_packed_gpu.js:
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
//# sourceMappingURL=encode_matrix_packed_gpu.js.map