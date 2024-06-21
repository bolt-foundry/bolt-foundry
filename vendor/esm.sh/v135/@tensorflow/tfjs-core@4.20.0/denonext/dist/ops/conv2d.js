/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/conv2d) denonext production */
import{ENGINE as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Conv2D as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import*as t from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/conv_util.js";import{op as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function _(m,d,i,l,u="NHWC",a=[1,1],c){let o=f(m,"x","conv2d","float32"),n=f(d,"filter","conv2d","float32"),e=o,p=!1;o.rank===3&&(p=!0,e=v(o,[1,o.shape[0],o.shape[1],o.shape[2]])),r.assert(e.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${e.rank}.`),r.assert(n.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${n.rank}.`),t.checkPadOnDimRoundingMode("conv2d",l,c);let h=u==="NHWC"?e.shape[3]:e.shape[1];r.assert(h===n.shape[2],()=>`Error in conv2d: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),r.assert(t.eitherStridesOrDilationsAreOne(i,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${i} and dilations '${a}'`),r.assert(t.stridesOrDilationsArePositive(a),()=>"Error in conv2D: Dilated rates should be larger than 0."),r.assert(t.stridesOrDilationsArePositive(i),()=>"Error in conv2D: Strides should be larger than 0.");let D={x:e,filter:n},k={strides:i,pad:l,dataFormat:u,dilations:a,dimRoundingMode:c},s=E.runKernel($,D,k);return p?v(s,[s.shape[1],s.shape[2],s.shape[3]]):s}var C=b({conv2d_:_});export{C as conv2d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/conv2d.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=conv2d.js.map