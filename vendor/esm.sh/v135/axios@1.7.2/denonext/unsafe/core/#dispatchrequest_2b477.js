/* esm.sh - esbuild bundle(axios@1.7.2/unsafe/core/dispatchRequest) denonext production */
import r from"/v135/axios@1.7.2/denonext/unsafe/core/transformData.js";import p from"/v135/axios@1.7.2/denonext/unsafe/cancel/isCancel.js";import o from"/v135/axios@1.7.2/denonext/unsafe/defaults.js";import l from"/v135/axios@1.7.2/denonext/unsafe/cancel/CanceledError.js";import a from"/v135/axios@1.7.2/denonext/unsafe/core/AxiosHeaders.js";import m from"/v135/axios@1.7.2/denonext/unsafe/adapters/adapters.js";function d(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new l(null,e)}function u(e){return d(e),e.headers=a.from(e.headers),e.data=r.call(e,e.transformRequest),["post","put","patch"].indexOf(e.method)!==-1&&e.headers.setContentType("application/x-www-form-urlencoded",!1),m.getAdapter(e.adapter||o.adapter)(e).then(function(t){return d(e),t.data=r.call(e,e.transformResponse,t),t.headers=a.from(t.headers),t},function(t){return p(t)||(d(e),t&&t.response&&(t.response.data=r.call(e,e.transformResponse,t.response),t.response.headers=a.from(t.response.headers))),Promise.reject(t)})}export{u as default};

import "https://deno.land/x/xhr@0.3.0/mod.ts";//# sourceMappingURL=dispatchRequest.js.map