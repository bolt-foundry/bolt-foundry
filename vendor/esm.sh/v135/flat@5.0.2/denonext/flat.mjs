/* esm.sh - esbuild bundle(flat@5.0.2) denonext production */
var I=Object.create;var x=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var z=Object.getOwnPropertyNames;var C=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var F=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),G=(t,e)=>{for(var o in e)x(t,o,{get:e[o],enumerable:!0})},h=(t,e,o,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of z(e))!D.call(t,s)&&s!==o&&x(t,s,{get:()=>e[s],enumerable:!(u=q(e,s))||u.enumerable});return t},j=(t,e,o)=>(h(t,e,"default"),o&&h(o,e,"default")),K=(t,e,o)=>(o=t!=null?I(C(t)):{},h(e||!t||!t.__esModule?x(o,"default",{value:t,enumerable:!0}):o,t));var A=F((P,E)=>{E.exports=O;O.flatten=O;O.unflatten=B;function S(t){return t&&t.constructor&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}function w(t){return t}function O(t,e){e=e||{};let o=e.delimiter||".",u=e.maxDepth,s=e.transformKey||w,a={};function _(l,m,y){y=y||1,Object.keys(l).forEach(function(r){let n=l[r],c=e.safe&&Array.isArray(n),i=Object.prototype.toString.call(n),f=S(n),p=i==="[object Object]"||i==="[object Array]",d=m?m+o+s(r):s(r);if(!c&&!f&&p&&Object.keys(n).length&&(!e.maxDepth||y<u))return _(n,d,y+1);a[d]=n})}return _(t),a}function B(t,e){e=e||{};let o=e.delimiter||".",u=e.overwrite||!1,s=e.transformKey||w,a={};if(S(t)||Object.prototype.toString.call(t)!=="[object Object]")return t;function l(r){let n=Number(r);return isNaN(n)||r.indexOf(".")!==-1||e.object?r:n}function m(r,n,c){return Object.keys(c).reduce(function(i,f){return i[r+o+f]=c[f],i},n)}function y(r){let n=Object.prototype.toString.call(r),c=n==="[object Array]",i=n==="[object Object]";if(r){if(c)return!r.length;if(i)return!Object.keys(r).length}else return!0}return t=Object.keys(t).reduce(function(r,n){let c=Object.prototype.toString.call(t[n]);return!(c==="[object Object]"||c==="[object Array]")||y(t[n])?(r[n]=t[n],r):m(n,r,O(t[n],e))},{}),Object.keys(t).forEach(function(r){let n=r.split(o).map(s),c=l(n.shift()),i=l(n[0]),f=a;for(;i!==void 0;){if(c==="__proto__")return;let p=Object.prototype.toString.call(f[c]),d=p==="[object Object]"||p==="[object Array]";if(!u&&!d&&typeof f[c]<"u")return;(u&&!d||!u&&f[c]==null)&&(f[c]=typeof i=="number"&&!e.object?[]:{}),f=f[c],n.length>0&&(c=l(n.shift()),i=l(n[0]))}f[c]=B(t[r],e)}),a}});var b={};G(b,{default:()=>L});var H=K(A());j(b,K(A()));var{default:N,...J}=H,L=N!==void 0?N:J;export{L as default};
//# sourceMappingURL=flat.mjs.map