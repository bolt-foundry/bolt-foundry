/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/conv_packed_gpu_depthwise) denonext production */
import{util as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{useShapeUniforms as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";var T=class{constructor(s,c=!1,f=null,n=!1,d=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=s.outShape,this.enableShapeUniforms=O(this.outputShape.length);let $=s.outChannels/s.inChannels,C=s.padInfo.left,u=s.strideWidth,l=s.dilationWidth,v=s.filterHeight,i=s.filterWidth,m=i,x=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let t=0;t<i;t++)x+=`
          vec4 xTexelC${t*2};
          int xTexelC${t*2}Ready;
          vec4 xTexelC${t*2+1};
          int xTexelC${t*2+1}Ready;
          vec4 xC${t};`;x+=`
    for (int r = 0; r < ${v}; r++) {
      `;for(let t=0;t<i;t++)x+=`
          xTexelC${t*2} = vec4(0.0);
          xTexelC${t*2}Ready = 0;
          xTexelC${t*2+1} = vec4(0.0);
          xTexelC${t*2+1}Ready = 0;
          xC${t} = vec4(0.0);`;x+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let t=0;t<(m+1)/2;t++){let e=t*2;if(x+=`
          xC = xCCorner + ${e*l};
          `,u===1){if(e<i&&(C%2===1?(x+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${e}Ready == 0) {
                  xTexelC${e} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${e}.zw = vec2(0.0);
                  }
                  xTexelC${e}Ready = 1;
                }
              `,l===1&&e>0?x+=`
                xC${e} = vec4(xTexelC${e-2}.zw, xTexelC${e}.xy);
                `:x+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${e} = vec4(previous.zw, xTexelC${e}.xy);
                  } else {
                    xC${e} = vec4(0.0, 0.0, xTexelC${e}.xy);
                  }
                  `):x+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${e}Ready == 0) {
                  xTexelC${e} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${e}.zw = vec2(0.0);
                  }
                  xTexelC${e}Ready = 1;
                }

                xC${e} = xTexelC${e};
                `,e+1<i)){let r=C%2===0?y.nearestLargerEven(l):l;l%2===0&&C%2===1||l%2!==0&&C%2!==1?(x+=`
                  xCOffset = xC + imod(pads[1], 2) + ${r};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${e+1}Ready == 0) {
                    xTexelC${e+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${e+1}.zw = vec2(0.0);
                    }
                    xTexelC${e+1}Ready = 1;
                  }
                  `,l>1?x+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${e+1} = vec4(previous.zw, xTexelC${e+1}.xy);
                    } else {
                     xC${e+1} = vec4(0.0, 0.0, xTexelC${e+1}.xy);
                    }
                    `:x+=`
                    xC${e+1} = vec4(xTexelC${e}.zw, xTexelC${e+1}.xy);
                    `):r===1?x+=`
                    xC${e+1} = xTexelC${e};
                    `:x+=`
                    xCOffset = xC + ${r};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${e+1}Ready == 0) {
                      xTexelC${e+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${e+1}.zw = vec2(0.0);
                      }
                      xTexelC${e+1}Ready = 1;
                    }

                    xC${e+1} = xTexelC${e+1};
                    `}}else e<i&&(C%2===1?(x+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${e}Ready == 0) {
                  xTexelC${e} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${e}.zw = vec2(0.0);
                  }
                  xTexelC${e}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${e+1}Ready == 0) {
                  xTexelC${e+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${e+1}.zw = vec2(0.0);
                  }
                  xTexelC${e+1}Ready = 1;
                }

                xC${e} = vec4(xTexelC${e}.zw, xTexelC${e+1}.zw);
              `,e+1<i&&(x+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${e+1} = vec4(xTexelC${e+1}.xy, final.xy);
                `)):(x+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${e}Ready == 0) {
                  xTexelC${e} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${e}.zw = vec2(0.0);
                  }
                  xTexelC${e}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${e+1}Ready == 0) {
                  xTexelC${e+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${e+1}.zw = vec2(0.);
                  }
                  xTexelC${e+1}Ready = 1;
                }

                xC${e} = vec4(
                  xTexelC${e}.xy, xTexelC${e+1}.xy);
              `,e+1<i&&(x+=`
                  xC${e+1} = vec4(xTexelC${e}.zw, xTexelC${e+1}.zw);
                `)));e<i&&(x+=`
            wTexel = getW(r, ${e}, d1, q);
            dotProd += xC${e} * vec4(wTexel.xz, wTexel.xz);
          `,e+1<i&&(x+=`
              wTexel = getW(r, ${e+1}, d1, q);
              dotProd += xC${e+1} * vec4(wTexel.xz, wTexel.xz);
            `))}x+=`
    }
  `,x+=`
      }
    `;let a="",o="";f&&(n?a=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${f}
        }`:d?a=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${f}
        }`:a=`vec4 activation(vec4 x) {
          ${f}
        }`,o="result = activation(result);");let h=c?"result += getBiasAtOutCoords();":"";c&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),d&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${a}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${$};
        int q = d2 - d1 * ${$};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${x}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${h}
        ${o}
        setOutput(result);
      }
    `}};export{T as DepthwiseConvPacked2DProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/conv_packed_gpu_depthwise.js:
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
//# sourceMappingURL=conv_packed_gpu_depthwise.js.map