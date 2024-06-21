/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/addn_gpu) denonext production */
var e=class{constructor(o,a){this.outputShape=[],this.outputShape=o,this.variableNames=a.map((t,u)=>`T${u}`);let s=[];this.variableNames.forEach(t=>{s.push(`float v${t} = get${t}AtOutCoords();`)});let i=this.variableNames.map(t=>`v${t}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        float result = ${i};
        setOutput(result);
      }
    `}};export{e as AddNProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/addn_gpu.js:
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
//# sourceMappingURL=addn_gpu.js.map