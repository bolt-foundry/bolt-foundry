/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/slice_gpu) denonext production */
import{getCoordsDataType as a}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var n=class{constructor(t){this.variableNames=["source"],this.outputShape=t,this.rank=t.length;let e=a(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let u=p(this.rank),c,i=t.map((d,r)=>`sourceLoc.${s[r]} = start[${r}] + coords.${s[r]};`);c=`
        ${e} sourceLoc;
        ${e} coords = getOutputCoords();
        ${i.join(`
`)}
      `,this.userCode=`
      void main() {
        ${c}
        setOutput(getSource(${u}));
      }
    `}},s=["x","y","z","w","u","v"];function p(o){if(o===1)return"sourceLoc";if(o<=6)return s.slice(0,o).map(t=>"sourceLoc."+t).join(",");throw Error(`Slicing for rank ${o} is not yet supported`)}export{n as SliceProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/slice_gpu.js:
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
//# sourceMappingURL=slice_gpu.js.map