/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/helpers/ZlibHeaderTransformStream) denonext production */
import { Buffer as __Buffer$ } from "node:buffer";
import a from"node:stream";var o=class extends a.Transform{__transform(s,t,r){this.push(s),r()}_transform(s,t,r){if(s.length!==0&&(this._transform=this.__transform,s[0]!==120)){let f=__Buffer$.alloc(2);f[0]=120,f[1]=156,this.push(f,t)}this.__transform(s,t,r)}},e=o;export{e as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=ZlibHeaderTransformStream.js.map