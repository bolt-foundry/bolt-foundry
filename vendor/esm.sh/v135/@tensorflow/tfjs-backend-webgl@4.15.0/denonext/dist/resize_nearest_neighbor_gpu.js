/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/resize_nearest_neighbor_gpu) denonext production */
var r=class{constructor(i,e,t,c,p){this.variableNames=["A"],this.outputShape=[];let[R,o,u,d]=i;this.outputShape=[R,e,t,d];let v=[c&&e>1?o-1:o,c&&t>1?u-1:u],a=[c&&e>1?e-1:e,c&&t>1?t-1:t],f=c?"0.5":"0.0",s;p?s="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":s="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${v[0]/a[0]},
          ${v[1]/a[1]});
      const vec2 inputShapeRC = vec2(${o}.0, ${u}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${s};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${f})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}};export{r as ResizeNearestNeighborProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_gpu.js:
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
//# sourceMappingURL=resize_nearest_neighbor_gpu.js.map