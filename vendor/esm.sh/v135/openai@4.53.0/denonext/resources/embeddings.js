/* esm.sh - esbuild bundle(openai@4.53.0/resources/embeddings) denonext production */
import{APIResource as n}from"/v135/openai@4.53.0/denonext/resource.js";var e=class extends n{create(r,s){return this._client.post("/embeddings",{body:r,...s})}};e||(e={});export{e as Embeddings};
//# sourceMappingURL=embeddings.js.map