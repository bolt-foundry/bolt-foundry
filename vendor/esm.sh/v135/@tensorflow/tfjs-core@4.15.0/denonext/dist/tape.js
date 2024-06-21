/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/tape) denonext production */
import*as g from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function $(e,s,l){let u={},d={};for(let n=0;n<s.length;n++)u[s[n].id]=!0;for(let n=0;n<e.length;n++){let t=e[n],o=t.inputs;for(let i in o){let a=o[i],h=!1;for(let c=0;c<s.length;c++)if(u[a.id]){t.outputs.forEach(m=>u[m.id]=!0),h=!0,d[t.id]=!0;break}if(h)break}}let r={};r[l.id]=!0;let p={};for(let n=e.length-1;n>=0;n--){let t=e[n],o=t.inputs;for(let i=0;i<t.outputs.length;i++)if(r[t.outputs[i].id]){for(let a in o)r[o[a].id]=!0,p[t.id]=!0;break}}let f=[];for(let n=0;n<e.length;n++){let t=e[n];if(d[t.id]&&p[t.id]){let o={};for(let a in t.inputs){let h=t.inputs[a];u[h.id]&&(o[a]=h)}let i=Object.assign({},t);i.inputs=o,i.outputs=t.outputs,f.push(i)}}return f}function b(e,s,l,u){for(let d=s.length-1;d>=0;d--){let r=s[d],p=[];if(r.outputs.forEach(n=>{let t=e[n.id];t!=null?p.push(t):p.push(null)}),r.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${r.kernelName}.`);let f=r.gradient(p);for(let n in r.inputs){if(!(n in f))throw new Error(`Cannot backprop through input ${n}. Available gradients found: ${Object.keys(f)}.`);let t=l(()=>f[n]());if(t.dtype!=="float32")throw new Error(`Error in gradient for op ${r.kernelName}. The gradient of input ${n} must have 'float32' dtype, but has '${t.dtype}'`);let o=r.inputs[n];if(!g.arraysEqual(t.shape,o.shape))throw new Error(`Error in gradient for op ${r.kernelName}. The gradient of input '${n}' has shape '${t.shape}', which does not match the shape of the input '${o.shape}'`);if(e[o.id]==null)e[o.id]=t;else{let i=e[o.id];e[o.id]=u(i,t),i.dispose()}}}}export{b as backpropagateGradients,$ as getFilteredNodesXToY};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tape.js:
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
//# sourceMappingURL=tape.js.map