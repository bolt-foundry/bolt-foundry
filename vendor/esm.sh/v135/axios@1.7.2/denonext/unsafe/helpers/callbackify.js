/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/callbackify) denonext production */
import p from"/v135/axios@1.7.2/denonext/unsafe/utils.js";var r=(c,l)=>p.isAsyncFn(c)?function(...n){let t=n.pop();c.apply(this,n).then(o=>{try{l?t(null,...l(o)):t(null,o)}catch(i){t(i)}},t)}:c,u=r;export{u as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=callbackify.js.map