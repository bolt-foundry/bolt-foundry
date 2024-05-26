/* esm.sh - esbuild bundle(@root/asn1@1.0.0) denonext production */
import * as __0$ from "/v135/@root/encoding@1.0.1/denonext/hex.js";
import * as __1$ from "/v135/@root/encoding@1.0.1/denonext/hex.js";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({__esModule:true},m);switch(n){case"@root/encoding/hex":return e(__0$);default:throw new Error("module \""+n+"\" not found");}};
var C=Object.create;var S=Object.defineProperty;var V=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var U=Object.getPrototypeOf,J=Object.prototype.hasOwnProperty;var P=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,n)=>(typeof require<"u"?require:e)[n]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var T=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),M=(r,e)=>{for(var n in e)S(r,n,{get:e[n],enumerable:!0})},A=(r,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Y(e))!J.call(r,i)&&i!==n&&S(r,i,{get:()=>e[i],enumerable:!(o=V(e,i))||o.enumerable});return r},g=(r,e,n)=>(A(r,e,"default"),n&&A(n,e,"default")),N=(r,e,n)=>(n=r!=null?C(U(r)):{},A(e||!r||!r.__esModule?S(n,"default",{value:r,enumerable:!0}):n,r));var b=T((Q,_)=>{"use strict";var f=_.exports,s=P("@root/encoding/hex");function E(){var r=Array.prototype.slice.call(arguments),e=r.shift(),n=r.join("").replace(/\s+/g,"").toLowerCase(),o=n.length/2,i=0,u=e;if(typeof u=="number"&&(u=s.numToHex(u)),o!==Math.round(o))throw new Error("invalid hex");if(o>127)for(i+=1;o>255;)i+=1,o=o>>8;return i&&(u+=s.numToHex(128+i)),u+s.numToHex(n.length/2)+n}f.Any=E;f.UInt=function(){var e=Array.prototype.slice.call(arguments).join(""),n=parseInt(e.slice(0,2),16);return 128&n&&(e="00"+e),E("02",e)};f.BitStr=function(){var e=Array.prototype.slice.call(arguments).join("");return E("03","00"+e)};f._toArray=function r(e,n){var o=n.json?s.numToHex(e.type):e.type,i=e.value;return i?(typeof i!="string"&&n.json&&(i=s.bufToHex(i)),[o,i]):[o,e.children.map(function(u){return r(u,n)})]};f._pack=function(r){var e=r[0];typeof r[0]=="number"&&(e=s.numToHex(r[0]));var n="";if(Array.isArray(r[1]))r[1].forEach(function(o){n+=f._pack(o)});else if(typeof r[1]=="string")n=r[1];else if(r[1].byteLength)n=s.bufToHex(r[1]);else throw new Error("unexpected array");return e==="03"?f.BitStr(n):e==="02"?f.UInt(n):E(e,n)};f.pack=function(r,e){e||(e={}),Array.isArray(r)||(r=f._toArray(r,{json:!0}));var n=f._pack(r);return e.json?n:s.hexToBuf(n)}});var L=T((W,H)=>{"use strict";var a=H.exports,p=P("@root/encoding/hex");a.ELOOPN=102;a.ELOOP="uASN1.js Error: iterated over "+a.ELOOPN+"+ elements (probably a malformed file)";a.EDEEPN=60;a.EDEEP="uASN1.js Error: element nested "+a.EDEEPN+"+ layers deep (probably a malformed file)";a.CTYPES=[48,49,160,161];a.VTYPES=[1,2,5,6,12,130];a.parseVerbose=function(e,n){n||(n={});function o(c,v,B){if(v.length>=a.EDEEPN)throw new Error(a.EDEEP);var l=2,t={type:c[0],lengthSize:0,length:c[1]},y,x=0,w=0,d;128&t.length&&(t.lengthSize=127&t.length,t.length=parseInt(p.bufToHex(c.slice(l,l+t.lengthSize)),16),l+=t.lengthSize),c[l]===0&&(t.type===2||t.type===3)&&t.length>1&&(l+=1,w=-1),d=t.length+w;function O(m){for(t.children=[];x<a.ELOOPN&&l<2+t.length+t.lengthSize;){if(x+=1,v.length+=1,y=o(c.slice(l,l+d),v,m),v.length-=1,l+=2+y.lengthSize+y.length,l>2+t.lengthSize+t.length)throw m||console.error(JSON.stringify(t,a._replacer,2)),new Error("Parse error: child value length ("+y.length+") is greater than remaining parent length ("+(t.length-l)+" = "+t.length+" - "+l+")");t.children.push(y)}if(l!==2+t.lengthSize+t.length)throw new Error("premature end-of-file");if(x>=a.ELOOPN)throw new Error(a.ELOOP);return delete t.value,t}if(a.CTYPES.indexOf(t.type)!==-1)return O(B);if(t.value=c.slice(l,l+d),n.json&&(t.value=p.bufToHex(t.value)),a.VTYPES.indexOf(t.type)!==-1)return t;try{return O(!0)}catch{return t.children.length=0,t}}var i=o(e,[]),u=e.byteLength||e.length;if(u!==2+i.lengthSize+i.length)throw new Error("Length of buffer does not match length of ASN.1 sequence.");return i};a._toArray=function r(e,n){var o=n.json?p.numToHex(e.type):e.type,i=e.value;return i?(typeof i!="string"&&n.json&&(i=p.bufToHex(i)),[o,i]):[o,e.children.map(function(u){return r(u,n)})]};a.parse=function(r){var e={json:r.json!==!1},n=a.parseVerbose(r.der,e);return r.verbose?n:a._toArray(n,e)};a._replacer=function(r,e){return r==="type"?"0x"+p.numToHex(e):e&&r==="value"?"0x"+p.bufToHex(e.data||e):e}});var j=T((X,D)=>{"use strict";var q=D.exports,z=b(),I=L();Object.keys(I).forEach(function(r){q[r]=I[r]});Object.keys(z).forEach(function(r){q[r]=z[r]})});var h={};M(h,{default:()=>G});var R=N(j());g(h,N(j()));var{default:k,...F}=R,G=k!==void 0?k:F;export{G as default};
//# sourceMappingURL=asn1.mjs.map