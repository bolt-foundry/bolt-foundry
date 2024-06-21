/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/addn_packed_gpu) denonext production */
var e=class{constructor(u,i){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=u,this.variableNames=i.map((t,a)=>`T${a}`);let s=[];this.variableNames.forEach(t=>{s.push(`vec4 v${t} = get${t}AtOutCoords();`)});let p=this.variableNames.map(t=>`v${t}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        vec4 result = ${p};
        setOutput(result);
      }
    `}};export{e as AddNPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/addn_packed_gpu.js:
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
//# sourceMappingURL=addn_packed_gpu.js.map