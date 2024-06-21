/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/batchnorm_gpu) denonext production */
import{backend_util as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var r=class{constructor(t,n,l,a,s,f){this.outputShape=[],this.variableNames=["x","mean","variance"],e.assertAndGetBroadcastShape(t,n),e.assertAndGetBroadcastShape(t,l);let o="0.0";a!=null&&(e.assertAndGetBroadcastShape(t,a),this.variableNames.push("offset"),o="getOffsetAtOutCoords()");let i="1.0";s!=null&&(e.assertAndGetBroadcastShape(t,s),this.variableNames.push("scale"),i="getScaleAtOutCoords()"),this.outputShape=t,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${o};
        float scale = ${i};
        float inv = scale * inversesqrt(variance + float(${f}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}};export{r as BatchNormProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/batchnorm_gpu.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=batchnorm_gpu.js.map