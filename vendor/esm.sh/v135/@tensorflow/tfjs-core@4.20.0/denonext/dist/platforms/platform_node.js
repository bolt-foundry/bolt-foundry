/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/platforms/platform_node) denonext production */
import __Process$ from "node:process";
import * as __0$ from "/v135/node_fetch.js";
import * as __1$ from "node:util";
var require=n=>{const e=m=>typeof m.default<"u"?m.default:m,c=m=>Object.assign({__esModule:true},m);switch(n){case"node-fetch":return c(__0$);case"util":return e(__1$);default:throw new Error("module \""+n+"\" not found");}};
var s=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});import{env as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/environment.js";var u={importFetch:()=>s("node-fetch")},i;function h(){i=null}function p(r){i=r}function f(){return i}var n=class{constructor(){this.util=s("util"),this.textEncoder=new this.util.TextEncoder}fetch(t,e){return o().global.fetch!=null?o().global.fetch(t,e):(i==null&&(i=u.importFetch()),i(t,e))}now(){let t=__Process$.hrtime();return t[0]*1e3+t[1]/1e6}encode(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${e}`);return this.textEncoder.encode(t)}decode(t,e){return t.length===0?"":new this.util.TextDecoder(e).decode(t)}isTypedArray(t){return this.util.types.isFloat32Array(t)||this.util.types.isInt32Array(t)||this.util.types.isUint8Array(t)||this.util.types.isUint8ClampedArray(t)}};o().get("IS_NODE")&&!o().get("IS_BROWSER")&&o().setPlatform("node",new n);export{n as PlatformNode,u as getNodeFetch,f as getSystemFetch,h as resetSystemFetch,p as setSystemFetch};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/platforms/platform_node.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=platform_node.js.map