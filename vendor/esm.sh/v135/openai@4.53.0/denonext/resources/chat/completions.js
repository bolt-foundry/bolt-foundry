/* esm.sh - esbuild bundle(openai@4.53.0/resources/chat/completions) denonext production */
import{APIResource as c}from"/v135/openai@4.53.0/denonext/resource.js";var e=class extends c{create(t,r){return this._client.post("/chat/completions",{body:t,...r,stream:t.stream??!1})}};e||(e={});export{e as Completions};
//# sourceMappingURL=completions.js.map