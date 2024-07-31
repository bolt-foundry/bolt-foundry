/* esm.sh - esbuild bundle(openai@4.53.0/resources/completions) denonext production */
import{APIResource as o}from"/v135/openai@4.53.0/denonext/resource.js";var e=class extends o{create(t,r){return this._client.post("/completions",{body:t,...r,stream:t.stream??!1})}};e||(e={});export{e as Completions};
//# sourceMappingURL=completions.js.map