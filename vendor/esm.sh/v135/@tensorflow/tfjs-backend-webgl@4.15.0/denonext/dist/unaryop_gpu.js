/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/unaryop_gpu) denonext production */
import{useShapeUniforms as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";var e=class{constructor(o,n){this.variableNames=["A"],this.outputShape=o,this.enableShapeUniforms=x(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${n}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}},t="if (isnan(x)) return x;",u="return x;",p="return abs(x);";function a(r=0){return t+`
    return x > 0.0 ? 1.0 : float(${r});
  `}var i="return (x >= 0.0) ? x : (exp(x) - 1.0);",c=t+`
  return (x < 0.0) ? 0.0 : x;
`,f=t+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,h="return x;",l="return 1.0 / (1.0 + exp(-1.0 * x));";export{p as ABS,t as CHECK_NAN_SNIPPET,h as CLONE,i as ELU,u as LINEAR,c as RELU,f as RELU6,l as SIGMOID,a as STEP,e as UnaryOpProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/unaryop_gpu.js:
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
//# sourceMappingURL=unaryop_gpu.js.map