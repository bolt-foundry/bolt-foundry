/* esm.sh - esbuild bundle(langchain@0.0.92/text_splitter) denonext production */
var b=class{constructor(e){Object.defineProperty(this,"pageContent",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metadata",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.pageContent=e.pageContent?e.pageContent.toString():this.pageContent,this.metadata=e.metadata??{}}};import{Tiktoken as $,getEncodingNameForModel as M}from"/v135/js-tiktoken@1.0.8/denonext/lite.js";import N from"/v135/p-retry@4.6.2/denonext/p-retry.mjs";import v from"/v135/p-queue@6.6.2/denonext/p-queue.mjs";var L=[400,401,403,404,405,406,407,408,409],w=class{constructor(e){Object.defineProperty(this,"maxConcurrency",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"maxRetries",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"queue",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.maxConcurrency=e.maxConcurrency??1/0,this.maxRetries=e.maxRetries??6;let n="default"in v?v.default:v;this.queue=new n({concurrency:this.maxConcurrency})}call(e,...n){return this.queue.add(()=>N(()=>e(...n).catch(t=>{throw t instanceof Error?t:new Error(t)}),{onFailedAttempt(t){if(t.message.startsWith("Cancel")||t.message.startsWith("TimeoutError")||t.message.startsWith("AbortError")||t?.code==="ECONNABORTED")throw t;let r=t?.response?.status;if(r&&L.includes(+r))throw t},retries:this.maxRetries,randomize:!0}),{throwOnTimeout:!0})}callWithOptions(e,n,...t){return e.signal?Promise.race([this.call(n,...t),new Promise((r,s)=>{e.signal?.addEventListener("abort",()=>{s(new Error("AbortError"))})})]):this.call(n,...t)}fetch(...e){return this.call(()=>fetch(...e).then(n=>n.ok?n:Promise.reject(n)))}};var g={},D=new w({});async function O(o,e){return o in g||(g[o]=D.fetch(`https://tiktoken.pages.dev/js/${o}.json`,{signal:e?.signal}).then(n=>n.json()).catch(n=>{throw delete g[o],n})),new $(await g[o],e?.extendedSpecialTokens)}var p=class{constructor(e){if(Object.defineProperty(this,"chunkSize",{enumerable:!0,configurable:!0,writable:!0,value:1e3}),Object.defineProperty(this,"chunkOverlap",{enumerable:!0,configurable:!0,writable:!0,value:200}),Object.defineProperty(this,"keepSeparator",{enumerable:!0,configurable:!0,writable:!0,value:!1}),this.chunkSize=e?.chunkSize??this.chunkSize,this.chunkOverlap=e?.chunkOverlap??this.chunkOverlap,this.keepSeparator=e?.keepSeparator??this.keepSeparator,this.chunkOverlap>=this.chunkSize)throw new Error("Cannot have chunkOverlap >= chunkSize")}splitOnSeparator(e,n){let t;if(n)if(this.keepSeparator){let r=n.replace(/[/\-\\^$*+?.()|[\]{}]/g,"\\$&");t=e.split(new RegExp(`(?=${r})`))}else t=e.split(n);else t=e.split("");return t.filter(r=>r!=="")}async createDocuments(e,n=[],t={}){let r=n.length>0?n:new Array(e.length).fill({}),{chunkHeader:s="",chunkOverlapHeader:a="(cont'd) ",appendChunkOverlapHeader:l=!1}=t,u=new Array;for(let i=0;i<e.length;i+=1){let c=e[i],f=1,d=null;for(let m of await this.splitText(c)){let k=s,S=0;if(d){let _=c.indexOf(m),T=c.indexOf(d)+d.length;S=(c.slice(T,_).match(/\n/g)||[]).length,l&&(k+=a)}f+=S;let x=(m.match(/\n/g)||[]).length,y=r[i].loc&&typeof r[i].loc=="object"?{...r[i].loc}:{};y.lines={from:f,to:f+x};let E={...r[i],loc:y};k+=m,u.push(new b({pageContent:k,metadata:E})),f+=x,d=m}}return u}async splitDocuments(e,n={}){let t=e.filter(a=>a.pageContent!==void 0),r=t.map(a=>a.pageContent),s=t.map(a=>a.metadata);return this.createDocuments(r,s,n)}joinDocs(e,n){let t=e.join(n).trim();return t===""?null:t}mergeSplits(e,n){let t=[],r=[],s=0;for(let l of e){let u=l.length;if(s+u+(r.length>0?n.length:0)>this.chunkSize&&(s>this.chunkSize&&console.warn(`Created a chunk of size ${s}, +
which is longer than the specified ${this.chunkSize}`),r.length>0)){let i=this.joinDocs(r,n);for(i!==null&&t.push(i);s>this.chunkOverlap||s+u>this.chunkSize&&s>0;)s-=r[0].length,r.shift()}r.push(l),s+=u}let a=this.joinDocs(r,n);return a!==null&&t.push(a),t}},j=class extends p{constructor(e){super(e),Object.defineProperty(this,"separator",{enumerable:!0,configurable:!0,writable:!0,value:`

`}),this.separator=e?.separator??this.separator}async splitText(e){let n=this.splitOnSeparator(e,this.separator);return this.mergeSplits(n,this.keepSeparator?"":this.separator)}},Y=["cpp","go","java","js","php","proto","python","rst","ruby","rust","scala","swift","markdown","latex","html"],h=class o extends p{constructor(e){super(e),Object.defineProperty(this,"separators",{enumerable:!0,configurable:!0,writable:!0,value:[`

`,`
`," ",""]}),this.separators=e?.separators??this.separators,this.keepSeparator=e?.keepSeparator??!0}async _splitText(e,n){let t=[],r=n[n.length-1],s;for(let i=0;i<n.length;i+=1){let c=n[i];if(c===""){r=c;break}if(e.includes(c)){r=c,s=n.slice(i+1);break}}let a=this.splitOnSeparator(e,r),l=[],u=this.keepSeparator?"":r;for(let i of a)if(i.length<this.chunkSize)l.push(i);else{if(l.length){let c=this.mergeSplits(l,u);t.push(...c),l=[]}if(!s)t.push(i);else{let c=await this._splitText(i,s);t.push(...c)}}if(l.length){let i=this.mergeSplits(l,u);t.push(...i)}return t}async splitText(e){return this._splitText(e,this.separators)}static fromLanguage(e,n){return new o({...n,separators:o.getSeparatorsForLanguage(e)})}static getSeparatorsForLanguage(e){if(e==="cpp")return[`
class `,`
void `,`
int `,`
float `,`
double `,`
if `,`
for `,`
while `,`
switch `,`
case `,`

`,`
`," ",""];if(e==="go")return[`
func `,`
var `,`
const `,`
type `,`
if `,`
for `,`
switch `,`
case `,`

`,`
`," ",""];if(e==="java")return[`
class `,`
public `,`
protected `,`
private `,`
static `,`
if `,`
for `,`
while `,`
switch `,`
case `,`

`,`
`," ",""];if(e==="js")return[`
function `,`
const `,`
let `,`
var `,`
class `,`
if `,`
for `,`
while `,`
switch `,`
case `,`
default `,`

`,`
`," ",""];if(e==="php")return[`
function `,`
class `,`
if `,`
foreach `,`
while `,`
do `,`
switch `,`
case `,`

`,`
`," ",""];if(e==="proto")return[`
message `,`
service `,`
enum `,`
option `,`
import `,`
syntax `,`

`,`
`," ",""];if(e==="python")return[`
class `,`
def `,`
	def `,`

`,`
`," ",""];if(e==="rst")return[`
===
`,`
---
`,`
***
`,`
.. `,`

`,`
`," ",""];if(e==="ruby")return[`
def `,`
class `,`
if `,`
unless `,`
while `,`
for `,`
do `,`
begin `,`
rescue `,`

`,`
`," ",""];if(e==="rust")return[`
fn `,`
const `,`
let `,`
if `,`
while `,`
for `,`
loop `,`
match `,`
const `,`

`,`
`," ",""];if(e==="scala")return[`
class `,`
object `,`
def `,`
val `,`
var `,`
if `,`
for `,`
while `,`
match `,`
case `,`

`,`
`," ",""];if(e==="swift")return[`
func `,`
class `,`
struct `,`
enum `,`
if `,`
for `,`
while `,`
do `,`
switch `,`
case `,`

`,`
`," ",""];if(e==="markdown")return[`
## `,`
### `,`
#### `,`
##### `,`
###### `,"```\n\n",`

***

`,`

---

`,`

___

`,`

`,`
`," ",""];if(e==="latex")return[`
\\chapter{`,`
\\section{`,`
\\subsection{`,`
\\subsubsection{`,`
\\begin{enumerate}`,`
\\begin{itemize}`,`
\\begin{description}`,`
\\begin{list}`,`
\\begin{quote}`,`
\\begin{quotation}`,`
\\begin{verse}`,`
\\begin{verbatim}`,`
\\begin{align}`,"$$","$",`

`,`
`," ",""];if(e==="html")return["<body>","<div>","<p>","<br>","<li>","<h1>","<h2>","<h3>","<h4>","<h5>","<h6>","<span>","<table>","<tr>","<td>","<th>","<ul>","<ol>","<header>","<footer>","<nav>","<head>","<style>","<script>","<meta>","<title>"," ",""];throw new Error(`Language ${e} is not supported.`)}},z=class extends p{constructor(e){super(e),Object.defineProperty(this,"encodingName",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"allowedSpecial",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"disallowedSpecial",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"tokenizer",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.encodingName=e?.encodingName??"gpt2",this.allowedSpecial=e?.allowedSpecial??[],this.disallowedSpecial=e?.disallowedSpecial??"all"}async splitText(e){this.tokenizer||(this.tokenizer=await O(this.encodingName));let n=[],t=this.tokenizer.encode(e,this.allowedSpecial,this.disallowedSpecial),r=0,s=Math.min(r+this.chunkSize,t.length),a=t.slice(r,s);for(;r<t.length;)n.push(this.tokenizer.decode(a)),r+=this.chunkSize-this.chunkOverlap,s=Math.min(r+this.chunkSize,t.length),a=t.slice(r,s);return n}},C=class extends h{constructor(e){super({...e,separators:h.getSeparatorsForLanguage("markdown")})}},P=class extends h{constructor(e){super({...e,separators:h.getSeparatorsForLanguage("latex")})}};export{j as CharacterTextSplitter,P as LatexTextSplitter,C as MarkdownTextSplitter,h as RecursiveCharacterTextSplitter,Y as SupportedTextSplitterLanguages,p as TextSplitter,z as TokenTextSplitter};
//# sourceMappingURL=text_splitter.js.map