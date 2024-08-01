/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/throttle) denonext production */
function i(n,u){let e=0,r=1e3/u,t=null;return function(){let o=this===!0,l=Date.now();if(o||l-e>r)return t&&(clearTimeout(t),t=null),e=l,n.apply(null,arguments);t||(t=setTimeout(()=>(t=null,e=Date.now(),n.apply(null,arguments)),r-(l-e)))}}var a=i;export{a as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=throttle.js.map