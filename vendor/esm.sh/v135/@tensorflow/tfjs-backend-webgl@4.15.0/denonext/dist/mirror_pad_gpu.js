/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/mirror_pad_gpu) denonext production */
import{getCoordsDataType as $}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var a=class{constructor(i,u,c){this.variableNames=["x"],this.outputShape=u.map((o,r)=>o[0]+i[r]+o[1]);let s=i.length,t=$(s),n=u.map(o=>o[0]).join(","),C=u.map((o,r)=>o[0]+i[r]).join(","),d=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,s),e=c==="reflect"?0:1;if(s===1){this.userCode=`
        int start = ${n};
        int end = ${C};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${e};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${e};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${t} start = ${t}(${n});
      ${t} end = ${t}(${C});

      void main() {
        ${t} outC = getOutputCoords();
        for (int i = 0; i < ${s}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${e};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${e};
          }
        }
        ${t} coords = outC - start;
        setOutput(getX(${d}));
      }
    `}};export{a as MirrorPadProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/mirror_pad_gpu.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=mirror_pad_gpu.js.map