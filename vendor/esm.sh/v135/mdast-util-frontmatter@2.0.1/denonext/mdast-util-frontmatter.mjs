/* esm.sh - esbuild bundle(mdast-util-frontmatter@2.0.1) denonext production */
import{ok as f}from"/v135/devlop@1.1.0/denonext/devlop.mjs";import{toMatters as u}from"/v135/micromark-extension-frontmatter@2.0.0/denonext/micromark-extension-frontmatter.mjs";import l from"/v135/escape-string-regexp@5.0.0/denonext/escape-string-regexp.mjs";function p(t){let e=u(t),n={},r={},o=-1;for(;++o<e.length;){let a=e[o];n[a.type]=h(a),r[a.type]=m,r[a.type+"Value"]=d}return{enter:n,exit:r}}function h(t){return e;function e(n){this.enter({type:t.type,value:""},n),this.buffer()}}function m(t){let e=this.resume(),n=this.stack[this.stack.length-1];f("value"in n),this.exit(t),n.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,"")}function d(t){this.config.enter.data.call(this,t),this.config.exit.data.call(this,t)}function k(t){let e=[],n={},r=u(t),o=-1;for(;++o<r.length;){let a=r[o];n[a.type]=g(a);let s=c(a,"open");e.push({atBreak:!0,character:s.charAt(0),after:l(s.charAt(1))})}return{unsafe:e,handlers:n}}function g(t){let e=c(t,"open"),n=c(t,"close");return r;function r(o){return e+(o.value?`
`+o.value:"")+`
`+n}}function c(t,e){return t.marker?i(t.marker,e).repeat(3):i(t.fence,e)}function i(t,e){return typeof t=="string"?t:t[e]}export{p as frontmatterFromMarkdown,k as frontmatterToMarkdown};
//# sourceMappingURL=mdast-util-frontmatter.mjs.map