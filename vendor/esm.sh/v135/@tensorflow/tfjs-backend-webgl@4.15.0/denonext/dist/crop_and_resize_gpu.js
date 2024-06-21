/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/crop_and_resize_gpu) denonext production */
var s=class{constructor(n,l,u,f,a){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];let[h,c,r,d]=n,[g]=l,[t,o]=u;this.outputShape=[g,t,o,d];let x=f==="bilinear"?1:0,[e,i]=[`${c-1}.0`,`${r-1}.0`],[C,R,b]=t>1?[`${(c-1)/(t-1)}`,"(y2-y1) * height_ratio",`y1*${e} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${e}`],[p,m,$]=o>1?[`${(r-1)/(o-1)}`,"(x2-x1) * width_ratio",`x1*${i} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${i}`];this.userCode=`
      const float height_ratio = float(${C});
      const float width_ratio = float(${p});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${h}) {
          return;
        }

        float height_scale = ${R};
        float width_scale = ${m};

        float in_y = ${b};
        if( in_y < 0.0 || in_y > ${e} ) {
          setOutput(float(${a}));
          return;
        }
        float in_x = ${$};
        if( in_x < 0.0 || in_x > ${i} ) {
          setOutput(float(${a}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${x} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}};export{s as CropAndResizeProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/crop_and_resize_gpu.js:
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
//# sourceMappingURL=crop_and_resize_gpu.js.map