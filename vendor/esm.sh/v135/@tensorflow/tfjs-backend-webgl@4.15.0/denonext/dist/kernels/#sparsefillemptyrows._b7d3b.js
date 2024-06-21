/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SparseFillEmptyRows) denonext production */
import{SparseFillEmptyRows as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{sparseFillEmptyRowsImplCPU as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function b(d){let{inputs:l,backend:e}=d,{indices:a,values:t,denseShape:s,defaultValue:n}=l;if(s.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${s.shape}`);if(a.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${a.shape}`);if(t.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${t.shape}`);if(n.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${n.shape}`);let c=e.readSync(a.dataId),u=e.readSync(t.dataId),h=e.readSync(s.dataId),i=e.readSync(n.dataId)[0],[m,r,w,o,p]=I(c,a.shape,a.dtype,u,t.dtype,h,i);return[e.makeTensorInfo(r,a.dtype,m),e.makeTensorInfo([r[0]],t.dtype,w),e.makeTensorInfo([o.length],"bool",new Uint8Array(o.map(y=>Number(y)))),e.makeTensorInfo([p.length],a.dtype,new Int32Array(p))]}var E={kernelName:f,backendName:"webgl",kernelFunc:b};export{b as sparseFillEmptyRows,E as sparseFillEmptyRowsConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseFillEmptyRows.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=SparseFillEmptyRows.js.map