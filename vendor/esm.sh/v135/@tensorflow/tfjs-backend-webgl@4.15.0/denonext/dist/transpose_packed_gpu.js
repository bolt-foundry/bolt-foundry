/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/transpose_packed_gpu) denonext production */
import{getVecChannels as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var u=class{constructor(o,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;let r=new Array(o.length);for(let t=0;t<r.length;t++)r[t]=o[n[t]];if(this.outputShape=r,this.rank=r.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);let a=p(this.rank),e=l("rc",this.rank),i=new Array(this.rank);for(let t=0;t<n.length;t++)i[n[t]]=e[t];let c=`vec2(${i.slice(-2).join()})`,h=`++${e[this.rank-1]} < ${r[this.rank-1]}`,s=`getChannel(getA(${i.join()}), ${c})`;this.userCode=`
    void main() {
      ${a} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${s};
      if(${h}) {
        result[1] = ${s};
      }
      --${e[this.rank-1]};
      if(++${e[this.rank-2]} < ${r[this.rank-2]}) {
        result[2] = ${s};
        if(${h}) {
          result[3] = ${s};
        }
      }
      setOutput(result);
    }
    `}};export{u as TransposePackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/transpose_packed_gpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=transpose_packed_gpu.js.map