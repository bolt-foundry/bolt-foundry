/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */(function(a,b){"object"==typeof exports&&"undefined"!=typeof module?b(exports):"function"==typeof define&&define.amd?define(["exports"],b):(a=a||self,b(a.EventTargetShim={}))})(this,function(a){"use strict";function b(a){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},b(a)}function c(a){var b=u.get(a);return console.assert(null!=b,"'this' is expected an Event object, but got",a),b}function d(a){return null==a.passiveListener?void(!a.event.cancelable||(a.canceled=!0,"function"==typeof a.event.preventDefault&&a.event.preventDefault())):void("undefined"!=typeof console&&"function"==typeof console.error&&console.error("Unable to preventDefault inside passive event listener invocation.",a.passiveListener))}function e(a,b){u.set(this,{eventTarget:a,event:b,eventPhase:2,currentTarget:a,canceled:!1,stopped:!1,immediateStopped:!1,passiveListener:null,timeStamp:b.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:!1,enumerable:!0});for(var c,d=Object.keys(b),e=0;e<d.length;++e)c=d[e],c in this||Object.defineProperty(this,c,f(c))}function f(a){return{get:function(){return c(this).event[a]},set:function(b){c(this).event[a]=b},configurable:!0,enumerable:!0}}function g(a){return{value:function(){var b=c(this).event;return b[a].apply(b,arguments)},configurable:!0,enumerable:!0}}function h(a,b){function c(b,c){a.call(this,b,c)}var d=Object.keys(b);if(0===d.length)return a;c.prototype=Object.create(a.prototype,{constructor:{value:c,configurable:!0,writable:!0}});for(var e,h=0;h<d.length;++h)if(e=d[h],!(e in a.prototype)){var j=Object.getOwnPropertyDescriptor(b,e),k="function"==typeof j.value;Object.defineProperty(c.prototype,e,k?g(e):f(e))}return c}function i(a){if(null==a||a===Object.prototype)return e;var b=v.get(a);return null==b&&(b=h(i(Object.getPrototypeOf(a)),a),v.set(a,b)),b}function j(a,b){var c=i(Object.getPrototypeOf(b));return new c(a,b)}function k(a){return c(a).immediateStopped}function l(a,b){c(a).eventPhase=b}function m(a,b){c(a).currentTarget=b}function n(a,b){c(a).passiveListener=b}function o(a){return null!==a&&"object"===b(a)}function p(a){var b=w.get(a);if(null==b)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return b}function q(a){return{get:function(){for(var b=p(this),c=b.get(a);null!=c;){if(3===c.listenerType)return c.listener;c=c.next}return null},set:function(b){"function"==typeof b||o(b)||(b=null);for(var c=p(this),d=null,e=c.get(a);null!=e;)3===e.listenerType?null===d?null===e.next?c.delete(a):c.set(a,e.next):d.next=e.next:d=e,e=e.next;if(null!==b){var f={listener:b,listenerType:3,passive:!1,once:!1,next:null};null===d?c.set(a,f):d.next=f}},configurable:!0,enumerable:!0}}function r(a,b){Object.defineProperty(a,"on".concat(b),q(b))}function s(a){function b(){t.call(this)}b.prototype=Object.create(t.prototype,{constructor:{value:b,configurable:!0,writable:!0}});for(var c=0;c<a.length;++c)r(b.prototype,a[c]);return b}function t(){if(this instanceof t)return void w.set(this,new Map);if(1===arguments.length&&Array.isArray(arguments[0]))return s(arguments[0]);if(0<arguments.length){for(var a=Array(arguments.length),b=0;b<arguments.length;++b)a[b]=arguments[b];return s(a)}throw new TypeError("Cannot call a class as a function")}var u=new WeakMap,v=new WeakMap;e.prototype={get type(){return c(this).event.type},get target(){return c(this).eventTarget},get currentTarget(){return c(this).currentTarget},composedPath:function(){var a=c(this).currentTarget;return null==a?[]:[a]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return c(this).eventPhase},stopPropagation:function(){var a=c(this);a.stopped=!0,"function"==typeof a.event.stopPropagation&&a.event.stopPropagation()},stopImmediatePropagation:function(){var a=c(this);a.stopped=!0,a.immediateStopped=!0,"function"==typeof a.event.stopImmediatePropagation&&a.event.stopImmediatePropagation()},get bubbles(){return!!c(this).event.bubbles},get cancelable(){return!!c(this).event.cancelable},preventDefault:function(){d(c(this))},get defaultPrevented(){return c(this).canceled},get composed(){return!!c(this).event.composed},get timeStamp(){return c(this).timeStamp},get srcElement(){return c(this).eventTarget},get cancelBubble(){return c(this).stopped},set cancelBubble(a){if(a){var b=c(this);b.stopped=!0,"boolean"==typeof b.event.cancelBubble&&(b.event.cancelBubble=!0)}},get returnValue(){return!c(this).canceled},set returnValue(a){a||d(c(this))},initEvent:function(){}},Object.defineProperty(e.prototype,"constructor",{value:e,configurable:!0,writable:!0}),"undefined"!=typeof window&&"undefined"!=typeof window.Event&&(Object.setPrototypeOf(e.prototype,window.Event.prototype),v.set(window.Event.prototype,e));var w=new WeakMap,x=1,y=2;if(t.prototype={addEventListener:function(a,b,c){if(null!=b){if("function"!=typeof b&&!o(b))throw new TypeError("'listener' should be a function or an object.");var d=p(this),e=o(c),f=e?!!c.capture:!!c,g=f?x:y,h={listener:b,listenerType:g,passive:e&&!!c.passive,once:e&&!!c.once,next:null},i=d.get(a);if(void 0===i)return void d.set(a,h);for(var j=null;null!=i;){if(i.listener===b&&i.listenerType===g)return;j=i,i=i.next}j.next=h}},removeEventListener:function(a,b,c){if(null!=b)for(var d=p(this),e=o(c)?!!c.capture:!!c,f=e?x:y,g=null,h=d.get(a);null!=h;){if(h.listener===b&&h.listenerType===f)return void(null===g?null===h.next?d.delete(a):d.set(a,h.next):g.next=h.next);g=h,h=h.next}},dispatchEvent:function(a){if(null==a||"string"!=typeof a.type)throw new TypeError("\"event.type\" should be a string.");var b=p(this),c=a.type,d=b.get(c);if(null==d)return!0;for(var e=j(this,a),f=null;null!=d;){if(d.once?null===f?null===d.next?b.delete(c):b.set(c,d.next):f.next=d.next:f=d,n(e,d.passive?d.listener:null),"function"==typeof d.listener)try{d.listener.call(this,e)}catch(a){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(a)}else d.listenerType!==3&&"function"==typeof d.listener.handleEvent&&d.listener.handleEvent(e);if(k(e))break;d=d.next}return n(e,null),l(e,0),m(e,null),!e.defaultPrevented}},Object.defineProperty(t.prototype,"constructor",{value:t,configurable:!0,writable:!0}),"undefined"!=typeof window&&"undefined"!=typeof window.EventTarget&&Object.setPrototypeOf(t.prototype,window.EventTarget.prototype),a.defineEventAttribute=r,a.EventTarget=t,a.default=t,Object.defineProperty(a,"__esModule",{value:!0}),"undefined"==typeof module&&"undefined"==typeof define){var z=Function("return this")();z.EventTargetShim=t,z.EventTargetShim.defineEventAttribute=r}});
//# sourceMappingURL=event-target-shim.umd.js.map