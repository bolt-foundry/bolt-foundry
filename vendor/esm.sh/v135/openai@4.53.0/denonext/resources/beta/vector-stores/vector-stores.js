/* esm.sh - esbuild bundle(openai@4.53.0/resources/beta/vector-stores/vector-stores) denonext production */
import{APIResource as h}from"/v135/openai@4.53.0/denonext/resource.js";import{isRequestOptions as n}from"/v135/openai@4.53.0/denonext/core.js";import*as l from"/v135/openai@4.53.0/denonext/resources/beta/vector-stores/file-batches.js";import*as i from"/v135/openai@4.53.0/denonext/resources/beta/vector-stores/files.js";import{CursorPage as o}from"/v135/openai@4.53.0/denonext/pagination.js";var a=class extends h{constructor(){super(...arguments),this.files=new i.Files(this._client),this.fileBatches=new l.FileBatches(this._client)}create(s,e){return this._client.post("/vector_stores",{body:s,...e,headers:{"OpenAI-Beta":"assistants=v2",...e?.headers}})}retrieve(s,e){return this._client.get(`/vector_stores/${s}`,{...e,headers:{"OpenAI-Beta":"assistants=v2",...e?.headers}})}update(s,e,c){return this._client.post(`/vector_stores/${s}`,{body:e,...c,headers:{"OpenAI-Beta":"assistants=v2",...c?.headers}})}list(s={},e){return n(s)?this.list({},s):this._client.getAPIList("/vector_stores",r,{query:s,...e,headers:{"OpenAI-Beta":"assistants=v2",...e?.headers}})}del(s,e){return this._client.delete(`/vector_stores/${s}`,{...e,headers:{"OpenAI-Beta":"assistants=v2",...e?.headers}})}},r=class extends o{};(function(t){t.VectorStoresPage=r,t.Files=i.Files,t.VectorStoreFilesPage=i.VectorStoreFilesPage,t.FileBatches=l.FileBatches})(a||(a={}));export{a as VectorStores,r as VectorStoresPage};
//# sourceMappingURL=vector-stores.js.map