/* esm.sh - esbuild bundle(decamelize@1.2.0) denonext production */
var p=Object.create;var a=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var s=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var $=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),w=(t,e)=>{for(var r in e)a(t,r,{get:e[r],enumerable:!0})},n=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let f of m(e))!x.call(t,f)&&f!==r&&a(t,f,{get:()=>e[f],enumerable:!(i=g(e,f))||i.enumerable});return t},d=(t,e,r)=>(n(t,e,"default"),r&&n(r,e,"default")),_=(t,e,r)=>(r=t!=null?p(s(t)):{},n(e||!t||!t.__esModule?a(r,"default",{value:t,enumerable:!0}):r,t));var u=$((E,c)=>{"use strict";c.exports=function(t,e){if(typeof t!="string")throw new TypeError("Expected a string");return e=typeof e>"u"?"_":e,t.replace(/([a-z\d])([A-Z])/g,"$1"+e+"$2").replace(/([A-Z]+)([A-Z][a-z\d]+)/g,"$1"+e+"$2").toLowerCase()}});var o={};w(o,{default:()=>Z});var y=_(u());d(o,_(u()));var{default:l,...A}=y,Z=l!==void 0?l:A;export{Z as default};
//# sourceMappingURL=decamelize.mjs.map