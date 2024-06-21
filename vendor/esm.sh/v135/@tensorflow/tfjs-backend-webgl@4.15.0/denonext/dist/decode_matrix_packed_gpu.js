/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/decode_matrix_packed_gpu) denonext production */
import{getGlslDifferences as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/glsl_version.js";import{useShapeUniforms as o}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import*as e from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";import{PackingScheme as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/tex_util.js";var i=class{constructor(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=n.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let r=s();this.outputShape=t,this.enableShapeUniforms=o(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?e.getOutputLogicalCoordinatesFromFlatIndexByUniform(["r","c","d"],t):e.getLogicalCoordinatesFromFlatIndex(["r","c","d"],t)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${r.output} = result;
      }
    `}};export{i as DecodeMatrixPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/decode_matrix_packed_gpu.js:
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
//# sourceMappingURL=decode_matrix_packed_gpu.js.map