/* esm.sh - esbuild bundle(p-timeout@3.2.0) denonext production */
import * as __0$ from "/v135/p-finally@1.0.0/denonext/p-finally.mjs";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"p-finally":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var w=Object.create;var c=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var q=Object.getPrototypeOf,F=Object.prototype.hasOwnProperty;var I=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var $=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),z=(e,t)=>{for(var r in t)c(e,r,{get:t[r],enumerable:!0})},p=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of P(t))!F.call(e,o)&&o!==r&&c(e,o,{get:()=>t[o],enumerable:!(i=g(t,o))||i.enumerable});return e},u=(e,t,r)=>(p(e,t,"default"),r&&p(r,t,"default")),d=(e,t,r)=>(r=e!=null?w(q(e)):{},p(t||!e||!e.__esModule?c(r,"default",{value:e,enumerable:!0}):r,e));var m=$((H,f)=>{"use strict";var A=I("p-finally"),s=class extends Error{constructor(t){super(t),this.name="TimeoutError"}},x=(e,t,r)=>new Promise((i,o)=>{if(typeof t!="number"||t<0)throw new TypeError("Expected `milliseconds` to be a positive number");if(t===1/0){i(e);return}let a=setTimeout(()=>{if(typeof r=="function"){try{i(r())}catch(h){o(h)}return}let T=typeof r=="string"?r:`Promise timed out after ${t} milliseconds`,_=r instanceof Error?r:new s(T);typeof e.cancel=="function"&&e.cancel(),o(_)},t);A(e.then(i,o),()=>{clearTimeout(a)})});f.exports=x;f.exports.default=x;f.exports.TimeoutError=s});var n={};z(n,{TimeoutError:()=>B,default:()=>D});var E=d(m());u(n,d(m()));var{TimeoutError:B}=E,{default:y,...C}=E,D=y!==void 0?y:C;export{B as TimeoutError,D as default};
//# sourceMappingURL=p-timeout.mjs.map