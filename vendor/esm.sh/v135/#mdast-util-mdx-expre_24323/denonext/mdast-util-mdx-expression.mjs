/* esm.sh - esbuild bundle(mdast-util-mdx-expression@2.0.0) denonext production */
import{ok as i}from"/v135/devlop@1.1.0/denonext/devlop.mjs";function a(){return{enter:{mdxFlowExpression:p,mdxTextExpression:u},exit:{mdxFlowExpression:r,mdxFlowExpressionChunk:x,mdxTextExpression:r,mdxTextExpressionChunk:x}}}function d(){return{handlers:{mdxFlowExpression:o,mdxTextExpression:o},unsafe:[{character:"{",inConstruct:["phrasing"]},{atBreak:!0,character:"{"}]}}function p(e){this.enter({type:"mdxFlowExpression",value:""},e),this.buffer()}function u(e){this.enter({type:"mdxTextExpression",value:""},e),this.buffer()}function r(e){let t=this.resume(),n=e.estree,s=this.stack[this.stack.length-1];i(s.type==="mdxFlowExpression"||s.type==="mdxTextExpression"),this.exit(e),s.value=t,n&&(s.data={estree:n})}function x(e){this.config.enter.data.call(this,e),this.config.exit.data.call(this,e)}function o(e){return"{"+(e.value||"")+"}"}export{a as mdxExpressionFromMarkdown,d as mdxExpressionToMarkdown};
//# sourceMappingURL=mdast-util-mdx-expression.mjs.map