/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/conv_gpu) denonext production */
var g=class{constructor(e,a=!1,s=null,o=!1,x=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;let l=e.padInfo.top,c=e.padInfo.left,C=e.strideHeight,h=e.strideWidth,w=e.dilationHeight,n=e.dilationWidth,R=e.filterHeight,u=e.filterWidth,t=Math.floor(e.inChannels/4)*4,i=e.inChannels%4,d=e.dataFormat==="channelsLast",W=d?1:2,V=d?2:3,F=d?3:1,r="",$="";s&&(o?r=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:x?r=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:r=`
          float activation(float x) {
            ${s}
          }
        `,$="result = activation(result);");let f=a?"result += getBiasAtOutCoords();":"";a&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),x&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${r}

      const ivec2 strides = ivec2(${C}, ${h});
      const ivec2 pads = ivec2(${l}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${F}];

        ivec2 xRCCorner =
            ivec2(coords[${W}], coords[${V}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${R}; wR++) {
          int xR = xRCorner + wR * ${w};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${u}; wC++) {
            int xC = xCCorner + wC * ${n};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${t}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${d}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${i===1}) {

              if (${d}) {
                dotProd +=
                    getX(batch, xR, xC, ${t}) *
                    getW(wR, wC, ${t}, d2);
              } else {
                dotProd +=
                    getX(batch, ${t}, xR, xC) *
                    getW(wR, wC, ${t}, d2);
              }

            } else if (${i===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${t}, d2),
                getW(wR, wC, ${t} + 1, d2)
              );

              if (${d}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${t}),
                  getX(batch, xR, xC, ${t} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${t}, xR, xC),
                  getX(batch, ${t} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${i===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${t}, d2),
                getW(wR, wC, ${t} + 1, d2),
                getW(wR, wC, ${t} + 2, d2)
              );

              if (${d}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${t}),
                  getX(batch, xR, xC, ${t} + 1),
                  getX(batch, xR, xC, ${t} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${t}, xR, xC),
                  getX(batch, ${t} + 1, xR, xC),
                  getX(batch, ${t} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${f}
        ${$}
        setOutput(result);
      }
    `}},p=class{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;let a=e.padInfo.front,s=e.padInfo.top,o=e.padInfo.left,x=e.strideDepth,l=e.strideHeight,c=e.strideWidth,C=e.dilationDepth,h=e.dilationHeight,w=e.dilationWidth,n=e.filterDepth,R=e.filterHeight,u=e.filterWidth,t=Math.floor(e.inChannels/4)*4,i=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${x}, ${l}, ${c});
      const ivec3 pads = ivec3(${a}, ${s}, ${o});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${n}; wF++) {
          int xF = xFCorner + wF * ${C};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${R}; wR++) {
            int xR = xRCorner + wR * ${h};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${u}; wC++) {
              int xC = xCCorner + wC * ${w};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${t}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${i===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${t}) *
                  getW(wF, wR, wC, ${t}, d2);
              } else if (${i===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${t}),
                  getX(batch, xF, xR, xC, ${t} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${t}, d2),
                  getW(wF, wR, wC, ${t} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${i===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${t}),
                  getX(batch, xF, xR, xC, ${t} + 1),
                  getX(batch, xF, xR, xC, ${t} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${t}, d2),
                  getW(wF, wR, wC, ${t} + 1, d2),
                  getW(wF, wR, wC, ${t} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}};export{g as Conv2DProgram,p as Conv3DProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/conv_gpu.js:
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
//# sourceMappingURL=conv_gpu.js.map