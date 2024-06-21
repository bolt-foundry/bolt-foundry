/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/scatter_gpu) denonext production */
import{getCoordsDataType as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var f=class{constructor(a,i,s,o,d,n,h=!0,p=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=n;let u=r(d.length),c=r(n.length),t="";s===1?t="i":s===2&&(t="i, j");let $=`getIndices(${t})`,e="";o===1?e="i":o===2&&(e="i, coords[1]");let g=`getUpdates(${e})`,l="";p&&(l="coords[0], coords[1]");let m=`getDefaultValue(${l})`,x=i>1?"strides[j]":"strides";this.userCode=`
        ${u} strides = ${u}(${d});

        void main() {
          ${c} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${a}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${i}; j++) {
              int index = round(${$});
              flattenedIndex += index * ${x};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${g};
              found = true;
            }
          }
          setOutput(mix(${m}, sum, float(found)));
        }
      `}};export{f as ScatterProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/scatter_gpu.js:
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
//# sourceMappingURL=scatter_gpu.js.map