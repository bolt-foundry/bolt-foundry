/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/pad_packed_gpu) denonext production */
import{getChannels as $}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as v}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var p=class{constructor(c,r,j){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=r.map((o,n)=>o[0]+c[n]+o[1]);let t=c.length,e=v(t),l=r.map(o=>o[0]).join(","),m=r.map((o,n)=>o[0]+c[n]).join(","),s=$("rc",t),a=$("source",t),i=`${s[t-1]} < ${this.outputShape[t-1]}`,h=t===1?"source":`vec2(${a.slice(-2).join()})`,f=[`${e} rc = outputLoc;`,`${s[t-1]} += 1;
       if(${i}) {
      `,t===1?"":`}
       rc = outputLoc;
       ${s[t-2]} += 1;
       if(${s[t-2]} < ${this.outputShape[t-2]}) {`,t===1?"":`  ${s[t-1]} += 1;
         if(${i}) {`],d=t===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",u="";for(let o=0,n=t===1?2:4;o<n;o++)u+=`
        ${f[o]}
        if (${d}) {
          result[${o}] = float(value);
        } else {
          ${e} source = rc - start;
          result[${o}] = getChannel(getX(${a.join()}), ${h});
        }
      `;u+=t===1?"} ":"}}",this.userCode=`
      const ${e} start = ${e}(${l});
      const ${e} end = ${e}(${m});

      void main() {
        ${e} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${u}
        setOutput(result);
      }
    `}};export{p as PadPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/pad_packed_gpu.js:
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
//# sourceMappingURL=pad_packed_gpu.js.map