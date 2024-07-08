/* esm.sh - esbuild bundle(react@18.2.0/jsx-runtime) denonext production */
import * as __0$ from "/stable/react@18.2.0/denonext/react.mjs";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({},m);switch(n){case"react":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var v=Object.create;var p=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty;var S=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,t)=>(typeof require<"u"?require:e)[t]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var m=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),b=(r,e)=>{for(var t in e)p(r,t,{get:e[t],enumerable:!0})},l=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of k(e))!R.call(r,s)&&s!==t&&p(r,s,{get:()=>e[s],enumerable:!(o=E(e,s))||o.enumerable});return r},f=(r,e,t)=>(l(r,e,"default"),t&&l(t,e,"default")),c=(r,e,t)=>(t=r!=null?v(N(r)):{},l(e||!r||!r.__esModule?p(t,"default",{value:r,enumerable:!0}):t,r));var x=m(_=>{"use strict";var q=S("react"),w=Symbol.for("react.element"),P=Symbol.for("react.fragment"),h=Object.prototype.hasOwnProperty,D=q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,F={key:!0,ref:!0,__self:!0,__source:!0};function y(r,e,t){var o,s={},u=null,d=null;t!==void 0&&(u=""+t),e.key!==void 0&&(u=""+e.key),e.ref!==void 0&&(d=e.ref);for(o in e)h.call(e,o)&&!F.hasOwnProperty(o)&&(s[o]=e[o]);if(r&&r.defaultProps)for(o in e=r.defaultProps,e)s[o]===void 0&&(s[o]=e[o]);return{$$typeof:w,type:r,key:u,ref:d,props:s,_owner:D.current}}_.Fragment=P;_.jsx=y;_.jsxs=y});var i=m((A,a)=>{"use strict";a.exports=x()});var n={};b(n,{Fragment:()=>I,default:()=>C,jsx:()=>L,jsxs:()=>T});var j=c(i());f(n,c(i()));var{Fragment:I,jsx:L,jsxs:T}=j,{default:O,...g}=j,C=O!==void 0?O:g;export{I as Fragment,C as default,L as jsx,T as jsxs};
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=jsx-runtime.js.map