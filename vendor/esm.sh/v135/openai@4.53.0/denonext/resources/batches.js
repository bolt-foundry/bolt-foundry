/* esm.sh - esbuild bundle(openai@4.53.0/resources/batches) denonext production */
import{APIResource as c}from"/v135/openai@4.53.0/denonext/resource.js";import{isRequestOptions as n}from"/v135/openai@4.53.0/denonext/core.js";import{CursorPage as o}from"/v135/openai@4.53.0/denonext/pagination.js";var r=class extends c{create(t,e){return this._client.post("/batches",{body:t,...e})}retrieve(t,e){return this._client.get(`/batches/${t}`,e)}list(t={},e){return n(t)?this.list({},t):this._client.getAPIList("/batches",s,{query:t,...e})}cancel(t,e){return this._client.post(`/batches/${t}/cancel`,e)}},s=class extends o{};(function(i){i.BatchesPage=s})(r||(r={}));export{r as Batches,s as BatchesPage};
//# sourceMappingURL=batches.js.map