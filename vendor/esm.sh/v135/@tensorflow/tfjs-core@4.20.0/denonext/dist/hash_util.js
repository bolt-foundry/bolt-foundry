/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/hash_util) denonext production */
import*as k from"/v135/long@4.0.0/denonext/long.mjs";var x=k.default||k;function y(d){return x.fromString(d,!0,16)}var w=y("c3a5c85c97cb3127"),s=y("b492b66fbe98f273"),l=y("9ae16a3b2f90404f");function E(d){return d.xor(d.shru(47))}function O(d,t,o){let a=d.slice(t,t+o);return x.fromBytes(Array.from(a),!0,!0)}function r(d,t){return O(d,t,8)}function p(d,t){return O(d,t,4)}function m(d,t){return t===0?d:d.shru(t).or(d.shl(64-t))}function i(d,t,o=y("9ddfea08eb382d69")){let a=d.xor(t).mul(o);a=a.xor(a.shru(47));let n=t.xor(a).mul(o);return n=n.xor(n.shru(47)),n=n.mul(o),n}function S(d,t,o,a,n,u){n=n.add(d),u=m(u.add(n).add(a),21);let c=n;return n=n.add(t),n=n.add(o),u=u.add(m(n,44)),[n.add(a),u.add(c)]}function b(d,t,o,a){return S(r(d,t),r(d,t+8),r(d,t+16),r(d,t+24),o,a)}function U(d,t=d.length){if(t>=8){let o=l.add(t*2),a=r(d,0).add(l),n=r(d,t-8),u=m(n,37).mul(o).add(a),c=m(a,25).add(n).mul(o);return i(u,c,o)}if(t>=4){let o=l.add(t*2),a=p(d,0);return i(a.shl(3).add(t),p(d,t-4),o)}if(t>0){let o=d[0],a=d[t>>1],n=d[t-1],u=o+(a<<8),c=t+(n<<2);return E(l.mul(u).xor(w.mul(c))).mul(l)}return l}function Z(d,t=d.length){let o=l.add(t*2),a=r(d,0).mul(s),n=r(d,8),u=r(d,t-8).mul(o),c=r(d,t-16).mul(l);return i(m(a.add(n),43).add(m(u,30)).add(c),a.add(m(n.add(l),18)).add(u),o)}function z(d,t=d.length){let o=l.add(t*2),a=r(d,0).mul(l),n=r(d,8),u=r(d,t-8).mul(o),c=r(d,t-16).mul(l),e=m(a.add(n),43).add(m(u,30)).add(c),f=i(e,a.add(m(n.add(l),18)).add(u),o),g=r(d,16).mul(o),L=r(d,24),h=e.add(r(d,t-32)).mul(o),R=f.add(r(d,t-24)).mul(o);return i(m(g.add(L),43).add(m(h,30)).add(R),g.add(m(L.add(a),18)).add(h),o)}function H(d,t=d.length){let o=x.fromNumber(81,!0);if(t<=32)return t<=16?U(d,t):Z(d,t);if(t<=64)return z(d,t);let a=o,n=o.mul(s).add(113),u=E(n.mul(l).add(113)).mul(l),c=[x.UZERO,x.UZERO],e=[x.UZERO,x.UZERO];a=a.mul(l).add(r(d,0));let f=0,g=(t-1>>6)*64,L=g+(t-1&63)-63;do a=m(a.add(n).add(c[0]).add(r(d,f+8)),37).mul(s),n=m(n.add(c[1]).add(r(d,f+48)),42).mul(s),a=a.xor(e[1]),n=n.add(c[0]).add(r(d,f+40)),u=m(u.add(e[0]),33).mul(s),c=b(d,f,c[1].mul(s),a.add(e[0])),e=b(d,f+32,u.add(e[1]),n.add(r(d,f+16))),[u,a]=[a,u],f+=64;while(f!==g);let h=s.add(u.and(255).shl(1));return f=L,e[0]=e[0].add(t-1&63),c[0]=c[0].add(e[0]),e[0]=e[0].add(c[0]),a=m(a.add(n).add(c[0]).add(r(d,f+8)),37).mul(h),n=m(n.add(c[1]).add(r(d,f+48)),42).mul(h),a=a.xor(e[1].mul(9)),n=n.add(c[0].mul(9).add(r(d,f+40))),u=m(u.add(e[0]),33).mul(h),c=b(d,f,c[1].mul(h),a.add(e[0])),e=b(d,f+32,u.add(e[1]),n.add(r(d,f+16))),[u,a]=[a,u],i(i(c[0],e[0],h).add(E(n).mul(w)).add(u),i(c[1],e[1],h).add(a),h)}export{H as fingerPrint64,y as hexToLong};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/hash_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=hash_util.js.map