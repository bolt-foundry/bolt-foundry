/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/resize_nearest_neighbor_backprop_gpu) denonext production */
var h=class{constructor(u,n,t){this.variableNames=["dy"],this.outputShape=[],this.outputShape=n;let[,c,f]=n,[,o,e]=u,i=[t&&o>1?c-1:c,t&&e>1?f-1:f],a=[t&&o>1?o-1:o,t&&e>1?e-1:e],s=i[0]/a[0],d=i[1]/a[1],l=1/s,r=1/d,y=Math.ceil(l)*2+2,w=Math.ceil(r)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${s});
        const float widthScale = float(${d});

        const float invHeightScale = float(${l});
        const float invWidthScale = float(${r});

        const int winHeight = int(${y});
        const int winWidth = int(${w});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${o}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${e}) {
              continue;
            }

            float sourceFracRow =
              float(${i[0]}) *
                (float(dyR) / float(${a[0]}));

            float sourceFracCol =
                float(${i[1]}) *
                  (float(dyC) / float(${a[1]}));

            int sourceNearestRow = int(min(
                float(int(${c}) - 1),
                ${t} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${f}) - 1),
                ${t} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}};export{h as ResizeNearestNeigborBackpropProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_backprop_gpu.js:
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
//# sourceMappingURL=resize_nearest_neighbor_backprop_gpu.js.map