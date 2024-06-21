/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/optimizers/adadelta_optimizer) denonext production */
import{ENGINE as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{dispose as p,tidy as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/globals.js";import{add as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{div as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/div.js";import{mul as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{sqrt as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops.js";import{square as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/square.js";import{zerosLike as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/zeros_like.js";import{Optimizer as G}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/optimizers/optimizer.js";var v=class extends G{static get className(){return"Adadelta"}constructor(a,t,s=null){super(),this.learningRate=a,this.rho=t,this.epsilon=s,this.accumulatedGrads=[],this.accumulatedUpdates=[],s==null&&(this.epsilon=h.backend.epsilon())}applyGradients(a){(Array.isArray(a)?a.map(s=>s.name):Object.keys(a)).forEach((s,e)=>{let c=h.registeredVariables[s],u=!1;this.accumulatedGrads[e]==null&&(this.accumulatedGrads[e]={originalName:`${s}/accum_grad`,variable:m(()=>b(c).variable(u))}),this.accumulatedUpdates[e]==null&&(this.accumulatedUpdates[e]={originalName:`${s}/accum_var`,variable:m(()=>b(c).variable(u))});let l=Array.isArray(a)?a[e].tensor:a[s];if(l==null)return;let n=this.accumulatedGrads[e].variable,o=this.accumulatedUpdates[e].variable;m(()=>{let N=i(r(n,this.rho),r(g(l),1-this.rho)),d=r(A(f(i(o,this.epsilon)),f(i(n,this.epsilon))),l),U=i(r(o,this.rho),r(g(d),1-this.rho));n.assign(N),o.assign(U);let y=i(r(d,-this.learningRate),c);c.assign(y)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(p(this.accumulatedGrads.map(a=>a.variable)),p(this.accumulatedUpdates.map(a=>a.variable)))}async getWeights(){let a=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(a.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(a){a=await this.extractIterations(a);let t=a.length/2,s=!1;this.accumulatedGrads=a.slice(0,t).map(e=>({originalName:e.name,variable:e.tensor.variable(s)})),this.accumulatedUpdates=a.slice(t,t*2).map(e=>({originalName:e.name,variable:e.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(a,t){return new a(t.learningRate,t.rho,t.epsilon)}};export{v as AdadeltaOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/adadelta_optimizer.js:
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
//# sourceMappingURL=adadelta_optimizer.js.map