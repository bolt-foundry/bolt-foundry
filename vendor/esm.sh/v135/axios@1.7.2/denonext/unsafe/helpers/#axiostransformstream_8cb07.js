/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/AxiosTransformStream) denonext production */
import __Process$ from "node:process";
import { Buffer as __Buffer$ } from "node:buffer";
import z from"node:stream";import S from"/v135/axios@1.7.2/denonext/unsafe/utils.js";import w from"/v135/axios@1.7.2/denonext/unsafe/helpers/throttle.js";import W from"/v135/axios@1.7.2/denonext/unsafe/helpers/speedometer.js";var b=Symbol("internals"),p=class extends z.Transform{constructor(t){t=S.toFlatObject(t,{maxRate:0,chunkSize:64*1024,minChunkSize:100,timeWindow:500,ticksRate:2,samplesCount:15},null,(m,s)=>!S.isUndefined(s[m])),super({readableHighWaterMark:t.chunkSize});let c=this,n=this[b]={length:t.length,timeWindow:t.timeWindow,ticksRate:t.ticksRate,chunkSize:t.chunkSize,maxRate:t.maxRate,minChunkSize:t.minChunkSize,bytesSeen:0,isCaptured:!1,notifiedBytesLoaded:0,ts:Date.now(),bytes:0,onReadCallback:null},k=W(n.ticksRate*t.samplesCount,n.timeWindow);this.on("newListener",m=>{m==="progress"&&(n.isCaptured||(n.isCaptured=!0))});let e=0;n.updateProgress=w(function(){let s=n.length,a=n.bytesSeen,l=a-e;if(!l||c.destroyed)return;let h=k(l);e=a,__Process$.nextTick(()=>{c.emit("progress",{loaded:a,total:s,progress:s?a/s:void 0,bytes:l,rate:h||void 0,estimated:h&&s&&a<=s?(s-a)/h:void 0,lengthComputable:s!=null})})},n.ticksRate);let f=()=>{n.updateProgress.call(!0)};this.once("end",f),this.once("error",f)}_read(t){let c=this[b];return c.onReadCallback&&c.onReadCallback(),super._read(t)}_transform(t,c,n){let k=this,e=this[b],f=e.maxRate,m=this.readableHighWaterMark,s=e.timeWindow,a=1e3/s,l=f/a,h=e.minChunkSize!==!1?Math.max(e.minChunkSize,l*.01):0;function x(r,i){let o=__Buffer$.byteLength(r);e.bytesSeen+=o,e.bytes+=o,e.isCaptured&&e.updateProgress(),k.push(r)?__Process$.nextTick(i):e.onReadCallback=()=>{e.onReadCallback=null,__Process$.nextTick(i)}}let g=(r,i)=>{let o=__Buffer$.byteLength(r),y=null,d=m,u,C=0;if(f){let R=Date.now();(!e.ts||(C=R-e.ts)>=s)&&(e.ts=R,u=l-e.bytes,e.bytes=u<0?-u:0,C=0),u=l-e.bytes}if(f){if(u<=0)return setTimeout(()=>{i(null,r)},s-C);u<d&&(d=u)}d&&o>d&&o-d>h&&(y=r.subarray(d),r=r.subarray(0,d)),x(r,y?()=>{__Process$.nextTick(i,null,y)}:i)};g(t,function r(i,o){if(i)return n(i);o?g(o,r):n(null)})}setLength(t){return this[b].length=+t,this}},P=p;export{P as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=AxiosTransformStream.js.map