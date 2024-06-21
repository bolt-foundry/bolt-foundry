/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/transpose_gpu) denonext production */
import{getCoordsDataType as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var i=class{constructor(r,s){this.variableNames=["A"];let t=new Array(r.length);for(let n=0;n<t.length;n++)t[n]=r[s[n]];this.outputShape=t,this.rank=t.length;let e=u(this.rank),h=a(s);this.userCode=`
    void main() {
      ${e} resRC = getOutputCoords();
      setOutput(getA(${h}));
    }
    `}};function a(o){let r=o.length;if(r>6)throw Error(`Transpose for rank ${r} is not yet supported`);let s=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],t=new Array(r);for(let e=0;e<o.length;e++)t[o[e]]=s[e];return t.join()}export{i as TransposeProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/transpose_gpu.js:
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
//# sourceMappingURL=transpose_gpu.js.map