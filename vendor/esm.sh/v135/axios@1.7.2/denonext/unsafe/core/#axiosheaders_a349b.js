/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/core/AxiosHeaders) denonext production */
import i from"/v135/axios@1.7.2/denonext/unsafe/utils.js";import S from"/v135/axios@1.7.2/denonext/unsafe/helpers/parseHeaders.js";var h=Symbol("internals");function a(r){return r&&String(r).trim().toLowerCase()}function g(r){return r===!1||r==null?r:i.isArray(r)?r.map(g):String(r)}function E(r){let t=Object.create(null),s=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g,n;for(;n=s.exec(r);)t[n[1]]=n[2];return t}var d=r=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());function b(r,t,s,n,e){if(i.isFunction(n))return n.call(this,t,s);if(e&&(t=s),!!i.isString(t)){if(i.isString(n))return t.indexOf(n)!==-1;if(i.isRegExp(n))return n.test(t)}}function k(r){return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,s,n)=>s.toUpperCase()+n)}function A(r,t){let s=i.toCamelCase(" "+t);["get","set","has"].forEach(n=>{Object.defineProperty(r,n+s,{value:function(e,o,f){return this[n].call(this,t,e,o,f)},configurable:!0})})}var l=class{constructor(t){t&&this.set(t)}set(t,s,n){let e=this;function o(c,u,y){let m=a(u);if(!m)throw new Error("header name must be a non-empty string");let p=i.findKey(e,m);(!p||e[p]===void 0||y===!0||y===void 0&&e[p]!==!1)&&(e[p||u]=g(c))}let f=(c,u)=>i.forEach(c,(y,m)=>o(y,m,u));if(i.isPlainObject(t)||t instanceof this.constructor)f(t,s);else if(i.isString(t)&&(t=t.trim())&&!d(t))f(S(t),s);else if(i.isHeaders(t))for(let[c,u]of t.entries())o(u,c,n);else t!=null&&o(s,t,n);return this}get(t,s){if(t=a(t),t){let n=i.findKey(this,t);if(n){let e=this[n];if(!s)return e;if(s===!0)return E(e);if(i.isFunction(s))return s.call(this,e,n);if(i.isRegExp(s))return s.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,s){if(t=a(t),t){let n=i.findKey(this,t);return!!(n&&this[n]!==void 0&&(!s||b(this,this[n],n,s)))}return!1}delete(t,s){let n=this,e=!1;function o(f){if(f=a(f),f){let c=i.findKey(n,f);c&&(!s||b(n,n[c],c,s))&&(delete n[c],e=!0)}}return i.isArray(t)?t.forEach(o):o(t),e}clear(t){let s=Object.keys(this),n=s.length,e=!1;for(;n--;){let o=s[n];(!t||b(this,this[o],o,t,!0))&&(delete this[o],e=!0)}return e}normalize(t){let s=this,n={};return i.forEach(this,(e,o)=>{let f=i.findKey(n,o);if(f){s[f]=g(e),delete s[o];return}let c=t?k(o):String(o).trim();c!==o&&delete s[o],s[c]=g(e),n[c]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){let s=Object.create(null);return i.forEach(this,(n,e)=>{n!=null&&n!==!1&&(s[e]=t&&i.isArray(n)?n.join(", "):n)}),s}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,s])=>t+": "+s).join(`
`)}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...s){let n=new this(t);return s.forEach(e=>n.set(e)),n}static accessor(t){let n=(this[h]=this[h]={accessors:{}}).accessors,e=this.prototype;function o(f){let c=a(f);n[c]||(A(e,f),n[c]=!0)}return i.isArray(t)?t.forEach(o):o(t),this}};l.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);i.reduceDescriptors(l.prototype,({value:r},t)=>{let s=t[0].toUpperCase()+t.slice(1);return{get:()=>r,set(n){this[s]=n}}});i.freezeMethods(l);var O=l;export{O as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=AxiosHeaders.js.map