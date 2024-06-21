/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/canvas_util) denonext production */
import{env as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var n={},o={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function u(t){delete n[t]}function d(t,l){n[t]=l}function f(t,l){if(!(t in n)||l!=null){let a=i(t,l);if(a!==null)n[t]=a;else return console.log("Could not get context for WebGL version",t),null}let e=n[t];return e==null||e.isContextLost()?(delete n[t],f(t)):(e.disable(e.DEPTH_TEST),e.disable(e.STENCIL_TEST),e.disable(e.BLEND),e.disable(e.DITHER),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SAMPLE_COVERAGE),e.enable(e.SCISSOR_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),n[t])}function c(t){if(!r().getBool("IS_SAFARI")&&typeof OffscreenCanvas<"u"&&t===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function i(t,l){if(t!==1&&t!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");let e=l??c(t);return e.addEventListener("webglcontextlost",a=>{a.preventDefault(),delete n[t]},!1),r().getBool("SOFTWARE_WEBGL_ENABLED")&&(o.failIfMajorPerformanceCaveat=!1),t===1?e.getContext("webgl",o)||e.getContext("experimental-webgl",o):e.getContext("webgl2",o)}export{u as clearWebGLContext,f as getWebGLContext,d as setWebGLContext};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/canvas_util.js:
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
//# sourceMappingURL=canvas_util.js.map