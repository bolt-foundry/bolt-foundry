/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/pool_gpu) denonext production */
var M=class{constructor(t,e,u,p=!1,D=!1){if(this.variableNames=["x"],e==="avg"&&u)throw new Error("Cannot compute positions for average pool.");let c=t.filterWidth,d=t.strideHeight,h=t.strideWidth,C=t.dilationHeight,i=t.dilationWidth,$=t.effectiveFilterHeight,a=t.effectiveFilterWidth,V=t.padInfo.top,r=t.padInfo.left;this.outputShape=t.outShape;let x=e==="avg",g=`((batch  * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + d`,f=`(xR * ${t.inWidth} + xC) * ${t.inChannels} + d`,l="0.0";if(x||(l="-1.0 / 1e-20"),u){let R=">=";this.userCode=`
        const ivec2 strides = ivec2(${d}, ${h});
        const ivec2 pads = ivec2(${V}, ${r});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${$};
              wR += ${C}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${a};
                wC += ${i}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value ${R} currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${p?D?g:f:`wR * ${a} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let m="max",o=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(o="avgValue / max(count, 1.0)");let v=Math.floor(c/4)*4,s=c%4,n=`
      if (${x}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${m}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${d}, ${h});
      const ivec2 pads = ivec2(${V}, ${r});
      const float initializationValue = ${l};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${l});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${$};
            wR += ${C}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${t.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${v}; wC += 4) {
            int xC = xCCorner + wC * ${i};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${i}, d),
              getValue(batch, xR, xC + 2 * ${i}, d),
              getValue(batch, xR, xC + 3 * ${i}, d)
            );

            ${n}
          }

          int xC = xCCorner + ${v};
          if (${s===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${n}
          } else if (${s===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${i}, d),
              initializationValue,
              initializationValue
            );

            ${n}
          } else if (${s===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${i}, d),
              getValue(batch, xR, xC + 2 * ${i}, d),
              initializationValue
            );

            ${n}
          }
        }
        setOutput(${o});
      }
    `}},b=class{constructor(t,e,u,p=!1,D=!1){if(this.variableNames=["x"],e==="avg"&&u)throw new Error("Cannot compute positions for average pool.");let c=t.filterWidth,d=t.strideDepth,h=t.strideHeight,C=t.strideWidth,i=t.dilationDepth,$=t.dilationHeight,a=t.dilationWidth,V=t.effectiveFilterDepth,r=t.effectiveFilterHeight,x=t.effectiveFilterWidth,g=t.padInfo.front,f=t.padInfo.top,l=t.padInfo.left;this.outputShape=t.outShape;let m=e==="avg",o="0.0";if(m||(o="-1.0 / 1e-20"),u){let z=">=";this.userCode=`
        const ivec3 strides =
            ivec3(${d}, ${h}, ${C});
        const ivec3 pads = ivec3(${g}, ${f}, ${l});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${V};
              wD += ${i}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${t.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${r};
                wR += ${$}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${t.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${x};
                  wC += ${a}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${t.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value ${z} currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${p?D?`(((batch * ${t.inDepth} + xD) * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`((xD * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`wD * ${r} * ${x} +
                      wR * ${x} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let v="max",s=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(s="avgValue / max(count, 1.0)");let n=Math.floor(c/4)*4,R=c%4,w=`
      if (${m}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${v}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${d}, ${h}, ${C});
      const ivec3 pads = ivec3(${g}, ${f}, ${l});
      const float initializationValue = ${o};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${o});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${V};
            wD += ${i}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${t.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${r};
            wR += ${$}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${n}; wC += 4) {
              int xC = xCCorner + wC * ${a};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${a}, ch),
                getValue(batch, xD, xR, xC + 2 * ${a}, ch),
                getValue(batch, xD, xR, xC + 3 * ${a}, ch)
              );

              ${w}
            }

            int xC = xCCorner + ${n};
            if (${R===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${w}
            } else if (${R===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${a}, ch),
                initializationValue,
                initializationValue
              );

              ${w}
            } else if (${R===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${a}, ch),
                getValue(batch, xD, xR, xC + 2 * ${a}, ch),
                initializationValue
              );

              ${w}
            }
          }
        }
        setOutput(${s});
      }
    `}};export{M as Pool2DProgram,b as Pool3DProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/pool_gpu.js:
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
//# sourceMappingURL=pool_gpu.js.map