/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/backends/backend) denonext production */
var u=1e-7,h=1e-4,n=class{constructor(t,r){this.backend=t,this.dataMover=r,this.data=new WeakMap,this.dataIdsCount=0}get(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)}set(t,r){this.dataIdsCount++,this.data.set(t,r)}has(t){return this.data.has(t)}delete(t){return this.dataIdsCount--,this.data.delete(t)}numDataIds(){return this.dataIdsCount}},o=class{refCount(t){return e("refCount")}incRef(t){return e("incRef")}timerAvailable(){return!0}time(t){return e("time")}read(t){return e("read")}readSync(t){return e("readSync")}readToGPU(t,r){return e("readToGPU")}numDataIds(){return e("numDataIds")}disposeData(t,r){return e("disposeData")}write(t,r,s){return e("write")}move(t,r,s,d,i){return e("move")}createTensorFromGPUData(t,r,s){return e("createTensorFromGPUData")}memory(){return e("memory")}floatPrecision(){return e("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return e("dispose")}};function e(a){throw new Error(`'${a}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}export{n as DataStorage,h as EPSILON_FLOAT16,u as EPSILON_FLOAT32,o as KernelBackend};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/backend.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=backend.js.map