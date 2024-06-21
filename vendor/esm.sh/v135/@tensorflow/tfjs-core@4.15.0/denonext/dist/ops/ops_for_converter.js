/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/ops_for_converter) denonext production */
import __Process$ from "node:process";
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var qa=Object.defineProperty;var La=(r,t)=>{for(var o in t)qa(r,o,{get:t[o],enumerable:!0})};var Lr=class{refCount(t){return at("refCount")}incRef(t){return at("incRef")}timerAvailable(){return!0}time(t){return at("time")}read(t){return at("read")}readSync(t){return at("readSync")}readToGPU(t,o){return at("readToGPU")}numDataIds(){return at("numDataIds")}disposeData(t,o){return at("disposeData")}write(t,o,e){return at("write")}move(t,o,e,n,s){return at("move")}createTensorFromGPUData(t,o,e){return at("createTensorFromGPUData")}memory(){return at("memory")}floatPrecision(){return at("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return at("dispose")}};function at(r){throw new Error(`'${r}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function f(r,t){if(!r)throw new Error(typeof t=="string"?t:t())}function H(r,t,o=""){f(ut(r,t),()=>o+` Shapes ${r} and ${t} must match`)}function ht(r){f(r!=null,()=>"The input to the tensor constructor must be a non-null value.")}function W(r){if(r.length===0)return 1;let t=r[0];for(let o=1;o<r.length;o++)t*=r[o];return t}function ge(r,t){if(r===t)return!0;if(r==null||t==null||r.length!==t.length)return!1;for(let o=0;o<r.length;o++)if(r[o]!==null&&t[o]!==null&&r[o]!==t[o])return!1;return!0}function ut(r,t){if(r===t)return!0;if(r==null||t==null||r.length!==t.length)return!1;for(let o=0;o<r.length;o++)if(r[o]!==t[o])return!1;return!0}function Gt(r){return r%1===0}function nr(r,t){return t<=r.length?r:r+" ".repeat(t-r.length)}function Rt(r,t){let o=t.length;return r=r==null?t.map((e,n)=>n):[].concat(r),f(r.every(e=>e>=-o&&e<o),()=>`All values in axis param must be in range [-${o}, ${o}) but got axis ${r}`),f(r.every(e=>Gt(e)),()=>`All values in axis param must be integers but got axis ${r}`),r.map(e=>e<0?o+e:e)}function xe(r,t){let o=[],e=[],n=t!=null&&Array.isArray(t)&&t.length===0,s=t==null||n?null:Rt(t,r).sort(),i=0;for(let p=0;p<r.length;++p){if(s!=null){if(s[i]===p&&r[p]!==1)throw new Error(`Can't squeeze axis ${p} since its dim '${r[p]}' is not 1`);(s[i]==null||s[i]>p)&&r[p]===1&&(o.push(r[p]),e.push(p)),s[i]<=p&&i++}r[p]!==1&&(o.push(r[p]),e.push(p))}return{newShape:o,keptDims:e}}function be(r,t){return ko(r,t)}function ko(r,t){let o=null;if(r==null||r==="float32")o=new Float32Array(t);else if(r==="int32")o=new Int32Array(t);else if(r==="bool")o=new Uint8Array(t);else if(r==="string")o=new Array(t);else throw new Error(`Unknown data type ${r}`);return o}function Te(r,t){for(let o=0;o<r.length;o++){let e=r[o];if(isNaN(e)||!isFinite(e))throw Error(`A tensor of type ${t} being uploaded contains ${e}.`)}}function ke(r){return r==="bool"||r==="complex64"||r==="float32"||r==="int32"||r==="string"}function Tr(r){if(r==="float32"||r==="int32")return 4;if(r==="complex64")return 8;if(r==="bool")return 1;throw new Error(`Unknown dtype ${r}`)}function Ee(r){if(r==null)return 0;let t=0;return r.forEach(o=>t+=o.length),t}function kr(r){return typeof r=="string"||r instanceof String}function Wa(r){return typeof r=="boolean"}function Va(r){return typeof r=="number"}function Kt(r){return Array.isArray(r)?Kt(r[0]):r instanceof Float32Array?"float32":r instanceof Int32Array||r instanceof Uint8Array||r instanceof Uint8ClampedArray?"int32":Va(r)?"float32":kr(r)?"string":Wa(r)?"bool":"float32"}function Eo(r){return!!(r&&r.constructor&&r.call&&r.apply)}function Er(r){let t=r.length;if(t<2)return[];let o=new Array(t-1);o[t-2]=r[t-1];for(let e=t-3;e>=0;--e)o[e]=o[e+1]*r[e+1];return o}function $e(r,t,o,e=!1){let n=new Array;if(t.length===1){let s=t[0]*(e?2:1);for(let i=0;i<s;i++)n[i]=o[r+i]}else{let s=t[0],i=t.slice(1),p=i.reduce((c,u)=>c*u)*(e?2:1);for(let c=0;c<s;c++)n[c]=$e(r+c*p,i,o,e)}return n}function $o(r,t,o=!1){if(r.length===0)return t[0];let e=r.reduce((n,s)=>n*s)*(o?2:1);if(e===0)return[];if(e!==t.length)throw new Error(`[${r}] does not match the input size ${t.length}${o?" for a complex tensor":""}.`);return $e(0,r,t,o)}function Wr(r,t){let o=$r(r,t);for(let e=0;e<o.length;e++)o[e]=1;return o}function $r(r,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool")return new Uint8Array(r);throw new Error(`Unknown data type ${t}`)}function q(r){r.forEach(t=>{f(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${r}].`)})}function sr(r){return r&&r.then&&typeof r.then=="function"}var ve="tfjsflags",Vr=class{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=Ua,this.populateURLFlags()}setPlatform(t,o){this.platform!=null&&(J().getBool("IS_TEST")||J().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=o}registerFlag(t,o,e){if(this.flagRegistry[t]={evaluationFn:o,setHook:e},this.urlFlags[t]!=null){let n=this.urlFlags[t];J().getBool("IS_TEST")||J().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${n}.`),this.set(t,n)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];let o=this.evaluateFlag(t);if(sr(o))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=o,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,o){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=o,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(o)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let t=this.getQueryParams(this.global.location.search);ve in t&&t[ve].split(",").forEach(e=>{let[n,s]=e.split(":");this.urlFlags[n]=ja(n,s)})}};function Ua(r){let t={};return r.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(o,...e)=>(Ha(t,e[0],e[1]),e.join("="))),t}function Ha(r,t,o){r[decodeURIComponent(t)]=decodeURIComponent(o||"")}function ja(r,t){let o=t.toLowerCase();return o==="true"||o==="false"?o==="true":`${+o}`===o?+o:t}function J(){return ye}var ye=null;function Ne(r){ye=r}var vo;function yo(){if(vo==null){let r;if(typeof window<"u")r=window;else if(typeof __global$<"u")r=__global$;else if(typeof __Process$<"u")r=__Process$;else if(typeof self<"u")r=self;else throw new Error("Could not find a global object");vo=r}return vo}function Ya(){let r=yo();return r._tfGlobals==null&&(r._tfGlobals=new Map),r._tfGlobals}function vr(r,t){let o=Ya();if(o.has(r))return o.get(r);{let e=t();return o.set(r,e),o.get(r)}}var we="Abs",Ie="Acos",Se="Acosh",zr="Add",De="AddN",_e="All",Ae="Any",Ge="ArgMax",Me="ArgMin",Ce="Asin",Be="Asinh",Fe="Atan",Pe="Atanh",Re="Atan2",Ke="AvgPool";var Oe="AvgPool3D";var qe="BatchMatMul",Le="BatchToSpaceND",We="Bincount",Ve="BitwiseAnd";var ze="BroadcastArgs",Ur="Cast",Ue="Ceil",He="ClipByValue",je="Complex",Ye="ComplexAbs",Xe="Concat",Ze="Conv2D",Je="Conv2DBackpropFilter",Qe="Conv2DBackpropInput",tn="Conv3D";var rn="Conv3DBackpropInputV2",on="Cos",en="Cosh",nn="Cumprod",sn="Cumsum",an="CropAndResize",pn="DenseBincount",mn="DepthToSpace",cn="DepthwiseConv2dNative",un="DepthwiseConv2dNativeBackpropFilter",ln="DepthwiseConv2dNativeBackpropInput",fn="Diag",hn="Dilation2D";var dn="RealDiv",gn="Einsum",xn="Elu";var bn="Erf",Tn="Equal",kn="Exp",En="ExpandDims",$n="Expm1",vn="FFT",yn="Fill",Nn="FlipLeftRight",wn="Floor",In="FloorDiv",Sn="FusedBatchNorm",Dn="GatherV2",_n="GatherNd",An="Greater",Gn="GreaterEqual",Hr="Identity",Mn="IFFT",Cn="Imag",Bn="IsFinite",Fn="IsInf",Pn="IsNan",Rn="LeakyRelu",Kn="Less",On="LessEqual",qn="LinSpace",Ln="Log",Wn="Log1p",Vn="LogicalAnd",zn="LogicalNot",Un="LogicalOr";var Hn="LRN";var jn="Max",Yn="Maximum",Xn="MaxPool";var Zn="MaxPool3D";var Jn="MaxPoolWithArgmax",Qn="Mean",ts="Min",rs="Minimum",os="MirrorPad",es="Mod",ns="Multinomial",ss="Multiply",is="Neg",as="NotEqual",ps="NonMaxSuppressionV3",ms="NonMaxSuppressionV4",cs="NonMaxSuppressionV5",us="OnesLike",ls="OneHot",fs="Pack",hs="PadV2";var ds="Pow",gs="Prelu",xs="Prod",bs="RaggedGather",Ts="RaggedRange",ks="RaggedTensorToTensor",Es="Range",$s="Real",vs="Reciprocal",ys="Relu",Ns="Reshape",ws="ResizeNearestNeighbor";var Is="ResizeBilinear";var Ss="Relu6",Ds="Reverse",_s="Round",As="Rsqrt",Gs="ScatterNd",Ms="TensorScatterUpdate",Cs="SearchSorted",Bs="Select",Fs="Selu",Ps="Slice",Rs="Sin",Ks="Sinh",Os="Sign",qs="Sigmoid",Ls="Softplus",Ws="Sqrt",Vs="Sum",zs="SpaceToBatchND",Us="SplitV",Hs="Softmax",js="SparseFillEmptyRows",Ys="SparseReshape",Xs="SparseSegmentMean",Zs="SparseSegmentSum",Js="SparseToDense",Qs="SquaredDifference";var ti="StaticRegexReplace",ri="StridedSlice",oi="StringNGrams",ei="StringSplit",ni="StringToHashBucketFast",si="Sub",ii="Tan",ai="Tanh",jr="Tile",pi="TopK",mi="Transform",Yr="Transpose",ci="Unique",ui="Unpack",li="UnsortedSegmentSum";var fi="ZerosLike",hi="Step";var di="RotateWithOffset",No="_FusedMatMul",wo="FusedConv2D",Io="FusedDepthwiseConv2D";function ir(...r){J().getBool("IS_TEST")||J().getBool("PROD")||console.warn(...r)}var gi=vr("kernelRegistry",()=>new Map),Za=vr("gradRegistry",()=>new Map);function So(r,t){let o=Ja(r,t);return gi.get(o)}function Do(r){return Za.get(r)}function _o(r){let t=gi.entries(),o=[];for(;;){let{done:e,value:n}=t.next();if(e)break;let[s,i]=n,[p]=s.split("_");p===r&&o.push(i)}return o}function Ja(r,t){return`${t}_${r}`}function xi(r){return r instanceof Float32Array||r instanceof Int32Array||r instanceof Uint8Array||r instanceof Uint8ClampedArray}function Qa(r,t){return r instanceof Float32Array&&t==="float32"||r instanceof Int32Array&&t==="int32"||r instanceof Uint8Array&&t==="bool"}function Xr(r,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(r)&&(r=Ot(r)),J().getBool("DEBUG")&&Te(r,t),Qa(r,t))return r;if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool"){let o=new Uint8Array(r.length);for(let e=0;e<o.length;++e)Math.round(r[e])!==0&&(o[e]=1);return o}else throw new Error(`Unknown data type ${t}`)}function ar(){return J().platform.now()}function bi(r,t="utf-8"){return t=t||"utf-8",J().platform.encode(r,t)}function Ao(r,t="utf-8"){return t=t||"utf-8",J().platform.decode(r,t)}function pt(r){return J().platform.isTypedArray!=null?J().platform.isTypedArray(r):xi(r)}function Ot(r,t=[],o=!1){if(t==null&&(t=[]),typeof r=="boolean"||typeof r=="number"||typeof r=="string"||sr(r)||r==null||pt(r)&&o)t.push(r);else if(Array.isArray(r)||pt(r))for(let e=0;e<r.length;++e)Ot(r[e],t,o);else{let e=-1;for(let n of Object.keys(r))/^([1-9]+[0-9]*|0)$/.test(n)&&(e=Math.max(e,Number(n)));for(let n=0;n<=e;n++)Ot(r[n],t,o)}return t}var Zr=class{constructor(t,o){this.backendTimer=t,this.logger=o,o==null&&(this.logger=new Go)}profileKernel(t,o,e){let n,s=()=>{n=e()},i,p=ar();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(s);else{s();for(let u of n)u.dataSync();i=Promise.resolve({kernelMs:ar()-p})}if(J().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let u=0;u<n.length;u++){let h=n[u];h.data().then(d=>{tp(d,h.dtype,t)})}return{kernelName:t,outputs:n,inputs:o,timeMs:i.then(u=>u.kernelMs),extraInfo:i.then(u=>u.getExtraProfileInfo!=null?u.getExtraProfileInfo():"")}}logKernelProfile(t){let{kernelName:o,outputs:e,timeMs:n,inputs:s,extraInfo:i}=t;e.forEach(p=>{Promise.all([p.data(),n,i]).then(c=>{this.logger.logKernelProfile(o,p,c[0],c[1],s,c[2])})})}};function tp(r,t,o){if(t!=="float32")return!1;for(let e=0;e<r.length;e++){let n=r[e];if(isNaN(n)||!isFinite(n))return console.warn(`Found ${n} in the result of '${o}'`),!0}return!1}var Go=class{logKernelProfile(t,o,e,n,s,i){let p=typeof n=="number"?nr(`${n}ms`,9):n.error,c=nr(t,25),u=o.rank,h=o.size,d=nr(o.shape.toString(),14),g="";for(let b in s){let T=s[b];if(T!=null){let E=T.shape||o.shape,k=E.length;g+=`${b}: ${k}D ${k>0?E:""} `}}console.log(`%c${c}	%c${p}	%c${u}D ${d}	%c${h}	%c${g}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};function Ti(r,t,o){let e={},n={};for(let c=0;c<t.length;c++)e[t[c].id]=!0;for(let c=0;c<r.length;c++){let u=r[c],h=u.inputs;for(let d in h){let g=h[d],b=!1;for(let T=0;T<t.length;T++)if(e[g.id]){u.outputs.forEach(E=>e[E.id]=!0),b=!0,n[u.id]=!0;break}if(b)break}}let s={};s[o.id]=!0;let i={};for(let c=r.length-1;c>=0;c--){let u=r[c],h=u.inputs;for(let d=0;d<u.outputs.length;d++)if(s[u.outputs[d].id]){for(let g in h)s[h[g].id]=!0,i[u.id]=!0;break}}let p=[];for(let c=0;c<r.length;c++){let u=r[c];if(n[u.id]&&i[u.id]){let h={};for(let g in u.inputs){let b=u.inputs[g];e[b.id]&&(h[g]=b)}let d=Object.assign({},u);d.inputs=h,d.outputs=u.outputs,p.push(d)}}return p}function ki(r,t,o,e){for(let n=t.length-1;n>=0;n--){let s=t[n],i=[];if(s.outputs.forEach(c=>{let u=r[c.id];u!=null?i.push(u):i.push(null)}),s.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);let p=s.gradient(i);for(let c in s.inputs){if(!(c in p))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(p)}.`);let u=o(()=>p[c]());if(u.dtype!=="float32")throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${u.dtype}'`);let h=s.inputs[c];if(!ut(u.shape,h.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${c}' has shape '${u.shape}', which does not match the shape of the input '${h.shape}'`);if(r[h.id]==null)r[h.id]=u;else{let d=r[h.id];r[h.id]=e(d,u),d.dispose()}}}}var Ei=20,yr=3,Mo=7;function $i(r,t,o,e){let n=Er(t),s=rp(r,t,o,n),i=t.length,p=Jr(r,t,o,n,s),c=["Tensor"];return e&&(c.push(`  dtype: ${o}`),c.push(`  rank: ${i}`),c.push(`  shape: [${t}]`),c.push("  values:")),c.push(p.map(u=>"    "+u).join(`
`)),c.join(`
`)}function rp(r,t,o,e){let n=W(t),s=e[e.length-1],i=new Array(s).fill(0),p=t.length,c=o==="complex64"?wr(r):r;if(p>1)for(let u=0;u<n/s;u++){let h=u*s;for(let d=0;d<s;d++)i[d]=Math.max(i[d],Nr(c[h+d],0,o).length)}return i}function Nr(r,t,o){let e;return Array.isArray(r)?e=`${parseFloat(r[0].toFixed(Mo))} + ${parseFloat(r[1].toFixed(Mo))}j`:kr(r)?e=`'${r}'`:o==="bool"?e=vi(r):e=parseFloat(r.toFixed(Mo)).toString(),nr(e,t)}function vi(r){return r===0?"false":"true"}function Jr(r,t,o,e,n,s=!0){let i=o==="complex64"?2:1,p=t[0],c=t.length;if(c===0){if(o==="complex64"){let E=wr(r);return[Nr(E[0],0,o)]}return o==="bool"?[vi(r[0])]:[r[0].toString()]}if(c===1){if(p>Ei){let k=yr*i,v=Array.from(r.slice(0,k)),B=Array.from(r.slice((p-yr)*i,p*i));return o==="complex64"&&(v=wr(v),B=wr(B)),["["+v.map((M,S)=>Nr(M,n[S],o)).join(", ")+", ..., "+B.map((M,S)=>Nr(M,n[p-yr+S],o)).join(", ")+"]"]}return["["+(o==="complex64"?wr(r):Array.from(r)).map((k,v)=>Nr(k,n[v],o)).join(", ")+"]"]}let u=t.slice(1),h=e.slice(1),d=e[0]*i,g=[];if(p>Ei){for(let E=0;E<yr;E++){let k=E*d,v=k+d;g.push(...Jr(r.slice(k,v),u,o,h,n,!1))}g.push("...");for(let E=p-yr;E<p;E++){let k=E*d,v=k+d;g.push(...Jr(r.slice(k,v),u,o,h,n,E===p-1))}}else for(let E=0;E<p;E++){let k=E*d,v=k+d;g.push(...Jr(r.slice(k,v),u,o,h,n,E===p-1))}let b=c===2?",":"";g[0]="["+(p>0?g[0]+b:"");for(let E=1;E<g.length-1;E++)g[E]=" "+g[E]+b;let T=`,
`;for(let E=2;E<c;E++)T+=`
`;return g[g.length-1]=" "+g[g.length-1]+"]"+(s?"":T),g}function wr(r){let t=[];for(let o=0;o<r.length;o+=2)t.push([r[o],r[o+1]]);return t}var qt=class{constructor(t,o,e){if(this.dtype=o,this.shape=t.slice(),this.size=W(t),e!=null){let n=e.length;f(n===this.size,()=>`Length of values '${n}' does not match the size inferred by the shape '${this.size}'.`)}if(o==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=e||ko(o,this.size),this.strides=Er(t)}set(t,...o){o.length===0&&(o=[0]),f(o.length===this.rank,()=>`The number of provided coordinates (${o.length}) must match the rank (${this.rank})`);let e=this.locToIndex(o);this.values[e]=t}get(...t){t.length===0&&(t=[0]);let o=0;for(let n of t){if(n<0||n>=this.shape[o]){let s=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(s)}o++}let e=t[t.length-1];for(let n=0;n<t.length-1;++n)e+=this.strides[n]*t[n];return this.values[e]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let o=t[t.length-1];for(let e=0;e<t.length-1;++e)o+=this.strides[e]*t[e];return o}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];let o=new Array(this.shape.length);for(let e=0;e<o.length-1;++e)o[e]=Math.floor(t/this.strides[e]),t-=o[e]*this.strides[e];return o[o.length-1]=t,o}get rank(){return this.shape.length}toTensor(){return Tt().makeTensor(this.values,this.shape,this.dtype)}},Tt=null,Ir=null,op=null;function yi(r){Tt=r}function Ni(r){op=r}var Z=class{constructor(t,o,e,n){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=o||"float32",this.size=W(t),this.strides=Er(t),this.dataId=e,this.id=n,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let t=await this.data();return Ir.buffer(this.shape,this.dtype,t)}bufferSync(){return Ir.buffer(this.shape,this.dtype,this.dataSync())}async array(){let t=await this.data();return $o(this.shape,t,this.dtype==="complex64")}arraySync(){return $o(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let t=Tt().read(this.dataId);if(this.dtype==="string"){let o=await t;try{return o.map(e=>Ao(e))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),Tt().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();let t=Tt().readSync(this.dataId);if(this.dtype==="string")try{return t.map(o=>Ao(o))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();let t=await Tt().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),Tt().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return Ir.print(this,t)}clone(){return this.throwIfDisposed(),Ir.clone(this)}toString(t=!1){let o=this.dataSync();return $i(o,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),Ir.cast(this,t)}variable(t=!0,o,e){return this.throwIfDisposed(),Tt().makeVariable(this,t,o,e)}};Object.defineProperty(Z,Symbol.hasInstance,{value:r=>!!r&&r.data!=null&&r.dataSync!=null&&r.throwIfDisposed!=null});function Co(){return vr("Tensor",()=>Z)}Co();var Lt=class extends Z{constructor(t,o,e,n){super(t.shape,t.dtype,t.dataId,n),this.trainable=o,this.name=e}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!ut(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);Tt().disposeTensor(this),this.dataId=t.dataId,Tt().incRef(this,null)}dispose(){Tt().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(Lt,Symbol.hasInstance,{value:r=>r instanceof Z&&r.assign!=null&&r.assign instanceof Function});var wi;(function(r){r.R0="R0",r.R1="R1",r.R2="R2",r.R3="R3",r.R4="R4",r.R5="R5",r.R6="R6"})(wi||(wi={}));var Bo;(function(r){r.float32="float32",r.int32="int32",r.bool="int32",r.complex64="complex64"})(Bo||(Bo={}));var Fo;(function(r){r.float32="float32",r.int32="int32",r.bool="bool",r.complex64="complex64"})(Fo||(Fo={}));var Po;(function(r){r.float32="float32",r.int32="float32",r.bool="float32",r.complex64="complex64"})(Po||(Po={}));var Ro;(function(r){r.float32="complex64",r.int32="complex64",r.bool="complex64",r.complex64="complex64"})(Ro||(Ro={}));var ep={float32:Po,int32:Bo,bool:Fo,complex64:Ro};function Ii(r,t){if(r==="string"||t==="string"){if(r==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${r} with ${t}`)}return ep[r][t]}function Qr(r){return r!=null&&typeof r=="object"&&"texture"in r&&r.texture instanceof WebGLTexture}function to(r){return typeof GPUBuffer<"u"&&r!=null&&typeof r=="object"&&"buffer"in r&&r.buffer instanceof GPUBuffer}function w(r,t){if(r.dtype===t.dtype)return[r,t];let o=Ii(r.dtype,t.dtype);return[r.cast(o),t.cast(o)]}function Si(r,t){f(r.dtype===t.dtype,()=>`The dtypes of the first(${r.dtype}) and second(${t.dtype}) input must match`)}function ro(r){let t=[];return Di(r,t,new Set),t}function Di(r,t,o){if(r==null)return;if(r instanceof Z){t.push(r);return}if(!np(r))return;let e=r;for(let n in e){let s=e[n];o.has(s)||(o.add(s),Di(s,t,o))}}function np(r){return Array.isArray(r)||typeof r=="object"}function Ko(r){return r.kernelName!=null}var oo=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(let t in this.registeredVariables)this.registeredVariables[t].dispose()}},Sr=class r{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new oo}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let t=this.getSortedBackends();for(let o=0;o<t.length;o++){let e=t[o];if(await this.initializeBackend(e).success){await this.setBackend(e);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:t,asyncInit:o}=this.initializeBackendsAndReturnBest();if(o)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){let{asyncInit:o}=this.initializeBackend(t);if(o)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,o,e=1){return t in this.registryFactory?(ir(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:o,priority:e},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;let{success:o,asyncInit:e}=this.initializeBackend(t);if(!(e?await o:o))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new Zr(this.backendInstance),!0}setupRegisteredKernels(){_o(this.backendName).forEach(o=>{o.setupFunc!=null&&o.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){_o(t).forEach(e=>{e.disposeFunc!=null&&e.disposeFunc(this.registry[t])})}initializeBackend(t){let o=this.registryFactory[t];if(o==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{let e=o.factory();if(e&&!(e instanceof Lr)&&typeof e.then=="function"){let n=++this.pendingBackendInitId,s=e.then(i=>n<this.pendingBackendInitId?!1:(this.registry[t]=i,this.pendingBackendInit=null,!0)).catch(i=>(n<this.pendingBackendInitId||(this.pendingBackendInit=null,ir(`Initialization of backend ${t} failed`),ir(i.stack||i.message)),!1));return this.pendingBackendInit=s,{success:s,asyncInit:!0}}else return this.registry[t]=e,{success:!0,asyncInit:!1}}catch(e){return ir(`Initialization of backend ${t} failed`),ir(e.stack||e.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,o)=>this.registryFactory[o].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){let t=this.getSortedBackends();for(let o=0;o<t.length;o++){let e=t[o],{success:n,asyncInit:s}=this.initializeBackend(e);if(s||n)return{name:e,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,o){let e=this.state.tensorInfo.get(o),n=e.backend,s=this.readSync(o),i=n.refCount(o);n.disposeData(o,!0),e.backend=t,t.move(o,s,e.shape,e.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,o){let e=null;if(o==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");o=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof o!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");e=t}let n;return this.scopedRun(()=>this.startScope(e),()=>this.endScope(n),()=>(n=o(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n))}scopedRun(t,o,e){t();try{let n=e();return o(),n}catch(n){throw o(),n}}nextTensorId(){return r.nextTensorId++}nextVariableId(){return r.nextVariableId++}clone(t){let o=l.runKernel(Hr,{x:t}),e={x:t},n=i=>({x:()=>{let p="float32",c={x:i},u={dtype:p};return l.runKernel(Ur,c,u)}}),s=[];return this.addTapeNode(this.state.activeScope.name,e,[o],n,s,{}),o}runKernel(t,o,e){if(this.backendName==null&&this.backend,!(So(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:o,attrs:e})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,o,e){let n=this.backend.numDataIds(),s=0;e.forEach(c=>{s+=c.dtype==="complex64"?3:1});let i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],p=n-o-s-i;if(p>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${p} data ids) after running '${t}'`)}runKernelFunc(t){let o,e=[],n=this.isTapeOn(),s=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let p;this.backendName==null&&this.backend;let c,u=Ko(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Ko(t)){let{kernelName:T,inputs:E,attrs:k}=t;this.backendName==null&&this.backend;let v=So(T,this.backendName);f(v!=null,()=>`Cannot find registered kernel '${T}' for backend '${this.backendName}'`),p=()=>{let B=this.backend.numDataIds();c=v.kernelFunc({inputs:E,attrs:k,backend:this.backend});let M=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(T,B,M);let S=M.map(F=>F.rank!=null?F:this.makeTensorFromTensorInfo(F));if(n){let F=this.getTensorsForGradient(T,E,S);e=this.saveTensorsForBackwardMode(F)}return S}}else{let{forwardFunc:T}=t,E=k=>{n&&(e=k.map(v=>this.keep(this.clone(v))))};p=()=>{let k=this.backend.numDataIds();c=this.tidy(()=>T(this.backend,E));let v=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(u,k,v),v}}let{inputs:h,attrs:d}=t,g=Ko(t)?null:t.backwardsFunc,b;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?o=p():(b=this.profiler.profileKernel(u,h,()=>p()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(b),o=b.outputs)}),n&&this.addTapeNode(u,h,o,g,e,d),this.state.profiling&&this.state.activeProfile.kernels.push({name:u,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(T=>h[T]!=null?h[T].shape:null),outputShapes:o.map(T=>T.shape),kernelTimeMs:b.timeMs,extraInfo:b.extraInfo}),Array.isArray(c)?o:o[0]}saveTensorsForBackwardMode(t){return t.map(e=>this.keep(this.clone(e)))}getTensorsForGradient(t,o,e){let n=Do(t);if(n!=null){let s=n.inputsToSave||[],i=n.outputsToSave||[],p;n.saveAllInputs?(f(Array.isArray(o),()=>"saveAllInputs is true, expected inputs to be an array."),p=Object.keys(o).map(u=>o[u])):p=s.map(u=>o[u]);let c=e.filter((u,h)=>i[h]);return p.concat(c)}return[]}makeTensor(t,o,e,n){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");e=e||"float32",n=n||this.backend;let s=t;e==="string"&&kr(t[0])&&(s=t.map(c=>bi(c)));let i=n.write(s,o,e),p=new Z(o,e,i,this.nextTensorId());if(this.trackTensor(p,n),e==="string"){let c=this.state.tensorInfo.get(i),u=Ee(s);this.state.numBytes+=u-c.bytes,c.bytes=u}return p}makeTensorFromDataId(t,o,e,n){e=e||"float32";let s={dataId:t,shape:o,dtype:e};return this.makeTensorFromTensorInfo(s,n)}makeTensorFromTensorInfo(t,o){let{dataId:e,shape:n,dtype:s}=t,i=new Z(n,s,e,this.nextTensorId());return this.trackTensor(i,o),i}makeVariable(t,o=!0,e,n){e=e||this.nextVariableId().toString(),n!=null&&n!==t.dtype&&(t=t.cast(n));let s=new Lt(t,o,e,this.nextTensorId());if(this.state.registeredVariables[s.name]!=null)throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(t,o){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let e=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(e=t.size*Tr(t.dtype)),this.state.numBytes+=e,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:o||this.backend,dtype:t.dtype,shape:t.shape,bytes:e})),t instanceof Lt||this.track(t)}incRef(t,o){this.trackTensor(t,o),this.backend.incRef(t.dataId)}removeDataId(t,o){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===o&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;let o=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=o.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){let e=t.size*Tr(t.dtype);this.state.numBytes-=e}o.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,o.backend)}disposeVariables(){for(let t in this.state.registeredVariables){let o=this.state.registeredVariables[t];this.disposeVariable(o)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){let t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;let o=this.state.numBytes,e=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(n=>n.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-o,this.state.activeProfile.newTensors=this.state.numTensors-e;for(let n of this.state.activeProfile.kernels)n.kernelTimeMs=await n.kernelTimeMs,n.extraInfo=await n.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,o,e,n,s,i){let p={id:this.state.nextTapeNodeId++,kernelName:t,inputs:o,outputs:e,saved:s},c=Do(t);c!=null&&(n=c.gradFunc),n!=null&&(p.gradient=u=>(u=u.map((h,d)=>{if(h==null){let g=e[d],b=$r(g.size,g.dtype);return this.makeTensor(b,g.shape,g.dtype)}return h}),n(u.length>1?u:u[0],s,i))),this.state.activeTape.push(p)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){let o={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(o.name=t),this.state.scopeStack.push(o),this.state.activeScope=o}endScope(t){let o=ro(t),e=new Set(o.map(s=>s.id));for(let s=0;s<this.state.activeScope.track.length;s++){let i=this.state.activeScope.track[s];!i.kept&&!e.has(i.id)&&i.dispose()}let n=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],o.forEach(s=>{!s.kept&&s.scopeId===n.id&&this.track(s)})}gradients(t,o,e,n=!1){if(f(o.length>0,()=>"gradients() received an empty list of xs."),e!=null&&e.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${e.dtype}'`);let s=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));f(s instanceof Z,()=>"The result y returned by f() must be a tensor.");let i=Ti(this.state.activeTape,o,s);if(!n&&i.length===0&&o.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{let p={};p[s.id]=e??sp(s.shape),ki(p,i,u=>this.tidy(u),ap);let c=o.map(u=>p[u.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(u=>{for(let h of u.saved)h.dispose()}),this.state.activeTape=null),{value:s,grads:c}})}customGrad(t){return f(Eo(t),()=>"The f passed in customGrad(f) must be a function."),(...o)=>{f(o.every(p=>p instanceof Z),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let e,n={};o.forEach((p,c)=>{n[c]=p});let s=(p,c)=>(e=t(...o,c),f(e.value instanceof Z,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),f(Eo(e.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),e.value),i=(p,c)=>{let u=e.gradFunc(p,c),h=Array.isArray(u)?u:[u];f(h.length===o.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),f(h.every(g=>g instanceof Z),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let d={};return h.forEach((g,b)=>{d[b]=()=>g}),d};return this.runKernelFunc({forwardFunc:s,backwardsFunc:i,inputs:n})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,o){return this.state.tensorInfo.get(t).backend.readToGPU(t,o)}async time(t){let o=ar(),e=await this.backend.time(t);return e.wallMs=ar()-o,e}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new oo;for(let t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};Sr.nextTensorId=0;Sr.nextVariableId=0;function sp(r){let t=Wr(W(r),"float32");return l.makeTensor(t,r,"float32")}function ip(){let r=yo();if(r._tfengine==null){let t=new Vr(r);r._tfengine=new Sr(t)}return Ne(r._tfengine.ENV),yi(()=>r._tfengine),r._tfengine}var l=ip();function ap(r,t){let o={a:r,b:t};return l.runKernel(zr,o)}function st(r,t){let o=r;if(pt(r))return t==="string"?[]:[r.length];if(Qr(r)){let n=r.channels||"RGBA";return[r.height,r.width*n.length]}else if(to(r))return[r.buffer.size/(t==null?4:Tr(t))];if(!Array.isArray(r))return[];let e=[];for(;Array.isArray(o)||pt(o)&&t!=="string";)e.push(o.length),o=o[0];return Array.isArray(r)&&J().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Ai(r,e,[]),e}function Ai(r,t,o){if(o=o||[],!Array.isArray(r)&&!pt(r)){f(t.length===0,()=>`Element arr[${o.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}f(t.length>0,()=>`Element arr[${o.join("][")}] should be a primitive, but is an array of ${r.length} elements`),f(r.length===t[0],()=>`Element arr[${o.join("][")}] should have ${t[0]} elements, but has ${r.length} elements`);let e=t.slice(1);for(let n=0;n<r.length;++n)Ai(r[n],e,o.concat(n))}function _i(r,t,o,e){if(r!=="string_or_numeric"){if(r==null)throw new Error("Expected dtype cannot be null.");if(r!=="numeric"&&r!==t||r==="numeric"&&t==="string")throw new Error(`Argument '${o}' passed to '${e}' must be ${r} tensor, but got ${t} tensor`)}}function a(r,t,o,e="numeric"){if(r instanceof Co())return _i(e,r.dtype,t,o),r;let n=Kt(r);if(n!=="string"&&["bool","int32","float32"].indexOf(e)>=0&&(n=e),_i(e,n,t,o),r==null||!pt(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string"){let c=r==null?"null":r.constructor.name;throw new Error(`Argument '${t}' passed to '${o}' must be a Tensor or TensorLike, but got '${c}'`)}let s=st(r,n);!pt(r)&&!Array.isArray(r)&&(r=[r]);let p=n!=="string"?Xr(r,n):Ot(r,[],!0);return l.makeTensor(p,s,n)}function Wt(r,t,o,e="numeric"){if(!Array.isArray(r))throw new Error(`Argument ${t} passed to ${o} must be a \`Tensor[]\` or \`TensorLike[]\``);return r.map((s,i)=>a(s,`${t}[${i}]`,o,e))}var Gi="__op";function m(r){let t=Object.keys(r);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let o=t[0],e=r[o];o.endsWith("_")&&(o=o.substring(0,o.length-1)),o=o+Gi;let n=(...s)=>{l.startScope(o);try{let i=e(...s);return sr(i)&&console.error("Cannot return a Promise inside of tidy."),l.endScope(i),i}catch(i){throw l.endScope(null),i}};return Object.defineProperty(n,"name",{value:o,configurable:!0}),n}function pp(r){let t=a(r,"x","abs");if(t.dtype==="complex64"){let o={x:t};return l.runKernel(Ye,o)}else{let o={x:t};return l.runKernel(we,o)}}var ot=m({abs_:pp});function mp(r){let o={x:a(r,"x","acos")};return l.runKernel(Ie,o)}var cp=m({acos_:mp});function up(r){let o={x:a(r,"x","acosh")};return l.runKernel(Se,o)}var lp=m({acosh_:up});function fp(r,t){let o=a(r,"a","add"),e=a(t,"b","add");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(zr,n)}var R=m({add_:fp});function hp(r){f(Array.isArray(r),()=>"The argument passed to tf.addN() must be a list of tensors"),f(r.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${r.length}`);let t=r.map((n,s)=>a(n,`tensors${s}`,"addN")),o=t[0];t.forEach(n=>{if(n.dtype!==o.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),t.forEach(n=>{if(!ut(n.shape,o.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});let e=t;return l.runKernel(De,e)}var dp=m({addN_:hp});function gp(r,t=null,o=!1){let n={x:a(r,"x","all","bool")},s={axis:t,keepDims:o};return l.runKernel(_e,n,s)}var xp=m({all_:gp});function bp(r,t=null,o=!1){let n={x:a(r,"x","any","bool")},s={axis:t,keepDims:o};return l.runKernel(Ae,n,s)}var Tp=m({any_:bp});function kp(r,t=0){let e={x:a(r,"x","argMax")},n={axis:t};return l.runKernel(Ge,e,n)}var Ep=m({argMax_:kp});function $p(r,t=0){let e={x:a(r,"x","argMin")},n={axis:t};return l.runKernel(Me,e,n)}var vp=m({argMin_:$p});function yp(r){let o={x:a(r,"x","asin")};return l.runKernel(Ce,o)}var Np=m({asin_:yp});function wp(r){let o={x:a(r,"x","asinh")};return l.runKernel(Be,o)}var Ip=m({asinh_:wp});function Sp(r){let o={x:a(r,"x","atan")};return l.runKernel(Fe,o)}var Dp=m({atan_:Sp});function _p(r,t){let o=a(r,"a","atan2"),e=a(t,"b","atan2");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(Re,n)}var Ap=m({atan2_:_p});function Gp(r){let o={x:a(r,"x","atanh")};return l.runKernel(Pe,o)}var Mp=m({atanh_:Gp});function Cp(r,t){let o=a(r,"x","cast");if(!ke(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if(t==="string"&&o.dtype!=="string"||t!=="string"&&o.dtype==="string")throw new Error("Only strings can be casted to strings");let e={x:o},n={dtype:t};return l.runKernel(Ur,e,n)}var C=m({cast_:Cp});function Mi(r,t,o,e,n,s,i="channelsLast"){let[p,c]=Dr(t),u;if(i==="channelsLast")u=[p,c,r[3],r[3]];else if(i==="channelsFirst")u=[p,c,r[1],r[1]];else throw new Error(`Unknown dataFormat ${i}`);return _r(r,u,o,e,n,s,!1,i)}function _r(r,t,o,e,n,s,i=!1,p="channelsLast"){let[c,u,h,d]=[-1,-1,-1,-1];if(p==="channelsLast")[c,u,h,d]=r;else if(p==="channelsFirst")[c,d,u,h]=r;else throw new Error(`Unknown dataFormat ${p}`);let[g,b,,T]=t,[E,k]=Dr(o),[v,B]=Dr(e),M=Oo(g,v),S=Oo(b,B),{padInfo:F,outHeight:I,outWidth:L}=Pp(n,u,h,E,k,M,S,s,p),O=i?T*d:T,K;return p==="channelsFirst"?K=[c,O,I,L]:p==="channelsLast"&&(K=[c,I,L,O]),{batchSize:c,dataFormat:p,inHeight:u,inWidth:h,inChannels:d,outHeight:I,outWidth:L,outChannels:O,padInfo:F,strideHeight:E,strideWidth:k,filterHeight:g,filterWidth:b,effectiveFilterHeight:M,effectiveFilterWidth:S,dilationHeight:v,dilationWidth:B,inShape:r,outShape:K,filterShape:t}}function Bp(r,t,o,e,n){e==null&&(e=Fp(r,t,o));let s=r[0],i=r[1],p=eo((s-t+2*e)/o+1,n),c=eo((i-t+2*e)/o+1,n);return[p,c]}function Fp(r,t,o,e=1){let n=Oo(t,e);return Math.floor((r[0]*(o-1)-o+n)/2)}function Dr(r){return typeof r=="number"?[r,r,r]:r.length===2?[r[0],r[1],1]:r}function Oo(r,t){return t<=1?r:r+(r-1)*(t-1)}function Pp(r,t,o,e,n,s,i,p,c){let u,h,d;if(typeof r=="number"){u={top:r,bottom:r,left:r,right:r,type:r===0?"VALID":"NUMBER"};let b=Bp([t,o],s,e,r,p);h=b[0],d=b[1]}else if(r==="same"){h=Math.ceil(t/e),d=Math.ceil(o/n);let g=Math.max(0,(h-1)*e+s-t),b=Math.max(0,(d-1)*n+i-o),T=Math.floor(g/2),E=g-T,k=Math.floor(b/2),v=b-k;u={top:T,bottom:E,left:k,right:v,type:"SAME"}}else if(r==="valid")u={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((t-s+1)/e),d=Math.ceil((o-i+1)/n);else if(typeof r=="object"){let g=c==="channelsLast"?r[1][0]:r[2][0],b=c==="channelsLast"?r[1][1]:r[2][1],T=c==="channelsLast"?r[2][0]:r[3][0],E=c==="channelsLast"?r[2][1]:r[3][1];u={top:g,bottom:b,left:T,right:E,type:g===0&&b===0&&T===0&&E===0?"VALID":"EXPLICIT"},h=eo((t-s+g+b)/e+1,p),d=eo((o-i+T+E)/n+1,p)}else throw Error(`Unknown padding parameter: ${r}`);return{padInfo:u,outHeight:h,outWidth:d}}function eo(r,t){if(!t)return Math.trunc(r);switch(t){case"round":return Math.round(r);case"ceil":return Math.ceil(r);case"floor":return Math.floor(r);default:throw new Error(`Unknown roundingMode ${t}`)}}function pr(r){let[t,o,e]=Dr(r);return t===1&&o===1&&e===1}function et(r,t){return pr(r)||pr(t)}function Nt(r){return Dr(r).every(t=>t>0)}function X(r,t,o){if(o!=null){if(typeof t=="string")throw Error(`Error in ${r}: pad must be an integer when using dimRoundingMode ${o} but got pad ${t}.`);if(typeof t=="number")f(Gt(t),()=>`Error in ${r}: pad must be an integer when using dimRoundingMode ${o} but got pad ${t}.`);else if(typeof t=="object")t.forEach(e=>{e.forEach(n=>{f(Gt(n),()=>`Error in ${r}: pad must be an integer when using dimRoundingMode ${o} but got pad ${n}.`)})});else throw Error(`Error in ${r}: Unknown padding parameter: ${t}`)}}function Rp(r,t){let e={x:a(r,"x","reshape","string_or_numeric")},n={shape:t};return l.runKernel(Ns,e,n)}var x=m({reshape_:Rp});function Kp(r,t,o,e,n){let s=a(r,"x","avgPool","float32"),i=1;f(et(o,i),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${o} and dilations '${i}'`);let p=s,c=!1;s.rank===3&&(c=!0,p=x(s,[1,s.shape[0],s.shape[1],s.shape[2]])),f(p.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${p.rank}.`),X("avgPool",e,n);let u={x:p},h={filterSize:t,strides:o,pad:e,dimRoundingMode:n},d=l.runKernel(Ke,u,h);return d=C(d,s.dtype),c?x(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var qo=m({avgPool_:Kp});function Op(r,t,o,e,n,s="NDHWC"){let i=a(r,"x","avgPool3d","float32"),p=i,c=!1;i.rank===4&&(c=!0,p=x(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),f(p.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${p.rank}.`),f(s==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),f(typeof o=="number"&&o>0||Array.isArray(o)&&o[0]>0&&o[1]>0&&o[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${o}'`),X("avgPool3d",e,n);let u={x:p},h={filterSize:t,strides:o,pad:e,dimRoundingMode:n,dataFormat:s},d=l.runKernel(Oe,u,h);return d=C(d,p.dtype),c?x(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}var qp=m({avgPool3d_:Op});function Lp(r){let o={x:a(r,"x","clone","string_or_numeric")};return l.runKernel(Hr,o)}var wt=m({clone_:Lp});function Wp(r,t=0){f(r.length>=1,()=>"Pass at least one tensor to concat");let o=Wt(r,"tensors","concat","string_or_numeric");if(o[0].dtype==="complex64"&&o.forEach(s=>{if(s.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${s.dtype}. `)}),o.length===1)return wt(o[0]);let e=o,n={axis:t};return l.runKernel(Xe,e,n)}var j=m({concat_:Wp});function Vp(r,t,o=!1,e=!1){let n=a(r,"a","matMul"),s=a(t,"b","matMul");[n,s]=w(n,s);let i={a:n,b:s},p={transposeA:o,transposeB:e};return l.runKernel(qe,i,p)}var D=m({matMul_:Vp});function zp(r,t){let o=a(r,"a","mul"),e=a(t,"b","mul");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(ss,n)}var y=m({mul_:zp});function Up(r){let o={x:a(r,"x","sigmoid","float32")};return l.runKernel(qs,o)}var It=m({sigmoid_:Up});function Hp(r,t,o){let e=a(r,"x","slice","string_or_numeric");if(e.rank===0)throw new Error("Slicing scalar is not possible");let n={x:e},s={begin:t,size:o};return l.runKernel(Ps,n,s)}var _=m({slice_:Hp});function jp(r){let o={x:a(r,"x","tanh","float32")};return l.runKernel(ai,o)}var no=m({tanh_:jp});function Yp(r,t,o,e,n,s){let i=a(r,"forgetBias","basicLSTMCell"),p=a(t,"lstmKernel","basicLSTMCell"),c=a(o,"lstmBias","basicLSTMCell"),u=a(e,"data","basicLSTMCell"),h=a(n,"c","basicLSTMCell"),d=a(s,"h","basicLSTMCell"),g=j([u,d],1),b=D(g,p),T=R(b,c),E=T.shape[0],k=T.shape[1]/4,v=[E,k],B=_(T,[0,0],v),M=_(T,[0,k],v),S=_(T,[0,k*2],v),F=_(T,[0,k*3],v),I=R(y(It(B),no(M)),y(h,It(R(i,S)))),L=y(no(I),It(F));return[I,L]}var Xp=m({basicLSTMCell_:Yp});function Zp(r,t,o){let e=a(r,"x","batchToSpaceND"),n=t.reduce((p,c)=>p*c);f(e.rank>=1+t.length,()=>`input rank is ${e.rank} but should be > than blockShape.length ${t.length}`),f(o.length===t.length,()=>`crops.length is ${o.length} but should be equal to blockShape.length  ${t.length}`),f(e.shape[0]%n===0,()=>`input tensor batch is ${e.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${n}`);let s={x:e},i={blockShape:t,crops:o};return l.runKernel(Le,s,i)}var Lo=m({batchToSpaceND_:Zp});function Ci(r){let t;return r.rank===0||r.rank===1?t=x(r,[1,1,1,r.size]):r.rank===2?t=x(r,[1,1,r.shape[0],r.shape[1]]):r.rank===3?t=x(r,[1,r.shape[0],r.shape[1],r.shape[2]]):t=r,t}function Jp(r,t,o,e,n,s){s==null&&(s=.001);let i=a(r,"x","batchNorm"),p=a(t,"mean","batchNorm"),c=a(o,"variance","batchNorm"),u;n!=null&&(u=a(n,"scale","batchNorm"));let h;e!=null&&(h=a(e,"offset","batchNorm")),f(p.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),f(h==null||p.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),f(u==null||p.rank===u.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let g={x:Ci(i),scale:u,offset:h,mean:p,variance:c},b={varianceEpsilon:s},T=l.runKernel(Sn,g,b);return x(T,i.shape)}var Vt=m({batchNorm_:Jp});function Qp(r,t,o,e,n,s){let i=a(r,"x","batchNorm"),p=a(t,"mean","batchNorm"),c=a(o,"variance","batchNorm"),u;n!=null&&(u=a(n,"scale","batchNorm"));let h;return e!=null&&(h=a(e,"offset","batchNorm")),f(i.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${i.rank}.`),f(p.rank===2||p.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${p.rank}.`),f(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),u!=null&&f(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${u.rank}.`),h!=null&&f(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),Vt(i,p,c,h,u,s)}var tm=m({batchNorm2d_:Qp});function rm(r,t,o,e,n,s){let i=a(r,"x","batchNorm"),p=a(t,"mean","batchNorm"),c=a(o,"variance","batchNorm"),u;n!=null&&(u=a(n,"scale","batchNorm"));let h;return e!=null&&(h=a(e,"offset","batchNorm")),f(i.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${i.rank}.`),f(p.rank===3||p.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${p.rank}.`),f(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),u!=null&&f(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${u.rank}.`),h!=null&&f(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),Vt(i,p,c,h,u,s)}var om=m({batchNorm3d_:rm});function em(r,t,o,e,n,s){let i=a(r,"x","batchNorm"),p=a(t,"mean","batchNorm"),c=a(o,"variance","batchNorm"),u;n!=null&&(u=a(n,"scale","batchNorm"));let h;return e!=null&&(h=a(e,"offset","batchNorm")),f(i.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${i.rank}.`),f(p.rank===4||p.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${p.rank}.`),f(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),u!=null&&f(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${u.rank}.`),h!=null&&f(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),Vt(i,p,c,h,u,s)}var nm=m({batchNorm4d_:em});function sm(r,t,o){let e=a(r,"x","bincount"),n=a(t,"weights","bincount");f(e.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${e.dtype}`),f(o>=0,()=>`size must be non-negative, but got ${o}.`),f(n.size===e.size||n.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${e.shape}, weights shape: ${n.shape}.`);let s={x:e,weights:n},i={size:o};return l.runKernel(We,s,i)}var Wo=m({bincount_:sm});function im(r,t){let o=a(r,"x","bitwiseAnd"),e=a(t,"y","bitwiseAnd");if(!ut(o.shape,e.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${o.shape}, y: ${e.shape}`);if(o.dtype!=="int32"||e.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${o.dtype} and type of y: ${e.dtype}`);let n={a:o,b:e};return l.runKernel(Ve,n)}var am=m({bitwiseAnd_:im});function pm(r,t){let o=a(r,"s0","broadcastArgs","int32"),e=a(t,"s1","broadcastArgs","int32");if(o.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${o.rank}`);if(e.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${e.rank}`);let n={s0:o,s1:e};return l.runKernel(ze,n)}var mm=m({broadcastArgs_:pm});function cm(r,t){let o=a(r,"broadcastTo","x"),e=o.shape;if(q(t),t.length<o.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${o.rank}.`);if(t.length>o.rank){let u=o.shape.slice();for(;u.length<t.length;)u.unshift(1);o=x(o,u)}let n=o.shape,s=Array.from(t);for(let u=t.length-1;u>=0;u--)if(n[u]===t[u])s[u]=1;else if(o.shape[u]!==1)throw new Error(`broadcastTo(): [${e}] cannot be broadcast to [${t}].`);if(s.map((u,h)=>u>1?h:-1).filter(u=>u>=0).length===0)return wt(o);let p={x:o},c={reps:s};return l.runKernel(jr,p,c)}var Ar=m({broadcastTo_:cm});function mt(r,t="float32",o){return t=t||"float32",q(r),new qt(r,t,o)}function um(r){let o={x:a(r,"x","ceil","float32")};return l.runKernel(Ue,o)}var lm=m({ceil_:um});function zt(r,t,o){q(r),o=o||Kt(t);let e={shape:r,value:t,dtype:o};return l.runKernel(yn,{},e)}function fm(r,t,o){let e=a(r,"x","clipByValue");if(f(t<=o,()=>`Error in clip: min (${t}) must be less than or equal to max (${o}).`),t===o)return zt(e.shape,t,e.dtype);let n={x:e},s={clipValueMin:t,clipValueMax:o};return l.runKernel(He,n,s)}var hm=m({clipByValue_:fm});function dm(r,t){let o=a(r,"real","complex"),e=a(t,"imag","complex");H(o.shape,e.shape,`real and imag shapes, ${o.shape} and ${e.shape}, must match in call to tf.complex().`);let n={real:o,imag:e};return l.runKernel(je,n)}var dt=m({complex_:dm});function gm(r){return j(r,0)}var xm=m({concat1d_:gm});function bm(r,t){return j(r,t)}var Tm=m({concat2d_:bm});function km(r,t){return j(r,t)}var Em=m({concat3d_:km});function $m(r,t){return j(r,t)}var vm=m({concat4d_:$m});function ym(r,t,o,e,n="NHWC",s=[1,1],i){let p=a(r,"x","conv2d","float32"),c=a(t,"filter","conv2d","float32"),u=p,h=!1;p.rank===3&&(h=!0,u=x(p,[1,p.shape[0],p.shape[1],p.shape[2]])),f(u.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${u.rank}.`),f(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),X("conv2d",e,i);let d=n==="NHWC"?u.shape[3]:u.shape[1];f(d===c.shape[2],()=>`Error in conv2d: depth of input (${d}) must match input depth for filter ${c.shape[2]}.`),f(et(o,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`),f(Nt(s),()=>"Error in conv2D: Dilated rates should be larger than 0."),f(Nt(o),()=>"Error in conv2D: Strides should be larger than 0.");let g={x:u,filter:c},b={strides:o,pad:e,dataFormat:n,dilations:s,dimRoundingMode:i},T=l.runKernel(Ze,g,b);return h?x(T,[T.shape[1],T.shape[2],T.shape[3]]):T}var Ut=m({conv2d_:ym});function Nm(r,t,o,e,n="NWC",s=1,i){let p=a(r,"x","conv1d"),c=a(t,"filter","conv1d"),u=p,h=!1;p.rank===2&&(h=!0,u=x(p,[1,p.shape[0],p.shape[1]])),f(u.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${u.rank}.`),f(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),X("conv1d",e,i),f(u.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${u.shape[2]}) must match input depth for filter ${c.shape[1]}.`),f(et(o,s),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${o} and dilation '${s}'`),f(Nt(s),()=>"Error in conv1D: Dilated rates should be larger than 0."),f(Nt(o),()=>"Error in conv1D: Stride should be larger than 0."),f(n==="NWC",()=>`Error in conv1d: got dataFormat of ${n} but only NWC is currently supported.`);let d=x(c,[1,c.shape[0],c.shape[1],c.shape[2]]),g=x(u,[u.shape[0],1,u.shape[1],u.shape[2]]),k=Ut(g,d,[1,o],e,"NHWC",[1,s],i);return h?x(k,[k.shape[2],k.shape[3]]):x(k,[k.shape[0],k.shape[2],k.shape[3]])}var wm=m({conv1d_:Nm});function Im(r,t,o,e,n,s="NHWC",i){f(r.length===t.rank,()=>`Length of inShape (${r.length}) and rank of dy (${t.rank}) must match`);let p=r,c=t,u=!1;t.rank===3&&(u=!0,c=x(t,[1,t.shape[0],t.shape[1],t.shape[2]]),p=[1,r[0],r[1],r[2]]),f(p.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${p.length}.`),f(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),f(o.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${o.rank}`);let h=s==="NHWC"?p[3]:p[1],d=s==="NHWC"?c.shape[3]:c.shape[1];f(h===o.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${o.shape[2]}.`),f(d===o.shape[3],()=>`Error in conv2dDerInput: depth of output (${d}) must match output depth for filter ${o.shape[3]}.`),X("conv2dDerInput",n,i);let g={dy:c,filter:o},b={strides:e,pad:n,dataFormat:s,dimRoundingMode:i,inputShape:p},T=l.runKernel(Qe,g,b);return u?x(T,[T.shape[1],T.shape[2],T.shape[3]]):T}var so=m({conv2DBackpropInput_:Im});function Sm(r,t,o,e,n,s){let i=a(r,"x","conv2dTranspose"),p=a(t,"filter","conv2dTranspose");return so(o,i,p,e,n,"NHWC",s)}var Dm=m({conv2dTranspose_:Sm});function _m(r,t,o,e,n="NDHWC",s=[1,1,1]){let i=a(r,"x","conv3d"),p=a(t,"filter","conv3d"),c=i,u=!1;i.rank===4&&(u=!0,c=x(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),f(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),f(p.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${p.rank}.`),f(c.shape[4]===p.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${p.shape[3]}.`),f(et(o,s),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`),f(n==="NDHWC",()=>`Error in conv3d: got dataFormat of ${n} but only NDHWC is currently supported.`),f(Nt(s),()=>"Error in conv3D: Dilated rates should be larger than 0."),f(Nt(o),()=>"Error in conv3D: Strides should be larger than 0.");let h={x:c,filter:p},d={strides:o,pad:e,dataFormat:n,dilations:s},g=l.runKernel(tn,h,d);return u?x(g,[g.shape[1],g.shape[2],g.shape[3],g.shape[4]]):g}var Am=m({conv3d_:_m});function Gm(r,t,o,e,n){f(r.length===t.rank,()=>`Length of inShape (${r.length}) and rank of dy (${t.rank}) must match`);let s=r,i=t,p=!1;t.rank===4&&(p=!0,i=x(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),s=[1,r[0],r[1],r[2],r[3]]);let c=s[4],u=i.shape[4];f(s.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${s.length}.`),f(i.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${i.rank}`),f(o.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${o.rank}`),f(c===o.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${o.shape[3]}.`),f(u===o.shape[4],()=>`Error in conv3dDerInput: depth of output (${u}) must match output depth for filter ${o.shape[4]}.`);let h={dy:i,filter:o},d={pad:n,strides:e,inputShape:s},g=l.runKernel(rn,h,d);return p?x(g,[g.shape[1],g.shape[2],g.shape[3],g.shape[4]]):g}var Bi=m({conv3DBackpropInput_:Gm});function Mm(r,t,o,e,n){let s=a(r,"x","conv3dTranspose"),i=a(t,"filter","conv3dTranspose");return Bi(o,s,i,e,n)}var Cm=m({conv3dTranspose_:Mm});function Bm(r){let o={x:a(r,"x","cos","float32")};return l.runKernel(on,o)}var Fm=m({cos_:Bm});function Pm(r){let o={x:a(r,"x","cosh","float32")};return l.runKernel(en,o)}var Rm=m({cosh_:Pm});function Km(r,t=0,o=!1,e=!1){let s={x:a(r,"x","cumprod")},i={axis:t,exclusive:o,reverse:e};return l.runKernel(nn,s,i)}var Om=m({cumprod_:Km});function qm(r,t=0,o=!1,e=!1){let s={x:a(r,"x","cumsum")},i={axis:t,exclusive:o,reverse:e};return l.runKernel(sn,s,i)}var Lm=m({cumsum_:qm});function Wm(r,t,o,e=!1){let n=a(r,"x","denseBincount"),s=a(t,"weights","denseBincount");f(n.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${n.dtype}`),f(n.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${n.rank}.`),f(o>=0,()=>`size must be non-negative, but got ${o}.`),f(s.size===n.size||s.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${n.shape}, weights shape: ${s.shape}.`);let i={x:n,weights:s},p={size:o,binaryOutput:e};return l.runKernel(pn,i,p)}var Vm=m({denseBincount_:Wm});function zm(r,t,o="NHWC"){let e=a(r,"x","depthToSpace","float32"),n=o==="NHWC"?e.shape[1]:e.shape[2],s=o==="NHWC"?e.shape[2]:e.shape[3],i=o==="NHWC"?e.shape[3]:e.shape[1];f(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),f(n*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${n} and ${t}  for depthToSpace with input shape
    ${e.shape}`),f(s*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${t} for depthToSpace with input shape
        ${e.shape}`),f(i%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${i} for depthToSpace with input shape ${e.shape}`);let p={x:e},c={blockSize:t,dataFormat:o};return l.runKernel(mn,p,c)}var Um=m({depthToSpace_:zm});function Hm(r,t,o,e,n="NHWC",s=[1,1],i){let p=a(r,"x","depthwiseConv2d","float32"),c=a(t,"filter","depthwiseConv2d","float32"),u=p,h=!1;p.rank===3&&(h=!0,u=x(p,[1,p.shape[0],p.shape[1],p.shape[2]])),f(u.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${u.rank}.`),f(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);let d=n==="NHWC"?u.shape[3]:u.shape[1];f(d===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${d}) must match the inChannels dimension in filter ${c.shape[2]}.`),X("depthwiseConv2d",e,i);let g={x:u,filter:c},b={strides:o,pad:e,dataFormat:n,dilations:s,dimRoundingMode:i},T=l.runKernel(cn,g,b);return h?x(T,[T.shape[1],T.shape[2],T.shape[3]]):T}var Gr=m({depthwiseConv2d_:Hm});function jm(r){let o={x:a(r,"x","diag")};return l.runKernel(fn,o)}var Ym=m({diag_:jm});function Xm(r,t,o,e,n=[1,1],s="NHWC"){let i=a(r,"x","dilation2d"),p=a(t,"filter","dilation2d");f(i.rank===3||i.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${i.rank}.`),f(p.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${p.rank}.`),f(s==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${s}`);let c=i,u=!1;i.rank===3&&(c=x(i,[1,i.shape[0],i.shape[1],i.shape[2]]),u=!0),f(c.shape[3]===p.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${c.shape[3]} vs ${p.shape[2]}`);let h={x:c,filter:p},d={strides:o,pad:e,dilations:n},g=l.runKernel(hn,h,d);return u?x(g,[g.shape[1],g.shape[2],g.shape[3]]):g}var Zm=m({dilation2d_:Xm});function Jm(r,t){let o=a(r,"a","floorDiv"),e=a(t,"b","floorDiv");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(In,n)}var Vo=m({floorDiv_:Jm});function Qm(r,t){let o=a(r,"a","div"),e=a(t,"b","div");if([o,e]=w(o,e),o.dtype==="int32"&&e.dtype==="int32")return Vo(o,e);let n={a:o,b:e},s={};return l.runKernel(dn,n,s)}var z=m({div_:Qm});function Fi(r,t){let o=[];for(let e=0;e<t.length;e++){let n=r[r.length-e-1],s=t.length-e-1,i=t[s];(n==null||n===1&&i>1)&&o.unshift(s)}return o}function A(r,t){let o=Math.max(r.length,t.length),e=new Array(o);for(let n=0;n<o;n++){let s=r[r.length-n-1];s==null&&(s=1);let i=t[t.length-n-1];if(i==null&&(i=1),s===1)e[o-n-1]=i;else if(i===1)e[o-n-1]=s;else if(s!==i){let p=`Operands could not be broadcast together with shapes ${r} and ${t}.`;throw Error(p)}else e[o-n-1]=s}return e}function tc(r,t){let o=a(r,"a","equal","string_or_numeric"),e=a(t,"b","equal","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Tn,n)}var zo=m({equal_:tc});function rc(r,t,o){let e=a(t,"a","where"),n=a(o,"b","where"),s=a(r,"condition","where","bool"),i=A(A(s.shape,e.shape),n.shape),p=Ar(s,i),c=Ar(e,i),u=Ar(n,i),h={condition:p,t:c,e:u};return l.runKernel(Bs,h)}var gt=m({where_:rc});function oc(r){let o={x:a(r,"x","zerosLike")};return l.runKernel(fi,o)}var Mr=m({zerosLike_:oc});function ec(r,t){let o=a(r,"a","div"),e=a(t,"b","div");[o,e]=w(o,e);let n=z(o,e),s=Mr(n),i=zo(e,s);return gt(i,s,n)}var nc=m({divNoNan_:ec});function sc(r,t){let o=a(r,"t1","dot"),e=a(t,"t2","dot");f((o.rank===1||o.rank===2)&&(e.rank===1||e.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${o.rank} and ${e.rank}.`);let n=o.rank===1?o.size:o.shape[1],s=e.rank===1?e.size:e.shape[0];if(f(n===s,()=>`Error in dot: inner dimensions of inputs must match, but got ${n} and ${s}.`),o.rank===1&&e.rank===1){let i=x(o,[1,-1]),p=x(e,[-1,1]),c=D(i,p);return x(c,[])}else if(o.rank===1&&e.rank===2){let i=x(o,[1,-1]),p=x(e,[e.shape[0],e.shape[1]]),c=D(i,p);return x(c,[c.size])}else if(o.rank===2&&e.rank===1){let i=x(e,[-1,1]),p=D(o,i);return x(p,[p.size])}else{let i=x(e,[e.shape[0],e.shape[1]]);return D(o,i)}}var ic=m({dot_:sc});function ac(r,...t){let o=t.map((n,s)=>a(n,`tensors${s}`,"einsum")),e={equation:r};return l.runKernel(gn,o,e)}var Ht=m({einsum_:ac});function pc(r){let o={x:a(r,"x","elu","float32")};return l.runKernel(xn,o)}var Uo=m({elu_:pc});function mc(r,t){let o=a(r,"x","ensureShape","string_or_numeric");if(!ge(o.shape,t))throw new Error(`EnsureShape: Shape of tensor ${o.shape} is not compatible with expected shape ${t}`);return r}var cc=m({ensureShape_:mc});function uc(r){let t=a(r,"x","erf");f(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=C(t,"float32"));let o={x:t};return l.runKernel(bn,o)}var lc=m({erf_:uc});function fc(r,t,o){let e=r.length+t.length,n=[],s=0,i=0;for(let p=0;p<e;p++)o.indexOf(p)===-1?n.push(r[s++]):n.push(t[i++]);return n}function Mt(r,t){let o=t.map(e=>1);return fc(r,o,t)}function dc(r,t=null,o=!1){let n={x:a(r,"x","max")},s={reductionIndices:t,keepDims:o};return l.runKernel(jn,n,s)}var St=m({max_:dc});function gc(r,t=null,o=!1){let n={x:a(r,"x","min")},s={axis:t,keepDims:o};return l.runKernel(ts,n,s)}var ao=m({min_:gc});function xc(r,t){let o=a(r,"base","pow"),e=a(t,"exp","pow");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(ds,n)}var Cr=m({pow_:xc});function nt(r,t,o,e){if(e==null)e=Kt(r);else if(e==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(to(r)||Qr(r)){if(e!=="float32"&&e!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${e}.`);return l.backend.createTensorFromGPUData(r,t||o,e)}if(!pt(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){q(t);let n=W(t),s=W(o);f(n===s,()=>`Based on the provided shape, [${t}], the tensor should have ${n} values but has ${s}`);for(let i=0;i<o.length;++i){let p=o[i],c=i===o.length-1?p!==W(t.slice(i)):!0;f(o[i]===t[i]||!c,()=>`Error creating a new Tensor. Inferred shape (${o}) does not match the provided shape (${t}). `)}}return!pt(r)&&!Array.isArray(r)&&(r=[r]),t=t||o,r=e!=="string"?Xr(r,e):Ot(r,[],!0),l.makeTensor(r,t,e)}function P(r,t){if((pt(r)&&t!=="string"||Array.isArray(r))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&pt(r)&&!(r instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return nt(r,[],[],t)}function bc(r){let o={x:a(r,"x","sqrt","float32")};return l.runKernel(Ws,o)}var po=m({sqrt_:bc});function Tc(r){let t=a(r,"x","square"),o={};return l.runKernel("Square",{x:t},o)}var jt=m({square_:Tc});function kc(r,t=null,o=!1){let e=a(r,"x","sum");e.dtype==="bool"&&(e=C(e,"int32"));let n={x:e},s={axis:t,keepDims:o};return l.runKernel(Vs,n,s)}var G=m({sum_:kc});function Ec(r,t="euclidean",o=null,e=!1){r=a(r,"x","norm");let n=Pi(r,t,o),s=n.shape;if(e){let i=Rt(o,r.shape);s=Mt(n.shape,i)}return x(n,s)}function Pi(r,t,o=null){if(r.rank===0)return ot(r);if(r.rank!==1&&o===null)return Pi(x(r,[-1]),t,o);if(r.rank===1||typeof o=="number"||Array.isArray(o)&&o.length===1){if(t===1)return G(ot(r),o);if(t===1/0)return St(ot(r),o);if(t===-1/0)return ao(ot(r),o);if(t==="euclidean"||t===2)return po(G(Cr(ot(r),P(2,"int32")),o));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(o)&&o.length===2){if(t===1)return St(G(ot(r),o[0]),o[1]-1);if(t===1/0)return St(G(ot(r),o[1]),o[0]);if(t===-1/0)return ao(G(ot(r),o[1]),o[0]);if(t==="fro"||t==="euclidean")return po(G(jt(r),o));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${o}`)}var mr=m({norm_:Ec});function $c(r,t=null,o=!1){return mr(r,"euclidean",t,o)}var vc=m({euclideanNorm_:$c});function yc(r){let o={x:a(r,"x","exp")};return l.runKernel(kn,o)}var kt=m({exp_:yc});function Nc(r,t=0){let o=a(r,"x","expandDims","string_or_numeric");f(t<=o.rank,()=>"Axis must be <= rank of the tensor");let e={input:o},n={dim:t};return l.runKernel(En,e,n)}var vt=m({expandDims_:Nc});function wc(r){let o={x:a(r,"x","expm1")};return l.runKernel($n,o)}var Ic=m({expm1_:wc});function Sc(r,t){let o=a(r,"x","tile","string_or_numeric");f(o.rank===t.length,()=>`Error in transpose: rank of input ${o.rank} must match length of reps ${t}.`);let e={x:o},n={reps:t};return l.runKernel(jr,e,n)}var Yt=m({tile_:Sc});function Dc(r,t,o,e="float32"){t==null&&(t=r);let n=mt([r,t],e),s=r<=t?r:t;for(let p=0;p<s;++p)n.set(1,p,p);let i=x(n.toTensor(),[r,t]);if(o==null)return i;if(o.length===1)return Yt(vt(i,0),[o[0],1,1]);if(o.length===2)return Yt(vt(vt(i,0),0),[o[0],o[1],1,1]);if(o.length===3)return Yt(vt(vt(vt(i,0),0),0),[o[0],o[1],o[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${o.length}D.`)}var Ho=m({eye_:Dc});function _c(r){let o={x:a(r,"x","floor","float32")};return l.runKernel(wn,o)}var jo=m({floor_:_c});function Ac(r,t,o=0,e=0){let n=a(r,"x","gather"),s=a(t,"indices","gather","int32"),i={x:n,indices:s},p={axis:o,batchDims:e};return l.runKernel(Dn,i,p)}var Yo=m({gather_:Ac});function Gc(r,t){let o=a(r,"a","greater","string_or_numeric"),e=a(t,"b","greater","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(An,n)}var cr=m({greater_:Gc});function Mc(r,t){let o=a(r,"a","greaterEqual","string_or_numeric"),e=a(t,"b","greaterEqual","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Gn,n)}var Xo=m({greaterEqual_:Mc});function Cc(r){let o={input:a(r,"input","imag")};return l.runKernel(Cn,o)}var Xt=m({imag_:Cc});function Bc(r){let o={x:a(r,"x","isFinite")};return l.runKernel(Bn,o)}var Fc=m({isFinite_:Bc});function Pc(r){let o={x:a(r,"x","isInf")};return l.runKernel(Fn,o)}var Rc=m({isInf_:Pc});function Kc(r){let o={x:a(r,"x","isNaN")};return l.runKernel(Pn,o)}var Oc=m({isNaN_:Kc});function qc(r,t=.2){let e={x:a(r,"x","leakyRelu")},n={alpha:t};return l.runKernel(Rn,e,n)}var Zo=m({leakyRelu_:qc});function Lc(r,t){let o=a(r,"a","less","string_or_numeric"),e=a(t,"b","less","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Kn,n)}var mo=m({less_:Lc});function Wc(r,t){let o=a(r,"a","lessEqual","string_or_numeric"),e=a(t,"b","lessEqual","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(On,n)}var Br=m({lessEqual_:Wc});function Vc(r,t,o){if(o<=0)throw new Error("The number of values should be positive.");let e={start:r,stop:t,num:o};return l.runKernel(qn,{},e)}function zc(r,t=5,o=1,e=1,n=.5){let s=a(r,"x","localResponseNormalization");f(s.rank===4||s.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${s.rank}.`),f(Gt(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let i=s,p=!1;s.rank===3&&(p=!0,i=x(s,[1,s.shape[0],s.shape[1],s.shape[2]]));let c={x:i},u={depthRadius:t,bias:o,alpha:e,beta:n},h=l.runKernel(Hn,c,u);return p?x(h,[h.shape[1],h.shape[2],h.shape[3]]):h}var Uc=m({localResponseNormalization_:zc});function Hc(r){let o={x:a(r,"x","log","float32")};return l.runKernel(Ln,o)}var Ct=m({log_:Hc});function jc(r){let o={x:a(r,"x","log1p")};return l.runKernel(Wn,o)}var Jo=m({log1p_:jc});function it(r){return l.customGrad(r)}function Yc(r){let o={x:a(r,"x","neg")};return l.runKernel(is,o)}var rt=m({neg_:Yc});function Xc(r){let o={x:a(r,"x","softplus")};return l.runKernel(Ls,o)}var Qo=m({softplus_:Xc});function Zc(r){let t=a(r,"x","logSigmoid");return it(e=>({value:rt(Qo(rt(e))),gradFunc:i=>y(i,It(rt(e)))}))(t)}var Jc=m({logSigmoid_:Zc});function Qc(r,t){let o=a(r,"a","sub"),e=a(t,"b","sub");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(si,n)}var N=m({sub_:Qc});function tu(r,t=-1){let o=a(r,"logits","logSoftmax");if(t===-1&&(t=o.rank-1),t!==o.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${o.rank} and axis was ${t}`);return it((n,s)=>{let p=St(n,t,!0),c=N(n,p),u=N(C(c,"float32"),Ct(G(kt(c),t,!0)));return s([u]),{value:u,gradFunc:(d,g)=>{let[b]=g,T=!0,E=kt(b);return N(d,y(G(d,t,T),E))}}})(o)}var ru=m({logSoftmax_:tu});function ou(r,t=null,o=!1){let e=a(r,"x","logSumExp"),n=Rt(t,e.shape),s=St(e,n,!0),i=N(e,s),p=kt(i),c=G(p,n),u=Ct(c),h=R(x(s,u.shape),u);if(o){let d=Mt(h.shape,n);return x(h,d)}return h}var te=m({logSumExp_:ou});function eu(r,t){let o=a(r,"a","logicalAnd","bool"),e=a(t,"b","logicalAnd","bool");A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Vn,n)}var ur=m({logicalAnd_:eu});function nu(r){let o={x:a(r,"x","logicalNot","bool")};return l.runKernel(zn,o)}var re=m({logicalNot_:nu});function su(r,t){let o=a(r,"a","logicalOr","bool"),e=a(t,"b","logicalOr","bool");A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Un,n)}var oe=m({logicalOr_:su});function iu(r,t){let o=a(r,"a","logicalXor","bool"),e=a(t,"b","logicalXor","bool");return A(o.shape,e.shape),ur(oe(r,t),re(ur(r,t)))}var au=m({logicalXor_:iu});var co=2147483648;function pu(r,t,o="left"){let e=a(r,"sortedSequence","searchSorted"),n=a(t,"values","searchSorted"),s=e.shape[e.shape.length-1],i=n.shape[n.shape.length-1],p=x(e,[-1,s]),c=x(n,[-1,i]);if(p.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(p.shape[0]!==c.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(W(c.shape)>=co)throw new Error(`values tensor size must less than ${co}`);if(p.shape[1]>=co)throw new Error(`trailing dim_size must less than ${co} for int32 output type, was ${p.shape[1]}`);let u={sortedSequence:p,values:c},h={side:o};return l.runKernel(Cs,u,h)}var uo=m({searchSorted_:pu});function mu(r,t){return uo(r,t,"left")}function cu(r,t,o,e,n){let s=a(r,"x","maxPool"),i=1,p=s,c=!1;s.rank===3&&(c=!0,p=x(s,[1,s.shape[0],s.shape[1],s.shape[2]])),f(p.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${p.rank}.`),f(et(o,i),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '${i}'`),X("maxPool",e,n);let u={x:p},h={filterSize:t,strides:o,pad:e,dimRoundingMode:n},d=l.runKernel(Xn,u,h);return c?x(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var ee=m({maxPool_:cu});function uu(r,t=[1,1,1],o,e,n,s="NDHWC"){let i=a(r,"x","maxPool3d"),p=i,c=!1;i.rank===4&&(c=!0,p=x(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),f(p.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${p.rank}.`),f(s==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),X("maxPool3d",e,n);let u={x:p},h={filterSize:t,strides:o,pad:e,dimRoundingMode:n,dataFormat:s},d=l.runKernel(Zn,u,h);return c?x(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}var lu=m({maxPool3d_:uu});function fu(r,t,o,e,n=!1){let i={x:a(r,"x","maxPoolWithArgmax")},p={filterSize:t,strides:o,pad:e,includeBatchInIndex:n},c=l.runKernel(Jn,i,p);return{result:c[0],indexes:c[1]}}var hu=m({maxPoolWithArgmax_:fu});function du(r,t){let o=a(r,"a","maximum"),e=a(t,"b","maximum");[o,e]=w(o,e),o.dtype==="bool"&&(o=C(o,"int32"),e=C(e,"int32")),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(Yn,n)}var gu=m({maximum_:du});function xu(r,t=null,o=!1){let n={x:a(r,"x","mean")},s={axis:t,keepDims:o};return l.runKernel(Qn,n,s)}var lr=m({mean_:xu});function Dt(r,t="float32"){if(q(r),t==="complex64"){let e=Dt(r,"float32"),n=Dt(r,"float32");return dt(e,n)}let o=$r(W(r),t);return l.makeTensor(o,r,t)}function _t(r,t="float32"){if(q(r),t==="complex64"){let e=_t(r,"float32"),n=Dt(r,"float32");return dt(e,n)}let o=Wr(W(r),t);return l.makeTensor(o,r,t)}function bu(r,t,{indexing:o="xy"}={}){if(o!=="xy"&&o!=="ij")throw new TypeError(`${o} is not a valid third argument to meshgrid`);if(r===void 0)return[];let e=a(r,"x","meshgrid",r instanceof Z?r.dtype:"float32");if(t===void 0)return[e];let n=a(t,"y","meshgrid",t instanceof Z?t.dtype:"float32"),s=W(e.shape),i=W(n.shape);return o==="xy"?(e=x(e,[1,-1]),n=x(n,[-1,1]),[D(_t([i,1],e.dtype),e),D(n,_t([1,s],n.dtype))]):(e=x(e,[-1,1]),n=x(n,[1,-1]),[D(e,_t([1,i],e.dtype)),D(_t([s,1],n.dtype),n)])}function Tu(r,t){let o=a(r,"a","minimum"),e=a(t,"b","minimum");[o,e]=w(o,e),o.dtype==="bool"&&(o=C(o,"int32"),e=C(e,"int32")),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(rs,n)}var fr=m({minimum_:Tu});function ku(r,t,o){f(o==="reflect"||o==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${o}.`);let e=a(r,"x","mirrorPad");if(e.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");f(t.length===e.rank,()=>`Padding doesn't match input. Must be ${e.rank}. Got ${t.length}.`);let n=o==="reflect"?1:0;for(let p=0;p<e.rank;p++)f(t[p].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),f(t[p][0]>=0&&t[p][0]<=e.shape[p]-n&&t[p][1]>=0&&t[p][1]<=e.shape[p]-n,()=>`Padding in dimension ${p} cannot be greater than or equal to ${e.shape[p]-n} or less than 0 for input of shape ${e.shape}`);let s={paddings:t,mode:o},i={x:e};return l.runKernel(os,i,s)}var Eu=m({mirrorPad_:ku});function $u(r,t){let o=a(r,"a","mod"),e=a(t,"b","mod");[o,e]=w(o,e);let n={a:o,b:e};return l.runKernel(es,n)}var vu=m({mod_:$u});function yu(r,t=null,o=!1){r=a(r,"x","moments");let e=Rt(t,r.shape),n=lr(r,e,o),s=n.shape;o||(s=Mt(n.shape,e));let i=jt(N(C(r,"float32"),x(n,s))),p=lr(i,e,o);return{mean:n,variance:p}}var Nu=m({moments_:yu});function wu(r,t,o,e){let n=a(t,"data","multiRNNCell"),s=Wt(o,"c","multiRNNCell"),i=Wt(e,"h","multiRNNCell"),p=n,c=[];for(let d=0;d<r.length;d++){let g=r[d](p,s[d],i[d]);c.push(g[0]),c.push(g[1]),p=g[1]}let u=[],h=[];for(let d=0;d<c.length;d+=2)u.push(c[d]),h.push(c[d+1]);return[u,h]}var Iu=m({multiRNNCell_:wu});function Su(r,t,o,e=!1){let n=a(r,"logits","multinomial"),s=n.size,i=n.rank;if(s<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${s}.`);if(i>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${i}`);o=o||Math.random();let c={logits:i===1?x(n,[1,-1]):n},u={numSamples:t,seed:o,normalized:e},h=l.runKernel(ns,c,u);return i===1?x(h,[h.size]):h}var Du=m({multinomial_:Su});function _u(r,t){let o=a(r,"a","notEqual","string_or_numeric"),e=a(t,"b","notEqual","string_or_numeric");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e};return l.runKernel(as,n)}var ne=m({notEqual_:_u});function Au(r,t,o=1,e=0,n="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);let i={indices:a(r,"indices","oneHot","int32")},p={dtype:n,depth:t,onValue:o,offValue:e};return l.runKernel(ls,i,p)}var Gu=m({oneHot_:Au});function Mu(r){let o={x:a(r,"x","onesLike")};return l.runKernel(us,o)}var Cu=m({onesLike_:Mu});function Bu(r,t){let o=a(r,"v1","outerProduct"),e=a(t,"v2","outerProduct");f(o.rank===1&&e.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${o.rank} and ${e.rank}.`);let n=x(o,[-1,1]),s=x(e,[1,-1]);return D(n,s)}var Fu=m({outerProduct_:Bu});function Pu(r,t,o=0){let e=a(r,"x","pad");if(e.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");let n={paddings:t,constantValue:o},s={x:e};return l.runKernel(hs,s,n)}var At=m({pad_:Pu});function Ru(r,t,o=0){return f(t.length===2,()=>"Invalid number of paddings. Must be length of 2."),At(r,[t],o)}var Ku=m({pad1d_:Ru});function Ou(r,t,o=0){return f(t.length===2&&t[0].length===2&&t[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),At(r,t,o)}var qu=m({pad2d_:Ou});function Lu(r,t,o=0){return f(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),At(r,t,o)}var Wu=m({pad3d_:Lu});function Vu(r,t,o=0){return f(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),At(r,t,o)}var zu=m({pad4d_:Vu});function Uu(r,t,o){let e=a(r,"x","spaceToBatchND");f(e.rank>=1+t.length,()=>`input rank ${e.rank} should be > than [blockShape] ${t.length}`),f(o.length===t.length,()=>`paddings.shape[0] ${o.length} must be equal to [blockShape] ${t.length}`),f(e.shape.reduce((i,p,c)=>c>0&&c<=t.length?i&&(p+o[c-1][0]+o[c-1][1])%t[c-1]===0:i,!0),()=>`input spatial dimensions ${e.shape.slice(1)} with paddings ${o.toString()} must be divisible by blockShapes ${t.toString()}`);let n={x:e},s={blockShape:t,paddings:o};return l.runKernel(zs,n,s)}var se=m({spaceToBatchND_:Uu});function Hu(r,t,o,e,n,s,i){n==null&&(n=[1,1]),s==null&&(s=1),e===0&&(e="valid");let p=a(r,"x","maxPool"),c=p,u=!1;p.rank===3&&(u=!0,c=x(p,[1,p.shape[0],p.shape[1],p.shape[2]])),f(et(s,n),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${s} and dilations '${n}'`);let h=Mi(c.shape,t,s,n,e),d=[h.dilationHeight,h.dilationWidth],g;e==="same"?g=Yu([h.filterHeight,h.filterWidth],d):g=[[0,0],[0,0]];let b=d[0]===1&&d[1]===1,[T,E]=ju([h.inHeight,h.inWidth],d,g),k=b?e:"valid",v=b?c:se(c,d,T),M=(o==="avg"?()=>qo(v,t,s,k,i):()=>ee(v,t,s,k,i))(),S=b?M:Lo(M,d,E);return u?x(S,[S.shape[1],S.shape[2],S.shape[3]]):S}function ju(r,t,o){let e=o.map(h=>h[0]),n=o.map(h=>h[1]),s=r.concat(e,n),i=t.map((h,d)=>(h-s[d]%h)%h),p=n.map((h,d)=>h+i[d]),c=t.map((h,d)=>[e[d],p[d]]),u=t.map((h,d)=>[0,i[d]]);return[c,u]}function Yu(r,t){let e=r.map((i,p)=>i+(i-1)*(t[p]-1)).map(i=>i-1),n=e.map(i=>Math.floor(i/2)),s=e.map((i,p)=>i-n[p]);return e.map((i,p)=>[n[p],s[p]])}var Xu=m({pool_:Hu});function Zu(r,t){let o=a(r,"x","prelu"),e=a(t,"alpha","prelu"),n={x:o,alpha:e};return l.runKernel(gs,n)}var ie=m({prelu_:Zu});function Ju(r,t=!1){console.log(r.toString(t))}function Qu(r,t=null,o=!1){let e=a(r,"x","prod");e.dtype==="bool"&&(e=C(e,"int32"));let n={x:e},s={axis:t,keepDims:o};return l.runKernel(xs,n,s)}var tl=m({prod_:Qu});function rl(r,t,o,e){let n=r.map((h,d)=>a(h,`tensors${d}`,"raggedGather","int32")),s=a(t,"paramsDenseValues","raggedGather"),i=a(o,"indices","raggedGather","int32"),p={paramsNestedSplits:n,paramsDenseValues:s,indices:i},c={outputRaggedRank:e},u=l.runKernel(bs,p,c);return{outputNestedSplits:u.slice(0,u.length-1),outputDenseValues:u[u.length-1]}}var ol=m({raggedGather_:rl});function el(r,t,o){let e=a(r,"starts","raggedRange"),n=a(t,"limits","raggedRange",e.dtype),s=a(o,"deltas","raggedRange",e.dtype),i={starts:e,limits:n,deltas:s},p=l.runKernel(Ts,i);return{rtNestedSplits:p[0],rtDenseValues:p[1]}}var nl=m({raggedRange_:el});function sl(r,t,o,e,n){let s=a(r,"shape","raggedTensorToTensor","int32"),i=a(t,"values","raggedTensorToTensor"),p=a(o,"defaultValue","raggedTensorToTensor",i.dtype),c=e.map((d,g)=>a(d,`tensors${g}`,"raggedTensorToTensor","int32")),u={shape:s,values:i,defaultValue:p,rowPartitionTensors:c},h={rowPartitionTypes:n};return l.runKernel(ks,u,h)}var il=m({raggedTensorToTensor_:sl});function al(r,t,o){q(r);let e=W(r),n=null;if(o==null||o==="float32")n=new Float32Array(e);else if(o==="int32")n=new Int32Array(e);else if(o==="bool")n=new Uint8Array(e);else throw new Error(`Unknown data type ${o}`);for(let s=0;s<e;s++)n[s]=t();return l.makeTensor(n,r,o)}var pl=m({rand_:al});import*as ho from"/v135/seedrandom@3.0.5/denonext/seedrandom.mjs";var Zt=class{constructor(t,o,e,n,s){this.mean=t,this.stdDev=o,this.dtype=e,this.nextVal=NaN,this.truncated=n,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);let i=s||Math.random();this.random=ho.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){let n=this.nextVal;return this.nextVal=NaN,n}let t,o,e=!1;for(;!e;){let n,s,i;do n=2*this.random()-1,s=2*this.random()-1,i=n*n+s*s;while(i>=1||i===0);let p=Math.sqrt(-2*Math.log(i)/i);t=this.mean+this.stdDev*n*p,o=this.mean+this.stdDev*s*p,(!this.truncated||this.isValidTruncated(t))&&(e=!0)}return(!this.truncated||this.isValidTruncated(o))&&(this.nextVal=this.convertValue(o)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}},lo=class{constructor(t,o,e,n){this.alpha=t,this.beta=1/o,this.dtype=e;let s=n||Math.random();this.randu=ho.alea(s.toString()),this.randn=new Zt(0,1,e,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,o,e,n,s,i;for(;;){do n=this.randn.nextValue(),i=1+this.c*n;while(i<=0);if(i*=i*i,t=n*n,o=1-.331*t*t,e=.5*t+this.d*(1-i+Math.log(i)),s=this.randu(),s<o||Math.log(s)<e)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}},fo=class{constructor(t=0,o=1,e,n){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=o-t,this.dtype=e,n==null&&(n=Math.random()),typeof n=="number"&&(n=n.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${o} <= 1 and dtype is not float`);this.random=ho.alea(n)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}};function ml(r,t,o=1,e="float32",n){if(q(r),o==null&&(o=1),e==null&&(e="float32"),e!=="float32"&&e!=="int32")throw new Error(`Unsupported data type ${e}`);let s=new lo(t,o,e,n),i=mt(r,e);for(let p=0;p<i.values.length;p++)i.values[p]=s.nextValue();return i.toTensor()}var cl=m({randomGamma_:ml});function ul(r,t=0,o=1,e,n){if(q(r),e!=null&&e==="bool")throw new Error(`Unsupported data type ${e}`);let s=new Zt(t,o,e,!1,n),i=mt(r,e);for(let p=0;p<i.values.length;p++)i.values[p]=s.nextValue();return i.toTensor()}var ae=m({randomNormal_:ul});function ll(r,t,o){if(t!=null&&t==="bool")throw new Error(`Unsupported data type ${t}`);return ae(r,0,1,t,o)}var fl=m({randomStandardNormal_:ll});function hl(r,t=0,o=1,e="float32",n){q(r);let s=mt(r,e),i=new fo(t,o,null,n);for(let p=0;p<s.values.length;p++)s.values[p]=i.nextValue();return s.toTensor()}var Fr=m({randomUniform_:hl});function dl(r,t,o,e){return Fr(r,t,o,"int32",e)}var gl=m({randomUniformInt_:dl});function Jt(r,t,o=1,e="float32"){if(o===0)throw new Error("Cannot have a step of zero");let n={start:r,stop:t,step:o,dtype:e};return l.runKernel(Es,{},n)}function xl(r){let o={input:a(r,"input","real")};return l.runKernel($s,o)}var Bt=m({real_:xl});function bl(r){let o={x:a(r,"x","reciprocal")};return l.runKernel(vs,o)}var Tl=m({reciprocal_:bl});function kl(r){let o={x:a(r,"x","relu")};return l.runKernel(ys,o)}var Qt=m({relu_:kl});function El(r){let o={x:a(r,"x","relu6")};return l.runKernel(Ss,o)}var pe=m({relu6_:El});function $l(r,t){let e={x:a(r,"x","reverse")},n={dims:t};return l.runKernel(Ds,e,n)}var xt=m({reverse_:$l});function vl(r){let t=a(r,"x","reverse");return f(t.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`),xt(t,0)}var yl=m({reverse1d_:vl});function Nl(r,t){let o=a(r,"x","reverse");return f(o.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${o.rank}.`),xt(o,t)}var wl=m({reverse2d_:Nl});function Il(r,t){let o=a(r,"x","reverse");return f(o.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${o.rank}.`),xt(o,t)}var Sl=m({reverse3d_:Il});function Dl(r,t){let o=a(r,"x","reverse");return f(o.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${o.rank}.`),xt(o,t)}var _l=m({reverse4d_:Dl});function Al(r){let o={x:a(r,"x","round")};return l.runKernel(_s,o)}var me=m({round_:Al});function Gl(r){let o={x:a(r,"x","rsqrt","float32")};return l.runKernel(As,o)}var Ml=m({rsqrt_:Gl});function Cl(r){let o={x:a(r,"x","selu")};return l.runKernel(Fs,o)}var Bl=m({selu_:Cl});function Fl(r,t,o,e,n,s=[1,1],i="NHWC"){let p=a(r,"x","separableConv2d"),c=a(t,"depthwiseFilter","separableConv2d"),u=a(o,"pointwiseFilter","separableConv2d"),h=p,d=!1;if(p.rank===3&&(d=!0,h=x(p,[1,p.shape[0],p.shape[1],p.shape[2]])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");f(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),f(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),f(u.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),f(u.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${u.shape[0]}.`),f(u.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${u.shape[1]}.`);let g=c.shape[2],b=c.shape[3];f(u.shape[2]===g*b,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${g*b}, but got ${u.shape[2]}.`);let T=Gr(h,c,e,n,i,s),k=Ut(T,u,1,"valid",i);return d?x(k,[k.shape[1],k.shape[2],k.shape[3]]):k}var Pl=m({separableConv2d_:Fl});async function Rl(r,t){let o=a(r,"x","setdiff1d"),e=a(t,"y","setdiff1d");f(o.dtype===e.dtype,()=>`x and y should have the same dtype, but got x (${o.dtype}) and y (${e.dtype}).`),f(o.rank===1,()=>`x should be 1D tensor, but got x (${o.shape}).`),f(e.rank===1,()=>`y should be 1D tensor, but got y (${e.shape}).`);let n=await o.data(),s=await e.data(),i=new Set(s),p=0;for(let h=0;h<n.length;h++)i.has(n[h])||p++;let c=new qt([p],o.dtype),u=new qt([p],"int32");for(let h=0,d=0;h<n.length;h++)i.has(n[h])||(c.values[d]=n[h],u.values[d]=h,d++);return[c.toTensor(),u.toTensor()]}var Kl=Rl;function Ol(r){let o={x:a(r,"x","sign")};return l.runKernel(Os,o)}var ql=m({sign_:Ol});function Ll(r){let o={x:a(r,"x","sin","float32")};return l.runKernel(Rs,o)}var Wl=m({sin_:Ll});function Vl(r){let o={x:a(r,"x","sinh")};return l.runKernel(Ks,o)}var zl=m({sinh_:Vl});function Ul(r,t,o){let e=a(r,"x","slice1d");return f(e.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${e.rank} tensor`),_(e,[t],[o])}var Hl=m({slice1d_:Ul});function jl(r,t,o){let e=a(r,"x","slice2d");return f(e.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${e.rank} tensor`),_(e,t,o)}var Yl=m({slice2d_:jl});function Xl(r,t,o){let e=a(r,"x","slice3d");return f(e.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${e.rank} tensor`),_(e,t,o)}var Zl=m({slice3d_:Xl});function Jl(r,t,o){let e=a(r,"x","slice4d");return f(e.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${e.rank} tensor`),_(e,t,o)}var Ql=m({slice4d_:Jl});function tf(r,t=-1){let o=a(r,"logits","softmax","float32");if(t===-1&&(t=o.rank-1),t!==o.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${o.rank} and dim was ${t}`);let e={logits:o},n={dim:t};return l.runKernel(Hs,e,n)}var rf=m({softmax_:tf});function of(r){f(r.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${r.dtype}.`);let t={input:r};return l.runKernel(vn,t)}var Pr=m({fft_:of});function ef(r){f(r.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${r.dtype}.`);let t={input:r};return l.runKernel(Mn,t)}var hr=m({ifft_:ef});function nf(r){let t=r.shape[r.shape.length-1],o=r.size/t,e;if(t<=2){let n=x(r,[o,t]);e=hr(n)}else{let n=[o,2*(t-1)],s=x(Bt(r),[o,t]),i=x(Xt(r),[o,t]),p=xt(_(s,[0,1],[o,t-2]),1),c=y(xt(_(i,[0,1],[o,t-2]),1),P(-1)),u=j([s,p],1),h=j([i,c],1),d=x(dt(u,h),[n[0],n[1]]);e=hr(d)}if(e=Bt(e),r.rank===3&&r.shape[0]!==0){let n=e,s=r.shape[0];e=x(e,[s,e.shape[0]/s,e.shape[1]]),n.dispose()}return e}var ce=m({irfft_:nf});function sf(r,t,o=0){let n={x:a(r,"x","split")},s={numOrSizeSplits:t,axis:o};return l.runKernel(Us,n,s)}var Ft=m({split_:sf});function af(r,t){f(r.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${r.dtype}`);let o=r.shape[r.shape.length-1],e=r.size/o,n;if(t!=null&&t<o){let T=r.shape.map(k=>0),E=r.shape.map(k=>k);E[r.shape.length-1]=t,n=_(r,T,E),o=t}else if(t!=null&&t>o){let T=r.shape.map(E=>E);T[r.shape.length-1]=t-o,n=j([r,Dt(T)],r.shape.length-1),o=t}else n=r;let s=Mr(n),i=x(dt(n,s),[e,o]),p=Pr(i),c=Math.floor(o/2)+1,u=Bt(p),h=Xt(p),d=Ft(u,[c,o-c],u.shape.length-1),g=Ft(h,[c,o-c],h.shape.length-1),b=n.shape.slice();return b[n.shape.length-1]=c,x(dt(d[0],g[0]),b)}var Rr=m({rfft_:af});function pf(r,t){let o=a(r,"a","squaredDifference"),e=a(t,"b","squaredDifference");[o,e]=w(o,e),A(o.shape,e.shape);let n={a:o,b:e},s={};return l.runKernel(Qs,n,s)}var ue=m({squaredDifference_:pf});function mf(r,t){let o=a(r,"x","squeeze","string_or_numeric");return x(o,xe(o.shape,t).newShape)}var Kr=m({squeeze_:mf});function cf(r,t=0){let o=Wt(r,"tensors","stack","string_or_numeric");f(o.length>=1,()=>"Pass at least one tensor to tf.stack"),o.length>0&&f(t<=o[0].rank,()=>"Axis must be <= rank of the tensor");let e=o,n={axis:t};return l.runKernel(fs,e,n)}var Pt=m({stack_:cf});function uf(r,t=0){let e={x:a(r,"x","step")},n={alpha:t};return l.runKernel(hi,e,n)}var le=m({step_:uf});function lf(r,t,o,e,n=0,s=0,i=0,p=0,c=0){let h={x:a(r,"x","stridedSlice","string_or_numeric")},d={begin:t,end:o,strides:e,beginMask:n,endMask:s,ellipsisMask:i,newAxisMask:p,shrinkAxisMask:c};return l.runKernel(ri,h,d)}var ff=m({stridedSlice_:lf});function hf(r){let o={x:a(r,"x","tan","float32")};return l.runKernel(ii,o)}var df=m({tan_:hf});function Or(r,t,o){let e=st(r,o);return nt(r,t,e,o)}function Q(r,t){ht(r);let o=st(r,t);if(o.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return nt(r,null,o,t)}function tr(r,t,o){if(ht(r),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");let e=st(r,o);if(e.length!==2&&e.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(e.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return nt(r,t,e,o)}function gf(r,t,o){if(ht(r),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");let e=st(r,o);if(e.length!==3&&e.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(e.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return nt(r,t,e,o)}function xf(r,t,o){if(ht(r),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");let e=st(r,o);if(e.length!==4&&e.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(e.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return nt(r,t,e,o)}function bf(r,t,o){if(ht(r),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");let e=st(r,o);if(e.length!==5&&e.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(e.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return nt(r,t,e,o)}function Tf(r,t,o){if(ht(r),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");let e=st(r,o);if(e.length!==6&&e.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(e.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return t=t||e,nt(r,t,e,o)}function kf(r,t,o){let e=t.rank>1?t.shape[t.rank-1]:1,n=t.rank>1?t.rank-1:1,s=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${o.shape}, indices.shape: ${t.shape}, shape: ${r}, sliceDim: ${e}, and batchDim: ${n}.`;if(o.rank<n)throw new Error(s+` update.rank < ${n}. `);if(r.length<e+(o.rank-n))throw new Error(s+` Output shape length < ${e+(o.rank-n)}`);if(o.rank!==n+r.length-e)throw new Error(s+` update.rank != ${n+r.length-e}`);for(let i=0;i<n;++i)if(o.shape[i]!==t.shape[i])throw new Error(s+` updates.shape[${i}] (${o.shape[i]}) != indices.shape[${i}] (${t.shape[i]}).`);for(let i=0;i<o.rank-n;++i)if(o.shape[i+n]!==r[i+e])throw new Error(s+` updates.shape[${i+n}] (${o.shape[i+n]}) != shape[${i+n}] (${r[i+n]})`)}function go(r,t,o){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(r.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${r.rank}.`);if(t.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(o.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${o}`);if(o.length===0){if(t.size===0)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(r.size===0)throw new Error(`Updates specified for empty output. updates shape: ${r.shape}`)}kf(o,t,r)}function Ef(r,t,o){let e=a(r,"tensor","tensorScatterupdate"),n=a(t,"indices","tensorScatterupdate","int32"),s=a(o,"updates","tensorScatterupdate");if(go(s,n,e.shape),e.dtype!==s.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${e.dtype} and ${s.dtype}.`);let i={tensor:e,indices:n,updates:s},p={};return l.runKernel(Ms,i,p)}var $f=m({tensorScatterUpdate_:Ef});function vf(r,t=1,o=!0){let e=a(r,"x","topk");if(e.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");let n=e.shape[e.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>n)throw new Error(`'k' passed to topk() must be <= the last dimension (${n}) but got ${t}`);let s={x:e},i={k:t,sorted:o},[p,c]=l.runKernel(pi,s,i);return{values:p,indices:c}}var yf=m({topk_:vf});function Nf(r,t=0,o=1,e,n){if(q(r),e!=null&&e==="bool")throw new Error("Unsupported data type $ { dtype }");let s=new Zt(t,o,e,!0,n),i=mt(r,e);for(let p=0;p<i.values.length;p++)i.values[p]=s.nextValue();return i.toTensor()}var wf=m({truncatedNormal_:Nf});function If(r,t=0){let o=a(r,"x","unique","string_or_numeric");f(o.rank>0,()=>"The input tensor must be at least 1D");let e={x:o},n={axis:t},[s,i]=l.runKernel(ci,e,n);return{values:s,indices:i}}var Sf=m({unique_:If});function Df(r,t,o){let e=a(r,"x","unsortedSegmentSum"),n=a(t,"segmentIds","unsortedSegmentSum","int32");f(Gt(o),()=>"numSegments must be of dtype int");let s={x:e,segmentIds:n},i={numSegments:o};return l.runKernel(li,s,i)}var _f=m({unsortedSegmentSum_:Df});function Af(r,t=0){let o=a(r,"x","unstack","string_or_numeric");f(t>=-o.shape.length&&t<o.shape.length,()=>`Axis = ${t} is not in [-${o.shape.length}, ${o.shape.length})`);let e={value:o},n={axis:t};return l.runKernel(ui,e,n)}var qr=m({unstack_:Af});function Gf(r,t){return uo(r,t,"right")}function Mf(r,t=!0,o,e){return l.makeVariable(r,t,o,e)}function Ki(r,t){let o=[];for(let s=0;s<t.length;s++)t[s]&&o.push(s);let e=mt(r,"int32"),n=mt([o.length,r.length],"int32");for(let s=0;s<o.length;s++){let i=e.indexToLoc(o[s]),p=s*r.length;n.values.set(i,p)}return n.toTensor()}async function Cf(r){let t=a(r,"condition","whereAsync","bool"),o=await t.data(),e=Ki(t.shape,o);return r!==t&&t.dispose(),e}var fe=Cf;async function Bf(r,t,o){let e=a(r,"tensor","boolMask"),n=a(t,"mask","boolMask","bool"),s=o??0,i=n.rank,p=e.shape;f(i>0,()=>"mask cannot be scalar"),H(p.slice(s,s+i),n.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let E=s;E<s+i;E++)c*=p[E];let u=p.slice(0,s).concat([c],p.slice(s+i)),h=x(e,u),d=x(n,[-1]),g=await fe(d),b=Kr(g,[1]),T=Yo(h,b,s);return r!==e&&e.dispose(),t!==n&&n.dispose(),b.dispose(),h.dispose(),d.dispose(),g.dispose(),T}var SA=Bf;function Ff(r){J().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(r+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}Ni(Ff);function Oi(r,t){return l.tidy(r,t)}function qi(r){ro(r).forEach(o=>o.dispose())}function Pf(r,t,o){let e=a(r,"x","transpose");if(t==null&&(t=e.shape.map((i,p)=>p).reverse()),f(e.rank===t.length,()=>`Error in transpose: rank of input ${e.rank} must match length of perm ${t}.`),t.forEach(i=>{f(i>=0&&i<e.rank,()=>`All entries in 'perm' must be between 0 and ${e.rank-1} but got ${t}`)}),e.rank<=1)return e.clone();let n={x:e},s={perm:t};return e.dtype==="complex64"?Oi(()=>{let i=Bt(e),p=Xt(e);return i=l.runKernel(Yr,{x:i},s),p=l.runKernel(Yr,{x:p},s),o&&(p=rt(p)),dt(i,p)}):l.runKernel(Yr,n,s)}var he=m({transpose_:Pf});function Rf(r,t,o,e,n=!0){let s=a(r,"v","movingAverage"),i=a(t,"x","movingAverage"),p=a(o,"decay","movingAverage");Si(s,i),f(ut(s.shape,i.shape),()=>"Shape mismatch in v and x");let c=P(1),u=N(c,p),h=y(N(i,s),u);if(n){f(e!=null,()=>"When using zeroDebias: true, step is required.");let d=a(e,"step","movingAverage");h=z(h,N(c,Cr(p,d)))}return R(s,h)}var tG=m({movingAverage_:Rf});function Kf(r,t,o){q(o);let e=a(r,"indices","scatterND","int32"),n=a(t,"updates","scatterND");go(n,e,o);let s={indices:e,updates:n},i={shape:o};return l.runKernel(Gs,s,i)}var aG=m({scatterND_:Kf});function Li(r,t,o,e){if(r.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${r.dtype}.`);if(r.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${r.shape}.`);let n=r.rank>0?r.shape[0]:1,s=r.rank>1?r.shape[1]:1;if(o.length!==s)throw new Error(`outputShape has incorrect number of elements:, ${o.length}, should be: ${s}.`);let i=t.size;if(!(t.rank===0||t.rank===1&&i===n))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${n}]`);if(t.dtype!==e.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}function qf(r,t,o,e=0){q(o);let n=a(r,"sparseIndices","sparseToDense","int32"),s=a(t,"sparseValues","sparseToDense","string_or_numeric"),i=a(e,"defaultValue","sparseToDense",s.dtype);Li(n,s,o,i);let p={sparseIndices:n,sparseValues:s,defaultValue:i},c={outputShape:o};return l.runKernel(Js,p,c)}var hG=m({sparseToDense_:qf});function Lf(r,t){let o=a(t,"indices","gatherND","int32"),n={params:a(r,"x","gatherND","string_or_numeric"),indices:o};return l.runKernel(_n,n)}var kG=m({gatherND_:Lf});function Wi(r,t){if(t==null)return r.shape.slice();if(ut(r.shape,t))return t;if(r.shape.length===t.length){let o=[];for(let e=0;e<r.shape.length;e++)t[e]==null&&r.shape[e]!=null?o.push(r.shape[e]):o.push(t[e]);return o}return t}function Wf(r,t,o,e){let n=a(r,"x","dropout");if(f(n.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${n.dtype} tensor instead.`),f(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return r instanceof Z?n.clone():n;let s=Wi(n,o),i=1-t,p=z(jo(R(Fr(s,0,1,"float32",e),i)),i);return y(n,p)}var GG=m({dropout_:Wf});function Vi(r){return Math.floor(Math.pow(2,Math.ceil(Math.log(r)/Math.log(2))))}function xo(r,t,o){let e=1-r%2,n=new Float32Array(r);for(let s=0;s<r;++s){let i=2*Math.PI*s/(r+e-1);n[s]=t-o*Math.cos(i)}return Q(n,"float32")}async function Vf(r,t,o=1){let e=a(r,"predictions","inTopK"),n=a(t,"targets","inTopK");f(e.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${e.rank}`),f(e.rank-1===n.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${e.rank} and targets rank ${n.rank}`),H(e.shape.slice(0,e.shape.length-1),n.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");let s=e.shape[e.shape.length-1];f(o>0&&o<=s,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${s}), but got ${o}`);let i=await e.data(),p=await n.data(),[c,u]=[i.length/s,s],h=be("bool",c);for(let d=0;d<c;d++){let g=d*u,b=i.subarray(g,g+u),T=[];for(let E=0;E<b.length;E++)T.push({value:b[E],index:E});T.sort((E,k)=>k.value-E.value),h[d]=0;for(let E=0;E<o;E++)if(T[E].index===p[d]){h[d]=1;break}}return r!==e&&e.dispose(),t!==n&&n.dispose(),Or(h,n.shape,"bool")}var KG=Vf;var Zi={};La(Zi,{conv2d:()=>Ui,depthwiseConv2d:()=>Yi,matMul:()=>Xi});function zf(r,t,o,e,n,s="NHWC",i){let p=r;r.rank===3&&(p=x(r,[1,r.shape[0],r.shape[1],r.shape[2]]));let c=t;c.rank===3&&(c=x(t,[1,t.shape[0],t.shape[1],t.shape[2]])),f(p.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${p.shape}.`),f(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),f(o.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${o}.`);let u=s==="NHWC"?p.shape[3]:p.shape[1],h=s==="NHWC"?c.shape[3]:c.shape[1];f(u===o[2],()=>`Error in conv2dDerFilter: depth of input ${u}) must match input depth in filter (${o[2]}.`),f(h===o[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${o[3]}).`),X("conv2dDerFilter",n,i);let d={x:p,dy:c},g={strides:e,pad:n,dataFormat:s,dimRoundingMode:i,filterShape:o};return l.runKernel(Je,d,g)}var zi=m({conv2DBackpropFilter_:zf});function dr(r,t,o){if(o==null||o==="linear")return r;if(o==="relu")return y(r,le(t));throw new Error(`Cannot compute gradient for fused activation ${o}.`)}function gr(r,t){let o=t,e=Fi(r.shape,t.shape);return e.length>0&&(o=G(o,e)),x(o,r.shape)}function xr(r,t,o,e){if(t==="linear")return r;if(t==="relu")return Qt(r);if(t==="elu")return Uo(r);if(t==="relu6")return pe(r);if(t==="prelu")return ie(r,o);if(t==="leakyrelu")return Zo(r,e);if(t==="sigmoid")return It(r);throw new Error(`Unknown fused activation ${t}.`)}var br=(r,t)=>!(r>0)||t==="linear";function Uf({x:r,filter:t,strides:o,pad:e,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:p,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(c=c||"linear",br(l.state.gradientDepth,c)===!1){f(n==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${n} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let I=Ut(r,t,o,e,n,s,i);return p!=null&&(I=R(I,p)),xr(I,c,u,h)}let d=a(r,"x","conv2d","float32"),g=a(t,"filter","conv2d","float32"),b=d,T=!1;d.rank===3&&(T=!0,b=x(d,[1,d.shape[0],d.shape[1],d.shape[2]])),f(b.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${b.rank}.`),f(g.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${g.rank}.`),X("fused conv2d",e,i);let E=n==="NHWC"?b.shape[3]:b.shape[1];f(g.shape[2]===E,()=>`Error in conv2d: depth of input (${E}) must match input depth for filter ${g.shape[2]}.`),f(et(o,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`);let k=_r(b.shape,g.shape,o,s,e,i),v;p!=null&&(v=a(p,"bias","fused conv2d"),[v]=w(v,d),n==="NHWC"?A(k.outShape,v.shape):(f(v.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${v.shape.length}.`),f(v.shape.length===0||v.shape[0]===k.outChannels||v.shape[0]===1,()=>`Error in fused conv2d: bias shape (${v.shape}) is not compatible with the number of output channels (${k.outChannels})`)));let B;if(u!=null){let I=u.shape;if(f(I.length<=1||I.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${I.length}.`),I.length===1)f(I[0]===1||I[0]===k.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${I}) is not compatible with the number of output channels (${k.outChannels}).`);else if(I.length===3)try{A(I,k.outShape)}catch{let O=`Error in fused conv2d: PReLU activation weights (${I}) is not compatible with the output shape of the conv2d (${k.outShape}).`;throw Error(O)}B=a(u,"prelu weights","fused conv2d")}let M=(I,L)=>{f(n==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${n} but only NHWC is currently supported.`);let[O,K,V,Y]=L,lt=dr(I,V,c);f(pr(s),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`);let ct=so(K.shape,lt,O,o,e),ft=zi(K,lt,O.shape,o,e),Et=[ct,ft];if(Y!=null){let rr=gr(Y,lt);Et.push(rr)}return Et},S={x:b,filter:g,bias:v,preluActivationWeights:B},F={strides:o,pad:e,dataFormat:n,dilations:s,dimRoundingMode:i,activation:c,leakyreluAlpha:h};return p==null?it((L,O,K)=>{let V=l.runKernel(wo,S,F);return K([O,L,V]),T&&(V=x(V,[V.shape[1],V.shape[2],V.shape[3]])),{value:V,gradFunc:M}})(b,g):it((L,O,K,V)=>{let Y=l.runKernel(wo,S,F);return V([O,L,Y,K]),T&&(Y=x(Y,[Y.shape[1],Y.shape[2],Y.shape[3]])),{value:Y,gradFunc:M}})(b,g,v)}var Ui=m({fusedConv2d_:Uf});function Hf(r,t,o,e,n,s=[1,1],i){let p=r;r.rank===3&&(p=x(r,[1,r.shape[0],r.shape[1],r.shape[2]]));let c=t;c.rank===3&&(c=x(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u={x:p,dy:c},h={strides:e,pad:n,dimRoundingMode:i,dilations:s,filterShape:o};return l.runKernel(un,u,h)}var Hi=m({depthwiseConv2dNativeBackpropFilter_:Hf});function jf(r,t,o,e,n,s=[1,1],i){let p=t,c=!1;t.rank===3&&(c=!0,p=x(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u={dy:p,filter:o},h={strides:e,pad:n,dimRoundingMode:i,dilations:s,inputShape:r},d=l.runKernel(ln,u,h);return c?x(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var ji=m({depthwiseConv2dNativeBackpropInput_:jf});function Yf({x:r,filter:t,strides:o,pad:e,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:p,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(br(l.state.gradientDepth,c)===!1){let F=Gr(r,t,o,e,n,s,i);return p!=null&&(F=R(F,p)),xr(F,c,u,h)}let d=a(r,"x","depthwiseConv2d","float32"),g=a(t,"filter","depthwiseConv2d","float32"),b=d,T=!1;d.rank===3&&(T=!0,b=x(d,[1,d.shape[0],d.shape[1],d.shape[2]])),f(b.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${b.rank}.`),f(g.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${g.rank}.`),f(b.shape[3]===g.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${b.shape[3]}) must match the inChannels dimension in filter ${g.shape[2]}.`),s==null&&(s=[1,1]),f(et(o,s),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`),X("fused depthwiseConv2d",e,i);let E=_r(b.shape,g.shape,o,s,e,i,!0),k;p!=null&&(k=a(p,"bias","fused conv2d"),[k]=w(k,d),A(E.outShape,k.shape));let v;u!=null&&(v=a(u,"prelu weights","fused depthwiseConv2d"));let B=(F,I)=>{f(pr(s),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${s}'`);let[L,O,K,V]=I,Y=dr(F,K,c),lt=ji(O.shape,Y,L,o,e,s,i),ct=Hi(O,Y,L.shape,o,e,s,i);if(V!=null){let ft=gr(k,Y);return[lt,ct,ft]}return[lt,ct]},M={x:b,filter:g,bias:k,preluActivationWeights:v},S={strides:o,pad:e,dataFormat:n,dilations:s,dimRoundingMode:i,activation:c,leakyreluAlpha:h};return p==null?it((I,L,O)=>{let K=l.runKernel(Io,M,S);return O([L,I,K]),T&&(K=x(K,[K.shape[1],K.shape[2],K.shape[3]])),{value:K,gradFunc:B}})(b,g):it((I,L,O,K)=>{let V=l.runKernel(Io,M,S);return K([L,I,V,O]),T&&(V=x(V,[V.shape[1],V.shape[2],V.shape[3]])),{value:V,gradFunc:B}})(b,g,k)}var Yi=m({fusedDepthwiseConv2d_:Yf});function Xf({a:r,b:t,transposeA:o=!1,transposeB:e=!1,bias:n,activation:s="linear",preluActivationWeights:i,leakyreluAlpha:p=.2}){if(br(l.state.gradientDepth,s)===!1){let Y=D(r,t,o,e);return n!=null&&(Y=R(Y,n)),xr(Y,s,i,p)}let c=a(r,"a","fused matMul"),u=a(t,"b","fused matMul");[c,u]=w(c,u);let h=o?c.shape[c.rank-2]:c.shape[c.rank-1],d=e?u.shape[u.rank-1]:u.shape[u.rank-2],g=o?c.shape[c.rank-1]:c.shape[c.rank-2],b=e?u.shape[u.rank-2]:u.shape[u.rank-1],T=c.shape.slice(0,-2),E=u.shape.slice(0,-2),k=W(T),v=W(E);f(h===d,()=>`Error in fused matMul: inner shapes (${h}) and (${d}) of Tensors with shapes ${c.shape} and ${u.shape} and transposeA=${o} and transposeB=${e} must match.`);let M=A(c.shape.slice(0,-2),u.shape.slice(0,-2)).concat([g,b]),S=o?x(c,[k,h,g]):x(c,[k,g,h]),F=e?x(u,[v,b,d]):x(u,[v,d,b]),I;n!=null&&(I=a(n,"bias","fused matMul"),[I]=w(I,c),A(M,I.shape));let L;i!=null&&(L=a(i,"prelu weights","fused matMul"));let O=(Y,lt)=>{let[ct,ft,Et,rr]=lt,yt=dr(x(Y,Et.shape),Et,s),or,er;if(!o&&!e?(or=D(yt,ft,!1,!0),er=D(ct,yt,!0,!1)):!o&&e?(or=D(yt,ft,!1,!1),er=D(yt,ct,!0,!1)):o&&!e?(or=D(ft,yt,!1,!0),er=D(ct,yt,!1,!1)):(or=D(ft,yt,!0,!0),er=D(yt,ct,!0,!0)),n!=null){let Oa=gr(rr,yt);return[or,er,Oa]}else return[or,er]},K={a:S,b:F,bias:I,preluActivationWeights:L},V={transposeA:o,transposeB:e,activation:s,leakyreluAlpha:p};return n==null?it((lt,ct,ft)=>{let Et=l.runKernel(No,K,V);return ft([lt,ct,Et]),{value:x(Et,M),gradFunc:O}})(S,F):it((lt,ct,ft,Et)=>{let rr=l.runKernel(No,K,V);return Et([lt,ct,rr,ft]),{value:x(rr,M),gradFunc:O}})(S,F,I)}var Xi=m({fusedMatMul_:Xf});function Zf(r){return xo(r,.54,.46)}var Ji=m({hammingWindow_:Zf});function Jf(r){return xo(r,.5,.5)}var bo=m({hannWindow_:Jf});function Qf(r,t,o,e=!1,n=0){let s=0,i=[];for(;s+t<=r.size;)i.push(_(r,s,t)),s+=o;if(e)for(;s<r.size;){let p=s+t-r.size,c=j([_(r,s,t-p),zt([p],n)]);i.push(c),s+=o}return i.length===0?tr([],[0,t]):x(j(i),[i.length,t])}var To=m({frame_:Qf});function th(r,t,o,e,n=bo){e==null&&(e=Vi(t));let s=To(r,t,o),i=y(s,n(t));return Rr(i,e)}var Qi=m({stft_:th});function rh(r,t,o,e,n="bilinear",s=0){let i=a(r,"image","cropAndResize"),p=a(t,"boxes","cropAndResize","float32"),c=a(o,"boxInd","cropAndResize","int32"),u=p.shape[0];f(i.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${i.rank}.`),f(p.rank===2&&p.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${u},4] but had shape ${p.shape}.`),f(c.rank===1&&c.shape[0]===u,()=>`Error in cropAndResize: boxInd must be have size [${u}] but had shape ${p.shape}.`),f(e.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${e.length}.`),f(e[0]>=1&&e[1]>=1,()=>`cropSize must be atleast [1,1], but was ${e}`),f(n==="bilinear"||n==="nearest",()=>`method must be bilinear or nearest, but was ${n}`);let h={image:i,boxes:p,boxInd:c},d={method:n,extrapolationValue:s,cropSize:e};return l.runKernel(an,h,d)}var ta=m({cropAndResize_:rh});function oh(r){let t=a(r,"image","flipLeftRight","float32");f(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);let o={image:t};return l.runKernel(Nn,o,{})}var ra=m({flipLeftRight_:oh});function eh(r){let t=a(r,"image","grayscaleToRGB"),o=t.rank-1,e=t.shape[o];f(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),f(e===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${e}.`);let n=new Array(t.rank);return n.fill(1,0,o),n[o]=3,Yt(t,n)}var oa=m({grayscaleToRGB_:eh});function nh(r){let t=a(r,"image","RGBToGrayscale"),o=t.rank-1,e=t.shape[o];f(t.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${t.rank}.`),f(e===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${e}.`);let n=t.dtype,s=C(t,"float32"),i=Q([.2989,.587,.114]),p;switch(t.rank){case 2:p=Ht("ij,j->i",s,i);break;case 3:p=Ht("ijk,k->ij",s,i);break;case 4:p=Ht("ijkl,l->ijk",s,i);break;case 5:p=Ht("ijklm,m->ijkl",s,i);break;case 6:p=Ht("ijklmn,n->ijklm",s,i);break;default:throw new Error("Not a valid tensor rank.")}return p=vt(p,-1),C(p,n)}var ea=m({rgbToGrayscale_:nh});function sh(r,t,o=0,e=.5){let n=a(r,"image","rotateWithOffset","float32");f(n.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${n.rank}.`);let s={image:n},i={radians:t,fillValue:o,center:e};return l.runKernel(di,s,i)}var na=m({rotateWithOffset_:sh});function bt(r,t,o,e,n,s){e==null&&(e=.5),n==null&&(n=Number.NEGATIVE_INFINITY),s==null&&(s=0);let i=r.shape[0];return o=Math.min(o,i),f(0<=e&&e<=1,()=>`iouThreshold must be in [0, 1], but was '${e}'`),f(r.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${r.rank}'`),f(r.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${r.shape[1]}`),f(t.rank===1,()=>"scores must be a 1D tensor"),f(t.shape[0]===i,()=>`scores has incompatible shape with boxes. Expected ${i}, but was ${t.shape[0]}`),f(0<=s&&s<=1,()=>`softNmsSigma must be in [0, 1], but was '${s}'`),{maxOutputSize:o,iouThreshold:e,scoreThreshold:n,softNmsSigma:s}}function ih(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY){let s=a(r,"boxes","nonMaxSuppression","float32"),i=a(t,"scores","nonMaxSuppression","float32"),p=bt(s,i,o,e,n);o=p.maxOutputSize,e=p.iouThreshold,n=p.scoreThreshold;let c={maxOutputSize:o,iouThreshold:e,scoreThreshold:n};return l.runKernel(ps,{boxes:s,scores:i},c)}var sa=m({nonMaxSuppression_:ih});function ia(r,t,o){let e=ah(r,t,o),n=e<0?-(e+1):e;r.splice(n,0,t)}function ah(r,t,o){return mh(r,t,o||ph)}function ph(r,t){return r>t?1:r<t?-1:0}function mh(r,t,o){let e=0,n=r.length,s=0,i=!1;for(;e<n;){s=e+(n-e>>>1);let p=o(t,r[s]);p>0?e=s+1:(n=s,i=!p)}return i?e:-e-1}function pa(r,t,o,e,n){return de(r,t,o,e,n,0)}function ma(r,t,o,e,n,s){return de(r,t,o,e,n,0,!1,s,!0)}function ca(r,t,o,e,n,s){return de(r,t,o,e,n,s,!0)}function de(r,t,o,e,n,s,i=!1,p=!1,c=!1){let u=[];for(let k=0;k<t.length;k++)t[k]>n&&u.push({score:t[k],boxIndex:k,suppressBeginIndex:0});u.sort(aa);let h=s>0?-.5/s:0,d=[],g=[];for(;d.length<o&&u.length>0;){let k=u.pop(),{score:v,boxIndex:B,suppressBeginIndex:M}=k;if(v<n)break;let S=!1;for(let F=d.length-1;F>=M;--F){let I=ch(r,B,d[F]);if(I>=e){S=!0;break}if(k.score=k.score*uh(e,h,I),k.score<=n)break}k.suppressBeginIndex=d.length,S||(k.score===v?(d.push(B),g.push(k.score)):k.score>n&&ia(u,k,aa))}let b=d.length,T=o-b;p&&T>0&&(d.push(...new Array(T).fill(0)),g.push(...new Array(T).fill(0)));let E={selectedIndices:d};return i&&(E.selectedScores=g),c&&(E.validOutputs=b),E}function ch(r,t,o){let e=r.subarray(t*4,t*4+4),n=r.subarray(o*4,o*4+4),s=Math.min(e[0],e[2]),i=Math.min(e[1],e[3]),p=Math.max(e[0],e[2]),c=Math.max(e[1],e[3]),u=Math.min(n[0],n[2]),h=Math.min(n[1],n[3]),d=Math.max(n[0],n[2]),g=Math.max(n[1],n[3]),b=(p-s)*(c-i),T=(d-u)*(g-h);if(b<=0||T<=0)return 0;let E=Math.max(s,u),k=Math.max(i,h),v=Math.min(p,d),B=Math.min(c,g),M=Math.max(v-E,0)*Math.max(B-k,0);return M/(b+T-M)}function uh(r,t,o){let e=Math.exp(t*o*o);return o<=r?e:0}function aa(r,t){return r.score-t.score||r.score===t.score&&t.boxIndex-r.boxIndex}async function lh(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY){let s=a(r,"boxes","nonMaxSuppressionAsync"),i=a(t,"scores","nonMaxSuppressionAsync"),p=bt(s,i,o,e,n);o=p.maxOutputSize,e=p.iouThreshold,n=p.scoreThreshold;let c=await Promise.all([s.data(),i.data()]),u=c[0],h=c[1],{selectedIndices:d}=pa(u,h,o,e,n);return s!==r&&s.dispose(),i!==t&&i.dispose(),Q(d,"int32")}var ua=lh;function fh(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=a(r,"boxes","nonMaxSuppression"),p=a(t,"scores","nonMaxSuppression"),c=bt(i,p,o,e,n,s);o=c.maxOutputSize,e=c.iouThreshold,n=c.scoreThreshold,s=c.softNmsSigma;let u={boxes:i,scores:p},h={maxOutputSize:o,iouThreshold:e,scoreThreshold:n,softNmsSigma:s},d=l.runKernel(cs,u,h);return{selectedIndices:d[0],selectedScores:d[1]}}var la=m({nonMaxSuppressionWithScore_:fh});async function hh(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=a(r,"boxes","nonMaxSuppressionAsync"),p=a(t,"scores","nonMaxSuppressionAsync"),c=bt(i,p,o,e,n,s);o=c.maxOutputSize,e=c.iouThreshold,n=c.scoreThreshold,s=c.softNmsSigma;let u=await Promise.all([i.data(),p.data()]),h=u[0],d=u[1],{selectedIndices:g,selectedScores:b}=ca(h,d,o,e,n,s);return i!==r&&i.dispose(),p!==t&&p.dispose(),{selectedIndices:Q(g,"int32"),selectedScores:Q(b)}}var fa=hh;function dh(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=a(r,"boxes","nonMaxSuppression"),p=a(t,"scores","nonMaxSuppression"),c=bt(i,p,o,e,n,null),u=c.maxOutputSize,h=c.iouThreshold,d=c.scoreThreshold,g={boxes:i,scores:p},b={maxOutputSize:u,iouThreshold:h,scoreThreshold:d,padToMaxOutputSize:s},T=l.runKernel(ms,g,b);return{selectedIndices:T[0],validOutputs:T[1]}}var ha=m({nonMaxSuppressionPadded_:dh});async function gh(r,t,o,e=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=a(r,"boxes","nonMaxSuppressionAsync"),p=a(t,"scores","nonMaxSuppressionAsync"),c=bt(i,p,o,e,n,null),u=c.maxOutputSize,h=c.iouThreshold,d=c.scoreThreshold,[g,b]=await Promise.all([i.data(),p.data()]),{selectedIndices:T,validOutputs:E}=ma(g,b,u,h,d,s);return i!==r&&i.dispose(),p!==t&&p.dispose(),{selectedIndices:Q(T,"int32"),validOutputs:P(E,"int32")}}var da=gh;function xh(r,t,o=!1,e=!1){let n=a(r,"images","resizeBilinear");f(n.rank===3||n.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${n.rank}.`),f(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),f(e===!1||o===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=x(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=t,p={images:s},c={alignCorners:o,halfPixelCenters:e,size:t},u=l.runKernel(Is,p,c);return i?x(u,[u.shape[1],u.shape[2],u.shape[3]]):u}var ga=m({resizeBilinear_:xh});function bh(r,t,o=!1,e=!1){let n=a(r,"images","resizeNearestNeighbor");f(n.rank===3||n.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${n.rank}.`),f(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),f(n.dtype==="float32"||n.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),f(e===!1||o===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=x(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=t,p={images:s},c={alignCorners:o,halfPixelCenters:e,size:t},u=l.runKernel(ws,p,c);return i?x(u,[u.shape[1],u.shape[2],u.shape[3]]):u}var xa=m({resizeNearestNeighbor_:bh});function Th(r,t="binary",o=!1,e=.5){let n=a(r,"image","threshold"),s=.2989,i=.587,p=.114,c=n.shape[0]*n.shape[1],u=y(Q([e]),255),h,d,g,b;if(f(n.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${n.rank}.`),f(n.shape[2]===3||n.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${n.shape[2]}.`),f(n.dtype==="int32"||n.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${n.dtype}.`),f(t==="otsu"||t==="binary",()=>`Method must be binary or otsu, but was ${t}`),n.shape[2]===3){[h,d,g]=Ft(n,[1,1,1],-1);let k=y(h,s),v=y(d,i),B=y(g,p);b=R(R(k,v),B)}else b=r;if(t==="otsu"){let k=Wo(C(me(b),"int32"),Or([]),256);u=kh(k,c)}let T=o?Br(b,u):cr(b,u);return C(y(T,255),"int32")}function kh(r,t){let o=Q([-1]),e=Q([0]),n=Q([0]),s,i,p,c,u,h;for(let d=0;d<r.size-1;d++){s=_(r,0,d+1),i=_(r,d+1),u=z(G(s),t),h=z(G(i),t);let g=G(y(s,Jt(0,s.size)));p=z(g,G(s));let b=zt(i.shape,s.size),T=R(Jt(0,i.size),b),E=y(i,T);c=z(G(E),G(i));let k=N(p,c),v=N(p,c),B=y(u,h);n=y(y(B,k),v);let M=cr(n,e);e=gt(M,n,e),o=gt(M,Q([d]),o)}return o}var ba=m({threshold_:Th});function Eh(r,t,o="nearest",e="constant",n=0,s){let i=a(r,"image","transform","float32"),p=a(t,"transforms","transform","float32");f(i.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${i.rank}.`),f(p.rank===2&&(p.shape[0]===i.shape[0]||p.shape[0]===1)&&p.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),f(s==null||s.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${s}.`);let c={image:i,transforms:p},u={interpolation:o,fillMode:e,fillValue:n,outputShape:s};return l.runKernel(mi,c,u)}var Ta=m({transform_:Eh});function $h(r,t,o){let e=a(r,"a","bandPart");f(e.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${e.rank}.`);let n=e.shape,[s,i]=e.shape.slice(-2),p,c;typeof t=="number"?(f(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),f(t<=s,()=>`bandPart(): numLower (${t}) must not be greater than the number of rows (${s}).`),p=a(t<0?s:t,"numLower","bandPart")):(f(t.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),p=gt(mo(t,0),s,fr(t,s))),typeof o=="number"?(f(o%1===0,()=>`bandPart(): numUpper must be an integer, got ${o}.`),f(o<=i,()=>`bandPart(): numUpper (${o}) must not be greater than the number of columns (${i}).`),c=a(o<0?i:o,"numUpper","bandPart")):(f(o.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),c=gt(mo(o,0),i,fr(o,i)));let u=x(Jt(0,s,1,"int32"),[-1,1]),h=Jt(0,i,1,"int32"),d=N(u,h),g=ur(Br(d,p),Xo(d,rt(c))),b=Dt([s,i],e.dtype);return x(Pt(qr(x(e,[-1,s,i])).map(T=>gt(g,T,b))),n)}var ka=m({bandPart_:$h});function vh(r){let t;if(Array.isArray(r)){t=!1,f(r!=null&&r.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");let n=r[0].shape[0];for(let s=1;s<r.length;++s)f(r[s].shape[0]===n,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${r[s].shape[0]} vs. ${n})`)}else t=!0,r=Ft(r,r.shape[0],0).map(n=>Kr(n,[0]));f(r.length<=r[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${r.length}) exceeds number of dimensions (${r[0].shape[0]}).`);let o=[],e=r;for(let n=0;n<r.length;++n)o.push(l.tidy(()=>{let s=e[n];if(n>0)for(let i=0;i<n;++i){let p=y(G(y(o[i],s)),o[i]);s=N(s,p)}return z(s,mr(s,"euclidean"))}));return t?Pt(o,0):o}var Ea=m({gramSchmidt_:vh});function yh(r,t=!1){if(f(r.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${r.rank}`),r.rank===2)return $a(r,t);{let o=r.shape.slice(0,r.shape.length-2).reduce((c,u)=>c*u),e=qr(x(r,[o,r.shape[r.shape.length-2],r.shape[r.shape.length-1]]),0),n=[],s=[];e.forEach(c=>{let[u,h]=$a(c,t);n.push(u),s.push(h)});let i=x(Pt(n,0),r.shape),p=x(Pt(s,0),r.shape);return[i,p]}}function $a(r,t=!1){return l.tidy(()=>{f(r.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${r.shape.length}D Tensor.`);let o=r.shape[0],e=r.shape[1],n=Ho(o),s=wt(r),i=tr([[1]],[1,1]),p=wt(i),c=o>=e?e:o;for(let u=0;u<c;++u){let h=s,d=p,g=n;[p,s,n]=l.tidy(()=>{let b=_(s,[u,u],[o-u,1]),T=mr(b),E=_(s,[u,u],[1,1]),k=gt(cr(E,0),tr([[-1]]),tr([[1]])),v=N(E,y(k,T)),B=z(b,v);B.shape[0]===1?p=wt(i):p=j([i,_(B,[1,0],[B.shape[0]-1,B.shape[1]])],0);let M=rt(z(D(k,v),T)),S=_(s,[u,0],[o-u,e]),F=y(M,p),I=he(p);if(u===0)s=N(S,D(F,D(I,S)));else{let K=N(S,D(F,D(I,S)));s=j([_(s,[0,0],[u,e]),K],0)}let L=he(F),O=_(n,[0,u],[o,n.shape[1]-u]);if(u===0)n=N(O,D(D(O,p),L));else{let K=N(O,D(D(O,p),L));n=j([_(n,[0,0],[o,u]),K],1)}return[p,s,n]}),qi([h,d,g])}return!t&&o>e&&(n=_(n,[0,0],[o,e]),s=_(s,[0,0],[e,e])),[n,s]})}var va=m({qr_:yh});var U;(function(r){r[r.NONE=0]="NONE",r[r.MEAN=1]="MEAN",r[r.SUM=2]="SUM",r[r.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(U||(U={}));function Nh(r,t,o=U.SUM_BY_NONZERO_WEIGHTS){let e=a(r,"losses","computeWeightedLoss"),n=null;t!=null&&(n=a(t,"weights","computeWeightedLoss"));let s=n==null?e:y(e,n);if(o===U.NONE)return s;if(o===U.SUM)return G(s);if(o===U.MEAN){if(n==null)return lr(s);{let i=e.size/n.size,p=z(G(s),G(n));return i>1?z(p,P(i)):p}}if(o===U.SUM_BY_NONZERO_WEIGHTS){if(n==null)return z(G(s),P(e.size));{let i=y(n,_t(e.shape)),p=C(G(ne(i,P(0))),"float32");return z(G(s),p)}}throw Error(`Unknown reduction: ${o}`)}var tt=m({computeWeightedLoss_:Nh});function wh(r,t,o,e=U.SUM_BY_NONZERO_WEIGHTS){let n=a(r,"labels","absoluteDifference"),s=a(t,"predictions","absoluteDifference"),i=null;o!=null&&(i=a(o,"weights","absoluteDifference")),H(n.shape,s.shape,"Error in absoluteDifference: ");let p=ot(N(n,s));return tt(p,i,e)}var ya=m({absoluteDifference_:wh});function Ih(r,t,o,e,n=U.SUM_BY_NONZERO_WEIGHTS){let s=a(r,"labels","cosineDistance"),i=a(t,"predictions","cosineDistance"),p=null;e!=null&&(p=a(e,"weights","cosineDistance")),H(s.shape,i.shape,"Error in cosineDistance: ");let c=P(1),u=N(c,G(y(s,i),o,!0));return tt(u,p,n)}var Na=m({cosineDistance_:Ih});function Sh(r,t,o,e=U.SUM_BY_NONZERO_WEIGHTS){let n=a(r,"labels","hingeLoss"),s=a(t,"predictions","hingeLoss"),i=null;o!=null&&(i=a(o,"weights","hingeLoss")),H(n.shape,s.shape,"Error in hingeLoss: ");let p=P(1);n=N(y(P(2),n),p);let c=Qt(N(p,y(n,s)));return tt(c,i,e)}var wa=m({hingeLoss_:Sh});function Dh(r,t,o,e=1,n=U.SUM_BY_NONZERO_WEIGHTS){let s=a(r,"labels","huberLoss"),i=a(t,"predictions","huberLoss"),p=null;o!=null&&(p=a(o,"weights","huberLoss")),H(s.shape,i.shape,"Error in huberLoss: ");let c=P(e),u=ot(N(i,s)),h=fr(u,c),d=N(u,h),g=R(y(P(.5),jt(h)),y(c,d));return tt(g,p,n)}var Ia=m({huberLoss_:Dh});function _h(r,t,o,e=1e-7,n=U.SUM_BY_NONZERO_WEIGHTS){let s=a(r,"labels","logLoss"),i=a(t,"predictions","logLoss"),p=null;o!=null&&(p=a(o,"weights","logLoss")),H(s.shape,i.shape,"Error in logLoss: ");let c=P(1),u=P(e),h=rt(y(s,Ct(R(i,u)))),d=y(N(c,s),Ct(R(N(c,i),u))),g=N(h,d);return tt(g,p,n)}var Sa=m({logLoss_:_h});function Ah(r,t,o,e=U.SUM_BY_NONZERO_WEIGHTS){let n=a(r,"labels","meanSquaredError"),s=a(t,"predictions","meanSquaredError"),i=null;o!=null&&(i=a(o,"weights","meanSquaredError")),H(n.shape,s.shape,"Error in meanSquaredError: ");let p=ue(n,s);return tt(p,i,e)}var Da=m({meanSquaredError_:Ah});function Gh(r,t){let o=a(r,"labels","sigmoidCrossEntropyWithLogits"),e=a(t,"logits","sigmoidCrossEntropyWithLogits");H(o.shape,e.shape,"Error in sigmoidCrossEntropyWithLogits: ");let n=Qt(e),s=y(e,o),i=Jo(kt(rt(ot(e))));return R(N(n,s),i)}function Mh(r,t,o,e=0,n=U.SUM_BY_NONZERO_WEIGHTS){let s=a(r,"multiClassLabels","sigmoidCrossEntropy"),i=a(t,"logits","sigmoidCrossEntropy"),p=null;if(o!=null&&(p=a(o,"weights","sigmoidCrossEntropy")),H(s.shape,i.shape,"Error in sigmoidCrossEntropy: "),e>0){let u=P(e),h=P(1),d=P(.5);s=R(y(s,N(h,u)),y(d,u))}let c=Gh(s,i);return tt(c,p,n)}var _a=m({sigmoidCrossEntropy_:Mh});function Ch(r,t,o=-1){if(o===-1&&(o=t.rank-1),o!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${o}`);return it((n,s,i)=>{let c=te(s,[o],!0),u=N(C(s,"float32"),c);i([n,u]);let h=rt(y(u,n));return{value:G(h,[o]),gradFunc:(b,T)=>{let[E,k]=T,v=Mt(b.shape,[o]);return[y(x(b,v),N(C(E,"float32"),kt(k))),y(x(b,v),N(kt(k),C(E,"float32")))]}}})(r,t)}function Bh(r,t,o,e=0,n=U.SUM_BY_NONZERO_WEIGHTS){let s=a(r,"onehotLabels","softmaxCrossEntropy"),i=a(t,"logits","softmaxCrossEntropy"),p=null;if(o!=null&&(p=a(o,"weights","softmaxCrossEntropy")),H(s.shape,i.shape,"Error in softmaxCrossEntropy: "),e>0){let u=P(e),h=P(1),d=P(s.shape[1]);s=R(y(s,N(h,u)),z(u,d))}let c=Ch(s,i);return tt(c,p,n)}var Aa=m({softmaxCrossEntropy_:Bh});function Fh(r,t,o,e){let n=a(r,"indices","sparseFillEmptyRows","int32"),s=a(t,"values","sparseFillEmptyRows"),i=a(o,"denseShape","sparseFillEmptyRows","int32"),p=a(e,"defaultValue","sparseFillEmptyRows",s.dtype);if(n.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${n.shape}`);if(s.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${s.shape}`);if(i.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${i.shape}`);if(p.rank!==0)throw new Error(`Default value should be a scalar but received shape ${p.shape}`);let c={indices:n,values:s,denseShape:i,defaultValue:p},u=l.runKernel(js,c);return{outputIndices:u[0],outputValues:u[1],emptyRowIndicator:u[2],reverseIndexMap:u[3]}}var Ga=m({sparseFillEmptyRows_:Fh});function Ph(r,t,o){let e=a(r,"inputIndices","sparseReshape","int32"),n=a(t,"inputShape","sparseReshape","int32"),s=a(o,"newShape","sparseReshape","int32");if(e.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${e.shape}`);if(n.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${n.shape}`);if(s.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${s.shape}`);let i={inputIndices:e,inputShape:n,newShape:s},p=l.runKernel(Ys,i);return{outputIndices:p[0],outputShape:p[1]}}var Ma=m({sparseReshape_:Ph});function Rh(r,t,o){let e=a(r,"data","sparseSegmentMean"),n=a(t,"indices","sparseSegmentMean","int32"),s=a(o,"segmentIds","sparseSegmentMean","int32");if(e.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${s.shape}`);let i={data:e,indices:n,segmentIds:s};return l.runKernel(Xs,i)}var Ca=m({sparseSegmentMean_:Rh});function Kh(r,t,o){let e=a(r,"data","sparseSegmentSum"),n=a(t,"indices","sparseSegmentSum","int32"),s=a(o,"segmentIds","sparseSegmentSum","int32");if(e.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${s.shape}`);let i={data:e,indices:n,segmentIds:s};return l.runKernel(Zs,i)}var Ba=m({sparseSegmentSum_:Kh});function Oh(r,t,o,e,n,s,i,p){let c=a(r,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);let u=a(t,"dataSplits","stringNGrams");if(u.dtype!=="int32")throw new Error("Data splits must be of datatype int32");let h={separator:o,nGramWidths:e,leftPad:n,rightPad:s,padWidth:i,preserveShortSequences:p},d={data:c,dataSplits:u},g=l.runKernel(oi,d,h);return{nGrams:g[0],nGramsSplits:g[1]}}var Fa=m({stringNGrams_:Oh});function qh(r,t,o=!0){let e=a(r,"input","stringSplit","string"),n=a(t,"delimiter","stringSplit","string");if(e.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${e.shape}`);if(n.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${n.shape}`);let s={skipEmpty:o},i={input:e,delimiter:n},p=l.runKernel(ei,i,s);return{indices:p[0],values:p[1],shape:p[2]}}var Pa=m({stringSplit_:qh});function Lh(r,t){let o=a(r,"input","stringToHashBucketFast","string"),e={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");let n={input:o};return l.runKernel(ni,n,e)}var Ra=m({stringToHashBucketFast_:Lh});function Wh(r,t,o,e=!0){let n=a(r,"input","staticRegexReplace","string"),s={pattern:t,rewrite:o,replaceGlobal:e};return l.runKernel(ti,{x:n},s)}var Ka=m({staticRegexReplace_:Wh});var J4={fft:Pr,ifft:hr,rfft:Rr,irfft:ce},eK={hammingWindow:Ji,hannWindow:bo,frame:To,stft:Qi},TK={flipLeftRight:ra,grayscaleToRGB:oa,resizeNearestNeighbor:xa,resizeBilinear:ga,rgbToGrayscale:ea,rotateWithOffset:na,cropAndResize:ta,nonMaxSuppression:sa,nonMaxSuppressionAsync:ua,nonMaxSuppressionWithScore:la,nonMaxSuppressionWithScoreAsync:fa,nonMaxSuppressionPadded:ha,nonMaxSuppressionPaddedAsync:da,threshold:ba,transform:Ta},vK={bandPart:ka,gramSchmidt:Ea,qr:va},MK={absoluteDifference:ya,computeWeightedLoss:tt,cosineDistance:Na,hingeLoss:wa,huberLoss:Ia,logLoss:Sa,meanSquaredError:Da,sigmoidCrossEntropy:_a,softmaxCrossEntropy:Aa},RK={sparseFillEmptyRows:Ga,sparseReshape:Ma,sparseSegmentMean:Ca,sparseSegmentSum:Ba},WK={stringNGrams:Fa,stringSplit:Pa,stringToHashBucketFast:Ra,staticRegexReplace:Ka};export{Gi as OP_SCOPE_SUFFIX,ot as abs,cp as acos,lp as acosh,R as add,dp as addN,xp as all,Tp as any,Ep as argMax,vp as argMin,Np as asin,Ip as asinh,Dp as atan,Ap as atan2,Mp as atanh,qo as avgPool,qp as avgPool3d,Xp as basicLSTMCell,Vt as batchNorm,tm as batchNorm2d,om as batchNorm3d,nm as batchNorm4d,Lo as batchToSpaceND,Wo as bincount,am as bitwiseAnd,SA as booleanMaskAsync,mm as broadcastArgs,Ar as broadcastTo,mt as buffer,C as cast,lm as ceil,hm as clipByValue,wt as clone,dt as complex,j as concat,xm as concat1d,Tm as concat2d,Em as concat3d,vm as concat4d,wm as conv1d,Ut as conv2d,Dm as conv2dTranspose,Am as conv3d,Cm as conv3dTranspose,Fm as cos,Rm as cosh,xo as cosineWindow,Om as cumprod,Lm as cumsum,Vm as denseBincount,Um as depthToSpace,Gr as depthwiseConv2d,Ym as diag,Zm as dilation2d,z as div,nc as divNoNan,ic as dot,GG as dropout,Ht as einsum,Uo as elu,Vi as enclosingPowerOfTwo,cc as ensureShape,zo as equal,lc as erf,vc as euclideanNorm,kt as exp,vt as expandDims,Ic as expm1,Ho as eye,Pr as fft,zt as fill,jo as floor,Vo as floorDiv,Zi as fused,Yo as gather,kG as gatherND,cr as greater,Xo as greaterEqual,hr as ifft,Xt as imag,TK as image,KG as inTopKAsync,ce as irfft,Fc as isFinite,Rc as isInf,Oc as isNaN,Zo as leakyRelu,mo as less,Br as lessEqual,vK as linalg,Vc as linspace,Uc as localResponseNormalization,Ct as log,Jo as log1p,Jc as logSigmoid,ru as logSoftmax,te as logSumExp,ur as logicalAnd,re as logicalNot,oe as logicalOr,au as logicalXor,MK as losses,mu as lowerBound,D as matMul,St as max,ee as maxPool,lu as maxPool3d,hu as maxPoolWithArgmax,gu as maximum,lr as mean,bu as meshgrid,ao as min,fr as minimum,Eu as mirrorPad,vu as mod,Nu as moments,tG as movingAverage,y as mul,Iu as multiRNNCell,Du as multinomial,rt as neg,mr as norm,ne as notEqual,Gu as oneHot,_t as ones,Cu as onesLike,m as op,Fu as outerProduct,At as pad,Ku as pad1d,qu as pad2d,Wu as pad3d,zu as pad4d,Xu as pool,Cr as pow,ie as prelu,Ju as print,tl as prod,ol as raggedGather,nl as raggedRange,il as raggedTensorToTensor,pl as rand,cl as randomGamma,ae as randomNormal,fl as randomStandardNormal,Fr as randomUniform,gl as randomUniformInt,Jt as range,Bt as real,Tl as reciprocal,Qt as relu,pe as relu6,x as reshape,xt as reverse,yl as reverse1d,wl as reverse2d,Sl as reverse3d,_l as reverse4d,Rr as rfft,me as round,Ml as rsqrt,P as scalar,aG as scatterND,uo as searchSorted,Bl as selu,Pl as separableConv2d,Kl as setdiff1dAsync,It as sigmoid,ql as sign,eK as signal,Wl as sin,zl as sinh,_ as slice,Hl as slice1d,Yl as slice2d,Zl as slice3d,Ql as slice4d,rf as softmax,Qo as softplus,se as spaceToBatchND,RK as sparse,hG as sparseToDense,J4 as spectral,Ft as split,po as sqrt,jt as square,ue as squaredDifference,Kr as squeeze,Pt as stack,le as step,ff as stridedSlice,WK as string,N as sub,G as sum,df as tan,no as tanh,Or as tensor,Q as tensor1d,tr as tensor2d,gf as tensor3d,xf as tensor4d,bf as tensor5d,Tf as tensor6d,$f as tensorScatterUpdate,Yt as tile,yf as topk,he as transpose,wf as truncatedNormal,Sf as unique,_f as unsortedSegmentSum,qr as unstack,Gf as upperBound,Mf as variable,gt as where,fe as whereAsync,Dt as zeros,Mr as zerosLike};
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

@tensorflow/tfjs-core/dist/ops/abs.js:
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

@tensorflow/tfjs-core/dist/ops/acos.js:
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

@tensorflow/tfjs-core/dist/ops/acosh.js:
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

@tensorflow/tfjs-core/dist/ops/add.js:
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

@tensorflow/tfjs-core/dist/ops/add_n.js:
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

@tensorflow/tfjs-core/dist/ops/all.js:
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

@tensorflow/tfjs-core/dist/ops/any.js:
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

@tensorflow/tfjs-core/dist/ops/arg_max.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/arg_min.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/asin.js:
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

@tensorflow/tfjs-core/dist/ops/asinh.js:
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

@tensorflow/tfjs-core/dist/ops/atan.js:
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

@tensorflow/tfjs-core/dist/ops/atan2.js:
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

@tensorflow/tfjs-core/dist/ops/atanh.js:
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

@tensorflow/tfjs-core/dist/ops/cast.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/conv_util.js:
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

@tensorflow/tfjs-core/dist/ops/reshape.js:
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

@tensorflow/tfjs-core/dist/ops/avg_pool.js:
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

@tensorflow/tfjs-core/dist/ops/avg_pool_3d.js:
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

@tensorflow/tfjs-core/dist/ops/clone.js:
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

@tensorflow/tfjs-core/dist/ops/concat.js:
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

@tensorflow/tfjs-core/dist/ops/mat_mul.js:
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

@tensorflow/tfjs-core/dist/ops/mul.js:
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

@tensorflow/tfjs-core/dist/ops/sigmoid.js:
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

@tensorflow/tfjs-core/dist/ops/slice.js:
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

@tensorflow/tfjs-core/dist/ops/tanh.js:
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

@tensorflow/tfjs-core/dist/ops/basic_lstm_cell.js:
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

@tensorflow/tfjs-core/dist/ops/batch_to_space_nd.js:
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

@tensorflow/tfjs-core/dist/ops/batchnorm.js:
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

@tensorflow/tfjs-core/dist/ops/bincount.js:
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

@tensorflow/tfjs-core/dist/ops/bitwise_and.js:
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

@tensorflow/tfjs-core/dist/ops/broadcast_args.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/broadcast_to.js:
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

@tensorflow/tfjs-core/dist/ops/buffer.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/ceil.js:
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

@tensorflow/tfjs-core/dist/ops/fill.js:
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

@tensorflow/tfjs-core/dist/ops/clip_by_value.js:
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

@tensorflow/tfjs-core/dist/ops/conv2d.js:
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

@tensorflow/tfjs-core/dist/ops/conv2d_backprop_input.js:
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

@tensorflow/tfjs-core/dist/ops/conv3d.js:
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

@tensorflow/tfjs-core/dist/ops/conv3d_backprop_input.js:
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

@tensorflow/tfjs-core/dist/ops/cos.js:
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

@tensorflow/tfjs-core/dist/ops/cosh.js:
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

@tensorflow/tfjs-core/dist/ops/cumprod.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the 'License');
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an 'AS IS' BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/cumsum.js:
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

@tensorflow/tfjs-core/dist/ops/dense_bincount.js:
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

@tensorflow/tfjs-core/dist/ops/depth_to_space.js:
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

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d.js:
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

@tensorflow/tfjs-core/dist/ops/diag.js:
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

@tensorflow/tfjs-core/dist/ops/dilation2d.js:
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

@tensorflow/tfjs-core/dist/ops/floorDiv.js:
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

@tensorflow/tfjs-core/dist/ops/div.js:
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

@tensorflow/tfjs-core/dist/ops/broadcast_util.js:
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

@tensorflow/tfjs-core/dist/ops/equal.js:
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

@tensorflow/tfjs-core/dist/ops/where.js:
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

@tensorflow/tfjs-core/dist/ops/zeros_like.js:
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

@tensorflow/tfjs-core/dist/ops/div_no_nan.js:
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

@tensorflow/tfjs-core/dist/ops/dot.js:
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

@tensorflow/tfjs-core/dist/ops/einsum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/elu.js:
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

@tensorflow/tfjs-core/dist/ops/ensure_shape.js:
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

@tensorflow/tfjs-core/dist/ops/erf.js:
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

@tensorflow/tfjs-core/dist/ops/axis_util.js:
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

@tensorflow/tfjs-core/dist/ops/max.js:
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

@tensorflow/tfjs-core/dist/ops/min.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/pow.js:
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

@tensorflow/tfjs-core/dist/ops/scalar.js:
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

@tensorflow/tfjs-core/dist/ops/sqrt.js:
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

@tensorflow/tfjs-core/dist/ops/square.js:
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

@tensorflow/tfjs-core/dist/ops/sum.js:
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

@tensorflow/tfjs-core/dist/ops/norm.js:
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

@tensorflow/tfjs-core/dist/ops/euclidean_norm.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/exp.js:
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

@tensorflow/tfjs-core/dist/ops/expand_dims.js:
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

@tensorflow/tfjs-core/dist/ops/expm1.js:
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

@tensorflow/tfjs-core/dist/ops/tile.js:
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

@tensorflow/tfjs-core/dist/ops/eye.js:
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

@tensorflow/tfjs-core/dist/ops/floor.js:
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

@tensorflow/tfjs-core/dist/ops/gather.js:
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

@tensorflow/tfjs-core/dist/ops/greater.js:
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

@tensorflow/tfjs-core/dist/ops/greater_equal.js:
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

@tensorflow/tfjs-core/dist/ops/imag.js:
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

@tensorflow/tfjs-core/dist/ops/is_finite.js:
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

@tensorflow/tfjs-core/dist/ops/is_inf.js:
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

@tensorflow/tfjs-core/dist/ops/is_nan.js:
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

@tensorflow/tfjs-core/dist/ops/leaky_relu.js:
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

@tensorflow/tfjs-core/dist/ops/less.js:
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

@tensorflow/tfjs-core/dist/ops/less_equal.js:
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

@tensorflow/tfjs-core/dist/ops/linspace.js:
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

@tensorflow/tfjs-core/dist/ops/local_response_normalization.js:
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

@tensorflow/tfjs-core/dist/ops/log.js:
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

@tensorflow/tfjs-core/dist/ops/log1p.js:
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

@tensorflow/tfjs-core/dist/gradients.js:
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

@tensorflow/tfjs-core/dist/ops/neg.js:
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

@tensorflow/tfjs-core/dist/ops/softplus.js:
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

@tensorflow/tfjs-core/dist/ops/log_sigmoid.js:
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

@tensorflow/tfjs-core/dist/ops/sub.js:
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

@tensorflow/tfjs-core/dist/ops/log_softmax.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/log_sum_exp.js:
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

@tensorflow/tfjs-core/dist/ops/logical_and.js:
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

@tensorflow/tfjs-core/dist/ops/logical_not.js:
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

@tensorflow/tfjs-core/dist/ops/logical_or.js:
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

@tensorflow/tfjs-core/dist/ops/logical_xor.js:
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

@tensorflow/tfjs-core/dist/ops/search_sorted.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/lower_bound.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/max_pool.js:
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

@tensorflow/tfjs-core/dist/ops/max_pool_3d.js:
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

@tensorflow/tfjs-core/dist/ops/max_pool_with_argmax.js:
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

@tensorflow/tfjs-core/dist/ops/maximum.js:
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

@tensorflow/tfjs-core/dist/ops/mean.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/zeros.js:
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

@tensorflow/tfjs-core/dist/ops/ones.js:
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

@tensorflow/tfjs-core/dist/ops/meshgrid.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/minimum.js:
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

@tensorflow/tfjs-core/dist/ops/mirror_pad.js:
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

@tensorflow/tfjs-core/dist/ops/mod.js:
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

@tensorflow/tfjs-core/dist/ops/moments.js:
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

@tensorflow/tfjs-core/dist/ops/multinomial.js:
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

@tensorflow/tfjs-core/dist/ops/not_equal.js:
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

@tensorflow/tfjs-core/dist/ops/one_hot.js:
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

@tensorflow/tfjs-core/dist/ops/ones_like.js:
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

@tensorflow/tfjs-core/dist/ops/pad.js:
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

@tensorflow/tfjs-core/dist/ops/space_to_batch_nd.js:
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

@tensorflow/tfjs-core/dist/ops/pool.js:
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

@tensorflow/tfjs-core/dist/ops/prelu.js:
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

@tensorflow/tfjs-core/dist/ops/print.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/prod.js:
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

@tensorflow/tfjs-core/dist/ops/ragged_gather.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/ragged_range.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-core/dist/ops/ragged_tensor_to_tensor.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/rand.js:
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

@tensorflow/tfjs-core/dist/ops/random_gamma.js:
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

@tensorflow/tfjs-core/dist/ops/random_normal.js:
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

@tensorflow/tfjs-core/dist/ops/random_standard_normal.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/random_uniform.js:
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

@tensorflow/tfjs-core/dist/ops/random_uniform_int.js:
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

@tensorflow/tfjs-core/dist/ops/range.js:
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

@tensorflow/tfjs-core/dist/ops/real.js:
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

@tensorflow/tfjs-core/dist/ops/reciprocal.js:
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

@tensorflow/tfjs-core/dist/ops/relu.js:
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

@tensorflow/tfjs-core/dist/ops/relu6.js:
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

@tensorflow/tfjs-core/dist/ops/reverse.js:
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

@tensorflow/tfjs-core/dist/ops/reverse_1d.js:
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

@tensorflow/tfjs-core/dist/ops/reverse_2d.js:
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

@tensorflow/tfjs-core/dist/ops/reverse_3d.js:
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

@tensorflow/tfjs-core/dist/ops/reverse_4d.js:
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

@tensorflow/tfjs-core/dist/ops/round.js:
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

@tensorflow/tfjs-core/dist/ops/rsqrt.js:
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

@tensorflow/tfjs-core/dist/ops/selu.js:
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

@tensorflow/tfjs-core/dist/ops/setdiff1d_async.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/sign.js:
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

@tensorflow/tfjs-core/dist/ops/sin.js:
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

@tensorflow/tfjs-core/dist/ops/sinh.js:
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

@tensorflow/tfjs-core/dist/ops/slice1d.js:
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

@tensorflow/tfjs-core/dist/ops/slice2d.js:
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

@tensorflow/tfjs-core/dist/ops/slice3d.js:
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

@tensorflow/tfjs-core/dist/ops/slice4d.js:
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

@tensorflow/tfjs-core/dist/ops/softmax.js:
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

@tensorflow/tfjs-core/dist/ops/spectral/fft.js:
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

@tensorflow/tfjs-core/dist/ops/spectral/ifft.js:
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

@tensorflow/tfjs-core/dist/ops/spectral/irfft.js:
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

@tensorflow/tfjs-core/dist/ops/split.js:
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

@tensorflow/tfjs-core/dist/ops/spectral/rfft.js:
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

@tensorflow/tfjs-core/dist/ops/squared_difference.js:
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

@tensorflow/tfjs-core/dist/ops/squeeze.js:
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

@tensorflow/tfjs-core/dist/ops/stack.js:
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

@tensorflow/tfjs-core/dist/ops/step.js:
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

@tensorflow/tfjs-core/dist/ops/strided_slice.js:
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

@tensorflow/tfjs-core/dist/ops/tan.js:
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

@tensorflow/tfjs-core/dist/ops/tensor1d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor2d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor3d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor4d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor5d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor6d.js:
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

@tensorflow/tfjs-core/dist/ops/tensor_scatter_update.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/topk.js:
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

@tensorflow/tfjs-core/dist/ops/truncated_normal.js:
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

@tensorflow/tfjs-core/dist/ops/unique.js:
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

@tensorflow/tfjs-core/dist/ops/unsorted_segment_sum.js:
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

@tensorflow/tfjs-core/dist/ops/unstack.js:
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

@tensorflow/tfjs-core/dist/ops/upper_bound.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/variable.js:
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

@tensorflow/tfjs-core/dist/backends/where_impl.js:
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

@tensorflow/tfjs-core/dist/ops/where_async.js:
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

@tensorflow/tfjs-core/dist/ops/boolean_mask.js:
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

@tensorflow/tfjs-core/dist/ops/transpose.js:
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

@tensorflow/tfjs-core/dist/ops/moving_average.js:
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

@tensorflow/tfjs-core/dist/ops/scatter_nd.js:
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

@tensorflow/tfjs-core/dist/ops/sparse_to_dense.js:
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

@tensorflow/tfjs-core/dist/ops/gather_nd.js:
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

@tensorflow/tfjs-core/dist/ops/dropout_util.js:
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

@tensorflow/tfjs-core/dist/ops/dropout.js:
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

@tensorflow/tfjs-core/dist/ops/signal_ops_util.js:
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

@tensorflow/tfjs-core/dist/ops/in_top_k.js:
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

@tensorflow/tfjs-core/dist/ops/conv2d_backprop_filter.js:
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

@tensorflow/tfjs-core/dist/ops/fused_util.js:
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

@tensorflow/tfjs-core/dist/ops/fused/conv2d.js:
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

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_filter.js:
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

@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_input.js:
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

@tensorflow/tfjs-core/dist/ops/fused/depthwise_conv2d.js:
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

@tensorflow/tfjs-core/dist/ops/fused/mat_mul.js:
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

@tensorflow/tfjs-core/dist/ops/fused_ops.js:
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

@tensorflow/tfjs-core/dist/ops/signal/hamming_window.js:
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

@tensorflow/tfjs-core/dist/ops/signal/hann_window.js:
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

@tensorflow/tfjs-core/dist/ops/signal/frame.js:
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

@tensorflow/tfjs-core/dist/ops/signal/stft.js:
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

@tensorflow/tfjs-core/dist/ops/image/crop_and_resize.js:
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

@tensorflow/tfjs-core/dist/ops/image/flip_left_right.js:
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

@tensorflow/tfjs-core/dist/ops/image/grayscale_to_rgb.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/image/rgb_to_grayscale.js:
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

@tensorflow/tfjs-core/dist/ops/image/rotate_with_offset.js:
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

@tensorflow/tfjs-core/dist/ops/nonmax_util.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression.js:
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

@tensorflow/tfjs-core/dist/backends/non_max_suppression_util.js:
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

@tensorflow/tfjs-core/dist/backends/non_max_suppression_impl.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_async.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score_async.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded.js:
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

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded_async.js:
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

@tensorflow/tfjs-core/dist/ops/image/resize_bilinear.js:
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

@tensorflow/tfjs-core/dist/ops/image/resize_nearest_neighbor.js:
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

@tensorflow/tfjs-core/dist/ops/image/threshold.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/image/transform.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/linalg/band_part.js:
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

@tensorflow/tfjs-core/dist/ops/linalg/gram_schmidt.js:
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

@tensorflow/tfjs-core/dist/ops/linalg/qr.js:
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

@tensorflow/tfjs-core/dist/ops/loss_ops_utils.js:
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

@tensorflow/tfjs-core/dist/ops/losses/absolute_difference.js:
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

@tensorflow/tfjs-core/dist/ops/losses/huber_loss.js:
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

@tensorflow/tfjs-core/dist/ops/losses/log_loss.js:
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

@tensorflow/tfjs-core/dist/ops/losses/mean_squared_error.js:
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

@tensorflow/tfjs-core/dist/ops/losses/sigmoid_cross_entropy.js:
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

@tensorflow/tfjs-core/dist/ops/losses/softmax_cross_entropy.js:
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_fill_empty_rows.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_mean.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_sum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/string/string_n_grams.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/string/string_split.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/string/string_to_hash_bucket_fast.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-core/dist/ops/string/static_regex_replace.js:
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

@tensorflow/tfjs-core/dist/ops/ops.js:
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

@tensorflow/tfjs-core/dist/ops/ops_for_converter.js:
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
*/
//# sourceMappingURL=ops_for_converter.js.map