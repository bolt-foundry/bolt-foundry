/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/pack_gpu) denonext production */
import{useShapeUniforms as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import{getChannels as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var i=class{constructor(o){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=o,this.rank=o.length,this.enableShapeUniforms=h(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{let t=u("rc",this.rank),e=p(this.rank),s=this.getOutOfBoundsCondition(t),r=this.getSetup(t),n=this.getOutput(t);this.userCode=`
        void main() {
          ${e} rc = getOutputCoords();

          if(${s}) {
            setOutput(vec4(0));
          } else {
            ${r}

            setOutput(vec4(${n}));
          }
        }
      `}}getSourceCoordsArr(o){let t=[];for(let e=0;e<=1;e++)for(let s=0;s<=1;s++){let r=`${e===0?"r":"rp1"}, ${s===0?"c":"cp1"}`;for(let n=2;n<this.rank;n++)r=`${o[o.length-1-n]},`+r;t.push(r)}return t}getOutOfBoundsCondition(o){if(this.rank===1)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let e=this.rank-2;e<this.rank;e++)t+=`${o[e]} >= ${this.enableShapeUniforms?`outShape[${e}]`:this.outputShape[e]}`,e<this.rank-1&&(t+="||");return t}getSetup(o){if(this.rank===1)return"";let t=o.slice(-2),e=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],s=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${e};
      bool rEdge = rp1 >= ${s};
    `}getOutput(o){let t=this.getSourceCoordsArr(o);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}};export{i as PackProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/pack_gpu.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=pack_gpu.js.map