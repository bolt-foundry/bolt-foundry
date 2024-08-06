/* esm.sh - esbuild bundle(axios@1.6.2/unsafe/core/settle) denonext production */
import a from"/v135/axios@1.6.2/denonext/unsafe/core/AxiosError.js";function l(i,f,t){let u=t.config.validateStatus;!t.status||!u||u(t.status)?i(t):f(new a("Request failed with status code "+t.status,[a.ERR_BAD_REQUEST,a.ERR_BAD_RESPONSE][Math.floor(t.status/100)-4],t.config,t.request,t))}export{l as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=settle.js.map