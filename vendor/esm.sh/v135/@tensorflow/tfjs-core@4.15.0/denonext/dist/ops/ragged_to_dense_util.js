/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/ragged_to_dense_util) denonext production */
var u;(function(n){n[n.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",n[n.VALUE_ROWIDS=1]="VALUE_ROWIDS",n[n.ROW_LENGTHS=2]="ROW_LENGTHS",n[n.ROW_SPLITS=3]="ROW_SPLITS",n[n.ROW_LIMITS=4]="ROW_LIMITS",n[n.ROW_STARTS=5]="ROW_STARTS"})(u||(u={}));function f(n,r,e){let t=new Array;if(e==null&&r==null)return t;if(r==null)for(;t.length<n+e.length;)t.push(-1);else t=r.slice();if(e==null)return t;if(n+e.length!==t.length)throw new Error(`rt input.shape and shape=${r} are incompatible: rt input.rank = ${n+e.length}, but shape.rank = ${t.length}`);for(let l=1;l<e.length;++l){let s=e[l],I=t[t.length-e.length+l],_=t[I];if(s>=0)if(_>=0){if(_!==s)throw new Error(`rt input.shape and shape=${r} are incompatible: rt input.shape[${l+n}] = ${s} but shape[${l+n}] = ${_}`)}else t[I]=s}return t}function S(n){let r={FIRST_DIM_SIZE:u.FIRST_DIM_SIZE,VALUE_ROWIDS:u.VALUE_ROWIDS,ROW_LENGTHS:u.ROW_LENGTHS,ROW_SPLITS:u.ROW_SPLITS,ROW_LIMITS:u.ROW_LIMITS,ROW_STARTS:u.ROW_STARTS},e=[];for(let t of n)if(t in r)e.push(r[t]);else break;return e}function i(n){return n.length===0?0:n[0]===u.FIRST_DIM_SIZE?n.length-1:n.length}function o(n,r){if(n==null||r==null)return;let e=n.length,t=r.length;if(e>=t)throw new Error(`defaultValue.shape=${n} and ragged tensor flatValues.shape=${r}, are incompatible: defaultValue.rank = ${e} must be less than ragged tensor input flatValues.rank = ${t})`);for(let l=0;l<Math.min(e,t-1);++l){let s=n[l],I=r[l+1];if(s>=0&&I>=0&&s!==1&&s!==I)throw new Error(`defaultValue.shape=${n}, and ragged tensor input flatValues.shape=${r} are incompatible: defaultValue.shape[${l-n.length}] = ${s} but ragged tensor input.flatValues.shape[${l-n.length}] = ${I}`)}}export{u as RowPartitionType,f as combineRaggedTensorToTensorShapes,i as getRaggedRank,S as getRowPartitionTypesHelper,o as validateDefaultValueShape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ragged_to_dense_util.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=ragged_to_dense_util.js.map