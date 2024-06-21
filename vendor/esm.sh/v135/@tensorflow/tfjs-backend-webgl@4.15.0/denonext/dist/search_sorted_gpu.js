/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/search_sorted_gpu) denonext production */
import{env as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var t=class{constructor(e,i,o,n){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,o];let a="while (left < right) {",u=`for (int i = 0; i < ${Math.ceil(Math.log2(i+1))}; ++i) { if (left >= right) break;`,s=r().getNumber("WEBGL_VERSION")===2?a:u,l=n==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${s}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${l} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}};export{t as SearchSortedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/search_sorted_gpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=search_sorted_gpu.js.map