/* esm.sh - esbuild bundle(@anthropic-ai/sdk@0.22.0/resources/completions) denonext production */
import{APIResource as o}from"/v135/@anthropic-ai/sdk@0.22.0/denonext/resource.js";var e=class extends o{create(t,s){return this._client.post("/v1/complete",{body:t,timeout:6e5,...s,stream:t.stream??!1})}};e||(e={});export{e as Completions};
//# sourceMappingURL=completions.js.map