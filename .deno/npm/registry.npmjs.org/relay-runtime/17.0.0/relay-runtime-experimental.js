/**
 * Relay v17.0.0
 */
!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("@babel/runtime/helpers/interopRequireDefault"),require("@babel/runtime/helpers/objectSpread2"),require("@babel/runtime/helpers/toConsumableArray"),require("fbjs/lib/areEqual"),require("fbjs/lib/warning"),require("invariant")):"function"==typeof define&&define.amd?define(["@babel/runtime/helpers/interopRequireDefault","@babel/runtime/helpers/objectSpread2","@babel/runtime/helpers/toConsumableArray","fbjs/lib/areEqual","fbjs/lib/warning","invariant"],r):"object"==typeof exports?exports.ReactRelayExperimental=r(require("@babel/runtime/helpers/interopRequireDefault"),require("@babel/runtime/helpers/objectSpread2"),require("@babel/runtime/helpers/toConsumableArray"),require("fbjs/lib/areEqual"),require("fbjs/lib/warning"),require("invariant")):e.ReactRelayExperimental=r(e["@babel/runtime/helpers/interopRequireDefault"],e["@babel/runtime/helpers/objectSpread2"],e["@babel/runtime/helpers/toConsumableArray"],e["fbjs/lib/areEqual"],e["fbjs/lib/warning"],e.invariant)}(self,((e,r,t,n,a,l)=>(()=>{"use strict";var o={649:(e,r,t)=>{var n=t(222);e.exports={resolverDataInjector:n}},634:(e,r,t)=>{var n=t(775),a=t(56),l=t(446);function o(e){var r=e;return"function"==typeof r?(r=r(),l(!1,"RelayGraphQLTag: node `%s` unexpectedly wrapped in a function.","Fragment"===r.kind?r.name:r.operation.name)):r.default&&(r=r.default),r}function i(e){var r=o(e);return"object"==typeof r&&null!==r&&r.kind===n.FRAGMENT}function u(e){var r=o(e);return"object"==typeof r&&null!==r&&r.kind===n.REQUEST}function s(e){var r=o(e);return"object"==typeof r&&null!==r&&r.kind===n.UPDATABLE_QUERY}function f(e){var r=o(e);return"object"==typeof r&&null!==r&&r.kind===n.INLINE_DATA_FRAGMENT}function c(e){var r=o(e);return i(r)||a(!1,"GraphQLTag: Expected a fragment, got `%s`.",JSON.stringify(r)),r}e.exports={getFragment:c,getNode:o,getPaginationFragment:function(e){var r,t=c(e),n=null===(r=t.metadata)||void 0===r?void 0:r.refetch,a=null==n?void 0:n.connection;return null===n||"object"!=typeof n||null===a||"object"!=typeof a?null:t},getRefetchableFragment:function(e){var r,t=c(e),n=null===(r=t.metadata)||void 0===r?void 0:r.refetch;return null===n||"object"!=typeof n?null:t},getRequest:function(e){var r=o(e);return u(r)||a(!1,"GraphQLTag: Expected a request, got `%s`.",JSON.stringify(r)),r},getUpdatableQuery:function(e){var r=o(e);return s(r)||a(!1,"GraphQLTag: Expected a request, got `%s`.",JSON.stringify(r)),r},getInlineDataFragment:function(e){var r=o(e);return f(r)||a(!1,"GraphQLTag: Expected an inline data fragment, got `%s`.",JSON.stringify(r)),r},graphql:function(e){a(!1,"graphql: Unexpected invocation at runtime. Either the Babel transform was not set up, or it failed to identify this call site. Make sure it is being used verbatim as `graphql`. Note also that there cannot be a space between graphql and the backtick that follows.")},isFragment:i,isRequest:u,isUpdatableQuery:s,isInlineDataFragment:f}},129:(e,r,t)=>{var n=(0,t(275).default)(t(175)),a=t(165).getArgumentValues,l=t(56);e.exports={getLocalVariables:function(e,r,t){if(null==r)return e;var l=(0,n.default)({},e),o=t?a(t,e):{};return r.forEach((function(e){var r,t=null!==(r=o[e.name])&&void 0!==r?r:e.defaultValue;l[e.name]=t})),l},getFragmentVariables:function(e,r,t){return null==e.argumentDefinitions?t:(e.argumentDefinitions.forEach((function(o){if(!t.hasOwnProperty(o.name))switch(a=a||(0,n.default)({},t),o.kind){case"LocalArgument":a[o.name]=o.defaultValue;break;case"RootArgument":if(!r.hasOwnProperty(o.name)){a[o.name]=void 0;break}a[o.name]=r[o.name];break;default:l(!1,"RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.",o.kind,e.name)}})),a||t);var a},getOperationVariables:function(e,r,t){var n={};return e.argumentDefinitions.forEach((function(e){var r=e.defaultValue;null!=t[e.name]&&(r=t[e.name]),n[e.name]=r})),null!=r&&Object.keys(r).forEach((function(e){n[e]=r[e].get()})),n}}},256:(e,r,t)=>{var n=t(129).getFragmentVariables,a=t(165),l=a.CLIENT_EDGE_TRAVERSAL_PATH,o=a.FRAGMENT_OWNER_KEY,i=a.FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT,u=a.FRAGMENTS_KEY,s=a.ID_KEY,f=t(125),c=t(56),E=t(446);function d(e,r){("object"!=typeof r||null===r||Array.isArray(r))&&c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an object, got `%s`.",e.name,JSON.stringify(r));var t=r[s],a=r[u],f=r[o],d=r[l];if("string"==typeof t&&"object"==typeof a&&null!==a&&"object"==typeof a[e.name]&&null!==a[e.name]&&"object"==typeof f&&null!==f&&(null==d||Array.isArray(d))){var g=f,m=d,p=a[e.name];return A(e,t,n(e,g.variables,p),g,!0===p[i],m)}var _=JSON.stringify(r);return _.length>499&&(_=_.substr(0,498)+"…"),E(!1,"RelayModernSelector: Expected object to contain data for fragment `%s`, got `%s`. Make sure that the parent operation/fragment included fragment `...%s` without `@relay(mask: false)`.",e.name,_,e.name),null}function g(e,r){var t=null;return r.forEach((function(r,n){var a=null!=r?d(e,r):null;null!=a&&(t=t||[]).push(a)})),null==t?null:{kind:"PluralReaderSelector",selectors:t}}function m(e,r){return null==r?r:e.metadata&&!0===e.metadata.plural?(Array.isArray(r)||c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.",e.name,JSON.stringify(r),e.name),g(e,r)):(Array.isArray(r)&&c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an object, got `%s`. Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.",e.name,JSON.stringify(r),e.name),d(e,r))}function p(e,r){return null==r?r:e.metadata&&!0===e.metadata.plural?(Array.isArray(r)||c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.",e.name,JSON.stringify(r),e.name),function(e,r){var t=null;return r.forEach((function(r){var n=null!=r?_(e,r):null;null!=n&&(t=t||[]).push(n)})),t}(e,r)):(Array.isArray(r)&&c(!1,"RelayModernFragmentSpecResolver: Expected value for fragment `%s` to be an object, got `%s`. Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.",e.name,JSON.stringify(r),e.name),_(e,r))}function _(e,r){("object"!=typeof r||null===r||Array.isArray(r))&&c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an object, got `%s`.",e.name,JSON.stringify(r));var t=r[s];return"string"==typeof t?t:(E(!1,"RelayModernSelector: Expected object to contain data for fragment `%s`, got `%s`. Make sure that the parent operation/fragment included fragment `...%s` without `@relay(mask: false)`, or `null` is passed as the fragment reference for `%s` if it's conditonally included and the condition isn't met.",e.name,JSON.stringify(r),e.name,e.name),null)}function R(e,r){var t;return null==r?{}:!0===(null===(t=e.metadata)||void 0===t?void 0:t.plural)?(Array.isArray(r)||c(!1,"RelayModernSelector: Expected value for fragment `%s` to be an array, got `%s`. Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.",e.name,JSON.stringify(r),e.name),b(e,r)):(Array.isArray(r)&&c(!1,"RelayModernFragmentSpecResolver: Expected value for fragment `%s` to be an object, got `%s`. Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.",e.name,JSON.stringify(r),e.name),v(e,r)||{})}function v(e,r){var t=d(e,r);return t?t.variables:null}function b(e,r){var t={};return r.forEach((function(r,n){if(null!=r){var a=v(e,r);null!=a&&Object.assign(t,a)}})),t}function y(e,r){return e.dataID===r.dataID&&e.node===r.node&&f(e.variables,r.variables)&&((t=e.owner)===(n=r.owner)||t.identifier===n.identifier&&f(t.cacheConfig,n.cacheConfig))&&e.isWithinUnmatchedTypeRefinement===r.isWithinUnmatchedTypeRefinement&&function(e,r){if(e===r)return!0;if(null==e||null==r||e.length!==r.length)return!1;for(var t=e.length;t--;){var n=e[t],a=r[t];if(n!==a&&(null==n||null==a||n.clientEdgeDestinationID!==a.clientEdgeDestinationID||n.readerClientEdge!==a.readerClientEdge))return!1}return!0}(e.clientEdgeTraversalPath,r.clientEdgeTraversalPath);var t,n}function A(e,r,t,n){var a=arguments.length>5?arguments[5]:void 0;return{kind:"SingularReaderSelector",dataID:r,isWithinUnmatchedTypeRefinement:arguments.length>4&&void 0!==arguments[4]&&arguments[4],clientEdgeTraversalPath:null!=a?a:null,node:e,variables:t,owner:n}}e.exports={areEqualSelectors:function(e,r){return e===r||(null==e?null==r:null==r?null==e:"SingularReaderSelector"===e.kind&&"SingularReaderSelector"===r.kind?y(e,r):"PluralReaderSelector"===e.kind&&"PluralReaderSelector"===r.kind&&e.selectors.length===r.selectors.length&&e.selectors.every((function(e,t){return y(e,r.selectors[t])})))},createReaderSelector:A,createNormalizationSelector:function(e,r,t){return{dataID:r,node:e,variables:t}},getDataIDsFromFragment:p,getDataIDsFromObject:function(e,r){var t={};for(var n in e)if(e.hasOwnProperty(n)){var a=e[n],l=r[n];t[n]=p(a,l)}return t},getSingularSelector:d,getPluralSelector:g,getSelector:m,getSelectorsFromObject:function(e,r){var t={};for(var n in e)if(e.hasOwnProperty(n)){var a=e[n],l=r[n];t[n]=m(a,l)}return t},getVariablesFromSingularFragment:v,getVariablesFromPluralFragment:b,getVariablesFromFragment:R,getVariablesFromObject:function(e,r){var t={};for(var n in e)if(e.hasOwnProperty(n)){var a=R(e[n],r[n]);Object.assign(t,a)}return t}}},165:(e,r,t)=>{var n=(0,t(275).default)(t(642)),a=t(330),l=t(775),o=t(94),i=t(56),u=l.VARIABLE,s=l.LITERAL,f=l.OBJECT_VALUE,c=l.LIST_VALUE;function E(e,r){if(e.kind===u)return function(e,r){return r.hasOwnProperty(e)||i(!1,"getVariableValue(): Undefined variable `%s`.",e),o(r[e])}(e.variableName,r);if(e.kind===s)return e.value;if(e.kind===f){var t={};return e.fields.forEach((function(e){t[e.name]=E(e,r)})),t}if(e.kind===c){var n=[];return e.items.forEach((function(e){null!=e&&n.push(E(e,r))})),n}}function d(e,r,t){var n={};return t&&(n[m.FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT]=!0),e&&e.forEach((function(e){n[e.name]=E(e,r)})),n}function g(e,r){if(!r)return e;var t=[];for(var n in r)if(r.hasOwnProperty(n)){var a,l=r[n];null!=l&&t.push(n+":"+(null!==(a=JSON.stringify(l))&&void 0!==a?a:"undefined"))}return 0===t.length?e:e+"(".concat(t.join(","),")")}var m={ACTOR_IDENTIFIER_KEY:"__actorIdentifier",CLIENT_EDGE_TRAVERSAL_PATH:"__clientEdgeTraversalPath",FRAGMENTS_KEY:"__fragments",FRAGMENT_OWNER_KEY:"__fragmentOwner",FRAGMENT_POINTER_IS_WITHIN_UNMATCHED_TYPE_REFINEMENT:"$isWithinUnmatchedTypeRefinement",FRAGMENT_PROP_NAME_KEY:"__fragmentPropName",MODULE_COMPONENT_KEY:"__module_component",ERRORS_KEY:"__errors",ID_KEY:"__id",REF_KEY:"__ref",REFS_KEY:"__refs",ROOT_ID:"client:root",ROOT_TYPE:"__Root",TYPENAME_KEY:"__typename",INVALIDATED_AT_KEY:"__invalidated_at",RELAY_RESOLVER_VALUE_KEY:"__resolverValue",RELAY_RESOLVER_INVALIDATION_KEY:"__resolverValueMayBeInvalid",RELAY_RESOLVER_SNAPSHOT_KEY:"__resolverSnapshot",RELAY_RESOLVER_ERROR_KEY:"__resolverError",RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS:"__resolverOutputTypeRecordIDs",formatStorageKey:g,getArgumentValue:E,getArgumentValues:d,getHandleStorageKey:function(e,r){var t=e.dynamicKey,l=e.handle,o=e.key,i=e.name,u=e.args,s=e.filters,f=a(l,o,i),c=null;return u&&s&&0!==u.length&&0!==s.length&&(c=u.filter((function(e){return s.indexOf(e.name)>-1}))),t&&(c=null!=c?[t].concat((0,n.default)(c)):[t]),null===c?f:g(f,d(c,r))},getStorageKey:function(e,r){if(e.storageKey)return e.storageKey;var t=function(e){var r,t;return"RelayResolver"===e.kind||"RelayLiveResolver"===e.kind?null==e.args?null===(t=e.fragment)||void 0===t?void 0:t.args:null==(null===(r=e.fragment)||void 0===r?void 0:r.args)?e.args:e.args.concat(e.fragment.args):void 0===e.args?void 0:e.args}(e),n=e.name;return t&&0!==t.length?g(n,d(t,r)):n},getStableStorageKey:function(e,r){return g(e,o(r))},getModuleComponentKey:function(e){return"".concat("__module_component_").concat(e)},getModuleOperationKey:function(e){return"".concat("__module_operation_").concat(e)}};e.exports=m},890:(e,r,t)=>{var n=t(634).getFragment,a=t(256).getSelector,l=t(56),o=[],i={};e.exports={readFragment:function(e,r){if(!o.length)throw new Error("readFragment should be called only from within a Relay Resolver function.");var t=o[o.length-1],u=n(e),s=a(u,r);null==s&&l(!1,"Expected a selector for the fragment of the resolver ".concat(u.name,", but got null.")),"SingularReaderSelector"!==s.kind&&l(!1,"Expected a singular reader selector for the fragment of the resolver ".concat(u.name,", but it was plural."));var f=t.getDataForResolverFragment(s,r),c=f.data;if(f.isMissingData)throw i;return c},withResolverContext:function(e,r){o.push(e);try{return r()}finally{o.pop()}},RESOLVER_FRAGMENT_MISSING_DATA_SENTINEL:i}},222:(e,r,t)=>{var n=t(890).readFragment,a=t(56);e.exports=function(e,r,t,l){var o=r;return function(r,i){var u=n(e,r);if(null==t)return o(u,i);if(null==u){if(!0!==l)return o(null,i);a(!1,"Expected required resolver field `%s` in fragment `%s` to be present. But resolvers fragment data is null/undefined.",t,e.name)}if(t in u)return!0===l&&null==u[t]&&a(!1,"Expected required resolver field `%s` in fragment `%s` to be non-null.",t,e.name),o(u[t],i);a(!1,"Missing field `%s` in fragment `%s` in resolver response.",t,e.name)}}},775:e=>{e.exports={ACTOR_CHANGE:"ActorChange",CATCH_FIELD:"CatchField",CONDITION:"Condition",CLIENT_COMPONENT:"ClientComponent",CLIENT_EDGE_TO_SERVER_OBJECT:"ClientEdgeToServerObject",CLIENT_EDGE_TO_CLIENT_OBJECT:"ClientEdgeToClientObject",CLIENT_EXTENSION:"ClientExtension",DEFER:"Defer",CONNECTION:"Connection",FRAGMENT:"Fragment",FRAGMENT_SPREAD:"FragmentSpread",INLINE_DATA_FRAGMENT_SPREAD:"InlineDataFragmentSpread",INLINE_DATA_FRAGMENT:"InlineDataFragment",INLINE_FRAGMENT:"InlineFragment",LINKED_FIELD:"LinkedField",LINKED_HANDLE:"LinkedHandle",LITERAL:"Literal",LIST_VALUE:"ListValue",LOCAL_ARGUMENT:"LocalArgument",MODULE_IMPORT:"ModuleImport",ALIASED_FRAGMENT_SPREAD:"AliasedFragmentSpread",ALIASED_INLINE_FRAGMENT_SPREAD:"AliasedInlineFragmentSpread",RELAY_RESOLVER:"RelayResolver",RELAY_LIVE_RESOLVER:"RelayLiveResolver",REQUIRED_FIELD:"RequiredField",OBJECT_VALUE:"ObjectValue",OPERATION:"Operation",REQUEST:"Request",ROOT_ARGUMENT:"RootArgument",SCALAR_FIELD:"ScalarField",SCALAR_HANDLE:"ScalarHandle",SPLIT_OPERATION:"SplitOperation",STREAM:"Stream",TYPE_DISCRIMINATOR:"TypeDiscriminator",UPDATABLE_QUERY:"UpdatableQuery",VARIABLE:"Variable"}},204:e=>{e.exports={DEFAULT_HANDLE_KEY:""}},330:(e,r,t)=>{var n=t(204).DEFAULT_HANDLE_KEY,a=t(56);e.exports=function(e,r,t){return r&&r!==n?"__".concat(r,"_").concat(e):(null==t&&a(!1,"getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided"),"__".concat(t,"_").concat(e))}},94:e=>{e.exports=function e(r){if(!r||"object"!=typeof r)return r;if(Array.isArray(r))return r.map(e);for(var t=Object.keys(r).sort(),n={},a=0;a<t.length;a++)n[t[a]]=e(r[t[a]]);return n}},275:r=>{r.exports=e},175:e=>{e.exports=r},642:e=>{e.exports=t},125:e=>{e.exports=n},446:e=>{e.exports=a},56:e=>{e.exports=l}},i={};return function e(r){var t=i[r];if(void 0!==t)return t.exports;var n=i[r]={exports:{}};return o[r](n,n.exports,e),n.exports}(649)})()));