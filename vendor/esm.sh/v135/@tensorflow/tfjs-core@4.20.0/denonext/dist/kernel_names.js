/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/kernel_names) denonext production */
var o="Abs",t="Acos",e="Acosh",r="Add",n="AddN",s="All",p="Any",c="ArgMax",a="ArgMin",x="Asin",i="Asinh",l="Atan",d="Atanh",u="Atan2",S="AvgPool",g="AvgPoolGrad",D="AvgPool3D",m="AvgPool3DGrad",R="BatchMatMul",h="BatchToSpaceND",M="Bincount",A="BitwiseAnd",B="BroadcastTo",N="BroadcastArgs",C="Cast",v="Ceil",F="ClipByValue",P="Complex",T="ComplexAbs",L="Concat",k="Conv2D",G="Conv2DBackpropFilter",E="Conv2DBackpropInput",f="Conv3D",I="Conv3DBackpropFilterV2",q="Conv3DBackpropInputV2",w="Cos",V="Cosh",y="Cumprod",b="Cumsum",z="CropAndResize",U="DenseBincount",O="DepthToSpace",H="DepthwiseConv2dNative",W="DepthwiseConv2dNativeBackpropFilter",K="DepthwiseConv2dNativeBackpropInput",X="Diag",Z="Dilation2D",_="Dilation2DBackpropInput",j="Dilation2DBackpropFilter",J="Draw",Q="RealDiv",Y="Einsum",$="Elu",oo="EluGrad",to="Erf",eo="Equal",ro="Exp",no="ExpandDims",so="Expm1",po="FFT",co="Fill",ao="FlipLeftRight",xo="Floor",io="FloorDiv",lo="FusedBatchNorm",uo="GatherV2",So="GatherNd",go="Greater",Do="GreaterEqual",mo="Identity",Ro="IFFT",ho="Imag",Mo="IsFinite",Ao="IsInf",Bo="IsNan",No="LeakyRelu",Co="Less",vo="LessEqual",Fo="LinSpace",Po="Log",To="Log1p",Lo="LogicalAnd",ko="LogicalNot",Go="LogicalOr",Eo="LogicalXor",fo="LogSoftmax",Io="LowerBound",qo="LRN",wo="LRNGrad",Vo="MatrixBandPart",yo="Max",bo="Maximum",zo="MaxPool",Uo="MaxPoolGrad",Oo="MaxPool3D",Ho="MaxPool3DGrad",Wo="MaxPoolWithArgmax",Ko="Mean",Xo="Min",Zo="Minimum",_o="MirrorPad",jo="Mod",Jo="Multinomial",Qo="Multiply",Yo="Neg",$o="NotEqual",ot="NonMaxSuppressionV3",tt="NonMaxSuppressionV4",et="NonMaxSuppressionV5",rt="OnesLike",nt="OneHot",st="Pack",pt="PadV2",ct="Pool",at="Pow",xt="Prelu",it="Prod",lt="RaggedGather",dt="RaggedRange",ut="RaggedTensorToTensor",St="Range",gt="Real",Dt="Reciprocal",mt="Relu",Rt="Reshape",ht="ResizeNearestNeighbor",Mt="ResizeNearestNeighborGrad",At="ResizeBilinear",Bt="ResizeBilinearGrad",Nt="Relu6",Ct="Reverse",vt="Round",Ft="Rsqrt",Pt="ScatterNd",Tt="TensorScatterUpdate",Lt="SearchSorted",kt="Select",Gt="Selu",Et="Slice",ft="Sin",It="Sinh",qt="Sign",wt="Sigmoid",Vt="Softplus",yt="Sqrt",bt="Sum",zt="SpaceToBatchND",Ut="SplitV",Ot="Softmax",Ht="SparseFillEmptyRows",Wt="SparseReshape",Kt="SparseSegmentMean",Xt="SparseSegmentSum",Zt="SparseToDense",_t="SquaredDifference",jt="Square",Jt="StaticRegexReplace",Qt="StridedSlice",Yt="StringNGrams",$t="StringSplit",oe="StringToHashBucketFast",te="Sub",ee="Tan",re="Tanh",ne="Tile",se="TopK",pe="Transform",ce="Transpose",ae="Unique",xe="Unpack",ie="UnsortedSegmentSum",le="UpperBound",de="ZerosLike",ue="Step",Se="FromPixels",ge="RotateWithOffset",De="_FusedMatMul",me="FusedConv2D",Re="FusedDepthwiseConv2D";export{o as Abs,t as Acos,e as Acosh,r as Add,n as AddN,s as All,p as Any,c as ArgMax,a as ArgMin,x as Asin,i as Asinh,l as Atan,u as Atan2,d as Atanh,S as AvgPool,D as AvgPool3D,m as AvgPool3DGrad,g as AvgPoolGrad,R as BatchMatMul,h as BatchToSpaceND,M as Bincount,A as BitwiseAnd,N as BroadcastArgs,B as BroadcastTo,C as Cast,v as Ceil,F as ClipByValue,P as Complex,T as ComplexAbs,L as Concat,k as Conv2D,G as Conv2DBackpropFilter,E as Conv2DBackpropInput,f as Conv3D,I as Conv3DBackpropFilterV2,q as Conv3DBackpropInputV2,w as Cos,V as Cosh,z as CropAndResize,y as Cumprod,b as Cumsum,U as DenseBincount,O as DepthToSpace,H as DepthwiseConv2dNative,W as DepthwiseConv2dNativeBackpropFilter,K as DepthwiseConv2dNativeBackpropInput,X as Diag,Z as Dilation2D,j as Dilation2DBackpropFilter,_ as Dilation2DBackpropInput,J as Draw,Y as Einsum,$ as Elu,oo as EluGrad,eo as Equal,to as Erf,ro as Exp,no as ExpandDims,so as Expm1,po as FFT,co as Fill,ao as FlipLeftRight,xo as Floor,io as FloorDiv,Se as FromPixels,lo as FusedBatchNorm,me as FusedConv2D,Re as FusedDepthwiseConv2D,So as GatherNd,uo as GatherV2,go as Greater,Do as GreaterEqual,Ro as IFFT,mo as Identity,ho as Imag,Mo as IsFinite,Ao as IsInf,Bo as IsNan,qo as LRN,wo as LRNGrad,No as LeakyRelu,Co as Less,vo as LessEqual,Fo as LinSpace,Po as Log,To as Log1p,fo as LogSoftmax,Lo as LogicalAnd,ko as LogicalNot,Go as LogicalOr,Eo as LogicalXor,Io as LowerBound,Vo as MatrixBandPart,yo as Max,zo as MaxPool,Oo as MaxPool3D,Ho as MaxPool3DGrad,Uo as MaxPoolGrad,Wo as MaxPoolWithArgmax,bo as Maximum,Ko as Mean,Xo as Min,Zo as Minimum,_o as MirrorPad,jo as Mod,Jo as Multinomial,Qo as Multiply,Yo as Neg,ot as NonMaxSuppressionV3,tt as NonMaxSuppressionV4,et as NonMaxSuppressionV5,$o as NotEqual,nt as OneHot,rt as OnesLike,st as Pack,pt as PadV2,ct as Pool,at as Pow,xt as Prelu,it as Prod,lt as RaggedGather,dt as RaggedRange,ut as RaggedTensorToTensor,St as Range,gt as Real,Q as RealDiv,Dt as Reciprocal,mt as Relu,Nt as Relu6,Rt as Reshape,At as ResizeBilinear,Bt as ResizeBilinearGrad,ht as ResizeNearestNeighbor,Mt as ResizeNearestNeighborGrad,Ct as Reverse,ge as RotateWithOffset,vt as Round,Ft as Rsqrt,Pt as ScatterNd,Lt as SearchSorted,kt as Select,Gt as Selu,wt as Sigmoid,qt as Sign,ft as Sin,It as Sinh,Et as Slice,Ot as Softmax,Vt as Softplus,zt as SpaceToBatchND,Ht as SparseFillEmptyRows,Wt as SparseReshape,Kt as SparseSegmentMean,Xt as SparseSegmentSum,Zt as SparseToDense,Ut as SplitV,yt as Sqrt,jt as Square,_t as SquaredDifference,Jt as StaticRegexReplace,ue as Step,Qt as StridedSlice,Yt as StringNGrams,$t as StringSplit,oe as StringToHashBucketFast,te as Sub,bt as Sum,ee as Tan,re as Tanh,Tt as TensorScatterUpdate,ne as Tile,se as TopK,pe as Transform,ce as Transpose,ae as Unique,xe as Unpack,ie as UnsortedSegmentSum,le as UpperBound,de as ZerosLike,De as _FusedMatMul};
//# sourceMappingURL=kernel_names.js.map