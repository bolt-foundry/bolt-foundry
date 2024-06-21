/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/reverse_gpu) denonext production */
import{getCoordsDataType as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var s=class{constructor(t,e){this.variableNames=["x"];let r=t.length;if(r>4)throw new Error(`WebGL backend: Reverse of rank-${r} tensor is not yet supported`);if(this.outputShape=t,r===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${t[0]} - coord - 1));
        }
      `;return}let n=o=>e.indexOf(o)!==-1&&t[o]!==1?`${t[o]} - coords[${o}] - 1`:`coords[${o}]`,d=t.map((o,i)=>n(i)).join(","),u=c(r);this.userCode=`
      void main() {
        ${u} coords = getOutputCoords();
        setOutput(getX(${d}));
      }
    `}};export{s as ReverseProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/reverse_gpu.js:
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
//# sourceMappingURL=reverse_gpu.js.map