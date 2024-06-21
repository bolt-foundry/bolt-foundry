/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/concat_packed_gpu) denonext production */
import{backend_util as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{getChannels as V}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var d=class{constructor(s,u){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=v.computeOutShape(s,u);let l=this.outputShape,t=l.length,c=O(t),e=V("coords",t),$=["x","y","z","w","u","v"].slice(0,t);this.variableNames=s.map((n,i)=>`T${i}`);let o=new Array(s.length-1);o[0]=s[0][u];for(let n=1;n<o.length;n++)o[n]=o[n-1]+s[n][u];let r=$[u],p=$.slice(-2),m=$.join(),g=`if (${r} < ${o[0]}) {
        return getChannel(
            getT0(${m}), vec2(${p.join()}));
        }`;for(let n=1;n<o.length;n++){let i=o[n-1];g+=`
        if (${r} < ${o[n]}  && ${r} >= ${o[n-1]}) {
          return getChannel(
            getT${n}(${a($,r,i)}),
            vec2(${a(p,r,i)}));
        }`}let C=o.length,f=o[o.length-1];g+=`
        return getChannel(
          getT${C}(${a($,r,f)}),
          vec2(${a(p,r,f)}));`,this.userCode=`
      float getValue(${$.map(n=>"int "+n)}) {
        ${g}
      }

      void main() {
        ${c} coords = getOutputCoords();
        vec4 result = vec4(getValue(${e}), 0., 0., 0.);

        ${e[t-1]} = ${e[t-1]} + 1;
        if (${e[t-1]} < ${l[t-1]}) {
          result.g = getValue(${e});
        }

        ${e[t-2]} = ${e[t-2]} + 1;
        if (${e[t-2]} < ${l[t-2]}) {
          result.a = getValue(${e});
        }

        ${e[t-1]} = ${e[t-1]} - 1;
        if (${e[t-2]} < ${l[t-2]} &&
            ${e[t-1]} < ${l[t-1]}) {
          result.b = getValue(${e});
        }
        setOutput(result);
      }
    `}};function a(h,s,u){let l=h.indexOf(s);return h.map((c,e)=>e===l?`${c} - ${u}`:c).join()}export{d as ConcatPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/concat_packed_gpu.js:
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
//# sourceMappingURL=concat_packed_gpu.js.map