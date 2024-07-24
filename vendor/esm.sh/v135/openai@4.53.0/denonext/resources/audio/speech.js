/* esm.sh - esbuild bundle(openai@4.53.0/resources/audio/speech) denonext production */
import{APIResource as o}from"/v135/openai@4.53.0/denonext/resource.js";var e=class extends o{create(r,s){return this._client.post("/audio/speech",{body:r,...s,__binaryResponse:!0})}};e||(e={});export{e as Speech};
//# sourceMappingURL=speech.js.map