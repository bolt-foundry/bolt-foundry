/* esm.sh - esbuild bundle(axios@1.6.2/unsafe/helpers/formDataToJSON) denonext production */
import u from"/v135/axios@1.6.2/denonext/unsafe/utils.js";function f(e){return u.matchAll(/\w+|\[(\w*)]/g,e).map(o=>o[0]==="[]"?"":o[1]||o[0])}function y(e){let o={},r=Object.keys(e),i,n=r.length,c;for(i=0;i<n;i++)c=r[i],o[c]=e[c];return o}function b(e){function o(r,i,n,c){let s=r[c++],l=Number.isFinite(+s),t=c>=r.length;return s=!s&&u.isArray(n)?n.length:s,t?(u.hasOwnProp(n,s)?n[s]=[n[s],i]:n[s]=i,!l):((!n[s]||!u.isObject(n[s]))&&(n[s]=[]),o(r,i,n[s],c)&&u.isArray(n[s])&&(n[s]=y(n[s])),!l)}if(u.isFormData(e)&&u.isFunction(e.entries)){let r={};return u.forEachEntry(e,(i,n)=>{o(f(i),n,r,0)}),r}return null}var O=b;export{O as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=formDataToJSON.js.map