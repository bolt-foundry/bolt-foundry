/* esm.sh - esbuild bundle(micromark-util-decode-numeric-character-reference@2.0.1) denonext production */
function n(r,_){let e=Number.parseInt(r,_);return e<9||e===11||e>13&&e<32||e>126&&e<160||e>55295&&e<57344||e>64975&&e<65008||(e&65535)===65535||(e&65535)===65534||e>1114111?"\uFFFD":String.fromCodePoint(e)}export{n as decodeNumericCharacterReference};
//# sourceMappingURL=micromark-util-decode-numeric-character-reference.mjs.map