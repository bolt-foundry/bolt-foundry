/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/dilation_gpu) denonext production */
var i=class{constructor(t){this.variableNames=["x","W"],this.outputShape=t.outShape;let{inHeight:e,inWidth:o,padInfo:n,strideHeight:a,strideWidth:s,filterHeight:r,filterWidth:h,dilationHeight:d,dilationWidth:l}=t,{top:c,left:f}=n;this.userCode=`
      const ivec2 strides = ivec2(${a}, ${s});
      const ivec2 pads = ivec2(${c}, ${f});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${r}; h++) {
          int hIn = hBeg + h * ${d};

          if (hIn >= 0 && hIn < ${e}) {
            for (int w = 0; w < ${h}; w++) {
              int wIn = wBeg + w * ${l};

              if (wIn >= 0 && wIn < ${o}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}};export{i as Dilation2DProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/dilation_gpu.js:
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
//# sourceMappingURL=dilation_gpu.js.map