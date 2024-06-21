/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/optimizers/sgd_optimizer) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{keep as m,tidy as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/globals.js";import{add as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{mul as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{scalar as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{Optimizer as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/optimizer.js";var n=class extends l{static get className(){return"SGD"}constructor(t){super(),this.learningRate=t,this.setLearningRate(t)}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,o)=>{let e=Array.isArray(t)?t[o].tensor:t[r];if(e==null)return;let i=c.registeredVariables[r];h(()=>{let a=p(g(this.c,e),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(t){this.learningRate=t,this.c!=null&&this.c.dispose(),this.c=m(f(-t))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(t){if(t=await this.extractIterations(t),t.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(t,s){return new t(s.learningRate)}};export{n as SGDOptimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/sgd_optimizer.js:
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
//# sourceMappingURL=sgd_optimizer.js.map