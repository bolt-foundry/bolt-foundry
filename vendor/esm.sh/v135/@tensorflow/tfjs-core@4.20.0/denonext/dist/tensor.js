/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/tensor) denonext production */
import{getGlobal as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/global_util.js";import{tensorToString as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_format.js";import*as a from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{computeStrides as u,toNestedArray as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";var p=class{constructor(t,e,s){if(this.dtype=e,this.shape=t.slice(),this.size=a.sizeFromShape(t),s!=null){let i=s.length;a.assert(i===this.size,()=>`Length of values '${i}' does not match the size inferred by the shape '${this.size}'.`)}if(e==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=s||a.getArrayFromDType(e,this.size),this.strides=u(t)}set(t,...e){e.length===0&&(e=[0]),a.assert(e.length===this.rank,()=>`The number of provided coordinates (${e.length}) must match the rank (${this.rank})`);let s=this.locToIndex(e);this.values[s]=t}get(...t){t.length===0&&(t=[0]);let e=0;for(let i of t){if(i<0||i>=this.shape[e]){let f=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(f)}e++}let s=t[t.length-1];for(let i=0;i<t.length-1;++i)s+=this.strides[i]*t[i];return this.values[s]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let e=t[t.length-1];for(let s=0;s<t.length-1;++s)e+=this.strides[s]*t[s];return e}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];let e=new Array(this.shape.length);for(let s=0;s<e.length-1;++s)e[s]=Math.floor(t/this.strides[s]),t-=e[s]*this.strides[s];return e[e.length-1]=t,e}get rank(){return this.shape.length}toTensor(){return n().makeTensor(this.values,this.shape,this.dtype)}},n=null,h=null,g=null;function k(r){n=r}function T(r){h=r}function D(r){g=r}var o=class{constructor(t,e,s,i){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=e||"float32",this.size=a.sizeFromShape(t),this.strides=u(t),this.dataId=s,this.id=i,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let t=await this.data();return h.buffer(this.shape,this.dtype,t)}bufferSync(){return h.buffer(this.shape,this.dtype,this.dataSync())}async array(){let t=await this.data();return l(this.shape,t,this.dtype==="complex64")}arraySync(){return l(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let t=n().read(this.dataId);if(this.dtype==="string"){let e=await t;try{return e.map(s=>a.decodeString(s))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),n().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();let t=n().readSync(this.dataId);if(this.dtype==="string")try{return t.map(e=>a.decodeString(e))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();let t=await n().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),n().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return h.print(this,t)}clone(){return this.throwIfDisposed(),h.clone(this)}toString(t=!1){let e=this.dataSync();return y(e,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),h.cast(this,t)}variable(t=!0,e,s){return this.throwIfDisposed(),n().makeVariable(this,t,e,s)}};Object.defineProperty(o,Symbol.hasInstance,{value:r=>!!r&&r.data!=null&&r.dataSync!=null&&r.throwIfDisposed!=null});function m(){return c("Tensor",()=>o)}m();var d=class extends o{constructor(t,e,s,i){super(t.shape,t.dtype,t.dataId,i),this.trainable=e,this.name=s}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!a.arraysEqual(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);n().disposeTensor(this),this.dataId=t.dataId,n().incRef(this,null)}dispose(){n().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(d,Symbol.hasInstance,{value:r=>r instanceof o&&r.assign!=null&&r.assign instanceof Function});export{o as Tensor,p as TensorBuffer,d as Variable,m as getGlobalTensorClass,D as setDeprecationWarningFn,T as setOpHandler,k as setTensorTracker};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tensor.js:
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
//# sourceMappingURL=tensor.js.map