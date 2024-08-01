/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/core/transformData) denonext production */
import i from"/v135/axios@1.7.2/denonext/unsafe/utils.js";import s from"/v135/axios@1.7.2/denonext/unsafe/defaults.js";import m from"/v135/axios@1.7.2/denonext/unsafe/core/AxiosHeaders.js";function c(e,t){let r=this||s,a=t||r,n=m.from(a.headers),o=a.data;return i.forEach(e,function(f){o=f.call(r,o,n.normalize(),t?t.status:void 0)}),n.normalize(),o}export{c as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=transformData.js.map