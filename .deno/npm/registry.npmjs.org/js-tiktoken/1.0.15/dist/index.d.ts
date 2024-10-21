import { T as TiktokenEncoding, a as Tiktoken, b as TiktokenModel } from './core-ac05be14.js';
export { c as TiktokenBPE, g as getEncodingNameForModel } from './core-ac05be14.js';

declare function getEncoding(encoding: TiktokenEncoding, extendSpecialTokens?: Record<string, number>): Tiktoken;
declare function encodingForModel(model: TiktokenModel, extendSpecialTokens?: Record<string, number>): Tiktoken;

export { Tiktoken, TiktokenEncoding, TiktokenModel, encodingForModel, getEncoding };
