/* esm.sh - esbuild bundle(ms@2.1.2) denonext production */
var p=Object.create;var m=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var M=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var x=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),k=(e,r)=>{for(var s in r)m(e,s,{get:r[s],enumerable:!0})},h=(e,r,s,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of M(r))!_.call(e,a)&&a!==s&&m(e,a,{get:()=>r[a],enumerable:!(c=g(r,a))||c.enumerable});return e},u=(e,r,s)=>(h(e,r,"default"),s&&h(s,r,"default")),l=(e,r,s)=>(s=e!=null?p(b(e)):{},h(r||!e||!e.__esModule?m(s,"default",{value:e,enumerable:!0}):s,e));var y=x((P,v)=>{var i=1e3,o=i*60,d=o*60,n=d*24,S=n*7,A=n*365.25;v.exports=function(e,r){r=r||{};var s=typeof e;if(s==="string"&&e.length>0)return F(e);if(s==="number"&&isFinite(e))return r.long?C(e):L(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))};function F(e){if(e=String(e),!(e.length>100)){var r=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(r){var s=parseFloat(r[1]),c=(r[2]||"ms").toLowerCase();switch(c){case"years":case"year":case"yrs":case"yr":case"y":return s*A;case"weeks":case"week":case"w":return s*S;case"days":case"day":case"d":return s*n;case"hours":case"hour":case"hrs":case"hr":case"h":return s*d;case"minutes":case"minute":case"mins":case"min":case"m":return s*o;case"seconds":case"second":case"secs":case"sec":case"s":return s*i;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s;default:return}}}}function L(e){var r=Math.abs(e);return r>=n?Math.round(e/n)+"d":r>=d?Math.round(e/d)+"h":r>=o?Math.round(e/o)+"m":r>=i?Math.round(e/i)+"s":e+"ms"}function C(e){var r=Math.abs(e);return r>=n?f(e,r,n,"day"):r>=d?f(e,r,d,"hour"):r>=o?f(e,r,o,"minute"):r>=i?f(e,r,i,"second"):e+" ms"}function f(e,r,s,c){var a=r>=s*1.5;return Math.round(e/s)+" "+c+(a?"s":"")}});var t={};k(t,{default:()=>N});var E=l(y());u(t,l(y()));var{default:w,...J}=E,N=w!==void 0?w:J;export{N as default};
//# sourceMappingURL=ms.mjs.map