/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/optimizers/optimizer_constructors) denonext production */
import{AdadeltaOptimizer as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/adadelta_optimizer.js";import{AdagradOptimizer as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/adagrad_optimizer.js";import{AdamOptimizer as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/adam_optimizer.js";import{AdamaxOptimizer as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/adamax_optimizer.js";import{MomentumOptimizer as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/momentum_optimizer.js";import{RMSPropOptimizer as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/rmsprop_optimizer.js";import{SGDOptimizer as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/optimizers/sgd_optimizer.js";var i=class{static sgd(r){return new s(r)}static momentum(r,t,m=!1){return new l(r,t,m)}static rmsprop(r,t=.9,m=0,a=null,e=!1){return new u(r,t,m,a,e)}static adam(r=.001,t=.9,m=.999,a=null){return new p(r,t,m,a)}static adadelta(r=.001,t=.95,m=null){return new n(r,t,m)}static adamax(r=.002,t=.9,m=.999,a=null,e=0){return new d(r,t,m,a,e)}static adagrad(r,t=.1){return new o(r,t)}};export{i as OptimizerConstructors};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/optimizer_constructors.js:
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
//# sourceMappingURL=optimizer_constructors.js.map