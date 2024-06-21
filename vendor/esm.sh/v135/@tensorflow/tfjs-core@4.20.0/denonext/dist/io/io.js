/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/io) denonext production */
import"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/indexed_db.js";import"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/local_storage.js";import{browserFiles as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/browser_files.js";import{browserHTTPRequest as m,http as s,isHTTPScheme as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/http.js";import{concatenateArrayBuffers as f,decodeWeights as c,decodeWeightsStream as p,encodeWeights as g,getModelArtifactsForJSON as l,getModelArtifactsForJSONSync as S,getModelArtifactsInfoForJSON as n,getWeightSpecs as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/io_utils.js";import{fromMemory as M,fromMemorySync as v,withSaveHandler as H,withSaveHandlerSync as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/passthrough.js";import{getLoadHandlers as A,getSaveHandlers as F,registerLoadRouter as W,registerSaveRouter as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/router_registry.js";import{loadWeights as L,weightsLoaderFactory as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/weights_loader.js";import{CompositeArrayBuffer as R}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/composite_array_buffer.js";import{copyModel as B,listModels as P,moveModel as q,removeModel as C}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/model_management.js";export{R as CompositeArrayBuffer,t as browserFiles,m as browserHTTPRequest,f as concatenateArrayBuffers,B as copyModel,c as decodeWeights,p as decodeWeightsStream,g as encodeWeights,M as fromMemory,v as fromMemorySync,A as getLoadHandlers,l as getModelArtifactsForJSON,S as getModelArtifactsForJSONSync,n as getModelArtifactsInfoForJSON,F as getSaveHandlers,h as getWeightSpecs,s as http,a as isHTTPScheme,P as listModels,L as loadWeights,q as moveModel,W as registerLoadRouter,T as registerSaveRouter,C as removeModel,N as weightsLoaderFactory,H as withSaveHandler,u as withSaveHandlerSync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/io.js:
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
//# sourceMappingURL=io.js.map