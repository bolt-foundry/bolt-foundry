/* esm.sh - esbuild bundle(@sinclair/typebox@0.29.6) denonext production */
var Xn=Object.create;var wn=Object.defineProperty;var Yn=Object.getOwnPropertyDescriptor;var Zn=Object.getOwnPropertyNames;var Gn=Object.getPrototypeOf,gn=Object.prototype.hasOwnProperty;var hn=(p,i)=>()=>(i||p((i={exports:{}}).exports,i),i.exports),ne=(p,i)=>{for(var u in i)wn(p,u,{get:i[u],enumerable:!0})},Sn=(p,i,u,a)=>{if(i&&typeof i=="object"||typeof i=="function")for(let l of Zn(i))!gn.call(p,l)&&l!==u&&wn(p,l,{get:()=>i[l],enumerable:!(a=Yn(i,l))||a.enumerable});return p},_=(p,i,u)=>(Sn(p,i,"default"),u&&Sn(u,i,"default")),Vn=(p,i,u)=>(u=p!=null?Xn(Gn(p)):{},Sn(i||!p||!p.__esModule?wn(u,"default",{value:p,enumerable:!0}):u,p));var Mn=hn(o=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});o.Type=o.StandardType=o.ExtendedTypeBuilder=o.StandardTypeBuilder=o.TypeBuilder=o.TemplateLiteralDslParser=o.TemplateLiteralGenerator=o.TemplateLiteralFinite=o.TemplateLiteralParser=o.TemplateLiteralParserError=o.TemplateLiteralResolver=o.TemplateLiteralPattern=o.UnionResolver=o.KeyArrayResolver=o.KeyResolver=o.ObjectMap=o.IndexedAccessor=o.TypeClone=o.TypeExtends=o.TypeExtendsResult=o.ExtendsUndefined=o.TypeGuard=o.TypeGuardUnknownTypeError=o.FormatRegistry=o.TypeRegistry=o.PatternStringExact=o.PatternNumberExact=o.PatternBooleanExact=o.PatternString=o.PatternNumber=o.PatternBoolean=o.Kind=o.Hint=o.Modifier=void 0;o.Modifier=Symbol.for("TypeBox.Modifier");o.Hint=Symbol.for("TypeBox.Hint");o.Kind=Symbol.for("TypeBox.Kind");o.PatternBoolean="(true|false)";o.PatternNumber="(0|[1-9][0-9]*)";o.PatternString="(.*)";o.PatternBooleanExact=`^${o.PatternBoolean}$`;o.PatternNumberExact=`^${o.PatternNumber}$`;o.PatternStringExact=`^${o.PatternString}$`;var En;(function(p){let i=new Map;function u(){return new Map(i)}p.Entries=u;function a(){return i.clear()}p.Clear=a;function l(c){return i.has(c)}p.Has=l;function f(c,U){i.set(c,U)}p.Set=f;function d(c){return i.get(c)}p.Get=d})(En||(o.TypeRegistry=En={}));var qn;(function(p){let i=new Map;function u(){return new Map(i)}p.Entries=u;function a(){return i.clear()}p.Clear=a;function l(c){return i.has(c)}p.Has=l;function f(c,U){i.set(c,U)}p.Set=f;function d(c){return i.get(c)}p.Get=d})(qn||(o.FormatRegistry=qn={}));var Fn=class extends Error{constructor(i){super("TypeGuard: Unknown type"),this.schema=i}};o.TypeGuardUnknownTypeError=Fn;var t;(function(p){function i(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function u(r){return typeof r=="object"&&r!==null&&Array.isArray(r)}function a(r){try{return new RegExp(r),!0}catch{return!1}}function l(r){if(typeof r!="string")return!1;for(let I=0;I<r.length;I++){let q=r.charCodeAt(I);if(q>=7&&q<=13||q===27||q===127)return!1}return!0}function f(r){return w(r)||k(r)}function d(r){return typeof r=="bigint"}function c(r){return typeof r=="string"}function U(r){return typeof r=="number"&&globalThis.Number.isFinite(r)}function P(r){return typeof r=="boolean"}function K(r){return r===void 0||r!==void 0&&d(r)}function b(r){return r===void 0||r!==void 0&&U(r)}function w(r){return r===void 0||r!==void 0&&P(r)}function s(r){return r===void 0||r!==void 0&&c(r)}function y(r){return r===void 0||r!==void 0&&c(r)&&l(r)&&a(r)}function R(r){return r===void 0||r!==void 0&&c(r)&&l(r)}function L(r){return r===void 0||k(r)}function j(r){return C(r)&&r[o.Kind]==="Any"&&s(r.$id)}p.TAny=j;function v(r){return C(r)&&r[o.Kind]==="Array"&&r.type==="array"&&s(r.$id)&&k(r.items)&&b(r.minItems)&&b(r.maxItems)&&w(r.uniqueItems)}p.TArray=v;function S(r){return C(r)&&r[o.Kind]==="BigInt"&&r.type==="null"&&r.typeOf==="BigInt"&&s(r.$id)&&K(r.multipleOf)&&K(r.minimum)&&K(r.maximum)&&K(r.exclusiveMinimum)&&K(r.exclusiveMaximum)}p.TBigInt=S;function A(r){return C(r)&&r[o.Kind]==="Boolean"&&r.type==="boolean"&&s(r.$id)}p.TBoolean=A;function ln(r){if(!(C(r)&&r[o.Kind]==="Constructor"&&r.type==="object"&&r.instanceOf==="Constructor"&&s(r.$id)&&u(r.parameters)&&k(r.returns)))return!1;for(let I of r.parameters)if(!k(I))return!1;return!0}p.TConstructor=ln;function Y(r){return C(r)&&r[o.Kind]==="Date"&&r.type==="object"&&r.instanceOf==="Date"&&s(r.$id)&&b(r.minimumTimestamp)&&b(r.maximumTimestamp)&&b(r.exclusiveMinimumTimestamp)&&b(r.exclusiveMaximumTimestamp)}p.TDate=Y;function sn(r){if(!(C(r)&&r[o.Kind]==="Function"&&r.type==="object"&&r.instanceOf==="Function"&&s(r.$id)&&u(r.parameters)&&k(r.returns)))return!1;for(let I of r.parameters)if(!k(I))return!1;return!0}p.TFunction=sn;function an(r){return C(r)&&r[o.Kind]==="Integer"&&r.type==="integer"&&s(r.$id)&&b(r.multipleOf)&&b(r.minimum)&&b(r.maximum)&&b(r.exclusiveMinimum)&&b(r.exclusiveMaximum)}p.TInteger=an;function Z(r){if(!(C(r)&&r[o.Kind]==="Intersect"&&u(r.allOf)&&s(r.type)&&(w(r.unevaluatedProperties)||L(r.unevaluatedProperties))&&s(r.$id))||"type"in r&&r.type!=="object")return!1;for(let I of r.allOf)if(!k(I))return!1;return!0}p.TIntersect=Z;function C(r){return i(r)&&o.Kind in r&&typeof r[o.Kind]=="string"}p.TKind=C;function $(r){return C(r)&&r[o.Kind]==="Literal"&&s(r.$id)&&typeof r.const=="string"}p.TLiteralString=$;function J(r){return C(r)&&r[o.Kind]==="Literal"&&s(r.$id)&&typeof r.const=="number"}p.TLiteralNumber=J;function G(r){return C(r)&&r[o.Kind]==="Literal"&&s(r.$id)&&typeof r.const=="boolean"}p.TLiteralBoolean=G;function z(r){return $(r)||J(r)||G(r)}p.TLiteral=z;function g(r){return C(r)&&r[o.Kind]==="Never"&&i(r.not)&&globalThis.Object.getOwnPropertyNames(r.not).length===0}p.TNever=g;function dn(r){return C(r)&&r[o.Kind]==="Not"&&k(r.not)}p.TNot=dn;function pn(r){return C(r)&&r[o.Kind]==="Null"&&r.type==="null"&&s(r.$id)}p.TNull=pn;function cn(r){return C(r)&&r[o.Kind]==="Number"&&r.type==="number"&&s(r.$id)&&b(r.multipleOf)&&b(r.minimum)&&b(r.maximum)&&b(r.exclusiveMinimum)&&b(r.exclusiveMaximum)}p.TNumber=cn;function yn(r){if(!(C(r)&&r[o.Kind]==="Object"&&r.type==="object"&&s(r.$id)&&i(r.properties)&&f(r.additionalProperties)&&b(r.minProperties)&&b(r.maxProperties)))return!1;for(let[I,q]of Object.entries(r.properties))if(!l(I)||!k(q))return!1;return!0}p.TObject=yn;function bn(r){return C(r)&&r[o.Kind]==="Promise"&&r.type==="object"&&r.instanceOf==="Promise"&&s(r.$id)&&k(r.item)}p.TPromise=bn;function H(r){if(!(C(r)&&r[o.Kind]==="Record"&&r.type==="object"&&s(r.$id)&&f(r.additionalProperties)&&i(r.patternProperties)))return!1;let I=Object.keys(r.patternProperties);return!(I.length!==1||!a(I[0])||!k(r.patternProperties[I[0]]))}p.TRecord=H;function On(r){return C(r)&&r[o.Kind]==="Ref"&&s(r.$id)&&c(r.$ref)}p.TRef=On;function h(r){return C(r)&&r[o.Kind]==="String"&&r.type==="string"&&s(r.$id)&&b(r.minLength)&&b(r.maxLength)&&y(r.pattern)&&R(r.format)}p.TString=h;function E(r){return C(r)&&r[o.Kind]==="Symbol"&&r.type==="null"&&r.typeOf==="Symbol"&&s(r.$id)}p.TSymbol=E;function Un(r){return C(r)&&r[o.Kind]==="TemplateLiteral"&&r.type==="string"&&c(r.pattern)&&r.pattern[0]==="^"&&r.pattern[r.pattern.length-1]==="$"}p.TTemplateLiteral=Un;function In(r){return C(r)&&r[o.Kind]==="This"&&s(r.$id)&&c(r.$ref)}p.TThis=In;function Q(r){if(!(C(r)&&r[o.Kind]==="Tuple"&&r.type==="array"&&s(r.$id)&&U(r.minItems)&&U(r.maxItems)&&r.minItems===r.maxItems))return!1;if(r.items===void 0&&r.additionalItems===void 0&&r.minItems===0)return!0;if(!u(r.items))return!1;for(let I of r.items)if(!k(I))return!1;return!0}p.TTuple=Q;function W(r){return C(r)&&r[o.Kind]==="Undefined"&&r.type==="null"&&r.typeOf==="Undefined"&&s(r.$id)}p.TUndefined=W;function B(r){return nn(r)&&r.anyOf.every(I=>$(I)||J(I))}p.TUnionLiteral=B;function nn(r){if(!(C(r)&&r[o.Kind]==="Union"&&u(r.anyOf)&&s(r.$id)))return!1;for(let I of r.anyOf)if(!k(I))return!1;return!0}p.TUnion=nn;function en(r){return C(r)&&r[o.Kind]==="Uint8Array"&&r.type==="object"&&s(r.$id)&&r.instanceOf==="Uint8Array"&&b(r.minByteLength)&&b(r.maxByteLength)}p.TUint8Array=en;function Pn(r){return C(r)&&r[o.Kind]==="Unknown"&&s(r.$id)}p.TUnknown=Pn;function Rn(r){return C(r)&&r[o.Kind]==="Unsafe"}p.TUnsafe=Rn;function Cn(r){return C(r)&&r[o.Kind]==="Void"&&r.type==="null"&&r.typeOf==="Void"&&s(r.$id)}p.TVoid=Cn;function vn(r){return i(r)&&r[o.Modifier]==="ReadonlyOptional"}p.TReadonlyOptional=vn;function xn(r){return i(r)&&r[o.Modifier]==="Readonly"}p.TReadonly=xn;function An(r){return i(r)&&r[o.Modifier]==="Optional"}p.TOptional=An;function k(r){return typeof r=="object"&&(j(r)||v(r)||A(r)||S(r)||ln(r)||Y(r)||sn(r)||an(r)||Z(r)||z(r)||g(r)||dn(r)||pn(r)||cn(r)||yn(r)||bn(r)||H(r)||On(r)||h(r)||E(r)||Un(r)||In(r)||Q(r)||W(r)||nn(r)||en(r)||Pn(r)||Rn(r)||Cn(r)||C(r)&&En.Has(r[o.Kind]))}p.TSchema=k})(t||(o.TypeGuard=t={}));var Dn;(function(p){function i(u){return u[o.Kind]==="Undefined"?!0:u[o.Kind]==="Not"?!i(u.not):u[o.Kind]==="Intersect"?u.allOf.every(l=>i(l)):u[o.Kind]==="Union"?u.anyOf.some(l=>i(l)):!1}p.Check=i})(Dn||(o.ExtendsUndefined=Dn={}));var T;(function(p){p[p.Union=0]="Union",p[p.True=1]="True",p[p.False=2]="False"})(T||(o.TypeExtendsResult=T={}));var m;(function(p){function i(e){return e===T.False?T.False:T.True}function u(e,n){return T.True}function a(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)&&n.anyOf.some(N=>t.TAny(N)||t.TUnknown(N))?T.True:t.TUnion(n)?T.Union:t.TUnknown(n)||t.TAny(n)?T.True:T.Union}function l(e,n){return t.TUnknown(e)?T.False:t.TAny(e)?T.Union:t.TNever(e)?T.True:T.False}function f(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)&&H(n)?T.True:t.TArray(n)?i(x(e.items,n.items)):T.False}function d(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TBigInt(n)?T.True:T.False}function c(e,n){return t.TLiteral(e)&&typeof e.const=="boolean"||t.TBoolean(e)?T.True:T.False}function U(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TBoolean(n)?T.True:T.False}function P(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):!t.TConstructor(n)||e.parameters.length>n.parameters.length||!e.parameters.every((N,M)=>i(x(n.parameters[M],N))===T.True)?T.False:i(x(e.returns,n.returns))}function K(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TDate(n)?T.True:T.False}function b(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):!t.TFunction(n)||e.parameters.length>n.parameters.length||!e.parameters.every((N,M)=>i(x(n.parameters[M],N))===T.True)?T.False:i(x(e.returns,n.returns))}function w(e,n){return t.TLiteral(e)&&typeof e.const=="number"||t.TNumber(e)||t.TInteger(e)?T.True:T.False}function s(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TInteger(n)||t.TNumber(n)?T.True:T.False}function y(e,n){return n.allOf.every(N=>x(e,N)===T.True)?T.True:T.False}function R(e,n){return e.allOf.some(N=>x(N,n)===T.True)?T.True:T.False}function L(e){return typeof e.const=="string"}function j(e){return typeof e.const=="number"}function v(e){return typeof e.const=="boolean"}function S(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TString(n)?en(e,n):t.TNumber(n)?Z(e,n):t.TInteger(n)?w(e,n):t.TBoolean(n)?c(e,n):t.TLiteral(n)&&n.const===e.const?T.True:T.False}function A(e,n){return T.False}function ln(e,n){return T.True}function Y(e){let[n,N]=[e,0];for(;t.TNot(n);)n=n.not,N+=1;return N%2===0?n:o.Type.Unknown()}function sn(e,n){if(t.TNot(e))return x(Y(e),n);if(t.TNot(n))return x(e,Y(n));throw new Error("TypeExtends: Invalid fallthrough for Not")}function an(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TNull(n)?T.True:T.False}function Z(e,n){return t.TLiteral(e)&&j(e)||t.TNumber(e)||t.TInteger(e)?T.True:T.False}function C(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TInteger(n)||t.TNumber(n)?T.True:T.False}function $(e,n){return globalThis.Object.keys(e.properties).length===n}function J(e){return H(e)}function G(e){return $(e,0)||$(e,1)&&"description"in e.properties&&t.TUnion(e.properties.description)&&e.properties.description.anyOf.length===2&&(t.TString(e.properties.description.anyOf[0])&&t.TUndefined(e.properties.description.anyOf[1])||t.TString(e.properties.description.anyOf[1])&&t.TUndefined(e.properties.description.anyOf[0]))}function z(e){return $(e,0)}function g(e){return $(e,0)}function dn(e){return $(e,0)}function pn(e){return $(e,0)}function cn(e){return H(e)}function yn(e){let n=o.Type.Number();return $(e,0)||$(e,1)&&"length"in e.properties&&i(x(e.properties.length,n))===T.True}function bn(e){return $(e,0)}function H(e){let n=o.Type.Number();return $(e,0)||$(e,1)&&"length"in e.properties&&i(x(e.properties.length,n))===T.True}function On(e){let n=o.Type.Function([o.Type.Any()],o.Type.Any());return $(e,0)||$(e,1)&&"then"in e.properties&&i(x(e.properties.then,n))===T.True}function h(e,n){return x(e,n)===T.False||t.TOptional(e)&&!t.TOptional(n)?T.False:T.True}function E(e,n){return t.TUnknown(e)?T.False:t.TAny(e)?T.Union:t.TNever(e)||t.TLiteral(e)&&L(e)&&J(n)||t.TLiteral(e)&&j(e)&&z(n)||t.TLiteral(e)&&v(e)&&g(n)||t.TSymbol(e)&&G(n)||t.TBigInt(e)&&dn(n)||t.TString(e)&&J(n)||t.TSymbol(e)&&G(n)||t.TNumber(e)&&z(n)||t.TInteger(e)&&z(n)||t.TBoolean(e)&&g(n)||t.TUint8Array(e)&&cn(n)||t.TDate(e)&&pn(n)||t.TConstructor(e)&&bn(n)||t.TFunction(e)&&yn(n)?T.True:t.TRecord(e)&&t.TString(Q(e))?n[o.Hint]==="Record"?T.True:T.False:t.TRecord(e)&&t.TNumber(Q(e))&&$(n,0)?T.True:T.False}function Un(e,n){if(t.TIntersect(n))return y(e,n);if(t.TUnion(n))return I(e,n);if(t.TUnknown(n))return F(e,n);if(t.TAny(n))return u(e,n);if(t.TRecord(n))return B(e,n);if(!t.TObject(n))return T.False;for(let N of globalThis.Object.keys(n.properties))if(!(N in e.properties)||h(e.properties[N],n.properties[N])===T.False)return T.False;return T.True}function In(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)&&On(n)?T.True:t.TPromise(n)?i(x(e.item,n.item)):T.False}function Q(e){if(o.PatternNumberExact in e.patternProperties)return o.Type.Number();if(o.PatternStringExact in e.patternProperties)return o.Type.String();throw Error("TypeExtends: Cannot get record key")}function W(e){if(o.PatternNumberExact in e.patternProperties)return e.patternProperties[o.PatternNumberExact];if(o.PatternStringExact in e.patternProperties)return e.patternProperties[o.PatternStringExact];throw Error("TypeExtends: Cannot get record value")}function B(e,n){let N=Q(n),M=W(n);if(t.TLiteral(e)&&L(e)&&t.TNumber(N)&&i(x(e,M))===T.True)return T.True;if(t.TUint8Array(e)&&t.TNumber(N)||t.TString(e)&&t.TNumber(N)||t.TArray(e)&&t.TNumber(N))return x(e,M);if(t.TObject(e)){for(let Wn of globalThis.Object.keys(e.properties))if(h(M,e.properties[Wn])===T.False)return T.False;return T.True}return T.False}function nn(e,n){let N=W(e);return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?x(N,W(n)):T.False}function en(e,n){return t.TLiteral(e)&&typeof e.const=="string"||t.TString(e)?T.True:T.False}function Pn(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TString(n)?T.True:T.False}function Rn(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TSymbol(n)?T.True:T.False}function Cn(e,n){if(t.TTemplateLiteral(e))return x(V.Resolve(e),n);if(t.TTemplateLiteral(n))return x(e,V.Resolve(n));throw new Error("TypeExtends: Invalid fallthrough for TemplateLiteral")}function vn(e,n){return t.TUnknown(e)?T.False:t.TAny(e)?T.Union:t.TNever(e)?T.True:T.False}function xn(e,n){return t.TArray(n)&&e.items!==void 0&&e.items.every(N=>x(N,n.items)===T.True)}function An(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)&&H(n)||t.TArray(n)&&xn(e,n)?T.True:!t.TTuple(n)||e.items===void 0&&n.items!==void 0||e.items!==void 0&&n.items===void 0?T.False:e.items===void 0&&n.items===void 0||e.items.every((N,M)=>x(N,n.items[M])===T.True)?T.True:T.False}function k(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TUint8Array(n)?T.True:T.False}function r(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TNever(n)?A(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TRecord(n)?B(e,n):t.TVoid(n)?Jn(e,n):t.TUndefined(n)?T.True:T.False}function I(e,n){return n.anyOf.some(N=>x(e,N)===T.True)?T.True:T.False}function q(e,n){return e.anyOf.every(N=>x(N,n)===T.True)?T.True:T.False}function F(e,n){return T.True}function mn(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TAny(n)?u(e,n):t.TString(n)?en(e,n):t.TNumber(n)?Z(e,n):t.TInteger(n)?w(e,n):t.TBoolean(n)?c(e,n):t.TArray(n)?l(e,n):t.TTuple(n)?vn(e,n):t.TObject(n)?E(e,n):t.TUnknown(n)?T.True:T.False}function Jn(e,n){return t.TUndefined(e)||t.TUndefined(e)?T.True:T.False}function zn(e,n){return t.TIntersect(n)?y(e,n):t.TUnion(n)?I(e,n):t.TUnknown(n)?F(e,n):t.TAny(n)?u(e,n):t.TObject(n)?E(e,n):t.TVoid(n)?T.True:T.False}function x(e,n){if(t.TTemplateLiteral(e)||t.TTemplateLiteral(n))return Cn(e,n);if(t.TNot(e)||t.TNot(n))return sn(e,n);if(t.TAny(e))return a(e,n);if(t.TArray(e))return f(e,n);if(t.TBigInt(e))return d(e,n);if(t.TBoolean(e))return U(e,n);if(t.TConstructor(e))return P(e,n);if(t.TDate(e))return K(e,n);if(t.TFunction(e))return b(e,n);if(t.TInteger(e))return s(e,n);if(t.TIntersect(e))return R(e,n);if(t.TLiteral(e))return S(e,n);if(t.TNever(e))return ln(e,n);if(t.TNull(e))return an(e,n);if(t.TNumber(e))return C(e,n);if(t.TObject(e))return Un(e,n);if(t.TRecord(e))return nn(e,n);if(t.TString(e))return Pn(e,n);if(t.TSymbol(e))return Rn(e,n);if(t.TTuple(e))return An(e,n);if(t.TPromise(e))return In(e,n);if(t.TUint8Array(e))return k(e,n);if(t.TUndefined(e))return r(e,n);if(t.TUnion(e))return q(e,n);if(t.TUnknown(e))return mn(e,n);if(t.TVoid(e))return zn(e,n);throw Error(`TypeExtends: Unknown left type operand '${e[o.Kind]}'`)}function Qn(e,n){return x(e,n)}p.Extends=Qn})(m||(o.TypeExtends=m={}));var O;(function(p){function i(c){return typeof c=="object"&&c!==null}function u(c){return globalThis.Array.isArray(c)}function a(c){return c.map(U=>f(U))}function l(c){let U=globalThis.Object.getOwnPropertyNames(c).reduce((K,b)=>({...K,[b]:f(c[b])}),{}),P=globalThis.Object.getOwnPropertySymbols(c).reduce((K,b)=>({...K,[b]:f(c[b])}),{});return{...U,...P}}function f(c){return u(c)?a(c):i(c)?l(c):c}function d(c,U){return{...f(c),...U}}p.Clone=d})(O||(o.TypeClone=O={}));var $n;(function(p){function i(s){return s.map(y=>{let{[o.Modifier]:R,...L}=O.Clone(y,{});return L})}function u(s){return s.every(y=>t.TOptional(y))}function a(s){return s.some(y=>t.TOptional(y))}function l(s){return u(s.allOf)?o.Type.Optional(o.Type.Intersect(i(s.allOf))):s}function f(s){return a(s.anyOf)?o.Type.Optional(o.Type.Union(i(s.anyOf))):s}function d(s){return s[o.Kind]==="Intersect"?l(s):s[o.Kind]==="Union"?f(s):s}function c(s,y){let R=s.allOf.reduce((L,j)=>{let v=b(j,y);return v[o.Kind]==="Never"?L:[...L,v]},[]);return d(o.Type.Intersect(R))}function U(s,y){let R=s.anyOf.map(L=>b(L,y));return d(o.Type.Union(R))}function P(s,y){let R=s.properties[y];return R===void 0?o.Type.Never():o.Type.Union([R])}function K(s,y){let R=s.items;if(R===void 0)return o.Type.Never();let L=R[y];return L===void 0?o.Type.Never():L}function b(s,y){return s[o.Kind]==="Intersect"?c(s,y):s[o.Kind]==="Union"?U(s,y):s[o.Kind]==="Object"?P(s,y):s[o.Kind]==="Tuple"?K(s,y):o.Type.Never()}function w(s,y,R={}){let L=y.map(j=>b(s,j.toString()));return d(o.Type.Union(L,R))}p.Resolve=w})($n||(o.IndexedAccessor=$n={}));var X;(function(p){function i(d,c){return o.Type.Intersect(d.allOf.map(U=>l(U,c)),{...d})}function u(d,c){return o.Type.Union(d.anyOf.map(U=>l(U,c)),{...d})}function a(d,c){return c(d)}function l(d,c){return d[o.Kind]==="Intersect"?i(d,c):d[o.Kind]==="Union"?u(d,c):d[o.Kind]==="Object"?a(d,c):d}function f(d,c,U){return{...l(O.Clone(d,{}),c),...U}}p.Map=f})(X||(o.ObjectMap=X={}));var Nn;(function(p){function i(P){return P[0]==="^"&&P[P.length-1]==="$"?P.slice(1,P.length-1):P}function u(P,K){return P.allOf.reduce((b,w)=>[...b,...d(w,K)],[])}function a(P,K){let b=P.anyOf.map(w=>d(w,K));return[...b.reduce((w,s)=>s.map(y=>b.every(R=>R.includes(y))?w.add(y):w)[0],new Set)]}function l(P,K){return globalThis.Object.keys(P.properties)}function f(P,K){return K.includePatterns?globalThis.Object.keys(P.patternProperties):[]}function d(P,K){return t.TIntersect(P)?u(P,K):t.TUnion(P)?a(P,K):t.TObject(P)?l(P,K):t.TRecord(P)?f(P,K):[]}function c(P,K){return[...new Set(d(P,K))]}p.ResolveKeys=c;function U(P){return`^(${c(P,{includePatterns:!0}).map(w=>`(${i(w)})`).join("|")})$`}p.ResolvePattern=U})(Nn||(o.KeyResolver=Nn={}));var rn;(function(p){function i(u){if(globalThis.Array.isArray(u))return u;if(t.TUnionLiteral(u))return u.anyOf.map(a=>a.const.toString());if(t.TLiteral(u))return[u.const];if(t.TTemplateLiteral(u)){let a=on.ParseExact(u.pattern);if(!un.Check(a))throw Error("KeyArrayResolver: Cannot resolve keys from infinite template expression");return[...fn.Generate(a)]}return[]}p.Resolve=i})(rn||(o.KeyArrayResolver=rn={}));var kn;(function(p){function*i(a){for(let l of a.anyOf)l[o.Kind]==="Union"?yield*i(l):yield l}function u(a){return o.Type.Union([...i(a)],{...a})}p.Resolve=u})(kn||(o.UnionResolver=kn={}));var Kn;(function(p){function i(l){return l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function u(l,f){if(t.TTemplateLiteral(l))return l.pattern.slice(1,l.pattern.length-1);if(t.TUnion(l))return`(${l.anyOf.map(c=>u(c,f)).join("|")})`;if(t.TNumber(l))return`${f}${o.PatternNumber}`;if(t.TInteger(l))return`${f}${o.PatternNumber}`;if(t.TBigInt(l))return`${f}${o.PatternNumber}`;if(t.TString(l))return`${f}${o.PatternString}`;if(t.TLiteral(l))return`${f}${i(l.const.toString())}`;if(t.TBoolean(l))return`${f}${o.PatternBoolean}`;throw t.TNever(l)?Error("TemplateLiteralPattern: TemplateLiteral cannot operate on types of TNever"):Error(`TemplateLiteralPattern: Unexpected Kind '${l[o.Kind]}'`)}function a(l){return`^${l.map(f=>u(f,"")).join("")}$`}p.Create=a})(Kn||(o.TemplateLiteralPattern=Kn={}));var V;(function(p){function i(u){let a=on.ParseExact(u.pattern);if(!un.Check(a))return o.Type.String();let l=[...fn.Generate(a)].map(f=>o.Type.Literal(f));return o.Type.Union(l)}p.Resolve=i})(V||(o.TemplateLiteralResolver=V={}));var tn=class extends Error{constructor(i){super(i)}};o.TemplateLiteralParserError=tn;var on;(function(p){function i(s,y,R){return s[y]===R&&s.charCodeAt(y-1)!==92}function u(s,y){return i(s,y,"(")}function a(s,y){return i(s,y,")")}function l(s,y){return i(s,y,"|")}function f(s){if(!(u(s,0)&&a(s,s.length-1)))return!1;let y=0;for(let R=0;R<s.length;R++)if(u(s,R)&&(y+=1),a(s,R)&&(y-=1),y===0&&R!==s.length-1)return!1;return!0}function d(s){return s.slice(1,s.length-1)}function c(s){let y=0;for(let R=0;R<s.length;R++)if(u(s,R)&&(y+=1),a(s,R)&&(y-=1),l(s,R)&&y===0)return!0;return!1}function U(s){for(let y=0;y<s.length;y++)if(u(s,y))return!0;return!1}function P(s){let[y,R]=[0,0],L=[];for(let v=0;v<s.length;v++)if(u(s,v)&&(y+=1),a(s,v)&&(y-=1),l(s,v)&&y===0){let S=s.slice(R,v);S.length>0&&L.push(b(S)),R=v+1}let j=s.slice(R);return j.length>0&&L.push(b(j)),L.length===0?{type:"const",const:""}:L.length===1?L[0]:{type:"or",expr:L}}function K(s){function y(j,v){if(!u(j,v))throw new tn("TemplateLiteralParser: Index must point to open parens");let S=0;for(let A=v;A<j.length;A++)if(u(j,A)&&(S+=1),a(j,A)&&(S-=1),S===0)return[v,A];throw new tn("TemplateLiteralParser: Unclosed group parens in expression")}function R(j,v){for(let S=v;S<j.length;S++)if(u(j,S))return[v,S];return[v,j.length]}let L=[];for(let j=0;j<s.length;j++)if(u(s,j)){let[v,S]=y(s,j),A=s.slice(v,S+1);L.push(b(A)),j=S}else{let[v,S]=R(s,j),A=s.slice(v,S);A.length>0&&L.push(b(A)),j=S-1}return L.length===0?{type:"const",const:""}:L.length===1?L[0]:{type:"and",expr:L}}function b(s){return f(s)?b(d(s)):c(s)?P(s):U(s)?K(s):{type:"const",const:s}}p.Parse=b;function w(s){return b(s.slice(1,s.length-1))}p.ParseExact=w})(on||(o.TemplateLiteralParser=on={}));var un;(function(p){function i(f){return f.type==="or"&&f.expr.length===2&&f.expr[0].type==="const"&&f.expr[0].const==="0"&&f.expr[1].type==="const"&&f.expr[1].const==="[1-9][0-9]*"}function u(f){return f.type==="or"&&f.expr.length===2&&f.expr[0].type==="const"&&f.expr[0].const==="true"&&f.expr[1].type==="const"&&f.expr[1].const==="false"}function a(f){return f.type==="const"&&f.const===".*"}function l(f){if(u(f))return!0;if(i(f)||a(f))return!1;if(f.type==="and")return f.expr.every(d=>l(d));if(f.type==="or")return f.expr.every(d=>l(d));if(f.type==="const")return!0;throw Error("TemplateLiteralFinite: Unknown expression type")}p.Check=l})(un||(o.TemplateLiteralFinite=un={}));var fn;(function(p){function*i(d){if(d.length===1)return yield*d[0];for(let c of d[0])for(let U of i(d.slice(1)))yield`${c}${U}`}function*u(d){return yield*i(d.expr.map(c=>[...f(c)]))}function*a(d){for(let c of d.expr)yield*f(c)}function*l(d){return yield d.const}function*f(d){if(d.type==="and")return yield*u(d);if(d.type==="or")return yield*a(d);if(d.type==="const")return yield*l(d);throw Error("TemplateLiteralGenerator: Unknown expression")}p.Generate=f})(fn||(o.TemplateLiteralGenerator=fn={}));var Bn;(function(p){function*i(f){let d=f.trim().replace(/"|'/g,"");if(d==="boolean")return yield o.Type.Boolean();if(d==="number")return yield o.Type.Number();if(d==="bigint")return yield o.Type.BigInt();if(d==="string")return yield o.Type.String();let c=d.split("|").map(U=>o.Type.Literal(U.trim()));return yield c.length===0?o.Type.Never():c.length===1?c[0]:o.Type.Union(c)}function*u(f){if(f[1]!=="{"){let d=o.Type.Literal("$"),c=a(f.slice(1));return yield*[d,...c]}for(let d=2;d<f.length;d++)if(f[d]==="}"){let c=i(f.slice(2,d)),U=a(f.slice(d+1));return yield*[...c,...U]}yield o.Type.Literal(f)}function*a(f){for(let d=0;d<f.length;d++)if(f[d]==="$"){let c=o.Type.Literal(f.slice(0,d)),U=u(f.slice(d));return yield*[c,...U]}yield o.Type.Literal(f)}function l(f){return[...a(f)]}p.Parse=l})(Bn||(o.TemplateLiteralDslParser=Bn={}));var ee=0,Ln=class{Create(i){return i}Strict(i){return JSON.parse(JSON.stringify(i))}};o.TypeBuilder=Ln;var Tn=class extends Ln{Optional(i){return{[o.Modifier]:"Optional",...O.Clone(i,{})}}ReadonlyOptional(i){return{[o.Modifier]:"ReadonlyOptional",...O.Clone(i,{})}}Readonly(i){return{[o.Modifier]:"Readonly",...i}}Any(i={}){return this.Create({...i,[o.Kind]:"Any"})}Array(i,u={}){return this.Create({...u,[o.Kind]:"Array",type:"array",items:O.Clone(i,{})})}Boolean(i={}){return this.Create({...i,[o.Kind]:"Boolean",type:"boolean"})}Composite(i,u){let a=o.Type.Intersect(i,{}),f=Nn.ResolveKeys(a,{includePatterns:!1}).reduce((d,c)=>({...d,[c]:o.Type.Index(a,[c])}),{});return o.Type.Object(f,u)}Enum(i,u={}){let l=globalThis.Object.keys(i).filter(f=>isNaN(f)).map(f=>i[f]).map(f=>typeof f=="string"?{[o.Kind]:"Literal",type:"string",const:f}:{[o.Kind]:"Literal",type:"number",const:f});return this.Create({...u,[o.Kind]:"Union",anyOf:l})}Extends(i,u,a,l,f={}){switch(m.Extends(i,u)){case T.Union:return this.Union([O.Clone(a,f),O.Clone(l,f)]);case T.True:return O.Clone(a,f);case T.False:return O.Clone(l,f)}}Exclude(i,u,a={}){if(t.TTemplateLiteral(i))return this.Exclude(V.Resolve(i),u,a);if(t.TTemplateLiteral(u))return this.Exclude(i,V.Resolve(u),a);if(t.TUnion(i)){let l=i.anyOf.filter(f=>m.Extends(f,u)===T.False);return l.length===1?O.Clone(l[0],a):this.Union(l,a)}else return m.Extends(i,u)!==T.False?this.Never(a):O.Clone(i,a)}Extract(i,u,a={}){if(t.TTemplateLiteral(i))return this.Extract(V.Resolve(i),u,a);if(t.TTemplateLiteral(u))return this.Extract(i,V.Resolve(u),a);if(t.TUnion(i)){let l=i.anyOf.filter(f=>m.Extends(f,u)!==T.False);return l.length===1?O.Clone(l[0],a):this.Union(l,a)}else return m.Extends(i,u)!==T.False?O.Clone(i,a):this.Never(a)}Index(i,u,a={}){if(t.TArray(i)&&t.TNumber(u))return O.Clone(i.items,a);if(t.TTuple(i)&&t.TNumber(u)){let f=(i.items===void 0?[]:i.items).map(d=>O.Clone(d,{}));return this.Union(f,a)}else{let l=rn.Resolve(u),f=O.Clone(i,{});return $n.Resolve(f,l,a)}}Integer(i={}){return this.Create({...i,[o.Kind]:"Integer",type:"integer"})}Intersect(i,u={}){if(i.length===0)return o.Type.Never();if(i.length===1)return O.Clone(i[0],u);let a=i.every(d=>t.TObject(d)),l=i.map(d=>O.Clone(d,{})),f=t.TSchema(u.unevaluatedProperties)?{unevaluatedProperties:O.Clone(u.unevaluatedProperties,{})}:{};return u.unevaluatedProperties===!1||t.TSchema(u.unevaluatedProperties)||a?this.Create({...u,...f,[o.Kind]:"Intersect",type:"object",allOf:l}):this.Create({...u,...f,[o.Kind]:"Intersect",allOf:l})}KeyOf(i,u={}){if(t.TRecord(i)){let a=Object.getOwnPropertyNames(i.patternProperties)[0];if(a===o.PatternNumberExact)return this.Number(u);if(a===o.PatternStringExact)return this.String(u);throw Error("StandardTypeBuilder: Unable to resolve key type from Record key pattern")}else if(t.TTuple(i)){let l=(i.items===void 0?[]:i.items).map((f,d)=>o.Type.Literal(d));return this.Union(l,u)}else{if(t.TArray(i))return this.Number(u);{let a=Nn.ResolveKeys(i,{includePatterns:!1});if(a.length===0)return this.Never(u);let l=a.map(f=>this.Literal(f));return this.Union(l,u)}}}Literal(i,u={}){return this.Create({...u,[o.Kind]:"Literal",const:i,type:typeof i})}Never(i={}){return this.Create({...i,[o.Kind]:"Never",not:{}})}Not(i,u){return this.Create({...u,[o.Kind]:"Not",not:i})}Null(i={}){return this.Create({...i,[o.Kind]:"Null",type:"null"})}Number(i={}){return this.Create({...i,[o.Kind]:"Number",type:"number"})}Object(i,u={}){let a=globalThis.Object.getOwnPropertyNames(i),l=a.filter(U=>t.TOptional(i[U])||t.TReadonlyOptional(i[U])),f=a.filter(U=>!l.includes(U)),d=t.TSchema(u.additionalProperties)?{additionalProperties:O.Clone(u.additionalProperties,{})}:{},c=a.reduce((U,P)=>({...U,[P]:O.Clone(i[P],{})}),{});return f.length>0?this.Create({...u,...d,[o.Kind]:"Object",type:"object",properties:c,required:f}):this.Create({...u,...d,[o.Kind]:"Object",type:"object",properties:c})}Omit(i,u,a={}){let l=rn.Resolve(u);return X.Map(O.Clone(i,{}),f=>{f.required&&(f.required=f.required.filter(d=>!l.includes(d)),f.required.length===0&&delete f.required);for(let d of globalThis.Object.keys(f.properties))l.includes(d)&&delete f.properties[d];return this.Create(f)},a)}Partial(i,u={}){function a(l){switch(l[o.Modifier]){case"ReadonlyOptional":l[o.Modifier]="ReadonlyOptional";break;case"Readonly":l[o.Modifier]="ReadonlyOptional";break;case"Optional":l[o.Modifier]="Optional";break;default:l[o.Modifier]="Optional";break}}return X.Map(O.Clone(i,{}),l=>(delete l.required,globalThis.Object.keys(l.properties).forEach(f=>a(l.properties[f])),l),u)}Pick(i,u,a={}){let l=rn.Resolve(u);return X.Map(O.Clone(i,{}),f=>{f.required&&(f.required=f.required.filter(d=>l.includes(d)),f.required.length===0&&delete f.required);for(let d of globalThis.Object.keys(f.properties))l.includes(d)||delete f.properties[d];return this.Create(f)},a)}Record(i,u,a={}){if(t.TTemplateLiteral(i)){let l=on.ParseExact(i.pattern);return un.Check(l)?this.Object([...fn.Generate(l)].reduce((f,d)=>({...f,[d]:O.Clone(u,{})}),{}),a):this.Create({...a,[o.Kind]:"Record",type:"object",patternProperties:{[i.pattern]:O.Clone(u,{})}})}else if(t.TUnion(i)){let l=kn.Resolve(i);if(t.TUnionLiteral(l)){let f=l.anyOf.reduce((d,c)=>({...d,[c.const]:O.Clone(u,{})}),{});return this.Object(f,{...a,[o.Hint]:"Record"})}else throw Error("TypeBuilder: Record key of type union contains non-literal types")}else if(t.TLiteral(i)){if(typeof i.const=="string"||typeof i.const=="number")return this.Object({[i.const]:O.Clone(u,{})},a);throw Error("TypeBuilder: Record key of type literal is not of type string or number")}else if(t.TInteger(i)||t.TNumber(i)){let l=o.PatternNumberExact;return this.Create({...a,[o.Kind]:"Record",type:"object",patternProperties:{[l]:O.Clone(u,{})}})}else if(t.TString(i)){let l=i.pattern===void 0?o.PatternStringExact:i.pattern;return this.Create({...a,[o.Kind]:"Record",type:"object",patternProperties:{[l]:O.Clone(u,{})}})}else throw Error("StandardTypeBuilder: Record key is an invalid type")}Recursive(i,u={}){u.$id===void 0&&(u.$id=`T${ee++}`);let a=i({[o.Kind]:"This",$ref:`${u.$id}`});return a.$id=u.$id,this.Create({...u,[o.Hint]:"Recursive",...a})}Ref(i,u={}){if(i.$id===void 0)throw Error("StandardTypeBuilder.Ref: Target type must specify an $id");return this.Create({...u,[o.Kind]:"Ref",$ref:i.$id})}Required(i,u={}){function a(l){switch(l[o.Modifier]){case"ReadonlyOptional":l[o.Modifier]="Readonly";break;case"Readonly":l[o.Modifier]="Readonly";break;case"Optional":delete l[o.Modifier];break;default:delete l[o.Modifier];break}}return X.Map(O.Clone(i,{}),l=>(l.required=globalThis.Object.keys(l.properties),globalThis.Object.keys(l.properties).forEach(f=>a(l.properties[f])),l),u)}Rest(i){return t.TTuple(i)?i.items===void 0?[]:i.items.map(u=>O.Clone(u,{})):[O.Clone(i,{})]}String(i={}){return this.Create({...i,[o.Kind]:"String",type:"string"})}TemplateLiteral(i,u={}){let a=typeof i=="string"?Kn.Create(Bn.Parse(i)):Kn.Create(i);return this.Create({...u,[o.Kind]:"TemplateLiteral",type:"string",pattern:a})}Tuple(i,u={}){let[a,l,f]=[!1,i.length,i.length],d=i.map(U=>O.Clone(U,{})),c=i.length>0?{...u,[o.Kind]:"Tuple",type:"array",items:d,additionalItems:a,minItems:l,maxItems:f}:{...u,[o.Kind]:"Tuple",type:"array",minItems:l,maxItems:f};return this.Create(c)}Union(i,u={}){if(t.TTemplateLiteral(i))return V.Resolve(i);{let a=i;if(a.length===0)return this.Never(u);if(a.length===1)return this.Create(O.Clone(a[0],u));let l=a.map(f=>O.Clone(f,{}));return this.Create({...u,[o.Kind]:"Union",anyOf:l})}}Unknown(i={}){return this.Create({...i,[o.Kind]:"Unknown"})}Unsafe(i={}){return this.Create({...i,[o.Kind]:i[o.Kind]||"Unsafe"})}};o.StandardTypeBuilder=Tn;var jn=class extends Tn{BigInt(i={}){return this.Create({...i,[o.Kind]:"BigInt",type:"null",typeOf:"BigInt"})}ConstructorParameters(i,u={}){return this.Tuple([...i.parameters],{...u})}Constructor(i,u,a){let l=O.Clone(u,{}),f=i.map(d=>O.Clone(d,{}));return this.Create({...a,[o.Kind]:"Constructor",type:"object",instanceOf:"Constructor",parameters:f,returns:l})}Date(i={}){return this.Create({...i,[o.Kind]:"Date",type:"object",instanceOf:"Date"})}Function(i,u,a){let l=O.Clone(u,{}),f=i.map(d=>O.Clone(d,{}));return this.Create({...a,[o.Kind]:"Function",type:"object",instanceOf:"Function",parameters:f,returns:l})}InstanceType(i,u={}){return O.Clone(i.returns,u)}Parameters(i,u={}){return this.Tuple(i.parameters,{...u})}Promise(i,u={}){return this.Create({...u,[o.Kind]:"Promise",type:"object",instanceOf:"Promise",item:O.Clone(i,{})})}RegEx(i,u={}){return this.Create({...u,[o.Kind]:"String",type:"string",pattern:i.source})}ReturnType(i,u={}){return O.Clone(i.returns,u)}Symbol(i){return this.Create({...i,[o.Kind]:"Symbol",type:"null",typeOf:"Symbol"})}Undefined(i={}){return this.Create({...i,[o.Kind]:"Undefined",type:"null",typeOf:"Undefined"})}Uint8Array(i={}){return this.Create({...i,[o.Kind]:"Uint8Array",type:"object",instanceOf:"Uint8Array"})}Void(i={}){return this.Create({...i,[o.Kind]:"Void",type:"null",typeOf:"Void"})}};o.ExtendedTypeBuilder=jn;o.StandardType=new Tn;o.Type=new jn});var D={};ne(D,{ExtendedTypeBuilder:()=>oe,ExtendsUndefined:()=>Ne,FormatRegistry:()=>je,Hint:()=>ke,IndexedAccessor:()=>Ie,KeyArrayResolver:()=>be,KeyResolver:()=>Oe,Kind:()=>$e,Modifier:()=>Be,ObjectMap:()=>Ue,PatternBoolean:()=>Fe,PatternBooleanExact:()=>Se,PatternNumber:()=>Ee,PatternNumberExact:()=>Ae,PatternString:()=>we,PatternStringExact:()=>xe,StandardType:()=>ie,StandardTypeBuilder:()=>ue,TemplateLiteralDslParser:()=>Te,TemplateLiteralFinite:()=>se,TemplateLiteralGenerator:()=>le,TemplateLiteralParser:()=>ae,TemplateLiteralParserError:()=>de,TemplateLiteralPattern:()=>ce,TemplateLiteralResolver:()=>pe,Type:()=>te,TypeBuilder:()=>fe,TypeClone:()=>Pe,TypeExtends:()=>Re,TypeExtendsResult:()=>Ce,TypeGuard:()=>Ke,TypeGuardUnknownTypeError:()=>Le,TypeRegistry:()=>ve,UnionResolver:()=>ye,__esModule:()=>re,default:()=>Ve});var _n=Vn(Mn());_(D,Vn(Mn()));var{__esModule:re,Type:te,StandardType:ie,ExtendedTypeBuilder:oe,StandardTypeBuilder:ue,TypeBuilder:fe,TemplateLiteralDslParser:Te,TemplateLiteralGenerator:le,TemplateLiteralFinite:se,TemplateLiteralParser:ae,TemplateLiteralParserError:de,TemplateLiteralResolver:pe,TemplateLiteralPattern:ce,UnionResolver:ye,KeyArrayResolver:be,KeyResolver:Oe,ObjectMap:Ue,IndexedAccessor:Ie,TypeClone:Pe,TypeExtends:Re,TypeExtendsResult:Ce,ExtendsUndefined:Ne,TypeGuard:Ke,TypeGuardUnknownTypeError:Le,FormatRegistry:je,TypeRegistry:ve,PatternStringExact:xe,PatternNumberExact:Ae,PatternBooleanExact:Se,PatternString:we,PatternNumber:Ee,PatternBoolean:Fe,Kind:$e,Hint:ke,Modifier:Be}=_n,{default:Hn,...Me}=_n,Ve=Hn!==void 0?Hn:Me;export{oe as ExtendedTypeBuilder,Ne as ExtendsUndefined,je as FormatRegistry,ke as Hint,Ie as IndexedAccessor,be as KeyArrayResolver,Oe as KeyResolver,$e as Kind,Be as Modifier,Ue as ObjectMap,Fe as PatternBoolean,Se as PatternBooleanExact,Ee as PatternNumber,Ae as PatternNumberExact,we as PatternString,xe as PatternStringExact,ie as StandardType,ue as StandardTypeBuilder,Te as TemplateLiteralDslParser,se as TemplateLiteralFinite,le as TemplateLiteralGenerator,ae as TemplateLiteralParser,de as TemplateLiteralParserError,ce as TemplateLiteralPattern,pe as TemplateLiteralResolver,te as Type,fe as TypeBuilder,Pe as TypeClone,Re as TypeExtends,Ce as TypeExtendsResult,Ke as TypeGuard,Le as TypeGuardUnknownTypeError,ve as TypeRegistry,ye as UnionResolver,re as __esModule,Ve as default};
//# sourceMappingURL=typebox.mjs.map