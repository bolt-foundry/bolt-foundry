/* esm.sh - esbuild bundle(openai@4.53.0/resources/beta/chat/chat) denonext production */
import{APIResource as e}from"/v135/openai@4.53.0/denonext/resource.js";import*as s from"/v135/openai@4.53.0/denonext/resources/beta/chat/completions.js";var o=class extends e{constructor(){super(...arguments),this.completions=new s.Completions(this._client)}};(function(t){t.Completions=s.Completions})(o||(o={}));export{o as Chat};
//# sourceMappingURL=chat.js.map