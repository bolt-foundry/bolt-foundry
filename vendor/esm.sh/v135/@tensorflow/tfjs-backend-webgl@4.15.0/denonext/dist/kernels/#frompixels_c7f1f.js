/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/FromPixels) denonext production */
import{env as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{FromPixels as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{TextureUsage as L}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/tex_util.js";import{FromPixelsProgram as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/FromPixels_utils/from_pixels_gpu.js";import{FromPixelsPackedProgram as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/FromPixels_utils/from_pixels_packed_gpu.js";var A={kernelName:E,backendName:"webgl",kernelFunc:_},o,r=s().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function _(c){let{inputs:g,backend:t,attrs:f}=c,{pixels:e}=g,{numChannels:u}=f,m=typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement,p=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,[n,a]=m?[e.videoWidth,e.videoHeight]:[e.width,e.height],x=[a,n],l=[a,n,u];if(p||m){let d=s().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(o==null||d!==r)&&(r=d,o=document.createElement("canvas").getContext("2d",{willReadFrequently:r})),o.canvas.width=n,o.canvas.height=a,o.drawImage(e,0,0,n,a),e=o.canvas}let i=t.makeTensorInfo(x,"int32");t.texData.get(i.dataId).usage=L.PIXELS,t.gpgpu.uploadPixelDataToTexture(t.getTexture(i.dataId),e);let P=s().getBool("WEBGL_PACK")?new T(l):new I(l),h=t.runWebGLProgram(P,[i],"int32");return t.disposeData(i.dataId),h}export{A as fromPixelsConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=FromPixels.js.map