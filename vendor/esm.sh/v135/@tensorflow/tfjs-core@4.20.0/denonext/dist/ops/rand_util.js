/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/rand_util) denonext production */
import*as h from"/v135/seedrandom@3.0.5/denonext/seedrandom.mjs";import{expectNumbersClose as d,testEpsilon as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/test_util.js";var o=class{constructor(t,n,r,e,a){this.mean=t,this.stdDev=n,this.dtype=r,this.nextVal=NaN,this.truncated=e,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);let i=a||Math.random();this.random=h.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){let e=this.nextVal;return this.nextVal=NaN,e}let t,n,r=!1;for(;!r;){let e,a,i;do e=2*this.random()-1,a=2*this.random()-1,i=e*e+a*a;while(i>=1||i===0);let u=Math.sqrt(-2*Math.log(i)/i);t=this.mean+this.stdDev*e*u,n=this.mean+this.stdDev*a*u,(!this.truncated||this.isValidTruncated(t))&&(r=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}},c=class{constructor(t,n,r,e){this.alpha=t,this.beta=1/n,this.dtype=r;let a=e||Math.random();this.randu=h.alea(a.toString()),this.randn=new o(0,1,r,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,n,r,e,a,i;for(;;){do e=this.randn.nextValue(),i=1+this.c*e;while(i<=0);if(i*=i*i,t=e*e,n=1-.331*t*t,r=.5*t+this.d*(1-i+Math.log(i)),a=this.randu(),a<n||Math.log(a)<r)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}},f=class{constructor(t=0,n=1,r,e){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=n-t,this.dtype=r,e==null&&(e=Math.random()),typeof e=="number"&&(e=e.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${n} <= 1 and dtype is not float`);this.random=h.alea(e)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}};function g(s){let t=s.length,n=w(s),r=M(s),e=t/6*(Math.pow(n,2)+.25*Math.pow(r-3,2));if(e>5.991)throw new Error(`Invalid p-value for JB: ${e}`)}function x(s,t,n,r){r==null&&(r=p());let e=l(s);d(e,t,r),d(m(s,e),n,r)}function l(s){let t=0;for(let n=0;n<s.length;n++)t+=s[n];return t/s.length}function m(s,t){let n=0;for(let r=0;r<s.length;r++){let e=s[r]-t;n+=e*e}return Math.sqrt(n/s.length)}function M(s){let t=l(s),n=s.length,r=0,e=0;for(let a=0;a<n;a++){let i=s[a]-t;r+=Math.pow(i,2),e+=Math.pow(i,4)}return 1/n*e/Math.pow(1/n*r,2)}function w(s){let t=l(s),n=s.length,r=0,e=0;for(let a=0;a<n;a++){let i=s[a]-t;r+=Math.pow(i,2),e+=Math.pow(i,3)}return 1/n*e/Math.pow(1/(n-1)*r,3/2)}export{o as MPRandGauss,c as RandGamma,f as UniformRandom,x as expectArrayInMeanStdRange,g as jarqueBeraNormalityTest};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/rand_util.js:
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
//# sourceMappingURL=rand_util.js.map