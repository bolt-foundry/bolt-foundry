/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/optimizers/momentum_optimizer) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{dispose as f,tidy as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/globals.js";import{add as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{mul as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{scalar as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{zerosLike as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/zeros_like.js";import{SGDOptimizer as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/sgd_optimizer.js";var h=class extends b{static get className(){return"Momentum"}constructor(t,e,s=!1){super(t),this.learningRate=t,this.momentum=e,this.useNesterov=s,this.accumulations=[],this.m=g(this.momentum)}applyGradients(t){(Array.isArray(t)?t.map(s=>s.name):Object.keys(t)).forEach((s,a)=>{let i=p.registeredVariables[s];this.accumulations[a]==null&&(this.accumulations[a]={originalName:`${s}/momentum`,variable:l(()=>N(i).variable(!1))});let c=this.accumulations[a].variable,n=Array.isArray(t)?t[a].tensor:t[s];n!=null&&l(()=>{let r,u=m(o(this.m,c),n);this.useNesterov?r=m(o(this.c,m(n,o(u,this.m))),i):r=m(o(this.c,u),i),c.assign(u),i.assign(r)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&f(this.accumulations.map(t=>t.variable))}setMomentum(t){this.momentum=t}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);let e=!1;this.accumulations=t.map(s=>({originalName:s.name,variable:s.tensor.variable(e)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(t,e){return new t(e.learningRate,e.momentum,e.useNesterov)}};export{h as MomentumOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/momentum_optimizer.js:
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
//# sourceMappingURL=momentum_optimizer.js.map