/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/serialization) denonext production */
import{assert as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";var m=new Map,r=new Map,o=class{getClassName(){return this.constructor.className}static fromConfig(s,t){return new s(t)}},n=class e{constructor(){this.classNameMap={}}static getMap(){return e.instance==null&&(e.instance=new e),e.instance}static register(s){e.getMap().classNameMap[s.className]=[s,s.fromConfig]}};function f(e,s,t){a(e.className!=null,()=>"Class being registered does not have the static className property defined."),a(typeof e.className=="string",()=>"className is required to be a string, but got type "+typeof e.className),a(e.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof s>"u"&&(s="Custom"),typeof t>"u"&&(t=e.className);let c=t,i=s+">"+c;return n.register(e),m.set(i,e),r.set(e,i),e}function N(e){return r.has(e)?r.get(e):e.className}export{o as Serializable,n as SerializationMap,N as getRegisteredName,f as registerClass};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/serialization.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=serialization.js.map