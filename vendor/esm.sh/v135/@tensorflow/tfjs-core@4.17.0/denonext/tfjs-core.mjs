/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.17.0) denonext production */
import __Process$ from "node:process";
import { Buffer as __Buffer$ } from "node:buffer";
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var __setImmediate$ = (cb, ...args) => setTimeout(cb, 0, ...args);
import * as __0$ from "/v135/node_fetch.js";
import * as __1$ from "node:util";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"node-fetch":return c(__0$);case"util":return e(__1$);default:throw new Error("module \""+n+"\" not found");}};
var tu=Object.defineProperty;var As=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var xt=(e,t)=>{for(var r in t)tu(e,r,{get:t[r],enumerable:!0})};var qo=class{constructor(t,r){this.backend=t,this.dataMover=r,this.data=new WeakMap,this.dataIdsCount=0}get(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)}set(t,r){this.dataIdsCount++,this.data.set(t,r)}has(t){return this.data.has(t)}delete(t){return this.dataIdsCount--,this.data.delete(t)}numDataIds(){return this.dataIdsCount}},vr=class{refCount(t){return St("refCount")}incRef(t){return St("incRef")}timerAvailable(){return!0}time(t){return St("time")}read(t){return St("read")}readSync(t){return St("readSync")}readToGPU(t,r){return St("readToGPU")}numDataIds(){return St("numDataIds")}disposeData(t,r){return St("disposeData")}write(t,r,o){return St("write")}move(t,r,o,n,s){return St("move")}createTensorFromGPUData(t,r,o){return St("createTensorFromGPUData")}memory(){return St("memory")}floatPrecision(){return St("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return St("dispose")}};function St(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function Ds(e){let t=e.length,r=0;for(;t>0;)r=Math.random()*t|0,t--,Xr(e,t,r)}function eu(e,t){if(e.length!==t.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${e.length}Second array length was ${t.length}`);let r=e.length,o=0;for(;r>0;)o=Math.random()*r|0,r--,Xr(e,r,o),Xr(t,r,o)}function tr(e,t,r){return Math.max(e,Math.min(t,r))}function ru(e){return e%2===0?e:e+1}function Xr(e,t,r){let o=e[t];e[t]=e[r],e[r]=o}function ou(e){let t=0;for(let r=0;r<e.length;r++)t+=e[r];return t}function nu(e,t){let r=Math.random();return t*r+(1-r)*e}function su(e,t){let r=0;for(let o=0;o<e.length;o++){let n=Number(e[o])-Number(t[o]);r+=n*n}return r}function h(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function j(e,t,r=""){h(bt(e,t),()=>r+` Shapes ${e} and ${t} must match`)}function At(e){h(e!=null,()=>"The input to the tensor constructor must be a non-null value.")}function B(e){if(e.length===0)return 1;let t=e[0];for(let r=1;r<e.length;r++)t*=e[r];return t}function iu(e){return e.length===0}function Uo(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==null&&t[r]!==null&&e[r]!==t[r])return!1;return!0}function bt(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}function Xt(e){return e%1===0}function au(e){if(Math.tanh!=null)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{let t=Math.exp(2*e);return(t-1)/(t+1)}}function cu(e){let t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}function lu(e){let t=new Uint32Array(e);for(let r=0;r<e;++r)t[r]=r;return Ds(t),t}function ve(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function pu(e,t=n=>0,r,o){return new Promise((n,s)=>{let i=0,a=()=>{if(e()){n();return}i++;let c=t(i);if(r!=null&&i>=r){s();return}o!=null?o(a,c):setTimeout(a,c)};a()})}function uu(e,t){let r=1,o=-1;for(let s=0;s<e.length;++s)if(e[s]>=0)r*=e[s];else if(e[s]===-1){if(o!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${o} and dim ${s}`);o=s}else if(e[s]<0)throw Error(`Shapes can not be < 0. Found ${e[s]} at dim ${s}`);if(o===-1){if(t>0&&t!==r)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(r===0)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%r!==0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${r}`);let n=e.slice();return n[o]=t/r,n}function pe(e,t){let r=t.length;return e=e==null?t.map((o,n)=>n):[].concat(e),h(e.every(o=>o>=-r&&o<r),()=>`All values in axis param must be in range [-${r}, ${r}) but got axis ${e}`),h(e.every(o=>Xt(o)),()=>`All values in axis param must be integers but got axis ${e}`),e.map(o=>o<0?r+o:o)}function Ko(e,t){let r=[],o=[],n=t!=null&&Array.isArray(t)&&t.length===0,s=t==null||n?null:pe(t,e).sort(),i=0;for(let a=0;a<e.length;++a){if(s!=null){if(s[i]===a&&e[a]!==1)throw new Error(`Can't squeeze axis ${a} since its dim '${e[a]}' is not 1`);(s[i]==null||s[i]>a)&&e[a]===1&&(r.push(e[a]),o.push(a)),s[i]<=a&&i++}e[a]!==1&&(r.push(e[a]),o.push(a))}return{newShape:r,keptDims:o}}function Vo(e,t){return Yr(e,t)}function Yr(e,t){let r=null;if(e==null||e==="float32")r=new Float32Array(t);else if(e==="int32")r=new Int32Array(t);else if(e==="bool")r=new Uint8Array(t);else if(e==="string")r=new Array(t);else throw new Error(`Unknown data type ${e}`);return r}function Ho(e,t){for(let r=0;r<e.length;r++){let o=e[r];if(isNaN(o)||!isFinite(o))throw Error(`A tensor of type ${t} being uploaded contains ${o}.`)}}function jo(e){return e==="bool"||e==="complex64"||e==="float32"||e==="int32"||e==="string"}function mu(e,t){return!(t==="complex64"||t==="float32"&&e!=="complex64"||t==="int32"&&e!=="float32"&&e!=="complex64"||t==="bool"&&e==="bool")}function er(e){if(e==="float32"||e==="int32")return 4;if(e==="complex64")return 8;if(e==="bool")return 1;throw new Error(`Unknown dtype ${e}`)}function Jo(e){if(e==null)return 0;let t=0;return e.forEach(r=>t+=r.length),t}function Rt(e){return typeof e=="string"||e instanceof String}function Ms(e){return typeof e=="boolean"}function _s(e){return typeof e=="number"}function ue(e){return Array.isArray(e)?ue(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":_s(e)?"float32":Rt(e)?"string":Ms(e)?"bool":"float32"}function Ot(e){return!!(e&&e.constructor&&e.call&&e.apply)}function rr(e,t){for(let r=t;r<e;++r)if(e%r===0)return r;return e}function Lt(e){let t=e.length;if(t<2)return[];let r=new Array(t-1);r[t-2]=e[t-1];for(let o=t-3;o>=0;--o)r[o]=r[o+1]*e[o+1];return r}function Rs(e,t,r,o=!1){let n=new Array;if(t.length===1){let s=t[0]*(o?2:1);for(let i=0;i<s;i++)n[i]=r[e+i]}else{let s=t[0],i=t.slice(1),a=i.reduce((c,p)=>c*p)*(o?2:1);for(let c=0;c<s;c++)n[c]=Rs(e+c*a,i,r,o)}return n}function Te(e,t,r=!1){if(e.length===0)return t[0];let o=e.reduce((n,s)=>n*s)*(r?2:1);if(o===0)return[];if(o!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${r?" for a complex tensor":""}.`);return Rs(0,e,t,r)}function fu(e,t){if(Array.isArray(e))return e;if(t==="float32")return e instanceof Float32Array?e:new Float32Array(e);if(t==="int32")return e instanceof Int32Array?e:new Int32Array(e);if(t==="bool"||t==="string")return Uint8Array.from(new Int32Array(e));throw new Error(`Unknown dtype ${t}`)}function $r(e,t){let r=or(e,t);for(let o=0;o<r.length;o++)r[o]=1;return r}function or(e,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool")return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function hu(e,t){let r=e.reduce((o,n)=>o*n,1);if(t==null||t==="float32")return Te(e,new Float32Array(r));if(t==="int32")return Te(e,new Int32Array(r));if(t==="bool")return Te(e,new Uint8Array(r));throw new Error(`Unknown data type ${t}`)}function X(e){e.forEach(t=>{h(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`)})}function du(e,t,r){if(t===0)return 0;if(t===1)return e[0];let o=e[e.length-1];for(let n=0;n<e.length-1;++n)o+=r[n]*e[n];return o}function gu(e,t,r){if(t===0)return[];if(t===1)return[e];let o=new Array(t);for(let n=0;n<o.length-1;++n)o[n]=Math.floor(e/r[n]),e-=o[n]*r[n];return o[o.length-1]=e,o}function $e(e){return e&&e.then&&typeof e.then=="function"}var Bs="tfjsflags",kr=class{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=bu,this.populateURLFlags()}setPlatform(t,r){this.platform!=null&&(N().getBool("IS_TEST")||N().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=r}registerFlag(t,r,o){if(this.flagRegistry[t]={evaluationFn:r,setHook:o},this.urlFlags[t]!=null){let n=this.urlFlags[t];N().getBool("IS_TEST")||N().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${n}.`),this.set(t,n)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];let r=this.evaluateFlag(t);if($e(r))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=r,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,r){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=r,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(r)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let t=this.getQueryParams(this.global.location.search);Bs in t&&t[Bs].split(",").forEach(o=>{let[n,s]=o.split(":");this.urlFlags[n]=wu(n,s)})}};function bu(e){let t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(r,...o)=>(yu(t,o[0],o[1]),o.join("="))),t}function yu(e,t,r){e[decodeURIComponent(t)]=decodeURIComponent(r||"")}function wu(e,t){let r=t.toLowerCase();return r==="true"||r==="false"?r==="true":`${+r}`===r?+r:t}function N(){return Xo}var Xo=null;function Fs(e){Xo=e}var Yo;function Zo(){if(Yo==null){let e;if(typeof window<"u")e=window;else if(typeof __global$<"u")e=__global$;else if(typeof __Process$<"u")e=__Process$;else if(typeof self<"u")e=self;else throw new Error("Could not find a global object");Yo=e}return Yo}function Eu(){let e=Zo();return e._tfGlobals==null&&(e._tfGlobals=new Map),e._tfGlobals}function Sr(e,t){let r=Eu();if(r.has(e))return r.get(e);{let o=t();return r.set(e,o),r.get(e)}}var Gs="Abs",Cs="Acos",Ps="Acosh",Zr="Add",Os="AddN",Ls="All",Ws="Any",zs="ArgMax",qs="ArgMin",Us="Asin",Ks="Asinh",Vs="Atan",Hs="Atanh",js="Atan2",Js="AvgPool",Kw="AvgPoolGrad",Xs="AvgPool3D",Vw="AvgPool3DGrad",Ys="BatchMatMul",Zs="BatchToSpaceND",Qs="Bincount",ti="BitwiseAnd",Hw="BroadcastTo",ei="BroadcastArgs",Qr="Cast",ri="Ceil",oi="ClipByValue",ni="Complex",si="ComplexAbs",ii="Concat",ai="Conv2D",ci="Conv2DBackpropFilter",li="Conv2DBackpropInput",pi="Conv3D",jw="Conv3DBackpropFilterV2",ui="Conv3DBackpropInputV2",mi="Cos",fi="Cosh",hi="Cumprod",di="Cumsum",gi="CropAndResize",xi="DenseBincount",bi="DepthToSpace",yi="DepthwiseConv2dNative",wi="DepthwiseConv2dNativeBackpropFilter",Ei="DepthwiseConv2dNativeBackpropInput",Ti="Diag",vi="Dilation2D",Jw="Dilation2DBackpropInput",Xw="Dilation2DBackpropFilter",Qo="Draw",$i="RealDiv",ki="Einsum",Si="Elu",Yw="EluGrad",Ni="Erf",Ii="Equal",Ai="Exp",Di="ExpandDims",Mi="Expm1",_i="FFT",Ri="Fill",Bi="FlipLeftRight",Fi="Floor",Gi="FloorDiv",Ci="FusedBatchNorm",Pi="GatherV2",Oi="GatherNd",Li="Greater",Wi="GreaterEqual",to="Identity",zi="IFFT",qi="Imag",Ui="IsFinite",Ki="IsInf",Vi="IsNan",Hi="LeakyRelu",ji="Less",Ji="LessEqual",Xi="LinSpace",Yi="Log",Zi="Log1p",Qi="LogicalAnd",ta="LogicalNot",ea="LogicalOr",Zw="LogicalXor",Qw="LogSoftmax",tE="LowerBound",ra="LRN",eE="LRNGrad",rE="MatrixBandPart",oa="Max",na="Maximum",sa="MaxPool",oE="MaxPoolGrad",ia="MaxPool3D",nE="MaxPool3DGrad",aa="MaxPoolWithArgmax",ca="Mean",la="Min",pa="Minimum",ua="MirrorPad",ma="Mod",fa="Multinomial",ha="Multiply",da="Neg",ga="NotEqual",xa="NonMaxSuppressionV3",ba="NonMaxSuppressionV4",ya="NonMaxSuppressionV5",wa="OnesLike",Ea="OneHot",Ta="Pack",va="PadV2",sE="Pool",$a="Pow",ka="Prelu",Sa="Prod",Na="RaggedGather",Ia="RaggedRange",Aa="RaggedTensorToTensor",Da="Range",Ma="Real",_a="Reciprocal",Ra="Relu",Ba="Reshape",Fa="ResizeNearestNeighbor",iE="ResizeNearestNeighborGrad",Ga="ResizeBilinear",aE="ResizeBilinearGrad",Ca="Relu6",Pa="Reverse",Oa="Round",La="Rsqrt",Wa="ScatterNd",za="TensorScatterUpdate",qa="SearchSorted",Ua="Select",Ka="Selu",Va="Slice",Ha="Sin",ja="Sinh",Ja="Sign",Xa="Sigmoid",Ya="Softplus",Za="Sqrt",Qa="Sum",tc="SpaceToBatchND",ec="SplitV",rc="Softmax",oc="SparseFillEmptyRows",nc="SparseReshape",sc="SparseSegmentMean",ic="SparseSegmentSum",ac="SparseToDense",cc="SquaredDifference",cE="Square",lc="StaticRegexReplace",pc="StridedSlice",uc="StringNGrams",mc="StringSplit",fc="StringToHashBucketFast",hc="Sub",dc="Tan",gc="Tanh",eo="Tile",xc="TopK",bc="Transform",ro="Transpose",yc="Unique",wc="Unpack",Ec="UnsortedSegmentSum",lE="UpperBound",Tc="ZerosLike",vc="Step",tn="FromPixels",$c="RotateWithOffset",en="_FusedMatMul",rn="FusedConv2D",on="FusedDepthwiseConv2D";function Wt(...e){N().getBool("IS_TEST")||N().getBool("PROD")||console.warn(...e)}function Tu(...e){N().getBool("IS_TEST")||N().getBool("PROD")||console.log(...e)}var nr=Sr("kernelRegistry",()=>new Map),Nr=Sr("gradRegistry",()=>new Map);function sr(e,t){let r=sn(e,t);return nr.get(r)}function nn(e){return Nr.get(e)}function oo(e){let t=nr.entries(),r=[];for(;;){let{done:o,value:n}=t.next();if(o)break;let[s,i]=n,[a]=s.split("_");a===e&&r.push(i)}return r}function vu(e){let{kernelName:t,backendName:r}=e,o=sn(t,r);nr.has(o)&&Wt(`The kernel '${t}' for backend '${r}' is already registered`),nr.set(o,e)}function hE(e){let{kernelName:t}=e;Nr.has(t)&&N().getBool("DEBUG")&&Wt(`Overriding the gradient for '${t}'`),Nr.set(t,e)}function dE(e,t){let r=sn(e,t);if(!nr.has(r))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);nr.delete(r)}function gE(e){if(!Nr.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);Nr.delete(e)}function xE(e,t){oo(e).forEach(o=>{let n=Object.assign({},o,{backendName:t});vu(n)})}function sn(e,t){return`${t}_${e}`}var k={};xt(k,{arraysEqual:()=>bt,arraysEqualWithNull:()=>Uo,assert:()=>h,assertNonNegativeIntegerDimensions:()=>X,assertNonNull:()=>At,assertShapesMatch:()=>j,bytesFromStringArray:()=>Jo,bytesPerElement:()=>er,checkConversionForErrors:()=>Ho,clamp:()=>tr,computeStrides:()=>Lt,convertBackendValuesAndArrayBuffer:()=>fu,createScalarValue:()=>Au,createShuffledIndices:()=>lu,decodeString:()=>ar,distSquared:()=>su,encodeString:()=>fe,fetch:()=>Mu,fingerPrint64:()=>Iu,flatten:()=>Bt,getArrayFromDType:()=>Yr,getTypedArrayFromDType:()=>Vo,hasEncodingLoss:()=>mu,hexToLong:()=>Ir,indexToLoc:()=>gu,inferDtype:()=>ue,inferFromImplicitShape:()=>uu,isBoolean:()=>Ms,isFunction:()=>Ot,isInt:()=>Xt,isNumber:()=>_s,isPromise:()=>$e,isScalarShape:()=>iu,isString:()=>Rt,isTypedArray:()=>Q,isValidDtype:()=>jo,locToIndex:()=>du,makeOnesTypedArray:()=>$r,makeZerosNestedTypedArray:()=>hu,makeZerosTypedArray:()=>or,nearestDivisor:()=>rr,nearestLargerEven:()=>ru,now:()=>Ne,parseAxisParam:()=>pe,randUniform:()=>nu,repeatedTry:()=>pu,rightPad:()=>ve,shuffle:()=>Ds,shuffleCombo:()=>eu,sizeFromShape:()=>B,sizeToSquarishShape:()=>cu,squeezeShape:()=>Ko,sum:()=>ou,swap:()=>Xr,tanh:()=>au,toNestedArray:()=>Te,toTypedArray:()=>ir});function no(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}import*as cn from"/v135/long@4.0.0/denonext/long.mjs";var Se=cn.default||cn;function Ir(e){return Se.fromString(e,!0,16)}var Nc=Ir("c3a5c85c97cb3127"),ke=Ir("b492b66fbe98f273"),yt=Ir("9ae16a3b2f90404f");function an(e){return e.xor(e.shru(47))}function Ic(e,t,r){let o=e.slice(t,t+r);return Se.fromBytes(Array.from(o),!0,!0)}function Y(e,t){return Ic(e,t,8)}function Sc(e,t){return Ic(e,t,4)}function it(e,t){return t===0?e:e.shru(t).or(e.shl(64-t))}function me(e,t,r=Ir("9ddfea08eb382d69")){let o=e.xor(t).mul(r);o=o.xor(o.shru(47));let n=t.xor(o).mul(r);return n=n.xor(n.shru(47)),n=n.mul(r),n}function $u(e,t,r,o,n,s){n=n.add(e),s=it(s.add(n).add(o),21);let i=n;return n=n.add(t),n=n.add(r),s=s.add(it(n,44)),[n.add(o),s.add(i)]}function so(e,t,r,o){return $u(Y(e,t),Y(e,t+8),Y(e,t+16),Y(e,t+24),r,o)}function ku(e,t=e.length){if(t>=8){let r=yt.add(t*2),o=Y(e,0).add(yt),n=Y(e,t-8),s=it(n,37).mul(r).add(o),i=it(o,25).add(n).mul(r);return me(s,i,r)}if(t>=4){let r=yt.add(t*2),o=Sc(e,0);return me(o.shl(3).add(t),Sc(e,t-4),r)}if(t>0){let r=e[0],o=e[t>>1],n=e[t-1],s=r+(o<<8),i=t+(n<<2);return an(yt.mul(s).xor(Nc.mul(i))).mul(yt)}return yt}function Su(e,t=e.length){let r=yt.add(t*2),o=Y(e,0).mul(ke),n=Y(e,8),s=Y(e,t-8).mul(r),i=Y(e,t-16).mul(yt);return me(it(o.add(n),43).add(it(s,30)).add(i),o.add(it(n.add(yt),18)).add(s),r)}function Nu(e,t=e.length){let r=yt.add(t*2),o=Y(e,0).mul(yt),n=Y(e,8),s=Y(e,t-8).mul(r),i=Y(e,t-16).mul(yt),a=it(o.add(n),43).add(it(s,30)).add(i),c=me(a,o.add(it(n.add(yt),18)).add(s),r),p=Y(e,16).mul(r),d=Y(e,24),f=a.add(Y(e,t-32)).mul(r),g=c.add(Y(e,t-24)).mul(r);return me(it(p.add(d),43).add(it(f,30)).add(g),p.add(it(d.add(o),18)).add(f),r)}function Iu(e,t=e.length){let r=Se.fromNumber(81,!0);if(t<=32)return t<=16?ku(e,t):Su(e,t);if(t<=64)return Nu(e,t);let o=r,n=r.mul(ke).add(113),s=an(n.mul(yt).add(113)).mul(yt),i=[Se.UZERO,Se.UZERO],a=[Se.UZERO,Se.UZERO];o=o.mul(yt).add(Y(e,0));let c=0,p=(t-1>>6)*64,d=p+(t-1&63)-63;do o=it(o.add(n).add(i[0]).add(Y(e,c+8)),37).mul(ke),n=it(n.add(i[1]).add(Y(e,c+48)),42).mul(ke),o=o.xor(a[1]),n=n.add(i[0]).add(Y(e,c+40)),s=it(s.add(a[0]),33).mul(ke),i=so(e,c,i[1].mul(ke),o.add(a[0])),a=so(e,c+32,s.add(a[1]),n.add(Y(e,c+16))),[s,o]=[o,s],c+=64;while(c!==p);let f=ke.add(s.and(255).shl(1));return c=d,a[0]=a[0].add(t-1&63),i[0]=i[0].add(a[0]),a[0]=a[0].add(i[0]),o=it(o.add(n).add(i[0]).add(Y(e,c+8)),37).mul(f),n=it(n.add(i[1]).add(Y(e,c+48)),42).mul(f),o=o.xor(a[1].mul(9)),n=n.add(i[0].mul(9).add(Y(e,c+40))),s=it(s.add(a[0]),33).mul(f),i=so(e,c,i[1].mul(f),o.add(a[0])),a=so(e,c+32,s.add(a[1]),n.add(Y(e,c+16))),[s,o]=[o,s],me(me(i[0],a[0],f).add(an(n).mul(Nc)).add(s),me(i[1],a[1],f).add(o),f)}function Au(e,t){return t==="string"?fe(e):ir([e],t)}function Du(e,t){return e instanceof Float32Array&&t==="float32"||e instanceof Int32Array&&t==="int32"||e instanceof Uint8Array&&t==="bool"}function ir(e,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=Bt(e)),N().getBool("DEBUG")&&Ho(e,t),Du(e,t))return e;if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool"){let r=new Uint8Array(e.length);for(let o=0;o<r.length;++o)Math.round(e[o])!==0&&(r[o]=1);return r}else throw new Error(`Unknown data type ${t}`)}function Ne(){return N().platform.now()}function Mu(e,t){return N().platform.fetch(e,t)}function fe(e,t="utf-8"){return t=t||"utf-8",N().platform.encode(e,t)}function ar(e,t="utf-8"){return t=t||"utf-8",N().platform.decode(e,t)}function Q(e){return N().platform.isTypedArray!=null?N().platform.isTypedArray(e):no(e)}function Bt(e,t=[],r=!1){if(t==null&&(t=[]),typeof e=="boolean"||typeof e=="number"||typeof e=="string"||$e(e)||e==null||Q(e)&&r)t.push(e);else if(Array.isArray(e)||Q(e))for(let o=0;o<e.length;++o)Bt(e[o],t,r);else{let o=-1;for(let n of Object.keys(e))/^([1-9]+[0-9]*|0)$/.test(n)&&(o=Math.max(o,Number(n)));for(let n=0;n<=o;n++)Bt(e[n],t,r)}return t}var io=class{constructor(t,r){this.backendTimer=t,this.logger=r,r==null&&(this.logger=new ln)}profileKernel(t,r,o){let n,s=()=>{n=o()},i,a=Ne();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(s);else{s();for(let p of n)p.dataSync();i=Promise.resolve({kernelMs:Ne()-a})}if(N().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let p=0;p<n.length;p++){let d=n[p];d.data().then(f=>{_u(f,d.dtype,t)})}return{kernelName:t,outputs:n,inputs:r,timeMs:i.then(p=>p.kernelMs),extraInfo:i.then(p=>p.getExtraProfileInfo!=null?p.getExtraProfileInfo():"")}}logKernelProfile(t){let{kernelName:r,outputs:o,timeMs:n,inputs:s,extraInfo:i}=t;o.forEach(a=>{Promise.all([a.data(),n,i]).then(c=>{this.logger.logKernelProfile(r,a,c[0],c[1],s,c[2])})})}};function _u(e,t,r){if(t!=="float32")return!1;for(let o=0;o<e.length;o++){let n=e[o];if(isNaN(n)||!isFinite(n))return console.warn(`Found ${n} in the result of '${r}'`),!0}return!1}var ln=class{logKernelProfile(t,r,o,n,s,i){let a=typeof n=="number"?ve(`${n}ms`,9):n.error,c=ve(t,25),p=r.rank,d=r.size,f=ve(r.shape.toString(),14),g="";for(let x in s){let b=s[x];if(b!=null){let E=b.shape||r.shape,w=E.length;g+=`${x}: ${w}D ${w>0?E:""} `}}console.log(`%c${c}	%c${a}	%c${p}D ${f}	%c${d}	%c${g}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};function Ac(e,t,r){let o={},n={};for(let c=0;c<t.length;c++)o[t[c].id]=!0;for(let c=0;c<e.length;c++){let p=e[c],d=p.inputs;for(let f in d){let g=d[f],x=!1;for(let b=0;b<t.length;b++)if(o[g.id]){p.outputs.forEach(E=>o[E.id]=!0),x=!0,n[p.id]=!0;break}if(x)break}}let s={};s[r.id]=!0;let i={};for(let c=e.length-1;c>=0;c--){let p=e[c],d=p.inputs;for(let f=0;f<p.outputs.length;f++)if(s[p.outputs[f].id]){for(let g in d)s[d[g].id]=!0,i[p.id]=!0;break}}let a=[];for(let c=0;c<e.length;c++){let p=e[c];if(n[p.id]&&i[p.id]){let d={};for(let g in p.inputs){let x=p.inputs[g];o[x.id]&&(d[g]=x)}let f=Object.assign({},p);f.inputs=d,f.outputs=p.outputs,a.push(f)}}return a}function Dc(e,t,r,o){for(let n=t.length-1;n>=0;n--){let s=t[n],i=[];if(s.outputs.forEach(c=>{let p=e[c.id];p!=null?i.push(p):i.push(null)}),s.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);let a=s.gradient(i);for(let c in s.inputs){if(!(c in a))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(a)}.`);let p=r(()=>a[c]());if(p.dtype!=="float32")throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${p.dtype}'`);let d=s.inputs[c];if(!bt(p.shape,d.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${c}' has shape '${p.shape}', which does not match the shape of the input '${d.shape}'`);if(e[d.id]==null)e[d.id]=p;else{let f=e[d.id];e[d.id]=o(f,p),f.dispose()}}}}var Mc=20,Ar=3,pn=7;function _c(e,t,r,o){let n=Lt(t),s=Ru(e,t,r,n),i=t.length,a=ao(e,t,r,n,s),c=["Tensor"];return o&&(c.push(`  dtype: ${r}`),c.push(`  rank: ${i}`),c.push(`  shape: [${t}]`),c.push("  values:")),c.push(a.map(p=>"    "+p).join(`
`)),c.join(`
`)}function Ru(e,t,r,o){let n=B(t),s=o[o.length-1],i=new Array(s).fill(0),a=t.length,c=r==="complex64"?Mr(e):e;if(a>1)for(let p=0;p<n/s;p++){let d=p*s;for(let f=0;f<s;f++)i[f]=Math.max(i[f],Dr(c[d+f],0,r).length)}return i}function Dr(e,t,r){let o;return Array.isArray(e)?o=`${parseFloat(e[0].toFixed(pn))} + ${parseFloat(e[1].toFixed(pn))}j`:Rt(e)?o=`'${e}'`:r==="bool"?o=Rc(e):o=parseFloat(e.toFixed(pn)).toString(),ve(o,t)}function Rc(e){return e===0?"false":"true"}function ao(e,t,r,o,n,s=!0){let i=r==="complex64"?2:1,a=t[0],c=t.length;if(c===0){if(r==="complex64"){let E=Mr(e);return[Dr(E[0],0,r)]}return r==="bool"?[Rc(e[0])]:[e[0].toString()]}if(c===1){if(a>Mc){let w=Ar*i,$=Array.from(e.slice(0,w)),_=Array.from(e.slice((a-Ar)*i,a*i));return r==="complex64"&&($=Mr($),_=Mr(_)),["["+$.map((v,I)=>Dr(v,n[I],r)).join(", ")+", ..., "+_.map((v,I)=>Dr(v,n[a-Ar+I],r)).join(", ")+"]"]}return["["+(r==="complex64"?Mr(e):Array.from(e)).map((w,$)=>Dr(w,n[$],r)).join(", ")+"]"]}let p=t.slice(1),d=o.slice(1),f=o[0]*i,g=[];if(a>Mc){for(let E=0;E<Ar;E++){let w=E*f,$=w+f;g.push(...ao(e.slice(w,$),p,r,d,n,!1))}g.push("...");for(let E=a-Ar;E<a;E++){let w=E*f,$=w+f;g.push(...ao(e.slice(w,$),p,r,d,n,E===a-1))}}else for(let E=0;E<a;E++){let w=E*f,$=w+f;g.push(...ao(e.slice(w,$),p,r,d,n,E===a-1))}let x=c===2?",":"";g[0]="["+(a>0?g[0]+x:"");for(let E=1;E<g.length-1;E++)g[E]=" "+g[E]+x;let b=`,
`;for(let E=2;E<c;E++)b+=`
`;return g[g.length-1]=" "+g[g.length-1]+"]"+(s?"":b),g}function Mr(e){let t=[];for(let r=0;r<e.length;r+=2)t.push([e[r],e[r+1]]);return t}var he=class{constructor(t,r,o){if(this.dtype=r,this.shape=t.slice(),this.size=B(t),o!=null){let n=o.length;h(n===this.size,()=>`Length of values '${n}' does not match the size inferred by the shape '${this.size}'.`)}if(r==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=o||Yr(r,this.size),this.strides=Lt(t)}set(t,...r){r.length===0&&(r=[0]),h(r.length===this.rank,()=>`The number of provided coordinates (${r.length}) must match the rank (${this.rank})`);let o=this.locToIndex(r);this.values[o]=t}get(...t){t.length===0&&(t=[0]);let r=0;for(let n of t){if(n<0||n>=this.shape[r]){let s=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(s)}r++}let o=t[t.length-1];for(let n=0;n<t.length-1;++n)o+=this.strides[n]*t[n];return this.values[o]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let r=t[t.length-1];for(let o=0;o<t.length-1;++o)r+=this.strides[o]*t[o];return r}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];let r=new Array(this.shape.length);for(let o=0;o<r.length-1;++o)r[o]=Math.floor(t/this.strides[o]),t-=r[o]*this.strides[o];return r[r.length-1]=t,r}get rank(){return this.shape.length}toTensor(){return Ft().makeTensor(this.values,this.shape,this.dtype)}},Ft=null,cr=null,Bu=null;function Bc(e){Ft=e}function Fc(e){cr=e}function Gc(e){Bu=e}var H=class{constructor(t,r,o,n){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=r||"float32",this.size=B(t),this.strides=Lt(t),this.dataId=o,this.id=n,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let t=await this.data();return cr.buffer(this.shape,this.dtype,t)}bufferSync(){return cr.buffer(this.shape,this.dtype,this.dataSync())}async array(){let t=await this.data();return Te(this.shape,t,this.dtype==="complex64")}arraySync(){return Te(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let t=Ft().read(this.dataId);if(this.dtype==="string"){let r=await t;try{return r.map(o=>ar(o))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),Ft().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();let t=Ft().readSync(this.dataId);if(this.dtype==="string")try{return t.map(r=>ar(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();let t=await Ft().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),Ft().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return cr.print(this,t)}clone(){return this.throwIfDisposed(),cr.clone(this)}toString(t=!1){let r=this.dataSync();return _c(r,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),cr.cast(this,t)}variable(t=!0,r,o){return this.throwIfDisposed(),Ft().makeVariable(this,t,r,o)}};Object.defineProperty(H,Symbol.hasInstance,{value:e=>!!e&&e.data!=null&&e.dataSync!=null&&e.throwIfDisposed!=null});function un(){return Sr("Tensor",()=>H)}un();var Yt=class extends H{constructor(t,r,o,n){super(t.shape,t.dtype,t.dataId,n),this.trainable=r,this.name=o}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!bt(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);Ft().disposeTensor(this),this.dataId=t.dataId,Ft().incRef(this,null)}dispose(){Ft().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(Yt,Symbol.hasInstance,{value:e=>e instanceof H&&e.assign!=null&&e.assign instanceof Function});var Pc={};xt(Pc,{assertTypesMatch:()=>xn,getTensorsInContainer:()=>_r,isTensorInList:()=>Cu,makeTypesMatch:()=>R});var mn;(function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"})(mn||(mn={}));var fn;(function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"})(fn||(fn={}));var hn;(function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"})(hn||(hn={}));var dn;(function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"})(dn||(dn={}));var gn;(function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"})(gn||(gn={}));var Fu={float32:dn,int32:fn,bool:hn,complex64:gn};function lr(e,t){if(e==="string"||t==="string"){if(e==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return Fu[e][t]}function Gu(e){return lr(e,"int32")}function co(e){return e!=null&&typeof e=="object"&&"texture"in e&&e.texture instanceof WebGLTexture}function lo(e){return typeof GPUBuffer<"u"&&e!=null&&typeof e=="object"&&"buffer"in e&&e.buffer instanceof GPUBuffer}function R(e,t){if(e.dtype===t.dtype)return[e,t];let r=lr(e.dtype,t.dtype);return[e.cast(r),t.cast(r)]}function xn(e,t){h(e.dtype===t.dtype,()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`)}function Cu(e,t){return t.some(r=>r.id===e.id)}function _r(e){let t=[];return Cc(e,t,new Set),t}function Cc(e,t,r){if(e==null)return;if(e instanceof H){t.push(e);return}if(!Pu(e))return;let o=e;for(let n in o){let s=o[n];r.has(s)||(r.add(s),Cc(s,t,r))}}function Pu(e){return Array.isArray(e)||typeof e=="object"}function bn(e){return e.kernelName!=null}var po=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(let t in this.registeredVariables)this.registeredVariables[t].dispose()}},Rr=class e{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new po}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let t=this.getSortedBackends();for(let r=0;r<t.length;r++){let o=t[r];if(await this.initializeBackend(o).success){await this.setBackend(o);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:t,asyncInit:r}=this.initializeBackendsAndReturnBest();if(r)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){let{asyncInit:r}=this.initializeBackend(t);if(r)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,r,o=1){return t in this.registryFactory?(Wt(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:r,priority:o},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;let{success:r,asyncInit:o}=this.initializeBackend(t);if(!(o?await r:r))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new io(this.backendInstance),!0}setupRegisteredKernels(){oo(this.backendName).forEach(r=>{r.setupFunc!=null&&r.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){oo(t).forEach(o=>{o.disposeFunc!=null&&o.disposeFunc(this.registry[t])})}initializeBackend(t){let r=this.registryFactory[t];if(r==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{let o=r.factory();if(o&&!(o instanceof vr)&&typeof o.then=="function"){let n=++this.pendingBackendInitId,s=o.then(i=>n<this.pendingBackendInitId?!1:(this.registry[t]=i,this.pendingBackendInit=null,!0)).catch(i=>(n<this.pendingBackendInitId||(this.pendingBackendInit=null,Wt(`Initialization of backend ${t} failed`),Wt(i.stack||i.message)),!1));return this.pendingBackendInit=s,{success:s,asyncInit:!0}}else return this.registry[t]=o,{success:!0,asyncInit:!1}}catch(o){return Wt(`Initialization of backend ${t} failed`),Wt(o.stack||o.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,r)=>this.registryFactory[r].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){let t=this.getSortedBackends();for(let r=0;r<t.length;r++){let o=t[r],{success:n,asyncInit:s}=this.initializeBackend(o);if(s||n)return{name:o,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,r){let o=this.state.tensorInfo.get(r),n=o.backend,s=this.readSync(r),i=n.refCount(r);n.disposeData(r,!0),o.backend=t,t.move(r,s,o.shape,o.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,r){let o=null;if(r==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");r=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof r!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");o=t}let n;return this.scopedRun(()=>this.startScope(o),()=>this.endScope(n),()=>(n=r(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n))}scopedRun(t,r,o){t();try{let n=o();return r(),n}catch(n){throw r(),n}}nextTensorId(){return e.nextTensorId++}nextVariableId(){return e.nextVariableId++}clone(t){let r=m.runKernel(to,{x:t}),o={x:t},n=i=>({x:()=>{let a="float32",c={x:i},p={dtype:a};return m.runKernel(Qr,c,p)}}),s=[];return this.addTapeNode(this.state.activeScope.name,o,[r],n,s,{}),r}runKernel(t,r,o){if(this.backendName==null&&this.backend,!(sr(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:r,attrs:o})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,r,o){let n=this.backend.numDataIds(),s=0;o.forEach(c=>{s+=c.dtype==="complex64"?3:1});let i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],a=n-r-s-i;if(a>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${a} data ids) after running '${t}'`)}runKernelFunc(t){let r,o=[],n=this.isTapeOn(),s=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let a;this.backendName==null&&this.backend;let c,p=bn(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(bn(t)){let{kernelName:b,inputs:E,attrs:w}=t;this.backendName==null&&this.backend;let $=sr(b,this.backendName);h($!=null,()=>`Cannot find registered kernel '${b}' for backend '${this.backendName}'`),a=()=>{let _=this.backend.numDataIds();c=$.kernelFunc({inputs:E,attrs:w,backend:this.backend});let v=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(b,_,v);let I=v.map(M=>M.rank!=null?M:this.makeTensorFromTensorInfo(M));if(n){let M=this.getTensorsForGradient(b,E,I);o=this.saveTensorsForBackwardMode(M)}return I}}else{let{forwardFunc:b}=t,E=w=>{n&&(o=w.map($=>this.keep(this.clone($))))};a=()=>{let w=this.backend.numDataIds();c=this.tidy(()=>b(this.backend,E));let $=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(p,w,$),$}}let{inputs:d,attrs:f}=t,g=bn(t)?null:t.backwardsFunc,x;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?r=a():(x=this.profiler.profileKernel(p,d,()=>a()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(x),r=x.outputs)}),n&&this.addTapeNode(p,d,r,g,o,f),this.state.profiling&&this.state.activeProfile.kernels.push({name:p,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(d).map(b=>d[b]!=null?d[b].shape:null),outputShapes:r.map(b=>b.shape),kernelTimeMs:x.timeMs,extraInfo:x.extraInfo}),Array.isArray(c)?r:r[0]}saveTensorsForBackwardMode(t){return t.map(o=>this.keep(this.clone(o)))}getTensorsForGradient(t,r,o){let n=nn(t);if(n!=null){let s=n.inputsToSave||[],i=n.outputsToSave||[],a;n.saveAllInputs?(h(Array.isArray(r),()=>"saveAllInputs is true, expected inputs to be an array."),a=Object.keys(r).map(p=>r[p])):a=s.map(p=>r[p]);let c=o.filter((p,d)=>i[d]);return a.concat(c)}return[]}makeTensor(t,r,o,n){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");o=o||"float32",n=n||this.backend;let s=t;o==="string"&&Rt(t[0])&&(s=t.map(c=>fe(c)));let i=n.write(s,r,o),a=new H(r,o,i,this.nextTensorId());if(this.trackTensor(a,n),o==="string"){let c=this.state.tensorInfo.get(i),p=Jo(s);this.state.numBytes+=p-c.bytes,c.bytes=p}return a}makeTensorFromDataId(t,r,o,n){o=o||"float32";let s={dataId:t,shape:r,dtype:o};return this.makeTensorFromTensorInfo(s,n)}makeTensorFromTensorInfo(t,r){let{dataId:o,shape:n,dtype:s}=t,i=new H(n,s,o,this.nextTensorId());return this.trackTensor(i,r),i}makeVariable(t,r=!0,o,n){o=o||this.nextVariableId().toString(),n!=null&&n!==t.dtype&&(t=t.cast(n));let s=new Yt(t,r,o,this.nextTensorId());if(this.state.registeredVariables[s.name]!=null)throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(t,r){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let o=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(o=t.size*er(t.dtype)),this.state.numBytes+=o,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:r||this.backend,dtype:t.dtype,shape:t.shape,bytes:o})),t instanceof Yt||this.track(t)}incRef(t,r){this.trackTensor(t,r),this.backend.incRef(t.dataId)}removeDataId(t,r){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===r&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;let r=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=r.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){let o=t.size*er(t.dtype);this.state.numBytes-=o}r.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,r.backend)}disposeVariables(){for(let t in this.state.registeredVariables){let r=this.state.registeredVariables[t];this.disposeVariable(r)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){let t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;let r=this.state.numBytes,o=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(n=>n.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-r,this.state.activeProfile.newTensors=this.state.numTensors-o;for(let n of this.state.activeProfile.kernels)n.kernelTimeMs=await n.kernelTimeMs,n.extraInfo=await n.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,r,o,n,s,i){let a={id:this.state.nextTapeNodeId++,kernelName:t,inputs:r,outputs:o,saved:s},c=nn(t);c!=null&&(n=c.gradFunc),n!=null&&(a.gradient=p=>(p=p.map((d,f)=>{if(d==null){let g=o[f],x=or(g.size,g.dtype);return this.makeTensor(x,g.shape,g.dtype)}return d}),n(p.length>1?p:p[0],s,i))),this.state.activeTape.push(a)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){let r={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(r.name=t),this.state.scopeStack.push(r),this.state.activeScope=r}endScope(t){let r=_r(t),o=new Set(r.map(s=>s.id));for(let s=0;s<this.state.activeScope.track.length;s++){let i=this.state.activeScope.track[s];!i.kept&&!o.has(i.id)&&i.dispose()}let n=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],r.forEach(s=>{!s.kept&&s.scopeId===n.id&&this.track(s)})}gradients(t,r,o,n=!1){if(h(r.length>0,()=>"gradients() received an empty list of xs."),o!=null&&o.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${o.dtype}'`);let s=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));h(s instanceof H,()=>"The result y returned by f() must be a tensor.");let i=Ac(this.state.activeTape,r,s);if(!n&&i.length===0&&r.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{let a={};a[s.id]=o??Ou(s.shape),Dc(a,i,p=>this.tidy(p),Lu);let c=r.map(p=>a[p.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(p=>{for(let d of p.saved)d.dispose()}),this.state.activeTape=null),{value:s,grads:c}})}customGrad(t){return h(Ot(t),()=>"The f passed in customGrad(f) must be a function."),(...r)=>{h(r.every(a=>a instanceof H),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let o,n={};r.forEach((a,c)=>{n[c]=a});let s=(a,c)=>(o=t(...r,c),h(o.value instanceof H,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),h(Ot(o.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),o.value),i=(a,c)=>{let p=o.gradFunc(a,c),d=Array.isArray(p)?p:[p];h(d.length===r.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),h(d.every(g=>g instanceof H),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let f={};return d.forEach((g,x)=>{f[x]=()=>g}),f};return this.runKernelFunc({forwardFunc:s,backwardsFunc:i,inputs:n})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,r){return this.state.tensorInfo.get(t).backend.readToGPU(t,r)}async time(t){let r=Ne(),o=await this.backend.time(t);return o.wallMs=Ne()-r,o}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new po;for(let t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};Rr.nextTensorId=0;Rr.nextVariableId=0;function Ou(e){let t=$r(B(e),"float32");return m.makeTensor(t,e,"float32")}function yn(){let e=Zo();if(e._tfengine==null){let t=new kr(e);e._tfengine=new Rr(t)}return Fs(e._tfengine.ENV),Bc(()=>e._tfengine),e._tfengine}var m=yn();function Lu(e,t){let r={a:e,b:t};return m.runKernel(Zr,r)}var Tn={};xt(Tn,{isBrowser:()=>En,isMobile:()=>qu,mockIsMobile:()=>zu});function Wu(){return typeof navigator<"u"&&navigator!=null}var wn;function zu(e){wn=e}function qu(e){if(wn!==void 0)return wn;if(e||Wu()){if(e||(e=navigator),e.product==="ReactNative")return!0;let t=e.userAgent||e.vendor||(typeof window<"u"?window.opera:"");if(!t){let r=e;return r.userAgentData&&r.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1}function En(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}var $t=N();$t.registerFlag("DEBUG",()=>!1,e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});$t.registerFlag("IS_BROWSER",()=>En());$t.registerFlag("IS_NODE",()=>typeof __Process$<"u"&&typeof __Process$.versions<"u"&&typeof __Process$.versions.node<"u");$t.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));$t.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));$t.registerFlag("PROD",()=>!1);$t.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>$t.getBool("DEBUG"));$t.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);$t.registerFlag("IS_TEST",()=>!1);$t.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>$t.getBool("DEBUG"));$t.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);$t.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);$t.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);function at(e,t){let r=e;if(Q(e))return t==="string"?[]:[e.length];if(co(e)){let n=e.channels||"RGBA";return[e.height,e.width*n.length]}else if(lo(e))return[e.buffer.size/(t==null?4:er(t))];if(!Array.isArray(e))return[];let o=[];for(;Array.isArray(r)||Q(r)&&t!=="string";)o.push(r.length),r=r[0];return Array.isArray(e)&&N().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Lc(e,o,[]),o}function Lc(e,t,r){if(r=r||[],!Array.isArray(e)&&!Q(e)){h(t.length===0,()=>`Element arr[${r.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}h(t.length>0,()=>`Element arr[${r.join("][")}] should be a primitive, but is an array of ${e.length} elements`),h(e.length===t[0],()=>`Element arr[${r.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`);let o=t.slice(1);for(let n=0;n<e.length;++n)Lc(e[n],o,r.concat(n))}function Oc(e,t,r,o){if(e!=="string_or_numeric"){if(e==null)throw new Error("Expected dtype cannot be null.");if(e!=="numeric"&&e!==t||e==="numeric"&&t==="string")throw new Error(`Argument '${r}' passed to '${o}' must be ${e} tensor, but got ${t} tensor`)}}function l(e,t,r,o="numeric"){if(e instanceof un())return Oc(o,e.dtype,t,r),e;let n=ue(e);if(n!=="string"&&["bool","int32","float32"].indexOf(o)>=0&&(n=o),Oc(o,n,t,r),e==null||!Q(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string"){let c=e==null?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${r}' must be a Tensor or TensorLike, but got '${c}'`)}let s=at(e,n);!Q(e)&&!Array.isArray(e)&&(e=[e]);let a=n!=="string"?ir(e,n):Bt(e,[],!0);return m.makeTensor(a,s,n)}function Zt(e,t,r,o="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${r} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map((s,i)=>l(s,`${t}[${i}]`,r,o))}var Wc="__op";function u(e){let t=Object.keys(e);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let r=t[0],o=e[r];r.endsWith("_")&&(r=r.substring(0,r.length-1)),r=r+Wc;let n=(...s)=>{m.startScope(r);try{let i=o(...s);return $e(i)&&console.error("Cannot return a Promise inside of tidy."),m.endScope(i),i}catch(i){throw m.endScope(null),i}};return Object.defineProperty(n,"name",{value:r,configurable:!0}),n}function Uu(e,t){let r=l(e,"real","complex"),o=l(t,"imag","complex");j(r.shape,o.shape,`real and imag shapes, ${r.shape} and ${o.shape}, must match in call to tf.complex().`);let n={real:r,imag:o};return m.runKernel(ni,n)}var Nt=u({complex_:Uu});function wt(e,t,r,o){if(o==null)o=ue(e);else if(o==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(lo(e)||co(e)){if(o!=="float32"&&o!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${o}.`);return m.backend.createTensorFromGPUData(e,t||r,o)}if(!Q(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){X(t);let n=B(t),s=B(r);h(n===s,()=>`Based on the provided shape, [${t}], the tensor should have ${n} values but has ${s}`);for(let i=0;i<r.length;++i){let a=r[i],c=i===r.length-1?a!==B(t.slice(i)):!0;h(r[i]===t[i]||!c,()=>`Error creating a new Tensor. Inferred shape (${r}) does not match the provided shape (${t}). `)}}return!Q(e)&&!Array.isArray(e)&&(e=[e]),t=t||r,e=o!=="string"?ir(e,o):Bt(e,[],!0),m.makeTensor(e,t,o)}function Qt(e,t,r){let o=at(e,r);return wt(e,t,o,r)}var te={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};var ct=class e{static join(t){return new e(t).slice()}constructor(t){if(this.shards=[],this.previousShardIndex=0,t==null||(t instanceof Array||(t=[t]),t=t.map(o=>Q(o)?o.buffer:o),t.length===0))return;this.bufferUniformSize=t[0].byteLength;let r=0;for(let o=0;o<t.length;o++){let n=t[o];o!==t.length-1&&n.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);let s=r+n.byteLength;this.shards.push({buffer:n,start:r,end:s}),r=s}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(t=0,r=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(t=isNaN(Number(t))?0:t,r=isNaN(Number(r))?0:r,t=Math.max(0,t),r=Math.min(this.byteLength,r),r<=t)return new ArrayBuffer(0);let o=this.findShardForByte(t);if(o===-1)throw new Error(`Could not find start shard for byte ${t}`);let n=r-t,s=new ArrayBuffer(n),i=new Uint8Array(s),a=0;for(let c=o;c<this.shards.length;c++){let p=this.shards[c],f=t+a-p.start,g=a,b=Math.min(r,p.end)-p.start,E=new Uint8Array(p.buffer,f,b-f);if(i.set(E,g),a+=E.length,r<p.end)break}return s}findShardForByte(t){if(this.shards.length===0||t<0||t>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(t/this.bufferUniformSize),this.previousShardIndex;function r(n){return t<n.start?-1:t>=n.end?1:0}if(r(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;let o=Ku(this.shards,r);return o===-1?-1:(this.previousShardIndex=o,this.previousShardIndex)}};function Ku(e,t){let r=0,o=e.length;for(;r<=o;){let n=Math.floor((o-r)/2)+r,s=t(e[n]);if(s===0)return n;s<0?o=n:r=n+1}return-1}function kT(){N().set("PROD",!0)}function ST(){N().set("DEBUG",!0)}function NT(){N().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function Vu(e){N().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}Gc(Vu);function IT(){m.disposeVariables()}function AT(){return m}function DT(){return m.memory()}function MT(e){return m.profile(e)}function J(e,t){return m.tidy(e,t)}function rt(e){_r(e).forEach(r=>r.dispose())}function zc(e){return m.keep(e)}function _T(e){return m.time(e)}function RT(e){return m.setBackend(e)}function BT(){return m.ready()}function qc(){return m.backendName}function FT(e){m.removeBackend(e)}function GT(e){return m.findBackend(e)}function CT(e){return m.findBackendFactory(e)}function PT(e,t,r=1){return m.registerBackend(e,t,r)}function Uc(){return m.backend}function OT(e,t){N().setPlatform(e,t)}var de=4;async function Hc(e,t){let r=[],o=[],n=Array.isArray(e)?e.map(i=>i.name):Object.keys(e);for(let i=0;i<n.length;++i){let a=n[i],c=Array.isArray(e)?e[i].tensor:e[a];if(c.dtype!=="float32"&&c.dtype!=="int32"&&c.dtype!=="bool"&&c.dtype!=="string"&&c.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${a}': ${c.dtype}`);let p={name:a,shape:c.shape,dtype:c.dtype};if(c.dtype==="string"){let d=new Promise(async f=>{let g=await c.bytes(),x=g.reduce((w,$)=>w+$.length,0)+de*g.length,b=new Uint8Array(x),E=0;for(let w=0;w<g.length;w++){let $=g[w],_=new Uint8Array(new Uint32Array([$.length]).buffer);b.set(_,E),E+=de,b.set($,E),E+=$.length}f(b)});o.push(d)}else o.push(c.data());t!=null&&(p.group=t),r.push(p)}let s=await Promise.all(o);return{data:Ju(s),specs:r}}function uo(e,t){let r=new ct(e),o={},n=0;for(let s of t){let i=Hu(s,(a,c)=>r.slice(n+a,n+c));o[s.name]=jc(s,r.slice(n,n+i)),n+=i}return o}function Hu(e,t){let r=B(e.shape),o;if("quantization"in e){let n=e.quantization;o=te[n.dtype]}else if(e.dtype==="string"){let n=0;for(let s=0;s<r;s++)n+=de+new Uint32Array(t(n,n+de))[0];return n}else o=te[e.dtype];return r*o}async function ju(e,t){let r=B(e.shape),o;if("quantization"in e){let n=e.quantization;o=te[n.dtype]}else if(e.dtype==="string"){let n=0;for(let s=0;s<r;s++)n+=de+new Uint32Array(await t(n,n+de))[0];return n}else o=te[e.dtype];return r*o}function jc(e,t){let r=e.name,o=e.dtype,n=e.shape,s=B(n),i,a=0;if("quantization"in e){let c=e.quantization;if(c.dtype==="uint8"||c.dtype==="uint16"){if(!("min"in c&&"scale"in c))throw new Error(`Weight ${e.name} with quantization ${c.dtype} doesn't have corresponding metadata min and scale.`)}else if(c.dtype==="float16"){if(o!=="float32")throw new Error(`Weight ${e.name} is quantized with ${c.dtype} which only supports weights of type float32 not ${o}.`)}else throw new Error(`Weight ${e.name} has unknown quantization dtype ${c.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);let p=te[c.dtype],d=c.dtype==="uint8"?new Uint8Array(t):new Uint16Array(t);if(o==="float32")if(c.dtype==="uint8"||c.dtype==="uint16"){i=new Float32Array(d.length);for(let f=0;f<d.length;f++){let g=d[f];i[f]=g*c.scale+c.min}}else if(c.dtype==="float16")i=Qu()(d);else throw new Error(`Unsupported quantization type ${c.dtype} for weight type float32.`);else if(o==="int32"){if(c.dtype!=="uint8"&&c.dtype!=="uint16")throw new Error(`Unsupported quantization type ${c.dtype} for weight type int32.`);i=new Int32Array(d.length);for(let f=0;f<d.length;f++){let g=d[f];i[f]=Math.round(g*c.scale+c.min)}}else throw new Error(`Unsupported dtype in weight '${r}': ${o}`);a+=s*p}else if(o==="string"){let c=B(e.shape);i=[];for(let p=0;p<c;p++){let d=new Uint32Array(t.slice(a,a+de))[0];a+=de;let f=new Uint8Array(t.slice(a,a+d));i.push(f),a+=d}}else{let c=te[o];if(o==="float32")i=new Float32Array(t);else if(o==="int32")i=new Int32Array(t);else if(o==="bool")i=new Uint8Array(t);else if(o==="complex64"){i=new Float32Array(t);let p=new Float32Array(i.length/2),d=new Float32Array(i.length/2);for(let b=0;b<p.length;b++)p[b]=i[b*2],d[b]=i[b*2+1];let f=Qt(p,n,"float32"),g=Qt(d,n,"float32"),x=Nt(f,g);return f.dispose(),g.dispose(),x}else throw new Error(`Unsupported dtype in weight '${r}': ${o}`);a+=s*c}return Qt(i,n,o)}async function Kc(e,t,r){let o=new Uint8Array(t);for(;o.byteLength<r;){let{done:n,value:s}=await e.read();if(n&&s==null){let a=r-o.byteLength;throw new Error(`Reader is done but ${a} bytes are still expected`)}let i=new Uint8Array(o.length+s.byteLength);i.set(o,0),i.set(new Uint8Array(s),o.length),o=i}return o.buffer}async function Jc(e,t){let r={},o=e.getReader(),n=new ArrayBuffer(0);for(let s of t){let i=await ju(s,async(p,d)=>(n=await Kc(o,n,d),n.slice(p,d)));n=await Kc(o,n,i);let a=n.slice(0,i);n=n.slice(i);let c=jc(s,a);if(r[s.name]=c,qc()==="webgpu"){let p=Uc();"uploadToGPU"in p&&B(c.shape)>=N().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&p.uploadToGPU(c.dataId)}}return r}function Ju(e){if(e===null)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0,r=[];e.forEach(s=>{if(t+=s.byteLength,r.push(s.byteLength===s.buffer.byteLength?s:new s.constructor(s)),!(s instanceof Float32Array||s instanceof Int32Array||s instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${s.constructor.name}`)});let o=new Uint8Array(t),n=0;return r.forEach(s=>{o.set(new Uint8Array(s.buffer),n),n+=s.byteLength}),o.buffer}var vn=typeof __Buffer$<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function Vc(e){return vn?__Buffer$.byteLength(e,"utf8"):new Blob([e]).size}function Xc(e){if(vn)return __Buffer$.from(e).toString("base64");let t=new Uint8Array(e),r="";for(let o=0,n=t.length;o<n;o++)r+=String.fromCharCode(t[o]);return btoa(r)}function Yc(e){if(vn){let o=__Buffer$.from(e,"base64");return o.buffer.slice(o.byteOffset,o.byteOffset+o.byteLength)}let t=atob(e),r=new Uint8Array(t.length);for(let o=0;o<t.length;++o)r.set([t.charCodeAt(o)],o);return r.buffer}function Zc(e){return ct.join(e)}function $n(e){let t="/";for(e=e.trim();e.endsWith(t);)e=e.slice(0,e.length-1);let r=e.split(t);return r[r.length-1]}function mo(e,t){let r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return e.signature!=null&&(r.signature=e.signature),e.userDefinedMetadata!=null&&(r.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(r.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(r.initializerSignature=e.initializerSignature),e.trainingConfig!=null&&(r.trainingConfig=e.trainingConfig),r}function kn(e,t,r){let o={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(e.trainingConfig!=null&&(o.trainingConfig=e.trainingConfig),e.weightsManifest!=null){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!r)throw new Error("modelJSON has weightsManifest but weightData is null");o.weightSpecs=t,o.weightData=r}return e.signature!=null&&(o.signature=e.signature),e.userDefinedMetadata!=null&&(o.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(o.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(o.initializerSignature=e.initializerSignature),o}async function pr(e,t){let r,o;return e.weightsManifest!=null&&([r,o]=await t(e.weightsManifest)),kn(e,r,o)}function zt(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:e.modelTopology==null?0:Vc(JSON.stringify(e.modelTopology)),weightSpecsBytes:e.weightSpecs==null?0:Vc(JSON.stringify(e.weightSpecs)),weightDataBytes:e.weightData==null?0:new ct(e.weightData).byteLength}}function Br(e){let t=[];for(let r of e)t.push(...r.weights);return t}function Xu(){let e=r=>{let o=r<<13,n=0;for(;!(o&8388608);)n-=8388608,o<<=1;return o&=-8388609,n+=947912704,o|n},t=new Uint32Array(2048);t[0]=0;for(let r=1;r<1024;r++)t[r]=e(r);for(let r=1024;r<2048;r++)t[r]=939524096+(r-1024<<13);return t}function Yu(){let e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}function Zu(){let e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}function Qu(){let e=Xu(),t=Yu(),r=Zu();return o=>{let n=new ArrayBuffer(4*o.length),s=new Uint32Array(n);for(let i=0;i<o.length;i++){let a=o[i],c=e[r[a>>10]+(a&1023)]+t[a>>10];s[i]=c}return new Float32Array(n)}}var nt=class e{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return e.instance==null&&(e.instance=new e),e.instance}static registerSaveRouter(t){e.getInstance().saveRouters.push(t)}static registerLoadRouter(t){e.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return e.getHandlers(t,"save")}static getLoadHandlers(t,r){return e.getHandlers(t,"load",r)}static getHandlers(t,r,o){let n=[];return(r==="load"?e.getInstance().loadRouters:e.getInstance().saveRouters).forEach(i=>{let a=i(t,o);a!==null&&n.push(a)}),n}},Qc=e=>nt.registerSaveRouter(e),tl=e=>nt.registerLoadRouter(e),el=e=>nt.getSaveHandlers(e),rl=(e,t)=>nt.getLoadHandlers(e,t);var Sn="tensorflowjs",Nn=1,Ie="models_store",ge="model_info_store";function ol(){if(!N().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");let e=typeof window>"u"?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function In(e){let t=e.result;t.createObjectStore(Ie,{keyPath:"modelPath"}),t.createObjectStore(ge,{keyPath:"modelPath"})}var qt=class{constructor(t){if(this.indexedDB=ol(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,t)}async load(){return this.databaseAction(this.modelPath)}databaseAction(t,r){return new Promise((o,n)=>{let s=this.indexedDB.open(Sn,Nn);s.onupgradeneeded=()=>In(s),s.onsuccess=()=>{let i=s.result;if(r==null){let a=i.transaction(Ie,"readonly"),p=a.objectStore(Ie).get(this.modelPath);p.onsuccess=()=>{if(p.result==null)return i.close(),n(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));o(p.result.modelArtifacts)},p.onerror=d=>(i.close(),n(p.error)),a.oncomplete=()=>i.close()}else{r.weightData=ct.join(r.weightData);let a=zt(r),c=i.transaction(ge,"readwrite"),p=c.objectStore(ge),d;try{d=p.put({modelPath:this.modelPath,modelArtifactsInfo:a})}catch(g){return n(g)}let f;d.onsuccess=()=>{f=i.transaction(Ie,"readwrite");let g=f.objectStore(Ie),x;try{x=g.put({modelPath:this.modelPath,modelArtifacts:r,modelArtifactsInfo:a})}catch(b){return n(b)}x.onsuccess=()=>o({modelArtifactsInfo:a}),x.onerror=b=>{p=c.objectStore(ge);let E=p.delete(this.modelPath);E.onsuccess=()=>(i.close(),n(x.error)),E.onerror=w=>(i.close(),n(x.error))}},d.onerror=g=>(i.close(),n(d.error)),c.oncomplete=()=>{f==null?i.close():f.oncomplete=()=>i.close()}}},s.onerror=i=>n(s.error)})}};qt.URL_SCHEME="indexeddb://";var nl=e=>N().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(qt.URL_SCHEME)?tm(e.slice(qt.URL_SCHEME.length)):null;nt.registerSaveRouter(nl);nt.registerLoadRouter(nl);function tm(e){return new qt(e)}function em(e){return e.startsWith(qt.URL_SCHEME)?e.slice(qt.URL_SCHEME.length):e}var fo=class{constructor(){this.indexedDB=ol()}async listModels(){return new Promise((t,r)=>{let o=this.indexedDB.open(Sn,Nn);o.onupgradeneeded=()=>In(o),o.onsuccess=()=>{let n=o.result,s=n.transaction(ge,"readonly"),a=s.objectStore(ge).getAll();a.onsuccess=()=>{let c={};for(let p of a.result)c[p.modelPath]=p.modelArtifactsInfo;t(c)},a.onerror=c=>(n.close(),r(a.error)),s.oncomplete=()=>n.close()},o.onerror=n=>r(o.error)})}async removeModel(t){return t=em(t),new Promise((r,o)=>{let n=this.indexedDB.open(Sn,Nn);n.onupgradeneeded=()=>In(n),n.onsuccess=()=>{let s=n.result,i=s.transaction(ge,"readwrite"),a=i.objectStore(ge),c=a.get(t),p;c.onsuccess=()=>{if(c.result==null)return s.close(),o(new Error(`Cannot find model with path '${t}' in IndexedDB.`));{let d=a.delete(t),f=()=>{p=s.transaction(Ie,"readwrite");let x=p.objectStore(Ie).delete(t);x.onsuccess=()=>r(c.result.modelArtifactsInfo),x.onerror=b=>o(c.error)};d.onsuccess=f,d.onerror=g=>(f(),s.close(),o(c.error))}},c.onerror=d=>(s.close(),o(c.error)),i.oncomplete=()=>{p==null?s.close():p.oncomplete=()=>s.close()}},n.onerror=s=>o(n.error)})}};var ee="/",ur="tensorflowjs_models",sl="info",rm="model_topology",om="weight_specs",nm="weight_data",sm="model_metadata";function il(e){return{info:[ur,e,sl].join(ee),topology:[ur,e,rm].join(ee),weightSpecs:[ur,e,om].join(ee),weightData:[ur,e,nm].join(ee),modelMetadata:[ur,e,sm].join(ee)}}function al(e){for(let t of Object.values(e))window.localStorage.removeItem(t)}function im(e){let t=e.split(ee);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(ee)}function am(e){return e.startsWith(Ut.URL_SCHEME)?e.slice(Ut.URL_SCHEME.length):e}var Ut=class{constructor(t){if(!N().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=il(this.modelPath)}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{let r=JSON.stringify(t.modelTopology),o=JSON.stringify(t.weightSpecs),n=zt(t),s=ct.join(t.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(n)),this.LS.setItem(this.keys.topology,r),this.LS.setItem(this.keys.weightSpecs,o),this.LS.setItem(this.keys.weightData,Xc(s));let i={format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,signature:t.signature!=null?t.signature:void 0,userDefinedMetadata:t.userDefinedMetadata!=null?t.userDefinedMetadata:void 0,modelInitializer:t.modelInitializer!=null?t.modelInitializer:void 0,initializerSignature:t.initializerSignature!=null?t.initializerSignature:void 0,trainingConfig:t.trainingConfig!=null?t.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(i)),{modelArtifactsInfo:n}}catch{throw al(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${n.modelTopologyBytes}, weightSpecsBytes=${n.weightSpecsBytes}, weightDataBytes=${n.weightDataBytes}.`)}}}async load(){let t=JSON.parse(this.LS.getItem(this.keys.info));if(t==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");let r={},o=JSON.parse(this.LS.getItem(this.keys.topology));if(o==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);r.modelTopology=o;let n=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(n==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);r.weightSpecs=n;let s=this.LS.getItem(this.keys.modelMetadata);if(s!=null){let a=JSON.parse(s);r.format=a.format,r.generatedBy=a.generatedBy,r.convertedBy=a.convertedBy,a.signature!=null&&(r.signature=a.signature),a.userDefinedMetadata!=null&&(r.userDefinedMetadata=a.userDefinedMetadata),a.modelInitializer!=null&&(r.modelInitializer=a.modelInitializer),a.initializerSignature!=null&&(r.initializerSignature=a.initializerSignature),a.trainingConfig!=null&&(r.trainingConfig=a.trainingConfig)}let i=this.LS.getItem(this.keys.weightData);if(i==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return r.weightData=Yc(i),r}};Ut.URL_SCHEME="localstorage://";var cl=e=>N().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Ut.URL_SCHEME)?cm(e.slice(Ut.URL_SCHEME.length)):null;nt.registerSaveRouter(cl);nt.registerLoadRouter(cl);function cm(e){return new Ut(e)}var ho=class{constructor(){h(N().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),h(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){let t={},r=ur+ee,o=ee+sl;for(let n=0;n<this.LS.length;++n){let s=this.LS.key(n);if(s.startsWith(r)&&s.endsWith(o)){let i=im(s);t[i]=JSON.parse(this.LS.getItem(s))}}return t}async removeModel(t){t=am(t);let r=il(t);if(this.LS.getItem(r.info)==null)throw new Error(`Cannot find model at path '${t}'`);let o=JSON.parse(this.LS.getItem(r.info));return al(r),o}};var mr="://",Gt=class e{constructor(){this.managers={}}static getInstance(){return e.instance==null&&(e.instance=new e),e.instance}static registerManager(t,r){h(t!=null,()=>"scheme must not be undefined or null."),t.endsWith(mr)&&(t=t.slice(0,t.indexOf(mr))),h(t.length>0,()=>"scheme must not be an empty string.");let o=e.getInstance();h(o.managers[t]==null,()=>`A model store manager is already registered for scheme '${t}'.`),o.managers[t]=r}static getManager(t){let r=e.getInstance().managers[t];if(r==null)throw new Error(`Cannot find model manager for scheme '${t}'`);return r}static getSchemes(){return Object.keys(e.getInstance().managers)}};function go(e){if(e.indexOf(mr)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${Gt.getSchemes().join(",")}`);return{scheme:e.split(mr)[0],path:e.split(mr)[1]}}async function ll(e,t,r=!1){h(e!==t,()=>`Old path and new path are the same: '${e}'`);let o=nt.getLoadHandlers(e);h(o.length>0,()=>`Copying failed because no load handler is found for source URL ${e}.`),h(o.length<2,()=>`Copying failed because more than one (${o.length}) load handlers for source URL ${e}.`);let n=o[0],s=nt.getSaveHandlers(t);h(s.length>0,()=>`Copying failed because no save handler is found for destination URL ${t}.`),h(s.length<2,()=>`Copying failed because more than one (${o.length}) save handlers for destination URL ${t}.`);let i=s[0],a=go(e).scheme,c=go(e).path,p=a===go(e).scheme,d=await n.load();r&&p&&await Gt.getManager(a).removeModel(c);let f=await i.save(d);return r&&!p&&await Gt.getManager(a).removeModel(c),f.modelArtifactsInfo}async function pl(){let e=Gt.getSchemes(),t={};for(let r of e){let o=await Gt.getManager(r).listModels();for(let n in o){let s=r+mr+n;t[s]=o[n]}}return t}async function ul(e){let t=go(e);return Gt.getManager(t.scheme).removeModel(t.path)}async function ml(e,t){return ll(e,t,!1)}async function fl(e,t){return ll(e,t,!0)}var An=class{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(t,r){return fetch(t,r)}now(){return performance.now()}encode(t,r){if(r!=="utf-8"&&r!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${r}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)}decode(t,r){return new TextDecoder(r).decode(t)}setTimeoutCustom(t,r){if(typeof window>"u"||!N().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(t,r);return}this.functionRefs.push(t),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},r),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",o=>{if(o.source===window&&o.data.name===this.messageName){o.stopPropagation();let n=this.functionRefs[o.data.index];n(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(t){return no(t)}};if(N().get("IS_BROWSER")){N().setPlatform("browser",new An);try{Gt.registerManager(Ut.URL_SCHEME,new ho)}catch{}try{Gt.registerManager(qt.URL_SCHEME,new fo)}catch{}}var lm={importFetch:()=>As("node-fetch")},Dn;var Mn=class{constructor(){this.util=As("util"),this.textEncoder=new this.util.TextEncoder}fetch(t,r){return N().global.fetch!=null?N().global.fetch(t,r):(Dn==null&&(Dn=lm.importFetch()),Dn(t,r))}now(){let t=__Process$.hrtime();return t[0]*1e3+t[1]/1e6}encode(t,r){if(r!=="utf-8"&&r!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${r}`);return this.textEncoder.encode(t)}decode(t,r){return t.length===0?"":new this.util.TextDecoder(r).decode(t)}isTypedArray(t){return this.util.types.isFloat32Array(t)||this.util.types.isInt32Array(t)||this.util.types.isUint8Array(t)||this.util.types.isUint8ClampedArray(t)}};N().get("IS_NODE")&&!N().get("IS_BROWSER")&&N().setPlatform("node",new Mn);function Et(e,t="float32",r){return t=t||"float32",X(e),new he(e,t,r)}function pm(e,t){let r=l(e,"x","cast");if(!jo(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if(t==="string"&&r.dtype!=="string"||t!=="string"&&r.dtype==="string")throw new Error("Only strings can be casted to strings");let o={x:r},n={dtype:t};return m.runKernel(Qr,o,n)}var G=u({cast_:pm});function um(e){let r={x:l(e,"x","clone","string_or_numeric")};return m.runKernel(to,r)}var Ct=u({clone_:um});function _n(e,t=!1){console.log(e.toString(t))}yn();var mm={buffer:Et,cast:G,clone:Ct,print:_n};Fc(mm);function fm(e,t){let r=l(e,"a","add"),o=l(t,"b","add");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(Zr,n)}var S=u({add_:fm});function hm(e,t){let r=l(e,"a","floorDiv"),o=l(t,"b","floorDiv");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(Gi,n)}var Rn=u({floorDiv_:hm});function dm(e,t){let r=l(e,"a","div"),o=l(t,"b","div");if([r,o]=R(r,o),r.dtype==="int32"&&o.dtype==="int32")return Rn(r,o);let n={a:r,b:o},s={};return m.runKernel($i,n,s)}var P=u({div_:dm});function gm(e,t){let r=l(e,"a","mul"),o=l(t,"b","mul");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(ha,n)}var T=u({mul_:gm});function xm(e){let t=l(e,"x","abs");if(t.dtype==="complex64"){let r={x:t};return m.runKernel(si,r)}else{let r={x:t};return m.runKernel(Gs,r)}}var lt=u({abs_:xm});function bm(e){let r={x:l(e,"x","acos")};return m.runKernel(Cs,r)}var ym=u({acos_:bm});function wm(e){let r={x:l(e,"x","acosh")};return m.runKernel(Ps,r)}var Em=u({acosh_:wm});function Tm(e){h(Array.isArray(e),()=>"The argument passed to tf.addN() must be a list of tensors"),h(e.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`);let t=e.map((n,s)=>l(n,`tensors${s}`,"addN")),r=t[0];t.forEach(n=>{if(n.dtype!==r.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),t.forEach(n=>{if(!bt(n.shape,r.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});let o=t;return m.runKernel(Os,o)}var vm=u({addN_:Tm});function $m(e,t=null,r=!1){let n={x:l(e,"x","all","bool")},s={axis:t,keepDims:r};return m.runKernel(Ls,n,s)}var km=u({all_:$m});function Sm(e,t=null,r=!1){let n={x:l(e,"x","any","bool")},s={axis:t,keepDims:r};return m.runKernel(Ws,n,s)}var Nm=u({any_:Sm});function Im(e,t=0){let o={x:l(e,"x","argMax")},n={axis:t};return m.runKernel(zs,o,n)}var Am=u({argMax_:Im});function Dm(e,t=0){let o={x:l(e,"x","argMin")},n={axis:t};return m.runKernel(qs,o,n)}var Mm=u({argMin_:Dm});function _m(e){let r={x:l(e,"x","asin")};return m.runKernel(Us,r)}var Rm=u({asin_:_m});function Bm(e){let r={x:l(e,"x","asinh")};return m.runKernel(Ks,r)}var Fm=u({asinh_:Bm});function Gm(e){let r={x:l(e,"x","atan")};return m.runKernel(Vs,r)}var Cm=u({atan_:Gm});function Pm(e,t){let r=l(e,"a","atan2"),o=l(t,"b","atan2");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(js,n)}var Om=u({atan2_:Pm});function Lm(e){let r={x:l(e,"x","atanh")};return m.runKernel(Hs,r)}var Wm=u({atanh_:Lm});function zm(e,t,r,o,n="NHWC",s){let i=e[3],a=[...t,i],c=dl(n);return De(e,a,r,s,o,null,null,c)}function Fn(e,t,r,o,n,s,i="channelsLast"){let[a,c]=Fr(t),p;if(i==="channelsLast")p=[a,c,e[3],e[3]];else if(i==="channelsFirst")p=[a,c,e[1],e[1]];else throw new Error(`Unknown dataFormat ${i}`);return De(e,p,r,o,n,s,!1,i)}function qm(e,t,r,o,n,s,i="NDHWC"){let[a,c,p]=Bn(t),d,f;if(i==="NDHWC")f="channelsLast",d=[a,c,p,e[4],e[4]];else if(i==="NCDHW")f="channelsFirst",d=[a,c,p,e[1],e[1]];else throw new Error(`Unknown dataFormat ${i}`);return hl(e,d,r,o,n,!1,f,s)}function De(e,t,r,o,n,s,i=!1,a="channelsLast"){let[c,p,d,f]=[-1,-1,-1,-1];if(a==="channelsLast")[c,p,d,f]=e;else if(a==="channelsFirst")[c,f,p,d]=e;else throw new Error(`Unknown dataFormat ${a}`);let[g,x,,b]=t,[E,w]=Fr(r),[$,_]=Fr(o),v=fr(g,$),I=fr(x,_),{padInfo:M,outHeight:D,outWidth:U}=Vm(n,p,d,E,w,v,I,s,a),q=i?b*f:b,C;return a==="channelsFirst"?C=[c,q,D,U]:a==="channelsLast"&&(C=[c,D,U,q]),{batchSize:c,dataFormat:a,inHeight:p,inWidth:d,inChannels:f,outHeight:D,outWidth:U,outChannels:q,padInfo:M,strideHeight:E,strideWidth:w,filterHeight:g,filterWidth:x,effectiveFilterHeight:v,effectiveFilterWidth:I,dilationHeight:$,dilationWidth:_,inShape:e,outShape:C,filterShape:t}}function hl(e,t,r,o,n,s=!1,i="channelsLast",a){let[c,p,d,f,g]=[-1,-1,-1,-1,-1];if(i==="channelsLast")[c,p,d,f,g]=e;else if(i==="channelsFirst")[c,g,p,d,f]=e;else throw new Error(`Unknown dataFormat ${i}`);let[x,b,E,,w]=t,[$,_,v]=Bn(r),[I,M,D]=Bn(o),U=fr(x,I),q=fr(b,M),C=fr(E,D),{padInfo:V,outDepth:K,outHeight:ot,outWidth:ft}=Hm(n,p,d,f,$,_,v,U,q,C,a),gt=s?w*g:w,kt;return i==="channelsFirst"?kt=[c,gt,K,ot,ft]:i==="channelsLast"&&(kt=[c,K,ot,ft,gt]),{batchSize:c,dataFormat:i,inDepth:p,inHeight:d,inWidth:f,inChannels:g,outDepth:K,outHeight:ot,outWidth:ft,outChannels:gt,padInfo:V,strideDepth:$,strideHeight:_,strideWidth:v,filterDepth:x,filterHeight:b,filterWidth:E,effectiveFilterDepth:U,effectiveFilterHeight:q,effectiveFilterWidth:C,dilationDepth:I,dilationHeight:M,dilationWidth:D,inShape:e,outShape:kt,filterShape:t}}function Um(e,t,r,o,n){o==null&&(o=Gn(e,t,r));let s=e[0],i=e[1],a=Gr((s-t+2*o)/r+1,n),c=Gr((i-t+2*o)/r+1,n);return[a,c]}function Km(e,t,r,o,n,s){n==null&&(n=Gn(e,t[0],o[0]));let i=[0,0,0,r];for(let a=0;a<3;a++)e[a]+2*n>=t[a]&&(i[a]=Gr((e[a]-t[a]+2*n)/o[a]+1,s));return i}function Gn(e,t,r,o=1){let n=fr(t,o);return Math.floor((e[0]*(r-1)-r+n)/2)}function Fr(e){return typeof e=="number"?[e,e,e]:e.length===2?[e[0],e[1],1]:e}function Bn(e){return typeof e=="number"?[e,e,e]:e}function fr(e,t){return t<=1?e:e+(e-1)*(t-1)}function Vm(e,t,r,o,n,s,i,a,c){let p,d,f;if(typeof e=="number"){p={top:e,bottom:e,left:e,right:e,type:e===0?"VALID":"NUMBER"};let x=Um([t,r],s,o,e,a);d=x[0],f=x[1]}else if(e==="same"){d=Math.ceil(t/o),f=Math.ceil(r/n);let g=Math.max(0,(d-1)*o+s-t),x=Math.max(0,(f-1)*n+i-r),b=Math.floor(g/2),E=g-b,w=Math.floor(x/2),$=x-w;p={top:b,bottom:E,left:w,right:$,type:"SAME"}}else if(e==="valid")p={top:0,bottom:0,left:0,right:0,type:"VALID"},d=Math.ceil((t-s+1)/o),f=Math.ceil((r-i+1)/n);else if(typeof e=="object"){let g=c==="channelsLast"?e[1][0]:e[2][0],x=c==="channelsLast"?e[1][1]:e[2][1],b=c==="channelsLast"?e[2][0]:e[3][0],E=c==="channelsLast"?e[2][1]:e[3][1];p={top:g,bottom:x,left:b,right:E,type:g===0&&x===0&&b===0&&E===0?"VALID":"EXPLICIT"},d=Gr((t-s+g+x)/o+1,a),f=Gr((r-i+b+E)/n+1,a)}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:p,outHeight:d,outWidth:f}}function Hm(e,t,r,o,n,s,i,a,c,p,d){let f,g,x,b;if(e==="valid"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e,type:e===0?"VALID":"NUMBER"};let w=Km([t,r,o,1],[a,c,p],1,[n,s,i],e,d);g=w[0],x=w[1],b=w[2]}else if(e==="same"){g=Math.ceil(t/n),x=Math.ceil(r/s),b=Math.ceil(o/i);let E=(g-1)*n+a-t,w=(x-1)*s+c-r,$=(b-1)*i+p-o,_=Math.floor(E/2),v=E-_,I=Math.floor(w/2),M=w-I,D=Math.floor($/2),U=$-D;f={top:I,bottom:M,left:D,right:U,front:_,back:v,type:"SAME"}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:g,outHeight:x,outWidth:b}}function Gr(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function Ae(e){let[t,r,o]=Fr(e);return t===1&&r===1&&o===1}function ht(e,t){return Ae(e)||Ae(t)}function Kt(e){return Fr(e).every(t=>t>0)}function dl(e){if(e==="NHWC")return"channelsLast";if(e==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}function tt(e,t,r){if(r!=null){if(typeof t=="string")throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${r} but got pad ${t}.`);if(typeof t=="number")h(Xt(t),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${r} but got pad ${t}.`);else if(typeof t=="object")t.forEach(o=>{o.forEach(n=>{h(Xt(n),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${r} but got pad ${n}.`)})});else throw Error(`Error in ${e}: Unknown padding parameter: ${t}`)}}function jm(e,t){let o={x:l(e,"x","reshape","string_or_numeric")},n={shape:t};return m.runKernel(Ba,o,n)}var y=u({reshape_:jm});function Jm(e,t,r,o,n){let s=l(e,"x","avgPool","float32"),i=1;h(ht(r,i),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${i}'`);let a=s,c=!1;s.rank===3&&(c=!0,a=y(s,[1,s.shape[0],s.shape[1],s.shape[2]])),h(a.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${a.rank}.`),tt("avgPool",o,n);let p={x:a},d={filterSize:t,strides:r,pad:o,dimRoundingMode:n},f=m.runKernel(Js,p,d);return f=G(f,s.dtype),c?y(f,[f.shape[1],f.shape[2],f.shape[3]]):f}var Cn=u({avgPool_:Jm});function Xm(e,t,r,o,n,s="NDHWC"){let i=l(e,"x","avgPool3d","float32"),a=i,c=!1;i.rank===4&&(c=!0,a=y(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),h(a.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${a.rank}.`),h(s==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),h(typeof r=="number"&&r>0||Array.isArray(r)&&r[0]>0&&r[1]>0&&r[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${r}'`),tt("avgPool3d",o,n);let p={x:a},d={filterSize:t,strides:r,pad:o,dimRoundingMode:n,dataFormat:s},f=m.runKernel(Xs,p,d);return f=G(f,a.dtype),c?y(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}var Ym=u({avgPool3d_:Xm});function Zm(e,t=0){h(e.length>=1,()=>"Pass at least one tensor to concat");let r=Zt(e,"tensors","concat","string_or_numeric");if(r[0].dtype==="complex64"&&r.forEach(s=>{if(s.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${s.dtype}. `)}),r.length===1)return Ct(r[0]);let o=r,n={axis:t};return m.runKernel(ii,o,n)}var et=u({concat_:Zm});function Qm(e,t,r=!1,o=!1){let n=l(e,"a","matMul"),s=l(t,"b","matMul");[n,s]=R(n,s);let i={a:n,b:s},a={transposeA:r,transposeB:o};return m.runKernel(Ys,i,a)}var O=u({matMul_:Qm});function tf(e){let r={x:l(e,"x","sigmoid","float32")};return m.runKernel(Xa,r)}var re=u({sigmoid_:tf});function ef(e,t,r){let o=l(e,"x","slice","string_or_numeric");if(o.rank===0)throw new Error("Slicing scalar is not possible");let n={x:o},s={begin:t,size:r};return m.runKernel(Va,n,s)}var W=u({slice_:ef});function rf(e){let r={x:l(e,"x","tanh","float32")};return m.runKernel(gc,r)}var xo=u({tanh_:rf});function of(e,t,r,o,n,s){let i=l(e,"forgetBias","basicLSTMCell"),a=l(t,"lstmKernel","basicLSTMCell"),c=l(r,"lstmBias","basicLSTMCell"),p=l(o,"data","basicLSTMCell"),d=l(n,"c","basicLSTMCell"),f=l(s,"h","basicLSTMCell"),g=et([p,f],1),x=O(g,a),b=S(x,c),E=b.shape[0],w=b.shape[1]/4,$=[E,w],_=W(b,[0,0],$),v=W(b,[0,w],$),I=W(b,[0,w*2],$),M=W(b,[0,w*3],$),D=S(T(re(_),xo(v)),T(d,re(S(i,I)))),U=T(xo(D),re(M));return[D,U]}var nf=u({basicLSTMCell_:of});function sf(e,t,r){let o=l(e,"x","batchToSpaceND"),n=t.reduce((a,c)=>a*c);h(o.rank>=1+t.length,()=>`input rank is ${o.rank} but should be > than blockShape.length ${t.length}`),h(r.length===t.length,()=>`crops.length is ${r.length} but should be equal to blockShape.length  ${t.length}`),h(o.shape[0]%n===0,()=>`input tensor batch is ${o.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${n}`);let s={x:o},i={blockShape:t,crops:r};return m.runKernel(Zs,s,i)}var Pn=u({batchToSpaceND_:sf});function gl(e){let t;return e.rank===0||e.rank===1?t=y(e,[1,1,1,e.size]):e.rank===2?t=y(e,[1,1,e.shape[0],e.shape[1]]):e.rank===3?t=y(e,[1,e.shape[0],e.shape[1],e.shape[2]]):t=e,t}function af(e,t,r,o,n,s){s==null&&(s=.001);let i=l(e,"x","batchNorm"),a=l(t,"mean","batchNorm"),c=l(r,"variance","batchNorm"),p;n!=null&&(p=l(n,"scale","batchNorm"));let d;o!=null&&(d=l(o,"offset","batchNorm")),h(a.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),h(d==null||a.rank===d.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),h(p==null||a.rank===p.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let g={x:gl(i),scale:p,offset:d,mean:a,variance:c},x={varianceEpsilon:s},b=m.runKernel(Ci,g,x);return y(b,i.shape)}var Me=u({batchNorm_:af});function cf(e,t,r,o,n,s){let i=l(e,"x","batchNorm"),a=l(t,"mean","batchNorm"),c=l(r,"variance","batchNorm"),p;n!=null&&(p=l(n,"scale","batchNorm"));let d;return o!=null&&(d=l(o,"offset","batchNorm")),h(i.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${i.rank}.`),h(a.rank===2||a.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${a.rank}.`),h(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),p!=null&&h(p.rank===2||p.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${p.rank}.`),d!=null&&h(d.rank===2||d.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${d.rank}.`),Me(i,a,c,d,p,s)}var lf=u({batchNorm2d_:cf});function pf(e,t,r,o,n,s){let i=l(e,"x","batchNorm"),a=l(t,"mean","batchNorm"),c=l(r,"variance","batchNorm"),p;n!=null&&(p=l(n,"scale","batchNorm"));let d;return o!=null&&(d=l(o,"offset","batchNorm")),h(i.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${i.rank}.`),h(a.rank===3||a.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${a.rank}.`),h(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),p!=null&&h(p.rank===3||p.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${p.rank}.`),d!=null&&h(d.rank===3||d.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${d.rank}.`),Me(i,a,c,d,p,s)}var uf=u({batchNorm3d_:pf});function mf(e,t,r,o,n,s){let i=l(e,"x","batchNorm"),a=l(t,"mean","batchNorm"),c=l(r,"variance","batchNorm"),p;n!=null&&(p=l(n,"scale","batchNorm"));let d;return o!=null&&(d=l(o,"offset","batchNorm")),h(i.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${i.rank}.`),h(a.rank===4||a.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${a.rank}.`),h(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),p!=null&&h(p.rank===4||p.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${p.rank}.`),d!=null&&h(d.rank===4||d.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${d.rank}.`),Me(i,a,c,d,p,s)}var ff=u({batchNorm4d_:mf});function hf(e,t,r){let o=l(e,"x","bincount"),n=l(t,"weights","bincount");h(o.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${o.dtype}`),h(r>=0,()=>`size must be non-negative, but got ${r}.`),h(n.size===o.size||n.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${o.shape}, weights shape: ${n.shape}.`);let s={x:o,weights:n},i={size:r};return m.runKernel(Qs,s,i)}var On=u({bincount_:hf});function df(e,t){let r=l(e,"x","bitwiseAnd"),o=l(t,"y","bitwiseAnd");if(!bt(r.shape,o.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${r.shape}, y: ${o.shape}`);if(r.dtype!=="int32"||o.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${r.dtype} and type of y: ${o.dtype}`);let n={a:r,b:o};return m.runKernel(ti,n)}var gf=u({bitwiseAnd_:df});function xf(e,t){let r=l(e,"s0","broadcastArgs","int32"),o=l(t,"s1","broadcastArgs","int32");if(r.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${r.rank}`);if(o.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${o.rank}`);let n={s0:r,s1:o};return m.runKernel(ei,n)}var bf=u({broadcastArgs_:xf});function yf(e,t){let r=l(e,"broadcastTo","x"),o=r.shape;if(X(t),t.length<r.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${r.rank}.`);if(t.length>r.rank){let p=r.shape.slice();for(;p.length<t.length;)p.unshift(1);r=y(r,p)}let n=r.shape,s=Array.from(t);for(let p=t.length-1;p>=0;p--)if(n[p]===t[p])s[p]=1;else if(r.shape[p]!==1)throw new Error(`broadcastTo(): [${o}] cannot be broadcast to [${t}].`);if(s.map((p,d)=>p>1?d:-1).filter(p=>p>=0).length===0)return Ct(r);let a={x:r},c={reps:s};return m.runKernel(eo,a,c)}var Cr=u({broadcastTo_:yf});function wf(e){let r={x:l(e,"x","ceil","float32")};return m.runKernel(ri,r)}var Ef=u({ceil_:wf});function oe(e,t,r){X(e),r=r||ue(t);let o={shape:e,value:t,dtype:r};return m.runKernel(Ri,{},o)}function Tf(e,t,r){let o=l(e,"x","clipByValue");if(h(t<=r,()=>`Error in clip: min (${t}) must be less than or equal to max (${r}).`),t===r)return oe(o.shape,t,o.dtype);let n={x:o},s={clipValueMin:t,clipValueMax:r};return m.runKernel(oi,n,s)}var vf=u({clipByValue_:Tf});function $f(e){return et(e,0)}var kf=u({concat1d_:$f});function Sf(e,t){return et(e,t)}var Nf=u({concat2d_:Sf});function If(e,t){return et(e,t)}var Af=u({concat3d_:If});function Df(e,t){return et(e,t)}var Mf=u({concat4d_:Df});function _f(e,t,r,o,n="NHWC",s=[1,1],i){let a=l(e,"x","conv2d","float32"),c=l(t,"filter","conv2d","float32"),p=a,d=!1;a.rank===3&&(d=!0,p=y(a,[1,a.shape[0],a.shape[1],a.shape[2]])),h(p.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${p.rank}.`),h(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),tt("conv2d",o,i);let f=n==="NHWC"?p.shape[3]:p.shape[1];h(f===c.shape[2],()=>`Error in conv2d: depth of input (${f}) must match input depth for filter ${c.shape[2]}.`),h(ht(r,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${r} and dilations '${s}'`),h(Kt(s),()=>"Error in conv2D: Dilated rates should be larger than 0."),h(Kt(r),()=>"Error in conv2D: Strides should be larger than 0.");let g={x:p,filter:c},x={strides:r,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i},b=m.runKernel(ai,g,x);return d?y(b,[b.shape[1],b.shape[2],b.shape[3]]):b}var _e=u({conv2d_:_f});function Rf(e,t,r,o,n="NWC",s=1,i){let a=l(e,"x","conv1d"),c=l(t,"filter","conv1d"),p=a,d=!1;a.rank===2&&(d=!0,p=y(a,[1,a.shape[0],a.shape[1]])),h(p.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${p.rank}.`),h(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),tt("conv1d",o,i),h(p.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${p.shape[2]}) must match input depth for filter ${c.shape[1]}.`),h(ht(r,s),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${r} and dilation '${s}'`),h(Kt(s),()=>"Error in conv1D: Dilated rates should be larger than 0."),h(Kt(r),()=>"Error in conv1D: Stride should be larger than 0."),h(n==="NWC",()=>`Error in conv1d: got dataFormat of ${n} but only NWC is currently supported.`);let f=y(c,[1,c.shape[0],c.shape[1],c.shape[2]]),g=y(p,[p.shape[0],1,p.shape[1],p.shape[2]]),w=_e(g,f,[1,r],o,"NHWC",[1,s],i);return d?y(w,[w.shape[2],w.shape[3]]):y(w,[w.shape[0],w.shape[2],w.shape[3]])}var Bf=u({conv1d_:Rf});function Ff(e,t,r,o,n,s="NHWC",i){h(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let a=e,c=t,p=!1;t.rank===3&&(p=!0,c=y(t,[1,t.shape[0],t.shape[1],t.shape[2]]),a=[1,e[0],e[1],e[2]]),h(a.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${a.length}.`),h(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),h(r.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${r.rank}`);let d=s==="NHWC"?a[3]:a[1],f=s==="NHWC"?c.shape[3]:c.shape[1];h(d===r.shape[2],()=>`Error in conv2dDerInput: depth of input (${d}) must match input depth for filter ${r.shape[2]}.`),h(f===r.shape[3],()=>`Error in conv2dDerInput: depth of output (${f}) must match output depth for filter ${r.shape[3]}.`),tt("conv2dDerInput",n,i);let g={dy:c,filter:r},x={strides:o,pad:n,dataFormat:s,dimRoundingMode:i,inputShape:a},b=m.runKernel(li,g,x);return p?y(b,[b.shape[1],b.shape[2],b.shape[3]]):b}var bo=u({conv2DBackpropInput_:Ff});function Gf(e,t,r,o,n,s){let i=l(e,"x","conv2dTranspose"),a=l(t,"filter","conv2dTranspose");return bo(r,i,a,o,n,"NHWC",s)}var Cf=u({conv2dTranspose_:Gf});function Pf(e,t,r,o,n="NDHWC",s=[1,1,1]){let i=l(e,"x","conv3d"),a=l(t,"filter","conv3d"),c=i,p=!1;i.rank===4&&(p=!0,c=y(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),h(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),h(a.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${a.rank}.`),h(c.shape[4]===a.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${a.shape[3]}.`),h(ht(r,s),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${r} and dilations '${s}'`),h(n==="NDHWC",()=>`Error in conv3d: got dataFormat of ${n} but only NDHWC is currently supported.`),h(Kt(s),()=>"Error in conv3D: Dilated rates should be larger than 0."),h(Kt(r),()=>"Error in conv3D: Strides should be larger than 0.");let d={x:c,filter:a},f={strides:r,pad:o,dataFormat:n,dilations:s},g=m.runKernel(pi,d,f);return p?y(g,[g.shape[1],g.shape[2],g.shape[3],g.shape[4]]):g}var Of=u({conv3d_:Pf});function Lf(e,t,r,o,n){h(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let s=e,i=t,a=!1;t.rank===4&&(a=!0,i=y(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),s=[1,e[0],e[1],e[2],e[3]]);let c=s[4],p=i.shape[4];h(s.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${s.length}.`),h(i.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${i.rank}`),h(r.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${r.rank}`),h(c===r.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${r.shape[3]}.`),h(p===r.shape[4],()=>`Error in conv3dDerInput: depth of output (${p}) must match output depth for filter ${r.shape[4]}.`);let d={dy:i,filter:r},f={pad:n,strides:o,inputShape:s},g=m.runKernel(ui,d,f);return a?y(g,[g.shape[1],g.shape[2],g.shape[3],g.shape[4]]):g}var xl=u({conv3DBackpropInput_:Lf});function Wf(e,t,r,o,n){let s=l(e,"x","conv3dTranspose"),i=l(t,"filter","conv3dTranspose");return xl(r,s,i,o,n)}var zf=u({conv3dTranspose_:Wf});function qf(e){let r={x:l(e,"x","cos","float32")};return m.runKernel(mi,r)}var Uf=u({cos_:qf});function Kf(e){let r={x:l(e,"x","cosh","float32")};return m.runKernel(fi,r)}var Vf=u({cosh_:Kf});function Hf(e,t=0,r=!1,o=!1){let s={x:l(e,"x","cumprod")},i={axis:t,exclusive:r,reverse:o};return m.runKernel(hi,s,i)}var jf=u({cumprod_:Hf});function Jf(e,t=0,r=!1,o=!1){let s={x:l(e,"x","cumsum")},i={axis:t,exclusive:r,reverse:o};return m.runKernel(di,s,i)}var Xf=u({cumsum_:Jf});function Yf(e,t,r,o=!1){let n=l(e,"x","denseBincount"),s=l(t,"weights","denseBincount");h(n.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${n.dtype}`),h(n.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${n.rank}.`),h(r>=0,()=>`size must be non-negative, but got ${r}.`),h(s.size===n.size||s.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${n.shape}, weights shape: ${s.shape}.`);let i={x:n,weights:s},a={size:r,binaryOutput:o};return m.runKernel(xi,i,a)}var Zf=u({denseBincount_:Yf});function Qf(e,t,r="NHWC"){let o=l(e,"x","depthToSpace","float32"),n=r==="NHWC"?o.shape[1]:o.shape[2],s=r==="NHWC"?o.shape[2]:o.shape[3],i=r==="NHWC"?o.shape[3]:o.shape[1];h(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),h(n*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${n} and ${t}  for depthToSpace with input shape
    ${o.shape}`),h(s*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${t} for depthToSpace with input shape
        ${o.shape}`),h(i%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${i} for depthToSpace with input shape ${o.shape}`);let a={x:o},c={blockSize:t,dataFormat:r};return m.runKernel(bi,a,c)}var th=u({depthToSpace_:Qf});function eh(e,t,r,o,n="NHWC",s=[1,1],i){let a=l(e,"x","depthwiseConv2d","float32"),c=l(t,"filter","depthwiseConv2d","float32"),p=a,d=!1;a.rank===3&&(d=!0,p=y(a,[1,a.shape[0],a.shape[1],a.shape[2]])),h(p.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${p.rank}.`),h(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);let f=n==="NHWC"?p.shape[3]:p.shape[1];h(f===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${f}) must match the inChannels dimension in filter ${c.shape[2]}.`),tt("depthwiseConv2d",o,i);let g={x:p,filter:c},x={strides:r,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i},b=m.runKernel(yi,g,x);return d?y(b,[b.shape[1],b.shape[2],b.shape[3]]):b}var Pr=u({depthwiseConv2d_:eh});function rh(e){let r={x:l(e,"x","diag")};return m.runKernel(Ti,r)}var oh=u({diag_:rh});function nh(e,t,r,o,n=[1,1],s="NHWC"){let i=l(e,"x","dilation2d"),a=l(t,"filter","dilation2d");h(i.rank===3||i.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${i.rank}.`),h(a.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${a.rank}.`),h(s==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${s}`);let c=i,p=!1;i.rank===3&&(c=y(i,[1,i.shape[0],i.shape[1],i.shape[2]]),p=!0),h(c.shape[3]===a.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${c.shape[3]} vs ${a.shape[2]}`);let d={x:c,filter:a},f={strides:r,pad:o,dilations:n},g=m.runKernel(vi,d,f);return p?y(g,[g.shape[1],g.shape[2],g.shape[3]]):g}var sh=u({dilation2d_:nh});var hr={};xt(hr,{assertAndGetBroadcastShape:()=>L,getBroadcastDims:()=>bl,getReductionAxes:()=>yo});function bl(e,t){let r=e.length,o=[];for(let n=0;n<r;n++){let s=r-1-n,i=e[s]||1;(t[t.length-1-n]||1)>1&&i===1&&o.unshift(s)}return o}function yo(e,t){let r=[];for(let o=0;o<t.length;o++){let n=e[e.length-o-1],s=t.length-o-1,i=t[s];(n==null||n===1&&i>1)&&r.unshift(s)}return r}function L(e,t){let r=Math.max(e.length,t.length),o=new Array(r);for(let n=0;n<r;n++){let s=e[e.length-n-1];s==null&&(s=1);let i=t[t.length-n-1];if(i==null&&(i=1),s===1)o[r-n-1]=i;else if(i===1)o[r-n-1]=s;else if(s!==i){let a=`Operands could not be broadcast together with shapes ${e} and ${t}.`;throw Error(a)}else o[r-n-1]=s}return o}function ih(e,t){let r=l(e,"a","equal","string_or_numeric"),o=l(t,"b","equal","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(Ii,n)}var Ln=u({equal_:ih});function ah(e,t,r){let o=l(t,"a","where"),n=l(r,"b","where"),s=l(e,"condition","where","bool"),i=L(L(s.shape,o.shape),n.shape),a=Cr(s,i),c=Cr(o,i),p=Cr(n,i),d={condition:a,t:c,e:p};return m.runKernel(Ua,d)}var Dt=u({where_:ah});function ch(e){let r={x:l(e,"x","zerosLike")};return m.runKernel(Tc,r)}var st=u({zerosLike_:ch});function lh(e,t){let r=l(e,"a","div"),o=l(t,"b","div");[r,o]=R(r,o);let n=P(r,o),s=st(n),i=Ln(o,s);return Dt(i,s,n)}var ph=u({divNoNan_:lh});function uh(e,t){let r=l(e,"t1","dot"),o=l(t,"t2","dot");h((r.rank===1||r.rank===2)&&(o.rank===1||o.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${r.rank} and ${o.rank}.`);let n=r.rank===1?r.size:r.shape[1],s=o.rank===1?o.size:o.shape[0];if(h(n===s,()=>`Error in dot: inner dimensions of inputs must match, but got ${n} and ${s}.`),r.rank===1&&o.rank===1){let i=y(r,[1,-1]),a=y(o,[-1,1]),c=O(i,a);return y(c,[])}else if(r.rank===1&&o.rank===2){let i=y(r,[1,-1]),a=y(o,[o.shape[0],o.shape[1]]),c=O(i,a);return y(c,[c.size])}else if(r.rank===2&&o.rank===1){let i=y(o,[-1,1]),a=O(r,i);return y(a,[a.size])}else{let i=y(o,[o.shape[0],o.shape[1]]);return O(r,i)}}var mh=u({dot_:uh});function fh(e,...t){let r=t.map((n,s)=>l(n,`tensors${s}`,"einsum")),o={equation:e};return m.runKernel(ki,r,o)}var Re=u({einsum_:fh});function hh(e){let r={x:l(e,"x","elu","float32")};return m.runKernel(Si,r)}var Wn=u({elu_:hh});function dh(e,t){let r=l(e,"x","ensureShape","string_or_numeric");if(!Uo(r.shape,t))throw new Error(`EnsureShape: Shape of tensor ${r.shape} is not compatible with expected shape ${t}`);return e}var gh=u({ensureShape_:dh});function xh(e){let t=l(e,"x","erf");h(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=G(t,"float32"));let r={x:t};return m.runKernel(Ni,r)}var bh=u({erf_:xh});function zn(e,t){for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0}function yl(e,t,r){let o=e.length+t.length,n=[],s=0,i=0;for(let a=0;a<o;a++)r.indexOf(a)===-1?n.push(e[s++]):n.push(t[i++]);return n}function yh(e,t){let r=[],o=e.length;for(let s=0;s<o;s++)t.indexOf(s)===-1&&r.push(e[s]);let n=t.map(s=>e[s]);return[r,n]}function ne(e,t){let r=t.map(o=>1);return yl(e,r,t)}function wh(e,t,r){h(zn(t,r),()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${r} input.`)}function Eh(e,t){if(zn(e,t))return null;let r=[];for(let o=0;o<t;++o)e.indexOf(o)===-1&&r.push(o);return e.forEach(o=>r.push(o)),r}function Th(e){return e.map((t,r)=>[r,t]).sort((t,r)=>t[1]-r[1]).map(t=>t[0])}function vh(e,t){let r=[];for(let o=t-e;o<t;++o)r.push(o);return r}function kh(e,t=null,r=!1){let n={x:l(e,"x","max")},s={reductionIndices:t,keepDims:r};return m.runKernel(oa,n,s)}var se=u({max_:kh});function Sh(e,t=null,r=!1){let n={x:l(e,"x","min")},s={axis:t,keepDims:r};return m.runKernel(la,n,s)}var wo=u({min_:Sh});function Nh(e,t){let r=l(e,"base","pow"),o=l(t,"exp","pow");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel($a,n)}var xe=u({pow_:Nh});function F(e,t){if((Q(e)&&t!=="string"||Array.isArray(e))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&Q(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return wt(e,[],[],t)}function Ih(e){let r={x:l(e,"x","sqrt","float32")};return m.runKernel(Za,r)}var It=u({sqrt_:Ih});function Ah(e){let t=l(e,"x","square"),r={};return m.runKernel("Square",{x:t},r)}var pt=u({square_:Ah});function Dh(e,t=null,r=!1){let o=l(e,"x","sum");o.dtype==="bool"&&(o=G(o,"int32"));let n={x:o},s={axis:t,keepDims:r};return m.runKernel(Qa,n,s)}var z=u({sum_:Dh});function Mh(e,t="euclidean",r=null,o=!1){e=l(e,"x","norm");let n=wl(e,t,r),s=n.shape;if(o){let i=pe(r,e.shape);s=ne(n.shape,i)}return y(n,s)}function wl(e,t,r=null){if(e.rank===0)return lt(e);if(e.rank!==1&&r===null)return wl(y(e,[-1]),t,r);if(e.rank===1||typeof r=="number"||Array.isArray(r)&&r.length===1){if(t===1)return z(lt(e),r);if(t===1/0)return se(lt(e),r);if(t===-1/0)return wo(lt(e),r);if(t==="euclidean"||t===2)return It(z(xe(lt(e),F(2,"int32")),r));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(r)&&r.length===2){if(t===1)return se(z(lt(e),r[0]),r[1]-1);if(t===1/0)return se(z(lt(e),r[1]),r[0]);if(t===-1/0)return wo(z(lt(e),r[1]),r[0]);if(t==="fro"||t==="euclidean")return It(z(pt(e),r));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${r}`)}var dr=u({norm_:Mh});function _h(e,t=null,r=!1){return dr(e,"euclidean",t,r)}var Rh=u({euclideanNorm_:_h});function Bh(e){let r={x:l(e,"x","exp")};return m.runKernel(Ai,r)}var Pt=u({exp_:Bh});function Fh(e,t=0){let r=l(e,"x","expandDims","string_or_numeric");h(t<=r.rank,()=>"Axis must be <= rank of the tensor");let o={input:r},n={dim:t};return m.runKernel(Di,o,n)}var Ht=u({expandDims_:Fh});function Gh(e){let r={x:l(e,"x","expm1")};return m.runKernel(Mi,r)}var Ch=u({expm1_:Gh});function Ph(e,t){let r=l(e,"x","tile","string_or_numeric");h(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of reps ${t}.`);let o={x:r},n={reps:t};return m.runKernel(eo,o,n)}var Be=u({tile_:Ph});function Oh(e,t,r,o="float32"){t==null&&(t=e);let n=Et([e,t],o),s=e<=t?e:t;for(let a=0;a<s;++a)n.set(1,a,a);let i=y(n.toTensor(),[e,t]);if(r==null)return i;if(r.length===1)return Be(Ht(i,0),[r[0],1,1]);if(r.length===2)return Be(Ht(Ht(i,0),0),[r[0],r[1],1,1]);if(r.length===3)return Be(Ht(Ht(Ht(i,0),0),0),[r[0],r[1],r[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${r.length}D.`)}var qn=u({eye_:Oh});function Lh(e){let r={x:l(e,"x","floor","float32")};return m.runKernel(Fi,r)}var Un=u({floor_:Lh});function Wh(e,t,r=0,o=0){let n=l(e,"x","gather"),s=l(t,"indices","gather","int32"),i={x:n,indices:s},a={axis:r,batchDims:o};return m.runKernel(Pi,i,a)}var Kn=u({gather_:Wh});function zh(e,t){let r=l(e,"a","greater","string_or_numeric"),o=l(t,"b","greater","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(Li,n)}var gr=u({greater_:zh});function qh(e,t){let r=l(e,"a","greaterEqual","string_or_numeric"),o=l(t,"b","greaterEqual","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(Wi,n)}var Vn=u({greaterEqual_:qh});function Uh(e){let r={input:l(e,"input","imag")};return m.runKernel(qi,r)}var Fe=u({imag_:Uh});function Kh(e){let r={x:l(e,"x","isFinite")};return m.runKernel(Ui,r)}var Vh=u({isFinite_:Kh});function Hh(e){let r={x:l(e,"x","isInf")};return m.runKernel(Ki,r)}var jh=u({isInf_:Hh});function Jh(e){let r={x:l(e,"x","isNaN")};return m.runKernel(Vi,r)}var Xh=u({isNaN_:Jh});function Yh(e,t=.2){let o={x:l(e,"x","leakyRelu")},n={alpha:t};return m.runKernel(Hi,o,n)}var Hn=u({leakyRelu_:Yh});function Zh(e,t){let r=l(e,"a","less","string_or_numeric"),o=l(t,"b","less","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(ji,n)}var Eo=u({less_:Zh});function Qh(e,t){let r=l(e,"a","lessEqual","string_or_numeric"),o=l(t,"b","lessEqual","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(Ji,n)}var Or=u({lessEqual_:Qh});function td(e,t,r){if(r<=0)throw new Error("The number of values should be positive.");let o={start:e,stop:t,num:r};return m.runKernel(Xi,{},o)}function ed(e,t=5,r=1,o=1,n=.5){let s=l(e,"x","localResponseNormalization");h(s.rank===4||s.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${s.rank}.`),h(Xt(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let i=s,a=!1;s.rank===3&&(a=!0,i=y(s,[1,s.shape[0],s.shape[1],s.shape[2]]));let c={x:i},p={depthRadius:t,bias:r,alpha:o,beta:n},d=m.runKernel(ra,c,p);return a?y(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var rd=u({localResponseNormalization_:ed});function od(e){let r={x:l(e,"x","log","float32")};return m.runKernel(Yi,r)}var be=u({log_:od});function nd(e){let r={x:l(e,"x","log1p")};return m.runKernel(Zi,r)}var jn=u({log1p_:nd});function sd(e){return h(Ot(e),()=>"The f passed in grad(f) must be a function"),(t,r)=>{let o=l(t,"x","tf.grad","string_or_numeric"),n=r!=null?l(r,"dy","tf.grad"):null;return m.tidy(()=>{let{value:s,grads:i}=m.gradients(()=>e(o),[o],n);return n!=null&&j(s.shape,n.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),To(i),i[0]})}}function id(e){return h(Ot(e),()=>"The f passed in grads(f) must be a function"),(t,r)=>{h(Array.isArray(t),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");let o=Zt(t,"args","tf.grads","string_or_numeric"),n=r!=null?l(r,"dy","tf.grads"):null;return m.tidy(()=>{let{value:s,grads:i}=m.gradients(()=>e(...o),o,n);return n!=null&&j(s.shape,n.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),To(i),i})}}function ad(e){return h(Ot(e),()=>"The f passed in valueAndGrad(f) must be a function"),(t,r)=>{h(t instanceof H,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),h(r==null||r instanceof H,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");let{grads:o,value:n}=m.gradients(()=>e(t),[t],r);return To(o),{grad:o[0],value:n}}}function cd(e){return h(Ot(e),()=>"The f passed in valueAndGrads(f) must be a function"),(t,r)=>{h(Array.isArray(t)&&t.every(n=>n instanceof H),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),h(r==null||r instanceof H,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");let o=m.gradients(()=>e(...t),t,r);return r!=null&&j(o.value.shape,r.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),To(o.grads),o}}function Jn(e,t){h(Ot(e),()=>"The f passed in variableGrads(f) must be a function"),h(t==null||Array.isArray(t)&&t.every(p=>p instanceof Yt),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");let r=t!=null;if(!r){t=[];for(let p in m.registeredVariables)t.push(m.registeredVariables[p])}let o=r?t.filter(p=>!p.trainable):null,n=t.length;t=t.filter(p=>p.trainable),h(t.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${n} variables is trainable.`);let s=!0,{value:i,grads:a}=m.gradients(e,t,null,s);h(a.some(p=>p!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),h(i.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${i.rank} tensor`);let c={};return t.forEach((p,d)=>{a[d]!=null&&(c[p.name]=a[d])}),o?.forEach(p=>c[p.name]=null),{value:i,grads:c}}function Tt(e){return m.customGrad(e)}function To(e){if(e.filter(r=>r==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}function ld(e){let r={x:l(e,"x","neg")};return m.runKernel(da,r)}var dt=u({neg_:ld});function pd(e){let r={x:l(e,"x","softplus")};return m.runKernel(Ya,r)}var Xn=u({softplus_:pd});function ud(e){let t=l(e,"x","logSigmoid");return Tt(o=>({value:dt(Xn(dt(o))),gradFunc:i=>T(i,re(dt(o)))}))(t)}var md=u({logSigmoid_:ud});function fd(e,t){let r=l(e,"a","sub"),o=l(t,"b","sub");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(hc,n)}var A=u({sub_:fd});function hd(e,t=-1){let r=l(e,"logits","logSoftmax");if(t===-1&&(t=r.rank-1),t!==r.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${r.rank} and axis was ${t}`);return Tt((n,s)=>{let a=se(n,t,!0),c=A(n,a),p=A(G(c,"float32"),be(z(Pt(c),t,!0)));return s([p]),{value:p,gradFunc:(f,g)=>{let[x]=g,b=!0,E=Pt(x);return A(f,T(z(f,t,b),E))}}})(r)}var dd=u({logSoftmax_:hd});function gd(e,t=null,r=!1){let o=l(e,"x","logSumExp"),n=pe(t,o.shape),s=se(o,n,!0),i=A(o,s),a=Pt(i),c=z(a,n),p=be(c),d=S(y(s,p.shape),p);if(r){let f=ne(d.shape,n);return y(d,f)}return d}var Yn=u({logSumExp_:gd});function xd(e,t){let r=l(e,"a","logicalAnd","bool"),o=l(t,"b","logicalAnd","bool");L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(Qi,n)}var xr=u({logicalAnd_:xd});function bd(e){let r={x:l(e,"x","logicalNot","bool")};return m.runKernel(ta,r)}var Zn=u({logicalNot_:bd});function yd(e,t){let r=l(e,"a","logicalOr","bool"),o=l(t,"b","logicalOr","bool");L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(ea,n)}var Qn=u({logicalOr_:yd});function wd(e,t){let r=l(e,"a","logicalXor","bool"),o=l(t,"b","logicalXor","bool");return L(r.shape,o.shape),xr(Qn(e,t),Zn(xr(e,t)))}var Ed=u({logicalXor_:wd});var vo=2147483648;function Td(e,t,r="left"){let o=l(e,"sortedSequence","searchSorted"),n=l(t,"values","searchSorted"),s=o.shape[o.shape.length-1],i=n.shape[n.shape.length-1],a=y(o,[-1,s]),c=y(n,[-1,i]);if(a.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(a.shape[0]!==c.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(B(c.shape)>=vo)throw new Error(`values tensor size must less than ${vo}`);if(a.shape[1]>=vo)throw new Error(`trailing dim_size must less than ${vo} for int32 output type, was ${a.shape[1]}`);let p={sortedSequence:a,values:c},d={side:r};return m.runKernel(qa,p,d)}var $o=u({searchSorted_:Td});function vd(e,t){return $o(e,t,"left")}function $d(e,t,r,o,n){let s=l(e,"x","maxPool"),i=1,a=s,c=!1;s.rank===3&&(c=!0,a=y(s,[1,s.shape[0],s.shape[1],s.shape[2]])),h(a.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${a.rank}.`),h(ht(r,i),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${i}'`),tt("maxPool",o,n);let p={x:a},d={filterSize:t,strides:r,pad:o,dimRoundingMode:n},f=m.runKernel(sa,p,d);return c?y(f,[f.shape[1],f.shape[2],f.shape[3]]):f}var ts=u({maxPool_:$d});function kd(e,t=[1,1,1],r,o,n,s="NDHWC"){let i=l(e,"x","maxPool3d"),a=i,c=!1;i.rank===4&&(c=!0,a=y(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),h(a.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${a.rank}.`),h(s==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),tt("maxPool3d",o,n);let p={x:a},d={filterSize:t,strides:r,pad:o,dimRoundingMode:n,dataFormat:s},f=m.runKernel(ia,p,d);return c?y(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}var Sd=u({maxPool3d_:kd});function Nd(e,t,r,o,n=!1){let i={x:l(e,"x","maxPoolWithArgmax")},a={filterSize:t,strides:r,pad:o,includeBatchInIndex:n},c=m.runKernel(aa,i,a);return{result:c[0],indexes:c[1]}}var Id=u({maxPoolWithArgmax_:Nd});function Ad(e,t){let r=l(e,"a","maximum"),o=l(t,"b","maximum");[r,o]=R(r,o),r.dtype==="bool"&&(r=G(r,"int32"),o=G(o,"int32")),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(na,n)}var es=u({maximum_:Ad});function Dd(e,t=null,r=!1){let n={x:l(e,"x","mean")},s={axis:t,keepDims:r};return m.runKernel(ca,n,s)}var br=u({mean_:Dd});function ie(e,t="float32"){if(X(e),t==="complex64"){let o=ie(e,"float32"),n=ie(e,"float32");return Nt(o,n)}let r=or(B(e),t);return m.makeTensor(r,e,t)}function ae(e,t="float32"){if(X(e),t==="complex64"){let o=ae(e,"float32"),n=ie(e,"float32");return Nt(o,n)}let r=$r(B(e),t);return m.makeTensor(r,e,t)}function Md(e,t,{indexing:r="xy"}={}){if(r!=="xy"&&r!=="ij")throw new TypeError(`${r} is not a valid third argument to meshgrid`);if(e===void 0)return[];let o=l(e,"x","meshgrid",e instanceof H?e.dtype:"float32");if(t===void 0)return[o];let n=l(t,"y","meshgrid",t instanceof H?t.dtype:"float32"),s=B(o.shape),i=B(n.shape);return r==="xy"?(o=y(o,[1,-1]),n=y(n,[-1,1]),[O(ae([i,1],o.dtype),o),O(n,ae([1,s],n.dtype))]):(o=y(o,[-1,1]),n=y(n,[1,-1]),[O(o,ae([1,i],o.dtype)),O(ae([s,1],n.dtype),n)])}function _d(e,t){let r=l(e,"a","minimum"),o=l(t,"b","minimum");[r,o]=R(r,o),r.dtype==="bool"&&(r=G(r,"int32"),o=G(o,"int32")),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(pa,n)}var yr=u({minimum_:_d});function Rd(e,t,r){h(r==="reflect"||r==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${r}.`);let o=l(e,"x","mirrorPad");if(o.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");h(t.length===o.rank,()=>`Padding doesn't match input. Must be ${o.rank}. Got ${t.length}.`);let n=r==="reflect"?1:0;for(let a=0;a<o.rank;a++)h(t[a].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),h(t[a][0]>=0&&t[a][0]<=o.shape[a]-n&&t[a][1]>=0&&t[a][1]<=o.shape[a]-n,()=>`Padding in dimension ${a} cannot be greater than or equal to ${o.shape[a]-n} or less than 0 for input of shape ${o.shape}`);let s={paddings:t,mode:r},i={x:o};return m.runKernel(ua,i,s)}var Bd=u({mirrorPad_:Rd});function Fd(e,t){let r=l(e,"a","mod"),o=l(t,"b","mod");[r,o]=R(r,o);let n={a:r,b:o};return m.runKernel(ma,n)}var Gd=u({mod_:Fd});function Cd(e,t=null,r=!1){e=l(e,"x","moments");let o=pe(t,e.shape),n=br(e,o,r),s=n.shape;r||(s=ne(n.shape,o));let i=pt(A(G(e,"float32"),y(n,s))),a=br(i,o,r);return{mean:n,variance:a}}var Pd=u({moments_:Cd});function Od(e,t,r,o){let n=l(t,"data","multiRNNCell"),s=Zt(r,"c","multiRNNCell"),i=Zt(o,"h","multiRNNCell"),a=n,c=[];for(let f=0;f<e.length;f++){let g=e[f](a,s[f],i[f]);c.push(g[0]),c.push(g[1]),a=g[1]}let p=[],d=[];for(let f=0;f<c.length;f+=2)p.push(c[f]),d.push(c[f+1]);return[p,d]}var Ld=u({multiRNNCell_:Od});function Wd(e,t,r,o=!1){let n=l(e,"logits","multinomial"),s=n.size,i=n.rank;if(s<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${s}.`);if(i>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${i}`);r=r||Math.random();let c={logits:i===1?y(n,[1,-1]):n},p={numSamples:t,seed:r,normalized:o},d=m.runKernel(fa,c,p);return i===1?y(d,[d.size]):d}var zd=u({multinomial_:Wd});function qd(e,t){let r=l(e,"a","notEqual","string_or_numeric"),o=l(t,"b","notEqual","string_or_numeric");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o};return m.runKernel(ga,n)}var rs=u({notEqual_:qd});function Ud(e,t,r=1,o=0,n="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);let i={indices:l(e,"indices","oneHot","int32")},a={dtype:n,depth:t,onValue:r,offValue:o};return m.runKernel(Ea,i,a)}var ko=u({oneHot_:Ud});function Kd(e){let r={x:l(e,"x","onesLike")};return m.runKernel(wa,r)}var Vd=u({onesLike_:Kd});function Hd(e,t){let r=l(e,"v1","outerProduct"),o=l(t,"v2","outerProduct");h(r.rank===1&&o.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${r.rank} and ${o.rank}.`);let n=y(r,[-1,1]),s=y(o,[1,-1]);return O(n,s)}var jd=u({outerProduct_:Hd});function Jd(e,t,r=0){let o=l(e,"x","pad");if(o.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");let n={paddings:t,constantValue:r},s={x:o};return m.runKernel(va,s,n)}var ce=u({pad_:Jd});function Xd(e,t,r=0){return h(t.length===2,()=>"Invalid number of paddings. Must be length of 2."),ce(e,[t],r)}var Yd=u({pad1d_:Xd});function Zd(e,t,r=0){return h(t.length===2&&t[0].length===2&&t[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),ce(e,t,r)}var Qd=u({pad2d_:Zd});function tg(e,t,r=0){return h(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),ce(e,t,r)}var eg=u({pad3d_:tg});function rg(e,t,r=0){return h(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),ce(e,t,r)}var og=u({pad4d_:rg});function ng(e,t,r){let o=l(e,"x","spaceToBatchND");h(o.rank>=1+t.length,()=>`input rank ${o.rank} should be > than [blockShape] ${t.length}`),h(r.length===t.length,()=>`paddings.shape[0] ${r.length} must be equal to [blockShape] ${t.length}`),h(o.shape.reduce((i,a,c)=>c>0&&c<=t.length?i&&(a+r[c-1][0]+r[c-1][1])%t[c-1]===0:i,!0),()=>`input spatial dimensions ${o.shape.slice(1)} with paddings ${r.toString()} must be divisible by blockShapes ${t.toString()}`);let n={x:o},s={blockShape:t,paddings:r};return m.runKernel(tc,n,s)}var os=u({spaceToBatchND_:ng});function sg(e,t,r,o,n,s,i){n==null&&(n=[1,1]),s==null&&(s=1),o===0&&(o="valid");let a=l(e,"x","maxPool"),c=a,p=!1;a.rank===3&&(p=!0,c=y(a,[1,a.shape[0],a.shape[1],a.shape[2]])),h(ht(s,n),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${s} and dilations '${n}'`);let d=Fn(c.shape,t,s,n,o),f=[d.dilationHeight,d.dilationWidth],g;o==="same"?g=ag([d.filterHeight,d.filterWidth],f):g=[[0,0],[0,0]];let x=f[0]===1&&f[1]===1,[b,E]=ig([d.inHeight,d.inWidth],f,g),w=x?o:"valid",$=x?c:os(c,f,b),v=(r==="avg"?()=>Cn($,t,s,w,i):()=>ts($,t,s,w,i))(),I=x?v:Pn(v,f,E);return p?y(I,[I.shape[1],I.shape[2],I.shape[3]]):I}function ig(e,t,r){let o=r.map(d=>d[0]),n=r.map(d=>d[1]),s=e.concat(o,n),i=t.map((d,f)=>(d-s[f]%d)%d),a=n.map((d,f)=>d+i[f]),c=t.map((d,f)=>[o[f],a[f]]),p=t.map((d,f)=>[0,i[f]]);return[c,p]}function ag(e,t){let o=e.map((i,a)=>i+(i-1)*(t[a]-1)).map(i=>i-1),n=o.map(i=>Math.floor(i/2)),s=o.map((i,a)=>i-n[a]);return o.map((i,a)=>[n[a],s[a]])}var cg=u({pool_:sg});function lg(e,t){let r=l(e,"x","prelu"),o=l(t,"alpha","prelu"),n={x:r,alpha:o};return m.runKernel(ka,n)}var ns=u({prelu_:lg});function pg(e,t=null,r=!1){let o=l(e,"x","prod");o.dtype==="bool"&&(o=G(o,"int32"));let n={x:o},s={axis:t,keepDims:r};return m.runKernel(Sa,n,s)}var ug=u({prod_:pg});function mg(e,t,r,o){let n=e.map((d,f)=>l(d,`tensors${f}`,"raggedGather","int32")),s=l(t,"paramsDenseValues","raggedGather"),i=l(r,"indices","raggedGather","int32"),a={paramsNestedSplits:n,paramsDenseValues:s,indices:i},c={outputRaggedRank:o},p=m.runKernel(Na,a,c);return{outputNestedSplits:p.slice(0,p.length-1),outputDenseValues:p[p.length-1]}}var fg=u({raggedGather_:mg});function hg(e,t,r){let o=l(e,"starts","raggedRange"),n=l(t,"limits","raggedRange",o.dtype),s=l(r,"deltas","raggedRange",o.dtype),i={starts:o,limits:n,deltas:s},a=m.runKernel(Ia,i);return{rtNestedSplits:a[0],rtDenseValues:a[1]}}var dg=u({raggedRange_:hg});function gg(e,t,r,o,n){let s=l(e,"shape","raggedTensorToTensor","int32"),i=l(t,"values","raggedTensorToTensor"),a=l(r,"defaultValue","raggedTensorToTensor",i.dtype),c=o.map((f,g)=>l(f,`tensors${g}`,"raggedTensorToTensor","int32")),p={shape:s,values:i,defaultValue:a,rowPartitionTensors:c},d={rowPartitionTypes:n};return m.runKernel(Aa,p,d)}var xg=u({raggedTensorToTensor_:gg});function bg(e,t,r){X(e);let o=B(e),n=null;if(r==null||r==="float32")n=new Float32Array(o);else if(r==="int32")n=new Int32Array(o);else if(r==="bool")n=new Uint8Array(o);else throw new Error(`Unknown data type ${r}`);for(let s=0;s<o;s++)n[s]=t();return m.makeTensor(n,e,r)}var yg=u({rand_:bg});import*as Io from"/v135/seedrandom@3.0.5/denonext/seedrandom.mjs";var vl={};xt(vl,{TEST_EPSILON_FLOAT16:()=>El,createVideoElement:()=>Ng,encodeStrings:()=>Tl,expectArrayBuffersEqual:()=>Sg,expectArraysClose:()=>Eg,expectArraysEqual:()=>vg,expectNumbersClose:()=>$g,expectPromiseToFail:()=>Tg,expectValuesInRange:()=>kg,play:()=>Ig,testEpsilon:()=>is});var wg=.001,El=.1;function Eg(e,t,r){return r==null&&(r=is()),ss(e,t,(o,n)=>as(o,n,r))}function is(){return m.backend.floatPrecision()===32?wg:El}function ss(e,t,r){let o=!0;if((Q(e)||Q(t))&&(o=!1),Q(e)&&Q(t)&&(o=!0),o){let i=e.constructor.name,a=t.constructor.name;if(i!==a)throw new Error(`Arrays are of different type. Actual: ${i}. Expected: ${a}`)}if(Array.isArray(e)&&Array.isArray(t)){let i=at(e),a=at(t);if(!bt(i,a))throw new Error(`Arrays have different shapes. Actual: [${i}]. Expected: [${a}]`)}let n=Q(e)?e:Bt(e),s=Q(t)?t:Bt(t);if(n.length!==s.length)throw new Error(`Arrays have different lengths actual: ${n.length} vs expected: ${s.length}.
Actual:   ${n}.
Expected: ${s}.`);for(let i=0;i<s.length;++i){let a=n[i],c=s[i];if(!r(a,c))throw new Error(`Arrays differ: actual[${i}] = ${a}, expected[${i}] = ${c}.
Actual:   ${n}.
Expected: ${s}.`)}typeof expect<"u"&&expect().nothing()}function Tg(e,t){e().then(()=>t.fail(),()=>t()),typeof expect<"u"&&expect().nothing()}function vg(e,t){let r=typeof t=="string"||typeof t=="number"||typeof t=="boolean"?[t]:t;return Rt(e)||Rt(e[0])||Rt(t)||Rt(t[0])?ss(e,r,(o,n)=>o==n):ss(e,t,(o,n)=>as(o,n,0))}function $g(e,t,r){if(r==null&&(r=is()),!as(e,t,r))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`);typeof expect<"u"&&expect().nothing()}function as(e,t,r){return!isFinite(e)&&!isFinite(t)?!0:!(isNaN(e)||isNaN(t)||Math.abs(e-t)>r)}function kg(e,t,r){for(let o=0;o<e.length;o++)if(e[o]<t||e[o]>r)throw new Error(`Value out of range:${e[o]} low: ${t}, high: ${r}`)}function Sg(e,t){let r=new Float32Array(e),o=new Float32Array(t);if(r.length!==o.length)throw new Error(`Expected ArrayBuffer to be of length ${o.length}, but it was ${r.length}`);for(let n=0;n<o.length;n++)if(r[n]!==o[n])throw new Error(`Expected ArrayBuffer value at ${n} to be ${o[n]} but got ${r[n]} instead`)}function Tl(e){for(let t=0;t<e.length;t++){let r=e[t];Array.isArray(r)?Tl(r):e[t]=fe(r)}return e}function Ng(e){let t=document.createElement("video");return"playsInline"in t&&(t.playsInline=!0),t.muted=!0,t.loop=!0,t.style.position="fixed",t.style.left="0px",t.style.top="0px",t.preload="auto",t.appendChild(e),new Promise(r=>{t.addEventListener("loadeddata",o=>r(t)),t.load()})}async function Ig(e){await e.play(),"requestVideoFrameCallback"in e&&await new Promise(t=>{e.requestVideoFrameCallback(t)})}var Ge=class{constructor(t,r,o,n,s){this.mean=t,this.stdDev=r,this.dtype=o,this.nextVal=NaN,this.truncated=n,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);let i=s||Math.random();this.random=Io.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){let n=this.nextVal;return this.nextVal=NaN,n}let t,r,o=!1;for(;!o;){let n,s,i;do n=2*this.random()-1,s=2*this.random()-1,i=n*n+s*s;while(i>=1||i===0);let a=Math.sqrt(-2*Math.log(i)/i);t=this.mean+this.stdDev*n*a,r=this.mean+this.stdDev*s*a,(!this.truncated||this.isValidTruncated(t))&&(o=!0)}return(!this.truncated||this.isValidTruncated(r))&&(this.nextVal=this.convertValue(r)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}},So=class{constructor(t,r,o,n){this.alpha=t,this.beta=1/r,this.dtype=o;let s=n||Math.random();this.randu=Io.alea(s.toString()),this.randn=new Ge(0,1,o,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,r,o,n,s,i;for(;;){do n=this.randn.nextValue(),i=1+this.c*n;while(i<=0);if(i*=i*i,t=n*n,r=1-.331*t*t,o=.5*t+this.d*(1-i+Math.log(i)),s=this.randu(),s<r||Math.log(s)<o)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}},No=class{constructor(t=0,r=1,o,n){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=r-t,this.dtype=o,n==null&&(n=Math.random()),typeof n=="number"&&(n=n.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${r} <= 1 and dtype is not float`);this.random=Io.alea(n)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}};function Ag(e,t,r=1,o="float32",n){if(X(e),r==null&&(r=1),o==null&&(o="float32"),o!=="float32"&&o!=="int32")throw new Error(`Unsupported data type ${o}`);let s=new So(t,r,o,n),i=Et(e,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var Dg=u({randomGamma_:Ag});function Mg(e,t=0,r=1,o,n){if(X(e),o!=null&&o==="bool")throw new Error(`Unsupported data type ${o}`);let s=new Ge(t,r,o,!1,n),i=Et(e,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var cs=u({randomNormal_:Mg});function _g(e,t,r){if(t!=null&&t==="bool")throw new Error(`Unsupported data type ${t}`);return cs(e,0,1,t,r)}var Rg=u({randomStandardNormal_:_g});function Bg(e,t=0,r=1,o="float32",n){X(e);let s=Et(e,o),i=new No(t,r,null,n);for(let a=0;a<s.values.length;a++)s.values[a]=i.nextValue();return s.toTensor()}var Lr=u({randomUniform_:Bg});function Fg(e,t,r,o){return Lr(e,t,r,"int32",o)}var Gg=u({randomUniformInt_:Fg});function Ce(e,t,r=1,o="float32"){if(r===0)throw new Error("Cannot have a step of zero");let n={start:e,stop:t,step:r,dtype:o};return m.runKernel(Da,{},n)}function Cg(e){let r={input:l(e,"input","real")};return m.runKernel(Ma,r)}var ye=u({real_:Cg});function Pg(e){let r={x:l(e,"x","reciprocal")};return m.runKernel(_a,r)}var Og=u({reciprocal_:Pg});function Lg(e){let r={x:l(e,"x","relu")};return m.runKernel(Ra,r)}var Pe=u({relu_:Lg});function Wg(e){let r={x:l(e,"x","relu6")};return m.runKernel(Ca,r)}var ls=u({relu6_:Wg});function zg(e,t){let o={x:l(e,"x","reverse")},n={dims:t};return m.runKernel(Pa,o,n)}var Mt=u({reverse_:zg});function qg(e){let t=l(e,"x","reverse");return h(t.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`),Mt(t,0)}var Ug=u({reverse1d_:qg});function Kg(e,t){let r=l(e,"x","reverse");return h(r.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${r.rank}.`),Mt(r,t)}var Vg=u({reverse2d_:Kg});function Hg(e,t){let r=l(e,"x","reverse");return h(r.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${r.rank}.`),Mt(r,t)}var jg=u({reverse3d_:Hg});function Jg(e,t){let r=l(e,"x","reverse");return h(r.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${r.rank}.`),Mt(r,t)}var Xg=u({reverse4d_:Jg});function Yg(e){let r={x:l(e,"x","round")};return m.runKernel(Oa,r)}var ps=u({round_:Yg});function Zg(e){let r={x:l(e,"x","rsqrt","float32")};return m.runKernel(La,r)}var Qg=u({rsqrt_:Zg});function tx(e){let r={x:l(e,"x","selu")};return m.runKernel(Ka,r)}var ex=u({selu_:tx});function rx(e,t,r,o,n,s=[1,1],i="NHWC"){let a=l(e,"x","separableConv2d"),c=l(t,"depthwiseFilter","separableConv2d"),p=l(r,"pointwiseFilter","separableConv2d"),d=a,f=!1;if(a.rank===3&&(f=!0,d=y(a,[1,a.shape[0],a.shape[1],a.shape[2]])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");h(d.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${d.rank}.`),h(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),h(p.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),h(p.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${p.shape[0]}.`),h(p.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${p.shape[1]}.`);let g=c.shape[2],x=c.shape[3];h(p.shape[2]===g*x,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${g*x}, but got ${p.shape[2]}.`);let b=Pr(d,c,o,n,i,s),w=_e(b,p,1,"valid",i);return f?y(w,[w.shape[1],w.shape[2],w.shape[3]]):w}var ox=u({separableConv2d_:rx});async function nx(e,t){let r=l(e,"x","setdiff1d"),o=l(t,"y","setdiff1d");h(r.dtype===o.dtype,()=>`x and y should have the same dtype, but got x (${r.dtype}) and y (${o.dtype}).`),h(r.rank===1,()=>`x should be 1D tensor, but got x (${r.shape}).`),h(o.rank===1,()=>`y should be 1D tensor, but got y (${o.shape}).`);let n=await r.data(),s=await o.data(),i=new Set(s),a=0;for(let d=0;d<n.length;d++)i.has(n[d])||a++;let c=new he([a],r.dtype),p=new he([a],"int32");for(let d=0,f=0;d<n.length;d++)i.has(n[d])||(c.values[f]=n[d],p.values[f]=d,f++);return[c.toTensor(),p.toTensor()]}var sx=nx;function ix(e){let r={x:l(e,"x","sign")};return m.runKernel(Ja,r)}var ax=u({sign_:ix});function cx(e){let r={x:l(e,"x","sin","float32")};return m.runKernel(Ha,r)}var lx=u({sin_:cx});function px(e){let r={x:l(e,"x","sinh")};return m.runKernel(ja,r)}var ux=u({sinh_:px});function mx(e,t,r){let o=l(e,"x","slice1d");return h(o.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${o.rank} tensor`),W(o,[t],[r])}var fx=u({slice1d_:mx});function hx(e,t,r){let o=l(e,"x","slice2d");return h(o.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${o.rank} tensor`),W(o,t,r)}var dx=u({slice2d_:hx});function gx(e,t,r){let o=l(e,"x","slice3d");return h(o.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${o.rank} tensor`),W(o,t,r)}var xx=u({slice3d_:gx});function bx(e,t,r){let o=l(e,"x","slice4d");return h(o.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${o.rank} tensor`),W(o,t,r)}var yx=u({slice4d_:bx});function wx(e,t=-1){let r=l(e,"logits","softmax","float32");if(t===-1&&(t=r.rank-1),t!==r.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${r.rank} and dim was ${t}`);let o={logits:r},n={dim:t};return m.runKernel(rc,o,n)}var Ex=u({softmax_:wx});function Tx(e){h(e.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`);let t={input:e};return m.runKernel(_i,t)}var Wr=u({fft_:Tx});function vx(e){h(e.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`);let t={input:e};return m.runKernel(zi,t)}var wr=u({ifft_:vx});function $x(e){let t=e.shape[e.shape.length-1],r=e.size/t,o;if(t<=2){let n=y(e,[r,t]);o=wr(n)}else{let n=[r,2*(t-1)],s=y(ye(e),[r,t]),i=y(Fe(e),[r,t]),a=Mt(W(s,[0,1],[r,t-2]),1),c=T(Mt(W(i,[0,1],[r,t-2]),1),F(-1)),p=et([s,a],1),d=et([i,c],1),f=y(Nt(p,d),[n[0],n[1]]);o=wr(f)}if(o=ye(o),e.rank===3&&e.shape[0]!==0){let n=o,s=e.shape[0];o=y(o,[s,o.shape[0]/s,o.shape[1]]),n.dispose()}return o}var us=u({irfft_:$x});function kx(e,t,r=0){let n={x:l(e,"x","split")},s={numOrSizeSplits:t,axis:r};return m.runKernel(ec,n,s)}var we=u({split_:kx});function Sx(e,t){h(e.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${e.dtype}`);let r=e.shape[e.shape.length-1],o=e.size/r,n;if(t!=null&&t<r){let b=e.shape.map(w=>0),E=e.shape.map(w=>w);E[e.shape.length-1]=t,n=W(e,b,E),r=t}else if(t!=null&&t>r){let b=e.shape.map(E=>E);b[e.shape.length-1]=t-r,n=et([e,ie(b)],e.shape.length-1),r=t}else n=e;let s=st(n),i=y(Nt(n,s),[o,r]),a=Wr(i),c=Math.floor(r/2)+1,p=ye(a),d=Fe(a),f=we(p,[c,r-c],p.shape.length-1),g=we(d,[c,r-c],d.shape.length-1),x=n.shape.slice();return x[n.shape.length-1]=c,y(Nt(f[0],g[0]),x)}var zr=u({rfft_:Sx});function Nx(e,t){let r=l(e,"a","squaredDifference"),o=l(t,"b","squaredDifference");[r,o]=R(r,o),L(r.shape,o.shape);let n={a:r,b:o},s={};return m.runKernel(cc,n,s)}var ms=u({squaredDifference_:Nx});function Ix(e,t){let r=l(e,"x","squeeze","string_or_numeric");return y(r,Ko(r.shape,t).newShape)}var qr=u({squeeze_:Ix});function Ax(e,t=0){let r=Zt(e,"tensors","stack","string_or_numeric");h(r.length>=1,()=>"Pass at least one tensor to tf.stack"),r.length>0&&h(t<=r[0].rank,()=>"Axis must be <= rank of the tensor");let o=r,n={axis:t};return m.runKernel(Ta,o,n)}var Ee=u({stack_:Ax});function Dx(e,t=0){let o={x:l(e,"x","step")},n={alpha:t};return m.runKernel(vc,o,n)}var fs=u({step_:Dx});function Mx(e,t,r,o,n=0,s=0,i=0,a=0,c=0){let d={x:l(e,"x","stridedSlice","string_or_numeric")},f={begin:t,end:r,strides:o,beginMask:n,endMask:s,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};return m.runKernel(pc,d,f)}var _x=u({stridedSlice_:Mx});function Rx(e){let r={x:l(e,"x","tan","float32")};return m.runKernel(dc,r)}var Bx=u({tan_:Rx});function ut(e,t){At(e);let r=at(e,t);if(r.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return wt(e,null,r,t)}function Oe(e,t,r){if(At(e),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");let o=at(e,r);if(o.length!==2&&o.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(o.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return wt(e,t,o,r)}function hs(e,t,r){if(At(e),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");let o=at(e,r);if(o.length!==3&&o.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(o.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return wt(e,t,o,r)}function Fx(e,t,r){if(At(e),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");let o=at(e,r);if(o.length!==4&&o.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(o.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return wt(e,t,o,r)}function Gx(e,t,r){if(At(e),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");let o=at(e,r);if(o.length!==5&&o.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(o.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return wt(e,t,o,r)}function Cx(e,t,r){if(At(e),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");let o=at(e,r);if(o.length!==6&&o.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(o.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return t=t||o,wt(e,t,o,r)}var Ao={};xt(Ao,{calculateShapes:()=>$l,validateInput:()=>Er,validateUpdateShape:()=>ds});function ds(e,t,r){let o=t.rank>1?t.shape[t.rank-1]:1,n=t.rank>1?t.rank-1:1,s=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${r.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${o}, and batchDim: ${n}.`;if(r.rank<n)throw new Error(s+` update.rank < ${n}. `);if(e.length<o+(r.rank-n))throw new Error(s+` Output shape length < ${o+(r.rank-n)}`);if(r.rank!==n+e.length-o)throw new Error(s+` update.rank != ${n+e.length-o}`);for(let i=0;i<n;++i)if(r.shape[i]!==t.shape[i])throw new Error(s+` updates.shape[${i}] (${r.shape[i]}) != indices.shape[${i}] (${t.shape[i]}).`);for(let i=0;i<r.rank-n;++i)if(r.shape[i+n]!==e[i+o])throw new Error(s+` updates.shape[${i+n}] (${r.shape[i+n]}) != shape[${i+n}] (${e[i+n]})`)}function Er(e,t,r){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(r.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${r}`);if(r.length===0){if(t.size===0)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(e.size===0)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}ds(r,t,e)}function $l(e,t,r){let o=t.shape.length,n=o>1?t.shape[o-1]:1,s=r.length,i=1;for(let f=n;f<s;++f)i*=r[f];let a=n<1?1:n,c=B(t.shape)/a,p=[...Lt(r.slice(0,n)),1],d=B(r);return{sliceRank:n,numUpdates:c,sliceSize:i,strides:p,outputSize:d}}function Px(e,t,r){let o=l(e,"tensor","tensorScatterupdate"),n=l(t,"indices","tensorScatterupdate","int32"),s=l(r,"updates","tensorScatterupdate");if(Er(s,n,o.shape),o.dtype!==s.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${o.dtype} and ${s.dtype}.`);let i={tensor:o,indices:n,updates:s},a={};return m.runKernel(za,i,a)}var Ox=u({tensorScatterUpdate_:Px});function Lx(e,t=1,r=!0){let o=l(e,"x","topk");if(o.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");let n=o.shape[o.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>n)throw new Error(`'k' passed to topk() must be <= the last dimension (${n}) but got ${t}`);let s={x:o},i={k:t,sorted:r},[a,c]=m.runKernel(xc,s,i);return{values:a,indices:c}}var Wx=u({topk_:Lx});function zx(e,t=0,r=1,o,n){if(X(e),o!=null&&o==="bool")throw new Error("Unsupported data type $ { dtype }");let s=new Ge(t,r,o,!0,n),i=Et(e,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var qx=u({truncatedNormal_:zx});function Ux(e,t=0){let r=l(e,"x","unique","string_or_numeric");h(r.rank>0,()=>"The input tensor must be at least 1D");let o={x:r},n={axis:t},[s,i]=m.runKernel(yc,o,n);return{values:s,indices:i}}var Kx=u({unique_:Ux});function Vx(e,t,r){let o=l(e,"x","unsortedSegmentSum"),n=l(t,"segmentIds","unsortedSegmentSum","int32");h(Xt(r),()=>"numSegments must be of dtype int");let s={x:o,segmentIds:n},i={numSegments:r};return m.runKernel(Ec,s,i)}var Hx=u({unsortedSegmentSum_:Vx});function jx(e,t=0){let r=l(e,"x","unstack","string_or_numeric");h(t>=-r.shape.length&&t<r.shape.length,()=>`Axis = ${t} is not in [-${r.shape.length}, ${r.shape.length})`);let o={value:r},n={axis:t};return m.runKernel(wc,o,n)}var Ur=u({unstack_:jx});function Jx(e,t){return $o(e,t,"right")}function Xx(e,t=!0,r,o){return m.makeVariable(e,t,r,o)}function Do(e,t){let r=[];for(let s=0;s<t.length;s++)t[s]&&r.push(s);let o=Et(e,"int32"),n=Et([r.length,e.length],"int32");for(let s=0;s<r.length;s++){let i=o.indexToLoc(r[s]),a=s*e.length;n.values.set(i,a)}return n.toTensor()}async function Yx(e){let t=l(e,"condition","whereAsync","bool"),r=await t.data(),o=Do(t.shape,r);return e!==t&&t.dispose(),o}var gs=Yx;async function Zx(e,t,r){let o=l(e,"tensor","boolMask"),n=l(t,"mask","boolMask","bool"),s=r??0,i=n.rank,a=o.shape;h(i>0,()=>"mask cannot be scalar"),j(a.slice(s,s+i),n.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let E=s;E<s+i;E++)c*=a[E];let p=a.slice(0,s).concat([c],a.slice(s+i)),d=y(o,p),f=y(n,[-1]),g=await gs(f),x=qr(g,[1]),b=Kn(d,x,s);return e!==o&&o.dispose(),t!==n&&n.dispose(),x.dispose(),d.dispose(),f.dispose(),g.dispose(),b}var fO=Zx;function Qx(e,t,r){let o=l(e,"x","transpose");if(t==null&&(t=o.shape.map((i,a)=>a).reverse()),h(o.rank===t.length,()=>`Error in transpose: rank of input ${o.rank} must match length of perm ${t}.`),t.forEach(i=>{h(i>=0&&i<o.rank,()=>`All entries in 'perm' must be between 0 and ${o.rank-1} but got ${t}`)}),o.rank<=1)return o.clone();let n={x:o},s={perm:t};return o.dtype==="complex64"?J(()=>{let i=ye(o),a=Fe(o);return i=m.runKernel(ro,{x:i},s),a=m.runKernel(ro,{x:a},s),r&&(a=dt(a)),Nt(i,a)}):m.runKernel(ro,n,s)}var Kr=u({transpose_:Qx});function tb(e,t,r,o,n=!0){let s=l(e,"v","movingAverage"),i=l(t,"x","movingAverage"),a=l(r,"decay","movingAverage");xn(s,i),h(bt(s.shape,i.shape),()=>"Shape mismatch in v and x");let c=F(1),p=A(c,a),d=T(A(i,s),p);if(n){h(o!=null,()=>"When using zeroDebias: true, step is required.");let f=l(o,"step","movingAverage");d=P(d,A(c,xe(a,f)))}return S(s,d)}var BO=u({movingAverage_:tb});function eb(e,t,r){X(r);let o=l(e,"indices","scatterND","int32"),n=l(t,"updates","scatterND");Er(n,o,r);let s={indices:o,updates:n},i={shape:r};return m.runKernel(Wa,s,i)}var WO=u({scatterND_:eb});function kl(e,t,r,o){if(e.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);let n=e.rank>0?e.shape[0]:1,s=e.rank>1?e.shape[1]:1;if(r.length!==s)throw new Error(`outputShape has incorrect number of elements:, ${r.length}, should be: ${s}.`);let i=t.size;if(!(t.rank===0||t.rank===1&&i===n))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${n}]`);if(t.dtype!==o.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}function ob(e,t,r,o=0){X(r);let n=l(e,"sparseIndices","sparseToDense","int32"),s=l(t,"sparseValues","sparseToDense","string_or_numeric"),i=l(o,"defaultValue","sparseToDense",s.dtype);kl(n,s,r,i);let a={sparseIndices:n,sparseValues:s,defaultValue:i},c={outputShape:r};return m.runKernel(ac,a,c)}var jO=u({sparseToDense_:ob});function nb(e,t){let r=l(t,"indices","gatherND","int32"),n={params:l(e,"x","gatherND","string_or_numeric"),indices:r};return m.runKernel(Oi,n)}var tL=u({gatherND_:nb});function Sl(e,t){if(t==null)return e.shape.slice();if(bt(e.shape,t))return t;if(e.shape.length===t.length){let r=[];for(let o=0;o<e.shape.length;o++)t[o]==null&&e.shape[o]!=null?r.push(e.shape[o]):r.push(t[o]);return r}return t}function sb(e,t,r,o){let n=l(e,"x","dropout");if(h(n.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${n.dtype} tensor instead.`),h(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return e instanceof H?n.clone():n;let s=Sl(n,r),i=1-t,a=P(Un(S(Lr(s,0,1,"float32",o),i)),i);return T(n,a)}var mL=u({dropout_:sb});function Nl(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function Mo(e,t,r){let o=1-e%2,n=new Float32Array(e);for(let s=0;s<e;++s){let i=2*Math.PI*s/(e+o-1);n[s]=t-r*Math.cos(i)}return ut(n,"float32")}async function ib(e,t,r=1){let o=l(e,"predictions","inTopK"),n=l(t,"targets","inTopK");h(o.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${o.rank}`),h(o.rank-1===n.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${o.rank} and targets rank ${n.rank}`),j(o.shape.slice(0,o.shape.length-1),n.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");let s=o.shape[o.shape.length-1];h(r>0&&r<=s,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${s}), but got ${r}`);let i=await o.data(),a=await n.data(),[c,p]=[i.length/s,s],d=Vo("bool",c);for(let f=0;f<c;f++){let g=f*p,x=i.subarray(g,g+p),b=[];for(let E=0;E<x.length;E++)b.push({value:x[E],index:E});b.sort((E,w)=>w.value-E.value),d[f]=0;for(let E=0;E<r;E++)if(b[E].index===a[f]){d[f]=1;break}}return e!==o&&o.dispose(),t!==n&&n.dispose(),Qt(d,n.shape,"bool")}var yL=ib;var Bl={};xt(Bl,{conv2d:()=>Al,depthwiseConv2d:()=>_l,matMul:()=>Rl});function ab(e,t,r,o,n,s="NHWC",i){let a=e;e.rank===3&&(a=y(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=y(t,[1,t.shape[0],t.shape[1],t.shape[2]])),h(a.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${a.shape}.`),h(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),h(r.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${r}.`);let p=s==="NHWC"?a.shape[3]:a.shape[1],d=s==="NHWC"?c.shape[3]:c.shape[1];h(p===r[2],()=>`Error in conv2dDerFilter: depth of input ${p}) must match input depth in filter (${r[2]}.`),h(d===r[3],()=>`Error in conv2dDerFilter: depth of dy (${d}) must match output depth for filter (${r[3]}).`),tt("conv2dDerFilter",n,i);let f={x:a,dy:c},g={strides:o,pad:n,dataFormat:s,dimRoundingMode:i,filterShape:r};return m.runKernel(ci,f,g)}var Il=u({conv2DBackpropFilter_:ab});function Le(e,t,r){if(r==null||r==="linear")return e;if(r==="relu")return T(e,fs(t));throw new Error(`Cannot compute gradient for fused activation ${r}.`)}function We(e,t){let r=t,o=yo(e.shape,t.shape);return o.length>0&&(r=z(r,o)),y(r,e.shape)}function ze(e,t,r,o){if(t==="linear")return e;if(t==="relu")return Pe(e);if(t==="elu")return Wn(e);if(t==="relu6")return ls(e);if(t==="prelu")return ns(e,r);if(t==="leakyrelu")return Hn(e,o);if(t==="sigmoid")return re(e);throw new Error(`Unknown fused activation ${t}.`)}var qe=(e,t)=>!(e>0)||t==="linear";function cb({x:e,filter:t,strides:r,pad:o,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:a,activation:c="linear",preluActivationWeights:p,leakyreluAlpha:d}){if(c=c||"linear",qe(m.state.gradientDepth,c)===!1){h(n==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${n} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let D=_e(e,t,r,o,n,s,i);return a!=null&&(D=S(D,a)),ze(D,c,p,d)}let f=l(e,"x","conv2d","float32"),g=l(t,"filter","conv2d","float32"),x=f,b=!1;f.rank===3&&(b=!0,x=y(f,[1,f.shape[0],f.shape[1],f.shape[2]])),h(x.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${x.rank}.`),h(g.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${g.rank}.`),tt("fused conv2d",o,i);let E=n==="NHWC"?x.shape[3]:x.shape[1];h(g.shape[2]===E,()=>`Error in conv2d: depth of input (${E}) must match input depth for filter ${g.shape[2]}.`),h(ht(r,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${r} and dilations '${s}'`);let w=De(x.shape,g.shape,r,s,o,i),$;a!=null&&($=l(a,"bias","fused conv2d"),[$]=R($,f),n==="NHWC"?L(w.outShape,$.shape):(h($.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${$.shape.length}.`),h($.shape.length===0||$.shape[0]===w.outChannels||$.shape[0]===1,()=>`Error in fused conv2d: bias shape (${$.shape}) is not compatible with the number of output channels (${w.outChannels})`)));let _;if(p!=null){let D=p.shape;if(h(D.length<=1||D.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${D.length}.`),D.length===1)h(D[0]===1||D[0]===w.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${D}) is not compatible with the number of output channels (${w.outChannels}).`);else if(D.length===3)try{L(D,w.outShape)}catch{let q=`Error in fused conv2d: PReLU activation weights (${D}) is not compatible with the output shape of the conv2d (${w.outShape}).`;throw Error(q)}_=l(p,"prelu weights","fused conv2d")}let v=(D,U)=>{h(n==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${n} but only NHWC is currently supported.`);let[q,C,V,K]=U,ot=Le(D,V,c);h(Ae(s),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`);let ft=bo(C.shape,ot,q,r,o),gt=Il(C,ot,q.shape,r,o),kt=[ft,gt];if(K!=null){let Ye=We(K,ot);kt.push(Ye)}return kt},I={x,filter:g,bias:$,preluActivationWeights:_},M={strides:r,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i,activation:c,leakyreluAlpha:d};return a==null?Tt((U,q,C)=>{let V=m.runKernel(rn,I,M);return C([q,U,V]),b&&(V=y(V,[V.shape[1],V.shape[2],V.shape[3]])),{value:V,gradFunc:v}})(x,g):Tt((U,q,C,V)=>{let K=m.runKernel(rn,I,M);return V([q,U,K,C]),b&&(K=y(K,[K.shape[1],K.shape[2],K.shape[3]])),{value:K,gradFunc:v}})(x,g,$)}var Al=u({fusedConv2d_:cb});function lb(e,t,r,o,n,s=[1,1],i){let a=e;e.rank===3&&(a=y(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=y(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let p={x:a,dy:c},d={strides:o,pad:n,dimRoundingMode:i,dilations:s,filterShape:r};return m.runKernel(wi,p,d)}var Dl=u({depthwiseConv2dNativeBackpropFilter_:lb});function pb(e,t,r,o,n,s=[1,1],i){let a=t,c=!1;t.rank===3&&(c=!0,a=y(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let p={dy:a,filter:r},d={strides:o,pad:n,dimRoundingMode:i,dilations:s,inputShape:e},f=m.runKernel(Ei,p,d);return c?y(f,[f.shape[1],f.shape[2],f.shape[3]]):f}var Ml=u({depthwiseConv2dNativeBackpropInput_:pb});function ub({x:e,filter:t,strides:r,pad:o,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:a,activation:c="linear",preluActivationWeights:p,leakyreluAlpha:d}){if(qe(m.state.gradientDepth,c)===!1){let M=Pr(e,t,r,o,n,s,i);return a!=null&&(M=S(M,a)),ze(M,c,p,d)}let f=l(e,"x","depthwiseConv2d","float32"),g=l(t,"filter","depthwiseConv2d","float32"),x=f,b=!1;f.rank===3&&(b=!0,x=y(f,[1,f.shape[0],f.shape[1],f.shape[2]])),h(x.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${x.rank}.`),h(g.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${g.rank}.`),h(x.shape[3]===g.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${x.shape[3]}) must match the inChannels dimension in filter ${g.shape[2]}.`),s==null&&(s=[1,1]),h(ht(r,s),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${r} and dilations '${s}'`),tt("fused depthwiseConv2d",o,i);let E=De(x.shape,g.shape,r,s,o,i,!0),w;a!=null&&(w=l(a,"bias","fused conv2d"),[w]=R(w,f),L(E.outShape,w.shape));let $;p!=null&&($=l(p,"prelu weights","fused depthwiseConv2d"));let _=(M,D)=>{h(Ae(s),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${s}'`);let[U,q,C,V]=D,K=Le(M,C,c),ot=Ml(q.shape,K,U,r,o,s,i),ft=Dl(q,K,U.shape,r,o,s,i);if(V!=null){let gt=We(w,K);return[ot,ft,gt]}return[ot,ft]},v={x,filter:g,bias:w,preluActivationWeights:$},I={strides:r,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i,activation:c,leakyreluAlpha:d};return a==null?Tt((D,U,q)=>{let C=m.runKernel(on,v,I);return q([U,D,C]),b&&(C=y(C,[C.shape[1],C.shape[2],C.shape[3]])),{value:C,gradFunc:_}})(x,g):Tt((D,U,q,C)=>{let V=m.runKernel(on,v,I);return C([U,D,V,q]),b&&(V=y(V,[V.shape[1],V.shape[2],V.shape[3]])),{value:V,gradFunc:_}})(x,g,w)}var _l=u({fusedDepthwiseConv2d_:ub});function mb({a:e,b:t,transposeA:r=!1,transposeB:o=!1,bias:n,activation:s="linear",preluActivationWeights:i,leakyreluAlpha:a=.2}){if(qe(m.state.gradientDepth,s)===!1){let K=O(e,t,r,o);return n!=null&&(K=S(K,n)),ze(K,s,i,a)}let c=l(e,"a","fused matMul"),p=l(t,"b","fused matMul");[c,p]=R(c,p);let d=r?c.shape[c.rank-2]:c.shape[c.rank-1],f=o?p.shape[p.rank-1]:p.shape[p.rank-2],g=r?c.shape[c.rank-1]:c.shape[c.rank-2],x=o?p.shape[p.rank-2]:p.shape[p.rank-1],b=c.shape.slice(0,-2),E=p.shape.slice(0,-2),w=B(b),$=B(E);h(d===f,()=>`Error in fused matMul: inner shapes (${d}) and (${f}) of Tensors with shapes ${c.shape} and ${p.shape} and transposeA=${r} and transposeB=${o} must match.`);let v=L(c.shape.slice(0,-2),p.shape.slice(0,-2)).concat([g,x]),I=r?y(c,[w,d,g]):y(c,[w,g,d]),M=o?y(p,[$,x,f]):y(p,[$,f,x]),D;n!=null&&(D=l(n,"bias","fused matMul"),[D]=R(D,c),L(v,D.shape));let U;i!=null&&(U=l(i,"prelu weights","fused matMul"));let q=(K,ot)=>{let[ft,gt,kt,Ye]=ot,Jt=Le(y(K,kt.shape),kt,s),Ze,Qe;if(!r&&!o?(Ze=O(Jt,gt,!1,!0),Qe=O(ft,Jt,!0,!1)):!r&&o?(Ze=O(Jt,gt,!1,!1),Qe=O(Jt,ft,!0,!1)):r&&!o?(Ze=O(gt,Jt,!1,!0),Qe=O(ft,Jt,!1,!1)):(Ze=O(gt,Jt,!0,!0),Qe=O(Jt,ft,!0,!0)),n!=null){let Qp=We(Ye,Jt);return[Ze,Qe,Qp]}else return[Ze,Qe]},C={a:I,b:M,bias:D,preluActivationWeights:U},V={transposeA:r,transposeB:o,activation:s,leakyreluAlpha:a};return n==null?Tt((ot,ft,gt)=>{let kt=m.runKernel(en,C,V);return gt([ot,ft,kt]),{value:y(kt,v),gradFunc:q}})(I,M):Tt((ot,ft,gt,kt)=>{let Ye=m.runKernel(en,C,V);return kt([ot,ft,Ye,gt]),{value:y(Ye,v),gradFunc:q}})(I,M,D)}var Rl=u({fusedMatMul_:mb});function fb(e){return Mo(e,.54,.46)}var Fl=u({hammingWindow_:fb});function hb(e){return Mo(e,.5,.5)}var _o=u({hannWindow_:hb});function db(e,t,r,o=!1,n=0){let s=0,i=[];for(;s+t<=e.size;)i.push(W(e,s,t)),s+=r;if(o)for(;s<e.size;){let a=s+t-e.size,c=et([W(e,s,t-a),oe([a],n)]);i.push(c),s+=r}return i.length===0?Oe([],[0,t]):y(et(i),[i.length,t])}var Ro=u({frame_:db});function gb(e,t,r,o,n=_o){o==null&&(o=Nl(t));let s=Ro(e,t,r),i=T(s,n(t));return zr(i,o)}var Gl=u({stft_:gb});function xb(e,t,r,o,n="bilinear",s=0){let i=l(e,"image","cropAndResize"),a=l(t,"boxes","cropAndResize","float32"),c=l(r,"boxInd","cropAndResize","int32"),p=a.shape[0];h(i.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${i.rank}.`),h(a.rank===2&&a.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${p},4] but had shape ${a.shape}.`),h(c.rank===1&&c.shape[0]===p,()=>`Error in cropAndResize: boxInd must be have size [${p}] but had shape ${a.shape}.`),h(o.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${o.length}.`),h(o[0]>=1&&o[1]>=1,()=>`cropSize must be atleast [1,1], but was ${o}`),h(n==="bilinear"||n==="nearest",()=>`method must be bilinear or nearest, but was ${n}`);let d={image:i,boxes:a,boxInd:c},f={method:n,extrapolationValue:s,cropSize:o};return m.runKernel(gi,d,f)}var Cl=u({cropAndResize_:xb});function bb(e){let t=l(e,"image","flipLeftRight","float32");h(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);let r={image:t};return m.runKernel(Bi,r,{})}var Pl=u({flipLeftRight_:bb});function yb(e){let t=l(e,"image","grayscaleToRGB"),r=t.rank-1,o=t.shape[r];h(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),h(o===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${o}.`);let n=new Array(t.rank);return n.fill(1,0,r),n[r]=3,Be(t,n)}var Ol=u({grayscaleToRGB_:yb});function wb(e){let t=l(e,"image","RGBToGrayscale"),r=t.rank-1,o=t.shape[r];h(t.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${t.rank}.`),h(o===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${o}.`);let n=t.dtype,s=G(t,"float32"),i=ut([.2989,.587,.114]),a;switch(t.rank){case 2:a=Re("ij,j->i",s,i);break;case 3:a=Re("ijk,k->ij",s,i);break;case 4:a=Re("ijkl,l->ijk",s,i);break;case 5:a=Re("ijklm,m->ijkl",s,i);break;case 6:a=Re("ijklmn,n->ijklm",s,i);break;default:throw new Error("Not a valid tensor rank.")}return a=Ht(a,-1),G(a,n)}var Ll=u({rgbToGrayscale_:wb});function Eb(e,t,r=0,o=.5){let n=l(e,"image","rotateWithOffset","float32");h(n.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${n.rank}.`);let s={image:n},i={radians:t,fillValue:r,center:o};return m.runKernel($c,s,i)}var Wl=u({rotateWithOffset_:Eb});function _t(e,t,r,o,n,s){o==null&&(o=.5),n==null&&(n=Number.NEGATIVE_INFINITY),s==null&&(s=0);let i=e.shape[0];return r=Math.min(r,i),h(0<=o&&o<=1,()=>`iouThreshold must be in [0, 1], but was '${o}'`),h(e.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`),h(e.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`),h(t.rank===1,()=>"scores must be a 1D tensor"),h(t.shape[0]===i,()=>`scores has incompatible shape with boxes. Expected ${i}, but was ${t.shape[0]}`),h(0<=s&&s<=1,()=>`softNmsSigma must be in [0, 1], but was '${s}'`),{maxOutputSize:r,iouThreshold:o,scoreThreshold:n,softNmsSigma:s}}function Tb(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY){let s=l(e,"boxes","nonMaxSuppression","float32"),i=l(t,"scores","nonMaxSuppression","float32"),a=_t(s,i,r,o,n);r=a.maxOutputSize,o=a.iouThreshold,n=a.scoreThreshold;let c={maxOutputSize:r,iouThreshold:o,scoreThreshold:n};return m.runKernel(xa,{boxes:s,scores:i},c)}var zl=u({nonMaxSuppression_:Tb});function ql(e,t,r){let o=vb(e,t,r),n=o<0?-(o+1):o;e.splice(n,0,t)}function vb(e,t,r){return kb(e,t,r||$b)}function $b(e,t){return e>t?1:e<t?-1:0}function kb(e,t,r){let o=0,n=e.length,s=0,i=!1;for(;o<n;){s=o+(n-o>>>1);let a=r(t,e[s]);a>0?o=s+1:(n=s,i=!a)}return i?o:-o-1}function Bo(e,t,r,o,n){return xs(e,t,r,o,n,0)}function Fo(e,t,r,o,n,s){return xs(e,t,r,o,n,0,!1,s,!0)}function Go(e,t,r,o,n,s){return xs(e,t,r,o,n,s,!0)}function xs(e,t,r,o,n,s,i=!1,a=!1,c=!1){let p=[];for(let w=0;w<t.length;w++)t[w]>n&&p.push({score:t[w],boxIndex:w,suppressBeginIndex:0});p.sort(Ul);let d=s>0?-.5/s:0,f=[],g=[];for(;f.length<r&&p.length>0;){let w=p.pop(),{score:$,boxIndex:_,suppressBeginIndex:v}=w;if($<n)break;let I=!1;for(let M=f.length-1;M>=v;--M){let D=Sb(e,_,f[M]);if(D>=o){I=!0;break}if(w.score=w.score*Nb(o,d,D),w.score<=n)break}w.suppressBeginIndex=f.length,I||(w.score===$?(f.push(_),g.push(w.score)):w.score>n&&ql(p,w,Ul))}let x=f.length,b=r-x;a&&b>0&&(f.push(...new Array(b).fill(0)),g.push(...new Array(b).fill(0)));let E={selectedIndices:f};return i&&(E.selectedScores=g),c&&(E.validOutputs=x),E}function Sb(e,t,r){let o=e.subarray(t*4,t*4+4),n=e.subarray(r*4,r*4+4),s=Math.min(o[0],o[2]),i=Math.min(o[1],o[3]),a=Math.max(o[0],o[2]),c=Math.max(o[1],o[3]),p=Math.min(n[0],n[2]),d=Math.min(n[1],n[3]),f=Math.max(n[0],n[2]),g=Math.max(n[1],n[3]),x=(a-s)*(c-i),b=(f-p)*(g-d);if(x<=0||b<=0)return 0;let E=Math.max(s,p),w=Math.max(i,d),$=Math.min(a,f),_=Math.min(c,g),v=Math.max($-E,0)*Math.max(_-w,0);return v/(x+b-v)}function Nb(e,t,r){let o=Math.exp(t*r*r);return r<=e?o:0}function Ul(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}async function Ib(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY){let s=l(e,"boxes","nonMaxSuppressionAsync"),i=l(t,"scores","nonMaxSuppressionAsync"),a=_t(s,i,r,o,n);r=a.maxOutputSize,o=a.iouThreshold,n=a.scoreThreshold;let c=await Promise.all([s.data(),i.data()]),p=c[0],d=c[1],{selectedIndices:f}=Bo(p,d,r,o,n);return s!==e&&s.dispose(),i!==t&&i.dispose(),ut(f,"int32")}var Kl=Ib;function Ab(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=l(e,"boxes","nonMaxSuppression"),a=l(t,"scores","nonMaxSuppression"),c=_t(i,a,r,o,n,s);r=c.maxOutputSize,o=c.iouThreshold,n=c.scoreThreshold,s=c.softNmsSigma;let p={boxes:i,scores:a},d={maxOutputSize:r,iouThreshold:o,scoreThreshold:n,softNmsSigma:s},f=m.runKernel(ya,p,d);return{selectedIndices:f[0],selectedScores:f[1]}}var Vl=u({nonMaxSuppressionWithScore_:Ab});async function Db(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=l(e,"boxes","nonMaxSuppressionAsync"),a=l(t,"scores","nonMaxSuppressionAsync"),c=_t(i,a,r,o,n,s);r=c.maxOutputSize,o=c.iouThreshold,n=c.scoreThreshold,s=c.softNmsSigma;let p=await Promise.all([i.data(),a.data()]),d=p[0],f=p[1],{selectedIndices:g,selectedScores:x}=Go(d,f,r,o,n,s);return i!==e&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:ut(g,"int32"),selectedScores:ut(x)}}var Hl=Db;function Mb(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=l(e,"boxes","nonMaxSuppression"),a=l(t,"scores","nonMaxSuppression"),c=_t(i,a,r,o,n,null),p=c.maxOutputSize,d=c.iouThreshold,f=c.scoreThreshold,g={boxes:i,scores:a},x={maxOutputSize:p,iouThreshold:d,scoreThreshold:f,padToMaxOutputSize:s},b=m.runKernel(ba,g,x);return{selectedIndices:b[0],validOutputs:b[1]}}var jl=u({nonMaxSuppressionPadded_:Mb});async function _b(e,t,r,o=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=l(e,"boxes","nonMaxSuppressionAsync"),a=l(t,"scores","nonMaxSuppressionAsync"),c=_t(i,a,r,o,n,null),p=c.maxOutputSize,d=c.iouThreshold,f=c.scoreThreshold,[g,x]=await Promise.all([i.data(),a.data()]),{selectedIndices:b,validOutputs:E}=Fo(g,x,p,d,f,s);return i!==e&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:ut(b,"int32"),validOutputs:F(E,"int32")}}var Jl=_b;function Rb(e,t,r=!1,o=!1){let n=l(e,"images","resizeBilinear");h(n.rank===3||n.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${n.rank}.`),h(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),h(o===!1||r===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=y(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=t,a={images:s},c={alignCorners:r,halfPixelCenters:o,size:t},p=m.runKernel(Ga,a,c);return i?y(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var Xl=u({resizeBilinear_:Rb});function Bb(e,t,r=!1,o=!1){let n=l(e,"images","resizeNearestNeighbor");h(n.rank===3||n.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${n.rank}.`),h(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),h(n.dtype==="float32"||n.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),h(o===!1||r===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=y(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=t,a={images:s},c={alignCorners:r,halfPixelCenters:o,size:t},p=m.runKernel(Fa,a,c);return i?y(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var Yl=u({resizeNearestNeighbor_:Bb});function Fb(e,t="binary",r=!1,o=.5){let n=l(e,"image","threshold"),s=.2989,i=.587,a=.114,c=n.shape[0]*n.shape[1],p=T(ut([o]),255),d,f,g,x;if(h(n.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${n.rank}.`),h(n.shape[2]===3||n.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${n.shape[2]}.`),h(n.dtype==="int32"||n.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${n.dtype}.`),h(t==="otsu"||t==="binary",()=>`Method must be binary or otsu, but was ${t}`),n.shape[2]===3){[d,f,g]=we(n,[1,1,1],-1);let w=T(d,s),$=T(f,i),_=T(g,a);x=S(S(w,$),_)}else x=e;if(t==="otsu"){let w=On(G(ps(x),"int32"),Qt([]),256);p=Gb(w,c)}let b=r?Or(x,p):gr(x,p);return G(T(b,255),"int32")}function Gb(e,t){let r=ut([-1]),o=ut([0]),n=ut([0]),s,i,a,c,p,d;for(let f=0;f<e.size-1;f++){s=W(e,0,f+1),i=W(e,f+1),p=P(z(s),t),d=P(z(i),t);let g=z(T(s,Ce(0,s.size)));a=P(g,z(s));let x=oe(i.shape,s.size),b=S(Ce(0,i.size),x),E=T(i,b);c=P(z(E),z(i));let w=A(a,c),$=A(a,c),_=T(p,d);n=T(T(_,w),$);let v=gr(n,o);o=Dt(v,n,o),r=Dt(v,ut([f]),r)}return r}var Zl=u({threshold_:Fb});function Cb(e,t,r="nearest",o="constant",n=0,s){let i=l(e,"image","transform","float32"),a=l(t,"transforms","transform","float32");h(i.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${i.rank}.`),h(a.rank===2&&(a.shape[0]===i.shape[0]||a.shape[0]===1)&&a.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),h(s==null||s.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${s}.`);let c={image:i,transforms:a},p={interpolation:r,fillMode:o,fillValue:n,outputShape:s};return m.runKernel(bc,c,p)}var Ql=u({transform_:Cb});function Pb(e,t,r){let o=l(e,"a","bandPart");h(o.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${o.rank}.`);let n=o.shape,[s,i]=o.shape.slice(-2),a,c;typeof t=="number"?(h(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),h(t<=s,()=>`bandPart(): numLower (${t}) must not be greater than the number of rows (${s}).`),a=l(t<0?s:t,"numLower","bandPart")):(h(t.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),a=Dt(Eo(t,0),s,yr(t,s))),typeof r=="number"?(h(r%1===0,()=>`bandPart(): numUpper must be an integer, got ${r}.`),h(r<=i,()=>`bandPart(): numUpper (${r}) must not be greater than the number of columns (${i}).`),c=l(r<0?i:r,"numUpper","bandPart")):(h(r.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),c=Dt(Eo(r,0),i,yr(r,i)));let p=y(Ce(0,s,1,"int32"),[-1,1]),d=Ce(0,i,1,"int32"),f=A(p,d),g=xr(Or(f,a),Vn(f,dt(c))),x=ie([s,i],o.dtype);return y(Ee(Ur(y(o,[-1,s,i])).map(b=>Dt(g,b,x))),n)}var tp=u({bandPart_:Pb});function Ob(e){let t;if(Array.isArray(e)){t=!1,h(e!=null&&e.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");let n=e[0].shape[0];for(let s=1;s<e.length;++s)h(e[s].shape[0]===n,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[s].shape[0]} vs. ${n})`)}else t=!0,e=we(e,e.shape[0],0).map(n=>qr(n,[0]));h(e.length<=e[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`);let r=[],o=e;for(let n=0;n<e.length;++n)r.push(m.tidy(()=>{let s=o[n];if(n>0)for(let i=0;i<n;++i){let a=T(z(T(r[i],s)),r[i]);s=A(s,a)}return P(s,dr(s,"euclidean"))}));return t?Ee(r,0):r}var ep=u({gramSchmidt_:Ob});function Lb(e,t=!1){if(h(e.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`),e.rank===2)return rp(e,t);{let r=e.shape.slice(0,e.shape.length-2).reduce((c,p)=>c*p),o=Ur(y(e,[r,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),n=[],s=[];o.forEach(c=>{let[p,d]=rp(c,t);n.push(p),s.push(d)});let i=y(Ee(n,0),e.shape),a=y(Ee(s,0),e.shape);return[i,a]}}function rp(e,t=!1){return m.tidy(()=>{h(e.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`);let r=e.shape[0],o=e.shape[1],n=qn(r),s=Ct(e),i=Oe([[1]],[1,1]),a=Ct(i),c=r>=o?o:r;for(let p=0;p<c;++p){let d=s,f=a,g=n;[a,s,n]=m.tidy(()=>{let x=W(s,[p,p],[r-p,1]),b=dr(x),E=W(s,[p,p],[1,1]),w=Dt(gr(E,0),Oe([[-1]]),Oe([[1]])),$=A(E,T(w,b)),_=P(x,$);_.shape[0]===1?a=Ct(i):a=et([i,W(_,[1,0],[_.shape[0]-1,_.shape[1]])],0);let v=dt(P(O(w,$),b)),I=W(s,[p,0],[r-p,o]),M=T(v,a),D=Kr(a);if(p===0)s=A(I,O(M,O(D,I)));else{let C=A(I,O(M,O(D,I)));s=et([W(s,[0,0],[p,o]),C],0)}let U=Kr(M),q=W(n,[0,p],[r,n.shape[1]-p]);if(p===0)n=A(q,O(O(q,a),U));else{let C=A(q,O(O(q,a),U));n=et([W(n,[0,0],[r,p]),C],1)}return[a,s,n]}),rt([d,f,g])}return!t&&r>o&&(n=W(n,[0,0],[r,o]),s=W(s,[0,0],[o,o])),[n,s]})}var op=u({qr_:Lb});var Z;(function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(Z||(Z={}));function Wb(e,t,r=Z.SUM_BY_NONZERO_WEIGHTS){let o=l(e,"losses","computeWeightedLoss"),n=null;t!=null&&(n=l(t,"weights","computeWeightedLoss"));let s=n==null?o:T(o,n);if(r===Z.NONE)return s;if(r===Z.SUM)return z(s);if(r===Z.MEAN){if(n==null)return br(s);{let i=o.size/n.size,a=P(z(s),z(n));return i>1?P(a,F(i)):a}}if(r===Z.SUM_BY_NONZERO_WEIGHTS){if(n==null)return P(z(s),F(o.size));{let i=T(n,ae(o.shape)),a=G(z(rs(i,F(0))),"float32");return P(z(s),a)}}throw Error(`Unknown reduction: ${r}`)}var mt=u({computeWeightedLoss_:Wb});function zb(e,t,r,o=Z.SUM_BY_NONZERO_WEIGHTS){let n=l(e,"labels","absoluteDifference"),s=l(t,"predictions","absoluteDifference"),i=null;r!=null&&(i=l(r,"weights","absoluteDifference")),j(n.shape,s.shape,"Error in absoluteDifference: ");let a=lt(A(n,s));return mt(a,i,o)}var np=u({absoluteDifference_:zb});function qb(e,t,r,o,n=Z.SUM_BY_NONZERO_WEIGHTS){let s=l(e,"labels","cosineDistance"),i=l(t,"predictions","cosineDistance"),a=null;o!=null&&(a=l(o,"weights","cosineDistance")),j(s.shape,i.shape,"Error in cosineDistance: ");let c=F(1),p=A(c,z(T(s,i),r,!0));return mt(p,a,n)}var sp=u({cosineDistance_:qb});function Ub(e,t,r,o=Z.SUM_BY_NONZERO_WEIGHTS){let n=l(e,"labels","hingeLoss"),s=l(t,"predictions","hingeLoss"),i=null;r!=null&&(i=l(r,"weights","hingeLoss")),j(n.shape,s.shape,"Error in hingeLoss: ");let a=F(1);n=A(T(F(2),n),a);let c=Pe(A(a,T(n,s)));return mt(c,i,o)}var ip=u({hingeLoss_:Ub});function Kb(e,t,r,o=1,n=Z.SUM_BY_NONZERO_WEIGHTS){let s=l(e,"labels","huberLoss"),i=l(t,"predictions","huberLoss"),a=null;r!=null&&(a=l(r,"weights","huberLoss")),j(s.shape,i.shape,"Error in huberLoss: ");let c=F(o),p=lt(A(i,s)),d=yr(p,c),f=A(p,d),g=S(T(F(.5),pt(d)),T(c,f));return mt(g,a,n)}var ap=u({huberLoss_:Kb});function Vb(e,t,r,o=1e-7,n=Z.SUM_BY_NONZERO_WEIGHTS){let s=l(e,"labels","logLoss"),i=l(t,"predictions","logLoss"),a=null;r!=null&&(a=l(r,"weights","logLoss")),j(s.shape,i.shape,"Error in logLoss: ");let c=F(1),p=F(o),d=dt(T(s,be(S(i,p)))),f=T(A(c,s),be(S(A(c,i),p))),g=A(d,f);return mt(g,a,n)}var cp=u({logLoss_:Vb});function Hb(e,t,r,o=Z.SUM_BY_NONZERO_WEIGHTS){let n=l(e,"labels","meanSquaredError"),s=l(t,"predictions","meanSquaredError"),i=null;r!=null&&(i=l(r,"weights","meanSquaredError")),j(n.shape,s.shape,"Error in meanSquaredError: ");let a=ms(n,s);return mt(a,i,o)}var lp=u({meanSquaredError_:Hb});function jb(e,t){let r=l(e,"labels","sigmoidCrossEntropyWithLogits"),o=l(t,"logits","sigmoidCrossEntropyWithLogits");j(r.shape,o.shape,"Error in sigmoidCrossEntropyWithLogits: ");let n=Pe(o),s=T(o,r),i=jn(Pt(dt(lt(o))));return S(A(n,s),i)}function Jb(e,t,r,o=0,n=Z.SUM_BY_NONZERO_WEIGHTS){let s=l(e,"multiClassLabels","sigmoidCrossEntropy"),i=l(t,"logits","sigmoidCrossEntropy"),a=null;if(r!=null&&(a=l(r,"weights","sigmoidCrossEntropy")),j(s.shape,i.shape,"Error in sigmoidCrossEntropy: "),o>0){let p=F(o),d=F(1),f=F(.5);s=S(T(s,A(d,p)),T(f,p))}let c=jb(s,i);return mt(c,a,n)}var pp=u({sigmoidCrossEntropy_:Jb});function Xb(e,t,r=-1){if(r===-1&&(r=t.rank-1),r!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${r}`);return Tt((n,s,i)=>{let c=Yn(s,[r],!0),p=A(G(s,"float32"),c);i([n,p]);let d=dt(T(p,n));return{value:z(d,[r]),gradFunc:(x,b)=>{let[E,w]=b,$=ne(x.shape,[r]);return[T(y(x,$),A(G(E,"float32"),Pt(w))),T(y(x,$),A(Pt(w),G(E,"float32")))]}}})(e,t)}function Yb(e,t,r,o=0,n=Z.SUM_BY_NONZERO_WEIGHTS){let s=l(e,"onehotLabels","softmaxCrossEntropy"),i=l(t,"logits","softmaxCrossEntropy"),a=null;if(r!=null&&(a=l(r,"weights","softmaxCrossEntropy")),j(s.shape,i.shape,"Error in softmaxCrossEntropy: "),o>0){let p=F(o),d=F(1),f=F(s.shape[1]);s=S(T(s,A(d,p)),P(p,f))}let c=Xb(s,i);return mt(c,a,n)}var up=u({softmaxCrossEntropy_:Yb});function Zb(e,t,r,o){let n=l(e,"indices","sparseFillEmptyRows","int32"),s=l(t,"values","sparseFillEmptyRows"),i=l(r,"denseShape","sparseFillEmptyRows","int32"),a=l(o,"defaultValue","sparseFillEmptyRows",s.dtype);if(n.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${n.shape}`);if(s.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${s.shape}`);if(i.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${i.shape}`);if(a.rank!==0)throw new Error(`Default value should be a scalar but received shape ${a.shape}`);let c={indices:n,values:s,denseShape:i,defaultValue:a},p=m.runKernel(oc,c);return{outputIndices:p[0],outputValues:p[1],emptyRowIndicator:p[2],reverseIndexMap:p[3]}}var mp=u({sparseFillEmptyRows_:Zb});function Qb(e,t,r){let o=l(e,"inputIndices","sparseReshape","int32"),n=l(t,"inputShape","sparseReshape","int32"),s=l(r,"newShape","sparseReshape","int32");if(o.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${o.shape}`);if(n.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${n.shape}`);if(s.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${s.shape}`);let i={inputIndices:o,inputShape:n,newShape:s},a=m.runKernel(nc,i);return{outputIndices:a[0],outputShape:a[1]}}var fp=u({sparseReshape_:Qb});function ty(e,t,r){let o=l(e,"data","sparseSegmentMean"),n=l(t,"indices","sparseSegmentMean","int32"),s=l(r,"segmentIds","sparseSegmentMean","int32");if(o.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${s.shape}`);let i={data:o,indices:n,segmentIds:s};return m.runKernel(sc,i)}var hp=u({sparseSegmentMean_:ty});function ey(e,t,r){let o=l(e,"data","sparseSegmentSum"),n=l(t,"indices","sparseSegmentSum","int32"),s=l(r,"segmentIds","sparseSegmentSum","int32");if(o.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${s.shape}`);let i={data:o,indices:n,segmentIds:s};return m.runKernel(ic,i)}var dp=u({sparseSegmentSum_:ey});function ry(e,t,r,o,n,s,i,a){let c=l(e,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);let p=l(t,"dataSplits","stringNGrams");if(p.dtype!=="int32")throw new Error("Data splits must be of datatype int32");let d={separator:r,nGramWidths:o,leftPad:n,rightPad:s,padWidth:i,preserveShortSequences:a},f={data:c,dataSplits:p},g=m.runKernel(uc,f,d);return{nGrams:g[0],nGramsSplits:g[1]}}var gp=u({stringNGrams_:ry});function oy(e,t,r=!0){let o=l(e,"input","stringSplit","string"),n=l(t,"delimiter","stringSplit","string");if(o.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${o.shape}`);if(n.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${n.shape}`);let s={skipEmpty:r},i={input:o,delimiter:n},a=m.runKernel(mc,i,s);return{indices:a[0],values:a[1],shape:a[2]}}var xp=u({stringSplit_:oy});function ny(e,t){let r=l(e,"input","stringToHashBucketFast","string"),o={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");let n={input:r};return m.runKernel(fc,n,o)}var bp=u({stringToHashBucketFast_:ny});function sy(e,t,r,o=!0){let n=l(e,"input","staticRegexReplace","string"),s={pattern:t,rewrite:r,replaceGlobal:o};return m.runKernel(lc,{x:n},s)}var yp=u({staticRegexReplace_:sy});var _V={fft:Wr,ifft:wr,rfft:zr,irfft:us},CV={hammingWindow:Fl,hannWindow:_o,frame:Ro,stft:Gl},QV={flipLeftRight:Pl,grayscaleToRGB:Ol,resizeNearestNeighbor:Yl,resizeBilinear:Xl,rgbToGrayscale:Ll,rotateWithOffset:Wl,cropAndResize:Cl,nonMaxSuppression:zl,nonMaxSuppressionAsync:Kl,nonMaxSuppressionWithScore:Vl,nonMaxSuppressionWithScoreAsync:Hl,nonMaxSuppressionPadded:jl,nonMaxSuppressionPaddedAsync:Jl,threshold:Zl,transform:Ql},oH={bandPart:tp,gramSchmidt:ep,qr:op},fH={absoluteDifference:np,computeWeightedLoss:mt,cosineDistance:sp,hingeLoss:ip,huberLoss:ap,logLoss:cp,meanSquaredError:lp,sigmoidCrossEntropy:pp,softmaxCrossEntropy:up},bH={sparseFillEmptyRows:mp,sparseReshape:fp,sparseSegmentMean:hp,sparseSegmentSum:dp},vH={stringNGrams:gp,stringSplit:xp,stringToHashBucketFast:bp,staticRegexReplace:yp};var wp={};xt(wp,{Serializable:()=>Vr,SerializationMap:()=>Co,getRegisteredName:()=>ay,registerClass:()=>ys});var iy=new Map,bs=new Map,Vr=class{getClassName(){return this.constructor.className}static fromConfig(t,r){return new t(r)}},Co=class e{constructor(){this.classNameMap={}}static getMap(){return e.instance==null&&(e.instance=new e),e.instance}static register(t){e.getMap().classNameMap[t.className]=[t,t.fromConfig]}};function ys(e,t,r){h(e.className!=null,()=>"Class being registered does not have the static className property defined."),h(typeof e.className=="string",()=>"className is required to be a string, but got type "+typeof e.className),h(e.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof t>"u"&&(t="Custom"),typeof r>"u"&&(r=e.className);let o=r,n=t+">"+o;return Co.register(e),iy.set(n,e),bs.set(e,n),e}function ay(e){return bs.has(e)?bs.get(e):e.className}var vt=class extends Vr{minimize(t,r=!1,o){let{value:n,grads:s}=this.computeGradients(t,o);if(o!=null){let i=o.map(a=>({name:a.name,tensor:s[a.name]}));this.applyGradients(i)}else this.applyGradients(s);return rt(s),r?n:(n.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(t,r){return Jn(t,r)}dispose(){this.iterations_!=null&&rt(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:F(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(t){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(t){return this.iterations_=(await t[0].tensor.data())[0],t.slice(1)}};Object.defineProperty(vt,Symbol.hasInstance,{value:e=>e.minimize!=null&&e.computeGradients!=null&&e.applyGradients!=null});var Ue=class extends vt{static get className(){return"Adadelta"}constructor(t,r,o=null){super(),this.learningRate=t,this.rho=r,this.epsilon=o,this.accumulatedGrads=[],this.accumulatedUpdates=[],o==null&&(this.epsilon=m.backend.epsilon())}applyGradients(t){(Array.isArray(t)?t.map(o=>o.name):Object.keys(t)).forEach((o,n)=>{let s=m.registeredVariables[o],i=!1;this.accumulatedGrads[n]==null&&(this.accumulatedGrads[n]={originalName:`${o}/accum_grad`,variable:J(()=>st(s).variable(i))}),this.accumulatedUpdates[n]==null&&(this.accumulatedUpdates[n]={originalName:`${o}/accum_var`,variable:J(()=>st(s).variable(i))});let a=Array.isArray(t)?t[n].tensor:t[o];if(a==null)return;let c=this.accumulatedGrads[n].variable,p=this.accumulatedUpdates[n].variable;J(()=>{let d=S(T(c,this.rho),T(pt(a),1-this.rho)),f=T(P(It(S(p,this.epsilon)),It(S(c,this.epsilon))),a),g=S(T(p,this.rho),T(pt(f),1-this.rho));c.assign(d),p.assign(g);let x=S(T(f,-this.learningRate),s);s.assign(x)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(rt(this.accumulatedGrads.map(t=>t.variable)),rt(this.accumulatedUpdates.map(t=>t.variable)))}async getWeights(){let t=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(t.map(r=>({name:r.originalName,tensor:r.variable})))}async setWeights(t){t=await this.extractIterations(t);let r=t.length/2,o=!1;this.accumulatedGrads=t.slice(0,r).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedUpdates=t.slice(r,r*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(t,r){return new t(r.learningRate,r.rho,r.epsilon)}};var Ke=class extends vt{static get className(){return"Adagrad"}constructor(t,r=.1){super(),this.learningRate=t,this.initialAccumulatorValue=r,this.accumulatedGrads=[]}applyGradients(t){(Array.isArray(t)?t.map(o=>o.name):Object.keys(t)).forEach((o,n)=>{let s=m.registeredVariables[o];this.accumulatedGrads[n]==null&&(this.accumulatedGrads[n]={originalName:`${o}/accumulator`,variable:J(()=>oe(s.shape,this.initialAccumulatorValue).variable(!1))});let i=Array.isArray(t)?t[n].tensor:t[o];if(i==null)return;let a=this.accumulatedGrads[n].variable;J(()=>{let c=S(a,pt(i));a.assign(c);let p=S(T(P(i,It(S(c,m.backend.epsilon()))),-this.learningRate),s);s.assign(p)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&rt(this.accumulatedGrads.map(t=>t.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);let r=!1;this.accumulatedGrads=t.map(o=>({originalName:o.name,variable:o.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(t,r){return new t(r.learningRate,r.initialAccumulatorValue)}};var Ve=class extends vt{static get className(){return"Adam"}constructor(t,r,o,n=null){super(),this.learningRate=t,this.beta1=r,this.beta2=o,this.epsilon=n,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],J(()=>{this.accBeta1=F(r).variable(),this.accBeta2=F(o).variable()}),n==null&&(this.epsilon=m.backend.epsilon())}applyGradients(t){let r=Array.isArray(t)?t.map(o=>o.name):Object.keys(t);J(()=>{let o=A(1,this.accBeta1),n=A(1,this.accBeta2);r.forEach((s,i)=>{let a=m.registeredVariables[s],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${s}/m`,variable:J(()=>st(a).variable(c))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${s}/v`,variable:J(()=>st(a).variable(c))});let p=Array.isArray(t)?t[i].tensor:t[s];if(p==null)return;let d=this.accumulatedFirstMoment[i].variable,f=this.accumulatedSecondMoment[i].variable,g=S(T(d,this.beta1),T(p,1-this.beta1)),x=S(T(f,this.beta2),T(pt(p),1-this.beta2)),b=P(g,o),E=P(x,n);d.assign(g),f.assign(x);let w=S(T(P(b,S(It(E),this.epsilon)),-this.learningRate),a);a.assign(w)}),this.accBeta1.assign(T(this.accBeta1,this.beta1)),this.accBeta2.assign(T(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&rt(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedSecondMoment!=null&&rt(this.accumulatedSecondMoment.map(t=>t.variable))}async getWeights(){let t=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(t.map(r=>({name:r.originalName,tensor:r.variable})))}async setWeights(t){t=await this.extractIterations(t),J(()=>{this.accBeta1.assign(xe(this.beta1,this.iterations_+1)),this.accBeta2.assign(xe(this.beta2,this.iterations_+1))});let r=t.length/2,o=!1;this.accumulatedFirstMoment=t.slice(0,r).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedSecondMoment=t.slice(r,r*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(t,r){return new t(r.learningRate,r.beta1,r.beta2,r.epsilon)}};var He=class extends vt{static get className(){return"Adamax"}constructor(t,r,o,n=null,s=0){super(),this.learningRate=t,this.beta1=r,this.beta2=o,this.epsilon=n,this.decay=s,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],J(()=>{this.iteration=F(0).variable(),this.accBeta1=F(r).variable()}),n==null&&(this.epsilon=m.backend.epsilon())}applyGradients(t){let r=Array.isArray(t)?t.map(o=>o.name):Object.keys(t);J(()=>{let o=A(1,this.accBeta1),n=P(-this.learningRate,S(T(this.iteration,this.decay),1));r.forEach((s,i)=>{let a=m.registeredVariables[s],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${s}/m`,variable:st(a).variable(c)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${s}/v`,variable:st(a).variable(c)});let p=Array.isArray(t)?t[i].tensor:t[s];if(p==null)return;let d=this.accumulatedFirstMoment[i].variable,f=this.accumulatedWeightedInfNorm[i].variable,g=S(T(d,this.beta1),T(p,1-this.beta1)),x=T(f,this.beta2),b=lt(p),E=es(x,b);d.assign(g),f.assign(E);let w=S(T(P(n,o),P(g,S(E,this.epsilon))),a);a.assign(w)}),this.iteration.assign(S(this.iteration,1)),this.accBeta1.assign(T(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&rt(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedWeightedInfNorm!=null&&rt(this.accumulatedWeightedInfNorm.map(t=>t.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(t){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(t,r){return new t(r.learningRate,r.beta1,r.beta2,r.epsilon,r.decay)}};var le=class extends vt{static get className(){return"SGD"}constructor(t){super(),this.learningRate=t,this.setLearningRate(t)}applyGradients(t){(Array.isArray(t)?t.map(o=>o.name):Object.keys(t)).forEach((o,n)=>{let s=Array.isArray(t)?t[n].tensor:t[o];if(s==null)return;let i=m.registeredVariables[o];J(()=>{let a=S(T(this.c,s),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(t){this.learningRate=t,this.c!=null&&this.c.dispose(),this.c=zc(F(-t))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(t){if(t=await this.extractIterations(t),t.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(t,r){return new t(r.learningRate)}};var je=class extends le{static get className(){return"Momentum"}constructor(t,r,o=!1){super(t),this.learningRate=t,this.momentum=r,this.useNesterov=o,this.accumulations=[],this.m=F(this.momentum)}applyGradients(t){(Array.isArray(t)?t.map(o=>o.name):Object.keys(t)).forEach((o,n)=>{let s=m.registeredVariables[o];this.accumulations[n]==null&&(this.accumulations[n]={originalName:`${o}/momentum`,variable:J(()=>st(s).variable(!1))});let i=this.accumulations[n].variable,a=Array.isArray(t)?t[n].tensor:t[o];a!=null&&J(()=>{let c,p=S(T(this.m,i),a);this.useNesterov?c=S(T(this.c,S(a,T(p,this.m))),s):c=S(T(this.c,p),s),i.assign(p),s.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&rt(this.accumulations.map(t=>t.variable))}setMomentum(t){this.momentum=t}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);let r=!1;this.accumulations=t.map(o=>({originalName:o.name,variable:o.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(t,r){return new t(r.learningRate,r.momentum,r.useNesterov)}};var Je=class extends vt{static get className(){return"RMSProp"}constructor(t,r=.9,o=0,n=null,s=!1){if(super(),this.learningRate=t,this.decay=r,this.momentum=o,this.epsilon=n,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=s,n==null&&(this.epsilon=m.backend.epsilon()),t==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(t){(Array.isArray(t)?t.map(o=>o.name):Object.keys(t)).forEach((o,n)=>{let s=m.registeredVariables[o],i=!1;this.accumulatedMeanSquares[n]==null&&(this.accumulatedMeanSquares[n]={originalName:`${o}/rms`,variable:J(()=>st(s).variable(i))}),this.accumulatedMoments[n]==null&&(this.accumulatedMoments[n]={originalName:`${o}/momentum`,variable:J(()=>st(s).variable(i))}),this.accumulatedMeanGrads[n]==null&&this.centered&&(this.accumulatedMeanGrads[n]={originalName:`${o}/mg`,variable:J(()=>st(s).variable(i))});let a=Array.isArray(t)?t[n].tensor:t[o];if(a==null)return;let c=this.accumulatedMeanSquares[n].variable,p=this.accumulatedMoments[n].variable;J(()=>{let d=S(T(c,this.decay),T(pt(a),1-this.decay));if(this.centered){let f=this.accumulatedMeanGrads[n].variable,g=S(T(f,this.decay),T(a,1-this.decay)),x=P(T(a,this.learningRate),It(A(d,S(pt(g),this.epsilon)))),b=S(T(p,this.momentum),x);c.assign(d),f.assign(g),p.assign(b);let E=A(s,b);s.assign(E)}else{let f=S(T(c,this.decay),T(pt(a),1-this.decay)),g=S(T(p,this.momentum),P(T(a,this.learningRate),It(S(f,this.epsilon))));c.assign(f),p.assign(g);let x=A(s,g);s.assign(x)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&rt(this.accumulatedMeanSquares.map(t=>t.variable)),this.accumulatedMeanGrads!=null&&this.centered&&rt(this.accumulatedMeanGrads.map(t=>t.variable)),this.accumulatedMoments!=null&&rt(this.accumulatedMoments.map(t=>t.variable))}async getWeights(){let t=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&t.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(t.map(r=>({name:r.originalName,tensor:r.variable})))}async setWeights(t){t=await this.extractIterations(t);let r=this.centered?t.length/3:t.length/2,o=!1;this.accumulatedMeanSquares=t.slice(0,r).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedMoments=t.slice(r,r*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.centered&&(this.accumulatedMeanGrads=t.slice(r*2,r*3).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(t,r){return new t(r.learningRate,r.decay,r.momentum,r.epsilon,r.centered)}};var cy=[Ue,Ke,Ve,He,je,Je,le];function Ep(){for(let e of cy)ys(e)}var Mp={};xt(Mp,{CompositeArrayBuffer:()=>ct,browserFiles:()=>vp,browserHTTPRequest:()=>Np,concatenateArrayBuffers:()=>Zc,copyModel:()=>ml,decodeWeights:()=>uo,decodeWeightsStream:()=>Jc,encodeWeights:()=>Hc,fromMemory:()=>Ip,fromMemorySync:()=>ks,getLoadHandlers:()=>rl,getModelArtifactsForJSON:()=>pr,getModelArtifactsForJSONSync:()=>kn,getModelArtifactsInfoForJSON:()=>zt,getSaveHandlers:()=>el,getWeightSpecs:()=>Br,http:()=>Oo,isHTTPScheme:()=>Po,listModels:()=>pl,loadWeights:()=>kp,moveModel:()=>fl,registerLoadRouter:()=>tl,registerSaveRouter:()=>Qc,removeModel:()=>ul,weightsLoaderFactory:()=>vs,withSaveHandler:()=>Ap,withSaveHandlerSync:()=>Dp});var ly="model",py=".json",uy=".weights.bin";function Tp(e){return new Promise(t=>setTimeout(t)).then(e)}var Tr=class e{constructor(t){if(!N().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");t.startsWith(e.URL_SCHEME)&&(t=t.slice(e.URL_SCHEME.length)),(t==null||t.length===0)&&(t=ly),this.modelJsonFileName=t+py,this.weightDataFileName=t+uy}async save(t){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");let r=ct.join(t.weightData),o=window.URL.createObjectURL(new Blob([r],{type:"application/octet-stream"}));if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{let n=[{paths:["./"+this.weightDataFileName],weights:t.weightSpecs}],s=mo(t,n),i=window.URL.createObjectURL(new Blob([JSON.stringify(s)],{type:"application/json"})),a=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(a.download=this.modelJsonFileName,a.href=i,await Tp(()=>a.dispatchEvent(new MouseEvent("click"))),t.weightData!=null){let c=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;c.download=this.weightDataFileName,c.href=o,await Tp(()=>c.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:zt(t)}}}};Tr.URL_SCHEME="downloads://";var ws=class{constructor(t){if(t==null||t.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${t}`);this.jsonFile=t[0],this.weightsFiles=t.slice(1)}async load(){return new Promise((t,r)=>{let o=new FileReader;o.onload=n=>{let s=JSON.parse(n.target.result),i=s.modelTopology;if(i==null){r(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(s.weightsManifest==null){r(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){t({modelTopology:i});return}let c=pr(s,p=>this.loadWeights(p));t(c)},o.onerror=n=>r(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),o.readAsText(this.jsonFile)})}loadWeights(t){let r=[],o=[];for(let i of t)r.push(...i.weights),o.push(...i.paths);let n=this.checkManifestAndWeightFiles(t),s=o.map(i=>this.loadWeightsFile(i,n[i]));return Promise.all(s).then(i=>[r,i])}loadWeightsFile(t,r){return new Promise((o,n)=>{let s=new FileReader;s.onload=i=>{let a=i.target.result;o(a)},s.onerror=i=>n(`Failed to weights data from file of path '${t}'.`),s.readAsArrayBuffer(r)})}checkManifestAndWeightFiles(t){let r=[],o=this.weightsFiles.map(s=>$n(s.name)),n={};for(let s of t)s.paths.forEach(i=>{let a=$n(i);if(r.indexOf(a)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${a}'`);if(r.push(a),o.indexOf(a)===-1)throw new Error(`Weight file with basename '${a}' is not provided.`);n[i]=this.weightsFiles[o.indexOf(a)]});if(r.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${r.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return n}},my=e=>N().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Tr.URL_SCHEME)?fy(e.slice(Tr.URL_SCHEME.length)):null;nt.registerSaveRouter(my);function fy(e="model"){return new Tr(e)}function vp(e){return new ws(e)}function Es(e,t,r,o){i(e),r=r??0,o=o??1,a(r,o);let n=0,s=c=>(c.then(p=>{let d=r+ ++n/e.length*(o-r);return t(d),p}),c);function i(c){h(c!=null&&Array.isArray(c)&&c.length>0,()=>"promises must be a none empty array")}function a(c,p){h(c>=0&&c<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${c}`),h(p>=0&&p<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${p}`),h(p>=c,()=>`startFraction must be no more than endFraction, but got startFraction ${c} and endFraction ${p}`)}return Promise.all(e.map(s))}async function Ts(e,t){t==null&&(t={});let r=t.fetchFunc==null?N().platform.fetch:t.fetchFunc,o=e.map(f=>r(f,t.requestInit,{isBinary:!0})),n=0,s=.5,a=(t.onProgress==null?await Promise.all(o):await Es(o,t.onProgress,n,s)).map(f=>f.arrayBuffer()),c=.5,p=1;return t.onProgress==null?await Promise.all(a):await Es(a,t.onProgress,c,p)}function $p(e,t){var r;let o=t.fetchFunc==null?N().platform.fetch:t.fetchFunc,n=0,s;return(r=t.onProgress)===null||r===void 0||r.call(t,0),new ReadableStream({pull:async i=>{for(var a;n<e.length;){s||(s=(await o(e[n],t.requestInit,{isBinary:!0})).body.getReader());let{done:c,value:p}=await s.read();if(c){n++,s=void 0,(a=t.onProgress)===null||a===void 0||a.call(t,n/e.length);continue}i.enqueue(p);return}i.close()}})}async function kp(e,t="",r,o){return vs(i=>Ts(i,{requestInit:o}))(e,t,r)}function vs(e){return async(t,r="",o)=>{let n=t.map(()=>!1),s={},i=o!=null?o.map(()=>!1):[],a=[];if(t.forEach((x,b)=>{let E=0;x.weights.forEach(w=>{let $="quantization"in w?w.quantization.dtype:w.dtype,_=te[$]*B(w.shape),v=()=>{n[b]=!0,s[b]==null&&(s[b]=[]),s[b].push({manifestEntry:w,groupOffset:E,sizeBytes:_})};o!=null?o.forEach((I,M)=>{I===w.name&&(v(),i[M]=!0)}):v(),a.push(w.name),E+=_})}),!i.every(x=>x)){let x=o.filter((b,E)=>!i[E]);throw new Error(`Could not find weights in manifest with names: ${x.join(", ")}. 
Manifest JSON has weights with names: ${a.join(", ")}.`)}let c=n.reduce((x,b,E)=>(b&&x.push(E),x),[]),p=[];c.forEach(x=>{t[x].paths.forEach(b=>{let E=r+(r.endsWith("/")?"":"/")+b;p.push(E)})});let d=await e(p),f={},g=0;return c.forEach(x=>{let b=t[x].paths.length,E=new ct(d.slice(g,g+b));s[x].forEach($=>{let _=E.slice($.groupOffset,$.groupOffset+$.sizeBytes),v=uo(_,[$.manifestEntry]);for(let I in v)f[I]=v[I]}),g+=b}),f}}var hy="application/octet-stream",dy="application/json",Hr=class{constructor(t,r){if(this.DEFAULT_METHOD="POST",r==null&&(r={}),this.weightPathPrefix=r.weightPathPrefix,this.weightUrlConverter=r.weightUrlConverter,r.fetchFunc!=null?(h(typeof r.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=r.fetchFunc):this.fetch=N().platform.fetch,h(t!=null&&t.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(t)&&h(t.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${t.length}).`),this.path=t,r.requestInit!=null&&r.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=r.requestInit||{},this.loadOptions=r}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");let r=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);r.body=new FormData;let o=[{paths:["./model.weights.bin"],weights:t.weightSpecs}],n=mo(t,o);if(r.body.append("model.json",new Blob([JSON.stringify(n)],{type:dy}),"model.json"),t.weightData!=null){let i=ct.join(t.weightData);r.body.append("model.weights.bin",new Blob([i],{type:hy}),"model.weights.bin")}let s=await this.fetch(this.path,r);if(s.ok)return{modelArtifactsInfo:zt(t),responses:[s]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${s.status}.`)}async loadModelJSON(){let t=await this.fetch(this.path,this.requestInit);if(!t.ok)throw new Error(`Request to ${this.path} failed with status code ${t.status}. Please verify this URL points to the model JSON of the model to load.`);let r;try{r=await t.json()}catch{let i=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?i+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":i+=" Please make sure the server is serving valid JSON for this request.",new Error(i)}let o=r.modelTopology,n=r.weightsManifest;if(o==null&&n==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return r}async load(){if(this.loadOptions.streamWeights)return this.loadStream();let t=await this.loadModelJSON();return pr(t,r=>this.loadWeights(r))}async loadStream(){let t=await this.loadModelJSON(),r=await this.getWeightUrls(t.weightsManifest),o=Br(t.weightsManifest),n=()=>$p(r,this.loadOptions);return Object.assign(Object.assign({},t),{weightSpecs:o,getWeightStream:n})}async getWeightUrls(t){let r=Array.isArray(this.path)?this.path[1]:this.path,[o,n]=gy(r),s=this.weightPathPrefix||o,i=[],a=[];for(let c of t)for(let p of c.paths)this.weightUrlConverter!=null?a.push(this.weightUrlConverter(p)):i.push(s+p+n);return this.weightUrlConverter&&i.push(...await Promise.all(a)),i}async loadWeights(t){let r=await this.getWeightUrls(t),o=Br(t),n=await Ts(r,this.loadOptions);return[o,n]}};Hr.URL_SCHEME_REGEX=/^https?:\/\//;function gy(e){let t=e.lastIndexOf("/"),r=e.lastIndexOf("?"),o=e.substring(0,t),n=r>t?e.substring(r):"";return[o+"/",n]}function Po(e){return e.match(Hr.URL_SCHEME_REGEX)!=null}var Sp=(e,t)=>{if(typeof fetch>"u"&&(t==null||t.fetchFunc==null))return null;{let r=!0;if(Array.isArray(e)?r=e.every(o=>Po(o)):r=Po(e),r)return Oo(e,t)}return null};nt.registerSaveRouter(Sp);nt.registerLoadRouter(Sp);function Oo(e,t){return new Hr(e,t)}function Np(e,t){return Oo(e,t)}var jr=class{constructor(t){this.modelArtifacts=t}load(){return this.modelArtifacts}},Lo=class{constructor(t){this.saveHandler=t}save(t){return this.saveHandler(t)}},$s=class{constructor(t){t.load&&(this.load=()=>Promise.resolve(t.load())),t.save&&(this.save=r=>Promise.resolve(t.save(r)))}};function Ip(e,t,r,o){let n=arguments;return new $s(ks(...n))}function ks(e,t,r,o){return arguments.length===1?e.modelTopology!=null||e.weightSpecs!=null?new jr(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new jr({modelTopology:e})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new jr({modelTopology:e,weightSpecs:t,weightData:r,trainingConfig:o}))}function Ap(e){return new Lo(e)}function Dp(e){return new Lo(e)}var Rp={};xt(Rp,{confusionMatrix:()=>_p});function xy(e,t,r){let o=l(e,"labels","confusionMatrix"),n=l(t,"predictions","confusionMatrix");h(r==null||r>0&&Number.isInteger(r),()=>`If provided, numClasses must be a positive integer, but got ${r}`),h(o.rank===1,()=>`Expected the rank of labels to be 1, but got ${o.rank}`),h(n.rank===1,()=>`Expected the rank of predictions to be 1, but got ${n.rank}`),h(o.shape[0]===n.shape[0],()=>`Mismatch in the number of examples: ${o.shape[0]} vs. ${n.shape[0]}. Labels and predictions should have the same number of elements.`),h(r>0&&Number.isInteger(r),()=>`numClasses is required to be a positive integer, but got ${r}`);let s=ko(G(o,"int32"),r),i=ko(G(n,"int32"),r),a=Kr(s),c=O(a,i);return G(c,"int32")}var _p=u({confusionMatrix_:xy});var Cp={};xt(Cp,{draw:()=>ky,fromPixels:()=>Sy,fromPixelsAsync:()=>Ty,toPixels:()=>$y});var Xe,Bp=!1;function Fp(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(e==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let r=!1,o=!1,n=!1,s=!1,i=!1,a=!1;if(e.data instanceof Uint8Array)r=!0;else if(typeof ImageData<"u"&&e instanceof ImageData)o=!0;else if(typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement)n=!0;else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement)s=!0;else if(e.getContext!=null)i=!0;else if(typeof ImageBitmap<"u"&&e instanceof ImageBitmap)a=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);if(sr(tn,m.backendName)!=null){let b={pixels:e},E={numChannels:t};return m.runKernel(tn,b,E)}let[p,d]=n?[e.videoWidth,e.videoHeight]:[e.width,e.height],f;if(i)f=e.getContext("2d").getImageData(0,0,p,d).data;else if(o||r)f=e.data;else if(s||n||a){if(Xe==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")Xe=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else Xe=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});Xe.canvas.width=p,Xe.canvas.height=d,Xe.drawImage(e,0,0,p,d),f=Xe.getImageData(0,0,p,d).data}let g;if(t===4)g=new Int32Array(f);else{let b=p*d;g=new Int32Array(b*t);for(let E=0;E<b;E++)for(let w=0;w<t;++w)g[E*t+w]=f[E*4+w]}return hs(g,[d,p,t],"int32")}function by(e){return e!=null&&e.data instanceof Uint8Array}function yy(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function wy(e){return e!=null&&e.width!==0&&e.height!==0}function Ey(e){return yy()&&!(e instanceof ImageBitmap)&&wy(e)&&!by(e)}async function Ty(e,t=3){let r=null;if(N().getBool("WRAP_TO_IMAGEBITMAP")&&Ey(e)){let o;try{o=await createImageBitmap(e,{premultiplyAlpha:"none"})}catch{o=null}o!=null&&o.width===e.width&&o.height===e.height?r=o:r=e}else r=e;return Fp(r,t)}function Gp(e){if(e.rank!==2&&e.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${e.rank}.`);let t=e.rank===2?1:e.shape[2];if(t>4||t===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${t}`);if(e.dtype!=="float32"&&e.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${e.dtype}. Please use float32 or int32 tensors.`)}function vy(e){let t=e?.alpha||1;if(t>1||t<0)throw new Error(`Alpha value ${t} is suppoed to be in range [0 - 1].`)}async function $y(e,t){let r=l(e,"img","toPixels");if(!(e instanceof H)){let p=r;r=G(p,"int32"),p.dispose()}Gp(r);let[o,n]=r.shape.slice(0,2),s=r.rank===2?1:r.shape[2],i=await r.data(),a=r.dtype==="float32"?255:1,c=new Uint8ClampedArray(n*o*4);for(let p=0;p<o*n;++p){let d=[0,0,0,255];for(let g=0;g<s;g++){let x=i[p*s+g];if(r.dtype==="float32"){if(x<0||x>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${x}.`)}else if(r.dtype==="int32"&&(x<0||x>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${x}.`);s===1?(d[0]=x*a,d[1]=x*a,d[2]=x*a):d[g]=x*a}let f=p*4;c[f+0]=Math.round(d[0]),c[f+1]=Math.round(d[1]),c[f+2]=Math.round(d[2]),c[f+3]=Math.round(d[3])}if(t!=null){Bp||sr(Qo,m.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),Bp=!0),t.width=n,t.height=o;let p=t.getContext("2d"),d=new ImageData(c,n,o);p.putImageData(d,0,0)}return r!==e&&r.dispose(),c}function ky(e,t,r){let o=l(e,"img","draw");if(!(e instanceof H)){let i=o;o=G(i,"int32"),i.dispose()}Gp(o),vy(r?.imageOptions);let n={image:o},s={canvas:t,options:r};m.runKernel(Qo,n,s)}var Sy=u({fromPixels_:Fp});var Op={};xt(Op,{prepareAndValidate:()=>Pp});function Pp(e,t){let r=e.shape.length,o=t.shape.length;if(r<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${r}.`);if(o<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${o}.`);if(t.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[o-1]>r)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[o-1]} vs. ${r}`);if(B(e.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);let n=t.shape,s=n[n.length-1],i=1;for(let f=0;f<n.length-1;++f)i*=n[f];let a=e.shape,c=n.slice();c.pop();let p=1;for(let f=s;f<r;++f)p*=a[f],c.push(a[f]);let d=[...Lt(e.shape).map(f=>f/p),1].slice(0,s);return[c,i,p,d]}var Wo={};xt(Wo,{assertParamsValid:()=>Iy,computeFlatOffset:()=>Ry,computeOutShape:()=>Dy,getNormalizedAxes:()=>My,isSliceContinous:()=>_y,maskToAxes:()=>Ay,parseSliceParams:()=>By,sliceInfo:()=>Fy,startForAxis:()=>Hp,startIndicesWithElidedDims:()=>Up,stopForAxis:()=>jp,stopIndicesWithElidedDims:()=>Kp,stridesForAxis:()=>Vp,stridesWithElidedDims:()=>Wp});var Ss=-2,Ny=-1;function Iy(e,t,r){let o=e.shape.length;h(o===t.length,()=>`Error in slice${o}D: Length of begin ${t} must match the rank of the array (${o}).`),h(o===r.length,()=>`Error in slice${o}D: Length of size ${r} must match the rank of the array (${o}).`);for(let n=0;n<o;++n)h(t[n]+r[n]<=e.shape[n],()=>`Error in slice${o}D: begin[${n}] + size[${n}] (${t[n]+r[n]}) would overflow input.shape[${n}] (${e.shape[n]})`)}function Ay(e){let t=[],r=0;for(;e>0;)e&1&&t.push(r),e/=2,r++;return t}function Dy(e,t,r){let o=[];for(let n=0;n<e.length;n++)o[n]=Math.ceil((t[n]-e[n])/r[n]);return o}function Wp(e,t,r,o){let n=[...e];for(let s=n.length;s<o.length;s++)n.push(1);for(let s=0;s<r;s++)s===0?n[t]=1:(n.splice(t,0,1),n.pop());return n}function zp(e,t,r){return r<=e?r:r-(t-1)}function qp(e,t){let r=[];for(let o=0;o<e;o++)r.push(t+o);return r}function My(e,t,r,o,n,s,i,a,c){let p=e.length,d=new Array(p),f=new Array(p),g=new Array(p);if(t.length&&r>0){let x=t[0],b=r+1;d=Up(i,x,b,o,e),f=Kp(a,x,b,n,e),g=Wp(s,x,b,e)}else for(let x=0;x<p;x++)d[x]=Hp(i,o,s,e,x,c),f[x]=jp(a,n,s,e,x,c),g[x]=Vp(s,x,c);return{begin:d,end:f,strides:g}}function Up(e,t,r,o,n){let s=[...n],i=qp(r,t);for(let a=0;a<s.length;a++)if(i.indexOf(a)>-1)s[a]=0;else{let c=zp(t,r,a),p=o[c];e&1<<c&&(p=0),s[a]=p}return s}function Kp(e,t,r,o,n){let s=[...n],i=qp(r,t);for(let a=0;a<s.length;a++)if(i.indexOf(a)>-1)s[a]=Number.MAX_SAFE_INTEGER;else{let c=zp(t,r,a),p=o[c];e&1<<c&&(p=Number.MAX_SAFE_INTEGER),s[a]=p}for(let a=0;a<s.length;a++){let c=n[a];s[a]<0&&(s[a]+=c),s[a]=tr(0,s[a],n[a])}return s}function Vp(e,t,r){let o=e[t];return(r&1<<t||o==null)&&(o=1),o}function Hp(e,t,r,o,n,s){let i=t[n],a=r[n]||1;(e&1<<n||s&1<<n||i==null)&&(a>0?i=Number.MIN_SAFE_INTEGER:i=Number.MAX_SAFE_INTEGER);let c=o[n];return i<0&&(i+=c),i=tr(0,i,c-1),i}function jp(e,t,r,o,n,s){let i=t[n],a=r[n]||1;(e&1<<n||s&1<<n||i==null)&&(a>0?i=Number.MAX_SAFE_INTEGER:i=Number.MIN_SAFE_INTEGER);let c=o[n];return i<0&&(i+=c),a>0?i=tr(0,i,c):i=tr(-1,i,c-1),i}function _y(e,t,r){let o=r.length;for(let n=0;n<r.length;n++)if(r[n]>1){o=n;break}for(let n=o+1;n<r.length;n++)if(t[n]>0||r[n]!==e[n])return!1;return!0}function Ry(e,t){let r=e.length>0?e[e.length-1]:1;for(let o=0;o<e.length-1;o++)r+=e[o]*t[o];return r}function By(e,t,r){let o,n=e.shape.length;typeof t=="number"?o=[t,...new Array(n-1).fill(0)]:t.length<n?o=t.concat(new Array(n-t.length).fill(0)):o=t.slice(),o.forEach(i=>{h(i!==-1,()=>"slice() does not support negative begin indexing.")});let s;return r==null?s=new Array(n).fill(-1):typeof r=="number"?s=[r,...new Array(n-1).fill(-1)]:r.length<n?s=r.concat(new Array(n-r.length).fill(-1)):s=r,s=s.map((i,a)=>i>=0?i:(h(i===-1,()=>`Negative size values should be exactly -1 but got ${i} for the slice() size at index ${a}.`),e.shape[a]-o[a])),[o,s]}function Fy(e,t,r,o,n,s,i,a,c){let p;if(o==null?(p=new Array(t.length),p.fill(1)):p=o,i!=null&&i&i-1)throw new Error("Multiple ellipses in slice is not allowed.");let d=!1,f={dims:p.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:r.slice(),strides:p.slice(),beginMask:n,endMask:s,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};for(let v=0;v<f.dims;v++)d&&1<<v&a&&f.numAddAxisAfterEllipsis++,1<<v&i&&(d=!0);d||(f.ellipsisMask|=1<<f.dims,f.dims++);let g={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};Gy(f,g);let x=!0,b=!0,E=!0,w=[],$=[];for(let v=0;v<e.length;++v){if(g.strides[v]===0)throw Error(`strides[${v}] must be non-zero`);let I=!!(g.shrinkAxisMask&1<<v),M=e[v];if(M===-1){w.push(I?1:-1);continue}let D=[g.beginMask&1<<v,g.endMask&1<<v],U=[g.strides[v]>0?0:-1,g.strides[v]>0?M:M-1];if(I&&g.strides[v]<=0)throw Error("only stride 1 allowed on non-range indexing.");E=E&&g.strides[v]===1;let q=!!(g.beginMask&1<<v&&g.endMask&1<<v);if(g.beginValid&&g.endValid){if(I){let ot=g.begin[v]<0?M+g.begin[v]:g.begin[v];if(g.begin[v]=ot,g.end[v]=g.begin[v]+1,ot<0||ot>=M)throw Error(`slice index ${g.begin[v]} of dimension ${v} out of bounds.`)}else g.begin[v]=Lp(g.begin[v],0,g.strides[v],M,D,U),g.end[v]=Lp(g.end[v],1,g.strides[v],M,D,U);let K=g.strides[v]===1&&g.begin[v]===0&&g.end[v]===M;x=x&&K,b=b&&(v===0&&g.strides[v]===1||K)}else x=x&&g.strides[v]===1&&q,b=b&&(v===0&&g.strides[v]===1||q);let C,V=!1;if(g.beginValid&&g.endValid?(C=g.end[v]-g.begin[v],V=!0):I?(C=1,V=!0):q&&M>=0&&(g.strides[v]<0?C=-M:C=M,V=!0),V){let K;C===0||C<0!=g.strides[v]<0?K=0:K=Math.trunc(C/g.strides[v])+(C%g.strides[v]!==0?1:0),w.push(K)}else w.push(-1)}for(let v=0;v<g.finalShapeGatherIndices.length;++v){let I=g.finalShapeGatherIndices[v];I>=0?$.push(w[I]):I===Ss&&$.push(1)}return{finalShapeSparse:$.filter((v,I)=>g.finalShapeGatherIndices[I]!==Ss),finalShape:$,isIdentity:x,sliceDim0:b,isSimpleSlice:E,begin:g.begin,end:g.end,strides:g.strides}}function Gy(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let r=0;t.beginValid=e.begin!=null,t.endValid=e.end!=null,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let o=0;o<e.dims;o++)if(1<<o&e.ellipsisMask){let n=Math.min(t.dims-(e.dims-o)+1+e.numAddAxisAfterEllipsis,t.dims);for(;r<n;r++)t.begin[r]=0,t.end[r]=0,t.strides[r]=1,t.beginMask|=1<<r,t.endMask|=1<<r,t.finalShapeGatherIndices.push(r),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[r]=o}else if(1<<o&e.newAxisMask)t.finalShapeGatherIndices.push(Ss),t.finalShapeGatherIndicesSparse.push(-1);else{if(r===t.begin.length)throw Error(`Index out of range using input dim ${r}; input has only ${t.dims} dims, ${t.begin.length}.`);e.begin!=null&&(t.begin[r]=e.begin[o]),e.end!=null&&(t.end[r]=e.end[o]),t.strides[r]=e.strides[o],e.beginMask&1<<o&&(t.beginMask|=1<<r),e.endMask&1<<o&&(t.endMask|=1<<r),e.shrinkAxisMask&1<<o?(t.finalShapeGatherIndices.push(Ny),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<r):(t.finalShapeGatherIndices.push(r),t.finalShapeGatherIndicesSparse.push(o)),t.inputShapeGatherIndicesSparse[r]=o,r++}}function Lp(e,t,r,o,n,s){if(n[t])return r>0?s[t]:s[t+1&1];{let i=e<0?o+e:e;return i<s[0]?s[0]:i>s[1]?s[1]:i}}var Cy="4.17.0";var Jr=class{static sgd(t){return new le(t)}static momentum(t,r,o=!1){return new je(t,r,o)}static rmsprop(t,r=.9,o=0,n=null,s=!1){return new Je(t,r,o,n,s)}static adam(t=.001,r=.9,o=.999,n=null){return new Ve(t,r,o,n)}static adadelta(t=.001,r=.95,o=null){return new Ue(t,r,o)}static adamax(t=.002,r=.9,o=.999,n=null,s=0){return new He(t,r,o,n,s)}static adagrad(t,r=.1){return new Ke(t,r)}};var tX=Jr;var Py=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof __setImmediate$<"u"?__setImmediate$:e=>e();function Oy(){return new Promise(e=>Py(()=>e()))}var Yp={};xt(Yp,{ERF_A1:()=>rw,ERF_A2:()=>ow,ERF_A3:()=>nw,ERF_A4:()=>sw,ERF_A5:()=>iw,ERF_P:()=>ew,PARALLELIZE_THRESHOLD:()=>zo,RowPartitionType:()=>jt,SELU_SCALE:()=>tw,SELU_SCALEALPHA:()=>Qy,applyActivation:()=>ze,assertAndGetBroadcastShape:()=>L,assertAxesAreInnerMostDims:()=>wh,assertParamsConsistent:()=>Ly,assignToTypedArray:()=>mw,axesAreInnerMostDims:()=>zn,calculateShapes:()=>$l,checkEinsumDimSizes:()=>bw,checkPadOnDimRoundingMode:()=>tt,combineLocations:()=>yl,combineRaggedTensorToTensorShapes:()=>zy,complexWithEvenIndex:()=>lw,complexWithOddIndex:()=>pw,computeConv2DInfo:()=>De,computeConv3DInfo:()=>hl,computeDefaultPad:()=>Gn,computeDilation2DInfo:()=>zm,computeOptimalWindowSize:()=>Vy,computeOutAndReduceShapes:()=>yh,computeOutShape:()=>Wy,computePool2DInfo:()=>Fn,computePool3DInfo:()=>qm,convertConv2DDataFormat:()=>dl,decodeEinsumEquation:()=>gw,eitherStridesOrDilationsAreOne:()=>ht,expandShapeToKeepDim:()=>ne,exponent:()=>hw,exponents:()=>fw,fromStringArrayToUint8:()=>Ow,fromUint8ToStringArray:()=>Pw,getAxesPermutation:()=>Eh,getBroadcastDims:()=>bl,getComplexWithIndex:()=>uw,getEinsumComputePath:()=>yw,getEinsumPermutation:()=>xw,getFusedBiasGradient:()=>We,getFusedDyActivation:()=>Le,getImageCenter:()=>Hy,getInnerMostAxes:()=>vh,getPermuted:()=>Jy,getRaggedRank:()=>Uy,getReductionAxes:()=>yo,getReshaped:()=>jy,getReshapedPermuted:()=>Xy,getRowPartitionTypesHelper:()=>qy,getSliceBeginCoords:()=>Yy,getSliceSize:()=>Zy,getSparseFillEmptyRowsIndicesDenseShapeMismatch:()=>vw,getSparseFillEmptyRowsNegativeIndexErrorMessage:()=>$w,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:()=>kw,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:()=>Iw,getSparseReshapeInputOutputMismatchErrorMessage:()=>Dw,getSparseReshapeInputOutputMultipleErrorMessage:()=>Aw,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:()=>Sw,getSparseReshapeNegativeOutputDimErrorMessage:()=>Nw,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:()=>Bw,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:()=>Mw,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:()=>_w,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:()=>Rw,getUndoAxesPermutation:()=>Th,isIdentityPermutation:()=>ww,log:()=>Tu,mergeRealAndImagArrays:()=>aw,prepareAndValidate:()=>Pp,prepareSplitSize:()=>Tw,segment_util:()=>Is,shouldFuse:()=>qe,slice_util:()=>Wo,splitRealAndImagArrays:()=>cw,stridesOrDilationsArePositive:()=>Kt,tupleValuesAreOne:()=>Ae,upcastType:()=>lr,validateDefaultValueShape:()=>Ky,validateInput:()=>Er,validateUpdateShape:()=>ds,warn:()=>Wt});function Ly(e,t){let r=e[0].length;e.forEach((n,s)=>{h(n.length===r,()=>`Error in concat${r}D: rank of tensors[${s}] must be the same as the rank of the rest (${r})`)}),h(t>=0&&t<r,()=>`Error in concat${r}D: axis must be between 0 and ${r-1}.`);let o=e[0];e.forEach((n,s)=>{for(let i=0;i<r;i++)h(i===t||n[i]===o[i],()=>`Error in concat${r}D: Shape of tensors[${s}] (${n}) does not match the shape of the rest (${o}) along the non-concatenated axis ${s}.`)})}function Wy(e,t){let r=e[0].slice();for(let o=1;o<e.length;o++)r[t]+=e[o][t];return r}var jt;(function(e){e[e.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",e[e.VALUE_ROWIDS=1]="VALUE_ROWIDS",e[e.ROW_LENGTHS=2]="ROW_LENGTHS",e[e.ROW_SPLITS=3]="ROW_SPLITS",e[e.ROW_LIMITS=4]="ROW_LIMITS",e[e.ROW_STARTS=5]="ROW_STARTS"})(jt||(jt={}));function zy(e,t,r){let o=new Array;if(r==null&&t==null)return o;if(t==null)for(;o.length<e+r.length;)o.push(-1);else o=t.slice();if(r==null)return o;if(e+r.length!==o.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+r.length}, but shape.rank = ${o.length}`);for(let n=1;n<r.length;++n){let s=r[n],i=o[o.length-r.length+n],a=o[i];if(s>=0)if(a>=0){if(a!==s)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${n+e}] = ${s} but shape[${n+e}] = ${a}`)}else o[i]=s}return o}function qy(e){let t={FIRST_DIM_SIZE:jt.FIRST_DIM_SIZE,VALUE_ROWIDS:jt.VALUE_ROWIDS,ROW_LENGTHS:jt.ROW_LENGTHS,ROW_SPLITS:jt.ROW_SPLITS,ROW_LIMITS:jt.ROW_LIMITS,ROW_STARTS:jt.ROW_STARTS},r=[];for(let o of e)if(o in t)r.push(t[o]);else break;return r}function Uy(e){return e.length===0?0:e[0]===jt.FIRST_DIM_SIZE?e.length-1:e.length}function Ky(e,t){if(e==null||t==null)return;let r=e.length,o=t.length;if(r>=o)throw new Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${r} must be less than ragged tensor input flatValues.rank = ${o})`);for(let n=0;n<Math.min(r,o-1);++n){let s=e[n],i=t[n+1];if(s>=0&&i>=0&&s!==1&&s!==i)throw new Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${n-e.length}] = ${s} but ragged tensor input.flatValues.shape[${n-e.length}] = ${i}`)}}var zo=30;function Vy(e){return e<=zo?e:rr(e,Math.floor(Math.sqrt(e)))}function Hy(e,t,r){let o=r*(typeof e=="number"?e:e[0]),n=t*(typeof e=="number"?e:e[1]);return[o,n]}function jy(e,t,r,o=!0){let n=[];if(o)n=n.concat(t.slice(0)),n.push(e[0]/r),n=n.concat(e.slice(1));else{n=n.concat(e[0]);let s=t.length;for(let i=0;i<s;++i)n=n.concat([e[i+1]/t[i],t[i]]);n=n.concat(e.slice(s+1))}return n}function Jy(e,t,r=!0){let o=[];if(r){o.push(t);for(let n=t+1;n<e;++n)n<=2*t?(o.push(n),o.push(n-(t+1))):o.push(n)}else{let n=[],s=[];for(let i=1;i<e;++i)i>=t*2+1||i%2===1?s.push(i):n.push(i);o.push(...n),o.push(0),o.push(...s)}return o}function Xy(e,t,r,o=!0){let n=[];o?n.push(e[0]/r):n.push(e[0]*r);for(let s=1;s<e.length;++s)s<=t.length?o?n.push(t[s-1]*e[s]):n.push(e[s]/t[s-1]):n.push(e[s]);return n}function Yy(e,t){let r=[0];for(let o=0;o<t;++o)r.push(e[o][0]);return r}function Zy(e,t,r){let o=e.slice(0,1);for(let n=0;n<r;++n)o.push(e[n+1]-t[n][0]-t[n][1]);return o}var Qy=1.7580993408473768,tw=1.0507009873554805;var ew=.3275911,rw=.254829592,ow=-.284496736,nw=1.421413741,sw=-1.453152027,iw=1.061405429;function aw(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);let r=new Float32Array(e.length*2);for(let o=0;o<r.length;o+=2)r[o]=e[o/2],r[o+1]=t[o/2];return r}function cw(e){let t=new Float32Array(e.length/2),r=new Float32Array(e.length/2);for(let o=0;o<e.length;o+=2)t[o/2]=e[o],r[o/2]=e[o+1];return{real:t,imag:r}}function lw(e){let t=Math.ceil(e.length/4),r=new Float32Array(t),o=new Float32Array(t);for(let n=0;n<e.length;n+=4)r[Math.floor(n/4)]=e[n],o[Math.floor(n/4)]=e[n+1];return{real:r,imag:o}}function pw(e){let t=Math.floor(e.length/4),r=new Float32Array(t),o=new Float32Array(t);for(let n=2;n<e.length;n+=4)r[Math.floor(n/4)]=e[n],o[Math.floor(n/4)]=e[n+1];return{real:r,imag:o}}function uw(e,t){let r=e[t*2],o=e[t*2+1];return{real:r,imag:o}}function mw(e,t,r,o){e[o*2]=t,e[o*2+1]=r}function fw(e,t){let r=new Float32Array(e/2),o=new Float32Array(e/2);for(let n=0;n<Math.ceil(e/2);n++){let s=(t?2:-2)*Math.PI*(n/e);r[n]=Math.cos(s),o[n]=Math.sin(s)}return{real:r,imag:o}}function hw(e,t,r){let o=(r?2:-2)*Math.PI*(e/t),n=Math.cos(o),s=Math.sin(o);return{real:n,imag:s}}var Ns="->",dw=/->/g,Jp=",",Xp="...";function gw(e,t){e=e.replace(/\s/g,"");let r=(e.length-e.replace(dw,"").length)/Ns.length;if(r<1)throw new Error("Equations without an arrow are not supported.");if(r>1)throw new Error(`Equation must contain exactly one arrow ("${Ns}").`);let[o,n]=e.split(Ns);h(o.indexOf(Xp)===-1,()=>`The ellipsis notation ("${Xp}") is not supported yet.`);let s=o.split(Jp),i=s.length;if(t!==i)throw new Error(`Expected ${i} input tensors, received ${t}`);if(i>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");let a=[];for(let g=0;g<n.length;++g){let x=n[g];if(!s.some(b=>b.indexOf(x)!==-1))throw new Error(`Output subscripts contain the label ${x} not present in the input subscripts.`);a.indexOf(x)===-1&&a.push(x)}for(let g=0;g<o.length;++g){let x=o[g];a.indexOf(x)===-1&&x!==Jp&&a.push(x)}let c=new Array(s.length);for(let g=0;g<i;++g){if(new Set(s[g].split("")).size!==s[g].length)throw new Error(`Found duplicate axes in input component ${s[g]}. Support for duplicate axes in input is not implemented yet.`);c[g]=[];for(let x=0;x<s[g].length;++x)c[g].push(a.indexOf(s[g][x]))}let p=a.length,d=n.length,f=[];for(let g=d;g<p;++g)f.push(g);return{allDims:a,summedDims:f,idDims:c}}function xw(e,t){let r=new Array(e);r.fill(-1);for(let n=0;n<t.length;++n)r[t[n]]=n;let o=[];for(let n=0;n<e;++n)r[n]===-1&&o.push(n);return r=r.filter(n=>n!==-1),{permutationIndices:r,expandDims:o}}function bw(e,t,r){let o=new Array(e);for(let n=0;n<r.length;++n){let s=r[n].shape;for(let i=0;i<t[n].length;++i)o[t[n][i]]===void 0?o[t[n][i]]=s[i]:h(o[t[n][i]]===s[i],()=>`Expected dimension ${o[t[n][i]]} at axis ${i} of input shaped ${JSON.stringify(s)}, but got dimension ${s[i]}`)}}function yw(e,t){let r=e,o=[],n=0;e.length===0&&r.push(-1),n=e.length+1;for(let i=0;i<n;++i)o.push([]);let s=[];for(let i=0;i<r.length;++i){let a=r[i],c=Ew(t,a);for(let p of c)s.indexOf(p)===-1&&(o[i].push(p),s.push(p))}return{path:r,steps:o}}function ww(e){return e.every((t,r)=>t===r)}function Ew(e,t){let r=[];for(let o=0;o<e.length;++o)(e[o].length===0||e[o].indexOf(t)!==-1||t===-1)&&r.push(o);return r}function Tw(e,t,r=0){let o=[];if(typeof t=="number")h(e.shape[r]%t===0,()=>"Number of splits must evenly divide the axis."),o=new Array(t).fill(e.shape[r]/t);else{let n=t.reduce((i,a)=>(a===-1&&(i+=1),i),0);h(n<=1,()=>"There should be only one negative value in split array.");let s=t.indexOf(-1);if(s!==-1){let i=t.reduce((a,c)=>c>0?a+c:a);t[s]=e.shape[r]-i}h(e.shape[r]===t.reduce((i,a)=>i+a),()=>"The sum of sizes must match the size of the axis dimension."),o=t}return o}function vw(e){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${e}`}function $w(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`}function kw(e,t,r){return`indices(${e}, 0) is invalid: ${t} >= ${r}`}function Sw(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`}function Nw(e,t){return`size ${e} must be non-negative, not ${t}`}function Iw(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function Aw(e,t){let r=B(e),o=B(t);return`Input to reshape is a SparseTensor with ${r}
  dense values, but the requested shape requires a multiple of ${o}. inputShape=${e} outputShape= ${t}`}function Dw(e,t){let r=B(e),o=B(t);return`Input to reshape is a tensor with ${r} dense values, but the requested shape has ${o}. inputShape=${e} outputShape=${t}`}function Mw(){return"segment ids must be >= 0"}function _w(){return"segment ids are not increasing"}function Rw(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`}function Bw(e,t,r){return`Bad: indices[${e}] == ${t} out of range [0, ${r})`}var Is={};xt(Is,{collectGatherOpShapeInfo:()=>Cw,computeOutShape:()=>Gw,segOpComputeOptimalWindowSize:()=>Fw});function Fw(e,t){let r=!1,o;for(e<=zo?(o=e,r=!0):o=rr(e,Math.floor(Math.sqrt(e)));!r;)o>t||o===e?r=!0:o=rr(e,o+1);return o}function Gw(e,t,r){let o=[],n=e.length;for(let s=0;s<n;s++)s!==t?o.push(e[s]):o.push(r);return o}function Cw(e,t,r,o){let n=t.shape.length,s=e.shape.length;if(o!==0&&(o<-n||o>n))throw new Error(`Expect batchDims in the range of [-${n}, ${n}], but got ${o}`);if(o<0&&(o+=n),o>s)throw new Error(`batchDims (${o}) must be less than rank(x) (
    ${s}).`);if(r<o)throw new Error(`batchDims (${o}) must be less than or equal to axis (${r}).`);for(let f=0;f<o;++f)if(e.shape[f]!==t.shape[f])throw new Error(`x.shape[${f}]: ${e.shape[f]} should be equal to indices.shape[${f}]: ${t.shape[f]}.`);let i=e.shape[r],a=[],c=1,p=1,d=1;for(let f=0;f<o;++f)a.push(e.shape[f]),c*=e.shape[f];for(let f=o;f<r;f++)a.push(e.shape[f]),p*=e.shape[f];for(let f=o;f<n;f++)a.push(t.shape[f]);for(let f=r+1;f<s;f++)a.push(e.shape[f]),d*=e.shape[f];return{batchSize:c,sliceSize:d,outerSize:p,dimSize:i,outputShape:a}}function Pw(e){try{return e.map(t=>ar(t))}catch(t){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${t}`)}}function Ow(e){return e.map(t=>fe(t))}var Zp={};xt(Zp,{nonMaxSuppressionV3Impl:()=>Bo,nonMaxSuppressionV4Impl:()=>Fo,nonMaxSuppressionV5Impl:()=>Go,whereImpl:()=>Do});Ep();export{Gs as Abs,Cs as Acos,Ps as Acosh,Ue as AdadeltaOptimizer,Ke as AdagradOptimizer,Ve as AdamOptimizer,He as AdamaxOptimizer,Zr as Add,Os as AddN,Ls as All,Ws as Any,zs as ArgMax,qs as ArgMin,Us as Asin,Ks as Asinh,Vs as Atan,js as Atan2,Hs as Atanh,Js as AvgPool,Xs as AvgPool3D,Vw as AvgPool3DGrad,Kw as AvgPoolGrad,Ys as BatchMatMul,Zs as BatchToSpaceND,Qs as Bincount,ti as BitwiseAnd,ei as BroadcastArgs,Hw as BroadcastTo,Qr as Cast,ri as Ceil,oi as ClipByValue,ni as Complex,si as ComplexAbs,ii as Concat,ai as Conv2D,ci as Conv2DBackpropFilter,li as Conv2DBackpropInput,pi as Conv3D,jw as Conv3DBackpropFilterV2,ui as Conv3DBackpropInputV2,mi as Cos,fi as Cosh,gi as CropAndResize,hi as Cumprod,di as Cumsum,qo as DataStorage,xi as DenseBincount,bi as DepthToSpace,yi as DepthwiseConv2dNative,wi as DepthwiseConv2dNativeBackpropFilter,Ei as DepthwiseConv2dNativeBackpropInput,Ti as Diag,vi as Dilation2D,Xw as Dilation2DBackpropFilter,Jw as Dilation2DBackpropInput,Qo as Draw,Xo as ENV,ki as Einsum,Si as Elu,Yw as EluGrad,kr as Environment,Ii as Equal,Ni as Erf,Ai as Exp,Di as ExpandDims,Mi as Expm1,_i as FFT,Ri as Fill,Bi as FlipLeftRight,Fi as Floor,Gi as FloorDiv,tn as FromPixels,Ci as FusedBatchNorm,rn as FusedConv2D,on as FusedDepthwiseConv2D,Oi as GatherNd,Pi as GatherV2,Li as Greater,Wi as GreaterEqual,zi as IFFT,to as Identity,qi as Imag,Ui as IsFinite,Ki as IsInf,Vi as IsNan,vr as KernelBackend,ra as LRN,eE as LRNGrad,Hi as LeakyRelu,ji as Less,Ji as LessEqual,Xi as LinSpace,Yi as Log,Zi as Log1p,Qw as LogSoftmax,Qi as LogicalAnd,ta as LogicalNot,ea as LogicalOr,Zw as LogicalXor,tE as LowerBound,rE as MatrixBandPart,oa as Max,sa as MaxPool,ia as MaxPool3D,nE as MaxPool3DGrad,oE as MaxPoolGrad,aa as MaxPoolWithArgmax,na as Maximum,ca as Mean,la as Min,pa as Minimum,ua as MirrorPad,ma as Mod,je as MomentumOptimizer,fa as Multinomial,ha as Multiply,da as Neg,xa as NonMaxSuppressionV3,ba as NonMaxSuppressionV4,ya as NonMaxSuppressionV5,ga as NotEqual,Wc as OP_SCOPE_SUFFIX,Ea as OneHot,wa as OnesLike,vt as Optimizer,Jr as OptimizerConstructors,Ta as Pack,va as PadV2,sE as Pool,$a as Pow,ka as Prelu,Sa as Prod,Je as RMSPropOptimizer,Na as RaggedGather,Ia as RaggedRange,Aa as RaggedTensorToTensor,Da as Range,mn as Rank,Ma as Real,$i as RealDiv,_a as Reciprocal,Z as Reduction,Ra as Relu,Ca as Relu6,Ba as Reshape,Ga as ResizeBilinear,aE as ResizeBilinearGrad,Fa as ResizeNearestNeighbor,iE as ResizeNearestNeighborGrad,Pa as Reverse,$c as RotateWithOffset,Oa as Round,La as Rsqrt,le as SGDOptimizer,Wa as ScatterNd,qa as SearchSorted,Ua as Select,Ka as Selu,Xa as Sigmoid,Ja as Sign,Ha as Sin,ja as Sinh,Va as Slice,rc as Softmax,Ya as Softplus,tc as SpaceToBatchND,oc as SparseFillEmptyRows,nc as SparseReshape,sc as SparseSegmentMean,ic as SparseSegmentSum,ac as SparseToDense,ec as SplitV,Za as Sqrt,cE as Square,cc as SquaredDifference,lc as StaticRegexReplace,vc as Step,pc as StridedSlice,uc as StringNGrams,mc as StringSplit,fc as StringToHashBucketFast,hc as Sub,Qa as Sum,dc as Tan,gc as Tanh,H as Tensor,he as TensorBuffer,za as TensorScatterUpdate,eo as Tile,xc as TopK,bc as Transform,ro as Transpose,yc as Unique,wc as Unpack,Ec as UnsortedSegmentSum,lE as UpperBound,Yt as Variable,Tc as ZerosLike,en as _FusedMatMul,lt as abs,ym as acos,Em as acosh,S as add,vm as addN,km as all,Nm as any,Am as argMax,Mm as argMin,Rm as asin,Fm as asinh,Cm as atan,Om as atan2,Wm as atanh,Cn as avgPool,Ym as avgPool3d,Uc as backend,Yp as backend_util,nf as basicLSTMCell,Me as batchNorm,lf as batchNorm2d,uf as batchNorm3d,ff as batchNorm4d,Pn as batchToSpaceND,On as bincount,gf as bitwiseAnd,fO as booleanMaskAsync,bf as broadcastArgs,Cr as broadcastTo,hr as broadcast_util,Cp as browser,Et as buffer,G as cast,Ef as ceil,vf as clipByValue,Ct as clone,Nt as complex,et as concat,kf as concat1d,Nf as concat2d,Af as concat3d,Mf as concat4d,Bf as conv1d,_e as conv2d,Cf as conv2dTranspose,Of as conv3d,zf as conv3dTranspose,xE as copyRegisteredKernels,Uf as cos,Vf as cosh,Mo as cosineWindow,jf as cumprod,Xf as cumsum,Tt as customGrad,Zf as denseBincount,Vu as deprecationWarn,th as depthToSpace,Pr as depthwiseConv2d,Tn as device_util,oh as diag,sh as dilation2d,NT as disableDeprecationWarnings,rt as dispose,IT as disposeVariables,P as div,ph as divNoNan,mh as dot,mL as dropout,Re as einsum,Wn as elu,ST as enableDebugMode,kT as enableProdMode,Nl as enclosingPowerOfTwo,AT as engine,gh as ensureShape,N as env,Ln as equal,bh as erf,Rh as euclideanNorm,Pt as exp,Ht as expandDims,Ch as expm1,qn as eye,Wr as fft,oe as fill,GT as findBackend,CT as findBackendFactory,Un as floor,Rn as floorDiv,Bl as fused,Kn as gather,tL as gatherND,Op as gather_util,qc as getBackend,nn as getGradient,sr as getKernel,oo as getKernelsForBackend,sd as grad,id as grads,gr as greater,Vn as greaterEqual,wr as ifft,Fe as imag,QV as image,yL as inTopKAsync,Mp as io,us as irfft,Vh as isFinite,jh as isInf,Xh as isNaN,zc as keep,Zp as kernel_impls,Hn as leakyRelu,Eo as less,Or as lessEqual,oH as linalg,td as linspace,rd as localResponseNormalization,be as log,jn as log1p,md as logSigmoid,dd as logSoftmax,Yn as logSumExp,xr as logicalAnd,Zn as logicalNot,Qn as logicalOr,Ed as logicalXor,fH as losses,vd as lowerBound,O as matMul,Rp as math,se as max,ts as maxPool,Sd as maxPool3d,Id as maxPoolWithArgmax,es as maximum,br as mean,DT as memory,Md as meshgrid,wo as min,yr as minimum,Bd as mirrorPad,Gd as mod,Pd as moments,BO as movingAverage,T as mul,Ld as multiRNNCell,zd as multinomial,dt as neg,Oy as nextFrame,dr as norm,rs as notEqual,ko as oneHot,ae as ones,Vd as onesLike,u as op,jd as outerProduct,ce as pad,Yd as pad1d,Qd as pad2d,eg as pad3d,og as pad4d,cg as pool,xe as pow,ns as prelu,_n as print,ug as prod,MT as profile,fg as raggedGather,dg as raggedRange,xg as raggedTensorToTensor,yg as rand,Dg as randomGamma,cs as randomNormal,Rg as randomStandardNormal,Lr as randomUniform,Gg as randomUniformInt,Ce as range,BT as ready,ye as real,Og as reciprocal,PT as registerBackend,hE as registerGradient,vu as registerKernel,Pe as relu,ls as relu6,FT as removeBackend,y as reshape,Mt as reverse,Ug as reverse1d,Vg as reverse2d,jg as reverse3d,Xg as reverse4d,zr as rfft,ps as round,Qg as rsqrt,F as scalar,WO as scatterND,Ao as scatter_util,$o as searchSorted,ex as selu,ox as separableConv2d,wp as serialization,RT as setBackend,OT as setPlatform,sx as setdiff1dAsync,re as sigmoid,ax as sign,CV as signal,lx as sin,ux as sinh,W as slice,fx as slice1d,dx as slice2d,xx as slice3d,yx as slice4d,Wo as slice_util,Ex as softmax,Xn as softplus,os as spaceToBatchND,bH as sparse,jO as sparseToDense,_V as spectral,we as split,It as sqrt,pt as square,ms as squaredDifference,qr as squeeze,Ee as stack,fs as step,_x as stridedSlice,vH as string,A as sub,z as sum,Gu as sumOutType,Bx as tan,xo as tanh,Qt as tensor,ut as tensor1d,Oe as tensor2d,hs as tensor3d,Fx as tensor4d,Gx as tensor5d,Cx as tensor6d,Ox as tensorScatterUpdate,Pc as tensor_util,vl as test_util,J as tidy,Be as tile,_T as time,Wx as topk,tX as train,Kr as transpose,qx as truncatedNormal,Kx as unique,gE as unregisterGradient,dE as unregisterKernel,Hx as unsortedSegmentSum,Ur as unstack,lr as upcastType,Jx as upperBound,k as util,ad as valueAndGrad,cd as valueAndGrads,Xx as variable,Jn as variableGrads,Cy as version_core,Dt as where,gs as whereAsync,ie as zeros,st as zerosLike};
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

@tensorflow/tfjs-core/dist/hash_util.js:
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

@tensorflow/tfjs-core/dist/device_util.js:
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

@tensorflow/tfjs-core/dist/flags.js:
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

@tensorflow/tfjs-core/dist/io/indexed_db.js:
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

@tensorflow/tfjs-core/dist/io/local_storage.js:
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

@tensorflow/tfjs-core/dist/platforms/platform_browser.js:
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

@tensorflow/tfjs-core/dist/platforms/platform_node.js:
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

@tensorflow/tfjs-core/dist/base_side_effects.js:
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

@tensorflow/tfjs-core/dist/test_util.js:
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

@tensorflow/tfjs-core/dist/serialization.js:
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

@tensorflow/tfjs-core/dist/optimizers/optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/adadelta_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/adagrad_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/adam_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/adamax_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/sgd_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/momentum_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/rmsprop_optimizer.js:
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

@tensorflow/tfjs-core/dist/optimizers/register_optimizers.js:
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

@tensorflow/tfjs-core/dist/io/browser_files.js:
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

@tensorflow/tfjs-core/dist/io/progress.js:
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

@tensorflow/tfjs-core/dist/io/weights_loader.js:
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

@tensorflow/tfjs-core/dist/io/http.js:
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

@tensorflow/tfjs-core/dist/io/passthrough.js:
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

@tensorflow/tfjs-core/dist/ops/confusion_matrix.js:
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

@tensorflow/tfjs-core/dist/math.js:
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

@tensorflow/tfjs-core/dist/ops/browser.js:
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

@tensorflow/tfjs-core/dist/ops/slice_util.js:
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

@tensorflow/tfjs-core/dist/version.js:
  (** @license See the LICENSE file. *)

@tensorflow/tfjs-core/dist/optimizers/optimizer_constructors.js:
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

@tensorflow/tfjs-core/dist/train.js:
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

@tensorflow/tfjs-core/dist/browser_util.js:
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

@tensorflow/tfjs-core/dist/ops/concat_util.js:
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

@tensorflow/tfjs-core/dist/ops/ragged_to_dense_util.js:
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

@tensorflow/tfjs-core/dist/ops/reduce_util.js:
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

@tensorflow/tfjs-core/dist/ops/rotate_util.js:
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

@tensorflow/tfjs-core/dist/ops/array_ops_util.js:
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

@tensorflow/tfjs-core/dist/ops/selu_util.js:
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

@tensorflow/tfjs-core/dist/ops/erf_util.js:
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

@tensorflow/tfjs-core/dist/backends/complex_util.js:
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

@tensorflow/tfjs-core/dist/backends/einsum_util.js:
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_fill_empty_rows_util.js:
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape_util.js:
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

@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_reduction_util.js:
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

@tensorflow/tfjs-core/dist/ops/segment_util.js:
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

@tensorflow/tfjs-core/dist/backends/backend_util.js:
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

@tensorflow/tfjs-core/dist/backends/kernel_impls.js:
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

@tensorflow/tfjs-core/dist/base.js:
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

@tensorflow/tfjs-core/dist/index.js:
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
//# sourceMappingURL=tfjs-core.mjs.map