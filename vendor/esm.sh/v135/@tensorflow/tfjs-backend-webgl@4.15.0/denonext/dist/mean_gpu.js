/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/mean_gpu) denonext production */
import{util as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var s=class{constructor(l,a){this.variableNames=["x"];let{windowSize:t,batchSize:d,inSize:u,outSize:h}=l;this.outputShape=[d,h];let c=Math.floor(t/4)*4,i=t%4,e="sumValue += dot(values, ones);";if(a!=null){let n=1/a;e=`sumValue += dot(values * ${x.isInt(n)?n.toPrecision(2):n}, ones);`}let o="";u%t>0&&(o=`
        if (inIdx < 0 || inIdx >= ${u}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${o}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${t};

        float sumValue = 0.0;

        for (int i = 0; i < ${c}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${e}
        }

        int inIdx = inOffset + ${c};
        if (${i===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${e}
        } else if (${i===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${e}
        } else if (${i===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${e}
        }
        setOutput(sumValue);
      }
    `}};export{s as MeanProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/mean_gpu.js:
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
//# sourceMappingURL=mean_gpu.js.map