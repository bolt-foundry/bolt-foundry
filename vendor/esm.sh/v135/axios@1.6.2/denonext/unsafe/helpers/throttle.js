/* esm.sh - esbuild bundle(axios@1.6.2/unsafe/helpers/throttle) denonext production */
function a(n,r){let e=0,u=1e3/r,t=null;return function(i,o){let l=Date.now();if(i||l-e>u)return t&&(clearTimeout(t),t=null),e=l,n.apply(null,o);t||(t=setTimeout(()=>(t=null,e=Date.now(),n.apply(null,o)),u-(l-e)))}}var p=a;export{p as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=throttle.js.map