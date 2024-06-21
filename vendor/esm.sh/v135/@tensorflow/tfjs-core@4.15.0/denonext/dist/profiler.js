/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/profiler) denonext production */
import{env as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/environment.js";import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";var k=class{constructor(n,e){this.backendTimer=n,this.logger=e,e==null&&(this.logger=new p)}profileKernel(n,e,r){let t,i=()=>{t=r()},l,c=s.now();if(this.backendTimer.timerAvailable())l=this.backendTimer.time(i);else{i();for(let o of t)o.dataSync();l=Promise.resolve({kernelMs:s.now()-c})}if(b().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let o=0;o<t.length;o++){let u=t[o];u.data().then(h=>{x(h,u.dtype,n)})}return{kernelName:n,outputs:t,inputs:e,timeMs:l.then(o=>o.kernelMs),extraInfo:l.then(o=>o.getExtraProfileInfo!=null?o.getExtraProfileInfo():"")}}logKernelProfile(n){let{kernelName:e,outputs:r,timeMs:t,inputs:i,extraInfo:l}=n;r.forEach(c=>{Promise.all([c.data(),t,l]).then(a=>{this.logger.logKernelProfile(e,c,a[0],a[1],i,a[2])})})}};function x(f,n,e){if(n!=="float32")return!1;for(let r=0;r<f.length;r++){let t=f[r];if(isNaN(t)||!isFinite(t))return console.warn(`Found ${t} in the result of '${e}'`),!0}return!1}var p=class{logKernelProfile(n,e,r,t,i,l){let c=typeof t=="number"?s.rightPad(`${t}ms`,9):t.error,a=s.rightPad(n,25),o=e.rank,u=e.size,h=s.rightPad(e.shape.toString(),14),g="";for(let m in i){let d=i[m];if(d!=null){let $=d.shape||e.shape,P=$.length;g+=`${m}: ${P}D ${P>0?$:""} `}}console.log(`%c${a}	%c${c}	%c${o}D ${h}	%c${u}	%c${g}	%c${l}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};export{p as Logger,k as Profiler,x as checkComputationForErrors};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/profiler.js:
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
//# sourceMappingURL=profiler.js.map