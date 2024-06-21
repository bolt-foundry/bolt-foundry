/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/router_registry) denonext production */
var s=class e{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return e.instance==null&&(e.instance=new e),e.instance}static registerSaveRouter(t){e.getInstance().saveRouters.push(t)}static registerLoadRouter(t){e.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return e.getHandlers(t,"save")}static getLoadHandlers(t,r){return e.getHandlers(t,"load",r)}static getHandlers(t,r,o){let a=[];return(r==="load"?e.getInstance().loadRouters:e.getInstance().saveRouters).forEach(c=>{let n=c(t,o);n!==null&&a.push(n)}),a}},u=e=>s.registerSaveRouter(e),l=e=>s.registerLoadRouter(e),g=e=>s.getSaveHandlers(e),i=(e,t)=>s.getLoadHandlers(e,t);export{s as IORouterRegistry,i as getLoadHandlers,g as getSaveHandlers,l as registerLoadRouter,u as registerSaveRouter};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/router_registry.js:
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
//# sourceMappingURL=router_registry.js.map