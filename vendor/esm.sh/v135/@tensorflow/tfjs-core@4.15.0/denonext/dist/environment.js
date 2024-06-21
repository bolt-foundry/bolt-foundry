/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/environment) denonext production */
import{isPromise as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";var o="tfjsflags",n=class{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=h,this.populateURLFlags()}setPlatform(t,s){this.platform!=null&&(l().getBool("IS_TEST")||l().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=s}registerFlag(t,s,r){if(this.flagRegistry[t]={evaluationFn:s,setHook:r},this.urlFlags[t]!=null){let i=this.urlFlags[t];l().getBool("IS_TEST")||l().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${i}.`),this.set(t,i)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];let s=this.evaluateFlag(t);if(g(s))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=s,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,s){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=s,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(s)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let t=this.getQueryParams(this.global.location.search);o in t&&t[o].split(",").forEach(r=>{let[i,u]=r.split(":");this.urlFlags[i]=c(i,u)})}};function h(e){let t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(s,...r)=>(f(t,r[0],r[1]),r.join("="))),t}function f(e,t,s){e[decodeURIComponent(t)]=decodeURIComponent(s||"")}function c(e,t){let s=t.toLowerCase();return s==="true"||s==="false"?s==="true":`${+s}`===s?+s:t}function l(){return a}var a=null;function y(e){a=e}export{a as ENV,n as Environment,l as env,h as getQueryParams,y as setEnvironmentGlobal};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/environment.js:
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
//# sourceMappingURL=environment.js.map