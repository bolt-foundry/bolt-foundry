/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/lrn_gpu) denonext production */
var r=class{constructor(i,a,d,c,o){this.variableNames=["x"],this.outputShape=[];let e=a,l=i[3]-1;this.outputShape=i;let t,s=`float(${d}) + float(${c}) * sum`;o===.5?t=`inversesqrt(${s})`:o===1?t=`1.0/(${s})`:t=`exp(log(${s}) * float(-${o}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${e}; j <= ${e}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${l}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${t};
        setOutput(val);
      }
    `}};export{r as LRNProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/lrn_gpu.js:
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
//# sourceMappingURL=lrn_gpu.js.map