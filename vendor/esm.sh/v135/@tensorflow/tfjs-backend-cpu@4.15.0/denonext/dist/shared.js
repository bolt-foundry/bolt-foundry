/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-cpu@4.15.0/dist/shared) denonext production */
import{Abs as Er,util as Rr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Ht}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function W(r,e){Array.isArray(r)||(r=[r]),r.forEach(t=>{t!=null&&Ht.assert(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the CPU backend.`)})}function Xt(r){let e=new Float32Array(r.length);for(let t=0;t<r.length;++t)e[t]=Math.abs(r[t]);return e}import{Add as Jt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Y,util as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function S(r){return(e,t,o,n,l)=>{let a=Y.assertAndGetBroadcastShape(e,t),i=a.length,s=D.computeStrides(a),c=D.sizeFromShape(a),p=D.getTypedArrayFromDType(l,c),m=e.length,h=t.length,g=D.computeStrides(e),f=D.computeStrides(t),I=Y.getBroadcastDims(e,a),u=Y.getBroadcastDims(t,a);if(I.length+u.length===0)for(let d=0;d<p.length;++d)p[d]=r(o[d%o.length],n[d%n.length]);else for(let d=0;d<p.length;++d){let x=D.indexToLoc(d,i,s),w=x.slice(-m);I.forEach(F=>w[F]=0);let y=D.locToIndex(w,m,g),k=x.slice(-h);u.forEach(F=>k[F]=0);let T=D.locToIndex(k,h,f);p[d]=r(o[y],n[T])}return[p,a]}}import{backend_util as M,util as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Cast as Ur,util as pt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as it}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Complex as Mr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function V(r){let{inputs:e,backend:t}=r,{real:o,imag:n}=e,l=t.data.get(o.dataId).values,a=t.data.get(n.dataId).values,i=t.makeTensorInfo(o.shape,"complex64"),s=t.data.get(i.dataId);return s.complexTensorInfos={real:t.makeTensorInfo(o.shape,"float32",l),imag:t.makeTensorInfo(n.shape,"float32",a)},i}function _(r,e,t="float32"){if(t==="complex64"){let n=_(r,e,"float32"),l=_(r,e,"float32");return V({inputs:{real:n,imag:l},backend:r})}let o=it.makeZerosTypedArray(it.sizeFromShape(e),t);return r.makeTensorInfo(e,t,o)}import{Identity as qr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function tt(r){let{inputs:e,backend:t}=r,{x:o}=e;return t.incRef(o.dataId),{dataId:o.dataId,shape:o.shape,dtype:o.dtype}}import{Real as Br}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ct(r){let{inputs:e,backend:t}=r,{input:o}=e,n=t.data.get(o.dataId).complexTensorInfos.real,l=t.data.get(n.dataId).values;return t.makeTensorInfo(n.shape,n.dtype,l)}function mt(r,e,t,o){if(o==="int32"){let n=Int32Array.from(r);return[e,"int32",n]}if(o==="bool"){let n=pt.toTypedArray([0],t),[l,a]=S((i,s)=>i!==s?1:0)(e,[],r,n,"bool");return[a,"bool",l]}throw new Error(`Error in Cast: failed to cast ${t} to ${o}`)}function q(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{dtype:l}=o;if(l==="complex64"){if(n.dtype==="complex64")return tt({inputs:{x:n},backend:t});let p=_(t,n.shape,n.dtype),m=q({inputs:{x:n},backend:t,attrs:{dtype:"float32"}}),h=V({inputs:{real:m,imag:p},backend:t});return t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(m),h}if(n.dtype==="complex64"){let p=ct({inputs:{input:n},backend:t}),m=q({inputs:{x:p},backend:t,attrs:{dtype:l}});return t.disposeIntermediateTensorInfo(p),m}if(!pt.hasEncodingLoss(n.dtype,l)){let p=tt({inputs:{x:n},backend:t});return{dataId:p.dataId,shape:p.shape,dtype:l}}let a=t.data.get(n.dataId).values,[i,s,c]=mt(a,n.shape,n.dtype,l);return t.makeTensorInfo(i,s,c)}function b(r,e,t,o){return t==null?({inputs:n,backend:l})=>{let{a,b:i}=n,s=l;W([a,i],r);let c=s.data.get(a.dataId).values,p=s.data.get(i.dataId).values,m=a.dtype==="string"?M.fromUint8ToStringArray(c):c,h=a.dtype==="string"?M.fromUint8ToStringArray(p):p,g=o||a.dtype,[f,I]=e(a.shape,i.shape,m,h,g);return s.makeTensorInfo(I,g,f)}:({inputs:n,backend:l})=>{let{a,b:i}=n,s=l;if(a.dtype==="complex64"||i.dtype==="complex64"){let c=q({inputs:{x:a},backend:s,attrs:{dtype:"complex64"}}),p=s.data.get(c.dataId),m=p.complexTensorInfos.real,h=p.complexTensorInfos.imag,g=s.data.get(m.dataId).values,f=s.data.get(h.dataId).values,I=q({inputs:{x:i},backend:s,attrs:{dtype:"complex64"}}),u=s.data.get(I.dataId),d=u.complexTensorInfos.real,x=u.complexTensorInfos.imag,w=s.data.get(d.dataId).values,y=s.data.get(x.dataId).values,[k,T,F]=t(a.shape,i.shape,g,f,w,y),v=s.makeTensorInfo(F,"float32",k),z=s.makeTensorInfo(F,"float32",T),U=V({inputs:{real:v,imag:z},backend:s});return s.disposeIntermediateTensorInfo(c),s.disposeIntermediateTensorInfo(I),s.disposeIntermediateTensorInfo(v),s.disposeIntermediateTensorInfo(z),U}else{let c=s.data.get(a.dataId).values,p=s.data.get(i.dataId).values,m=o||a.dtype,[h,g]=e(a.shape,i.shape,c,p,m);return s.makeTensorInfo(g,m,h)}}}function K(r){return(e,t,o,n,l,a)=>{let i=M.assertAndGetBroadcastShape(e,t),s=A.sizeFromShape(i),c=i.length,p=A.computeStrides(i),m=A.getTypedArrayFromDType("float32",s),h=A.getTypedArrayFromDType("float32",s),g=M.getBroadcastDims(e,i),f=M.getBroadcastDims(t,i),I=M.mergeRealAndImagArrays(o,n),u=M.mergeRealAndImagArrays(l,a),d=e.length,x=A.computeStrides(e),w=t.length,y=A.computeStrides(t);if(g.length+f.length===0)for(let k=0;k<m.length;k++){let T=k%I.length,F=k%u.length,v=r(I[T*2],I[T*2+1],u[F*2],u[F*2+1]);m[k]=v.real,h[k]=v.imag}else for(let k=0;k<m.length;k++){let T=A.indexToLoc(k,c,p),F=T.slice(-d);g.forEach(Q=>F[Q]=0);let v=A.locToIndex(F,d,x),z=T.slice(-w);f.forEach(Q=>z[Q]=0);let U=A.locToIndex(z,w,y),lt=r(I[v*2],I[v*2+1],u[U*2],u[U*2+1]);m[k]=lt.real,h[k]=lt.imag}return[m,h,i]}}var ut=S((r,e)=>r+e),Qt=K((r,e,t,o)=>({real:r+t,imag:e+o})),so=b(Jt,ut,Qt);import{buffer as Yt,util as ft}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function te(r,e,t,o,n){let l=ft.sizeFromShape(o),a=ft.makeZerosTypedArray(n,t);for(let i=0;i<r.length;i++){let s=r[i];if(s<0)throw new Error("Input x must be non-negative!");s>=n||(l>0?a[s]+=e[i]:a[s]+=1)}return a}function ee(r,e,t,o=!1){let n=r.shape[0],l=r.shape[1],a=Yt([n,t],e.dtype);for(let i=0;i<n;i++)for(let s=0;s<l;s++){let c=r.get(i,s);if(c<0)throw new Error("Input x must be non-negative!");c>=t||(o?a.set(1,i,c):e.size>0?a.set(a.get(i,c)+e.get(i,s),i,c):a.set(a.get(i,c)+1,i,c))}return a}import{BitwiseAnd as re}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var dt=S((r,e)=>r&e),uo=b(re,dt);import{Ceil as se}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as oe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function E(r){return(e,t,o)=>{let n=oe.getArrayFromDType(t,e.length);for(let l=0;l<e.length;++l)n[l]=r(e[l],o);return n}}import{backend_util as ne}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function j(r,e,t){let o=E(e);return R(r,o,t)}function R(r,e,t){return({inputs:o,attrs:n,backend:l})=>{let{x:a}=o;W(a,r);let i=l,s=i.data.get(a.dataId).values,c;if(a.dtype==="string"){if(!Array.isArray(s))throw new Error("String tensor's value was not an instance of Array");c=ne.fromUint8ToStringArray(s)}else c=s;let p=t||a.dtype,m=e(c,p,n);return i.makeTensorInfo(a.shape,p,m)}}var ht=E(r=>Math.ceil(r)),To=R(se,ht);import{backend_util as ae,util as et}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function le(r,e,t,o){let n=et.getArrayFromDType(t,et.sizeFromShape(e));if(o&&t!=="string"){let l=0;r.forEach(a=>{let i=et.sizeFromShape(a.shape);n.set(a.vals,l),l+=i})}else{let l=0;r.forEach(a=>{let i=t==="string"?ae.fromUint8ToStringArray(a.vals):a.vals,s=0;for(let c=0;c<a.shape[0];++c){let p=c*e[1]+l;for(let m=0;m<a.shape[1];++m)n[p+m]=i[s++]}l+=a.shape[1]})}return n}import{Equal as ie}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gt=S((r,e)=>r===e?1:0),Do=b(ie,gt,null,"bool");import{Exp as ce}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var xt=E(r=>Math.exp(r)),Ko=R(ce,xt,"float32");import{Expm1 as pe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var It=E(r=>Math.expm1(r)),Bo=R(pe,It);import{Floor as me}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var yt=E(r=>Math.floor(r)),_o=R(me,yt);import{FloorDiv as ue}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wt=S((r,e)=>Math.floor(r/e)),Jo=b(ue,wt,null,"int32");import{buffer as fe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function de(r,e,t,o,n,l,a,i,s){let c=fe([o,l],t);for(let p=0;p<o;p++){let m=[],h=0;for(let g=0;g<n;g++){let f=r[p*n+g];h+=f*a[g],m.push(f)}if(h<0||h>=s/l)throw new Error(`Invalid indices: ${m} does not index into ${i}`);for(let g=0;g<l;g++)c.values[p*l+g]=e.get(...e.indexToLoc(h*l+g))}return c}import{buffer as he}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ge(r,e,t){let o=he(t,r.dtype);for(let n=0;n<o.size;++n){let a=o.indexToLoc(n).slice(),i=a[0],s=a[2],c=e.locToIndex([i,s]);a[2]=e.values[c];let p=r.locToIndex(a);0<=p&&p<r.values.length&&(o.values[n]=r.values[p])}return o}import{Greater as xe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var St=S((r,e)=>r>e?1:0),an=b(xe,St,null,"bool");import{GreaterEqual as Ie}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var bt=S((r,e)=>r>=e?1:0),un=b(Ie,bt,null,"bool");import{Less as ye}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var kt=S((r,e)=>r<e?1:0),xn=b(ye,kt,null,"bool");import{LessEqual as we}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Tt=S((r,e)=>r<=e?1:0),bn=b(we,Tt,null,"bool");import{util as Se}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function be(r,e,t){let o=(e-r)/(t-1),n=Se.makeZerosTypedArray(t,"float32");n[0]=r;for(let l=1;l<n.length;l++)n[l]=n[l-1]+o;return n}import{Log as ke}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ft=E(r=>Math.log(r)),Nn=R(ke,Ft);import{util as Et}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Te(r,e,t,o){let n=Et.getTypedArrayFromDType(o,Et.sizeFromShape(t));for(let l=0;l<n.length;++l){let a=l*e,i=r[a];for(let s=0;s<e;++s){let c=r[a+s];(Number.isNaN(c)||c>i)&&(i=c)}n[l]=i}return n}import{Maximum as Fe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Rt=S((r,e)=>Math.max(r,e)),Kn=b(Fe,Rt);import{Minimum as Ee}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vt=S((r,e)=>Math.min(r,e)),Bn=b(Ee,vt);import{Multiply as Re}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Z=S((r,e)=>r*e),ve=K((r,e,t,o)=>({real:r*t-e*o,imag:r*o+e*t})),_n=b(Re,Z,ve);import{Neg as Hn,util as Ne}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ae(r,e,t){let o=Ne.createScalarValue(-1,t);return Z([],e,o,r,t)}import{NotEqual as De}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Nt=S((r,e)=>r!==e?1:0),es=b(De,Nt,null,"bool");import{backend_util as Ce,Prod as as,upcastType as Pe,util as rt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Me(r,e,t,o,n){let l=e.length,a=C.sizeFromShape(e),i=C.computeStrides(e),s=C.computeStrides(n),c=C.getTypedArrayFromDType(t,C.sizeFromShape(n));for(let p=0;p<a;++p){let m=C.indexToLoc(p,l,i),h=new Array(m.length);for(let f=0;f<h.length;f++)h[f]=m[o[f]];let g=C.locToIndex(h,l,s);c[g]=r[p]}return c}function Ve(r,e,t,o){let[n,l]=Ce.computeOutAndReduceShapes(r,o),a=Pe(e,"int32"),i=rt.makeZerosTypedArray(rt.sizeFromShape(n),a),s=rt.sizeFromShape(l);for(let c=0;c<i.length;++c){let p=c*s,m=1;for(let h=0;h<s;++h)m*=t[p+h];i[c]=m}return{outVals:i,outShape:n,outDtype:a}}import{util as L}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ke(r,e,t){r.forEach((o,n)=>{if(o<0||o>=t){let l=L.indexToLoc(n,e.length,L.computeStrides(e)).join(",");throw new Error(`indices[${l}] = ${o} is not in [0, ${t})`)}})}function ze(r,e){for(let t=0;t<r.length;++t){let o=r[t],n=t===r.length-1?e:r[t+1].length;if(o.length===0)throw new Error("Ragged splits may not be empty");if(o[0]<0)throw new Error("Ragged splits must be non-negative");if(o[o.length-1]>n)throw new Error("Ragged splits must not point past values");for(let l=1;l<o.length;++l)if(o[l-1]>o[l])throw new Error("Ragged splits must be sorted in ascending order")}}function qe(r,e,t,o){let n=[],l=0,a=e.length-1+t.length,i=new Array(a).fill(null).map(()=>[0]);ze(t,o);let s=1;for(let c=0;c<e.length-1;++c){s*=e[c];let p=e[c+1];for(let m=1;m<s+1;++m)i[c].push(m*p)}for(let c=0;c<r.length;++c){let p=r[c],m=r[c]+1;for(let h=0;h<t.length;++h){let g=t[h],f=h+e.length-1;if(f>=0){let I=i[f],u=I[I.length-1]-g[p];for(let d=p;d<m;++d)i[f].push(g[d+1]+u)}p=g[p],m=g[m]}m!==p&&(n.push([p,m]),l+=m-p)}return{outSplits:i,valueSlices:n,numValues:l}}function Le(r){let e=[];for(let t=0;t<r.length;++t){let o=r[t].length,n=L.getArrayFromDType("int32",o);e.push(n),r[t].forEach((l,a)=>n[a]=l)}return e}function At(r,e){let t=r.slice(0,e);for(;t.length<e;)t.push(1);for(let o=e;o<r.length;o++)t[e-1]*=r[o];return t}function Oe(r,e,t,o,n,l){let a=At(e,2)[1],i=At(l,2)[1],s=0;for(let c of t)for(let p=c[0];p<c[1];++p){for(let m=0;m<o;++m)n[s*i+m]=r[p*a+m];++s}}function Be(r,e,t,o,n){let l=e.slice();l[0]=n;let a=L.getArrayFromDType(t,L.sizeFromShape(l)),i=r.length,s=i===0?0:i/e[0];return Oe(r,e,o,s,a,l),[a,l]}function $e(r,e,t,o,n,l,a,i){if(r.length===0)throw new Error("paramsNestedSplits must be non empty");if(e[0].length===0)throw new Error("Split tensors must not be scalars");let s=e[0][0]-1;if(Ke(l,a,s),o.length===0)throw new Error("params.rank must be nonzero");let c=o[0],{outSplits:p,valueSlices:m,numValues:h}=qe(l,a,r,c),g=Le(p),f=Be(t,o,n,m,h);return[g,f[0],f[1]]}import{util as Dt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Mt=2147483647;function Ge(r,e,t,o,n,l,a){if(e.length>1)throw new Error("starts must be a scalar or vector");if(n.length>1)throw new Error("limits must be a scalar or vector");if(a.length>1)throw new Error("deltas must be a scalar or vector");let i=e.length===0,s=n.length===0,c=a.length===0,p=[];i||p.push(e[0]),s||p.push(n[0]),c||p.push(a[0]);for(let u=1;u<p.length;++u)if(p[u]!==p[u-1])throw new Error("starts, limits, and deltas must have the same shape");let m=p.length===0?1:p[0],h=Dt.getArrayFromDType("int32",m+1);h[0]=0;for(let u=0;u<m;++u){let d=i?r[0]:r[u],x=s?o[0]:o[u],w=c?l[0]:l[u];if(w===0)throw new Error("Requires delta != 0");let y;if(w>0&&x<d||w<0&&x>d)y=0;else if(y=Math.ceil(Math.abs((x-d)/w)),y>Mt)throw new Error(`Requires ((limit - start) / delta) <= ${Mt}`);h[u+1]=h[u]+y}let g=h[m],f=Dt.getArrayFromDType(t,g),I=0;for(let u=0;u<m;++u){let d=h[u+1]-h[u],x=i?r[0]:r[u],w=c?l[0]:l[u];for(let y=0;y<d;++y)f[I++]=x,x+=w}return[h,f]}import{backend_util as O,broadcastTo as Ue,reshape as We,tidy as _e,util as H}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var N=O.RowPartitionType,ot=class r{constructor(e,t,o,n,l,a,i,s,c,p){this.shape=e,this.shapeShape=t,this.values=o,this.valuesShape=n,this.valuesDType=l,this.defaultValue=a,this.defaultValueShape=i,this.rowPartitionValues=s,this.rowPartitionValuesShapes=c,this.rowPartitionTypes=O.getRowPartitionTypesHelper(p),this.raggedRank=O.getRaggedRank(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===N.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===N.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(e){let t=this.getRowPartitionTensor(e-1);switch(this.getRowPartitionTypeByDimension(e-1)){case N.VALUE_ROWIDS:return r.getMaxWidthValueRowID(t);case N.ROW_SPLITS:return r.getMaxWidthRowSplit(t);default:throw new Error(`Cannot handle partition type ${N[this.getRowPartitionTypeByDimension(e-1)]}`)}}static getMaxWidthRowSplit(e){let t=e.length;if(t===0||t===1)return 0;let o=0;for(let n=0;n<t-1;++n){let l=e[n+1]-e[n];l>o&&(o=l)}return o}static getMaxWidthValueRowID(e){let t=e.length;if(t===0)return 0;let o=0,n=e[0],l=0;for(let a=1;a<t;++a){let i=e[a];i!==n&&(n=i,l=Math.max(a-o,l),o=a)}return Math.max(t-o,l)}tensorShapeFromTensor(e,t,o=!0){if(t.length===0){if(e[0]===-1)return[];throw new Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return Pt(e,o)}calculateOutputSize(e){let t=this.valuesShape,o=this.defaultValueShape;O.validateDefaultValueShape(o,t);let n=this.tensorShapeFromTensor(this.shape,this.shapeShape),a=O.combineRaggedTensorToTensorShapes(this.raggedRank,n,t);a[0]<0&&(a[0]=e);for(let i=1;i<=this.raggedRank;++i)a[i]<0&&(a[i]=this.getMaxWidth(i));return a}calculateFirstParentOutputIndex(e,t,o){let n=Math.min(e,o),l=[],a=0;for(let i=0;i<n;++i,a+=t)l.push(a);for(let i=n;i<e;++i)l.push(-1);return H.assert(l.length===e,()=>"Final length of result must be equal to firstDimension."),l}calculateOutputIndexRowSplit(e,t,o,n){let l=e.length,a=[];for(let i=0;i<l-1;++i){let s=e[i+1]-e[i],c=Math.min(n,s),p=t[i];p===-1&&(c=0);for(let m=0;m<c;++m)a.push(p),p+=o;for(let m=0;m<s-c;++m)a.push(-1)}if(l>0&&a.length!==e[l-1])throw new Error("Invalid row split size.");return a}calculateOutputIndexValueRowID(e,t,o,n){let l=e.length,a=[];if(l===0)return[];let i=0,s=e[0];if(s>=t.length)throw new Error(`Got currentValueRowId=${s}, which is not less than ${t.length}`);let c=t[s];a.push(c);for(let p=1;p<l;++p){let m=e[p];if(m===s)c>=0&&(++i,i<n?c+=o:c=-1);else{if(i=0,s=m,m>=t.length)throw new Error(`Got nextValueRowId=${m} which is not less than ${t.length}`);c=t[m]}a.push(c)}if(a.length!==e.length)throw new Error("Invalid row ids.");return a}calculateOutputIndex(e,t,o,n){let l=this.getRowPartitionTensor(e),a=this.getRowPartitionTypeByDimension(e);switch(a){case N.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(l,t,o,n);case N.ROW_SPLITS:if(l.length-1>t.length)throw new Error(`Row partition size is greater than output size: ${l.length-1} > ${t.length}`);return this.calculateOutputIndexRowSplit(l,t,o,n);default:throw new Error(`Unsupported partition type: ${N[a]}`)}}getFirstDimensionSize(){let e=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw new Error("No row_partition_types given.");let t=this.rowPartitionTypes[0];switch(t){case N.FIRST_DIM_SIZE:return e[0];case N.VALUE_ROWIDS:throw new Error("Cannot handle VALUE_ROWIDS in first dimension.");case N.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw new Error(`Cannot handle type ${N[t]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw new Error("Invalid first partition input. Tensor requires at least one element.");let t=this.getFirstDimensionSize(),o=this.calculateOutputSize(t),n=new Array(this.raggedRank+1);n[n.length-1]=1;for(let s=n.length-2;s>=0;--s)n[s]=n[s+1]*o[s+1];let l=Pt(o,!1),a=H.getArrayFromDType(this.valuesDType,H.sizeFromShape(l));if(n[0]*o[0]>0){let s=this.calculateFirstParentOutputIndex(t,n[0],o[0]);for(let c=1;c<=this.raggedRank;++c)s=this.calculateOutputIndex(c-1,s,n[c],o[c]);this.setOutput(this.raggedRank,s,a,l)}return[l,a]}setOutput(e,t,o,n){if(o.length===0)return;let l=this.values,a=o,i=n.slice();i=i.slice(e+1);let s=H.sizeFromShape(i),c=t.length,p=this.defaultValue;if(p.length!==s&&p.length!==1){let f=this.defaultValueShape;_e(()=>{let I=We(p,f);p=Ue(I,i).dataSync()})}let m=0,h=0,g=0;for(let f=0;f<=c;++f){let I=f<c?t[f]:-1;if(I===g){++g;continue}if(h<g){let u=l.subarray(m*s),d=a.subarray(h*s),x=(g-h)*s;Ct(d,u,x)}if(f>=c){let u=o.length;I=Math.floor(u/s)}if(I>g)if(this.defaultValue.length===1)a.subarray(g*s,I*s).fill(this.defaultValue[0]),g=I;else for(;I>g;){let u=a.slice(g*s);Ct(u,p,s),++g}I<0?(m=f+1,h=g):(m=f,h=g,g=h+1)}}};function Ct(r,e,t){for(let o=0;o<t;o++)r[o]=e[o]}function Pt(r,e){let t=[];for(let o of r){if(o<0){if(!e)throw new Error(`Dimension ${o} must be >= 0`);if(o<-1)throw new Error(`Dimension ${o} must be >= -1`);o=-1}t.push(o)}return t}function je(r,e,t,o,n,l,a,i,s,c){return new ot(r,e,t,o,n,l,a,i,s,c).compute()}import{util as Vt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ze(r,e,t,o){let n=r===e,l=r<e&&t<0,a=e<r&&t>1;if(n||l||a)return Vt.makeZerosTypedArray(0,o);let i=Math.abs(Math.ceil((e-r)/t)),s=Vt.makeZerosTypedArray(i,o);e<r&&t===1&&(t=-1),s[0]=r;for(let c=1;c<s.length;c++)s[c]=s[c-1]+t;return s}import{Rsqrt as He}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Kt=E(r=>1/Math.sqrt(r)),ys=R(He,Kt);import{buffer as zt,TensorBuffer as Xe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Je(r,e,t,o,n,l,a,i,s,c){let p=[o/n,n],m=r.values,h=e.values;if(o===0)return zt(t,e.dtype);let g=s instanceof Xe?s:zt(p,e.dtype);typeof s=="string"||typeof s=="number"?g.values.fill(s):typeof s=="boolean"&&g.values.fill(+s);for(let f=0;f<l;f++){let I=[],u=0;for(let d=0;d<a;d++){let x=m[f*a+d];I.push(x),u+=x*i[d]}if(u<0||u>=o/n)throw new Error(`Invalid indices: ${I} does not index into ${t}`);for(let d=0;d<n;d++)c?g.values[u*n+d]+=h[f*n+d]:g.values[u*n+d]=e.rank===0?h[0]:h[f*n+d]}return g}import{Sigmoid as Qe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ye=E(r=>1/(1+Math.exp(-r))),Es=j(Qe,r=>1/(1+Math.exp(-r)));import{backend_util as qt,buffer as Lt,Slice as Ns,slice_util as Ot,util as Bt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function tr(r,e,t,o,n){let l=Ot.isSliceContinous(o,e,t),a=Bt.sizeFromShape(t),i=Bt.computeStrides(o);if(l){let m=Ot.computeFlatOffset(e,i);return n==="string"?r.slice(m,m+a):r.subarray(m,m+a)}let s=n==="string"?qt.fromUint8ToStringArray(r):r,c=Lt(o,n,s),p=Lt(t,n);for(let m=0;m<p.size;++m){let h=p.indexToLoc(m),g=h.map((f,I)=>f+e[I]);p.set(c.get(...g),...h)}return n==="string"?qt.fromStringArrayToUint8(p.values):p.values}import{backend_util as nt,util as X}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function er(r,e,t,o,n,l,a){let i=e[0],s=l[0],c=new Array(s),p=new Array(i),m=e[1];if(s===0){if(i!==0)throw new Error(nt.getSparseFillEmptyRowsIndicesDenseShapeMismatch(i));let u=X.getArrayFromDType(t,0),d=X.getArrayFromDType(n,0);return[u,[0,m],d,c,p]}let h=!0,g=0,f=new Array(s).fill(0);for(let u=0;u<i;++u){let d=r[u*m];if(d<0)throw new Error(nt.getSparseFillEmptyRowsNegativeIndexErrorMessage(u,d));if(d>=s)throw new Error(nt.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(u,d,s));++f[d],h=h&&d>=g,g=d}let I=!0;for(let u=0;u<s;++u){let d=f[u]===0;c[u]=d,I=I&&!d,f[u]=Math.max(f[u],1),u>0&&(f[u]+=f[u-1])}if(I&&h){let u=r,d=o;for(let x=0;x<i;++x)p[x]=x;return[u,[i,m],d,c,p]}else{let u=f[s-1],d=X.getArrayFromDType(t,u*m),x=X.getArrayFromDType(n,u),w=new Array(s).fill(0);for(let y=0;y<i;++y){let k=r[y*m],T=w[k],F=(k===0?0:f[k-1])+T;w[k]++;for(let v=0;v<m;++v)d[F*m+v]=r[y*m+v];x[F]=o[y],p[y]=F}for(let y=0;y<s;++y)if(w[y]===0){let T=y===0?0:f[y-1];d[T*m+0]=y;for(let F=1;F<m;++F)d[T*m+F]=0;x[T]=a}return[d,[u,m],x,c,p]}}import{backend_util as B,util as st}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function rr(r,e,t,o,n){let l=st.sizeFromShape(o),a=e[0],i=n.length,s=[],c=1,p=-1;for(let u=0;u<i;++u){let d=n[u];if(d===-1){if(p!==-1)throw new Error(B.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(p,u));p=u,s.push(1)}else{if(d<0)throw new Error(B.getSparseReshapeNegativeOutputDimErrorMessage(u,d));c*=d,s.push(d)}}if(p!==-1){if(c<=0)throw new Error(B.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage());let u=Math.trunc(l/c);if(c*u!==l)throw new Error(B.getSparseReshapeInputOutputMultipleErrorMessage(o,s));s[p]=u}if(st.sizeFromShape(s)!==l)throw new Error(B.getSparseReshapeInputOutputMismatchErrorMessage(o,s));let h=o.length,g=[];if(h>0){g[h-1]=1;for(let u=h-2;u>=0;--u)g[u]=g[u+1]*o[u+1]}let f=[];if(i>0){f[i-1]=1;for(let u=i-2;u>=0;--u)f[u]=f[u+1]*s[u+1]}let I=st.getArrayFromDType(t,a*i);for(let u=0;u<a;++u){let d=0;for(let x=0;x<h;++x)d+=r[u*h+x]*g[x];for(let x=0;x<i;++x)I[u*i+x]=Math.trunc(d/f[x]),d%=f[x]}return[I,[a,i],s]}import{backend_util as $,util as or}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function nr(r,e,t,o,n,l=!1,a=0){let i=o.length,s=[e[0],r.length/e[0]],c=s[1],m=i>0?n[i-1]+1:0;if(m<0)throw new Error($.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let h=e.slice();h[0]=m;let g=h.reduce((w,y)=>w*y,1),f=or.getArrayFromDType(t,g);if(i===0)return m>0&&f.fill(a),[f,h];if(m<=0)throw new Error($.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let I=0,u=1,d=0,x=n[I];for(;;){let w=0;if(u<i){if(w=n[u],x===w){++u;continue}if(x>=w)throw new Error($.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage())}if(x<0||x>=m)throw new Error($.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(x,m));x>d&&f.fill(a,d*c,x*c);for(let y=I;y<u;++y){let k=o[y];if(k<0||k>=s[0])throw new Error($.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(y,o[y],s[0]));for(let T=0;T<c;T++)f[x*c+T]+=r[k*c+T]}if(l)for(let y=0;y<c;y++)f[x*c+y]/=u-I;if(I=u,++u,d=x+1,x=w,u>i)break}return d<m&&f.fill(a,d*c,m*c),[f,h]}import{Sqrt as sr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ar=E(r=>Math.sqrt(r)),Os=j(sr,r=>Math.sqrt(r));import{SquaredDifference as lr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $t=S((r,e)=>{let t=r-e;return t*t}),Ws=b(lr,$t);import{StaticRegexReplace as ir}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Gt=E((r,e)=>{let{pattern:t,replaceGlobal:o,rewrite:n}=e;return r.replace(new RegExp(t,o?"g":""),n)}),Xs=R(ir,Gt);import{buffer as cr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function pr(r,e,t,o){let n=cr(r,e.dtype);for(let l=0;l<n.size;l++){let a=n.indexToLoc(l),i=new Array(a.length);for(let s=0;s<i.length;s++)i[s]=a[s]*t[s]+o[s];n.set(e.get(...i),...a)}return n}import{util as J}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var at=class{constructor(e,t,o,n,l,a){this.separator=J.encodeString(e),this.nGramWidths=t,this.leftPad=J.encodeString(o),this.rightPad=J.encodeString(n),this.padWidth=l,this.preserveShort=a}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,t){let o=this.getPadWidth(t);return Math.max(0,e+2*o-t+1)}createNGrams(e,t,o,n,l,a){for(let i=0;i<l;++i){let s=this.getPadWidth(a),c=Math.max(0,s-i),p=Math.max(0,s-(l-(i+1))),m=a-(c+p),h=t+(c>0?0:i-s),g=0;g+=c*this.leftPad.length;for(let x=0;x<m;++x)g+=e[h+x].length;g+=p*this.rightPad.length;let f=c+p+m-1;g+=f*this.separator.length,o[n+i]=new Uint8Array(g);let I=o[n+i],u=0,d=x=>x.forEach(w=>I[u++]=w);for(let x=0;x<c;++x)d(this.leftPad),d(this.separator);for(let x=0;x<m-1;++x)d(e[h+x]),d(this.separator);if(m>0){d(e[h+m-1]);for(let x=0;x<p;++x)d(this.separator),d(this.rightPad)}else{for(let x=0;x<p-1;++x)d(this.rightPad),d(this.separator);d(this.rightPad)}}}compute(e,t){let o=e.length,n=t.length;if(n>0){let s=t[0];if(s!==0)throw new Error(`First split value must be 0, got ${s}`);for(let c=1;c<n;++c){let p=t[c]>=s;if(p=p&&t[c]<=o,!p)throw new Error(`Invalid split value ${t[c]}, must be in [${s}, ${o}]`);s=t[c]}if(s!==o)throw new Error(`Last split value must be data size. Expected ${o}, got ${s}`)}let l=n-1,a=J.getArrayFromDType("int32",n);if(o===0||n===0){let s=new Array(o);for(let c=0;c<=l;++c)a[c]=0;return[s,a]}a[0]=0;for(let s=1;s<=l;++s){let c=t[s]-t[s-1],p=0;this.nGramWidths.forEach(m=>{p+=this.getNumNGrams(c,m)}),this.preserveShort&&c>0&&p===0&&(p=1),a[s]=a[s-1]+p}let i=new Array(a[l]);for(let s=0;s<l;++s){let c=t[s],p=a[s];if(this.nGramWidths.forEach(m=>{let h=t[s+1]-t[s],g=this.getNumNGrams(h,m);this.createNGrams(e,c,i,p,g,m),p+=g}),this.preserveShort&&p===a[s]){let m=t[s+1]-t[s];if(m===0)continue;let h=m+2*this.padWidth,g=1;this.createNGrams(e,c,i,p,g,h)}}return[i,a]}};function mr(r,e,t,o,n,l,a,i){return new at(t,o,n,l,a,i).compute(r,e)}import{util as ur}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function fr(r,e,t,o){if(!r.length)return;if(e.length===0){for(let l=0;l<r.length;++l)o.push(r.subarray(l,l+1));return}if(e.length===1){let l=e[0],a=r.indexOf(l);for(;a!==-1;){let i=r.subarray(0,a);(!t||i.length!==0)&&o.push(i),r=r.subarray(a+1),a=r.indexOf(l)}(!t||r.length!==0)&&o.push(r);return}let n=0;for(let l=0;l<r.length+1;l++)if(l===r.length||e.indexOf(r[l])!==-1){let a=r.subarray(n,l);(!t||a.length!==0)&&o.push(a),n=l+1}}function dr(r,e,t){let o=r.length,n=[],l=0,a=0,i=new Array(o);for(let h=0;h<o;++h){let g=n.length;fr(r[h],e,t,n);let f=n.length-g;i[h]=f,l+=f,a=Math.max(a,f)}let s=ur.getArrayFromDType("int32",l*2),c=new Array(l),p=[o,a],m=0;for(let h=0;h<o;++h)for(let g=0;g<i[h];++g)s[m*2]=h,s[m*2+1]=g,c[m]=n[m],++m;return[s,c,p]}import{util as Ut}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function hr(r,e){let t=Ut.getArrayFromDType("int32",r.length);for(let o=0;o<r.length;++o)t[o]=Ut.fingerPrint64(r[o]).modulo(e).getLowBitsUnsigned();return t}import{Sub as gr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Wt=S((r,e)=>r-e),xr=K((r,e,t,o)=>({real:r-t,imag:e-o})),ca=b(gr,Wt,xr);import{buffer as Ir}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function yr(r,e){let t=new Array(r.rank);for(let n=0;n<t.length;n++)t[n]=r.shape[n]*e[n];let o=Ir(t,r.dtype);for(let n=0;n<o.values.length;++n){let l=o.indexToLoc(n),a=new Array(r.rank);for(let s=0;s<a.length;s++)a[s]=l[s]%r.shape[s];let i=r.locToIndex(a);o.values[n]=r.values[i]}return o}import{buffer as _t,util as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var G=(r,e)=>{let t=e.value-r.value;return t===0?r.index-e.index:t};function jt(r,e,t=0,o=r.length-1){for(;o>t;){if(o-t>600){let i=o-t+1,s=e-t+1,c=Math.log(i),p=.5*Math.exp(2*c/3),m=.5*Math.sqrt(c*p*(i-p)/i)*Math.sign(s-i/2),h=Math.max(t,Math.floor(e-s*p/i+m)),g=Math.min(o,Math.floor(e+(i-s)*p/i+m));jt(r,e,h,g)}let n=r[e],l=t,a=o;for(P.swap(r,t,e),G(r[o],n)>0&&P.swap(r,t,o);l<a;){for(P.swap(r,l,a),l++,a--;G(r[l],n)<0;)l=l+1;for(;G(r[a],n)>0;)a=a-1}G(r[t],n)===0?P.swap(r,t,a):(a=a+1,P.swap(r,a,o)),a<=e&&(t=a+1),e<=a&&(o=a-1)}}function wr(r,e,t,o,n){let l=e[e.length-1],[a,i]=[r.length/l,l],s=P.getTypedArrayFromDType(t,a*o),c=P.getTypedArrayFromDType("int32",a*o);for(let m=0;m<a;m++){let h=m*i,g=r.subarray(h,h+i),f=new Array(g.length);g.forEach((x,w)=>f[w]={value:x,index:w}),o<f.length&&(jt(f,o),f=f.slice(0,o)),n&&f.sort(G);let I=m*o,u=s.subarray(I,I+o),d=c.subarray(I,I+o);for(let x=0;x<o;x++)u[x]=f[x].value,d[x]=f[x].index}let p=e.slice();return p[p.length-1]=o,[_t(p,t,s),_t(p,"int32",c)]}import{TensorBuffer as Zt,util as Sr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function br(r,e,t,o){let n=Sr.parseAxisParam(e,t)[0],l=[1,t[0],1];for(let f=0;f<n;f++)l[0]*=t[f];l[1]=t[n];for(let f=n+1;f<t.length;f++)l[2]*=t[f];let a=new Map,i=new Int32Array(t[n]),s=new Zt(l,o,r),c=[],p=l[0]===1&&l[2]===1;for(let f=0;f<t[n];f++){let I;if(p)I=r[f].toString();else{let d=[];for(let x=0;x<l[0];x++)for(let w=0;w<l[2];w++)d.push(s.get(x,f,w));I=d.join(",")}let u=a.get(I);if(u!=null)i[f]=u;else{let d=a.size;a.set(I,d),i[f]=d,c.push(f)}}let m=l.slice();m[1]=a.size;let h=new Zt(m,o);c.forEach((f,I)=>{for(let u=0;u<l[0];u++)for(let d=0;d<l[2];d++)h.set(s.get(u,f,d),u,I,d)});let g=t.slice();return g[n]=m[1],{outputValues:h.values,outputShape:g,indices:i}}export{ut as addImpl,te as bincountImpl,ee as bincountReduceImpl,dt as bitwiseAndImpl,mt as castImpl,ht as ceilImpl,le as concatImpl,gt as equalImpl,xt as expImpl,It as expm1Impl,wt as floorDivImpl,yt as floorImpl,de as gatherNdImpl,ge as gatherV2Impl,bt as greaterEqualImpl,St as greaterImpl,Tt as lessEqualImpl,kt as lessImpl,be as linSpaceImpl,Ft as logImpl,Te as maxImpl,Rt as maximumImpl,vt as minimumImpl,Z as multiplyImpl,Ae as negImpl,Nt as notEqualImpl,Ve as prodImpl,$e as raggedGatherImpl,Ge as raggedRangeImpl,je as raggedTensorToTensorImpl,Ze as rangeImpl,Kt as rsqrtImpl,Je as scatterImpl,Ye as sigmoidImpl,Xt as simpleAbsImpl,tr as sliceImpl,er as sparseFillEmptyRowsImpl,rr as sparseReshapeImpl,nr as sparseSegmentReductionImpl,ar as sqrtImpl,$t as squaredDifferenceImpl,Gt as staticRegexReplaceImpl,pr as stridedSliceImpl,mr as stringNGramsImpl,dr as stringSplitImpl,hr as stringToHashBucketFastImpl,Wt as subImpl,yr as tileImpl,wr as topKImpl,Me as transposeImpl,br as uniqueImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-cpu/dist/cpu_util.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Abs.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/utils/binary_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Complex.js:
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

@tensorflow/tfjs-backend-cpu/dist/utils/zeros_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Identity.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Real.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Cast.js:
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

@tensorflow/tfjs-backend-cpu/dist/utils/binary_utils.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Add.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Bincount_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/BitwiseAnd.js:
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

@tensorflow/tfjs-backend-cpu/dist/utils/unary_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/utils/unary_utils.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Ceil.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Concat_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Equal.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Exp.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Expm1.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Floor.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/FloorDiv.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/GatherNd_Impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/GatherV2_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Greater.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/GreaterEqual.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Less.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/LessEqual.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/LinSpace_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Log.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Max_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Maximum.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Minimum.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Multiply.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Neg.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/NotEqual.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Transpose_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Prod.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedGather_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedRange_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedTensorToTensor_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Range_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Rsqrt.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Scatter_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Sigmoid.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Slice.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/SparseFillEmptyRows_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/SparseReshape_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/SparseSegmentReduction_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Sqrt.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-cpu/dist/kernels/SquaredDifference.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/StaticRegexReplace.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/StridedSlice_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/StringNGrams_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/StringSplit_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/StringToHashBucketFast_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Sub.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Tile_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/TopK_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/kernels/Unique_impl.js:
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

@tensorflow/tfjs-backend-cpu/dist/shared.js:
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
//# sourceMappingURL=shared.js.map