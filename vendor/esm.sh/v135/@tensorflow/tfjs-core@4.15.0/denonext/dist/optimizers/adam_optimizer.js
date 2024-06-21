/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/optimizers/adam_optimizer) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{dispose as g,tidy as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/globals.js";import{add as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{div as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/div.js";import{mul as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{pow as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/pow.js";import{scalar as B}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{sqrt as R}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sqrt.js";import{square as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/square.js";import{sub as F}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";import{zerosLike as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/zeros_like.js";import{Optimizer as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/optimizers/optimizer.js";var y=class extends k{static get className(){return"Adam"}constructor(t,a,s,e=null){super(),this.learningRate=t,this.beta1=a,this.beta2=s,this.epsilon=e,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],o(()=>{this.accBeta1=B(a).variable(),this.accBeta2=B(s).variable()}),e==null&&(this.epsilon=f.backend.epsilon())}applyGradients(t){let a=Array.isArray(t)?t.map(s=>s.name):Object.keys(t);o(()=>{let s=F(1,this.accBeta1),e=F(1,this.accBeta2);a.forEach((c,i)=>{let r=f.registeredVariables[c],u=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${c}/m`,variable:o(()=>S(r).variable(u))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${c}/v`,variable:o(()=>S(r).variable(u))});let l=Array.isArray(t)?t[i].tensor:t[c];if(l==null)return;let d=this.accumulatedFirstMoment[i].variable,b=this.accumulatedSecondMoment[i].variable,p=m(n(d,this.beta1),n(l,1-this.beta1)),M=m(n(b,this.beta2),n(I(l),1-this.beta2)),N=h(p,s),A=h(M,e);d.assign(p),b.assign(M);let C=m(n(h(N,m(R(A),this.epsilon)),-this.learningRate),r);r.assign(C)}),this.accBeta1.assign(n(this.accBeta1,this.beta1)),this.accBeta2.assign(n(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&g(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedSecondMoment!=null&&g(this.accumulatedSecondMoment.map(t=>t.variable))}async getWeights(){let t=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(t.map(a=>({name:a.originalName,tensor:a.variable})))}async setWeights(t){t=await this.extractIterations(t),o(()=>{this.accBeta1.assign(v(this.beta1,this.iterations_+1)),this.accBeta2.assign(v(this.beta2,this.iterations_+1))});let a=t.length/2,s=!1;this.accumulatedFirstMoment=t.slice(0,a).map(e=>({originalName:e.name,variable:e.tensor.variable(s)})),this.accumulatedSecondMoment=t.slice(a,a*2).map(e=>({originalName:e.name,variable:e.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(t,a){return new t(a.learningRate,a.beta1,a.beta2,a.epsilon)}};export{y as AdamOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/adam_optimizer.js:
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
//# sourceMappingURL=adam_optimizer.js.map