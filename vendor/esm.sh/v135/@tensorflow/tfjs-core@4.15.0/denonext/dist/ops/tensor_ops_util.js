/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/tensor_ops_util) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{isWebGLData as g,isWebGPUData as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/types.js";import{assert as f,assertNonNegativeIntegerDimensions as w,flatten as A,inferDtype as D,isTypedArray as c,sizeFromShape as i,toTypedArray as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function G(r,o,n,t){if(t==null)t=D(r);else if(t==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(y(r)||g(r)){if(t!=="float32"&&t!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${t}.`);return m.backend.createTensorFromGPUData(r,o||n,t)}if(!c(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(o!=null){w(o);let s=i(o),a=i(n);f(s===a,()=>`Based on the provided shape, [${o}], the tensor should have ${s} values but has ${a}`);for(let e=0;e<n.length;++e){let l=n[e],b=e===n.length-1?l!==i(o.slice(e)):!0;f(n[e]===o[e]||!b,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${o}). `)}}return!c(r)&&!Array.isArray(r)&&(r=[r]),o=o||n,r=t!=="string"?T(r,t):A(r,[],!0),m.makeTensor(r,o,t)}export{G as makeTensor};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/tensor_ops_util.js:
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
//# sourceMappingURL=tensor_ops_util.js.map