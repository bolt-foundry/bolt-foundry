/* esm.sh - esbuild bundle(micromark-extension-frontmatter@2.0.0) denonext production */
import{markdownLineEnding as k,markdownSpace as C}from"/v135/micromark-util-character@2.0.1/denonext/micromark-util-character.mjs";import{fault as w}from"/v135/fault@2.0.1/denonext/fault.mjs";var A={}.hasOwnProperty,F={yaml:"-",toml:"+"};function g(e){let n=[],u=-1,o=Array.isArray(e)?e:e?[e]:["yaml"];for(;++u<o.length;)n[u]=H(o[u]);return n}function H(e){let n=e;if(typeof n=="string"){if(!A.call(F,n))throw w("Missing matter definition for `%s`",n);n={type:n,marker:F[n]}}else if(typeof n!="object")throw w("Expected matter to be an object, not `%j`",n);if(!A.call(n,"type"))throw w("Missing `type` in matter `%j`",n);if(!A.call(n,"fence")&&!A.call(n,"marker"))throw w("Missing `marker` or `fence` in matter `%j`",n);return n}function L(e){let n=g(e),u={},o=-1;for(;++o<n.length;){let l=n[o],c=S(l,"open").charCodeAt(0),m=W(l),a=u[c];Array.isArray(a)?a.push(m):u[c]=[m]}return{flow:u}}function W(e){let n=e.anywhere,u=e.type,o=u+"Fence",l=o+"Sequence",c=u+"Value",m={tokenize:O,partial:!0},a,p=0;return{tokenize:I,concrete:!0};function I(r,E,s){let h=this;return M;function M(t){let z=h.now();return z.column===1&&(z.line===1||n)&&(a=S(e,"open"),p=0,t===a.charCodeAt(p))?(r.enter(u),r.enter(o),r.enter(l),f(t)):s(t)}function f(t){return p===a.length?(r.exit(l),C(t)?(r.enter("whitespace"),x(t)):y(t)):t===a.charCodeAt(p++)?(r.consume(t),f):s(t)}function x(t){return C(t)?(r.consume(t),x):(r.exit("whitespace"),y(t))}function y(t){return k(t)?(r.exit(o),r.enter("lineEnding"),r.consume(t),r.exit("lineEnding"),a=S(e,"close"),p=0,r.attempt(m,j,i)):s(t)}function i(t){return t===null||k(t)?q(t):(r.enter(c),b(t))}function b(t){return t===null||k(t)?(r.exit(c),q(t)):(r.consume(t),b)}function q(t){return t===null?s(t):(r.enter("lineEnding"),r.consume(t),r.exit("lineEnding"),r.attempt(m,j,i))}function j(t){return r.exit(u),E(t)}}function O(r,E,s){let h=0;return M;function M(i){return i===a.charCodeAt(h)?(r.enter(o),r.enter(l),f(i)):s(i)}function f(i){return h===a.length?(r.exit(l),C(i)?(r.enter("whitespace"),x(i)):y(i)):i===a.charCodeAt(h++)?(r.consume(i),f):s(i)}function x(i){return C(i)?(r.consume(i),x):(r.exit("whitespace"),y(i))}function y(i){return i===null||k(i)?(r.exit(o),E(i)):s(i)}}}function S(e,n){return e.marker?T(e.marker,n).repeat(3):T(e.fence,n)}function T(e,n){return typeof e=="string"?e:e[n]}function v(e){let n=g(e),u={},o={},l=-1;for(;++l<n.length;){let a=n[l].type;u[a]=c,o[a]=m}return{enter:u,exit:o};function c(){this.buffer()}function m(){this.resume(),this.setData("slurpOneLineEnding",!0)}}export{L as frontmatter,v as frontmatterHtml,g as toMatters};
//# sourceMappingURL=micromark-extension-frontmatter.mjs.map