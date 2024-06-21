/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/optimizers/adagrad_optimizer) denonext production */
import{ENGINE as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{dispose as p,tidy as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/globals.js";import{add as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{div as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{fill as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/fill.js";import{mul as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{sqrt as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sqrt.js";import{square as A}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/square.js";import{Optimizer as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/optimizer.js";var m=class extends y{static get className(){return"Adagrad"}constructor(a,r=.1){super(),this.learningRate=a,this.initialAccumulatorValue=r,this.accumulatedGrads=[]}applyGradients(a){(Array.isArray(a)?a.map(t=>t.name):Object.keys(a)).forEach((t,i)=>{let e=o.registeredVariables[t];this.accumulatedGrads[i]==null&&(this.accumulatedGrads[i]={originalName:`${t}/accumulator`,variable:u(()=>f(e.shape,this.initialAccumulatorValue).variable(!1))});let s=Array.isArray(a)?a[i].tensor:a[t];if(s==null)return;let c=this.accumulatedGrads[i].variable;u(()=>{let l=n(c,A(s));c.assign(l);let d=n(g(h(s,b(n(l,o.backend.epsilon()))),-this.learningRate),e);e.assign(d)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&p(this.accumulatedGrads.map(a=>a.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(a=>({name:a.originalName,tensor:a.variable})))}async setWeights(a){a=await this.extractIterations(a);let r=!1;this.accumulatedGrads=a.map(t=>({originalName:t.name,variable:t.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(a,r){return new a(r.learningRate,r.initialAccumulatorValue)}};export{m as AdagradOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/adagrad_optimizer.js:
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
//# sourceMappingURL=adagrad_optimizer.js.map