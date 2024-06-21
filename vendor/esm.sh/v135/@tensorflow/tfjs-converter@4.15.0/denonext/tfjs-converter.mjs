/* esm.sh - esbuild bundle(@tensorflow/tfjs-converter@4.15.0) denonext production */
import { Buffer as __Buffer$ } from "node:buffer";
var At=Object.defineProperty;var S=(a,e)=>{for(var t in e)At(a,t,{get:e[t],enumerable:!0})};import{env as vt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var kt=vt();kt.registerFlag("KEEP_INTERMEDIATE_TENSORS",()=>!1,a=>{a&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")});import{dispose as us,io as z,Tensor as Et,util as os}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as ea}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var I;(function(a){a[a.DT_INVALID=0]="DT_INVALID",a[a.DT_FLOAT=1]="DT_FLOAT",a[a.DT_DOUBLE=2]="DT_DOUBLE",a[a.DT_INT32=3]="DT_INT32",a[a.DT_UINT8=4]="DT_UINT8",a[a.DT_INT16=5]="DT_INT16",a[a.DT_INT8=6]="DT_INT8",a[a.DT_STRING=7]="DT_STRING",a[a.DT_COMPLEX64=8]="DT_COMPLEX64",a[a.DT_INT64=9]="DT_INT64",a[a.DT_BOOL=10]="DT_BOOL",a[a.DT_QINT8=11]="DT_QINT8",a[a.DT_QUINT8=12]="DT_QUINT8",a[a.DT_QINT32=13]="DT_QINT32",a[a.DT_BFLOAT16=14]="DT_BFLOAT16",a[a.DT_QINT16=15]="DT_QINT16",a[a.DT_QUINT16=16]="DT_QUINT16",a[a.DT_UINT16=17]="DT_UINT16",a[a.DT_COMPLEX128=18]="DT_COMPLEX128",a[a.DT_HALF=19]="DT_HALF",a[a.DT_RESOURCE=20]="DT_RESOURCE",a[a.DT_VARIANT=21]="DT_VARIANT",a[a.DT_UINT32=22]="DT_UINT32",a[a.DT_UINT64=23]="DT_UINT64",a[a.DT_FLOAT_REF=101]="DT_FLOAT_REF",a[a.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",a[a.DT_INT32_REF=103]="DT_INT32_REF",a[a.DT_UINT8_REF=104]="DT_UINT8_REF",a[a.DT_INT16_REF=105]="DT_INT16_REF",a[a.DT_INT8_REF=106]="DT_INT8_REF",a[a.DT_STRING_REF=107]="DT_STRING_REF",a[a.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",a[a.DT_INT64_REF=109]="DT_INT64_REF",a[a.DT_BOOL_REF=110]="DT_BOOL_REF",a[a.DT_QINT8_REF=111]="DT_QINT8_REF",a[a.DT_QUINT8_REF=112]="DT_QUINT8_REF",a[a.DT_QINT32_REF=113]="DT_QINT32_REF",a[a.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",a[a.DT_QINT16_REF=115]="DT_QINT16_REF",a[a.DT_QUINT16_REF=116]="DT_QUINT16_REF",a[a.DT_UINT16_REF=117]="DT_UINT16_REF",a[a.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",a[a.DT_HALF_REF=119]="DT_HALF_REF",a[a.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",a[a.DT_VARIANT_REF=121]="DT_VARIANT_REF",a[a.DT_UINT32_REF=122]="DT_UINT32_REF",a[a.DT_UINT64_REF=123]="DT_UINT64_REF"})(I||(I={}));var Fe;(function(a){let e;(function(t){t[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"})(e=a.CheckpointFormatVersion||(a.CheckpointFormatVersion={}))})(Fe||(Fe={}));var oe={};function Lt(a,e){let t={tfOpName:a,category:"custom",inputs:[],attrs:[],customExecutor:e};oe[a]=t}function H(a){return oe[a]}function Dt(a){delete oe[a]}import{clone as xt,util as Ct}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function r(a,e,t,s,n){let i=e.inputParams[a];if(i&&i.inputIndexStart!==void 0){let m=i.inputIndexStart,u=i.inputIndexEnd===0?void 0:i.inputIndexEnd===void 0?m+1:i.inputIndexEnd,o=m<0?e.inputNames.length+m:m;if(i.type==="tensor")return b(e.inputNames[o],t,s,n);if(i.type==="tensors"){let c=e.inputs.slice(m,u);return e.inputNames.slice(m,u).filter((N,f)=>{var d;return((d=c[f])===null||d===void 0?void 0:d.op)!=="NoOp"}).map(N=>b(N,t,s,n))}let l=b(e.inputNames[o],t,s,n),y=l.dataSync();return i.type==="number"?y[0]:Ct.toNestedArray(l.shape,y)}let p=e.attrParams[a];return p&&p.value}function b(a,e,t,s){let[n,i]=w(a,t);if(s!=null){let m=s.getHashTableHandleByName(n);if(m!=null)return m}let p=t.currentContextIds.find(m=>!!e[U(n,m)]);return p!==void 0?e[U(n,p)][i]:void 0}function le(a,e,t){return e[U(a,t.currentContextId)]}function E(a,e){let[t,s,n]=w(a,e);return[U(t,e&&e.currentContextId),s,n]}function U(a,e){return e?`${a}-${e}`:a}function w(a,e){if(a==="")return["",0,void 0];let t=e!=null&&e.parseNodeNameCache!=null;if(t){let i=e.parseNodeNameCache.get(a);if(i!=null)return i}let s=a.split(":"),n;if(s.length===1)n=[a,0,void 0];else{let i=s[0],p=s.length===3?s[1]:void 0,m=Number(s[s.length-1]);n=[i,m,p]}return t&&e.parseNodeNameCache.set(a,n),n}function F(a,e,t){let s=r("pad",a,e,t);if(s==="explicit"){s=r("explicitPaddings",a,e,t);let n=[[0,0],[0,0],[0,0],[0,0]];for(let i=0;i<4;i++)n[i][0]=s[i*2],n[i][1]=s[i*2+1];return n}return s}function A(a){return a.kept?a:xt(a)}var ce={};S(ce,{json:()=>zt});var zt=[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var ye={};S(ye,{json:()=>Ft});var Ft=[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsFinite",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsInf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var de={};S(de,{json:()=>Rt});var Rt=[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}];var he={};S(he,{json:()=>Pt});var Pt=[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}];var fe={};S(fe,{json:()=>$t});var $t=[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniformInt",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number"},{tfName:"maxval",name:"maxval",type:"number"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}];var ge={};S(ge,{json:()=>Bt});var Bt=[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var Ne={};S(Ne,{json:()=>jt});var jt=[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}];var Te={};S(Te,{json:()=>Gt});var Gt=[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}];var be={};S(be,{json:()=>Ht});var Ht=[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"InitializeTable",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]},{tfOpName:"InitializeTableV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]}];var Se={};S(Se,{json:()=>Ut});var Ut=[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}];var Oe={};S(Oe,{json:()=>Wt});var Wt=[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BitwiseAnd",category:"logical",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}]}];var we={};S(we,{json:()=>qt});var qt=[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"MatrixBandPart",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"numLower",type:"tensor"},{start:1,name:"numUpper",type:"tensor"}]}];var _e={};S(_e,{json:()=>Kt});var Kt=[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]}];var Ie={};S(Ie,{json:()=>Yt});var Yt=[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}];var Ee={};S(Ee,{json:()=>Qt});var Qt=[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]},{tfOpName:"TensorScatterUpdate",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"values",type:"tensor"}]}];var Ae={};S(Ae,{json:()=>Jt});var Jt=[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}];var ve={};S(ve,{json:()=>Xt});var Xt=[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}];var ke={};S(ke,{json:()=>Zt});var Zt=[{tfOpName:"StaticRegexReplace",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"pattern",name:"pattern",type:"string"},{tfName:"rewrite",name:"rewrite",type:"string"},{tfName:"replace_global",name:"replaceGlobal",type:"bool"}]},{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}];var Ve={};S(Ve,{json:()=>Mt});var Mt=[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"EnsureShape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}];var R=class{static get Instance(){return this._instance||(this._instance=new this)}constructor(){let e=[ce,ye,de,he,fe,ge,Ne,Te,be,Se,Oe,we,_e,Ie,Ee,Ae,ve,ke,Ve],t=[].concat(...e.map(s=>s.json));this.opMappers=t.reduce((s,n)=>(s[n.tfOpName]=n,s),{})}transformGraph(e,t={}){let s=e.node,n=[],i=[],p=[],m=s.reduce((f,d)=>(f[d.name]=this.mapNode(d),d.op.startsWith("Placeholder")?n.push(f[d.name]):d.op==="Const"?i.push(f[d.name]):(d.input==null||d.input.length===0)&&p.push(f[d.name]),f),{}),u=[],o=[],l={},y={};t!=null&&(l=this.mapSignatureEntries(t.inputs),y=this.mapSignatureEntries(t.outputs));let c=Object.keys(m);c.forEach(f=>{let d=m[f];d.inputNames.forEach((g,O)=>{let[v,,T]=E(g),L=m[v];if(L.outputs!=null){let j=L.outputs.indexOf(T);if(j!==-1){let G=`${v}:${j}`;d.inputNames[O]=G}}d.inputs.push(L),L.children.push(d)})}),Object.keys(y).length===0?c.forEach(f=>{let d=m[f];d.children.length===0&&o.push(d)}):Object.keys(y).forEach(f=>{let[d]=E(f),g=m[d];g!=null&&(g.signatureKey=y[f],o.push(g))}),Object.keys(l).length>0?Object.keys(l).forEach(f=>{let[d]=E(f),g=m[d];g&&(g.signatureKey=l[f],u.push(g))}):u=n;let h={};e.library!=null&&e.library.function!=null&&(h=e.library.function.reduce((f,d)=>(f[d.signature.name]=this.mapFunction(d),f),{}));let N={nodes:m,inputs:u,outputs:o,weights:i,placeholders:n,signature:t,functions:h};return p.length>0&&(N.initNodes=p),N}mapSignatureEntries(e){return Object.keys(e||{}).reduce((t,s)=>(t[e[s].name]=s,t),{})}mapNode(e){let t=H(e.op)||this.opMappers[e.op]||{};e.attr==null&&(e.attr={});let s={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map(n=>n.startsWith("^")?n.slice(1):n),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return t.inputs!=null&&(s.inputParams=t.inputs.reduce((n,i)=>(n[i.name]={type:i.type,inputIndexStart:i.start,inputIndexEnd:i.end},n),{})),t.attrs!=null&&(s.attrParams=t.attrs.reduce((n,i)=>{let p=i.type,m;switch(i.type){case"string":m=W(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=W(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"string[]":m=Z(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=Z(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"number":m=K(e.attr,i.tfName,i.defaultValue||0),m===void 0&&i.tfDeprecatedName&&(m=K(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"number[]":m=X(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=X(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"bool":m=q(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=q(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"bool[]":m=ee(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=ee(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"shape":m=J(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=J(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"shape[]":m=M(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=M(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"dtype":m=Y(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=Y(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"dtype[]":m=Q(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=Q(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"func":m=Re(e.attr,i.tfName,i.defaultValue),m===void 0&&i.tfDeprecatedName&&(m=Re(e.attr,i.tfDeprecatedName,i.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${i.type} for op: ${e.op}`)}return n[i.name]={value:m,type:p},n},{})),s}mapFunction(e){let t=e.nodeDef,s=[],n=[],i={};t!=null&&(i=t.reduce((y,c)=>(y[c.name]=this.mapNode(c),c.op==="Const"&&n.push(y[c.name]),y),{}));let p=[],m=[];e.signature.inputArg.forEach(y=>{let[c]=E(y.name),h={name:c,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:Le(y.type),type:"dtype"}},children:[]};h.signatureKey=y.name,p.push(h),i[c]=h}),Object.keys(i).forEach(y=>{let c=i[y];c.inputNames.forEach((h,N)=>{let[f,,d]=E(h),g=i[f];if(g.outputs!=null){let O=g.outputs.indexOf(d);if(O!==-1){let v=`${f}:${O}`;c.inputNames[N]=v}}c.inputs.push(g),g.children.push(c)})});let o=e.ret;e.signature.outputArg.forEach(y=>{let[c,h]=E(o[y.name]),N=i[c];N!=null&&(N.defaultOutput=h,m.push(N))});let l=this.mapArgsToSignature(e);return{nodes:i,inputs:p,outputs:m,weights:n,placeholders:s,signature:l}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce((t,s)=>(t[s.name]=this.mapArgToTensorInfo(s),t),{}),outputs:e.signature.outputArg.reduce((t,s)=>(t[s.name]=this.mapArgToTensorInfo(s,e.ret),t),{})}}mapArgToTensorInfo(e,t){let s=e.name;return t!=null&&(s=t[s]),{name:s,dtype:e.type}}};function ta(a){let e=ea().global;if(typeof e.atob<"u")return e.atob(a);if(typeof __Buffer$<"u")return new __Buffer$(a,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}function Pe(a,e){let t=Array.isArray(a)?String.fromCharCode.apply(null,a):ta(a);return e?t:t.toLowerCase()}function W(a,e,t,s=!1){let n=a[e];return n!=null?Pe(n.s,s):t}function q(a,e,t){let s=a[e];return s?s.b:t}function K(a,e,t){let s=a[e]||{},n=s.i!=null?s.i:s.f!=null?s.f:t;return typeof n=="number"?n:parseInt(n,10)}function Le(a){switch(typeof a=="string"&&(a=I[a]),a){case I.DT_FLOAT:case I.DT_HALF:return"float32";case I.DT_INT32:case I.DT_INT64:case I.DT_INT8:case I.DT_UINT8:return"int32";case I.DT_BOOL:return"bool";case I.DT_DOUBLE:return"float32";case I.DT_STRING:return"string";default:return null}}function Re(a,e,t){let s=a[e];return s&&s.func?s.func.name:t}function Y(a,e,t){let s=a[e];return s&&s.type?Le(s.type):t}function Q(a,e,t){let s=a[e];return s&&s.list&&s.list.type?s.list.type.map(n=>Le(n)):t}function $e(a){if(!a.unknownRank)return a.dim!=null?a.dim.map(e=>typeof e.size=="number"?e.size:parseInt(e.size,10)):[]}function J(a,e,t){let s=a[e];return s&&s.shape?$e(s.shape):t}function X(a,e,t){let s=a[e];return s?((s.list.f&&s.list.f.length?s.list.f:s.list.i)||[]).map(n=>typeof n=="number"?n:parseInt(n,10)):t}function Z(a,e,t,s=!1){let n=a[e];return n&&n.list&&n.list.s?n.list.s.map(i=>Pe(i,s)):t}function M(a,e,t){let s=a[e];return s&&s.list&&s.list.shape?s.list.shape.map(n=>$e(n)):t}function ee(a,e,t){let s=a[e];return s&&s.list&&s.list.b?s.list.b:t}import{env as It,keep as ms,tidy as ps,util as pe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import*as me from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var te=class{constructor(e,t,s){this.node=e,this.tensorMap=t,this.context=s,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map(n=>this.getInput(n)),e.rawAttrs!=null&&(this.attrs=Object.keys(e.rawAttrs).reduce((n,i)=>(n[i]=this.getAttr(i),n),{}))}getInput(e){return b(e,this.tensorMap,this.context)}getAttr(e,t){let s=this.node.rawAttrs[e];if(s.tensor!=null)return b(e,this.tensorMap,this.context);if(s.i!=null||s.f!=null)return K(this.node.rawAttrs,e,t);if(s.s!=null)return W(this.node.rawAttrs,e,t);if(s.b!=null)return q(this.node.rawAttrs,e,t);if(s.shape!=null)return J(this.node.rawAttrs,e,t);if(s.type!=null)return Y(this.node.rawAttrs,e,t);if(s.list!=null){if(s.list.i!=null||s.list.f!=null)return X(this.node.rawAttrs,e,t);if(s.list.s!=null)return Z(this.node.rawAttrs,e,t);if(s.list.shape!=null)return M(this.node.rawAttrs,e,t);if(s.list.b!=null)return ee(this.node.rawAttrs,e,t);if(s.list.type!=null)return Q(this.node.rawAttrs,e,t)}return t}};import*as aa from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var Be=(a,e,t,s=aa)=>{switch(a.op){case"BiasAdd":case"AddV2":case"Add":return[s.add(r("a",a,e,t),r("b",a,e,t))];case"AddN":return[s.addN(r("tensors",a,e,t))];case"FloorMod":case"Mod":return[s.mod(r("a",a,e,t),r("b",a,e,t))];case"Mul":return[s.mul(r("a",a,e,t),r("b",a,e,t))];case"RealDiv":case"Div":return[s.div(r("a",a,e,t),r("b",a,e,t))];case"DivNoNan":return[s.divNoNan(r("a",a,e,t),r("b",a,e,t))];case"FloorDiv":return[s.floorDiv(r("a",a,e,t),r("b",a,e,t))];case"Sub":return[s.sub(r("a",a,e,t),r("b",a,e,t))];case"Minimum":return[s.minimum(r("a",a,e,t),r("b",a,e,t))];case"Maximum":return[s.maximum(r("a",a,e,t),r("b",a,e,t))];case"Pow":return[s.pow(r("a",a,e,t),r("b",a,e,t))];case"SquaredDifference":return[s.squaredDifference(r("a",a,e,t),r("b",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as ra from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var je=(a,e,t,s=ra)=>{switch(a.op){case"Abs":case"ComplexAbs":return[s.abs(r("x",a,e,t))];case"Acos":return[s.acos(r("x",a,e,t))];case"Acosh":return[s.acosh(r("x",a,e,t))];case"Asin":return[s.asin(r("x",a,e,t))];case"Asinh":return[s.asinh(r("x",a,e,t))];case"Atan":return[s.atan(r("x",a,e,t))];case"Atan2":return[s.atan2(r("x",a,e,t),r("y",a,e,t))];case"Atanh":return[s.atanh(r("x",a,e,t))];case"Ceil":return[s.ceil(r("x",a,e,t))];case"Complex":return[s.complex(r("real",a,e,t),r("imag",a,e,t))];case"Cos":return[s.cos(r("x",a,e,t))];case"Cosh":return[s.cosh(r("x",a,e,t))];case"Elu":return[s.elu(r("x",a,e,t))];case"Erf":return[s.erf(r("x",a,e,t))];case"Exp":return[s.exp(r("x",a,e,t))];case"Expm1":return[s.expm1(r("x",a,e,t))];case"Floor":return[s.floor(r("x",a,e,t))];case"Log":return[s.log(r("x",a,e,t))];case"Log1p":return[s.log1p(r("x",a,e,t))];case"Imag":return[s.imag(r("x",a,e,t))];case"Neg":return[s.neg(r("x",a,e,t))];case"Reciprocal":return[s.reciprocal(r("x",a,e,t))];case"Real":return[s.real(r("x",a,e,t))];case"Relu":return[s.relu(r("x",a,e,t))];case"Round":return[s.round(r("x",a,e,t))];case"Selu":return[s.selu(r("x",a,e,t))];case"Sigmoid":return[s.sigmoid(r("x",a,e,t))];case"Sin":return[s.sin(r("x",a,e,t))];case"Sign":return[s.sign(r("x",a,e,t))];case"Sinh":return[s.sinh(r("x",a,e,t))];case"Softplus":return[s.softplus(r("x",a,e,t))];case"Sqrt":return[s.sqrt(r("x",a,e,t))];case"Square":return[s.square(r("x",a,e,t))];case"Tanh":return[s.tanh(r("x",a,e,t))];case"Tan":return[s.tan(r("x",a,e,t))];case"ClipByValue":return[s.clipByValue(r("x",a,e,t),r("clipValueMin",a,e,t),r("clipValueMax",a,e,t))];case"Relu6":return[s.relu6(r("x",a,e,t))];case"Rsqrt":return[s.rsqrt(b(a.inputNames[0],e,t))];case"LeakyRelu":return[s.leakyRelu(r("x",a,e,t),r("alpha",a,e,t))];case"Prelu":return[s.prelu(r("x",a,e,t),r("alpha",a,e,t))];case"IsNan":return[s.isNaN(b(a.inputNames[0],e,t))];case"IsInf":return[s.isInf(b(a.inputNames[0],e,t))];case"IsFinite":return[s.isFinite(b(a.inputNames[0],e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import{scalar as De}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{concat as ia,keep as Ue,reshape as We,scalar as ma,slice as pa,stack as ua,tensor as qe,tidy as oa,unstack as la}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Ge}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function _(a,e,t=""){if(!(typeof a=="number"||typeof e=="number")){Ge.assert(a.length===e.length,()=>t+` Shapes ${a} and ${e} must match`);for(let s=0;s<a.length;s++){let n=a[s],i=e[s];Ge.assert(n<0||i<0||n===i,()=>t+` Shapes ${a} and ${e} must match`)}}}function He(a){return!(typeof a=="number"||a.some(e=>e<0))}function D(a,e,t){let s=ae(a,t),n=!He(s);if(n&&e.length===0)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${s}`);if(n&&e.forEach(i=>{s=ae(i.shape,s)}),!He(s))throw new Error(`Non-fully-defined elementShape: ${s}`);return s}function ae(a,e){if(typeof a=="number")return e;if(typeof e=="number")return a;if(a.length!==e.length)throw new Error(`Incompatible ranks during merge: ${a} vs. ${e}`);let t=[];for(let s=0;s<a.length;++s){let n=a[s],i=e[s];if(n>=0&&i>=0&&n!==i)throw new Error(`Incompatible shape during merge: ${a} vs. ${e}`);t[s]=n>=0?n:i}return t}var se=class{constructor(e,t,s,n,i,p,m){this.name=e,this.dtype=t,this.maxSize=s,this.elementShape=n,this.identicalElementShapes=i,this.dynamicSize=p,this.clearAfterRead=m,this.tensors=[],this.closed_=!1,this.idTensor=ma(0),Ue(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.tensor.id))&&t.tensor.dispose()}),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);let t=this.tensors[e];if(t.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map(t=>this.read(t))}write(e,t){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);let s=this.tensors[e]||{};if(t.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},
          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(this.size()===0&&(this.elementShape==null||this.elementShape.length===0)&&(this.elementShape=t.shape),_(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),s.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(s.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);s.tensor=t,Ue(t),s.written=!0,this.tensors[e]=s}writeMany(e,t){if(e.length!==t.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach((s,n)=>this.write(s,t[n]))}gather(e,t){if(t&&t!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let n=0;n<this.size();n++)e.push(n)}if(e.length===0)return qe([],[0].concat(this.elementShape));let s=this.readMany(e);return _(this.elementShape,s[0].shape,"TensorArray shape mismatch: "),ua(s,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(this.size()===0)return qe([],[0].concat(this.elementShape));let t=[];for(let n=0;n<this.size();n++)t.push(n);let s=this.readMany(t);return _(this.elementShape,s[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${s[0].shape})`),ia(s,0)}scatter(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);let s=Math.max(...e);if(!this.dynamicSize&&s>=this.maxSize)throw new Error(`Max index must be < array size (${s}  vs. ${this.maxSize})`);this.writeMany(e,la(t,0))}split(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let s=0,n=e.map(u=>(s+=u,s));if(s!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${s}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);let i=s===0?0:t.size/s,p=[];oa(()=>{t=We(t,[1,s,i]);for(let u=0;u<e.length;++u){let l=[0,u===0?0:n[u-1],0],y=[1,e[u],i];p[u]=We(pa(t,l,y),this.elementShape)}return p});let m=[];for(let u=0;u<e.length;u++)m[u]=u;this.writeMany(m,p)}};import{concat as ca,keep as re,reshape as V,scalar as ya,slice as da,stack as Ke,tensor as Ye,tidy as ne,unstack as Qe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var x=class a{get id(){return this.idTensor.id}constructor(e,t,s,n=-1){this.tensors=e,this.elementShape=t,this.elementDtype=s,e?.forEach(i=>{if(s!==i.dtype)throw new Error(`Invalid data types; op elements ${s}, but list elements ${i.dtype}`);_(t,i.shape,"TensorList shape mismatch: "),re(i)}),this.idTensor=ya(0),this.maxNumElements=n,re(this.idTensor)}copy(){return new a([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.id))&&t.dispose()}),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,s=-1){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(s!==-1&&this.tensors.length!==s)throw new Error(`Operation expected a list with ${s} elements but got a list with ${this.tensors.length} elements.`);_(e,this.elementShape,"TensorList shape mismatch: ");let n=D(this.elementShape,this.tensors,e);return ne(()=>{let i=this.tensors.map(p=>V(p,n));return Ke(i,0)})}popBack(e,t){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(this.size()===0)throw new Error("Trying to pop from an empty list.");let s=D(this.elementShape,this.tensors,e),n=this.tensors.pop();return n.kept=!1,_(n.shape,e,"TensorList shape mismatch: "),V(n,s)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(_(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");re(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(this.maxNumElements!==-1&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);let t=new a([],this.elementShape,this.elementDtype,this.maxNumElements);t.tensors.length=e;for(let s=0;s<Math.min(this.tensors.length,e);++s)t.tensors[s]=this.tensors[s];return t}getItem(e,t,s){if(s!==this.elementDtype)throw new Error(`Invalid data types; op elements ${s}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(this.tensors[e]==null)throw new Error(`element at index ${e} is null.`);_(this.tensors[e].shape,t,"TensorList shape mismatch: ");let n=D(this.elementShape,this.tensors,t);return V(this.tensors[e],n)}setItem(e,t){if(t.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||this.maxNumElements!==-1&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);_(this.elementShape,t.shape,"TensorList shape mismatch: "),re(t),this.tensors[e]!=null&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,s){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);_(this.elementShape,s,"TensorList shape mismatch: "),e=e.slice(0,this.size());let n=D(this.elementShape,this.tensors,s);return e.length===0?Ye([],[0].concat(n)):ne(()=>{let i=e.map(p=>V(this.tensors[p],n));return Ke(i,0)})}concat(e,t){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);_(this.elementShape,t,"TensorList shape mismatch: ");let s=D(this.elementShape,this.tensors,t);return this.size()===0?Ye([],[0].concat(s)):ne(()=>{let n=this.tensors.map(i=>V(i,s));return ca(n,0)})}};function Je(a,e,t){let s=a.dtype;if(a.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${a.shape}`);if(a.dtype!==t)throw new Error(`Invalid data types; op elements ${a.dtype}, but list elements ${t}`);let n=a.shape.slice(1);_(n,e,"TensorList shape mismatch: ");let i=Qe(a);return new x(i,e,s)}function Xe(a,e,t,s){return new x([],a,e,s)}function Ze(a,e,t,s){if(e.length!==a.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${a.shape[0]}`);let n=Math.max(...e);if(s!=null&&s!==-1&&n>=s)throw new Error(`Max index must be < array size (${n}  vs. ${s})`);let i=new x([],t,a.dtype,s),p=Qe(a,0);return e.forEach((m,u)=>{i.setItem(m,p[u])}),i}function Me(a,e,t){let s=0,n=e.map(l=>(s+=l,s));if(s!==a.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${s}, and tensor's shape is: ${a.shape}`);let i=a.shape.slice(1),p=ae(i,t),m=s===0?0:a.size/s,u=ne(()=>{let l=[];a=V(a,[1,s,m]);for(let y=0;y<e.length;++y){let h=[0,y===0?0:n[y-1],0],N=[1,e[y],m];l[y]=V(da(a,h,N),p)}return a.dispose(),l}),o=new x([],t,a.dtype,e.length);for(let l=0;l<u.length;l++)o.setItem(l,u[l]);return o}var et=async(a,e,t)=>{switch(a.op){case"If":case"StatelessIf":{let s=r("thenBranch",a,e,t),n=r("elseBranch",a,e,t),i=r("cond",a,e,t),p=r("args",a,e,t);return(await i.data())[0]?t.functionMap[s].executeFunctionAsync(p,t.tensorArrayMap,t.tensorListMap):t.functionMap[n].executeFunctionAsync(p,t.tensorArrayMap,t.tensorListMap)}case"While":case"StatelessWhile":{let s=r("body",a,e,t),n=r("cond",a,e,t),i=r("args",a,e,t),p=await t.functionMap[n].executeFunctionAsync(i,t.tensorArrayMap,t.tensorListMap),m=i.map(l=>l.id),u=await p[0].data();p.forEach(l=>{!l.kept&&m.indexOf(l.id)===-1&&l.dispose()});let o=i;for(;u[0];){let l=o;o=await t.functionMap[s].executeFunctionAsync(o,t.tensorArrayMap,t.tensorListMap);let y=o.map(h=>h.id);l.forEach(h=>{!h.kept&&m.indexOf(h.id)===-1&&y.indexOf(h.id)===-1&&h.dispose()});let c=await t.functionMap[n].executeFunctionAsync(o,t.tensorArrayMap,t.tensorListMap);u=await c[0].data(),c.forEach(h=>{!h.kept&&m.indexOf(h.id)===-1&&y.indexOf(h.id)===-1&&h.dispose()})}return o}case"LoopCond":{let s=r("pred",a,e,t);return[A(s)]}case"Switch":{let s=r("pred",a,e,t),n=r("data",a,e,t);return n.kept||(n=A(n)),(await s.data())[0]?[void 0,n]:[n,void 0]}case"Merge":{let s=a.inputNames.find(n=>b(n,e,t)!==void 0);if(s){let n=b(s,e,t);return[A(n)]}return}case"Enter":{let s=r("frameName",a,e,t),n=r("tensor",a,e,t);return t.enterFrame(s),[A(n)]}case"Exit":{let s=r("tensor",a,e,t);return t.exitFrame(),[A(s)]}case"NextIteration":{let s=r("tensor",a,e,t);return t.nextIteration(),[A(s)]}case"TensorArrayV3":{let s=r("size",a,e,t),n=r("dtype",a,e,t),i=r("elementShape",a,e,t),p=r("dynamicSize",a,e,t),m=r("clearAfterRead",a,e,t),u=r("identicalElementShapes",a,e,t),o=r("name",a,e,t),l=new se(o,n,s,i,u,p,m);return t.addTensorArray(l),[l.idTensor,De(1)]}case"TensorArrayWriteV3":{let s=r("tensorArrayId",a,e,t),n=r("index",a,e,t),i=r("tensor",a,e,t),p=t.getTensorArray(s.id);return p.write(n,i),[p.idTensor]}case"TensorArrayReadV3":{let s=r("tensorArrayId",a,e,t),n=r("index",a,e,t);return[t.getTensorArray(s.id).read(n)]}case"TensorArrayGatherV3":{let s=r("tensorArrayId",a,e,t),n=r("indices",a,e,t),i=r("dtype",a,e,t);return[t.getTensorArray(s.id).gather(n,i)]}case"TensorArrayScatterV3":{let s=r("tensorArrayId",a,e,t),n=r("indices",a,e,t),i=r("tensor",a,e,t),p=t.getTensorArray(s.id);return p.scatter(n,i),[p.idTensor]}case"TensorArrayConcatV3":{let s=r("tensorArrayId",a,e,t),n=t.getTensorArray(s.id),i=r("dtype",a,e,t);return[n.concat(i)]}case"TensorArraySplitV3":{let s=r("tensorArrayId",a,e,t),n=r("tensor",a,e,t),i=r("lengths",a,e,t),p=t.getTensorArray(s.id);return p.split(i,n),[p.idTensor]}case"TensorArraySizeV3":{let s=r("tensorArrayId",a,e,t),n=t.getTensorArray(s.id);return[De(n.size(),"int32")]}case"TensorArrayCloseV3":{let s=r("tensorArrayId",a,e,t),n=t.getTensorArray(s.id);return n.clearAndClose(),[n.idTensor]}case"TensorListSetItem":{let s=r("tensorListId",a,e,t),n=r("index",a,e,t),i=r("tensor",a,e,t),p=t.getTensorList(s.id);return p.setItem(n,i),[p.idTensor]}case"TensorListGetItem":{let s=r("tensorListId",a,e,t),n=r("index",a,e,t),i=r("elementShape",a,e,t),p=r("elementDType",a,e,t);return[t.getTensorList(s.id).getItem(n,i,p)]}case"TensorListScatterV2":case"TensorListScatter":{let s=r("indices",a,e,t),n=r("tensor",a,e,t),i=r("elementShape",a,e,t),p=r("numElements",a,e,t),m=Ze(n,s,i,p);return t.addTensorList(m),[m.idTensor]}case"TensorListReserve":case"EmptyTensorList":{let s=r("elementShape",a,e,t),n=r("elementDType",a,e,t),i;a.op==="TensorListReserve"?i="numElements":i="maxNumElements";let p=r(i,a,e,t),m=a.op==="TensorListReserve"?-1:p,u=Xe(s,n,p,m);return t.addTensorList(u),[u.idTensor]}case"TensorListGather":{let s=r("tensorListId",a,e,t),n=r("indices",a,e,t),i=r("elementShape",a,e,t),p=r("elementDType",a,e,t);return[t.getTensorList(s.id).gather(n,p,i)]}case"TensorListStack":{let s=r("tensorListId",a,e,t),n=r("elementShape",a,e,t),i=r("elementDType",a,e,t),p=r("numElements",a,e,t);return[t.getTensorList(s.id).stack(n,i,p)]}case"TensorListFromTensor":{let s=r("tensor",a,e,t),n=r("elementShape",a,e,t),i=r("elementDType",a,e,t),p=Je(s,n,i);return t.addTensorList(p),[p.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{let s=r("tensorListId",a,e,t),n=t.getTensorList(s.id),i=r("dtype",a,e,t),p=r("elementShape",a,e,t);return[n.concat(i,p)]}case"TensorListPushBack":{let s=r("tensorListId",a,e,t),n=r("tensor",a,e,t),i=t.getTensorList(s.id);return i.pushBack(n),[i.idTensor]}case"TensorListPopBack":{let s=r("tensorListId",a,e,t),n=r("elementShape",a,e,t),i=r("elementDType",a,e,t);return[t.getTensorList(s.id).popBack(n,i)]}case"TensorListSplit":{let s=r("tensor",a,e,t),n=r("elementShape",a,e,t),i=r("lengths",a,e,t),p=Me(s,i,n);return t.addTensorList(p),[p.idTensor]}case"TensorListLength":{let s=r("tensorListId",a,e,t),n=t.getTensorList(s.id);return[De(n.size(),"int32")]}case"TensorListResize":{let s=r("tensorListId",a,e,t),n=r("size",a,e,t),p=t.getTensorList(s.id).resize(n);return t.addTensorList(p),[p.idTensor]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as fa from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";function tt(a,e,t){let[s,n]=r("fusedOps",a,e,t),i=s==="biasadd",p=!i,m=n==="prelu",u=s==="fusedbatchnorm",o=r("numArgs",a,e,t);if(i){if(m&&o!==2)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!m&&i&&o!==1)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");let l=r("strides",a,e,t),y=F(a,e,t),c=r("dataFormat",a,e,t).toUpperCase(),h=r("dilations",a,e,t),[N,f]=r("args",a,e,t);p&&(f=N,N=void 0);let d=r("leakyreluAlpha",a,e,t);return{stride:l,pad:y,dataFormat:c,dilations:h,biasArg:N,preluArg:f,activationFunc:n,leakyreluAlpha:d}}var at=(a,e,t,s=fa)=>{switch(a.op){case"Conv1D":{let n=r("stride",a,e,t),i=r("pad",a,e,t),p=r("dataFormat",a,e,t).toUpperCase(),m=r("dilation",a,e,t);return[s.conv1d(r("x",a,e,t),r("filter",a,e,t),n,i,p,m)]}case"Conv2D":{let n=r("strides",a,e,t),i=F(a,e,t),p=r("dataFormat",a,e,t).toUpperCase(),m=r("dilations",a,e,t);return[s.conv2d(r("x",a,e,t),r("filter",a,e,t),[n[1],n[2]],i,p,[m[1],m[2]])]}case"_FusedConv2D":{let{stride:n,pad:i,dataFormat:p,dilations:m,biasArg:u,preluArg:o,activationFunc:l,leakyreluAlpha:y}=tt(a,e,t);return[s.fused.conv2d({x:r("x",a,e,t),filter:r("filter",a,e,t),strides:[n[1],n[2]],pad:i,dataFormat:p,dilations:[m[1],m[2]],bias:u,activation:l,preluActivationWeights:o,leakyreluAlpha:y})]}case"FusedDepthwiseConv2dNative":{let{stride:n,pad:i,dataFormat:p,dilations:m,biasArg:u,preluArg:o,activationFunc:l,leakyreluAlpha:y}=tt(a,e,t);return[s.fused.depthwiseConv2d({x:r("x",a,e,t),filter:r("filter",a,e,t),strides:[n[1],n[2]],pad:i,dataFormat:p,dilations:[m[1],m[2]],bias:u,activation:l,preluActivationWeights:o,leakyreluAlpha:y})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{let n=r("outputShape",a,e,t),i=r("strides",a,e,t),p=F(a,e,t);return[s.conv2dTranspose(r("x",a,e,t),r("filter",a,e,t),n,[i[1],i[2]],p)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{let n=r("strides",a,e,t),i=F(a,e,t),p=r("dilations",a,e,t),m=r("dataFormat",a,e,t).toUpperCase();return[s.depthwiseConv2d(r("input",a,e,t),r("filter",a,e,t),[n[1],n[2]],i,m,[p[1],p[2]])]}case"Conv3D":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("dataFormat",a,e,t).toUpperCase(),m=r("dilations",a,e,t);return[s.conv3d(r("x",a,e,t),r("filter",a,e,t),[n[1],n[2],n[3]],i,p,[m[1],m[2],m[3]])]}case"AvgPool":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("kernelSize",a,e,t);return[s.avgPool(r("x",a,e,t),[p[1],p[2]],[n[1],n[2]],i)]}case"MaxPool":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("kernelSize",a,e,t);return[s.maxPool(r("x",a,e,t),[p[1],p[2]],[n[1],n[2]],i)]}case"MaxPoolWithArgmax":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("kernelSize",a,e,t),m=r("includeBatchInIndex",a,e,t),{result:u,indexes:o}=s.maxPoolWithArgmax(r("x",a,e,t),[p[1],p[2]],[n[1],n[2]],i,m);return[u,o]}case"AvgPool3D":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("kernelSize",a,e,t);return[s.avgPool3d(r("x",a,e,t),[p[1],p[2],p[3]],[n[1],n[2],n[3]],i)]}case"MaxPool3D":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("kernelSize",a,e,t);return[s.maxPool3d(r("x",a,e,t),[p[1],p[2],p[3]],[n[1],n[2],n[3]],i)]}case"Dilation2D":{let n=r("strides",a,e,t),i=r("pad",a,e,t),p=r("dilations",a,e,t),m=n[1],u=n[2],o=p[1],l=p[2];return[s.dilation2d(r("x",a,e,t),r("filter",a,e,t),[m,u],i,[o,l],"NHWC")]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Na from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var st=(a,e,t,s=Na)=>{switch(a.op){case"Fill":{let n=r("shape",a,e,t),i=r("dtype",a,e,t),p=r("value",a,e,t);return[s.fill(n,p,i)]}case"LinSpace":{let n=r("start",a,e,t),i=r("stop",a,e,t),p=r("num",a,e,t);return[s.linspace(n,i,p)]}case"Multinomial":{let n=r("logits",a,e,t),i=r("numSamples",a,e,t),p=r("seed",a,e,t);return[s.multinomial(n,i,p)]}case"OneHot":{let n=r("indices",a,e,t),i=r("depth",a,e,t),p=r("onValue",a,e,t),m=r("offValue",a,e,t),u=r("dtype",a,e,t);return[s.oneHot(n,i,p,m,u)]}case"Ones":return[s.ones(r("shape",a,e,t),r("dtype",a,e,t))];case"OnesLike":return[s.onesLike(r("x",a,e,t))];case"RandomStandardNormal":return[s.randomStandardNormal(r("shape",a,e,t),r("dtype",a,e,t),r("seed",a,e,t))];case"RandomUniform":return[s.randomUniform(r("shape",a,e,t),r("minval",a,e,t),r("maxval",a,e,t),r("dtype",a,e,t))];case"RandomUniformInt":return[s.randomUniformInt(r("shape",a,e,t),r("minval",a,e,t),r("maxval",a,e,t),r("seed",a,e,t))];case"Range":{let n=r("start",a,e,t),i=r("stop",a,e,t),p=r("step",a,e,t);return[s.range(n,i,p,r("dtype",a,e,t))]}case"TruncatedNormal":{let n=r("shape",a,e,t),i=r("mean",a,e,t),p=r("stdDev",a,e,t),m=r("seed",a,e,t);return[s.truncatedNormal(n,i,p,r("dtype",a,e,t),m)]}case"Zeros":return[s.zeros(r("shape",a,e,t),r("dtype",a,e,t))];case"ZerosLike":return[s.zerosLike(r("x",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as ba from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";function xe(a,e,t){let s=r("boxes",a,e,t),n=r("scores",a,e,t),i=r("maxOutputSize",a,e,t),p=r("iouThreshold",a,e,t),m=r("scoreThreshold",a,e,t),u=r("softNmsSigma",a,e,t);return{boxes:s,scores:n,maxOutputSize:i,iouThreshold:p,scoreThreshold:m,softNmsSigma:u}}var rt=async(a,e,t,s,n=ba)=>{switch(a.op){case"NonMaxSuppressionV5":{let{boxes:i,scores:p,maxOutputSize:m,iouThreshold:u,scoreThreshold:o,softNmsSigma:l}=xe(a,e,t),y=await n.image.nonMaxSuppressionWithScoreAsync(i,p,m,u,o,l);return[y.selectedIndices,y.selectedScores]}case"NonMaxSuppressionV4":{let{boxes:i,scores:p,maxOutputSize:m,iouThreshold:u,scoreThreshold:o}=xe(a,e,t),l=r("padToMaxOutputSize",a,e,t),y=await n.image.nonMaxSuppressionPaddedAsync(i,p,m,u,o,l);return[y.selectedIndices,y.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{let{boxes:i,scores:p,maxOutputSize:m,iouThreshold:u,scoreThreshold:o}=xe(a,e,t);return[await n.image.nonMaxSuppressionAsync(i,p,m,u,o)]}case"Where":{let i=n.cast(r("condition",a,e,t),"bool"),p=[await n.whereAsync(i)];return i.dispose(),p}case"ListDiff":return n.setdiff1dAsync(r("x",a,e,t),r("y",a,e,t));default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Oa from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var nt=(a,e,t,s=Oa)=>{switch(a.op){case"LowerBound":{let n=r("sortedSequence",a,e,t),i=r("values",a,e,t);return[s.lowerBound(n,i)]}case"TopKV2":{let n=r("x",a,e,t),i=r("k",a,e,t),p=r("sorted",a,e,t),m=s.topk(n,i,p);return[m.values,m.indices]}case"UpperBound":{let n=r("sortedSequence",a,e,t),i=r("values",a,e,t);return[s.upperBound(n,i)]}case"Unique":{let n=r("x",a,e,t),i=s.unique(n);return[i.values,i.indices]}case"UniqueV2":{let n=r("x",a,e,t),i=r("axis",a,e,t),p=s.unique(n,i);return[p.values,p.indices]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as _a from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var it=(a,e,t,s=_a)=>{switch(a.op){case"Const":return e[a.name];case"PlaceholderWithDefault":let n=r("default",a,e,t);return[b(a.name,e,t)||n];case"Placeholder":return[b(a.name,e,t)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":{let l=r("x",a,e,t);return[A(l)]}case"IdentityN":return r("x",a,e,t).map(l=>A(l));case"Snapshot":let i=r("x",a,e,t);return[A(i)];case"Shape":return[s.tensor1d(r("x",a,e,t).shape,"int32")];case"ShapeN":return r("x",a,e,t).map(l=>s.tensor1d(l.shape));case"Size":return[s.scalar(r("x",a,e,t).size,"int32")];case"Rank":return[s.scalar(r("x",a,e,t).rank,"int32")];case"NoOp":return[s.scalar(1)];case"Print":let p=r("x",a,e,t),m=r("data",a,e,t),u=r("message",a,e,t),o=r("summarize",a,e,t);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(u);for(let l=0;l<m.length;l++)console.log(Array.prototype.slice.call(m[l].dataSync()).slice(0,o));return[p];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import{keep as mt,scalar as Ea,stack as Aa,tidy as pt,unstack as va,util as ka}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import*as ut from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var ie=class{get id(){return this.handle.id}constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=Ea(0),this.tensorMap=new Map,mt(this.handle)}clearAndClose(){this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return ut.scalar(this.size(),"int32")}async import(e,t){this.checkKeyAndValueTensor(e,t);let s=await e.data();return this.tensorMap.forEach(n=>n.dispose()),this.tensorMap.clear(),pt(()=>{let n=va(t),i=s.length,p=n.length;ka.assert(i===p,()=>`The number of elements doesn't match, keys has ${i} elements, the values has ${p} elements.`);for(let m=0;m<i;m++){let u=s[m],o=n[m];mt(o),this.tensorMap.set(u,o)}return this.handle})}async find(e,t){this.checkKeyAndValueTensor(e,t);let s=await e.data();return pt(()=>{let n=[];for(let i=0;i<s.length;i++){let p=s[i],m=this.findWithDefault(p,t);n.push(m)}return Aa(n)})}findWithDefault(e,t){let s=this.tensorMap.get(e);return s??t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}};var ot=async(a,e,t,s)=>{switch(a.op){case"HashTable":case"HashTableV2":{let n=s.getHashTableHandleByName(a.name);if(n!=null)return[n];{let i=r("keyDType",a,e,t),p=r("valueDType",a,e,t),m=new ie(i,p);return s.addHashTable(a.name,m),[m.handle]}}case"InitializeTable":case"InitializeTableV2":case"LookupTableImport":case"LookupTableImportV2":{let n=r("tableHandle",a,e,t,s),i=r("keys",a,e,t),p=r("values",a,e,t);return[await s.getHashTableById(n.id).import(i,p)]}case"LookupTableFind":case"LookupTableFindV2":{let n=r("tableHandle",a,e,t,s),i=r("keys",a,e,t),p=r("defaultValue",a,e,t);return[await s.getHashTableById(n.id).find(i,p)]}case"LookupTableSize":case"LookupTableSizeV2":{let n=r("tableHandle",a,e,t,s);return[s.getHashTableById(n.id).tensorSize()]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as La from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var lt=(a,e,t,s=La)=>{switch(a.op){case"ResizeBilinear":{let n=r("images",a,e,t),i=r("size",a,e,t),p=r("alignCorners",a,e,t),m=r("halfPixelCenters",a,e,t);return[s.image.resizeBilinear(n,[i[0],i[1]],p,m)]}case"ResizeNearestNeighbor":{let n=r("images",a,e,t),i=r("size",a,e,t),p=r("alignCorners",a,e,t),m=r("halfPixelCenters",a,e,t);return[s.image.resizeNearestNeighbor(n,[i[0],i[1]],p,m)]}case"CropAndResize":{let n=r("image",a,e,t),i=r("boxes",a,e,t),p=r("boxInd",a,e,t),m=r("cropSize",a,e,t),u=r("method",a,e,t),o=r("extrapolationValue",a,e,t);return[s.image.cropAndResize(n,i,p,m,u,o)]}case"ImageProjectiveTransformV3":{let n=r("images",a,e,t),i=r("transforms",a,e,t),p=r("outputShape",a,e,t),m=r("fillValue",a,e,t),u=r("interpolation",a,e,t),o=r("fillMode",a,e,t);return[s.image.transform(n,i,u.toLowerCase(),o.toLowerCase(),m,p)]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as xa from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var ct=(a,e,t,s=xa)=>{switch(a.op){case"Equal":return[s.equal(r("a",a,e,t),r("b",a,e,t))];case"NotEqual":return[s.notEqual(r("a",a,e,t),r("b",a,e,t))];case"Greater":return[s.greater(r("a",a,e,t),r("b",a,e,t))];case"GreaterEqual":return[s.greaterEqual(r("a",a,e,t),r("b",a,e,t))];case"Less":return[s.less(r("a",a,e,t),r("b",a,e,t))];case"LessEqual":return[s.lessEqual(r("a",a,e,t),r("b",a,e,t))];case"LogicalAnd":return[s.logicalAnd(r("a",a,e,t),r("b",a,e,t))];case"LogicalNot":return[s.logicalNot(r("a",a,e,t))];case"LogicalOr":return[s.logicalOr(r("a",a,e,t),r("b",a,e,t))];case"Select":case"SelectV2":return[s.where(r("condition",a,e,t),r("a",a,e,t),r("b",a,e,t))];case"BitwiseAnd":return[s.bitwiseAnd(r("a",a,e,t),r("b",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as za from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var yt=(a,e,t,s=za)=>{switch(a.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[s.matMul(r("a",a,e,t),r("b",a,e,t),r("transposeA",a,e,t),r("transposeB",a,e,t))];case"Einsum":return[s.einsum(r("equation",a,e,t),...r("tensors",a,e,t))];case"Transpose":return[s.transpose(r("x",a,e,t),r("perm",a,e,t))];case"_FusedMatMul":let[n,i]=r("fusedOps",a,e,t),p=n==="biasadd",m=i==="prelu",u=r("numArgs",a,e,t),o=r("leakyreluAlpha",a,e,t);if(p){if(m&&u!==2)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!m&&u!==1)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}let[l,y]=r("args",a,e,t);return[s.fused.matMul({a:r("a",a,e,t),b:r("b",a,e,t),transposeA:r("transposeA",a,e,t),transposeB:r("transposeB",a,e,t),bias:l,activation:i,preluActivationWeights:y,leakyreluAlpha:o})];case"MatrixBandPart":return[s.linalg.bandPart(r("a",a,e,t),r("numLower",a,e,t),r("numUpper",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Ra from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var dt=(a,e,t,s=Ra)=>{switch(a.op){case"EuclideanNorm":return[s.euclideanNorm(r("x",a,e,t),r("axis",a,e,t),r("keepDims",a,e,t))];case"FusedBatchNorm":case"FusedBatchNormV2":return[s.batchNorm(r("x",a,e,t),r("mean",a,e,t),r("variance",a,e,t),r("offset",a,e,t),r("scale",a,e,t),r("epsilon",a,e,t))];case"FusedBatchNormV3":return[s.batchNorm(r("x",a,e,t),r("mean",a,e,t),r("variance",a,e,t),r("offset",a,e,t),r("scale",a,e,t),r("epsilon",a,e,t))];case"LRN":return[s.localResponseNormalization(r("x",a,e,t),r("radius",a,e,t),r("bias",a,e,t),r("alpha",a,e,t),r("beta",a,e,t))];case"Softmax":return[s.softmax(r("x",a,e,t))];case"LogSoftmax":return[s.logSoftmax(r("x",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as $a from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var ht=(a,e,t,s=$a)=>{switch(a.op){case"RaggedGather":{let{outputNestedSplits:n,outputDenseValues:i}=s.raggedGather(r("paramsNestedSplits",a,e,t),r("paramsDenseValues",a,e,t),r("indices",a,e,t),r("outputRaggedRank",a,e,t));return n.concat(i)}case"RaggedRange":{let{rtNestedSplits:n,rtDenseValues:i}=s.raggedRange(r("starts",a,e,t),r("limits",a,e,t),r("splits",a,e,t));return[n,i]}case"RaggedTensorToTensor":return[s.raggedTensorToTensor(r("shape",a,e,t),r("values",a,e,t),r("defaultValue",a,e,t),r("rowPartitionTensors",a,e,t),r("rowPartitionTypes",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as ja from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var ft=(a,e,t,s=ja)=>{switch(a.op){case"Max":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.max(r("x",a,e,t),m,u)]}case"Mean":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.mean(r("x",a,e,t),m,u)]}case"Min":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.min(r("x",a,e,t),m,u)]}case"Sum":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.sum(r("x",a,e,t),m,u)]}case"All":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.all(r("x",a,e,t),m,u)]}case"Any":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.any(r("x",a,e,t),m,u)]}case"ArgMax":{let m=r("axis",a,e,t);return[s.argMax(r("x",a,e,t),m)]}case"ArgMin":{let m=r("axis",a,e,t);return[s.argMin(r("x",a,e,t),m)]}case"Prod":{let m=r("axis",a,e,t),u=r("keepDims",a,e,t);return[s.prod(r("x",a,e,t),m,u)]}case"Cumprod":{let m=r("axis",a,e,t),u=r("exclusive",a,e,t),o=r("reverse",a,e,t);return[s.cumprod(r("x",a,e,t),m,u,o)]}case"Cumsum":{let m=r("axis",a,e,t),u=r("exclusive",a,e,t),o=r("reverse",a,e,t);return[s.cumsum(r("x",a,e,t),m,u,o)]}case"Bincount":let n=r("x",a,e,t),i=r("weights",a,e,t),p=r("size",a,e,t);return[s.bincount(n,i,p)];case"DenseBincount":{let m=r("x",a,e,t),u=r("weights",a,e,t),o=r("size",a,e,t),l=r("binaryOutput",a,e,t);return[s.denseBincount(m,u,o,l)]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import{tidy as Ha,util as gt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import*as Ua from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var Nt=(a,e,t,s=Ua)=>{switch(a.op){case"ConcatV2":case"Concat":{let n=r("n",a,e,t),i=r("axis",a,e,t),p=r("tensors",a,e,t);return p=p.slice(0,n),[s.concat(p,i)]}case"Gather":{let n=r("x",a,e,t),i=r("indices",a,e,t);return[s.gather(n,s.cast(i,"int32"),0)]}case"GatherV2":{let n=r("axis",a,e,t),i=r("batchDims",a,e,t),p=r("x",a,e,t),m=r("indices",a,e,t);return[s.gather(p,s.cast(m,"int32"),n,i)]}case"Reverse":{let n=r("dims",a,e,t),i=[];for(let m=0;m<n.length;m++)n[m]&&i.push(m);let p=r("x",a,e,t);return[s.reverse(p,i)]}case"ReverseV2":{let n=r("axis",a,e,t),i=r("x",a,e,t);return[s.reverse(i,n)]}case"Slice":{let n=r("begin",a,e,t),i=r("size",a,e,t);return[s.slice(r("x",a,e,t),n,i)]}case"StridedSlice":{let n=r("begin",a,e,t),i=r("end",a,e,t),p=r("strides",a,e,t),m=r("beginMask",a,e,t),u=r("endMask",a,e,t),o=r("ellipsisMask",a,e,t),l=r("newAxisMask",a,e,t),y=r("shrinkAxisMask",a,e,t),c=r("x",a,e,t);return[s.stridedSlice(c,n,i,p,m,u,o,l,y)]}case"Pack":return Ha(()=>{let n=r("axis",a,e,t),i=r("tensors",a,e,t),p=i[0].shape,m=s.squeeze(i[0]).shape,u=i.map(o=>{let l=gt.arraysEqual(o.shape,p);if(!l&&!gt.arraysEqual(s.squeeze(o).shape,m))throw new Error("the input tensors shape does not match");return l?o:s.reshape(o,p)});return[s.stack(u,n)]});case"Unpack":{let n=r("axis",a,e,t),i=r("tensor",a,e,t);return s.unstack(i,n)}case"Tile":{let n=r("reps",a,e,t);return[s.tile(r("x",a,e,t),n)]}case"Split":case"SplitV":{let n=r("axis",a,e,t),i=r("numOrSizeSplits",a,e,t),p=r("x",a,e,t);return s.split(p,i,n)}case"ScatterNd":{let n=r("indices",a,e,t),i=r("values",a,e,t),p=r("shape",a,e,t);return[s.scatterND(n,i,p)]}case"GatherNd":{let n=r("x",a,e,t),i=r("indices",a,e,t);return[s.gatherND(n,i)]}case"SparseToDense":{let n=r("sparseIndices",a,e,t),i=r("outputShape",a,e,t),p=r("sparseValues",a,e,t),m=r("defaultValue",a,e,t);return[s.sparseToDense(n,p,i,p.dtype===m.dtype?m:s.cast(m,p.dtype))]}case"TensorScatterUpdate":{let n=r("indices",a,e,t),i=r("values",a,e,t),p=r("tensor",a,e,t);return[s.tensorScatterUpdate(p,n,i)]}default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as qa from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var Tt=(a,e,t,s=qa)=>{switch(a.op){case"SparseFillEmptyRows":{let{outputIndices:n,outputValues:i,emptyRowIndicator:p,reverseIndexMap:m}=s.sparse.sparseFillEmptyRows(r("indices",a,e,t),r("values",a,e,t),r("denseShape",a,e,t),r("defaultValue",a,e,t));return[n,i,p,m]}case"SparseReshape":{let{outputIndices:n,outputShape:i}=s.sparse.sparseReshape(r("inputIndices",a,e,t),r("inputShape",a,e,t),r("newShape",a,e,t));return[n,i]}case"SparseSegmentMean":return[s.sparse.sparseSegmentMean(r("data",a,e,t),r("indices",a,e,t),r("segmentIds",a,e,t))];case"SparseSegmentSum":return[s.sparse.sparseSegmentSum(r("data",a,e,t),r("indices",a,e,t),r("segmentIds",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Ya from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var bt=(a,e,t,s=Ya)=>{switch(a.op){case"FFT":return[s.fft(r("x",a,e,t))];case"IFFT":return[s.ifft(r("x",a,e,t))];case"RFFT":return[s.rfft(r("x",a,e,t))];case"IRFFT":return[s.irfft(r("x",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Ja from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var St=(a,e,t,s=Ja)=>{switch(a.op){case"StaticRegexReplace":return[s.string.staticRegexReplace(r("input",a,e,t),r("pattern",a,e,t),r("rewrite",a,e,t),r("replaceGlobal",a,e,t))];case"StringNGrams":{let{nGrams:n,nGramsSplits:i}=s.string.stringNGrams(r("data",a,e,t),r("dataSplits",a,e,t),r("separator",a,e,t),r("nGramWidths",a,e,t),r("leftPad",a,e,t),r("rightPad",a,e,t),r("padWidth",a,e,t),r("preserveShortSequences",a,e,t));return[n,i]}case"StringSplit":{let{indices:n,values:i,shape:p}=s.string.stringSplit(r("input",a,e,t),r("delimiter",a,e,t),r("skipEmpty",a,e,t));return[n,i,p]}case"StringToHashBucketFast":return[s.string.stringToHashBucketFast(r("input",a,e,t),r("numBuckets",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};import*as Za from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/ops_for_converter.js";var Ot=(a,e,t,s=Za)=>{switch(a.op){case"Cast":return[s.cast(r("x",a,e,t),r("dtype",a,e,t))];case"ExpandDims":{let n=r("axis",a,e,t);return[s.expandDims(r("x",a,e,t),n)]}case"Squeeze":{let n=r("axis",a,e,t);return[s.squeeze(r("x",a,e,t),n)]}case"Reshape":return[s.reshape(r("x",a,e,t),r("shape",a,e,t))];case"EnsureShape":return[s.ensureShape(r("x",a,e,t),r("shape",a,e,t))];case"MirrorPad":return[s.mirrorPad(r("x",a,e,t),r("padding",a,e,t),r("mode",a,e,t))];case"PadV2":case"Pad":return[s.pad(r("x",a,e,t),r("padding",a,e,t),r("constantValue",a,e,t))];case"SpaceToBatchND":{let n=r("blockShape",a,e,t),i=r("paddings",a,e,t);return[s.spaceToBatchND(r("x",a,e,t),n,i)]}case"BatchToSpaceND":{let n=r("blockShape",a,e,t),i=r("crops",a,e,t);return[s.batchToSpaceND(r("x",a,e,t),n,i)]}case"DepthToSpace":{let n=r("blockSize",a,e,t),i=r("dataFormat",a,e,t).toUpperCase();return[s.depthToSpace(r("x",a,e,t),n,i)]}case"BroadcastTo":return[s.broadcastTo(r("x",a,e,t),r("shape",a,e,t))];case"BroadcastArgs":return[s.broadcastArgs(r("s0",a,e,t),r("s1",a,e,t))];default:throw TypeError(`Node type ${a.op} is not implemented`)}};function Ce(a,e,t,s,n=me.tidy){let i=((p,m,u)=>{switch(p.category){case"arithmetic":return n(()=>Be(p,m,u));case"basic_math":return n(()=>je(p,m,u));case"control":return et(p,m,u);case"convolution":return n(()=>at(p,m,u));case"creation":return n(()=>st(p,m,u));case"dynamic":return rt(p,m,u);case"evaluation":return n(()=>nt(p,m,u));case"image":return n(()=>lt(p,m,u));case"graph":return n(()=>it(p,m,u));case"logical":return n(()=>ct(p,m,u));case"matrices":return n(()=>yt(p,m,u));case"normalization":return n(()=>dt(p,m,u));case"ragged":return n(()=>ht(p,m,u));case"reduction":return n(()=>ft(p,m,u));case"slice_join":return n(()=>Nt(p,m,u));case"sparse":return n(()=>Tt(p,m,u));case"spectral":return n(()=>bt(p,m,u));case"string":return n(()=>St(p,m,u));case"transformation":return n(()=>Ot(p,m,u));case"hash_table":return ot(p,m,u,s);case"custom":let o=H(p.op);if(o&&o.customExecutor)return o.customExecutor(new te(p,m,u));throw TypeError(`Custom op ${p.op} is not registered.`);default:throw TypeError(`Unknown op '${p.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(a,e,t);return me.util.isPromise(i)?i.then(p=>[].concat(p)):[].concat(i)}var P=class{constructor(e={},t={},s={},n={},i){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=s,this.functionMap=n,this.parseNodeNameCache=i,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){let e=[];for(let t=0;t<this.contexts.length-1;t++){let s=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(s))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map(t=>t.id===0&&t.iterationId===0?"":`${t.frameName}-${t.iterationId}`).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(this.contexts&&this.contexts.length>1)this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift();else throw new Error("Cannot exit frame, the context is empty")}nextIteration(){if(this.contexts&&this.contexts.length>0){this.contexts=this.contexts.slice(),this.lastId++;let e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}else throw new Error("Cannot increase frame iteration, the context is empty")}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(let t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(let t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}};function ze(a,e,t,s){let n=new Set,i=[],p=null,m=null,u=new Set,o=new Set(Object.keys(a).map(c=>w(c)[0]));s=s||[];let l=new Set(s.map(c=>w(c.name)[0])),y=[...e];for(;y.length>0;){let c=y.pop();if((k(c)||ns(c)||is(c))&&p==null&&(p=c,m=p.children.map(h=>h.name).filter(h=>n.has(h))),n.add(c.name),t[c.name]==null&&!o.has(c.name)&&!l.has(c.name)){if(c.inputs.length===0){i.push(c.name);continue}c.inputs.forEach(h=>{u.has(h.name)||(u.add(h.name),y.push(h))})}}return{inputs:a,outputs:e,usedNodes:n,missingInputs:i,dynamicNode:p,syncInputs:m}}function wt(a,e){let{usedNodes:t,inputs:s}=e,n=Object.keys(s).map(d=>w(d)[0]).map(d=>a.nodes[d]),i=a.initNodes||[],p=d=>t.has(typeof d=="string"?d:d.name);function m(d){return[...new Map(d.map(g=>[g.name,g])).values()]}let u=m([...n,...a.weights,...i]).filter(p),o=m([...u,...Object.values(a.nodes)]).filter(p),l=new Map(o.map(d=>[d.name,d])),y={};for(let d of o){y[d.name]=y[d.name]||0;for(let g of d.children)p(g)||(y[g.name]=Number.POSITIVE_INFINITY),y[g.name]=(y[g.name]||0)+1}let c=Object.entries(y).filter(([,d])=>d===0).map(([d])=>d),h=[...c];for(;c.length>0;){let d=c.pop(),g=l.get(d);for(let O of g.children.filter(p))--y[O.name]===0&&(h.push(O.name),c.push(O.name))}let N=h.map(d=>l.get(d)),f=es(N,u);return ts(f,u),f}function es(a,e){let t=new Map(a.map(p=>[p.name,p])),s=e.map(p=>p.name),n=new Set(s);for(;s.length>0;){let p=s.pop(),m=t.get(p);for(let u of m.children)!t.has(u.name)||n.has(u.name)||(n.add(u.name),s.push(u.name))}return a.filter(p=>n.has(p.name))}var C=class extends Error{constructor(e){super(`NodesExecutionOrderError: ${e}`)}};function ts(a,e){let t=new Map(a.map((m,u)=>[m.name,u])),s=new Set(e.map(m=>m.name)),n=m=>s.has(typeof m=="string"?m:m.name),i=new Set(a.map(m=>m.name)),p=m=>i.has(typeof m=="string"?m:m.name);for(let m of a){for(let u of m.children.filter(p)){if(!t.has(u.name))throw new C(`Child ${u.name} of node ${m.name} is unreachable.`);if(t.get(m.name)>t.get(u.name))throw new C(`Node ${m.name} is scheduled to run after its child ${u.name}.`)}if(!n(m))for(let u of m.inputs){if(!t.has(u.name))throw new C(`Input ${u.name} of node ${m.name} is unreachable.`);if(t.get(u.name)>t.get(m.name))throw new C(`Node ${m.name} is scheduled to run before its input ${u.name}.`)}}}function _t(a){let e=new Map(a.map((m,u)=>[m.name,u])),t=Number.MAX_SAFE_INTEGER,s=a.map((m,u)=>k(m)?t:u),n=m=>{let u=s[e.get(m.name)];return u??-1},i=a.map((m,u)=>m.children.map(n).reduce((o,l)=>Math.max(o,l),s[u])),p=new Map;for(let m=0;m<a.length;++m){let u=i[m];if(u===t)continue;let o=a[m],l=a[u];p.has(l.name)||p.set(l.name,[]),p.get(l.name).push(o)}return p}var as=new Set(["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"]),ss=new Set(["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"]),rs=new Set(["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"]);function k(a){return as.has(a.op)}function ns(a){return ss.has(a.op)}function is(a){return rs.has(a.op)}var $=class a{get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){let t=Object.keys(e).map(s=>e[s].map(n=>n.id));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get outputs(){return this._outputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get inputNodes(){return this._inputs.map(e=>e.signatureKey||e.name)}get outputNodes(){return this._outputs.map(e=>{let t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t})}get functions(){return Object.keys(this._functions).reduce((e,t)=>(e[t]=this._functions[t].signature,e),{})}constructor(e,t){this.graph=e,this.parent=t,this.compiledMap=new Map,this.parseNodeNameCache=new Map,this._weightMap={},this.SEPARATOR=",",this._functions={},this._functionExecutorMap={},this.keepIntermediateTensors=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,e.functions!=null&&Object.keys(e.functions).forEach(s=>{this._functionExecutorMap[s]=new a(e.functions[s],this)})}getCompilationKey(e,t){let s=e.map(i=>i.name).sort(),n=t.map(i=>i.name).sort();return s.join(this.SEPARATOR)+"--"+n.join(this.SEPARATOR)}compile(e,t){let s=ze(e,t,this.weightMap,this._initNodes),{missingInputs:n,dynamicNode:i,syncInputs:p}=s;if(i!=null)throw new Error(`This execution contains the node '${i.name}', which has the dynamic op '${i.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${p}]`);if(n.length>0){let o=t.map(y=>y.name),l=Object.keys(e);throw new Error(`Cannot compute the outputs [${o}] from the provided inputs [${l}]. Missing the following inputs: [${n}]`)}let m=wt(this.graph,s),u=_t(m);return{orderedNodes:m,nodeLiveUntilMap:u}}cloneAndKeepTensor(e){if(e==null)return null;let t=e.clone();return ms(t),t}cloneTensorList(e){return e?e.map(s=>this.cloneAndKeepTensor(s)):null}cloneTensorMap(e){return Object.fromEntries(Object.entries(e).map(([t,s])=>[t,this.cloneTensorList(s)]))}execute(e,t){this.disposeIntermediateTensors(),e=this.mapInputs(e);let s=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);let n=s.map(c=>this.graph.nodes[w(c)[0]]),i=t.map(c=>w(c)[0]),p=new Set(i),m=i.map(c=>this.graph.nodes[c]);m.length===0&&(m=this._outputs);let u=this.getCompilationKey(n,m),o=this.compiledMap.get(u);o==null&&(o=this.compile(e,m),this.compiledMap.set(u,o));try{this.keepIntermediateTensors=It().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(c){this.keepIntermediateTensors=!1,console.warn(c.message)}let l={},y={};return ps(()=>{let c=new P(this.weightMap,l,y,this.functionExecutorMap,this.parseNodeNameCache),h=Object.assign({},this.weightMap);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap)),Object.keys(e).forEach(g=>{let[O,v]=w(g,c),T=[];T[v]=e[g],h[O]=T,this.keepIntermediateTensors&&(this.clonedTensorsMap[O]=this.cloneTensorList(T))});let N=this.getFrozenTensorIds(h),{orderedNodes:f,nodeLiveUntilMap:d}=o;for(let g of f){if(h[g.name])continue;let O=Ce(g,h,c,this._resourceManager);if(pe.isPromise(O))throw new Error(`The execution of the op '${g.op}' returned a promise. Please use model.executeAsync() instead.`);h[g.name]=O,this.keepIntermediateTensors&&(this.clonedTensorsMap[g.name]=this.cloneTensorList(O)),this.checkTensorForDisposalWithNodeLiveUntilInfo(g,h,c,N,p,d.get(g.name))}return this.parent==null&&c.dispose(N),t.map(g=>b(g,h,c))})}getFrozenTensorIds(e){let t=[].concat.apply([],Object.keys(e).map(s=>e[s]).map(s=>s.map(n=>n.id)));return new Set(t)}checkTensorForDisposal(e,t,s,n,i,p,m){if(!(k(t)||p.has(e))){for(let u of s[e])u!=null&&(m[u.id]=(m[u.id]||0)+t.children.length);for(let u of t.inputs){if(k(u))continue;let o=le(u.name,s,n);if(o!=null)for(let l of o){if(!l||l.kept||i.has(l.id))continue;let y=m[l.id];y===1?(l.dispose(),delete m[l.id]):y!=null&&m[l.id]--}}}}checkTensorForDisposalWithNodeLiveUntilInfo(e,t,s,n,i,p){function m(u){return k(u)||i.has(u.name)}if(!(k(e)||p==null))for(let u of p){if(m(u))continue;let o=le(u.name,t,s);for(let l of o)!l||l.kept||n.has(l.id)||l.dispose()}}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.clonedTensorsMap&&(Object.values(this.clonedTensorsMap).forEach(e=>{for(let t of e)t&&!t.isDisposed&&t.dispose()}),this.clonedTensorsMap=null)}getIntermediateTensors(){return this.clonedTensorsMap}async _executeAsync(e,t,s=!1,n={},i={}){this.disposeIntermediateTensors(),s||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepIntermediateTensors=It().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(c){this.keepIntermediateTensors=!1,console.warn(c.message)}let p=new P(this.weightMap,n,i,this.functionExecutorMap,this.parseNodeNameCache);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap));let m=await this.executeWithControlFlow(e,p,t,s),u=t.map(c=>b(c,m,p)),o=u.map(c=>c.id),l=Object.keys(e).map(c=>e[c].id),y=new Set([...o,...l,...this.weightIds]);return Object.values(m).forEach(c=>{c.forEach(h=>{h&&!h.isDisposed&&!y.has(h.id)&&h.dispose()})}),this.parent==null&&p.dispose(y),u}async executeFunctionAsync(e,t,s){let n=e.reduce((i,p,m)=>(i[this.inputs[m].name]=p,i),{});return this._executeAsync(n,this.outputNodes,!0,t,s)}async executeWithControlFlow(e,t,s,n){let i=Object.keys(e),p=i.map(T=>this.graph.nodes[w(T)[0]]),m=s.map(T=>w(T)[0]),u=new Set(m),o=m.map(T=>this.graph.nodes[T]);o.length===0&&(o=this._outputs);let{usedNodes:l,missingInputs:y,dynamicNode:c,syncInputs:h}=ze(e,o,this.weightMap,this._initNodes),N=[...p,...this.graph.weights,...this._initNodes||[]].map(T=>({node:T,contexts:t.currentContext})),f=Object.assign({},this.weightMap);Object.keys(e).forEach(T=>{let[L,j]=w(T),G=[];G[j]=e[T],f[L]=G});let d={},g=this.getFrozenTensorIds(f),O={};for(;N.length>0;){let T=this.processStack(p,N,t,f,O,g,u,d,l);await Promise.all(T)}c==null&&!n&&console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");let v=o.filter(T=>!k(T)&&!b(T.name,f,t)).map(T=>T.name);if(v.length>0){let T="";throw c!=null&&(T=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${h}]`),new Error(`Cannot compute the outputs [${v}] from the provided inputs [${i}]. Consider providing the following inputs: [${y}]. ${T}`)}return f}processStack(e,t,s,n,i,p,m,u,o){let l=[];for(;t.length>0;){let y=t.pop();s.currentContext=y.contexts;let c="";if(y.node.op==="Enter"&&r("isConstant",y.node,n,s)&&([c]=E(y.node.name,s)),n[y.node.name]==null){let h=Ce(y.node,n,s,this._resourceManager);c||([c]=E(y.node.name,s));let N=s.currentContext;pe.isPromise(h)?l.push(h.then(f=>(n[c]=f,this.keepIntermediateTensors&&(this.clonedTensorsMap[c]=this.cloneTensorList(f)),s.currentContext=N,this.checkTensorForDisposal(c,y.node,n,s,p,m,u),this.processChildNodes(y.node,t,s,n,i,o),f))):(n[c]=h,this.keepIntermediateTensors&&(this.clonedTensorsMap[c]=this.cloneTensorList(h)),this.checkTensorForDisposal(c,y.node,n,s,p,m,u),this.processChildNodes(y.node,t,s,n,i,o))}else this.processChildNodes(y.node,t,s,n,i,o)}return l}processChildNodes(e,t,s,n,i,p){e.children.forEach(m=>{let[u]=E(m.name,s);i[u]||!p.has(m.name)||(m.op==="Merge"?m.inputNames.some(o=>!!b(o,n,s))&&(i[u]=!0,t.push({contexts:s.currentContext,node:m})):m.inputNames.every(o=>!!b(o,n,s))&&(i[u]=!0,t.push({contexts:s.currentContext,node:m})))})}dispose(){Object.keys(this.weightMap).forEach(e=>this.weightMap[e].forEach(t=>t.dispose()))}checkInputShapeAndType(e){Object.keys(e).forEach(t=>{let s=e[t],[n]=w(t),i=this.graph.nodes[n];if(i.attrParams.shape&&i.attrParams.shape.value){let p=i.attrParams.shape.value,m=p.length===s.shape.length&&s.shape.every((u,o)=>p[o]===-1||p[o]===u);pe.assert(m,()=>`The shape of dict['${i.name}'] provided in model.execute(dict) must be [${p}], but was [${s.shape}]`)}i.attrParams.dtype&&i.attrParams.dtype.value&&pe.assert(s.dtype===i.attrParams.dtype.value,()=>`The dtype of dict['${i.name}'] provided in model.execute(dict) must be ${i.attrParams.dtype.value}, but was ${s.dtype}`)})}mapInputs(e){var t,s;let n={};for(let i in e){let p=(s=(t=this._signature)===null||t===void 0?void 0:t.inputs)===null||s===void 0?void 0:s[i];p!=null?n[p.name]=e[i]:n[i]=e[i]}return n}checkInputs(e){let t=Object.keys(e).filter(s=>{let[n]=w(s);return this.graph.nodes[n]==null});if(t.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map(t=>{var s,n;let i=(n=(s=this._signature)===null||s===void 0?void 0:s.outputs)===null||n===void 0?void 0:n[t];return i!=null?i.name:t},{})}checkOutputs(e){e.forEach(t=>{let[s]=w(t);if(!this.graph.nodes[s])throw new Error(`The output '${t}' is not found in the graph`)})}};var ue=class{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(let e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(let e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}};import{decodeWeightsStream as ls}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/io/io_utils.js";var cs="?tfjs-format=file",ys="model.json",B=class{get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}constructor(e,t={},s=z){this.modelUrl=e,this.loadOptions=t,this.version="n/a",this.io=s,t==null&&(this.loadOptions={}),this.resourceManager=new ue}findIOHandler(){let e=this.modelUrl;if(e.load!=null)this.handler=e;else if(this.loadOptions.requestInit!=null)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{let t=this.io.getLoadHandlers(e,this.loadOptions);if(t.length===0)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw new Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),this.handler.load==null)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");let e=this.handler.load();return os.isPromise(e)?e.then(t=>t.getWeightStream==null?this.loadSync(t):this.loadStreaming(t)):this.loadSync(e)}loadSync(e){let t=this.io.decodeWeights(e.weightData,e.weightSpecs);return this.loadWithWeightMap(e,t)}async loadStreaming(e){if(e.getWeightStream==null)throw new Error("Model artifacts missing streamWeights function");let t=await ls(e.getWeightStream(),e.weightSpecs);return this.loadWithWeightMap(e,t)}loadWithWeightMap(e,t){this.artifacts=e;let s=this.artifacts.modelTopology,n=this.artifacts.signature;if(this.artifacts.userDefinedMetadata!=null){let i=this.artifacts.userDefinedMetadata;i.signature!=null&&(n=i.signature),i.structuredOutputKeys!=null&&(this.structuredOutputKeys=i.structuredOutputKeys)}if(this.signature=n,this.version=`${s.versions.producer}.${s.versions.minConsumer}`,this.executor=new $(R.Instance.transformGraph(s,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(t),this.executor.resourceManager=this.resourceManager,e.modelInitializer!=null&&e.modelInitializer.node!=null){let i=R.Instance.transformGraph(e.modelInitializer);this.initializer=new $(i),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializerSignature=e.initializerSignature}return!0}async save(e,t){if(typeof e=="string"){let s=this.io.getSaveHandlers(e);if(s.length===0)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(s.length>1)throw new Error(`Found more than one (${s.length}) save handlers for URL '${e}'`);e=s[0]}if(e.save==null)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}addStructuredOutputNames(e){if(this.structuredOutputKeys){let t=e instanceof Et?[e]:e,s={};return t.forEach((n,i)=>s[this.structuredOutputKeys[i]]=n),s}return e}predict(e,t){let s=this.execute(e,this.outputNodes);return this.addStructuredOutputNames(s)}async predictAsync(e,t){let s=await this.executeAsync(e,this.outputNodes);return this.addStructuredOutputNames(s)}normalizeInputs(e){var t;if(!(e instanceof Et)&&!Array.isArray(e)){let i=(t=this.signature)===null||t===void 0?void 0:t.inputs;if(i!=null)for(let p in i){let m=i[p];m.resourceId!=null&&(e[p]=this.resourceIdToCapturedInput[m.resourceId])}return e}e=Array.isArray(e)?e:[e];let s=Object.keys(this.resourceIdToCapturedInput).length;if(e.length+s!==this.inputNodes.length)throw new Error(`Input tensor count mismatch, the graph model has ${this.inputNodes.length-s} non-resource placeholders, while there are ${e.length} input tensors provided.`);let n=0;return this.inputNodes.reduce((i,p)=>{var m,u,o;let l=(o=(u=(m=this.signature)===null||m===void 0?void 0:m.inputs)===null||u===void 0?void 0:u[p])===null||o===void 0?void 0:o.resourceId;return l!=null?i[p]=this.resourceIdToCapturedInput[l]:i[p]=e[n++],i},{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}executeInitializerGraph(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.execute({},[]):this.initializer.execute({},Object.keys(this.initializerSignature.outputs))}async executeInitializerGraphAsync(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.executeAsync({},[]):this.initializer.executeAsync({},Object.keys(this.initializerSignature.outputs))}setResourceIdToCapturedInput(e){if(this.resourceIdToCapturedInput={},this.initializerSignature){let t=this.initializerSignature.outputs,s=Object.keys(t);for(let n=0;n<s.length;n++){let i=s[n],p=t[i];this.resourceIdToCapturedInput[p.resourceId]=e[n]}}}execute(e,t){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(this.executeInitializerGraph()),e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let s=this.executor.execute(e,t);return s.length>1?s:s[0]}async executeAsync(e,t){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(await this.executeInitializerGraphAsync()),e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let s=await this.executor.executeAsync(e,t);return s.length>1?s:s[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce((t,s)=>(t[s]=[e[s]],t),{})}dispose(){this.executor.dispose(),this.initializer&&(this.initializer.dispose(),this.resourceIdToCapturedInput&&us(this.resourceIdToCapturedInput)),this.resourceManager.dispose()}};async function ds(a,e={},t=z){if(a==null)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");e==null&&(e={}),e.fromTFHub&&typeof a=="string"&&(a=fs(a));let s=new B(a,e,t);return await s.load(),s}function hs(a){if(a==null)throw new Error("modelUrl in loadGraphModelSync() cannot be null. Please provide model artifacts or an IOHandler that loads the model");let e;if(a instanceof Array){let[s,n]=a;if(!s)throw new Error("modelJSON must be the first element of the array");if(!n||!(n instanceof ArrayBuffer))throw new Error("An ArrayBuffer of weights must be the second element of the array");if(!("modelTopology"in s))throw new Error("Model JSON is missing 'modelTopology'");if(!("weightsManifest"in s))throw new Error("Model JSON is missing 'weightsManifest'");let i=z.getWeightSpecs(s.weightsManifest),p=z.getModelArtifactsForJSONSync(s,i,n);e=z.fromMemorySync(p)}else if("load"in a)e=a;else if("modelTopology"in a&&"weightSpecs"in a&&"weightData"in a)e=z.fromMemorySync(a);else throw new Error("Unknown model format");let t=new B(e);return t.load(),t}function fs(a){return a.endsWith("/")||(a=a+"/"),`${a}${ys}${cs}`}var gs="4.15.0";export{B as GraphModel,Dt as deregisterOp,ds as loadGraphModel,hs as loadGraphModelSync,Lt as registerOp,gs as version_converter};
/*! Bundled license information:

@tensorflow/tfjs-converter/dist/flags.js:
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

@tensorflow/tfjs-converter/dist/data/compiled_api.js:
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
   *
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/custom_op/register.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/utils.js:
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

@tensorflow/tfjs-converter/dist/operations/op_list/arithmetic.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/basic_math.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/control.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/convolution.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/creation.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/dynamic.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/evaluation.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/graph.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/hash_table.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/image.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/logical.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/matrices.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/normalization.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/reduction.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/slice_join.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/sparse.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/spectral.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/string.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/transformation.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/operation_mapper.js:
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

@tensorflow/tfjs-converter/dist/operations/custom_op/node_value_impl.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/arithmetic_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/basic_math_executor.js:
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

@tensorflow/tfjs-converter/dist/executor/tensor_utils.js:
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

@tensorflow/tfjs-converter/dist/executor/tensor_array.js:
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

@tensorflow/tfjs-converter/dist/executor/tensor_list.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/control_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/convolution_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/creation_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/dynamic_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/evaluation_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/graph_executor.js:
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

@tensorflow/tfjs-converter/dist/executor/hash_table.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/hash_table_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/image_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/logical_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/matrices_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/normalization_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/ragged_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/reduction_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/slice_join_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/sparse_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/spectral_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/string_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/executors/transformation_executor.js:
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

@tensorflow/tfjs-converter/dist/operations/operation_executor.js:
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

@tensorflow/tfjs-converter/dist/executor/model_analysis.js:
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

@tensorflow/tfjs-converter/dist/executor/graph_executor.js:
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

@tensorflow/tfjs-converter/dist/executor/graph_model.js:
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

@tensorflow/tfjs-converter/dist/version.js:
  (** @license See the LICENSE file. *)

@tensorflow/tfjs-converter/dist/index.js:
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
//# sourceMappingURL=tfjs-converter.mjs.map