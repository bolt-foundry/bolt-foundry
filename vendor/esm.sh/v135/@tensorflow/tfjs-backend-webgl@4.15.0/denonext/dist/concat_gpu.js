/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/concat_gpu) denonext production */
import{backend_util as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var n=class{constructor(o){this.outputShape=[],this.outputShape=c.computeOutShape(o,1),this.variableNames=o.map((t,i)=>`T${i}`);let e=new Array(o.length-1);e[0]=o[0][1];for(let t=1;t<e.length;t++)e[t]=e[t-1]+o[t][1];let s=[`if (yC < ${e[0]}) setOutput(getT0(yR, yC));`];for(let t=1;t<e.length;t++){let i=e[t-1];s.push(`else if (yC < ${e[t]}) setOutput(getT${t}(yR, yC-${i}));`)}let u=e.length,l=e[e.length-1];s.push(`else setOutput(getT${u}(yR, yC-${l}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${s.join(`
        `)}
      }
    `}};export{n as ConcatProgram};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/concat_gpu.js:
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
//# sourceMappingURL=concat_gpu.js.map