/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/gather_nd_gpu) denonext production */
import{getCoordsDataType as a}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var e=class{constructor(i,d,o,n){this.sliceDim=i,this.strides=d,this.paramsShape=n,this.variableNames=["x","indices"],this.outputShape=o;let u=a(o.length),s=`
    int index;`;for(let t=0;t<this.sliceDim;t++)s+=`
          index = round(getIndices(coords[0], ${t}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[t]};
          flattenIndex += index * ${this.strides[t]};`;this.userCode=`
         void main() {
          ${u} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${s}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}};export{e as GatherNDProgram};
//# sourceMappingURL=gather_nd_gpu.js.map