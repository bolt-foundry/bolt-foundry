/* esm.sh - esbuild bundle(micromark-util-sanitize-uri@2.0.0) denonext production */
import{asciiAlphanumeric as f}from"/v135/micromark-util-character@2.0.1/denonext/micromark-util-character.mjs";import{encode as d}from"/v135/micromark-util-encode@2.0.0/denonext/micromark-util-encode.mjs";function a(i,s){let e=d(h(i||""));if(!s)return e;let r=e.indexOf(":"),o=e.indexOf("?"),t=e.indexOf("#"),n=e.indexOf("/");return r<0||n>-1&&r>n||o>-1&&r>o||t>-1&&r>t||s.test(e.slice(0,r))?e:""}function h(i){let s=[],e=-1,r=0,o=0;for(;++e<i.length;){let t=i.charCodeAt(e),n="";if(t===37&&f(i.charCodeAt(e+1))&&f(i.charCodeAt(e+2)))o=2;else if(t<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(t))||(n=String.fromCharCode(t));else if(t>55295&&t<57344){let c=i.charCodeAt(e+1);t<56320&&c>56319&&c<57344?(n=String.fromCharCode(t,c),o=1):n="\uFFFD"}else n=String.fromCharCode(t);n&&(s.push(i.slice(r,e),encodeURIComponent(n)),r=e+o+1,n=""),o&&(e+=o,o=0)}return s.join("")+i.slice(r)}export{h as normalizeUri,a as sanitizeUri};
//# sourceMappingURL=micromark-util-sanitize-uri.mjs.map