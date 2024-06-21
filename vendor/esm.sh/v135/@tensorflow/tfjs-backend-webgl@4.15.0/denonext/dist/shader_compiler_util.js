/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/shader_compiler_util) denonext production */
import{util as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function p(e,i,o="index"){let c=a.computeStrides(i);return c.map((r,t)=>{let n=`int ${e[t]} = ${o} / ${r}`,l=t===c.length-1?`int ${e[t+1]} = ${o} - ${e[t]} * ${r}`:`index -= ${e[t]} * ${r}`;return`${n}; ${l};`}).join("")}function h(e,i,o="index"){let c=a.computeStrides(i);return c.map((r,t)=>{let n=`int ${e[t]} = ${o} / outShapeStrides[${t}]`,l=t===c.length-1?`int ${e[t+1]} = ${o} - ${e[t]} * outShapeStrides[${t}]`:`index -= ${e[t]} * outShapeStrides[${t}]`;return`${n}; ${l};`}).join("")}function u(e,i){let o=e.length,c=e.map(t=>`${i}[${t}]`),r=new Array(o-1);r[o-2]=c[o-1];for(let t=o-3;t>=0;--t)r[t]=`(${r[t+1]} * ${c[t+1]})`;return r}function g(e,i,o="index"){let c=e.map((t,n)=>n),r=u(c,i);return r.map((t,n)=>{let l=`int ${e[n]} = ${o} / ${r[n]}`,$=n===r.length-1?`int ${e[n+1]} = ${o} - ${e[n]} * ${r[n]}`:`index -= ${e[n]} * ${r[n]}`;return`${l}; ${$};`}).join("")}function s(e){return e.length===1?`${e[0]}`:`vec${e.length}(${e.join(",")})`}function m(e,i){if(e.length!==i.length)throw new Error(`Vectors to be dotted must be of the same length -got ${e.length} and ${i.length}`);let o=[],c=Math.floor(e.length/4),r=e.length%4;for(let t=0;t<c;t++){let n=e.slice(t*4,t*4+4),l=i.slice(t*4,t*4+4);o.push(`${s(n)}, ${s(l)}`)}if(r!==0){let t=e.slice(c*4),n=i.slice(c*4);t.length===1&&(t=t.map(l=>`float(${l})`),n=n.map(l=>`float(${l})`)),o.push(`${s(t)}, ${s(n)}`)}return o.map((t,n)=>`dot(${t})`).join("+")}function d(e){let i=a.computeStrides(e).map(o=>o.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${i[0]} + coords.y * ${i[1]} + coords.z;
  }
`}function v(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}var S=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;export{S as ENCODE_FLOAT_SNIPPET,m as dotify,d as getFlatIndexFrom3D,v as getFlatIndexFrom3DOutput,p as getLogicalCoordinatesFromFlatIndex,g as getLogicalCoordinatesFromFlatIndexByUniform,h as getOutputLogicalCoordinatesFromFlatIndexByUniform};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/shader_compiler_util.js:
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
//# sourceMappingURL=shader_compiler_util.js.map