/* esm.sh - esbuild bundle(remark-mdx-frontmatter@4.0.0) denonext production */
import{name as l}from"/v135/estree-util-is-identifier-name@3.0.0/denonext/estree-util-is-identifier-name.mjs";import{valueToEstree as d}from"/v135/estree-util-value-to-estree@3.0.1/denonext/estree-util-value-to-estree.mjs";import{parse as m}from"/v135/toml@3.0.0/denonext/toml.mjs";import{parse as p}from"/v135/yaml@2.3.4/denonext/yaml.mjs";var c=({name:e="frontmatter",parsers:s}={})=>{if(!l(e))throw new Error(`Name this should be a valid identifier, got: ${JSON.stringify(e)}`);let a={yaml:p,toml:m,...s};return o=>{let i,r=o.children.find(t=>Object.hasOwn(a,t.type));if(r){let t=a[r.type],{value:n}=r;i=t(n)}o.children.unshift({type:"mdxjsEsm",value:"",data:{estree:{type:"Program",sourceType:"module",body:[{type:"ExportNamedDeclaration",specifiers:[],declaration:{type:"VariableDeclaration",kind:"const",declarations:[{type:"VariableDeclarator",id:{type:"Identifier",name:e},init:d(i)}]}}]}}})}},b=c;export{b as default};
//# sourceMappingURL=remark-mdx-frontmatter.mjs.map