/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/binaryop_complex_gpu) denonext production */
import{backend_util as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var m={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"},a=class{constructor(t,e,o){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=l.assertAndGetBroadcastShape(e,o),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${t}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}};export{a as BinaryOpComplexProgram,m as COMPLEX_MULTIPLY};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/binaryop_complex_gpu.js:
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
//# sourceMappingURL=binaryop_complex_gpu.js.map