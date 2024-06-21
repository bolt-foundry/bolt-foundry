/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/platforms/platform_browser) denonext production */
import"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/flags.js";import{env as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/environment.js";import{BrowserIndexedDB as d,BrowserIndexedDBManager as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/io/indexed_db.js";import{BrowserLocalStorage as u,BrowserLocalStorageManager as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/io/local_storage.js";import{ModelStoreManagerRegistry as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/io/model_management.js";import{isTypedArrayBrowser as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/platforms/is_typed_array_browser.js";var o=class{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if(t!=="utf-8"&&t!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){if(typeof window>"u"||!s().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,t);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",r=>{if(r.source===window&&r.data.name===this.messageName){r.stopPropagation();let a=this.functionRefs[r.data.index];a(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return c(e)}};if(s().get("IS_BROWSER")){s().setPlatform("browser",new o);try{i.registerManager(u.URL_SCHEME,new f)}catch{}try{i.registerManager(d.URL_SCHEME,new h)}catch{}}export{o as PlatformBrowser};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/platforms/platform_browser.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=platform_browser.js.map