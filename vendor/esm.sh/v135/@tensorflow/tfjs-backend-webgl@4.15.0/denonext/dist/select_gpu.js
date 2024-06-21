/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/select_gpu) denonext production */
import{getCoordsDataType as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var a=class{constructor(c,r,o){this.variableNames=["c","a","b"],this.outputShape=r;let e,s;if(o>4)throw Error(`Where for rank ${o} is not yet supported`);if(o===1)s="resRC",e="resRC";else{let C=["resRC.x","resRC.y","resRC.z","resRC.w"],i=[],u=[];for(let t=0;t<r.length;t++)u.push(`${C[t]}`),t<c&&i.push(`${C[t]}`);e=i.join(),s=u.join()}let p=d(o);this.userCode=`
      void main() {
        ${p} resRC = getOutputCoords();
        float cVal = getC(${e});
        if (cVal >= 1.0) {
          setOutput(getA(${s}));
        } else {
          setOutput(getB(${s}));
        }
      }
    `}};export{a as SelectProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/select_gpu.js:
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
//# sourceMappingURL=select_gpu.js.map