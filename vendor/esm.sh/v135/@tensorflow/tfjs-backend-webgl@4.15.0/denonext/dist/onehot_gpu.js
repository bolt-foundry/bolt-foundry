/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/onehot_gpu) denonext production */
var t=class{constructor(o,s,i,e){this.variableNames=["indices"],this.outputShape=[o,s],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${e}), float(${i}),
                      float(index == coords.y)));
      }
    `}};export{t as OneHotProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/onehot_gpu.js:
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
//# sourceMappingURL=onehot_gpu.js.map