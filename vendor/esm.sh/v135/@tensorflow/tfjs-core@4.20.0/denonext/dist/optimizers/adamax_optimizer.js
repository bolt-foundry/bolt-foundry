/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/optimizers/adamax_optimizer) denonext production */
import{ENGINE as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{dispose as b,tidy as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/globals.js";import{abs as A}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/abs.js";import{add as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{div as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{maximum as F}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/maximum.js";import{mul as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{scalar as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{sub as B}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{zerosLike as W}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/zeros_like.js";import{Optimizer as x}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/optimizer.js";var w=class extends x{static get className(){return"Adamax"}constructor(t,e,r,o=null,a=0){super(),this.learningRate=t,this.beta1=e,this.beta2=r,this.epsilon=o,this.decay=a,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],y(()=>{this.iteration=N(0).variable(),this.accBeta1=N(e).variable()}),o==null&&(this.epsilon=g.backend.epsilon())}applyGradients(t){let e=Array.isArray(t)?t.map(r=>r.name):Object.keys(t);y(()=>{let r=B(1,this.accBeta1),o=l(-this.learningRate,n(s(this.iteration,this.decay),1));e.forEach((a,i)=>{let m=g.registeredVariables[a],h=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${a}/m`,variable:W(m).variable(h)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${a}/v`,variable:W(m).variable(h)});let c=Array.isArray(t)?t[i].tensor:t[a];if(c==null)return;let u=this.accumulatedFirstMoment[i].variable,d=this.accumulatedWeightedInfNorm[i].variable,p=n(s(u,this.beta1),s(c,1-this.beta1)),I=s(d,this.beta2),v=A(c),f=F(I,v);u.assign(p),d.assign(f);let M=n(s(l(o,r),l(p,n(f,this.epsilon))),m);m.assign(M)}),this.iteration.assign(n(this.iteration,1)),this.accBeta1.assign(s(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&b(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedWeightedInfNorm!=null&&b(this.accumulatedWeightedInfNorm.map(t=>t.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(t){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(t,e){return new t(e.learningRate,e.beta1,e.beta2,e.epsilon,e.decay)}};export{w as AdamaxOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/adamax_optimizer.js:
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
//# sourceMappingURL=adamax_optimizer.js.map