/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/globals) denonext production */
import __Process$ from "node:process";
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var V=class{refCount(t){return b("refCount")}incRef(t){return b("incRef")}timerAvailable(){return!0}time(t){return b("time")}read(t){return b("read")}readSync(t){return b("readSync")}readToGPU(t,e){return b("readToGPU")}numDataIds(){return b("numDataIds")}disposeData(t,e){return b("disposeData")}write(t,e,r){return b("write")}move(t,e,r,o,s){return b("move")}createTensorFromGPUData(t,e,r){return b("createTensorFromGPUData")}memory(){return b("memory")}floatPrecision(){return b("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return b("dispose")}};function b(n){throw new Error(`'${n}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function S(n,t){if(!n)throw new Error(typeof t=="string"?t:t())}function A(n){if(n.length===0)return 1;let t=n[0];for(let e=1;e<n.length;e++)t*=n[e];return t}function O(n,t){if(n===t)return!0;if(n==null||t==null||n.length!==t.length)return!1;for(let e=0;e<n.length;e++)if(n[e]!==t[e])return!1;return!0}function B(n,t){return t<=n.length?n:n+" ".repeat(t-n.length)}function X(n){if(n==="float32"||n==="int32")return 4;if(n==="complex64")return 8;if(n==="bool")return 1;throw new Error(`Unknown dtype ${n}`)}function ct(n){if(n==null)return 0;let t=0;return n.forEach(e=>t+=e.length),t}function U(n){return typeof n=="string"||n instanceof String}function Y(n){return!!(n&&n.constructor&&n.call&&n.apply)}function _(n){let t=n.length;if(t<2)return[];let e=new Array(t-1);e[t-2]=n[t-1];for(let r=t-3;r>=0;--r)e[r]=e[r+1]*n[r+1];return e}function lt(n,t,e,r=!1){let o=new Array;if(t.length===1){let s=t[0]*(r?2:1);for(let c=0;c<s;c++)o[c]=e[n+c]}else{let s=t[0],c=t.slice(1),l=c.reduce((i,a)=>i*a)*(r?2:1);for(let i=0;i<s;i++)o[i]=lt(n+i*l,c,e,r)}return o}function Z(n,t,e=!1){if(n.length===0)return t[0];let r=n.reduce((o,s)=>o*s)*(e?2:1);if(r===0)return[];if(r!==t.length)throw new Error(`[${n}] does not match the input size ${t.length}${e?" for a complex tensor":""}.`);return lt(0,n,t,e)}function ut(n,t){let e=Q(n,t);for(let r=0;r<e.length;r++)e[r]=1;return e}function Q(n,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(n);if(t==="int32")return new Int32Array(n);if(t==="bool")return new Uint8Array(n);throw new Error(`Unknown data type ${t}`)}function pt(n){return n&&n.then&&typeof n.then=="function"}var ft="tfjsflags",z=class{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=Dt,this.populateURLFlags()}setPlatform(t,e){this.platform!=null&&(k().getBool("IS_TEST")||k().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=e}registerFlag(t,e,r){if(this.flagRegistry[t]={evaluationFn:e,setHook:r},this.urlFlags[t]!=null){let o=this.urlFlags[t];k().getBool("IS_TEST")||k().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${o}.`),this.set(t,o)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];let e=this.evaluateFlag(t);if(pt(e))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=e,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,e){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=e,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(e)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let t=this.getQueryParams(this.global.location.search);ft in t&&t[ft].split(",").forEach(r=>{let[o,s]=r.split(":");this.urlFlags[o]=Et(o,s)})}};function Dt(n){let t={};return n.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(e,...r)=>(vt(t,r[0],r[1]),r.join("="))),t}function vt(n,t,e){n[decodeURIComponent(t)]=decodeURIComponent(e||"")}function Et(n,t){let e=t.toLowerCase();return e==="true"||e==="false"?e==="true":`${+e}`===e?+e:t}function k(){return ht}var ht=null;function dt(n){ht=n}var J;function tt(){if(J==null){let n;if(typeof window<"u")n=window;else if(typeof __global$<"u")n=__global$;else if(typeof __Process$<"u")n=__Process$;else if(typeof self<"u")n=self;else throw new Error("Could not find a global object");J=n}return J}function Mt(){let n=tt();return n._tfGlobals==null&&(n._tfGlobals=new Map),n._tfGlobals}function $(n,t){let e=Mt();if(e.has(n))return e.get(n);{let r=t();return e.set(n,r),e.get(n)}}var gt="Add";var mt="Cast";var xt="Identity";function D(...n){k().getBool("IS_TEST")||k().getBool("PROD")||console.warn(...n)}var yt=$("kernelRegistry",()=>new Map),$t=$("gradRegistry",()=>new Map);function et(n,t){let e=Pt(n,t);return yt.get(e)}function nt(n){return $t.get(n)}function rt(n){let t=yt.entries(),e=[];for(;;){let{done:r,value:o}=t.next();if(r)break;let[s,c]=o,[l]=s.split("_");l===n&&e.push(c)}return e}function Pt(n,t){return`${t}_${n}`}function v(){return k().platform.now()}function kt(n,t="utf-8"){return t=t||"utf-8",k().platform.encode(n,t)}function ot(n,t="utf-8"){return t=t||"utf-8",k().platform.decode(n,t)}var j=class{constructor(t,e){this.backendTimer=t,this.logger=e,e==null&&(this.logger=new st)}profileKernel(t,e,r){let o,s=()=>{o=r()},c,l=v();if(this.backendTimer.timerAvailable())c=this.backendTimer.time(s);else{s();for(let a of o)a.dataSync();c=Promise.resolve({kernelMs:v()-l})}if(k().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let a=0;a<o.length;a++){let u=o[a];u.data().then(p=>{Nt(p,u.dtype,t)})}return{kernelName:t,outputs:o,inputs:e,timeMs:c.then(a=>a.kernelMs),extraInfo:c.then(a=>a.getExtraProfileInfo!=null?a.getExtraProfileInfo():"")}}logKernelProfile(t){let{kernelName:e,outputs:r,timeMs:o,inputs:s,extraInfo:c}=t;r.forEach(l=>{Promise.all([l.data(),o,c]).then(i=>{this.logger.logKernelProfile(e,l,i[0],i[1],s,i[2])})})}};function Nt(n,t,e){if(t!=="float32")return!1;for(let r=0;r<n.length;r++){let o=n[r];if(isNaN(o)||!isFinite(o))return console.warn(`Found ${o} in the result of '${e}'`),!0}return!1}var st=class{logKernelProfile(t,e,r,o,s,c){let l=typeof o=="number"?B(`${o}ms`,9):o.error,i=B(t,25),a=e.rank,u=e.size,p=B(e.shape.toString(),14),f="";for(let d in s){let m=s[d];if(m!=null){let h=m.shape||e.shape,g=h.length;f+=`${d}: ${g}D ${g>0?h:""} `}}console.log(`%c${i}	%c${l}	%c${a}D ${p}	%c${u}	%c${f}	%c${c}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};function wt(n,t,e){let r={},o={};for(let i=0;i<t.length;i++)r[t[i].id]=!0;for(let i=0;i<n.length;i++){let a=n[i],u=a.inputs;for(let p in u){let f=u[p],d=!1;for(let m=0;m<t.length;m++)if(r[f.id]){a.outputs.forEach(h=>r[h.id]=!0),d=!0,o[a.id]=!0;break}if(d)break}}let s={};s[e.id]=!0;let c={};for(let i=n.length-1;i>=0;i--){let a=n[i],u=a.inputs;for(let p=0;p<a.outputs.length;p++)if(s[a.outputs[p].id]){for(let f in u)s[u[f].id]=!0,c[a.id]=!0;break}}let l=[];for(let i=0;i<n.length;i++){let a=n[i];if(o[a.id]&&c[a.id]){let u={};for(let f in a.inputs){let d=a.inputs[f];r[d.id]&&(u[f]=d)}let p=Object.assign({},a);p.inputs=u,p.outputs=a.outputs,l.push(p)}}return l}function bt(n,t,e,r){for(let o=t.length-1;o>=0;o--){let s=t[o],c=[];if(s.outputs.forEach(i=>{let a=n[i.id];a!=null?c.push(a):c.push(null)}),s.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);let l=s.gradient(c);for(let i in s.inputs){if(!(i in l))throw new Error(`Cannot backprop through input ${i}. Available gradients found: ${Object.keys(l)}.`);let a=e(()=>l[i]());if(a.dtype!=="float32")throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${i} must have 'float32' dtype, but has '${a.dtype}'`);let u=s.inputs[i];if(!O(a.shape,u.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${i}' has shape '${a.shape}', which does not match the shape of the input '${u.shape}'`);if(n[u.id]==null)n[u.id]=a;else{let p=n[u.id];n[u.id]=r(p,a),p.dispose()}}}}var St=20,P=3,it=7;function Tt(n,t,e,r){let o=_(t),s=Ct(n,t,e,o),c=t.length,l=q(n,t,e,o,s),i=["Tensor"];return r&&(i.push(`  dtype: ${e}`),i.push(`  rank: ${c}`),i.push(`  shape: [${t}]`),i.push("  values:")),i.push(l.map(a=>"    "+a).join(`
`)),i.join(`
`)}function Ct(n,t,e,r){let o=A(t),s=r[r.length-1],c=new Array(s).fill(0),l=t.length,i=e==="complex64"?C(n):n;if(l>1)for(let a=0;a<o/s;a++){let u=a*s;for(let p=0;p<s;p++)c[p]=Math.max(c[p],N(i[u+p],0,e).length)}return c}function N(n,t,e){let r;return Array.isArray(n)?r=`${parseFloat(n[0].toFixed(it))} + ${parseFloat(n[1].toFixed(it))}j`:U(n)?r=`'${n}'`:e==="bool"?r=It(n):r=parseFloat(n.toFixed(it)).toString(),B(r,t)}function It(n){return n===0?"false":"true"}function q(n,t,e,r,o,s=!0){let c=e==="complex64"?2:1,l=t[0],i=t.length;if(i===0){if(e==="complex64"){let h=C(n);return[N(h[0],0,e)]}return e==="bool"?[It(n[0])]:[n[0].toString()]}if(i===1){if(l>St){let g=P*c,y=Array.from(n.slice(0,g)),M=Array.from(n.slice((l-P)*c,l*c));return e==="complex64"&&(y=C(y),M=C(M)),["["+y.map((I,F)=>N(I,o[F],e)).join(", ")+", ..., "+M.map((I,F)=>N(I,o[l-P+F],e)).join(", ")+"]"]}return["["+(e==="complex64"?C(n):Array.from(n)).map((g,y)=>N(g,o[y],e)).join(", ")+"]"]}let a=t.slice(1),u=r.slice(1),p=r[0]*c,f=[];if(l>St){for(let h=0;h<P;h++){let g=h*p,y=g+p;f.push(...q(n.slice(g,y),a,e,u,o,!1))}f.push("...");for(let h=l-P;h<l;h++){let g=h*p,y=g+p;f.push(...q(n.slice(g,y),a,e,u,o,h===l-1))}}else for(let h=0;h<l;h++){let g=h*p,y=g+p;f.push(...q(n.slice(g,y),a,e,u,o,h===l-1))}let d=i===2?",":"";f[0]="["+(l>0?f[0]+d:"");for(let h=1;h<f.length-1;h++)f[h]=" "+f[h]+d;let m=`,
`;for(let h=2;h<i;h++)m+=`
`;return f[f.length-1]=" "+f[f.length-1]+"]"+(s?"":m),f}function C(n){let t=[];for(let e=0;e<n.length;e+=2)t.push([n[e],n[e+1]]);return t}var T=null,G=null,Gt=null;function Ft(n){T=n}function At(n){Gt=n}var w=class{constructor(t,e,r,o){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=e||"float32",this.size=A(t),this.strides=_(t),this.dataId=r,this.id=o,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let t=await this.data();return G.buffer(this.shape,this.dtype,t)}bufferSync(){return G.buffer(this.shape,this.dtype,this.dataSync())}async array(){let t=await this.data();return Z(this.shape,t,this.dtype==="complex64")}arraySync(){return Z(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let t=T().read(this.dataId);if(this.dtype==="string"){let e=await t;try{return e.map(r=>ot(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),T().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();let t=T().readSync(this.dataId);if(this.dtype==="string")try{return t.map(e=>ot(e))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();let t=await T().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),T().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return G.print(this,t)}clone(){return this.throwIfDisposed(),G.clone(this)}toString(t=!1){let e=this.dataSync();return Tt(e,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),G.cast(this,t)}variable(t=!0,e,r){return this.throwIfDisposed(),T().makeVariable(this,t,e,r)}};Object.defineProperty(w,Symbol.hasInstance,{value:n=>!!n&&n.data!=null&&n.dataSync!=null&&n.throwIfDisposed!=null});function Lt(){return $("Tensor",()=>w)}Lt();var E=class extends w{constructor(t,e,r,o){super(t.shape,t.dtype,t.dataId,o),this.trainable=e,this.name=r}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!O(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);T().disposeTensor(this),this.dataId=t.dataId,T().incRef(this,null)}dispose(){T().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(E,Symbol.hasInstance,{value:n=>n instanceof w&&n.assign!=null&&n.assign instanceof Function});function W(n){let t=[];return Bt(n,t,new Set),t}function Bt(n,t,e){if(n==null)return;if(n instanceof w){t.push(n);return}if(!Vt(n))return;let r=n;for(let o in r){let s=r[o];e.has(s)||(e.add(s),Bt(s,t,e))}}function Vt(n){return Array.isArray(n)||typeof n=="object"}function at(n){return n.kernelName!=null}var H=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(let t in this.registeredVariables)this.registeredVariables[t].dispose()}},L=class n{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new H}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let t=this.getSortedBackends();for(let e=0;e<t.length;e++){let r=t[e];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:t,asyncInit:e}=this.initializeBackendsAndReturnBest();if(e)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){let{asyncInit:e}=this.initializeBackend(t);if(e)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,e,r=1){return t in this.registryFactory?(D(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:e,priority:r},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;let{success:e,asyncInit:r}=this.initializeBackend(t);if(!(r?await e:e))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new j(this.backendInstance),!0}setupRegisteredKernels(){rt(this.backendName).forEach(e=>{e.setupFunc!=null&&e.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){rt(t).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[t])})}initializeBackend(t){let e=this.registryFactory[t];if(e==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{let r=e.factory();if(r&&!(r instanceof V)&&typeof r.then=="function"){let o=++this.pendingBackendInitId,s=r.then(c=>o<this.pendingBackendInitId?!1:(this.registry[t]=c,this.pendingBackendInit=null,!0)).catch(c=>(o<this.pendingBackendInitId||(this.pendingBackendInit=null,D(`Initialization of backend ${t} failed`),D(c.stack||c.message)),!1));return this.pendingBackendInit=s,{success:s,asyncInit:!0}}else return this.registry[t]=r,{success:!0,asyncInit:!1}}catch(r){return D(`Initialization of backend ${t} failed`),D(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,e)=>this.registryFactory[e].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){let t=this.getSortedBackends();for(let e=0;e<t.length;e++){let r=t[e],{success:o,asyncInit:s}=this.initializeBackend(r);if(s||o)return{name:r,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,e){let r=this.state.tensorInfo.get(e),o=r.backend,s=this.readSync(e),c=o.refCount(e);o.disposeData(e,!0),r.backend=t,t.move(e,s,r.shape,r.dtype,c),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,e){let r=null;if(e==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");e=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof e!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=t}let o;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(o),()=>(o=e(),o instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),o))}scopedRun(t,e,r){t();try{let o=r();return e(),o}catch(o){throw e(),o}}nextTensorId(){return n.nextTensorId++}nextVariableId(){return n.nextVariableId++}clone(t){let e=x.runKernel(xt,{x:t}),r={x:t},o=c=>({x:()=>{let l="float32",i={x:c},a={dtype:l};return x.runKernel(mt,i,a)}}),s=[];return this.addTapeNode(this.state.activeScope.name,r,[e],o,s,{}),e}runKernel(t,e,r){if(this.backendName==null&&this.backend,!(et(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:e,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,e,r){let o=this.backend.numDataIds(),s=0;r.forEach(i=>{s+=i.dtype==="complex64"?3:1});let c=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],l=o-e-s-c;if(l>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${l} data ids) after running '${t}'`)}runKernelFunc(t){let e,r=[],o=this.isTapeOn(),s=this.state.numBytes,c=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let l;this.backendName==null&&this.backend;let i,a=at(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(at(t)){let{kernelName:m,inputs:h,attrs:g}=t;this.backendName==null&&this.backend;let y=et(m,this.backendName);S(y!=null,()=>`Cannot find registered kernel '${m}' for backend '${this.backendName}'`),l=()=>{let M=this.backend.numDataIds();i=y.kernelFunc({inputs:h,attrs:g,backend:this.backend});let I=Array.isArray(i)?i:[i];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(m,M,I);let F=I.map(R=>R.rank!=null?R:this.makeTensorFromTensorInfo(R));if(o){let R=this.getTensorsForGradient(m,h,F);r=this.saveTensorsForBackwardMode(R)}return F}}else{let{forwardFunc:m}=t,h=g=>{o&&(r=g.map(y=>this.keep(this.clone(y))))};l=()=>{let g=this.backend.numDataIds();i=this.tidy(()=>m(this.backend,h));let y=Array.isArray(i)?i:[i];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(a,g,y),y}}let{inputs:u,attrs:p}=t,f=at(t)?null:t.backwardsFunc,d;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?e=l():(d=this.profiler.profileKernel(a,u,()=>l()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(d),e=d.outputs)}),o&&this.addTapeNode(a,u,e,f,r,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:a,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-c,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(u).map(m=>u[m]!=null?u[m].shape:null),outputShapes:e.map(m=>m.shape),kernelTimeMs:d.timeMs,extraInfo:d.extraInfo}),Array.isArray(i)?e:e[0]}saveTensorsForBackwardMode(t){return t.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(t,e,r){let o=nt(t);if(o!=null){let s=o.inputsToSave||[],c=o.outputsToSave||[],l;o.saveAllInputs?(S(Array.isArray(e),()=>"saveAllInputs is true, expected inputs to be an array."),l=Object.keys(e).map(a=>e[a])):l=s.map(a=>e[a]);let i=r.filter((a,u)=>c[u]);return l.concat(i)}return[]}makeTensor(t,e,r,o){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",o=o||this.backend;let s=t;r==="string"&&U(t[0])&&(s=t.map(i=>kt(i)));let c=o.write(s,e,r),l=new w(e,r,c,this.nextTensorId());if(this.trackTensor(l,o),r==="string"){let i=this.state.tensorInfo.get(c),a=ct(s);this.state.numBytes+=a-i.bytes,i.bytes=a}return l}makeTensorFromDataId(t,e,r,o){r=r||"float32";let s={dataId:t,shape:e,dtype:r};return this.makeTensorFromTensorInfo(s,o)}makeTensorFromTensorInfo(t,e){let{dataId:r,shape:o,dtype:s}=t,c=new w(o,s,r,this.nextTensorId());return this.trackTensor(c,e),c}makeVariable(t,e=!0,r,o){r=r||this.nextVariableId().toString(),o!=null&&o!==t.dtype&&(t=t.cast(o));let s=new E(t,e,r,this.nextTensorId());if(this.state.registeredVariables[s.name]!=null)throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(t,e){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let r=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(r=t.size*X(t.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:e||this.backend,dtype:t.dtype,shape:t.shape,bytes:r})),t instanceof E||this.track(t)}incRef(t,e){this.trackTensor(t,e),this.backend.incRef(t.dataId)}removeDataId(t,e){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===e&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;let e=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=e.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){let r=t.size*X(t.dtype);this.state.numBytes-=r}e.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,e.backend)}disposeVariables(){for(let t in this.state.registeredVariables){let e=this.state.registeredVariables[t];this.disposeVariable(e)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){let t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;let e=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(o=>o.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-e,this.state.activeProfile.newTensors=this.state.numTensors-r;for(let o of this.state.activeProfile.kernels)o.kernelTimeMs=await o.kernelTimeMs,o.extraInfo=await o.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,e,r,o,s,c){let l={id:this.state.nextTapeNodeId++,kernelName:t,inputs:e,outputs:r,saved:s},i=nt(t);i!=null&&(o=i.gradFunc),o!=null&&(l.gradient=a=>(a=a.map((u,p)=>{if(u==null){let f=r[p],d=Q(f.size,f.dtype);return this.makeTensor(d,f.shape,f.dtype)}return u}),o(a.length>1?a:a[0],s,c))),this.state.activeTape.push(l)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){let e={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(e.name=t),this.state.scopeStack.push(e),this.state.activeScope=e}endScope(t){let e=W(t),r=new Set(e.map(s=>s.id));for(let s=0;s<this.state.activeScope.track.length;s++){let c=this.state.activeScope.track[s];!c.kept&&!r.has(c.id)&&c.dispose()}let o=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],e.forEach(s=>{!s.kept&&s.scopeId===o.id&&this.track(s)})}gradients(t,e,r,o=!1){if(S(e.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);let s=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));S(s instanceof w,()=>"The result y returned by f() must be a tensor.");let c=wt(this.state.activeTape,e,s);if(!o&&c.length===0&&e.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{let l={};l[s.id]=r??Ot(s.shape),bt(l,c,a=>this.tidy(a),_t);let i=e.map(a=>l[a.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(a=>{for(let u of a.saved)u.dispose()}),this.state.activeTape=null),{value:s,grads:i}})}customGrad(t){return S(Y(t),()=>"The f passed in customGrad(f) must be a function."),(...e)=>{S(e.every(l=>l instanceof w),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r,o={};e.forEach((l,i)=>{o[i]=l});let s=(l,i)=>(r=t(...e,i),S(r.value instanceof w,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),S(Y(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),c=(l,i)=>{let a=r.gradFunc(l,i),u=Array.isArray(a)?a:[a];S(u.length===e.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),S(u.every(f=>f instanceof w),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let p={};return u.forEach((f,d)=>{p[d]=()=>f}),p};return this.runKernelFunc({forwardFunc:s,backwardsFunc:c,inputs:o})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,e){return this.state.tensorInfo.get(t).backend.readToGPU(t,e)}async time(t){let e=v(),r=await this.backend.time(t);return r.wallMs=v()-e,r}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new H;for(let t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};L.nextTensorId=0;L.nextVariableId=0;function Ot(n){let t=ut(A(n),"float32");return x.makeTensor(t,n,"float32")}function Ut(){let n=tt();if(n._tfengine==null){let t=new z(n);n._tfengine=new L(t)}return dt(n._tfengine.ENV),Ft(()=>n._tfengine),n._tfengine}var x=Ut();function _t(n,t){let e={a:n,b:t};return x.runKernel(gt,e)}function Re(){k().set("PROD",!0)}function $e(){k().set("DEBUG",!0)}function Pe(){k().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function zt(n){k().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(n+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}At(zt);function Ne(){x.disposeVariables()}function Ce(){return x}function Ge(){return x.memory()}function Le(n){return x.profile(n)}function Ve(n,t){return x.tidy(n,t)}function Oe(n){W(n).forEach(e=>e.dispose())}function Ue(n){return x.keep(n)}function _e(n){return x.time(n)}function ze(n){return x.setBackend(n)}function Ke(){return x.ready()}function je(){return x.backendName}function qe(n){x.removeBackend(n)}function We(n){return x.findBackend(n)}function He(n){return x.findBackendFactory(n)}function Xe(n,t,e=1){return x.registerBackend(n,t,e)}function Ye(){return x.backend}function Ze(n,t){k().setPlatform(n,t)}export{Ye as backend,zt as deprecationWarn,Pe as disableDeprecationWarnings,Oe as dispose,Ne as disposeVariables,$e as enableDebugMode,Re as enableProdMode,Ce as engine,We as findBackend,He as findBackendFactory,je as getBackend,Ue as keep,Ge as memory,Le as profile,Ke as ready,Xe as registerBackend,qe as removeBackend,ze as setBackend,Ze as setPlatform,Ve as tidy,_e as time};
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
*/
//# sourceMappingURL=globals.js.map