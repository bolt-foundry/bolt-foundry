/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/strided_slice_gpu) denonext production */
import{getCoordsDataType as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var $=class{constructor(d,p,t){this.variableNames=["x"],this.outputShape=t;let u=t.length,o=r(t.length),g=r(t.length),s="";if(u===1)s="coords * strides + begin";else{let n=0;s=t.map((c,e)=>(n++,t.length===1?`coords * strides[${e}] + begin[${e}]`:`coords[${n-1}] * strides[${e}] + begin[${e}]`)).join(",")}this.userCode=`
      ${o} begin = ${o}(${d});
      ${o} strides = ${o}(${p});

      void main() {
        ${g} coords = getOutputCoords();
        setOutput(getX(${s}));
      }
    `}};export{$ as StridedSliceProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/strided_slice_gpu.js:
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
//# sourceMappingURL=strided_slice_gpu.js.map