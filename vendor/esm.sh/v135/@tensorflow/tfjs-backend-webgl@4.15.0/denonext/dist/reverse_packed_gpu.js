/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/reverse_packed_gpu) denonext production */
import{getChannels as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var i=class{constructor(r,c){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;let e=r.length;if(e>4)throw new Error(`WebGL backend: Reverse of rank-${e} tensor is not yet supported`);this.outputShape=r;let o=O("rc",e),s=`${o[e-1]} + 1 < ${this.outputShape[e-1]}`,$=`${o[e-2]} + 1 < ${this.outputShape[e-2]}`,g=b(e);e===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${r[0]} - rc - 1),
            ${r[0]} - rc - 1);
          if(${s}){
              result.g = getChannel(getX(${r[0]} - (rc  + 1) - 1),
                ${r[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${g} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${l(o.slice())};
          if(${s}){
            result.g = ${f(o.slice())};
          }
          if(${$}) {
            result.b = ${d(o.slice())};
            if(${s}) {
              result.a = ${p(o.slice())};
            }
          }
          setOutput(result);
        }
    `;function l(t){return n(t)}function f(t){return t[e-1]="("+t[e-1]+" + 1)",n(t)}function d(t){return t[e-2]="("+t[e-2]+" + 1)",n(t)}function p(t){return t[e-1]="("+t[e-1]+" + 1)",t[e-2]="("+t[e-2]+" + 1)",n(t)}function n(t){let u=r.map((y,a)=>C(a,t)),m=u.join(","),v=u.slice(-2).join(",");return`getChannel(getX(${m}), vec2(${v}))`}function C(t,u){return c.indexOf(t)!==-1&&r[t]!==1?`${r[t]} - ${u[t]} - 1`:`${u[t]}`}}};export{i as ReversePackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/reverse_packed_gpu.js:
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
//# sourceMappingURL=reverse_packed_gpu.js.map