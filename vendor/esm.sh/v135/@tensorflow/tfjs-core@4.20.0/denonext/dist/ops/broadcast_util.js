/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/broadcast_util) denonext production */
function c(l,o){let r=l.length,n=[];for(let t=0;t<r;t++){let e=r-1-t,s=l[e]||1;(o[o.length-1-t]||1)>1&&s===1&&n.unshift(e)}return n}function f(l,o){let r=[];for(let n=0;n<o.length;n++){let t=l[l.length-n-1],e=o.length-n-1,s=o[e];(t==null||t===1&&s>1)&&r.unshift(e)}return r}function u(l,o){let r=Math.max(l.length,o.length),n=new Array(r);for(let t=0;t<r;t++){let e=l[l.length-t-1];e==null&&(e=1);let s=o[o.length-t-1];if(s==null&&(s=1),e===1)n[r-t-1]=s;else if(s===1)n[r-t-1]=e;else if(e!==s){let i=`Operands could not be broadcast together with shapes ${l} and ${o}.`;throw Error(i)}else n[r-t-1]=e}return n}export{u as assertAndGetBroadcastShape,c as getBroadcastDims,f as getReductionAxes};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/broadcast_util.js:
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
//# sourceMappingURL=broadcast_util.js.map