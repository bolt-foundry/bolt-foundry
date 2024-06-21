/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/cum_gpu) denonext production */
import{getCoordsDataType as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler.js";var p;(function(o){o.Prod="*",o.Sum="+"})(p||(p={}));var $=class{constructor(t,i,u,s){this.op=t,this.outputShape=i,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];let e=this.outputShape.length,f=this.op===p.Prod?"1.0":"0.0",c=u?f:`getX(${l(e,"coords",this.op)})`,d=this.outputShape[this.outputShape.length-1],r="",n="";u?(r=s?`end != ${d-1}`:"end != 0",n=s?"end + 1":"end - 1"):(r=s?`end + pow2 < ${d}`:"end >= pow2",n=s?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${w(e)} coords = getOutputCoords();
        int end = ${h(e,"coords",this.op)};
        float val = ${c};
        int pow2 = int(pow(2.0, index));
        if (${r}) {
          int idx = ${n};
          ${h(e,"coords",this.op)} = idx;
          val ${this.op}= getX(${l(e,"coords",this.op)});
        }
        setOutput(val);
      }
    `}};function l(o,t,i){if(o===1)return`${t}`;if(o===2)return`${t}.x, ${t}.y`;if(o===3)return`${t}.x, ${t}.y, ${t}.z`;if(o===4)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw new Error(`Cumulative ${i} for rank ${o} is not yet supported`)}function h(o,t,i){if(o===1)return`${t}`;if(o===2)return`${t}.y`;if(o===3)return`${t}.z`;if(o===4)return`${t}.w`;throw new Error(`Cumulative ${i} for rank ${o} is not yet supported`)}export{p as CumOpType,$ as CumProgram};
//# sourceMappingURL=cum_gpu.js.map