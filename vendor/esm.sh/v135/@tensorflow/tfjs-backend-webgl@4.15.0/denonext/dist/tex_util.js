/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/tex_util) denonext production */
import{env as u,util as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var L;(function(t){t[t.DENSE=0]="DENSE",t[t.SHARED_BATCH=1]="SHARED_BATCH"})(L||(L={}));var R;(function(t){t[t.RENDER=0]="RENDER",t[t.UPLOAD=1]="UPLOAD",t[t.PIXELS=2]="PIXELS",t[t.DOWNLOAD=3]="DOWNLOAD"})(R||(R={}));var S;(function(t){t[t.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",t[t.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",t[t.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",t[t.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",t[t.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(S||(S={}));function N(t,o){return[o,t]}function m(t,o){return t*o}function p(t,o){return[o*4,t]}function C(t){let o=f.sizeFromShape(t),r=Math.ceil(o/4);return f.sizeToSquarishShape(r)}function h(t,o){if(t%o!==0)throw new Error(`unpackedSize (${t}) must be a multiple of ${o}`);return t/o}function B(t,o,r){let e=t.length*r/4;if(o.length<e)throw new Error(`matrix length (${o.length}) must be >= ${e}`);let a=0;for(let n=0;n<t.length;n+=4)for(let A=0;A<r;A++)o[a++]=t[n+A]}function O(t,o){return[Math.max(1,Math.ceil(o/2)),Math.max(1,Math.ceil(t/2))]}function c(t,o){let[r,e]=O(t,o);return r*e*4}function G(t,o){let r=t,e,a,n,A,i,F,l,E,D,_;return u().getNumber("WEBGL_VERSION")===2?(e=r.R32F,a=r.R16F,n=r.RGBA16F,A=r.RGBA32F,i=r.RED,l=4,E=1,D=r.HALF_FLOAT,_=r.FLOAT,F=r.RGBA8):(e=t.RGBA,a=t.RGBA,n=t.RGBA,A=r.RGBA,i=t.RGBA,l=4,E=4,D=o!=null?o.HALF_FLOAT_OES:null,_=t.FLOAT,F=t.RGBA),{internalFormatFloat:e,internalFormatHalfFloat:a,internalFormatPackedHalfFloat:n,internalFormatPackedFloat:A,textureFormatFloat:i,downloadTextureFormat:F,downloadUnpackNumChannels:l,defaultNumChannels:E,textureTypeHalfFloat:D,textureTypeFloat:_}}export{L as PackingScheme,S as PhysicalTextureType,R as TextureUsage,B as decodeMatrixFromUnpackedColorRGBAArray,p as getColorMatrixTextureShapeWidthHeight,C as getDenseTexShape,h as getMatrixSizeFromUnpackedArraySize,O as getPackedMatrixTextureShapeWidthHeight,c as getPackedRGBAArraySizeFromMatrixShape,G as getTextureConfig,m as getUnpackedArraySizeFromMatrixSize,N as getUnpackedMatrixTextureShapeWidthHeight};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/tex_util.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=tex_util.js.map