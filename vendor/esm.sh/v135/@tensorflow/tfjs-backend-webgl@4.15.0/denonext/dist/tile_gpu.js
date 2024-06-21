/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/tile_gpu) denonext production */
import{getCoordsDataType as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var u=class{constructor(t,n){this.variableNames=["A"];let r=new Array(t.length);for(let e=0;e<r.length;e++)r[e]=t[e]*n[e];this.outputShape=r,this.rank=r.length;let o=c(this.rank),i=C(t);this.userCode=`
      void main() {
        ${o} resRC = getOutputCoords();
        setOutput(getA(${i}));
      }
    `}};function C(s){let t=s.length;if(t>5)throw Error(`Tile for rank ${t} is not yet supported`);if(t===1)return`imod(resRC, ${s[0]})`;let n=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],r=[];for(let o=0;o<s.length;o++)r.push(`imod(${n[o]}, ${s[o]})`);return r.join()}export{u as TileProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/tile_gpu.js:
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
//# sourceMappingURL=tile_gpu.js.map