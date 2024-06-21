/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/binaryop_packed_gpu) denonext production */
import{backend_util as a,util as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{useShapeUniforms as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import{getChannels as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/packing_util.js";import{getCoordsDataType as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var x=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`,B=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,C=`
  return vec4(notEqual(a, b));
`,u=class{constructor(o,r,l,n=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=a.assertAndGetBroadcastShape(r,l);let t=this.outputShape.length;this.enableShapeUniforms=p(t);let e="";if(n)if(t===0||i.sizeFromShape(this.outputShape)===1)e=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(e=`
          ${O(t)} coords = getOutputCoords();
        `,t===1)this.enableShapeUniforms?e+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:e+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{let s=h("coords",t);this.enableShapeUniforms?e+=`
            bool nextRowOutOfBounds =
              (${s[t-2]} + 1) >= outShape[${t} - 2];
            bool nextColOutOfBounds =
              (${s[t-1]} + 1) >= outShape[${t} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:e+=`
            bool nextRowOutOfBounds =
              (${s[t-2]} + 1) >= ${this.outputShape[t-2]};
            bool nextColOutOfBounds =
              (${s[t-1]} + 1) >= ${this.outputShape[t-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${o}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${e}

        setOutput(result);
      }
    `}};export{u as BinaryOpPackedProgram,x as CHECK_NAN_SNIPPET_PACKED,B as ELU_DER,C as NOT_EQUAL};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/binaryop_packed_gpu.js:
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
//# sourceMappingURL=binaryop_packed_gpu.js.map