/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/binaryop_gpu) denonext production */
import{backend_util as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{useShapeUniforms as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";var p=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`,b="return (a - b) * (a - b);",t=class{constructor(a,o,e){this.variableNames=["A","B"],this.outputShape=r.assertAndGetBroadcastShape(o,e),this.enableShapeUniforms=s(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${a}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}};export{t as BinaryOpProgram,p as CHECK_NAN_SNIPPET,b as SQUARED_DIFFERENCE};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/binaryop_gpu.js:
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
//# sourceMappingURL=binaryop_gpu.js.map