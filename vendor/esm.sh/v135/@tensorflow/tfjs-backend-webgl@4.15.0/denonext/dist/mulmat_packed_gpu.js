/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/mulmat_packed_gpu) denonext production */
import{useShapeUniforms as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";var d=class{constructor(e,s,b,c=!1,r=!1,a=!1,t=null,o=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=b,this.enableShapeUniforms=w(this.outputShape.length);let m=c?e[1]:e[2],u=Math.ceil(m/2),x=c?"i * 2, rc.y":"rc.y, i * 2",$=r?"rc.z, i * 2":"i * 2, rc.z",n=c?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],p=r?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],i="",h="";t&&(o?i=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${t}
        }`:l?i=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${t}
        }`:i=`vec4 activation(vec4 x) {
          ${t}
        }`,h="result = activation(result);");let z=a?"result += getBiasAtOutCoords();":"";a&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let f="rc.x",v="rc.x";e[0]<s[0]?f=`imod(rc.x, ${e[0]})`:s[0]<e[0]&&(v=`imod(rc.x, ${s[0]})`),this.userCode=`
      ${i}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${u}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${f};
        int batchB = ${v};
        for (int i = 0; i < ${u}; i++) {
          vec4 a = getMatrixA(batchA, ${x});
          vec4 b = getMatrixB(batchB, ${$});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${n[0]} * ${p[0]});
          result += (${n[1]} * ${p[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${z}

        ${h}

        setOutput(result);
      }
    `}};export{d as MatMulPackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/mulmat_packed_gpu.js:
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
//# sourceMappingURL=mulmat_packed_gpu.js.map