/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/reshape_packed_gpu) denonext production */
import{useShapeUniforms as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gpgpu_math.js";import*as t from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";var a=class{constructor(i,o){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=i,this.enableShapeUniforms=u(this.outputShape.length);let r="";for(let e=0;e<4;e++){let s="thisRC = rc;";e%2===1&&(s+="thisRC.z += 1;"),e>1&&(s+="thisRC.y += 1;"),r+=`
        ${s}
        ${e>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${e}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${e>0?"}":""}
      `}this.userCode=`
      ${p(o,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?t.getFlatIndexFrom3DOutput():t.getFlatIndexFrom3D(i)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":i[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":i[2]};

        ${r}

        setOutput(result);
      }
    `}};function p(n,i){return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${i?t.getLogicalCoordinatesFromFlatIndexByUniform(["r","c","d"],"inputShape"):t.getLogicalCoordinatesFromFlatIndex(["r","c","d"],n)}
      return ivec3(r, c, d);
    }
  `}export{a as ReshapePackedProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/reshape_packed_gpu.js:
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
//# sourceMappingURL=reshape_packed_gpu.js.map