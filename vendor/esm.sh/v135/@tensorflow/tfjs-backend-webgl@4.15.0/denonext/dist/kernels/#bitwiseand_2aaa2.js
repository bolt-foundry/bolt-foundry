/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BitwiseAnd) denonext production */
import{BitwiseAnd as g,env as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BinaryOpProgram as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_gpu.js";import{BinaryOpPackedProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";import{bitwiseAndImplCPU as A}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";var P=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,B=`
  return float(int(a.r) & int(b.r));
`;function N(s){let{inputs:i,backend:e}=s,{a:t,b:a}=i,p=o().getBool("WEBGL_PACK_BINARY_OPERATIONS"),u=o().getNumber("WEBGL_VERSION");if(e.shouldExecuteOnCPU([t,a])||u===1){let c=e.texData.get(t.dataId).values,b=e.texData.get(a.dataId).values,[d,m]=A(t.shape,a.shape,c,b,t.dtype),r=e.makeTensorInfo(m,t.dtype),l=e.texData.get(r.dataId);return l.values=d,r}let n;return p?n=new f(P,t.shape,a.shape,!1):n=new I(B,t.shape,a.shape),e.runWebGLProgram(n,[t,a],t.dtype)}var k={kernelName:g,backendName:"webgl",kernelFunc:N};export{P as BITWISEAND,B as BITWISEAND_UNPACKED,N as bitwiseAnd,k as bitwiseAndConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BitwiseAnd.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=BitwiseAnd.js.map