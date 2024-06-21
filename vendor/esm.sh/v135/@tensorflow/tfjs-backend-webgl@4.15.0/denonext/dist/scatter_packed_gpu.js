/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/scatter_packed_gpu) denonext production */
import{getCoordsDataType as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var c=class{constructor(l,e,s,n,i,o,m=!0,a=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=o;let u=r(i.length),p=r(o.length),t="";s===1?t="i":s===2&&(t="i, j");let x=`getIndices(${t})`,d="";n===1?d="i":n===2&&(d="i, coords[1]");let $=`getUpdates(${d})`,f="";a&&(f="coords[0], coords[1]");let v=`getDefaultValue(${f})`,I=e>1?"strides[j]":"strides",g=e>1?"strides[j + 1]":"strides";this.userCode=`
        ${u} strides = ${u}(${i});

        void main() {
          ${p} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${l}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${e}; j+=2) {
              ivec4 index = round(${x});
              flattenedIndex += index.xz * ${I};
              if (j + 1 < ${e}) {
                flattenedIndex += index.yw * ${g};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${$};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${v}, sum, found));
        }
      `}};export{c as ScatterPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/scatter_packed_gpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=scatter_packed_gpu.js.map