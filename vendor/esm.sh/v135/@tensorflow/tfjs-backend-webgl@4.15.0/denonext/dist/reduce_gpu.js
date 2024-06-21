/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/reduce_gpu) denonext production */
var d=class{constructor(c,a){this.variableNames=["x"];let{windowSize:n,batchSize:x,inSize:s,outSize:$}=c;this.outputShape=[x,$];let i="0.0",u="";a==="prod"?i="1.0":a==="min"?(i="1.0 / 1e-20",u="min"):a==="max"&&(i="-1.0 / 1e-20",u="max");let t=`${a}(${a}(${a}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;a==="sum"?t="sumValue":a==="prod"?t="prodValue":a==="all"?t="allValue":a==="any"&&(t="anyValue");let V=Math.floor(n/4)*4,o=n%4,e=`
      if (${a==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${a==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${u}(values, minMaxValue);
        if (${a==="min"} || ${a==="max"}) {
          minMaxValue = ${u}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,l="vec4";a==="all"?(i="1.0",e=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,l="bvec4"):a==="any"&&(i="0.0",e=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,l="bvec4");let f="";s%n>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${i};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        vec4 minMaxValue = vec4(${i});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${V}; i += 4) {
          int inIdx = inOffset + i;
          ${l} values = ${l}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${e}
        }

        int inIdx = inOffset + ${V};
        if (${o===1}) {
          ${l} values = ${l}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${e}
        } else if (${o===2}) {
          ${l} values = ${l}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${e}
        } else if (${o===3}) {
          ${l} values = ${l}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${e}
        }
        setOutput(${t});
      }
    `}};export{d as ReduceProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/reduce_gpu.js:
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
//# sourceMappingURL=reduce_gpu.js.map