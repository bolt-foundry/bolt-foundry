/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/pad_gpu) denonext production */
import{getCoordsDataType as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var i=class{constructor(s,e,l){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=e.map((o,a)=>o[0]+s[a]+o[1]);let u=s.length,t=d(u),n=e.map(o=>o[0]).join(","),r=e.map((o,a)=>o[0]+s[a]).join(","),c=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,u);if(u===1){this.userCode=`
        int start = ${n};
        int end = ${r};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${t} start = ${t}(${n});
      ${t} end = ${t}(${r});

      void main() {
        ${t} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${t} coords = outC - start;
          setOutput(getX(${c}));
        }
      }
    `}};export{i as PadProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/pad_gpu.js:
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
//# sourceMappingURL=pad_gpu.js.map