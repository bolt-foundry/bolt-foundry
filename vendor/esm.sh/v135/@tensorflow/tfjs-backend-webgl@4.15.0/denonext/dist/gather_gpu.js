/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/gather_gpu) denonext production */
import{getCoordsDataType as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var r=class{constructor(o,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;let e=i(this.rank),s=d(o,2);this.userCode=`
      void main() {
        ${e} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${o[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${s}));
      }
    `}};function d(n,o){let t=["resRC.x","resRC.y","resRC.z","resRC.w"],e=[];for(let s=0;s<n.length;s++)s===2?e.push("index"):e.push(`${t[s]}`);return e.join()}export{r as GatherProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/gather_gpu.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=gather_gpu.js.map