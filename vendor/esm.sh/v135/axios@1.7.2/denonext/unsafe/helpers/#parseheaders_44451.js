/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/parseHeaders) denonext production */
import n from"/v135/axios@1.7.2/denonext/unsafe/utils.js";var f=n.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),c=s=>{let e={},t,i,r;return s&&s.split(`
`).forEach(function(o){r=o.indexOf(":"),t=o.substring(0,r).trim().toLowerCase(),i=o.substring(r+1).trim(),!(!t||e[t]&&f[t])&&(t==="set-cookie"?e[t]?e[t].push(i):e[t]=[i]:e[t]=e[t]?e[t]+", "+i:i)}),e};export{c as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=parseHeaders.js.map