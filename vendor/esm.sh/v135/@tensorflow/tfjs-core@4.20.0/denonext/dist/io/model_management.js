/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/model_management) denonext production */
import{assert as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{IORouterRegistry as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/io/router_registry.js";var r="://",s=class e{constructor(){this.managers={}}static getInstance(){return e.instance==null&&(e.instance=new e),e.instance}static registerManager(n,t){o(n!=null,()=>"scheme must not be undefined or null."),n.endsWith(r)&&(n=n.slice(0,n.indexOf(r))),o(n.length>0,()=>"scheme must not be an empty string.");let a=e.getInstance();o(a.managers[n]==null,()=>`A model store manager is already registered for scheme '${n}'.`),a.managers[n]=t}static getManager(n){let t=e.getInstance().managers[n];if(t==null)throw new Error(`Cannot find model manager for scheme '${n}'`);return t}static getSchemes(){return Object.keys(e.getInstance().managers)}};function l(e){if(e.indexOf(r)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${s.getSchemes().join(",")}`);return{scheme:e.split(r)[0],path:e.split(r)[1]}}async function u(e,n,t=!1){o(e!==n,()=>`Old path and new path are the same: '${e}'`);let a=f.getLoadHandlers(e);o(a.length>0,()=>`Copying failed because no load handler is found for source URL ${e}.`),o(a.length<2,()=>`Copying failed because more than one (${a.length}) load handlers for source URL ${e}.`);let i=a[0],c=f.getSaveHandlers(n);o(c.length>0,()=>`Copying failed because no save handler is found for destination URL ${n}.`),o(c.length<2,()=>`Copying failed because more than one (${a.length}) save handlers for destination URL ${n}.`);let h=c[0],d=l(e).scheme,g=l(e).path,m=d===l(e).scheme,p=await i.load();t&&m&&await s.getManager(d).removeModel(g);let M=await h.save(p);return t&&!m&&await s.getManager(d).removeModel(g),M.modelArtifactsInfo}async function w(){let e=s.getSchemes(),n={};for(let t of e){let a=await s.getManager(t).listModels();for(let i in a){let c=t+r+i;n[c]=a[i]}}return n}async function S(e){let n=l(e);return s.getManager(n.scheme).removeModel(n.path)}async function $(e,n){return u(e,n,!1)}async function I(e,n){return u(e,n,!0)}export{s as ModelStoreManagerRegistry,$ as copyModel,w as listModels,I as moveModel,S as removeModel};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/model_management.js:
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
//# sourceMappingURL=model_management.js.map