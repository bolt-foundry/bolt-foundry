/* esm.sh - esbuild bundle(retry@0.13.1) denonext production */
var M=Object.create;var c=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var I=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty;var l=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),q=(t,e)=>{for(var r in e)c(t,r,{get:e[r],enumerable:!0})},p=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of A(e))!O.call(t,o)&&o!==r&&c(t,o,{get:()=>e[o],enumerable:!(i=S(e,o))||i.enumerable});return t},m=(t,e,r)=>(p(t,e,"default"),r&&p(r,e,"default")),v=(t,e,r)=>(r=t!=null?M(I(t)):{},p(e||!t||!t.__esModule?c(r,"default",{value:t,enumerable:!0}):r,t));var d=l((H,g)=>{function n(t,e){typeof e=="boolean"&&(e={forever:e}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=e||{},this._maxRetryTime=e&&e.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}g.exports=n;n.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0)};n.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null};n.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return!1;var e=new Date().getTime();if(t&&e-this._operationStart>=this._maxRetryTime)return this._errors.push(t),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var r=this._timeouts.shift();if(r===void 0)if(this._cachedTimeouts)this._errors.splice(0,this._errors.length-1),r=this._cachedTimeouts.slice(-1);else return!1;var i=this;return this._timer=setTimeout(function(){i._attempts++,i._operationTimeoutCb&&(i._timeout=setTimeout(function(){i._operationTimeoutCb(i._attempts)},i._operationTimeout),i._options.unref&&i._timeout.unref()),i._fn(i._attempts)},r),this._options.unref&&this._timer.unref(),!0};n.prototype.attempt=function(t,e){this._fn=t,e&&(e.timeout&&(this._operationTimeout=e.timeout),e.cb&&(this._operationTimeoutCb=e.cb));var r=this;this._operationTimeoutCb&&(this._timeout=setTimeout(function(){r._operationTimeoutCb()},r._operationTimeout)),this._operationStart=new Date().getTime(),this._fn(this._attempts)};n.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t)};n.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t)};n.prototype.start=n.prototype.try;n.prototype.errors=function(){return this._errors};n.prototype.attempts=function(){return this._attempts};n.prototype.mainError=function(){if(this._errors.length===0)return null;for(var t={},e=null,r=0,i=0;i<this._errors.length;i++){var o=this._errors[i],a=o.message,s=(t[a]||0)+1;t[a]=s,s>=r&&(e=o,r=s)}return e}});var x=l(f=>{var z=d();f.operation=function(t){var e=f.timeouts(t);return new z(e,{forever:t&&(t.forever||t.retries===1/0),unref:t&&t.unref,maxRetryTime:t&&t.maxRetryTime})};f.timeouts=function(t){if(t instanceof Array)return[].concat(t);var e={retries:10,factor:2,minTimeout:1*1e3,maxTimeout:1/0,randomize:!1};for(var r in t)e[r]=t[r];if(e.minTimeout>e.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var i=[],o=0;o<e.retries;o++)i.push(this.createTimeout(o,e));return t&&t.forever&&!i.length&&i.push(this.createTimeout(o,e)),i.sort(function(a,s){return a-s}),i};f.createTimeout=function(t,e){var r=e.randomize?Math.random()+1:1,i=Math.round(r*Math.max(e.minTimeout,1)*Math.pow(e.factor,t));return i=Math.min(i,e.maxTimeout),i};f.wrap=function(t,e,r){if(e instanceof Array&&(r=e,e=null),!r){r=[];for(var i in t)typeof t[i]=="function"&&r.push(i)}for(var o=0;o<r.length;o++){var a=r[o],s=t[a];t[a]=function(E){var h=f.operation(e),_=Array.prototype.slice.call(arguments,1),b=_.pop();_.push(function(y){h.retry(y)||(y&&(arguments[0]=h.mainError()),b.apply(this,arguments))}),h.attempt(function(){E.apply(t,_)})}.bind(t,s),t[a].options=e}}});var T=l((L,R)=>{R.exports=x()});var u={};q(u,{createTimeout:()=>N,default:()=>B,operation:()=>D,timeouts:()=>J,wrap:()=>U});var C=v(T());m(u,v(T()));var{operation:D,timeouts:J,createTimeout:N,wrap:U}=C,{default:w,...W}=C,B=w!==void 0?w:W;export{N as createTimeout,B as default,D as operation,J as timeouts,U as wrap};
//# sourceMappingURL=retry.mjs.map