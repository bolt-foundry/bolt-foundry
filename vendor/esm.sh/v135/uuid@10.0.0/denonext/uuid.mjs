/* esm.sh - esbuild bundle(uuid@10.0.0) denonext production */
var e0="ffffffff-ffff-ffff-ffff-ffffffffffff";var n0="00000000-0000-0000-0000-000000000000";var $=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;function t0(r){return typeof r=="string"&&$.test(r)}var O=t0;function a0(r){if(!O(r))throw TypeError("Invalid UUID");var t,f=new Uint8Array(16);return f[0]=(t=parseInt(r.slice(0,8),16))>>>24,f[1]=t>>>16&255,f[2]=t>>>8&255,f[3]=t&255,f[4]=(t=parseInt(r.slice(9,13),16))>>>8,f[5]=t&255,f[6]=(t=parseInt(r.slice(14,18),16))>>>8,f[7]=t&255,f[8]=(t=parseInt(r.slice(19,23),16))>>>8,f[9]=t&255,f[10]=(t=parseInt(r.slice(24,36),16))/1099511627776&255,f[11]=t/4294967296&255,f[12]=t>>>24&255,f[13]=t>>>16&255,f[14]=t>>>8&255,f[15]=t&255,f}var S=a0;var v=[];for(q=0;q<256;++q)v.push((q+256).toString(16).slice(1));var q;function g(r,t=0){return(v[r[t+0]]+v[r[t+1]]+v[r[t+2]]+v[r[t+3]]+"-"+v[r[t+4]]+v[r[t+5]]+"-"+v[r[t+6]]+v[r[t+7]]+"-"+v[r[t+8]]+v[r[t+9]]+"-"+v[r[t+10]]+v[r[t+11]]+v[r[t+12]]+v[r[t+13]]+v[r[t+14]]+v[r[t+15]]).toLowerCase()}function o0(r,t=0){var f=g(r,t);if(!O(f))throw TypeError("Stringified UUID is invalid");return f}var u0=o0;var V,l0=new Uint8Array(16);function T(){if(!V&&(V=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!V))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return V(l0)}var N,j,k=0,H=0;function c0(r,t,f){var e=t&&f||0,n=t||new Array(16);r=r||{};var a=r.node,o=r.clockseq;if(r._v6||(a||(a=N),o==null&&(o=j)),a==null||o==null){var c=r.random||(r.rng||T)();a==null&&(a=[c[0],c[1],c[2],c[3],c[4],c[5]],!N&&!r._v6&&(a[0]|=1,N=a)),o==null&&(o=(c[6]<<8|c[7])&16383,j===void 0&&!r._v6&&(j=o))}var l=r.msecs!==void 0?r.msecs:Date.now(),u=r.nsecs!==void 0?r.nsecs:H+1,d=l-k+(u-H)/1e4;if(d<0&&r.clockseq===void 0&&(o=o+1&16383),(d<0||l>k)&&r.nsecs===void 0&&(u=0),u>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");k=l,H=u,j=o,l+=122192928e5;var U=((l&268435455)*1e4+u)%4294967296;n[e++]=U>>>24&255,n[e++]=U>>>16&255,n[e++]=U>>>8&255,n[e++]=U&255;var h=l/4294967296*1e4&268435455;n[e++]=h>>>8&255,n[e++]=h&255,n[e++]=h>>>24&15|16,n[e++]=h>>>16&255,n[e++]=o>>>8|128,n[e++]=o&255;for(var s=0;s<6;++s)n[e+s]=a[s];return t||g(n)}var K=c0;function L(r){var t=typeof r=="string"?S(r):r,f=d0(t);return typeof r=="string"?g(f):f}function d0(r,t=!1){return Uint8Array.of((r[6]&15)<<4|r[7]>>4&15,(r[7]&15)<<4|(r[4]&240)>>4,(r[4]&15)<<4|(r[5]&240)>>4,(r[5]&15)<<4|(r[0]&240)>>4,(r[0]&15)<<4|(r[1]&240)>>4,(r[1]&15)<<4|(r[2]&240)>>4,96|r[2]&15,r[3],r[8],r[9],r[10],r[11],r[12],r[13],r[14],r[15])}function v0(r){r=unescape(encodeURIComponent(r));for(var t=[],f=0;f<r.length;++f)t.push(r.charCodeAt(f));return t}var p0="6ba7b810-9dad-11d1-80b4-00c04fd430c8",m0="6ba7b811-9dad-11d1-80b4-00c04fd430c8";function D(r,t,f){function e(n,a,o,c){var l;if(typeof n=="string"&&(n=v0(n)),typeof a=="string"&&(a=S(a)),((l=a)===null||l===void 0?void 0:l.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var u=new Uint8Array(16+n.length);if(u.set(a),u.set(n,a.length),u=f(u),u[6]=u[6]&15|t,u[8]=u[8]&63|128,o){c=c||0;for(var d=0;d<16;++d)o[c+d]=u[d];return o}return g(u)}try{e.name=r}catch{}return e.DNS=p0,e.URL=m0,e}function x0(r){if(typeof r=="string"){var t=unescape(encodeURIComponent(r));r=new Uint8Array(t.length);for(var f=0;f<t.length;++f)r[f]=t.charCodeAt(f)}return i0(g0(h0(r),r.length*8))}function i0(r){for(var t=[],f=r.length*32,e="0123456789abcdef",n=0;n<f;n+=8){var a=r[n>>5]>>>n%32&255,o=parseInt(e.charAt(a>>>4&15)+e.charAt(a&15),16);t.push(o)}return t}function F(r){return(r+64>>>9<<4)+14+1}function g0(r,t){r[t>>5]|=128<<t%32,r[F(t)-1]=t;for(var f=1732584193,e=-271733879,n=-1732584194,a=271733878,o=0;o<r.length;o+=16){var c=f,l=e,u=n,d=a;f=p(f,e,n,a,r[o],7,-680876936),a=p(a,f,e,n,r[o+1],12,-389564586),n=p(n,a,f,e,r[o+2],17,606105819),e=p(e,n,a,f,r[o+3],22,-1044525330),f=p(f,e,n,a,r[o+4],7,-176418897),a=p(a,f,e,n,r[o+5],12,1200080426),n=p(n,a,f,e,r[o+6],17,-1473231341),e=p(e,n,a,f,r[o+7],22,-45705983),f=p(f,e,n,a,r[o+8],7,1770035416),a=p(a,f,e,n,r[o+9],12,-1958414417),n=p(n,a,f,e,r[o+10],17,-42063),e=p(e,n,a,f,r[o+11],22,-1990404162),f=p(f,e,n,a,r[o+12],7,1804603682),a=p(a,f,e,n,r[o+13],12,-40341101),n=p(n,a,f,e,r[o+14],17,-1502002290),e=p(e,n,a,f,r[o+15],22,1236535329),f=m(f,e,n,a,r[o+1],5,-165796510),a=m(a,f,e,n,r[o+6],9,-1069501632),n=m(n,a,f,e,r[o+11],14,643717713),e=m(e,n,a,f,r[o],20,-373897302),f=m(f,e,n,a,r[o+5],5,-701558691),a=m(a,f,e,n,r[o+10],9,38016083),n=m(n,a,f,e,r[o+15],14,-660478335),e=m(e,n,a,f,r[o+4],20,-405537848),f=m(f,e,n,a,r[o+9],5,568446438),a=m(a,f,e,n,r[o+14],9,-1019803690),n=m(n,a,f,e,r[o+3],14,-187363961),e=m(e,n,a,f,r[o+8],20,1163531501),f=m(f,e,n,a,r[o+13],5,-1444681467),a=m(a,f,e,n,r[o+2],9,-51403784),n=m(n,a,f,e,r[o+7],14,1735328473),e=m(e,n,a,f,r[o+12],20,-1926607734),f=x(f,e,n,a,r[o+5],4,-378558),a=x(a,f,e,n,r[o+8],11,-2022574463),n=x(n,a,f,e,r[o+11],16,1839030562),e=x(e,n,a,f,r[o+14],23,-35309556),f=x(f,e,n,a,r[o+1],4,-1530992060),a=x(a,f,e,n,r[o+4],11,1272893353),n=x(n,a,f,e,r[o+7],16,-155497632),e=x(e,n,a,f,r[o+10],23,-1094730640),f=x(f,e,n,a,r[o+13],4,681279174),a=x(a,f,e,n,r[o],11,-358537222),n=x(n,a,f,e,r[o+3],16,-722521979),e=x(e,n,a,f,r[o+6],23,76029189),f=x(f,e,n,a,r[o+9],4,-640364487),a=x(a,f,e,n,r[o+12],11,-421815835),n=x(n,a,f,e,r[o+15],16,530742520),e=x(e,n,a,f,r[o+2],23,-995338651),f=i(f,e,n,a,r[o],6,-198630844),a=i(a,f,e,n,r[o+7],10,1126891415),n=i(n,a,f,e,r[o+14],15,-1416354905),e=i(e,n,a,f,r[o+5],21,-57434055),f=i(f,e,n,a,r[o+12],6,1700485571),a=i(a,f,e,n,r[o+3],10,-1894986606),n=i(n,a,f,e,r[o+10],15,-1051523),e=i(e,n,a,f,r[o+1],21,-2054922799),f=i(f,e,n,a,r[o+8],6,1873313359),a=i(a,f,e,n,r[o+15],10,-30611744),n=i(n,a,f,e,r[o+6],15,-1560198380),e=i(e,n,a,f,r[o+13],21,1309151649),f=i(f,e,n,a,r[o+4],6,-145523070),a=i(a,f,e,n,r[o+11],10,-1120210379),n=i(n,a,f,e,r[o+2],15,718787259),e=i(e,n,a,f,r[o+9],21,-343485551),f=A(f,c),e=A(e,l),n=A(n,u),a=A(a,d)}return[f,e,n,a]}function h0(r){if(r.length===0)return[];for(var t=r.length*8,f=new Uint32Array(F(t)),e=0;e<t;e+=8)f[e>>5]|=(r[e/8]&255)<<e%32;return f}function A(r,t){var f=(r&65535)+(t&65535),e=(r>>16)+(t>>16)+(f>>16);return e<<16|f&65535}function w0(r,t){return r<<t|r>>>32-t}function M(r,t,f,e,n,a){return A(w0(A(A(t,r),A(e,a)),n),f)}function p(r,t,f,e,n,a,o){return M(t&f|~t&e,r,t,n,a,o)}function m(r,t,f,e,n,a,o){return M(t&e|f&~e,r,t,n,a,o)}function x(r,t,f,e,n,a,o){return M(t^f^e,r,t,n,a,o)}function i(r,t,f,e,n,a,o){return M(f^(t|~e),r,t,n,a,o)}var J=x0;var s0=D("v3",48,J),U0=s0;var A0=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),X={randomUUID:A0};function I0(r,t,f){if(X.randomUUID&&!t&&!r)return X.randomUUID();r=r||{};var e=r.random||(r.rng||T)();if(e[6]=e[6]&15|64,e[8]=e[8]&63|128,t){f=f||0;for(var n=0;n<16;++n)t[f+n]=e[n];return t}return g(e)}var O0=I0;function S0(r,t,f,e){switch(r){case 0:return t&f^~t&e;case 1:return t^f^e;case 2:return t&f^t&e^f&e;case 3:return t^f^e}}function G(r,t){return r<<t|r>>>32-t}function T0(r){var t=[1518500249,1859775393,2400959708,3395469782],f=[1732584193,4023233417,2562383102,271733878,3285377520];if(typeof r=="string"){var e=unescape(encodeURIComponent(r));r=[];for(var n=0;n<e.length;++n)r.push(e.charCodeAt(n))}else Array.isArray(r)||(r=Array.prototype.slice.call(r));r.push(128);for(var a=r.length/4+2,o=Math.ceil(a/16),c=new Array(o),l=0;l<o;++l){for(var u=new Uint32Array(16),d=0;d<16;++d)u[d]=r[l*64+d*4]<<24|r[l*64+d*4+1]<<16|r[l*64+d*4+2]<<8|r[l*64+d*4+3];c[l]=u}c[o-1][14]=(r.length-1)*8/Math.pow(2,32),c[o-1][14]=Math.floor(c[o-1][14]),c[o-1][15]=(r.length-1)*8&4294967295;for(var U=0;U<o;++U){for(var h=new Uint32Array(80),s=0;s<16;++s)h[s]=c[U][s];for(var I=16;I<80;++I)h[I]=G(h[I-3]^h[I-8]^h[I-14]^h[I-16],1);for(var b=f[0],P=f[1],y=f[2],E=f[3],C=f[4],R=0;R<80;++R){var _=Math.floor(R/20),f0=G(b,5)+S0(_,P,y,E)+C+t[_]+h[R]>>>0;C=E,E=y,y=G(P,30)>>>0,P=b,b=f0}f[0]=f[0]+b>>>0,f[1]=f[1]+P>>>0,f[2]=f[2]+y>>>0,f[3]=f[3]+E>>>0,f[4]=f[4]+C>>>0}return[f[0]>>24&255,f[0]>>16&255,f[0]>>8&255,f[0]&255,f[1]>>24&255,f[1]>>16&255,f[1]>>8&255,f[1]&255,f[2]>>24&255,f[2]>>16&255,f[2]>>8&255,f[2]&255,f[3]>>24&255,f[3]>>16&255,f[3]>>8&255,f[3]&255,f[4]>>24&255,f[4]>>16&255,f[4]>>8&255,f[4]&255]}var Q=T0;var D0=D("v5",80,Q),b0=D0;function Y(r,t){var f=Object.keys(r);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(r);t&&(e=e.filter(function(n){return Object.getOwnPropertyDescriptor(r,n).enumerable})),f.push.apply(f,e)}return f}function Z(r){for(var t=1;t<arguments.length;t++){var f=arguments[t]!=null?arguments[t]:{};t%2?Y(Object(f),!0).forEach(function(e){P0(r,e,f[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(f)):Y(Object(f)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(f,e))})}return r}function P0(r,t,f){return(t=y0(t))in r?Object.defineProperty(r,t,{value:f,enumerable:!0,configurable:!0,writable:!0}):r[t]=f,r}function y0(r){var t=E0(r,"string");return typeof t=="symbol"?t:t+""}function E0(r,t){if(typeof r!="object"||!r)return r;var f=r[Symbol.toPrimitive];if(f!==void 0){var e=f.call(r,t||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(r)}function z(r={},t,f=0){var e=K(Z(Z({},r),{},{_v6:!0}),new Uint8Array(16));if(e=L(e),t){for(var n=0;n<16;n++)t[f+n]=e[n];return t}return g(e)}function W(r){var t=typeof r=="string"?S(r):r,f=R0(t);return typeof r=="string"?g(f):f}function R0(r){return Uint8Array.of((r[3]&15)<<4|r[4]>>4&15,(r[4]&15)<<4|(r[5]&240)>>4,(r[5]&15)<<4|r[6]&15,r[7],(r[1]&15)<<4|(r[2]&240)>>4,(r[2]&15)<<4|(r[3]&240)>>4,16|(r[0]&240)>>4,(r[0]&15)<<4|(r[1]&240)>>4,r[8],r[9],r[10],r[11],r[12],r[13],r[14],r[15])}var B=null,r0=null,w=0;function q0(r,t,f){r=r||{};var e=t&&f||0,n=t||new Uint8Array(16),a=r.random||(r.rng||T)(),o=r.msecs!==void 0?r.msecs:Date.now(),c=r.seq!==void 0?r.seq:null,l=r0,u=B;return o>w&&r.msecs===void 0&&(w=o,c!==null&&(l=null,u=null)),c!==null&&(c>2147483647&&(c=2147483647),l=c>>>19&4095,u=c&524287),(l===null||u===null)&&(l=a[6]&127,l=l<<8|a[7],u=a[8]&63,u=u<<8|a[9],u=u<<5|a[10]>>>3),o+1e4>w&&c===null?++u>524287&&(u=0,++l>4095&&(l=0,w++)):w=o,r0=l,B=u,n[e++]=w/1099511627776&255,n[e++]=w/4294967296&255,n[e++]=w/16777216&255,n[e++]=w/65536&255,n[e++]=w/256&255,n[e++]=w&255,n[e++]=l>>>4&15|112,n[e++]=l&255,n[e++]=u>>>13&63|128,n[e++]=u>>>5&255,n[e++]=u<<3&255|a[10]&7,n[e++]=a[11],n[e++]=a[12],n[e++]=a[13],n[e++]=a[14],n[e++]=a[15],t||g(n)}var V0=q0;function j0(r){if(!O(r))throw TypeError("Invalid UUID");return parseInt(r.slice(14,15),16)}var L0=j0;export{e0 as MAX,n0 as NIL,S as parse,u0 as stringify,K as v1,L as v1ToV6,U0 as v3,O0 as v4,b0 as v5,z as v6,W as v6ToV1,V0 as v7,O as validate,L0 as version};
//# sourceMappingURL=uuid.mjs.map