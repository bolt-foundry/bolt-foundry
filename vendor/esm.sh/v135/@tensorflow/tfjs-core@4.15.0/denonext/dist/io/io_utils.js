/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/io/io_utils) denonext production */
import __Process$ from "node:process";
import { Buffer as __Buffer$ } from "node:buffer";
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var Y=class{refCount(t){return T("refCount")}incRef(t){return T("incRef")}timerAvailable(){return!0}time(t){return T("time")}read(t){return T("read")}readSync(t){return T("readSync")}readToGPU(t,n){return T("readToGPU")}numDataIds(){return T("numDataIds")}disposeData(t,n){return T("disposeData")}write(t,n,r){return T("write")}move(t,n,r,o,s){return T("move")}createTensorFromGPUData(t,n,r){return T("createTensorFromGPUData")}memory(){return T("memory")}floatPrecision(){return T("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return T("dispose")}};function T(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function w(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function St(e,t,n=""){w(z(e,t),()=>n+` Shapes ${e} and ${t} must match`)}function k(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function z(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function M(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function Tt(e,t){for(let n=0;n<e.length;n++){let r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function _(e){if(e==="float32"||e==="int32")return 4;if(e==="complex64")return 8;if(e==="bool")return 1;throw new Error(`Unknown dtype ${e}`)}function It(e){if(e==null)return 0;let t=0;return e.forEach(n=>t+=n.length),t}function V(e){return typeof e=="string"||e instanceof String}function le(e){return typeof e=="boolean"}function ce(e){return typeof e=="number"}function O(e){return Array.isArray(e)?O(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":ce(e)?"float32":V(e)?"string":le(e)?"bool":"float32"}function it(e){return!!(e&&e.constructor&&e.call&&e.apply)}function Z(e){let t=e.length;if(t<2)return[];let n=new Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function At(e,t,n,r=!1){let o=new Array;if(t.length===1){let s=t[0]*(r?2:1);for(let a=0;a<s;a++)o[a]=n[e+a]}else{let s=t[0],a=t.slice(1),c=a.reduce((i,l)=>i*l)*(r?2:1);for(let i=0;i<s;i++)o[i]=At(e+i*c,a,n,r)}return o}function at(e,t,n=!1){if(e.length===0)return t[0];let r=e.reduce((o,s)=>o*s)*(n?2:1);if(r===0)return[];if(r!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${n?" for a complex tensor":""}.`);return At(0,e,t,n)}function Et(e,t){let n=lt(e,t);for(let r=0;r<n.length;r++)n[r]=1;return n}function lt(e,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool")return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function Bt(e){e.forEach(t=>{w(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`)})}function P(e){return e&&e.then&&typeof e.then=="function"}var Ft="tfjsflags",Q=class{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=fe,this.populateURLFlags()}setPlatform(t,n){this.platform!=null&&(x().getBool("IS_TEST")||x().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=n}registerFlag(t,n,r){if(this.flagRegistry[t]={evaluationFn:n,setHook:r},this.urlFlags[t]!=null){let o=this.urlFlags[t];x().getBool("IS_TEST")||x().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${o}.`),this.set(t,o)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];let n=this.evaluateFlag(t);if(P(n))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=n,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,n){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=n,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(n)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let t=this.getQueryParams(this.global.location.search);Ft in t&&t[Ft].split(",").forEach(r=>{let[o,s]=r.split(":");this.urlFlags[o]=he(o,s)})}};function fe(e){let t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...r)=>(pe(t,r[0],r[1]),r.join("="))),t}function pe(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}function he(e,t){let n=t.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:t}function x(){return Dt}var Dt=null;function $t(e){Dt=e}var ct;function ut(){if(ct==null){let e;if(typeof window<"u")e=window;else if(typeof __global$<"u")e=__global$;else if(typeof __Process$<"u")e=__Process$;else if(typeof self<"u")e=self;else throw new Error("Could not find a global object");ct=e}return ct}function de(){let e=ut();return e._tfGlobals==null&&(e._tfGlobals=new Map),e._tfGlobals}function q(e,t){let n=de();if(n.has(e))return n.get(e);{let r=t();return n.set(e,r),n.get(e)}}var vt="Add";var Mt="Cast";var Pt="Complex";var Rt="Identity";function R(...e){x().getBool("IS_TEST")||x().getBool("PROD")||console.warn(...e)}var Nt=q("kernelRegistry",()=>new Map),me=q("gradRegistry",()=>new Map);function ft(e,t){let n=ye(e,t);return Nt.get(n)}function pt(e){return me.get(e)}function ht(e){let t=Nt.entries(),n=[];for(;;){let{done:r,value:o}=t.next();if(r)break;let[s,a]=o,[c]=s.split("_");c===e&&n.push(a)}return n}function ye(e,t){return`${t}_${e}`}function Ct(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}function xe(e,t){return e instanceof Float32Array&&t==="float32"||e instanceof Int32Array&&t==="int32"||e instanceof Uint8Array&&t==="bool"}function J(e,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=F(e)),x().getBool("DEBUG")&&Tt(e,t),xe(e,t))return e;if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool"){let n=new Uint8Array(e.length);for(let r=0;r<n.length;++r)Math.round(e[r])!==0&&(n[r]=1);return n}else throw new Error(`Unknown data type ${t}`)}function N(){return x().platform.now()}function Lt(e,t="utf-8"){return t=t||"utf-8",x().platform.encode(e,t)}function dt(e,t="utf-8"){return t=t||"utf-8",x().platform.decode(e,t)}function I(e){return x().platform.isTypedArray!=null?x().platform.isTypedArray(e):Ct(e)}function F(e,t=[],n=!1){if(t==null&&(t=[]),typeof e=="boolean"||typeof e=="number"||typeof e=="string"||P(e)||e==null||I(e)&&n)t.push(e);else if(Array.isArray(e)||I(e))for(let r=0;r<e.length;++r)F(e[r],t,n);else{let r=-1;for(let o of Object.keys(e))/^([1-9]+[0-9]*|0)$/.test(o)&&(r=Math.max(r,Number(o)));for(let o=0;o<=r;o++)F(e[o],t,n)}return t}var tt=class{constructor(t,n){this.backendTimer=t,this.logger=n,n==null&&(this.logger=new gt)}profileKernel(t,n,r){let o,s=()=>{o=r()},a,c=N();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(s);else{s();for(let l of o)l.dataSync();a=Promise.resolve({kernelMs:N()-c})}if(x().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<o.length;l++){let u=o[l];u.data().then(f=>{we(f,u.dtype,t)})}return{kernelName:t,outputs:o,inputs:n,timeMs:a.then(l=>l.kernelMs),extraInfo:a.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(t){let{kernelName:n,outputs:r,timeMs:o,inputs:s,extraInfo:a}=t;r.forEach(c=>{Promise.all([c.data(),o,a]).then(i=>{this.logger.logKernelProfile(n,c,i[0],i[1],s,i[2])})})}};function we(e,t,n){if(t!=="float32")return!1;for(let r=0;r<e.length;r++){let o=e[r];if(isNaN(o)||!isFinite(o))return console.warn(`Found ${o} in the result of '${n}'`),!0}return!1}var gt=class{logKernelProfile(t,n,r,o,s,a){let c=typeof o=="number"?M(`${o}ms`,9):o.error,i=M(t,25),l=n.rank,u=n.size,f=M(n.shape.toString(),14),p="";for(let m in s){let d=s[m];if(d!=null){let h=d.shape||n.shape,g=h.length;p+=`${m}: ${g}D ${g>0?h:""} `}}console.log(`%c${i}	%c${c}	%c${l}D ${f}	%c${u}	%c${p}	%c${a}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};function Gt(e,t,n){let r={},o={};for(let i=0;i<t.length;i++)r[t[i].id]=!0;for(let i=0;i<e.length;i++){let l=e[i],u=l.inputs;for(let f in u){let p=u[f],m=!1;for(let d=0;d<t.length;d++)if(r[p.id]){l.outputs.forEach(h=>r[h.id]=!0),m=!0,o[l.id]=!0;break}if(m)break}}let s={};s[n.id]=!0;let a={};for(let i=e.length-1;i>=0;i--){let l=e[i],u=l.inputs;for(let f=0;f<l.outputs.length;f++)if(s[l.outputs[f].id]){for(let p in u)s[u[p].id]=!0,a[l.id]=!0;break}}let c=[];for(let i=0;i<e.length;i++){let l=e[i];if(o[l.id]&&a[l.id]){let u={};for(let p in l.inputs){let m=l.inputs[p];r[m.id]&&(u[p]=m)}let f=Object.assign({},l);f.inputs=u,f.outputs=l.outputs,c.push(f)}}return c}function Ut(e,t,n,r){for(let o=t.length-1;o>=0;o--){let s=t[o],a=[];if(s.outputs.forEach(i=>{let l=e[i.id];l!=null?a.push(l):a.push(null)}),s.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);let c=s.gradient(a);for(let i in s.inputs){if(!(i in c))throw new Error(`Cannot backprop through input ${i}. Available gradients found: ${Object.keys(c)}.`);let l=n(()=>c[i]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${i} must have 'float32' dtype, but has '${l.dtype}'`);let u=s.inputs[i];if(!z(l.shape,u.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${i}' has shape '${l.shape}', which does not match the shape of the input '${u.shape}'`);if(e[u.id]==null)e[u.id]=l;else{let f=e[u.id];e[u.id]=r(f,l),f.dispose()}}}}var zt=20,j=3,mt=7;function _t(e,t,n,r){let o=Z(t),s=be(e,t,n,o),a=t.length,c=et(e,t,n,o,s),i=["Tensor"];return r&&(i.push(`  dtype: ${n}`),i.push(`  rank: ${a}`),i.push(`  shape: [${t}]`),i.push("  values:")),i.push(c.map(l=>"    "+l).join(`
`)),i.join(`
`)}function be(e,t,n,r){let o=k(t),s=r[r.length-1],a=new Array(s).fill(0),c=t.length,i=n==="complex64"?W(e):e;if(c>1)for(let l=0;l<o/s;l++){let u=l*s;for(let f=0;f<s;f++)a[f]=Math.max(a[f],K(i[u+f],0,n).length)}return a}function K(e,t,n){let r;return Array.isArray(e)?r=`${parseFloat(e[0].toFixed(mt))} + ${parseFloat(e[1].toFixed(mt))}j`:V(e)?r=`'${e}'`:n==="bool"?r=Vt(e):r=parseFloat(e.toFixed(mt)).toString(),M(r,t)}function Vt(e){return e===0?"false":"true"}function et(e,t,n,r,o,s=!0){let a=n==="complex64"?2:1,c=t[0],i=t.length;if(i===0){if(n==="complex64"){let h=W(e);return[K(h[0],0,n)]}return n==="bool"?[Vt(e[0])]:[e[0].toString()]}if(i===1){if(c>zt){let g=j*a,y=Array.from(e.slice(0,g)),B=Array.from(e.slice((c-j)*a,c*a));return n==="complex64"&&(y=W(y),B=W(B)),["["+y.map(($,v)=>K($,o[v],n)).join(", ")+", ..., "+B.map(($,v)=>K($,o[c-j+v],n)).join(", ")+"]"]}return["["+(n==="complex64"?W(e):Array.from(e)).map((g,y)=>K(g,o[y],n)).join(", ")+"]"]}let l=t.slice(1),u=r.slice(1),f=r[0]*a,p=[];if(c>zt){for(let h=0;h<j;h++){let g=h*f,y=g+f;p.push(...et(e.slice(g,y),l,n,u,o,!1))}p.push("...");for(let h=c-j;h<c;h++){let g=h*f,y=g+f;p.push(...et(e.slice(g,y),l,n,u,o,h===c-1))}}else for(let h=0;h<c;h++){let g=h*f,y=g+f;p.push(...et(e.slice(g,y),l,n,u,o,h===c-1))}let m=i===2?",":"";p[0]="["+(c>0?p[0]+m:"");for(let h=1;h<p.length-1;h++)p[h]=" "+p[h]+m;let d=`,
`;for(let h=2;h<i;h++)d+=`
`;return p[p.length-1]=" "+p[p.length-1]+"]"+(s?"":d),p}function W(e){let t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}var A=null,H=null,ke=null;function Ot(e){A=e}function qt(e){ke=e}var S=class{constructor(t,n,r,o){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=n||"float32",this.size=k(t),this.strides=Z(t),this.dataId=r,this.id=o,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let t=await this.data();return H.buffer(this.shape,this.dtype,t)}bufferSync(){return H.buffer(this.shape,this.dtype,this.dataSync())}async array(){let t=await this.data();return at(this.shape,t,this.dtype==="complex64")}arraySync(){return at(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let t=A().read(this.dataId);if(this.dtype==="string"){let n=await t;try{return n.map(r=>dt(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),A().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();let t=A().readSync(this.dataId);if(this.dtype==="string")try{return t.map(n=>dt(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();let t=await A().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),A().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return H.print(this,t)}clone(){return this.throwIfDisposed(),H.clone(this)}toString(t=!1){let n=this.dataSync();return _t(n,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),H.cast(this,t)}variable(t=!0,n,r){return this.throwIfDisposed(),A().makeVariable(this,t,n,r)}};Object.defineProperty(S,Symbol.hasInstance,{value:e=>!!e&&e.data!=null&&e.dataSync!=null&&e.throwIfDisposed!=null});function yt(){return q("Tensor",()=>S)}yt();var L=class extends S{constructor(t,n,r,o){super(t.shape,t.dtype,t.dataId,o),this.trainable=n,this.name=r}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!z(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);A().disposeTensor(this),this.dataId=t.dataId,A().incRef(this,null)}dispose(){A().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(L,Symbol.hasInstance,{value:e=>e instanceof S&&e.assign!=null&&e.assign instanceof Function});var jt;(function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"})(jt||(jt={}));var Kt;(function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"})(Kt||(Kt={}));var Wt;(function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"})(Wt||(Wt={}));var Ht;(function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"})(Ht||(Ht={}));var Xt;(function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"})(Xt||(Xt={}));function nt(e){return e!=null&&typeof e=="object"&&"texture"in e&&e.texture instanceof WebGLTexture}function rt(e){return typeof GPUBuffer<"u"&&e!=null&&typeof e=="object"&&"buffer"in e&&e.buffer instanceof GPUBuffer}function Yt(e){let t=[];return Zt(e,t,new Set),t}function Zt(e,t,n){if(e==null)return;if(e instanceof S){t.push(e);return}if(!Se(e))return;let r=e;for(let o in r){let s=r[o];n.has(s)||(n.add(s),Zt(s,t,n))}}function Se(e){return Array.isArray(e)||typeof e=="object"}function xt(e){return e.kernelName!=null}var ot=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(let t in this.registeredVariables)this.registeredVariables[t].dispose()}},X=class e{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new ot}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let t=this.getSortedBackends();for(let n=0;n<t.length;n++){let r=t[n];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:t,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){let{asyncInit:n}=this.initializeBackend(t);if(n)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,n,r=1){return t in this.registryFactory?(R(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:n,priority:r},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;let{success:n,asyncInit:r}=this.initializeBackend(t);if(!(r?await n:n))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new tt(this.backendInstance),!0}setupRegisteredKernels(){ht(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){ht(t).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[t])})}initializeBackend(t){let n=this.registryFactory[t];if(n==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{let r=n.factory();if(r&&!(r instanceof Y)&&typeof r.then=="function"){let o=++this.pendingBackendInitId,s=r.then(a=>o<this.pendingBackendInitId?!1:(this.registry[t]=a,this.pendingBackendInit=null,!0)).catch(a=>(o<this.pendingBackendInitId||(this.pendingBackendInit=null,R(`Initialization of backend ${t} failed`),R(a.stack||a.message)),!1));return this.pendingBackendInit=s,{success:s,asyncInit:!0}}else return this.registry[t]=r,{success:!0,asyncInit:!1}}catch(r){return R(`Initialization of backend ${t} failed`),R(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,n)=>this.registryFactory[n].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){let t=this.getSortedBackends();for(let n=0;n<t.length;n++){let r=t[n],{success:o,asyncInit:s}=this.initializeBackend(r);if(s||o)return{name:r,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,n){let r=this.state.tensorInfo.get(n),o=r.backend,s=this.readSync(n),a=o.refCount(n);o.disposeData(n,!0),r.backend=t,t.move(n,s,r.shape,r.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,n){let r=null;if(n==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");n=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=t}let o;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(o),()=>(o=n(),o instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),o))}scopedRun(t,n,r){t();try{let o=r();return n(),o}catch(o){throw n(),o}}nextTensorId(){return e.nextTensorId++}nextVariableId(){return e.nextVariableId++}clone(t){let n=b.runKernel(Rt,{x:t}),r={x:t},o=a=>({x:()=>{let c="float32",i={x:a},l={dtype:c};return b.runKernel(Mt,i,l)}}),s=[];return this.addTapeNode(this.state.activeScope.name,r,[n],o,s,{}),n}runKernel(t,n,r){if(this.backendName==null&&this.backend,!(ft(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:n,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,n,r){let o=this.backend.numDataIds(),s=0;r.forEach(i=>{s+=i.dtype==="complex64"?3:1});let a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],c=o-n-s-a;if(c>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${c} data ids) after running '${t}'`)}runKernelFunc(t){let n,r=[],o=this.isTapeOn(),s=this.state.numBytes,a=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let c;this.backendName==null&&this.backend;let i,l=xt(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(xt(t)){let{kernelName:d,inputs:h,attrs:g}=t;this.backendName==null&&this.backend;let y=ft(d,this.backendName);w(y!=null,()=>`Cannot find registered kernel '${d}' for backend '${this.backendName}'`),c=()=>{let B=this.backend.numDataIds();i=y.kernelFunc({inputs:h,attrs:g,backend:this.backend});let $=Array.isArray(i)?i:[i];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(d,B,$);let v=$.map(U=>U.rank!=null?U:this.makeTensorFromTensorInfo(U));if(o){let U=this.getTensorsForGradient(d,h,v);r=this.saveTensorsForBackwardMode(U)}return v}}else{let{forwardFunc:d}=t,h=g=>{o&&(r=g.map(y=>this.keep(this.clone(y))))};c=()=>{let g=this.backend.numDataIds();i=this.tidy(()=>d(this.backend,h));let y=Array.isArray(i)?i:[i];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,g,y),y}}let{inputs:u,attrs:f}=t,p=xt(t)?null:t.backwardsFunc,m;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=c():(m=this.profiler.profileKernel(l,u,()=>c()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(m),n=m.outputs)}),o&&this.addTapeNode(l,u,n,p,r,f),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(u).map(d=>u[d]!=null?u[d].shape:null),outputShapes:n.map(d=>d.shape),kernelTimeMs:m.timeMs,extraInfo:m.extraInfo}),Array.isArray(i)?n:n[0]}saveTensorsForBackwardMode(t){return t.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(t,n,r){let o=pt(t);if(o!=null){let s=o.inputsToSave||[],a=o.outputsToSave||[],c;o.saveAllInputs?(w(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),c=Object.keys(n).map(l=>n[l])):c=s.map(l=>n[l]);let i=r.filter((l,u)=>a[u]);return c.concat(i)}return[]}makeTensor(t,n,r,o){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",o=o||this.backend;let s=t;r==="string"&&V(t[0])&&(s=t.map(i=>Lt(i)));let a=o.write(s,n,r),c=new S(n,r,a,this.nextTensorId());if(this.trackTensor(c,o),r==="string"){let i=this.state.tensorInfo.get(a),l=It(s);this.state.numBytes+=l-i.bytes,i.bytes=l}return c}makeTensorFromDataId(t,n,r,o){r=r||"float32";let s={dataId:t,shape:n,dtype:r};return this.makeTensorFromTensorInfo(s,o)}makeTensorFromTensorInfo(t,n){let{dataId:r,shape:o,dtype:s}=t,a=new S(o,s,r,this.nextTensorId());return this.trackTensor(a,n),a}makeVariable(t,n=!0,r,o){r=r||this.nextVariableId().toString(),o!=null&&o!==t.dtype&&(t=t.cast(o));let s=new L(t,n,r,this.nextTensorId());if(this.state.registeredVariables[s.name]!=null)throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(t,n){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let r=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(r=t.size*_(t.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:n||this.backend,dtype:t.dtype,shape:t.shape,bytes:r})),t instanceof L||this.track(t)}incRef(t,n){this.trackTensor(t,n),this.backend.incRef(t.dataId)}removeDataId(t,n){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===n&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;let n=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){let r=t.size*_(t.dtype);this.state.numBytes-=r}n.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,n.backend)}disposeVariables(){for(let t in this.state.registeredVariables){let n=this.state.registeredVariables[t];this.disposeVariable(n)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){let t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;let n=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(o=>o.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-r;for(let o of this.state.activeProfile.kernels)o.kernelTimeMs=await o.kernelTimeMs,o.extraInfo=await o.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,n,r,o,s,a){let c={id:this.state.nextTapeNodeId++,kernelName:t,inputs:n,outputs:r,saved:s},i=pt(t);i!=null&&(o=i.gradFunc),o!=null&&(c.gradient=l=>(l=l.map((u,f)=>{if(u==null){let p=r[f],m=lt(p.size,p.dtype);return this.makeTensor(m,p.shape,p.dtype)}return u}),o(l.length>1?l:l[0],s,a))),this.state.activeTape.push(c)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){let n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(n.name=t),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(t){let n=Yt(t),r=new Set(n.map(s=>s.id));for(let s=0;s<this.state.activeScope.track.length;s++){let a=this.state.activeScope.track[s];!a.kept&&!r.has(a.id)&&a.dispose()}let o=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(s=>{!s.kept&&s.scopeId===o.id&&this.track(s)})}gradients(t,n,r,o=!1){if(w(n.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);let s=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));w(s instanceof S,()=>"The result y returned by f() must be a tensor.");let a=Gt(this.state.activeTape,n,s);if(!o&&a.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{let c={};c[s.id]=r??Te(s.shape),Ut(c,a,l=>this.tidy(l),Ae);let i=n.map(l=>c[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(let u of l.saved)u.dispose()}),this.state.activeTape=null),{value:s,grads:i}})}customGrad(t){return w(it(t),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{w(n.every(c=>c instanceof S),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r,o={};n.forEach((c,i)=>{o[i]=c});let s=(c,i)=>(r=t(...n,i),w(r.value instanceof S,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),w(it(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),a=(c,i)=>{let l=r.gradFunc(c,i),u=Array.isArray(l)?l:[l];w(u.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),w(u.every(p=>p instanceof S),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let f={};return u.forEach((p,m)=>{f[m]=()=>p}),f};return this.runKernelFunc({forwardFunc:s,backwardsFunc:a,inputs:o})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,n){return this.state.tensorInfo.get(t).backend.readToGPU(t,n)}async time(t){let n=N(),r=await this.backend.time(t);return r.wallMs=N()-n,r}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new ot;for(let t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};X.nextTensorId=0;X.nextVariableId=0;function Te(e){let t=Et(k(e),"float32");return b.makeTensor(t,e,"float32")}function Ie(){let e=ut();if(e._tfengine==null){let t=new Q(e);e._tfengine=new X(t)}return $t(e._tfengine.ENV),Ot(()=>e._tfengine),e._tfengine}var b=Ie();function Ae(e,t){let n={a:e,b:t};return b.runKernel(vt,n)}function wt(e,t){let n=e;if(I(e))return t==="string"?[]:[e.length];if(nt(e)){let o=e.channels||"RGBA";return[e.height,e.width*o.length]}else if(rt(e))return[e.buffer.size/(t==null?4:_(t))];if(!Array.isArray(e))return[];let r=[];for(;Array.isArray(n)||I(n)&&t!=="string";)r.push(n.length),n=n[0];return Array.isArray(e)&&x().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Jt(e,r,[]),r}function Jt(e,t,n){if(n=n||[],!Array.isArray(e)&&!I(e)){w(t.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}w(t.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`),w(e.length===t[0],()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`);let r=t.slice(1);for(let o=0;o<e.length;++o)Jt(e[o],r,n.concat(o))}function Qt(e,t,n,r){if(e!=="string_or_numeric"){if(e==null)throw new Error("Expected dtype cannot be null.");if(e!=="numeric"&&e!==t||e==="numeric"&&t==="string")throw new Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function bt(e,t,n,r="numeric"){if(e instanceof yt())return Qt(r,e.dtype,t,n),e;let o=O(e);if(o!=="string"&&["bool","int32","float32"].indexOf(r)>=0&&(o=r),Qt(r,o,t,n),e==null||!I(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string"){let i=e==null?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${i}'`)}let s=wt(e,o);!I(e)&&!Array.isArray(e)&&(e=[e]);let c=o!=="string"?J(e,o):F(e,[],!0);return b.makeTensor(c,s,o)}var Ee="__op";function te(e){let t=Object.keys(e);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0],r=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+Ee;let o=(...s)=>{b.startScope(n);try{let a=r(...s);return P(a)&&console.error("Cannot return a Promise inside of tidy."),b.endScope(a),a}catch(a){throw b.endScope(null),a}};return Object.defineProperty(o,"name",{value:n,configurable:!0}),o}function Be(e,t){let n=bt(e,"real","complex"),r=bt(t,"imag","complex");St(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);let o={real:n,imag:r};return b.runKernel(Pt,o)}var ee=te({complex_:Be});function ne(e,t,n,r){if(r==null)r=O(e);else if(r==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(rt(e)||nt(e)){if(r!=="float32"&&r!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${r}.`);return b.backend.createTensorFromGPUData(e,t||n,r)}if(!I(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){Bt(t);let o=k(t),s=k(n);w(o===s,()=>`Based on the provided shape, [${t}], the tensor should have ${o} values but has ${s}`);for(let a=0;a<n.length;++a){let c=n[a],i=a===n.length-1?c!==k(t.slice(a)):!0;w(n[a]===t[a]||!i,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `)}}return!I(e)&&!Array.isArray(e)&&(e=[e]),t=t||n,e=r!=="string"?J(e,r):F(e,[],!0),b.makeTensor(e,t,r)}function st(e,t,n){let r=wt(e,n);return ne(e,t,r,n)}var D={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};var G=class e{static join(t){return new e(t).slice()}constructor(t){if(this.shards=[],this.previousShardIndex=0,t==null||(t instanceof Array||(t=[t]),t=t.map(r=>I(r)?r.buffer:r),t.length===0))return;this.bufferUniformSize=t[0].byteLength;let n=0;for(let r=0;r<t.length;r++){let o=t[r];r!==t.length-1&&o.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);let s=n+o.byteLength;this.shards.push({buffer:o,start:n,end:s}),n=s}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(t=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(t=isNaN(Number(t))?0:t,n=isNaN(Number(n))?0:n,t=Math.max(0,t),n=Math.min(this.byteLength,n),n<=t)return new ArrayBuffer(0);let r=this.findShardForByte(t);if(r===-1)throw new Error(`Could not find start shard for byte ${t}`);let o=n-t,s=new ArrayBuffer(o),a=new Uint8Array(s),c=0;for(let i=r;i<this.shards.length;i++){let l=this.shards[i],f=t+c-l.start,p=c,d=Math.min(n,l.end)-l.start,h=new Uint8Array(l.buffer,f,d-f);if(a.set(h,p),c+=h.length,n<l.end)break}return s}findShardForByte(t){if(this.shards.length===0||t<0||t>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(t/this.bufferUniformSize),this.previousShardIndex;function n(o){return t<o.start?-1:t>=o.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;let r=Fe(this.shards,n);return r===-1?-1:(this.previousShardIndex=r,this.previousShardIndex)}};function Fe(e,t){let n=0,r=e.length;for(;n<=r;){let o=Math.floor((r-n)/2)+n,s=t(e[o]);if(s===0)return o;s<0?r=o:n=o+1}return-1}function De(e){x().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}qt(De);function re(){return b.backendName}function oe(){return b.backend}var E=4;async function or(e,t){let n=[],r=[],o=Array.isArray(e)?e.map(a=>a.name):Object.keys(e);for(let a=0;a<o.length;++a){let c=o[a],i=Array.isArray(e)?e[a].tensor:e[c];if(i.dtype!=="float32"&&i.dtype!=="int32"&&i.dtype!=="bool"&&i.dtype!=="string"&&i.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${c}': ${i.dtype}`);let l={name:c,shape:i.shape,dtype:i.dtype};if(i.dtype==="string"){let u=new Promise(async f=>{let p=await i.bytes(),m=p.reduce((g,y)=>g+y.length,0)+E*p.length,d=new Uint8Array(m),h=0;for(let g=0;g<p.length;g++){let y=p[g],B=new Uint8Array(new Uint32Array([y.length]).buffer);d.set(B,h),h+=E,d.set(y,h),h+=y.length}f(d)});r.push(u)}else r.push(i.data());t!=null&&(l.group=t),n.push(l)}let s=await Promise.all(r);return{data:Me(s),specs:n}}function sr(e,t){let n=new G(e),r={},o=0;for(let s of t){let a=$e(s,(c,i)=>n.slice(o+c,o+i));r[s.name]=ae(s,n.slice(o,o+a)),o+=a}return r}function $e(e,t){let n=k(e.shape),r;if("quantization"in e){let o=e.quantization;r=D[o.dtype]}else if(e.dtype==="string"){let o=0;for(let s=0;s<n;s++)o+=E+new Uint32Array(t(o,o+E))[0];return o}else r=D[e.dtype];return n*r}async function ve(e,t){let n=k(e.shape),r;if("quantization"in e){let o=e.quantization;r=D[o.dtype]}else if(e.dtype==="string"){let o=0;for(let s=0;s<n;s++)o+=E+new Uint32Array(await t(o,o+E))[0];return o}else r=D[e.dtype];return n*r}function ae(e,t){let n=e.name,r=e.dtype,o=e.shape,s=k(o),a,c=0;if("quantization"in e){let i=e.quantization;if(i.dtype==="uint8"||i.dtype==="uint16"){if(!("min"in i&&"scale"in i))throw new Error(`Weight ${e.name} with quantization ${i.dtype} doesn't have corresponding metadata min and scale.`)}else if(i.dtype==="float16"){if(r!=="float32")throw new Error(`Weight ${e.name} is quantized with ${i.dtype} which only supports weights of type float32 not ${r}.`)}else throw new Error(`Weight ${e.name} has unknown quantization dtype ${i.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);let l=D[i.dtype],u=i.dtype==="uint8"?new Uint8Array(t):new Uint16Array(t);if(r==="float32")if(i.dtype==="uint8"||i.dtype==="uint16"){a=new Float32Array(u.length);for(let f=0;f<u.length;f++){let p=u[f];a[f]=p*i.scale+i.min}}else if(i.dtype==="float16")a=Le()(u);else throw new Error(`Unsupported quantization type ${i.dtype} for weight type float32.`);else if(r==="int32"){if(i.dtype!=="uint8"&&i.dtype!=="uint16")throw new Error(`Unsupported quantization type ${i.dtype} for weight type int32.`);a=new Int32Array(u.length);for(let f=0;f<u.length;f++){let p=u[f];a[f]=Math.round(p*i.scale+i.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);c+=s*l}else if(r==="string"){let i=k(e.shape);a=[];for(let l=0;l<i;l++){let u=new Uint32Array(t.slice(c,c+E))[0];c+=E;let f=new Uint8Array(t.slice(c,c+u));a.push(f),c+=u}}else{let i=D[r];if(r==="float32")a=new Float32Array(t);else if(r==="int32")a=new Int32Array(t);else if(r==="bool")a=new Uint8Array(t);else if(r==="complex64"){a=new Float32Array(t);let l=new Float32Array(a.length/2),u=new Float32Array(a.length/2);for(let d=0;d<l.length;d++)l[d]=a[d*2],u[d]=a[d*2+1];let f=st(l,o,"float32"),p=st(u,o,"float32"),m=ee(f,p);return f.dispose(),p.dispose(),m}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);c+=s*i}return st(a,o,r)}async function se(e,t,n){let r=new Uint8Array(t);for(;r.byteLength<n;){let{done:o,value:s}=await e.read();if(o&&s==null){let c=n-r.byteLength;throw new Error(`Reader is done but ${c} bytes are still expected`)}let a=new Uint8Array(r.length+s.byteLength);a.set(r,0),a.set(new Uint8Array(s),r.length),r=a}return r.buffer}async function ir(e,t){let n={},r=e.getReader(),o=new ArrayBuffer(0);for(let s of t){let a=await ve(s,async(l,u)=>(o=await se(r,o,u),o.slice(l,u)));o=await se(r,o,a);let c=o.slice(0,a);o=o.slice(a);let i=ae(s,c);if(n[s.name]=i,re()==="webgpu"){let l=oe();"uploadToGPU"in l&&k(i.shape)>=x().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&l.uploadToGPU(i.dataId)}}return n}function Me(e){if(e===null)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0,n=[];e.forEach(s=>{if(t+=s.byteLength,n.push(s.byteLength===s.buffer.byteLength?s:new s.constructor(s)),!(s instanceof Float32Array||s instanceof Int32Array||s instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${s.constructor.name}`)});let r=new Uint8Array(t),o=0;return n.forEach(s=>{r.set(new Uint8Array(s.buffer),o),o+=s.byteLength}),r.buffer}var kt=typeof __Buffer$<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function ie(e){return kt?__Buffer$.byteLength(e,"utf8"):new Blob([e]).size}function ar(e){if(kt)return __Buffer$.from(e).toString("base64");let t=new Uint8Array(e),n="";for(let r=0,o=t.length;r<o;r++)n+=String.fromCharCode(t[r]);return btoa(n)}function lr(e){if(kt){let r=__Buffer$.from(e,"base64");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}let t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;++r)n.set([t.charCodeAt(r)],r);return n.buffer}function cr(e){return G.join(e)}function ur(e){let t="/";for(e=e.trim();e.endsWith(t);)e=e.slice(0,e.length-1);let n=e.split(t);return n[n.length-1]}function fr(e,t){let n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return e.signature!=null&&(n.signature=e.signature),e.userDefinedMetadata!=null&&(n.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(n.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(n.initializerSignature=e.initializerSignature),e.trainingConfig!=null&&(n.trainingConfig=e.trainingConfig),n}function Pe(e,t,n){let r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(e.trainingConfig!=null&&(r.trainingConfig=e.trainingConfig),e.weightsManifest!=null){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=t,r.weightData=n}return e.signature!=null&&(r.signature=e.signature),e.userDefinedMetadata!=null&&(r.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(r.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(r.initializerSignature=e.initializerSignature),r}async function pr(e,t){let n,r;return e.weightsManifest!=null&&([n,r]=await t(e.weightsManifest)),Pe(e,n,r)}function hr(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:e.modelTopology==null?0:ie(JSON.stringify(e.modelTopology)),weightSpecsBytes:e.weightSpecs==null?0:ie(JSON.stringify(e.weightSpecs)),weightDataBytes:e.weightData==null?0:new G(e.weightData).byteLength}}function dr(e){let t=[];for(let n of e)t.push(...n.weights);return t}function Re(){let e=n=>{let r=n<<13,o=0;for(;!(r&8388608);)o-=8388608,r<<=1;return r&=-8388609,o+=947912704,r|o},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let n=1024;n<2048;n++)t[n]=939524096+(n-1024<<13);return t}function Ne(){let e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}function Ce(){let e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}function Le(){let e=Re(),t=Ne(),n=Ce();return r=>{let o=new ArrayBuffer(4*r.length),s=new Uint32Array(o);for(let a=0;a<r.length;a++){let c=r[a],i=e[n[c>>10]+(c&1023)]+t[c>>10];s[a]=i}return new Float32Array(o)}}export{ar as arrayBufferToBase64String,lr as base64StringToArrayBuffer,ur as basename,cr as concatenateArrayBuffers,Me as concatenateTypedArrays,sr as decodeWeights,ir as decodeWeightsStream,or as encodeWeights,Le as getFloat16Decoder,pr as getModelArtifactsForJSON,Pe as getModelArtifactsForJSONSync,hr as getModelArtifactsInfoForJSON,fr as getModelJSONForModelArtifacts,dr as getWeightSpecs,ie as stringByteLength};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/backend.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/util_base.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/global_util.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/log.js:
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

@tensorflow/tfjs-core/dist/kernel_registry.js:
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

@tensorflow/tfjs-core/dist/platforms/is_typed_array_browser.js:
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

@tensorflow/tfjs-core/dist/util.js:
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

@tensorflow/tfjs-core/dist/tape.js:
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

@tensorflow/tfjs-core/dist/tensor_format.js:
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

@tensorflow/tfjs-core/dist/tensor.js:
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

@tensorflow/tfjs-core/dist/types.js:
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

@tensorflow/tfjs-core/dist/tensor_util.js:
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

@tensorflow/tfjs-core/dist/engine.js:
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

@tensorflow/tfjs-core/dist/tensor_util_env.js:
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

@tensorflow/tfjs-core/dist/ops/operation.js:
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

@tensorflow/tfjs-core/dist/ops/complex.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/tensor_ops_util.js:
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

@tensorflow/tfjs-core/dist/ops/tensor.js:
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

@tensorflow/tfjs-core/dist/io/types.js:
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

@tensorflow/tfjs-core/dist/globals.js:
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

@tensorflow/tfjs-core/dist/io/io_utils.js:
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
//# sourceMappingURL=io_utils.js.map