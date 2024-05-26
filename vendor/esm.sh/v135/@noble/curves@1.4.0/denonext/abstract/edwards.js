/* esm.sh - esbuild bundle(@noble/curves@1.4.0/abstract/edwards) denonext production */
import{mod as xt}from"/v135/@noble/curves@1.4.0/denonext/abstract/modular.js";import*as E from"/v135/@noble/curves@1.4.0/denonext/abstract/utils.js";import{ensureBytes as v}from"/v135/@noble/curves@1.4.0/denonext/abstract/utils.js";import{wNAF as Rt,validateBasic as Zt}from"/v135/@noble/curves@1.4.0/denonext/abstract/curve.js";var B=BigInt(0),p=BigInt(1),q=BigInt(2),vt=BigInt(8),At={zip215:!0};function bt(g){let d=Zt(g);return E.validateObject(g,{hash:"function",a:"bigint",d:"bigint",randomBytes:"function"},{adjustScalarBytes:"function",domain:"function",uvRatio:"function",mapToCurve:"function"}),Object.freeze({...d})}function zt(g){let d=bt(g),{Fp:m,n:S,prehash:b,hash:N,randomBytes:st,nByteLength:Y,h:ot}=d,C=q<<BigInt(Y*8)-p,n=m.create,rt=d.uvRatio||((e,t)=>{try{return{isValid:!0,value:m.sqrt(e*m.inv(t))}}catch{return{isValid:!1,value:B}}}),it=d.adjustScalarBytes||(e=>e),ct=d.domain||((e,t,s)=>{if(t.length||s)throw new Error("Contexts/pre-hash are not supported");return e}),G=e=>typeof e=="bigint"&&B<e,U=(e,t)=>G(e)&&G(t)&&e<t,A=e=>e===B||U(e,C);function z(e,t){if(U(e,t))return e;throw new Error(`Expected valid scalar < ${t}, got ${typeof e} ${e}`)}function D(e){return e===B?e:z(e,S)}let V=new Map;function j(e){if(!(e instanceof u))throw new Error("ExtendedPoint expected")}class u{constructor(t,s,o,r){if(this.ex=t,this.ey=s,this.ez=o,this.et=r,!A(t))throw new Error("x required");if(!A(s))throw new Error("y required");if(!A(o))throw new Error("z required");if(!A(r))throw new Error("t required")}get x(){return this.toAffine().x}get y(){return this.toAffine().y}static fromAffine(t){if(t instanceof u)throw new Error("extended point not allowed");let{x:s,y:o}=t||{};if(!A(s)||!A(o))throw new Error("invalid affine point");return new u(s,o,p,n(s*o))}static normalizeZ(t){let s=m.invertBatch(t.map(o=>o.ez));return t.map((o,r)=>o.toAffine(s[r])).map(u.fromAffine)}_setWindowSize(t){this._WINDOW_SIZE=t,V.delete(this)}assertValidity(){let{a:t,d:s}=d;if(this.is0())throw new Error("bad point: ZERO");let{ex:o,ey:r,ez:i,et:a}=this,l=n(o*o),c=n(r*r),f=n(i*i),h=n(f*f),y=n(l*t),x=n(f*n(y+c)),w=n(h+n(s*n(l*c)));if(x!==w)throw new Error("bad point: equation left != right (1)");let Z=n(o*r),R=n(i*a);if(Z!==R)throw new Error("bad point: equation left != right (2)")}equals(t){j(t);let{ex:s,ey:o,ez:r}=this,{ex:i,ey:a,ez:l}=t,c=n(s*l),f=n(i*r),h=n(o*l),y=n(a*r);return c===f&&h===y}is0(){return this.equals(u.ZERO)}negate(){return new u(n(-this.ex),this.ey,this.ez,n(-this.et))}double(){let{a:t}=d,{ex:s,ey:o,ez:r}=this,i=n(s*s),a=n(o*o),l=n(q*n(r*r)),c=n(t*i),f=s+o,h=n(n(f*f)-i-a),y=c+a,x=y-l,w=c-a,Z=n(h*x),R=n(y*w),X=n(h*w),I=n(x*y);return new u(Z,R,I,X)}add(t){j(t);let{a:s,d:o}=d,{ex:r,ey:i,ez:a,et:l}=this,{ex:c,ey:f,ez:h,et:y}=t;if(s===BigInt(-1)){let _=n((i-r)*(f+c)),P=n((i+r)*(f-c)),L=n(P-_);if(L===B)return this.double();let J=n(a*q*y),Q=n(l*q*h),tt=Q+J,nt=P+_,et=Q-J,Et=n(tt*L),pt=n(nt*et),mt=n(tt*et),Bt=n(L*nt);return new u(Et,pt,Bt,mt)}let x=n(r*c),w=n(i*f),Z=n(l*o*y),R=n(a*h),X=n((r+i)*(c+f)-x-w),I=R-Z,M=R+Z,$=n(w-s*x),dt=n(X*I),ht=n(M*$),yt=n(X*$),wt=n(I*M);return new u(dt,ht,wt,yt)}subtract(t){return this.add(t.negate())}wNAF(t){return F.wNAFCached(this,V,t,u.normalizeZ)}multiply(t){let{p:s,f:o}=this.wNAF(z(t,S));return u.normalizeZ([s,o])[0]}multiplyUnsafe(t){let s=D(t);return s===B?k:this.equals(k)||s===p?this:this.equals(T)?this.wNAF(s).p:F.unsafeLadder(this,s)}isSmallOrder(){return this.multiplyUnsafe(ot).is0()}isTorsionFree(){return F.unsafeLadder(this,S).is0()}toAffine(t){let{ex:s,ey:o,ez:r}=this,i=this.is0();t==null&&(t=i?vt:m.inv(r));let a=n(s*t),l=n(o*t),c=n(r*t);if(i)return{x:B,y:p};if(c!==p)throw new Error("invZ was invalid");return{x:a,y:l}}clearCofactor(){let{h:t}=d;return t===p?this:this.multiplyUnsafe(t)}static fromHex(t,s=!1){let{d:o,a:r}=d,i=m.BYTES;t=v("pointHex",t,i);let a=t.slice(),l=t[i-1];a[i-1]=l&-129;let c=E.bytesToNumberLE(a);c===B||(s?z(c,C):z(c,m.ORDER));let f=n(c*c),h=n(f-p),y=n(o*f-r),{isValid:x,value:w}=rt(h,y);if(!x)throw new Error("Point.fromHex: invalid y coordinate");let Z=(w&p)===p,R=(l&128)!==0;if(!s&&w===B&&R)throw new Error("Point.fromHex: x=0 and x_0=1");return R!==Z&&(w=n(-w)),u.fromAffine({x:w,y:c})}static fromPrivateKey(t){return O(t).point}toRawBytes(){let{x:t,y:s}=this.toAffine(),o=E.numberToBytesLE(s,m.BYTES);return o[o.length-1]|=t&p?128:0,o}toHex(){return E.bytesToHex(this.toRawBytes())}}u.BASE=new u(d.Gx,d.Gy,p,n(d.Gx*d.Gy)),u.ZERO=new u(B,p,p,B);let{BASE:T,ZERO:k}=u,F=Rt(u,Y*8);function K(e){return xt(e,S)}function W(e){return K(E.bytesToNumberLE(e))}function O(e){let t=Y;e=v("private key",e,t);let s=v("hashed private key",N(e),2*t),o=it(s.slice(0,t)),r=s.slice(t,2*t),i=W(o),a=T.multiply(i),l=a.toRawBytes();return{head:o,prefix:r,scalar:i,point:a,pointBytes:l}}function at(e){return O(e).pointBytes}function H(e=new Uint8Array,...t){let s=E.concatBytes(...t);return W(N(ct(s,v("context",e),!!b)))}function ut(e,t,s={}){e=v("message",e),b&&(e=b(e));let{prefix:o,scalar:r,pointBytes:i}=O(t),a=H(s.context,o,e),l=T.multiply(a).toRawBytes(),c=H(s.context,l,i,e),f=K(a+c*r);D(f);let h=E.concatBytes(l,E.numberToBytesLE(f,m.BYTES));return v("result",h,Y*2)}let ft=At;function lt(e,t,s,o=ft){let{context:r,zip215:i}=o,a=m.BYTES;e=v("signature",e,2*a),t=v("message",t),b&&(t=b(t));let l=E.bytesToNumberLE(e.slice(a,2*a)),c,f,h;try{c=u.fromHex(s,i),f=u.fromHex(e.slice(0,a),i),h=T.multiplyUnsafe(l)}catch{return!1}if(!i&&c.isSmallOrder())return!1;let y=H(r,f.toRawBytes(),c.toRawBytes(),t);return f.add(c.multiplyUnsafe(y)).subtract(h).clearCofactor().equals(u.ZERO)}return T._setWindowSize(8),{CURVE:d,getPublicKey:at,sign:ut,verify:lt,ExtendedPoint:u,utils:{getExtendedPublicKey:O,randomPrivateKey:()=>st(m.BYTES),precompute(e=8,t=u.BASE){return t._setWindowSize(e),t.multiply(BigInt(3)),t}}}}export{zt as twistedEdwards};
/*! Bundled license information:

@noble/curves/esm/abstract/edwards.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=edwards.js.map