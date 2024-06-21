/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/slice_packed_gpu) denonext production */
import{getChannels as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var e=class{constructor(t){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.rank=t.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let a=p(this.rank),r=c("coords",this.rank),s=c("sourceLoc",this.rank),i=this.rank===1?"sourceLoc":`vec2(${s.slice(-2).join()})`,n=`getChannel(getSource(${s.join()}), ${i})`,h=`
      result.x = ${n};
      if (++${r[this.rank-1]} < ${t[this.rank-1]}) {
        ++${s[this.rank-1]};
        result.y = ${n};
        --${s[this.rank-1]};
      }
    `,u=this.rank===1?"":`
      --${r[this.rank-1]};
      if (++${r[this.rank-2]} < ${t[this.rank-2]}) {
        ++${s[this.rank-2]};
        result.z = ${n};
        if (++${r[this.rank-1]} < ${t[this.rank-1]}) {
          ++${s[this.rank-1]};
          result.w = ${n};
        }
      }
    `,$=this.rank<=4?`sourceLoc = coords +
            ${a}(${t.map((k,o)=>`start[${o}]`).join()});`:t.map((k,o)=>`${s[o]} = ${r[o]} + start[${o}];`).join(`
`);this.userCode=`
      void main() {
        ${a} coords = getOutputCoords();
        ${a} sourceLoc;
        ${$}
        vec4 result = vec4(0.);
        ${h}
        ${u}
        setOutput(result);
      }
    `}};export{e as SlicePackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/slice_packed_gpu.js:
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
//# sourceMappingURL=slice_packed_gpu.js.map