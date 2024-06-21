/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/mirror_pad_packed_gpu) denonext production */
import{getChannels as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var g=class{constructor($,n,h){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=n.map((e,l)=>e[0]+$[l]+e[1]);let s=$.length,t=d(s),f=n.map(e=>e[0]).join(","),m=n.map((e,l)=>e[0]+$[l]).join(","),r=p("rc",s),o=p("source",s),i=`${r[s-1]} < ${this.outputShape[s-1]}`,u=s===1?"source":`vec2(${o.slice(-2).join()})`,c=h==="reflect"?0:1,a="";if(s===1){let e=`
        ${t} source = rc;
        if (source < start) {
          source = start * 2 - source - ${c};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${c};
        }
        source -= start;
      `;a=`
        ${t} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${o.join()}), ${u});
        ${r[s-1]} += 1;
        if(${i}) {
          ${e}
          result[1] = getChannel(getX(${o.join()}), ${u});
        }
      `}else{let e=`
        ${t} source = rc;
        ${t} lt = ${t}(lessThan(source, start));
        ${t} gte = ${t}(greaterThanEqual(source, end));
        ${t} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${c}) +
                gte * ((end - 1) * 2 - source + ${c});
        source -= start;
      `;a=`
        ${t} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${o.join()}), ${u});
        ${r[s-1]} += 1;
        if(${i}) {
          ${e}
          result[1] = getChannel(getX(${o.join()}), ${u});
        }
        rc = outputLoc;
        ${r[s-2]} += 1;
        if(${r[s-2]} < ${this.outputShape[s-2]}) {
          ${e}
          result[2] = getChannel(getX(${o.join()}), ${u});
          ${r[s-1]} += 1;
          if(${i}) {
            ${e}
            result[3] = getChannel(getX(${o.join()}), ${u});
          }
        }
      `}this.userCode=`
      const ${t} start = ${t}(${f});
      const ${t} end = ${t}(${m});

      void main() {
        ${t} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${a}
        setOutput(result);
      }
    `}};export{g as MirrorPadPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/mirror_pad_packed_gpu.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=mirror_pad_packed_gpu.js.map