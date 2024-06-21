/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/optimizers/optimizer) denonext production */
import{dispose as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/globals.js";import{variableGrads as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/gradients.js";import{scalar as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops.js";import{Serializable as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/serialization.js";var n=class extends u{minimize(t,i=!1,s){let{value:a,grads:r}=this.computeGradients(t,s);if(s!=null){let m=s.map(o=>({name:o.name,tensor:r[o.name]}));this.applyGradients(m)}else this.applyGradients(r);return l(r),i?a:(a.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(t,i){return h(t,i)}dispose(){this.iterations_!=null&&l(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:p(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(t){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(t){return this.iterations_=(await t[0].tensor.data())[0],t.slice(1)}};Object.defineProperty(n,Symbol.hasInstance,{value:e=>e.minimize!=null&&e.computeGradients!=null&&e.applyGradients!=null});export{n as Optimizer};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/optimizers/optimizer.js:
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
//# sourceMappingURL=optimizer.js.map