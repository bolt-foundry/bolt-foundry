/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/speedometer) denonext production */
function h(t,n){t=t||10;let c=new Array(t),o=new Array(t),e=0,r=0,f;return n=n!==void 0?n:1e3,function(w){let d=Date.now(),u=o[r];f||(f=d),c[e]=w,o[e]=d;let i=r,a=0;for(;i!==e;)a+=c[i++],i=i%t;if(e=(e+1)%t,e===r&&(r=(r+1)%t),d-f<n)return;let s=u&&d-u;return s?Math.round(a*1e3/s):void 0}}var l=h;export{l as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=speedometer.js.map