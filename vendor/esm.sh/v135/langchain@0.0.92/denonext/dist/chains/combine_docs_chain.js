/* esm.sh - esbuild bundle(langchain@0.0.92/dist/chains/combine_docs_chain) denonext production */
import __Process$ from "node:process";
var Z="__run",z=class{constructor(e){Object.defineProperty(this,"text",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.text=e}toJSON(){return{type:this._getType(),data:{content:this.text,role:"role"in this?this.role:void 0}}}},L=class extends z{_getType(){return"human"}};var $=class{};import{v4 as E}from"/v135/uuid@9.0.1/denonext/uuid.mjs";import*as ee from"/v135/uuid@9.0.1/denonext/uuid.mjs";var D=class{},w=class a extends D{constructor(e){super(),Object.defineProperty(this,"ignoreLLM",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"ignoreChain",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"ignoreAgent",{enumerable:!0,configurable:!0,writable:!0,value:!1}),e&&(this.ignoreLLM=e.ignoreLLM??this.ignoreLLM,this.ignoreChain=e.ignoreChain??this.ignoreChain,this.ignoreAgent=e.ignoreAgent??this.ignoreAgent)}copy(){return new this.constructor(this)}static fromMethods(e){class t extends a{constructor(){super(),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:ee.v4()}),Object.assign(this,e)}}return new t}};import te from"/v135/ansi-styles@5.2.0/denonext/ansi-styles.mjs";var f=class extends w{constructor(){super(),Object.defineProperty(this,"runMap",{enumerable:!0,configurable:!0,writable:!0,value:new Map})}copy(){return this}_addChildRun(e,t){e.child_runs.push(t)}_startTrace(e){if(e.parent_run_id!==void 0){let t=this.runMap.get(e.parent_run_id);t&&this._addChildRun(t,e)}this.runMap.set(e.id,e)}async _endTrace(e){let t=e.parent_run_id!==void 0&&this.runMap.get(e.parent_run_id);t?t.child_execution_order=Math.max(t.child_execution_order,e.child_execution_order):await this.persistRun(e),this.runMap.delete(e.id)}_getExecutionOrder(e){let t=e!==void 0&&this.runMap.get(e);return t?t.child_execution_order+1:1}async handleLLMStart(e,t,r,n,i){let o=this._getExecutionOrder(n),s={id:r,name:e.name,parent_run_id:n,start_time:Date.now(),serialized:e,inputs:{prompts:t},execution_order:o,child_runs:[],child_execution_order:o,run_type:"llm",extra:i};this._startTrace(s),await this.onLLMStart?.(s)}async handleChatModelStart(e,t,r,n,i){let o=this._getExecutionOrder(n),s={id:r,name:e.name,parent_run_id:n,start_time:Date.now(),serialized:e,inputs:{messages:t},execution_order:o,child_runs:[],child_execution_order:o,run_type:"llm",extra:i};this._startTrace(s),await this.onLLMStart?.(s)}async handleLLMEnd(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="llm")throw new Error("No LLM run to end.");r.end_time=Date.now(),r.outputs=e,await this.onLLMEnd?.(r),await this._endTrace(r)}async handleLLMError(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="llm")throw new Error("No LLM run to end.");r.end_time=Date.now(),r.error=e.message,await this.onLLMError?.(r),await this._endTrace(r)}async handleChainStart(e,t,r,n){let i=this._getExecutionOrder(n),o={id:r,name:e.name,parent_run_id:n,start_time:Date.now(),serialized:e,inputs:t,execution_order:i,child_execution_order:i,run_type:"chain",child_runs:[]};this._startTrace(o),await this.onChainStart?.(o)}async handleChainEnd(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="chain")throw new Error("No chain run to end.");r.end_time=Date.now(),r.outputs=e,await this.onChainEnd?.(r),await this._endTrace(r)}async handleChainError(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="chain")throw new Error("No chain run to end.");r.end_time=Date.now(),r.error=e.message,await this.onChainError?.(r),await this._endTrace(r)}async handleToolStart(e,t,r,n){let i=this._getExecutionOrder(n),o={id:r,name:e.name,parent_run_id:n,start_time:Date.now(),serialized:e,inputs:{input:t},execution_order:i,child_execution_order:i,run_type:"tool",child_runs:[]};this._startTrace(o),await this.onToolStart?.(o)}async handleToolEnd(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="tool")throw new Error("No tool run to end");r.end_time=Date.now(),r.outputs={output:e},await this.onToolEnd?.(r),await this._endTrace(r)}async handleToolError(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="tool")throw new Error("No tool run to end");r.end_time=Date.now(),r.error=e.message,await this.onToolError?.(r),await this._endTrace(r)}async handleAgentAction(e,t){let r=this.runMap.get(t);if(!r||r?.run_type!=="chain")return;let n=r;n.actions=n.actions||[],n.actions.push(e),await this.onAgentAction?.(r)}};function l(a,e){return`${a.open}${e}${a.close}`}function b(a,e){try{return JSON.stringify(a,null,2)}catch{return e}}function _(a){if(!a.end_time)return"";let e=a.end_time-a.start_time;return e<1e3?`${e}ms`:`${(e/1e3).toFixed(2)}s`}var{color:h}=te,v=class extends f{constructor(){super(...arguments),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"console_callback_handler"})}persistRun(e){return Promise.resolve()}getParents(e){let t=[],r=e;for(;r.parent_run_id;){let n=this.runMap.get(r.parent_run_id);if(n)t.push(n),r=n;else break}return t}getBreadcrumbs(e){let r=[...this.getParents(e).reverse(),e].map((n,i,o)=>{let s=`${n.execution_order}:${n.run_type}:${n.name}`;return i===o.length-1?l(te.bold,s):s}).join(" > ");return l(h.grey,r)}onChainStart(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.green,"[chain/start]")} [${t}] Entering Chain run with input: ${b(e.inputs,"[inputs]")}`)}onChainEnd(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.cyan,"[chain/end]")} [${t}] [${_(e)}] Exiting Chain run with output: ${b(e.outputs,"[outputs]")}`)}onChainError(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.red,"[chain/error]")} [${t}] [${_(e)}] Chain run errored with error: ${b(e.error,"[error]")}`)}onLLMStart(e){let t=this.getBreadcrumbs(e),r="prompts"in e.inputs?{prompts:e.inputs.prompts.map(n=>n.trim())}:e.inputs;console.log(`${l(h.green,"[llm/start]")} [${t}] Entering LLM run with input: ${b(r,"[inputs]")}`)}onLLMEnd(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.cyan,"[llm/end]")} [${t}] [${_(e)}] Exiting LLM run with output: ${b(e.outputs,"[response]")}`)}onLLMError(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.red,"[llm/error]")} [${t}] [${_(e)}] LLM run errored with error: ${b(e.error,"[error]")}`)}onToolStart(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.green,"[tool/start]")} [${t}] Entering Tool run with input: "${e.inputs.input?.trim()}"`)}onToolEnd(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.cyan,"[tool/end]")} [${t}] [${_(e)}] Exiting Tool run with output: "${e.outputs?.output?.trim()}"`)}onToolError(e){let t=this.getBreadcrumbs(e);console.log(`${l(h.red,"[tool/error]")} [${t}] [${_(e)}] Tool run errored with error: ${b(e.error,"[error]")}`)}onAgentAction(e){let t=e,r=this.getBreadcrumbs(e);console.log(`${l(h.blue,"[agent/action]")} [${r}] Agent selected action: ${b(t.actions[t.actions.length-1],"[action]")}`)}};import we from"/v135/p-retry@4.6.2/denonext/p-retry.mjs";import H from"/v135/p-queue@6.6.2/denonext/p-queue.mjs";var ge=[400,401,403,404,405,406,407,408,409],y=class{constructor(e){Object.defineProperty(this,"maxConcurrency",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"maxRetries",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"queue",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.maxConcurrency=e.maxConcurrency??1/0,this.maxRetries=e.maxRetries??6;let t="default"in H?H.default:H;this.queue=new t({concurrency:this.maxConcurrency})}call(e,...t){return this.queue.add(()=>we(()=>e(...t).catch(r=>{throw r instanceof Error?r:new Error(r)}),{onFailedAttempt(r){if(r.message.startsWith("Cancel")||r.message.startsWith("TimeoutError")||r.message.startsWith("AbortError")||r?.code==="ECONNABORTED")throw r;let n=r?.response?.status;if(n&&ge.includes(+n))throw r},retries:this.maxRetries,randomize:!0}),{throwOnTimeout:!0})}callWithOptions(e,t,...r){return e.signal?Promise.race([this.call(t,...r),new Promise((n,i)=>{e.signal?.addEventListener("abort",()=>{i(new Error("AbortError"))})})]):this.call(t,...r)}fetch(...e){return this.call(()=>fetch(...e).then(t=>t.ok?t:Promise.reject(t)))}};var _e=()=>typeof window<"u"&&typeof window.document<"u",xe=()=>typeof globalThis=="object"&&globalThis.constructor&&globalThis.constructor.name==="DedicatedWorkerGlobalScope",ve=()=>typeof window<"u"&&window.name==="nodejs"||typeof navigator<"u"&&(navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")),re=()=>typeof Deno<"u",Ee=()=>typeof __Process$<"u"&&typeof __Process$.versions<"u"&&typeof __Process$.versions.node<"u"&&!re(),Pe=()=>{let a;return _e()?a="browser":Ee()?a="node":xe()?a="webworker":ve()?a="jsdom":re()?a="deno":a="other",a},F;async function ne(){return F===void 0&&(F={library:"langchain-js",runtime:Pe()}),F}function c(a){try{return typeof __Process$<"u"?__Process$.env?.[a]:void 0}catch{return}}var O=class extends f{constructor({exampleId:e,sessionName:t,callerParams:r,timeout:n}={}){super(),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"langchain_tracer"}),Object.defineProperty(this,"endpoint",{enumerable:!0,configurable:!0,writable:!0,value:c("LANGCHAIN_ENDPOINT")||"http://localhost:1984"}),Object.defineProperty(this,"headers",{enumerable:!0,configurable:!0,writable:!0,value:{"Content-Type":"application/json"}}),Object.defineProperty(this,"sessionName",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"exampleId",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"caller",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"timeout",{enumerable:!0,configurable:!0,writable:!0,value:5e3});let i=c("LANGCHAIN_API_KEY");i&&(this.headers["x-api-key"]=i),this.sessionName=t??c("LANGCHAIN_SESSION"),this.exampleId=e,this.timeout=n??this.timeout,this.caller=new y(r??{maxRetries:2})}async _convertToCreate(e,t=void 0){let r=e.extra??{};return r.runtime=await ne(),{id:e.id,name:e.name,start_time:e.start_time,end_time:e.end_time,run_type:e.run_type,reference_example_id:e.parent_run_id?void 0:t,extra:r,parent_run_id:e.parent_run_id,execution_order:e.execution_order,serialized:e.serialized,error:e.error,inputs:e.inputs,outputs:e.outputs??{},session_name:this.sessionName,child_runs:[]}}async persistRun(e){}async _persistRunSingle(e){let t=await this._convertToCreate(e,this.exampleId),r=`${this.endpoint}/runs`,n=await this.caller.call(fetch,r,{method:"POST",headers:this.headers,body:JSON.stringify(t),signal:AbortSignal.timeout(this.timeout)}),i=await n.text();if(!n.ok)throw new Error(`Failed to persist run: ${n.status} ${n.statusText} ${i}`)}async _updateRunSingle(e){let t={end_time:e.end_time,error:e.error,outputs:e.outputs,parent_run_id:e.parent_run_id,reference_example_id:e.reference_example_id},r=`${this.endpoint}/runs/${e.id}`,n=await this.caller.call(fetch,r,{method:"PATCH",headers:this.headers,body:JSON.stringify(t),signal:AbortSignal.timeout(this.timeout)}),i=await n.text();if(!n.ok)throw new Error(`Failed to update run: ${n.status} ${n.statusText} ${i}`)}async onLLMStart(e){await this._persistRunSingle(e)}async onLLMEnd(e){await this._updateRunSingle(e)}async onLLMError(e){await this._updateRunSingle(e)}async onChainStart(e){await this._persistRunSingle(e)}async onChainEnd(e){await this._updateRunSingle(e)}async onChainError(e){await this._updateRunSingle(e)}async onToolStart(e){await this._persistRunSingle(e)}async onToolEnd(e){await this._updateRunSingle(e)}async onToolError(e){await this._updateRunSingle(e)}};function S(a,e="Human",t="AI"){let r=[];for(let n of a){let i;if(n._getType()==="human")i=e;else if(n._getType()==="ai")i=t;else if(n._getType()==="system")i="System";else if(n._getType()==="generic")i=n.role;else throw new Error(`Got unsupported message type: ${n}`);r.push(`${i}: ${n.text}`)}return r.join(`
`)}var j=class extends f{constructor(){super(),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"langchain_tracer"}),Object.defineProperty(this,"endpoint",{enumerable:!0,configurable:!0,writable:!0,value:c("LANGCHAIN_ENDPOINT")||"http://localhost:1984"}),Object.defineProperty(this,"headers",{enumerable:!0,configurable:!0,writable:!0,value:{"Content-Type":"application/json"}}),Object.defineProperty(this,"session",{enumerable:!0,configurable:!0,writable:!0,value:void 0});let e=c("LANGCHAIN_API_KEY");e&&(this.headers["x-api-key"]=e)}async newSession(e){let t={start_time:Date.now(),name:e},r=await this.persistSession(t);return this.session=r,r}async loadSession(e){let t=`${this.endpoint}/sessions?name=${e}`;return this._handleSessionResponse(t)}async loadDefaultSession(){let e=`${this.endpoint}/sessions?name=default`;return this._handleSessionResponse(e)}async convertV2RunToRun(e){let t=this.session??await this.loadDefaultSession(),r=e.serialized,n;if(e.run_type==="llm"){let i=e.inputs.prompts?e.inputs.prompts:e.inputs.messages.map(s=>S(s));n={uuid:e.id,start_time:e.start_time,end_time:e.end_time,execution_order:e.execution_order,child_execution_order:e.child_execution_order,serialized:r,type:e.run_type,session_id:t.id,prompts:i,response:e.outputs}}else if(e.run_type==="chain"){let i=await Promise.all(e.child_runs.map(s=>this.convertV2RunToRun(s)));n={uuid:e.id,start_time:e.start_time,end_time:e.end_time,execution_order:e.execution_order,child_execution_order:e.child_execution_order,serialized:r,type:e.run_type,session_id:t.id,inputs:e.inputs,outputs:e.outputs,child_llm_runs:i.filter(s=>s.type==="llm"),child_chain_runs:i.filter(s=>s.type==="chain"),child_tool_runs:i.filter(s=>s.type==="tool")}}else if(e.run_type==="tool"){let i=await Promise.all(e.child_runs.map(s=>this.convertV2RunToRun(s)));n={uuid:e.id,start_time:e.start_time,end_time:e.end_time,execution_order:e.execution_order,child_execution_order:e.child_execution_order,serialized:r,type:e.run_type,session_id:t.id,tool_input:e.inputs.input,output:e.outputs?.output,action:JSON.stringify(r),child_llm_runs:i.filter(s=>s.type==="llm"),child_chain_runs:i.filter(s=>s.type==="chain"),child_tool_runs:i.filter(s=>s.type==="tool")}}else throw new Error(`Unknown run type: ${e.run_type}`);return n}async persistRun(e){let t,r;e.run_type!==void 0?r=await this.convertV2RunToRun(e):r=e,r.type==="llm"?t=`${this.endpoint}/llm-runs`:r.type==="chain"?t=`${this.endpoint}/chain-runs`:t=`${this.endpoint}/tool-runs`;let n=await fetch(t,{method:"POST",headers:this.headers,body:JSON.stringify(r)});n.ok||console.error(`Failed to persist run: ${n.status} ${n.statusText}`)}async persistSession(e){let t=`${this.endpoint}/sessions`,r=await fetch(t,{method:"POST",headers:this.headers,body:JSON.stringify(e)});return r.ok?{id:(await r.json()).id,...e}:(console.error(`Failed to persist session: ${r.status} ${r.statusText}, using default session.`),{id:1,...e})}async _handleSessionResponse(e){let t=await fetch(e,{method:"GET",headers:this.headers}),r;if(!t.ok)return console.error(`Failed to load session: ${t.status} ${t.statusText}`),r={id:1,start_time:Date.now()},this.session=r,r;let n=await t.json();return n.length===0?(r={id:1,start_time:Date.now()},this.session=r,r):([r]=n,this.session=r,r)}};async function ie(a){let e=new j;return a?await e.loadSession(a):await e.loadDefaultSession(),e}async function ae(){return new O}var G=class{setHandler(e){return this.setHandlers([e])}},P=class{constructor(e,t,r,n){Object.defineProperty(this,"runId",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"handlers",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"inheritableHandlers",{enumerable:!0,configurable:!0,writable:!0,value:r}),Object.defineProperty(this,"_parentRunId",{enumerable:!0,configurable:!0,writable:!0,value:n})}async handleText(e){await Promise.all(this.handlers.map(async t=>{try{await t.handleText?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleText: ${r}`)}}))}},M=class extends P{async handleLLMNewToken(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreLLM)try{await t.handleLLMNewToken?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleLLMNewToken: ${r}`)}}))}async handleLLMError(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreLLM)try{await t.handleLLMError?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleLLMError: ${r}`)}}))}async handleLLMEnd(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreLLM)try{await t.handleLLMEnd?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleLLMEnd: ${r}`)}}))}},B=class extends P{getChild(){let e=new x(this.runId);return e.setHandlers(this.inheritableHandlers),e}async handleChainError(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreChain)try{await t.handleChainError?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleChainError: ${r}`)}}))}async handleChainEnd(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreChain)try{await t.handleChainEnd?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleChainEnd: ${r}`)}}))}async handleAgentAction(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreAgent)try{await t.handleAgentAction?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleAgentAction: ${r}`)}}))}async handleAgentEnd(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreAgent)try{await t.handleAgentEnd?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleAgentEnd: ${r}`)}}))}},U=class extends P{getChild(){let e=new x(this.runId);return e.setHandlers(this.inheritableHandlers),e}async handleToolError(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreAgent)try{await t.handleToolError?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleToolError: ${r}`)}}))}async handleToolEnd(e){await Promise.all(this.handlers.map(async t=>{if(!t.ignoreAgent)try{await t.handleToolEnd?.(e,this.runId,this._parentRunId)}catch(r){console.error(`Error in handler ${t.constructor.name}, handleToolEnd: ${r}`)}}))}},x=class a extends G{constructor(e){super(),Object.defineProperty(this,"handlers",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inheritableHandlers",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"callback_manager"}),Object.defineProperty(this,"_parentRunId",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.handlers=[],this.inheritableHandlers=[],this._parentRunId=e}async handleLLMStart(e,t,r=E(),n=void 0,i=void 0){return await Promise.all(this.handlers.map(async o=>{if(!o.ignoreLLM)try{await o.handleLLMStart?.(e,t,r,this._parentRunId,i)}catch(s){console.error(`Error in handler ${o.constructor.name}, handleLLMStart: ${s}`)}})),new M(r,this.handlers,this.inheritableHandlers,this._parentRunId)}async handleChatModelStart(e,t,r=E(),n=void 0,i=void 0){let o;return await Promise.all(this.handlers.map(async s=>{if(!s.ignoreLLM)try{s.handleChatModelStart?await s.handleChatModelStart?.(e,t,r,this._parentRunId,i):s.handleLLMStart&&(o=t.map(u=>S(u)),await s.handleLLMStart?.(e,o,r,this._parentRunId,i))}catch(u){console.error(`Error in handler ${s.constructor.name}, handleLLMStart: ${u}`)}})),new M(r,this.handlers,this.inheritableHandlers,this._parentRunId)}async handleChainStart(e,t,r=E()){return await Promise.all(this.handlers.map(async n=>{if(!n.ignoreChain)try{await n.handleChainStart?.(e,t,r,this._parentRunId)}catch(i){console.error(`Error in handler ${n.constructor.name}, handleChainStart: ${i}`)}})),new B(r,this.handlers,this.inheritableHandlers,this._parentRunId)}async handleToolStart(e,t,r=E()){return await Promise.all(this.handlers.map(async n=>{if(!n.ignoreAgent)try{await n.handleToolStart?.(e,t,r,this._parentRunId)}catch(i){console.error(`Error in handler ${n.constructor.name}, handleToolStart: ${i}`)}})),new U(r,this.handlers,this.inheritableHandlers,this._parentRunId)}addHandler(e,t=!0){this.handlers.push(e),t&&this.inheritableHandlers.push(e)}removeHandler(e){this.handlers=this.handlers.filter(t=>t!==e),this.inheritableHandlers=this.inheritableHandlers.filter(t=>t!==e)}setHandlers(e,t=!0){this.handlers=[],this.inheritableHandlers=[];for(let r of e)this.addHandler(r,t)}copy(e=[],t=!0){let r=new a(this._parentRunId);for(let n of this.handlers){let i=this.inheritableHandlers.includes(n);r.addHandler(n,i)}for(let n of e)r.handlers.filter(i=>i.name==="console_callback_handler").some(i=>i.name===n.name)||r.addHandler(n,t);return r}static fromHandlers(e){class t extends w{constructor(){super(),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:E()}),Object.assign(this,e)}}let r=new this;return r.addHandler(new t),r}static async configure(e,t,r){let n;(e||t)&&(Array.isArray(e)||!e?(n=new a,n.setHandlers(e?.map(se)??[],!0)):n=e,n=n.copy(Array.isArray(t)?t.map(se):t?.handlers,!1));let i=c("LANGCHAIN_VERBOSE")||r?.verbose,o=c("LANGCHAIN_TRACING_V2")??!1,s=o||(c("LANGCHAIN_TRACING")??!1);if(i||s){if(n||(n=new a),i&&!n.handlers.some(u=>u.name===v.prototype.name)){let u=new v;n.addHandler(u,!0)}if(s&&!n.handlers.some(u=>u.name==="langchain_tracer"))if(o)n.addHandler(await ae(),!0);else{let u=c("LANGCHAIN_SESSION");n.addHandler(await ie(u),!0)}}return n}};function se(a){return"name"in a?a:w.fromMethods(a)}import{Tiktoken as Te,getEncodingNameForModel as Ce}from"/v135/js-tiktoken@1.0.8/denonext/lite.js";var I={},Le=new y({});async function $e(a,e){return a in I||(I[a]=Le.fetch(`https://tiktoken.pages.dev/js/${a}.json`,{signal:e?.signal}).then(t=>t.json()).catch(t=>{throw delete I[a],t})),new Te(await I[a],e?.extendedSpecialTokens)}async function W(a,e){return $e(Ce(a),e)}var oe=a=>a.startsWith("gpt-3.5-turbo-")?"gpt-3.5-turbo":a.startsWith("gpt-4-32k-")?"gpt-4-32k":a.startsWith("gpt-4-")?"gpt-4":a;var Oe=()=>!1,T=class{constructor(e){Object.defineProperty(this,"verbose",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"callbacks",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.verbose=e.verbose??Oe(),this.callbacks=e.callbacks}},R=class extends T{get callKeys(){return["stop","timeout","signal"]}constructor(e){super({verbose:e.verbose,callbacks:e.callbacks??e.callbackManager}),Object.defineProperty(this,"caller",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_encoding",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.caller=new y(e??{})}async getNumTokens(e){let t=Math.ceil(e.length/4);if(!this._encoding)try{this._encoding=await W("modelName"in this?oe(this.modelName):"gpt2")}catch(r){console.warn("Failed to calculate number of tokens, falling back to approximate count",r)}return this._encoding&&(t=this._encoding.encode(e).length),t}_identifyingParams(){return{}}serialize(){return{...this._identifyingParams(),_type:this._llmType(),_model:this._modelType()}}static async deserialize(e){let{_type:t,_model:r,...n}=e;if(r&&r!=="base_chat_model")throw new Error(`Cannot load LLM with model ${r}`);let i={openai:(await import("/v135/langchain@0.0.92/denonext/dist/chat_models/openai.js")).ChatOpenAI}[t];if(i===void 0)throw new Error(`Cannot load  LLM with type ${t}`);return new i(n)}};var m=class extends T{constructor(e,t,r){if(arguments.length===1&&typeof e=="object"&&!("saveContext"in e)){let{memory:n,callbackManager:i,...o}=e;super({...o,callbacks:i??o.callbacks}),this.memory=n}else super({verbose:t,callbacks:r}),this.memory=e}serialize(){throw new Error("Method not implemented.")}async run(e,t){if(!(this.inputKeys.length<=1))throw new Error(`Chain ${this._chainType()} expects multiple inputs, cannot use 'run' `);let n=this.inputKeys.length?{[this.inputKeys[0]]:e}:{},i=await this.call(n,t),o=Object.keys(i);if(o.length===1)return i[o[0]];throw new Error("return values have multiple keys, `run` only supported when one key currently")}async call(e,t){let r={...e};if(this.memory!=null){let s=await this.memory.loadMemoryVariables(e);for(let[u,p]of Object.entries(s))r[u]=p}let i=await(await x.configure(t,this.callbacks,{verbose:this.verbose}))?.handleChainStart({name:this._chainType()},r),o;try{o=await this._call(r,i)}catch(s){throw await i?.handleChainError(s),s}return this.memory!=null&&await this.memory.saveContext(e,o),await i?.handleChainEnd(o),Object.defineProperty(o,Z,{value:i?{runId:i?.runId}:void 0,configurable:!0}),o}async apply(e,t){return Promise.all(e.map(async(r,n)=>this.call(r,t?.[n])))}static async deserialize(e,t={}){switch(e._type){case"llm_chain":{let{LLMChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/llm_chain.js");return r.deserialize(e)}case"sequential_chain":{let{SequentialChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/sequential_chain.js");return r.deserialize(e)}case"simple_sequential_chain":{let{SimpleSequentialChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/sequential_chain.js");return r.deserialize(e)}case"stuff_documents_chain":{let{StuffDocumentsChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/combine_docs_chain.js");return r.deserialize(e)}case"map_reduce_documents_chain":{let{MapReduceDocumentsChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/combine_docs_chain.js");return r.deserialize(e)}case"refine_documents_chain":{let{RefineDocumentsChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/combine_docs_chain.js");return r.deserialize(e)}case"vector_db_qa":{let{VectorDBQAChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/vector_db_qa.js");return r.deserialize(e,t)}case"api_chain":{let{APIChain:r}=await import("/v135/langchain@0.0.92/denonext/dist/chains/api/api_chain.js");return r.deserialize(e)}default:throw new Error(`Invalid prompt type in config: ${e._type}`)}}};var J=class extends ${constructor(e){super(),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.value=e}toString(){return this.value}toChatMessages(){return[new L(this.value)]}},C=class{constructor(e){Object.defineProperty(this,"inputVariables",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"outputParser",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"partialVariables",{enumerable:!0,configurable:!0,writable:!0,value:void 0});let{inputVariables:t}=e;if(t.includes("stop"))throw new Error("Cannot have an input variable named 'stop', as it is used internally, please rename.");Object.assign(this,e)}async mergePartialAndUserVariables(e){let t=this.partialVariables??{},r={};for(let[i,o]of Object.entries(t))typeof o=="string"?r[i]=o:r[i]=await o();return{...r,...e}}static async deserialize(e){switch(e._type){case"prompt":{let{PromptTemplate:t}=await import("/v135/langchain@0.0.92/denonext/dist/prompts/prompt.js");return t.deserialize(e)}case void 0:{let{PromptTemplate:t}=await import("/v135/langchain@0.0.92/denonext/dist/prompts/prompt.js");return t.deserialize({...e,_type:"prompt"})}case"few_shot":{let{FewShotPromptTemplate:t}=await import("/v135/langchain@0.0.92/denonext/dist/prompts/few_shot.js");return t.deserialize(e)}default:throw new Error(`Invalid prompt type in config: ${e._type}`)}}},k=class extends C{async formatPromptValue(e){let t=await this.format(e);return new J(t)}};var g=class a extends m{get inputKeys(){return this.prompt.inputVariables}get outputKeys(){return[this.outputKey]}constructor(e){if(super(e),Object.defineProperty(this,"prompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"llm",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"outputKey",{enumerable:!0,configurable:!0,writable:!0,value:"text"}),Object.defineProperty(this,"outputParser",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.prompt=e.prompt,this.llm=e.llm,this.outputKey=e.outputKey??this.outputKey,this.outputParser=e.outputParser??this.outputParser,this.prompt.outputParser){if(this.outputParser)throw new Error("Cannot set both outputParser and prompt.outputParser");this.outputParser=this.prompt.outputParser}}async _getFinalOutput(e,t,r){let n=e[0].text,i;return this.outputParser?i=await this.outputParser.parseWithPrompt(n,t,r?.getChild()):i=n,i}call(e,t){return super.call(e,t)}async _call(e,t){let r={...e},n={};for(let s of this.llm.callKeys)s in e&&(n[s]=e[s],delete r[s]);let i=await this.prompt.formatPromptValue(r),{generations:o}=await this.llm.generatePrompt([i],n,t?.getChild());return{[this.outputKey]:await this._getFinalOutput(o[0],i,t)}}async predict(e,t){return(await this.call(e,t))[this.outputKey]}_chainType(){return"llm_chain"}static async deserialize(e){let{llm:t,prompt:r}=e;if(!t)throw new Error("LLMChain must have llm");if(!r)throw new Error("LLMChain must have prompt");return new a({llm:await R.deserialize(t),prompt:await C.deserialize(r)})}serialize(){return{_type:this._chainType(),llm:this.llm.serialize(),prompt:this.prompt.serialize()}}};var ue=a=>{let e=a.split(""),t=[],r=(i,o)=>{for(let s=o;s<e.length;s+=1)if(i.includes(e[s]))return s;return-1},n=0;for(;n<e.length;)if(e[n]==="{"&&n+1<e.length&&e[n+1]==="{")t.push({type:"literal",text:"{"}),n+=2;else if(e[n]==="}"&&n+1<e.length&&e[n+1]==="}")t.push({type:"literal",text:"}"}),n+=2;else if(e[n]==="{"){let i=r("}",n);if(i<0)throw new Error("Unclosed '{' in template.");t.push({type:"variable",name:e.slice(n+1,i).join("")}),n=i+1}else{if(e[n]==="}")throw new Error("Single '}' in template.");{let i=r("{}",n),o=(i<0?e.slice(n):e.slice(n,i)).join("");t.push({type:"literal",text:o}),n=i<0?e.length:i}}return t},Se=(a,e)=>ue(a).reduce((t,r)=>{if(r.type==="variable"){if(r.name in e)return t+e[r.name];throw new Error(`Missing value for input ${r.name}`)}return t+r.text},""),q={"f-string":Se,jinja2:(a,e)=>""},je={"f-string":ue,jinja2:a=>[]},Y=(a,e,t)=>q[e](a,t),le=(a,e)=>je[e](a),ce=(a,e,t)=>{if(!(e in q)){let r=Object.keys(q);throw new Error(`Invalid template format. Got \`${e}\`;
                         should be one of ${r}`)}try{let r=t.reduce((n,i)=>(n[i]="foo",n),{});Y(a,e,r)}catch{throw new Error("Invalid prompt schema.")}};var N=class a extends k{constructor(e){if(super(e),Object.defineProperty(this,"template",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.assign(this,e),this.validateTemplate){let t=this.inputVariables;this.partialVariables&&(t=t.concat(Object.keys(this.partialVariables))),ce(this.template,this.templateFormat,t)}}_getPromptType(){return"prompt"}async format(e){let t=await this.mergePartialAndUserVariables(e);return Y(this.template,this.templateFormat,t)}static fromExamples(e,t,r,n=`

`,i=""){let o=[i,...e,t].join(n);return new a({inputVariables:r,template:o})}static fromTemplate(e,{templateFormat:t="f-string",...r}={}){let n=new Set;return le(e,t).forEach(i=>{i.type==="variable"&&n.add(i.name)}),new a({inputVariables:[...n],templateFormat:t,template:e,...r})}async partial(e){let t={...this};return t.inputVariables=this.inputVariables.filter(r=>!(r in e)),t.partialVariables={...this.partialVariables??{},...e},new a(t)}serialize(){if(this.outputParser!==void 0)throw new Error("Cannot serialize a prompt template with an output parser");return{_type:this._getPromptType(),input_variables:this.inputVariables,template:this.template,template_format:this.templateFormat}}static async deserialize(e){if(!e.template)throw new Error("Prompt template must have a template");return new a({inputVariables:e.input_variables,template:e.template,templateFormat:e.template_format})}};var he=class a extends m{get inputKeys(){return[this.inputKey,...this.llmChain.inputKeys]}get outputKeys(){return this.llmChain.outputKeys}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),this.llmChain=e.llmChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.inputKey=e.inputKey??this.inputKey}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);let{[this.inputKey]:r,...n}=e,o=r.map(({pageContent:u})=>u).join(`

`);return await this.llmChain.call({...n,[this.documentVariableName]:o},t?.getChild())}_chainType(){return"stuff_documents_chain"}static async deserialize(e){if(!e.llm_chain)throw new Error("Missing llm_chain");return new a({llmChain:await g.deserialize(e.llm_chain)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize()}}},pe=class a extends m{get inputKeys(){return[this.inputKey,...this.combineDocumentChain.inputKeys]}get outputKeys(){return this.combineDocumentChain.outputKeys}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),Object.defineProperty(this,"returnIntermediateSteps",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"maxTokens",{enumerable:!0,configurable:!0,writable:!0,value:3e3}),Object.defineProperty(this,"maxIterations",{enumerable:!0,configurable:!0,writable:!0,value:10}),Object.defineProperty(this,"ensureMapStep",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"combineDocumentChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.llmChain=e.llmChain,this.combineDocumentChain=e.combineDocumentChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.ensureMapStep=e.ensureMapStep??this.ensureMapStep,this.inputKey=e.inputKey??this.inputKey,this.maxTokens=e.maxTokens??this.maxTokens,this.maxIterations=e.maxIterations??this.maxIterations,this.returnIntermediateSteps=e.returnIntermediateSteps??!1}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);let{[this.inputKey]:r,...n}=e,i=r,o=[];for(let p=0;p<this.maxIterations;p+=1){let A=i.map(d=>({[this.documentVariableName]:d.pageContent,...n})),K=A.map(async d=>{let V=await this.llmChain.prompt.format(d);return this.llmChain.llm.getNumTokens(V)}),me=await Promise.all(K).then(d=>d.reduce((V,ye)=>V+ye,0)),fe=p!==0||!this.ensureMapStep,be=me<this.maxTokens;if(fe&&be)break;let Q=await this.llmChain.apply(A,t?[t.getChild()]:void 0),{outputKey:X}=this.llmChain;this.returnIntermediateSteps&&(o=o.concat(Q.map(d=>d[X]))),i=Q.map(d=>({pageContent:d[X]}))}let s={input_documents:i,...n},u=await this.combineDocumentChain.call(s,t?.getChild());return this.returnIntermediateSteps?{...u,intermediateSteps:o}:u}_chainType(){return"map_reduce_documents_chain"}static async deserialize(e){if(!e.llm_chain)throw new Error("Missing llm_chain");if(!e.combine_document_chain)throw new Error("Missing combine_document_chain");return new a({llmChain:await g.deserialize(e.llm_chain),combineDocumentChain:await m.deserialize(e.combine_document_chain)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize(),combine_document_chain:this.combineDocumentChain.serialize()}}},de=class a extends m{get defaultDocumentPrompt(){return new N({inputVariables:["page_content"],template:"{page_content}"})}get inputKeys(){return[this.inputKey,...this.refineLLMChain.inputKeys]}get outputKeys(){return[this.outputKey]}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"outputKey",{enumerable:!0,configurable:!0,writable:!0,value:"output_text"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),Object.defineProperty(this,"initialResponseName",{enumerable:!0,configurable:!0,writable:!0,value:"existing_answer"}),Object.defineProperty(this,"refineLLMChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"documentPrompt",{enumerable:!0,configurable:!0,writable:!0,value:this.defaultDocumentPrompt}),this.llmChain=e.llmChain,this.refineLLMChain=e.refineLLMChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.inputKey=e.inputKey??this.inputKey,this.outputKey=e.outputKey??this.outputKey,this.documentPrompt=e.documentPrompt??this.documentPrompt,this.initialResponseName=e.initialResponseName??this.initialResponseName}async _constructInitialInputs(e,t){let r={page_content:e.pageContent,...e.metadata},n={};return this.documentPrompt.inputVariables.forEach(s=>{n[s]=r[s]}),{...{[this.documentVariableName]:await this.documentPrompt.format({...n})},...t}}async _constructRefineInputs(e,t){let r={page_content:e.pageContent,...e.metadata},n={};this.documentPrompt.inputVariables.forEach(s=>{n[s]=r[s]});let i={[this.documentVariableName]:await this.documentPrompt.format({...n})};return{[this.initialResponseName]:t,...i}}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);let{[this.inputKey]:r,...n}=e,i=r,o=await this._constructInitialInputs(i[0],n),s=await this.llmChain.predict({...o},t?.getChild()),u=[s];for(let p=1;p<i.length;p+=1){let K={...await this._constructRefineInputs(i[p],s),...n};s=await this.refineLLMChain.predict({...K},t?.getChild()),u.push(s)}return{[this.outputKey]:s}}_chainType(){return"refine_documents_chain"}static async deserialize(e){let t=e.llm_chain;if(!t)throw new Error("Missing llm_chain");let r=e.refine_llm_chain;if(!r)throw new Error("Missing refine_llm_chain");return new a({llmChain:await g.deserialize(t),refineLLMChain:await g.deserialize(r)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize(),refine_llm_chain:this.refineLLMChain.serialize()}}};export{pe as MapReduceDocumentsChain,de as RefineDocumentsChain,he as StuffDocumentsChain};
//# sourceMappingURL=combine_docs_chain.js.map