/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/batchnorm_packed_gpu) denonext production */
import{backend_util as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var i=class{constructor(e,n,o,s,a,u){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],t.assertAndGetBroadcastShape(e,n),t.assertAndGetBroadcastShape(e,o);let r="vec4(0.0)";s!=null&&(t.assertAndGetBroadcastShape(e,s),this.variableNames.push("offset"),r="getOffsetAtOutCoords()");let c="vec4(1.0)";a!=null&&(t.assertAndGetBroadcastShape(e,a),this.variableNames.push("scale"),c="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${r};
        vec4 scale = ${c};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${u}));

        setOutput((x - mean) * inv + offset);
      }
    `}};export{i as BatchNormPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/batchnorm_packed_gpu.js:
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
//# sourceMappingURL=batchnorm_packed_gpu.js.map