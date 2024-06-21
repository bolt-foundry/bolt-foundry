/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/avg_pool_backprop_gpu) denonext production */
var n=class{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;let o=t.filterHeight,s=t.filterWidth,a=t.strideHeight,l=t.strideWidth,y=t.dilationHeight,h=t.dilationWidth,i=t.effectiveFilterHeight,e=t.effectiveFilterWidth,C=i-1-t.padInfo.top,d=e-1-t.padInfo.left,r=1/(o*s);this.userCode=`
      const ivec2 pads = ivec2(${C}, ${d});
      const float avgMultiplier = float(${r});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${i};
            wR += ${y}) {
          float dyR = float(dyRCorner + wR) / ${a}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${e};
            wC+= ${h}) {
            float dyC = float(dyCCorner + wC) / ${l}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}},f=class{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;let o=t.filterDepth,s=t.filterHeight,a=t.filterWidth,l=t.strideDepth,y=t.strideHeight,h=t.strideWidth,i=t.dilationDepth,e=t.dilationHeight,C=t.dilationWidth,d=t.effectiveFilterDepth,r=t.effectiveFilterHeight,c=t.effectiveFilterWidth,u=d-1-t.padInfo.front,R=r-1-t.padInfo.top,$=c-1-t.padInfo.left,g=1/(o*s*a);this.userCode=`
      const ivec3 pads = ivec3(${u}, ${R}, ${$});
      const float avgMultiplier = float(${g});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${d};
            wD += ${i}) {
          float dyD = float(dyDCorner + wD) / ${l}.0;

          if (dyD < 0.0 || dyD >= ${t.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${r};
              wR += ${e}) {
            float dyR = float(dyRCorner + wR) / ${y}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${c};
                wC += ${C}) {
              float dyC = float(dyCCorner + wC) / ${h}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};export{n as AvgPool2DBackpropProgram,f as AvgPool3DBackpropProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/avg_pool_backprop_gpu.js:
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
//# sourceMappingURL=avg_pool_backprop_gpu.js.map