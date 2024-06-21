/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/argminmax_packed_gpu) denonext production */
import{util as R}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{getChannels as a}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as A}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var j=class{constructor(i,d,l,u){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,R.assert(i.length>2,()=>`Packed arg${l.charAt(0).toUpperCase()+l.slice(1)} supports only inputs with rank above 2.`);let L=i[i.length-1],$=Math.ceil(L/d);this.outputShape=i.slice(0,-1),$>1&&this.outputShape.push($),u||this.variableNames.push("bestIndicesA");let h=this.outputShape,e=h.length,s=A(e),c=a("coords",e),p,t;if($===1){t=e+1;let o=A(t);p=`
        ${o} sourceLocR = ${o}(${c.join()}, 0);
        ++${c[e-1]};
        ${o} sourceLocG = ${o}(${c.join()}, 0);
        ++${c[e-2]};
        ${o} sourceLocA = ${o}(${c.join()}, 0);
        --${c[e-1]};
        ${o} sourceLocB = ${o}(${c.join()}, 0);
        --${c[e-2]};`}else t=e,p=`
        ${s} sourceLocR = coords;
        ++${c[e-1]};
        ${s} sourceLocG = coords;
        ++${c[e-2]};
        ${s} sourceLocA = coords;
        --${c[e-1]};
        ${s} sourceLocB = coords;
        --${c[e-2]};`;let n=["x","y","z","w","u","v"].slice(0,t),r="."+n[t-1],x=n.map(o=>"int "+o),C=a("sourceLocR",t-1).concat("inIdx.r"),I=a("sourceLocG",t-1).concat("inIdx.g"),v=a("sourceLocB",t-1).concat("inIdx.b"),g=a("sourceLocA",t-1).concat("inIdx.a"),m=l==="max"?"greaterThan":"lessThan",B=u?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${C.join()}),
                             getBestIndicesAChannel(${I.join()}),
                             getBestIndicesAChannel(${v.join()}),
                             getBestIndicesAChannel(${g.join()})));`,b=`vec4(
            getAChannel(${C.join()}),
            hasNextCol ? getAChannel(${I.join()}) : 0.,
            hasNextRow ? getAChannel(${v.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${g.join()}) : 0.)`,f=u?"":`
      float getBestIndicesAChannel(${x.join()}) {
        return getChannel(getBestIndicesA(${n.join()}),
                                          vec2(${n.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${x.join()}) {
        return getChannel(getA(${n.join()}),
                               vec2(${n.slice(-2).join()}));
      }
      ${f}
      void main() {
        ${s} coords = getOutputCoords();
        bool hasNextCol = ${c[e-1]} < ${h[e-1]-1};
        bool hasNextRow = ${c[e-2]} < ${h[e-2]-1};
        ${p}
        ivec4 srcIdx = ivec4(sourceLocR${r}, sourceLocG${r},
          sourceLocB${r}, sourceLocA${r}) * ${d};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${b};

        for (int i = 0; i < ${d}; i++) {
          inIdx = srcIdx;
          ${B}
          vec4 candidate = ${b};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${m}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}};export{j as ArgMinMaxPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/argminmax_packed_gpu.js:
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
//# sourceMappingURL=argminmax_packed_gpu.js.map