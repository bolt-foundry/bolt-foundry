/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/encode_matrix_gpu) denonext production */
import{getGlslDifferences as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/glsl_version.js";import{useShapeUniforms as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import*as o from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";var p={R:0,G:1,B:2,A:3},r=class{constructor(l,n=!1,e="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];let s=u();this.outputShape=l,this.enableShapeUniforms=h(this.outputShape.length);let a="result";n&&(a="floor(result * 255. + 0.5)");let i="";for(let t=0;t<e.length;t++){let f=e[t];i+=`
          if(offset == ${t}) {
            result = values[${p[f]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?o.getFlatIndexFrom3DOutput():o.getFlatIndexFrom3D(l)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${e.length});

        flatIndex = idiv(flatIndex, ${e.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${s.texture2D}(A, uv);
          ${i}
        }
        ${s.output} = vec4(${a}, 0., 0., 0.);
      }
    `}};export{r as EncodeMatrixProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/encode_matrix_gpu.js:
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
//# sourceMappingURL=encode_matrix_gpu.js.map