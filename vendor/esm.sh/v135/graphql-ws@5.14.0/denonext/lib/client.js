/* esm.sh - esbuild bundle(graphql-ws@5.14.0/lib/client) denonext production */
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
import{GRAPHQL_TRANSPORT_WS_PROTOCOL as X,CloseCode as p,MessageType as y,parseMessage as Y,stringifyMessage as M}from"/v135/graphql-ws@5.14.0/denonext/lib/common.js";import{isObject as Z,limitCloseReason as $}from"/v135/graphql-ws@5.14.0/denonext/lib/utils.js";export*from"/v135/graphql-ws@5.14.0/denonext/lib/common.js";var P=function(a){return this instanceof P?(this.v=a,this):new P(a)},V=function(a,I,N){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var R=N.apply(a,I||[]),g,m=[];return g={},x("next"),x("throw"),x("return"),g[Symbol.asyncIterator]=function(){return this},g;function x(c){R[c]&&(g[c]=function(n){return new Promise(function(b,L){m.push([c,n,b,L])>1||S(c,n)})})}function S(c,n){try{E(R[c](n))}catch(b){O(m[0][3],b)}}function E(c){c.value instanceof P?Promise.resolve(c.value.v).then(_,G):O(m[0][2],c)}function _(c){S("next",c)}function G(c){S("throw",c)}function O(c,n){c(n),m.shift(),m.length&&S(m[0][0],m[0][1])}};function ie(a){let{url:I,connectionParams:N,lazy:R=!0,onNonLazyError:g=console.error,lazyCloseTimeout:m=0,keepAlive:x=0,disablePong:S,connectionAckWaitTimeout:E=0,retryAttempts:_=5,retryWait:G=async function(s){let e=1e3;for(let o=0;o<s;o++)e*=2;await new Promise(o=>setTimeout(o,e+Math.floor(Math.random()*2700+300)))},shouldRetry:O=F,isFatalConnectionProblem:c,on:n,webSocketImpl:b,generateID:L=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{let e=Math.random()*16|0;return(s=="x"?e:e&3|8).toString(16)})},jsonMessageReplacer:q,jsonMessageReviver:J}=a,C;if(b){if(!ne(b))throw new Error("Invalid WebSocket implementation provided");C=b}else typeof WebSocket<"u"?C=WebSocket:typeof __global$<"u"?C=__global$.WebSocket||__global$.MozWebSocket:typeof window<"u"&&(C=window.WebSocket||window.MozWebSocket);if(!C)throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");let T=C,d=(()=>{let t=(()=>{let e={};return{on(o,i){return e[o]=i,()=>{delete e[o]}},emit(o){var i;"id"in o&&((i=e[o.id])===null||i===void 0||i.call(e,o))}}})(),s={connecting:n?.connecting?[n.connecting]:[],opened:n?.opened?[n.opened]:[],connected:n?.connected?[n.connected]:[],ping:n?.ping?[n.ping]:[],pong:n?.pong?[n.pong]:[],message:n?.message?[t.emit,n.message]:[t.emit],closed:n?.closed?[n.closed]:[],error:n?.error?[n.error]:[]};return{onMessage:t.on,on(e,o){let i=s[e];return i.push(o),()=>{i.splice(i.indexOf(o),1)}},emit(e,...o){for(let i of[...s[e]])i(...o)}}})();function j(t){let s=[d.on("error",e=>{s.forEach(o=>o()),t(e)}),d.on("closed",e=>{s.forEach(o=>o()),t(e)})]}let w,v=0,D,B=!1,A=0,U=!1;async function H(){clearTimeout(D);let[t,s]=await(w??(w=new Promise((i,f)=>(async()=>{if(B){if(await G(A),!v)return w=void 0,f({code:1e3,reason:"All Subscriptions Gone"});A++}d.emit("connecting");let r=new T(typeof I=="function"?await I():I,X),h,W;function z(){isFinite(x)&&x>0&&(clearTimeout(W),W=setTimeout(()=>{r.readyState===T.OPEN&&(r.send(M({type:y.Ping})),d.emit("ping",!1,void 0))},x))}j(l=>{w=void 0,clearTimeout(h),clearTimeout(W),f(l),F(l)&&l.code===4499&&(r.close(4499,"Terminated"),r.onerror=null,r.onclose=null)}),r.onerror=l=>d.emit("error",l),r.onclose=l=>d.emit("closed",l),r.onopen=async()=>{try{d.emit("opened",r);let l=typeof N=="function"?await N():N;if(r.readyState!==T.OPEN)return;r.send(M(l?{type:y.ConnectionInit,payload:l}:{type:y.ConnectionInit},q)),isFinite(E)&&E>0&&(h=setTimeout(()=>{r.close(p.ConnectionAcknowledgementTimeout,"Connection acknowledgement timeout")},E)),z()}catch(l){d.emit("error",l),r.close(p.InternalClientError,$(l instanceof Error?l.message:new Error(l).message,"Internal client error"))}};let k=!1;r.onmessage=({data:l})=>{try{let u=Y(l,J);if(d.emit("message",u),u.type==="ping"||u.type==="pong"){d.emit(u.type,!0,u.payload),u.type==="pong"?z():S||(r.send(M(u.payload?{type:y.Pong,payload:u.payload}:{type:y.Pong})),d.emit("pong",!1,u.payload));return}if(k)return;if(u.type!==y.ConnectionAck)throw new Error(`First message cannot be of type ${u.type}`);clearTimeout(h),k=!0,d.emit("connected",r,u.payload),B=!1,A=0,i([r,new Promise((te,K)=>j(K))])}catch(u){r.onmessage=null,d.emit("error",u),r.close(p.BadResponse,$(u instanceof Error?u.message:new Error(u).message,"Bad response"))}}})())));t.readyState===T.CLOSING&&await s;let e=()=>{},o=new Promise(i=>e=i);return[t,e,Promise.race([o.then(()=>{if(!v){let i=()=>t.close(1e3,"Normal Closure");isFinite(m)&&m>0?D=setTimeout(()=>{t.readyState===T.OPEN&&i()},m):i()}}),s])]}function Q(t){if(F(t)&&(ee(t.code)||[p.InternalServerError,p.InternalClientError,p.BadRequest,p.BadResponse,p.Unauthorized,p.SubprotocolNotAcceptable,p.SubscriberAlreadyExists,p.TooManyInitialisationRequests].includes(t.code)))throw t;if(U)return!1;if(F(t)&&t.code===1e3)return v>0;if(!_||A>=_||!O(t)||c?.(t))throw t;return B=!0}return R||(async()=>{for(v++;;)try{let[,,t]=await H();await t}catch(t){try{if(!Q(t))return}catch(s){return g?.(s)}}})(),{on:d.on,subscribe(t,s){let e=L(t),o=!1,i=!1,f=()=>{v--,o=!0};return(async()=>{for(v++;;)try{let[r,h,W]=await H();if(o)return h();let z=d.onMessage(e,k=>{switch(k.type){case y.Next:{s.next(k.payload);return}case y.Error:{i=!0,o=!0,s.error(k.payload),f();return}case y.Complete:{o=!0,f();return}}});r.send(M({id:e,type:y.Subscribe,payload:t},q)),f=()=>{!o&&r.readyState===T.OPEN&&r.send(M({id:e,type:y.Complete},q)),v--,o=!0,h()},await W.finally(z);return}catch(r){if(!Q(r))return}})().then(()=>{i||s.complete()}).catch(r=>{s.error(r)}),()=>{o||f()}},iterate(t){let s=[],e={done:!1,error:null,resolve:()=>{}},o=this.subscribe(t,{next(f){s.push(f),e.resolve()},error(f){e.done=!0,e.error=f,e.resolve()},complete(){e.done=!0,e.resolve()}}),i=function(){return V(this,arguments,function*(){for(;;){for(s.length||(yield P(new Promise(h=>e.resolve=h)));s.length;)yield yield P(s.shift());if(e.error)throw e.error;if(e.done)return yield P(void 0)}})}();return i.throw=async f=>(e.done||(e.done=!0,e.error=f,e.resolve()),{done:!0,value:void 0}),i.return=async()=>(o(),{done:!0,value:void 0}),i},async dispose(){if(U=!0,w){let[t]=await w;t.close(1e3,"Normal Closure")}},terminate(){w&&d.emit("closed",{code:4499,reason:"Terminated",wasClean:!1})}}}function F(a){return Z(a)&&"code"in a&&"reason"in a}function ee(a){return[1e3,1001,1006,1005,1012,1013,1013].includes(a)?!1:a>=1e3&&a<=1999}function ne(a){return typeof a=="function"&&"constructor"in a&&"CLOSED"in a&&"CLOSING"in a&&"CONNECTING"in a&&"OPEN"in a}export{ie as createClient};
//# sourceMappingURL=client.js.map