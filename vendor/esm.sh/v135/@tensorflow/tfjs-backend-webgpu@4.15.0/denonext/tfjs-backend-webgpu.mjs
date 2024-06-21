/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgpu@4.15.0) denonext production */
var En=Object.defineProperty;var Un=(o,t)=>{for(var e in t)En(o,e,{get:t[e],enumerable:!0})};import{env as Wn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Z=Wn();Z.registerFlag("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE",()=>15);Z.registerFlag("WEBGPU_CPU_FORWARD",()=>!0);Z.registerFlag("WEBGPU_MATMUL_PROGRAM_TYPE",()=>-1);Z.registerFlag("WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE",()=>!0);Z.registerFlag("WEBGPU_USE_LOW_POWER_GPU",()=>!1);Z.registerFlag("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e3);Z.registerFlag("WEBGPU_USE_PROFILE_TOOL",()=>!1);Z.registerFlag("WEBGPU_IMPORT_EXTERNAL_TEXTURE",()=>!0);Z.registerFlag("WEBGPU_USE_NAIVE_CONV2D_DEBUG",()=>!1);Z.registerFlag("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL",()=>-1);Z.registerFlag("WEBGPU_CONV_SEPARATE_IM2COL_SHADER",()=>!1);Z.registerFlag("WEBGPU_PRINT_SHADER",()=>"");Z.registerFlag("WEBGPU_ENGINE_COMPILE_ONLY",()=>!1);import{env as su,registerBackend as au}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as gr,buffer as xr,DataStorage as tu,engine as No,env as he,KernelBackend as ou,util as U}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ke=class{constructor(t){t&&(this.vendor=t.vendor,this.architecture=t.architecture,this.intelGPUGeneration=this.getIntelGPUGeneration())}getIntelGPUGeneration(){if(this.isIntel()){if(this.architecture.startsWith("gen"))return Number(this.architecture.match(/\d+/));if(this.architecture.startsWith("xe"))return 12}return 0}isIntel(){return this.vendor==="intel"}};var Xe=class{constructor(t){this.device=t,this.numUsedBuffers=0,this.numFreeBuffers=0,this.freeBuffers=new Map,this.usedBuffers=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireBuffer(t,e,i=!1,r=!0){let s,a=sr(t,e);return r?(this.freeBuffers.has(a)||this.freeBuffers.set(a,[]),this.freeBuffers.get(a).length>0?(s=this.freeBuffers.get(a).pop(),this.numFreeBuffers--):(s=this.device.createBuffer({size:t,usage:e,mappedAtCreation:i}),this.numBytesAllocated+=t)):(s=this.device.createBuffer({size:t,usage:e,mappedAtCreation:i}),this.numBytesAllocated+=t),this.usedBuffers.has(a)||this.usedBuffers.set(a,[]),this.usedBuffers.get(a).push(s),this.numUsedBuffers++,this.numBytesUsed+=t,s}releaseBuffer(t,e=!0){if(this.freeBuffers.size===0)return;let i=t.size,r=t.usage,s=sr(i,r),a=this.usedBuffers.get(s),n=a.indexOf(t);if(n<0)throw new Error("Cannot find the buffer in buffer manager");a[n]=a[a.length-1],a.pop(),this.numUsedBuffers--,this.numBytesUsed-=i,e?(this.freeBuffers.get(s).push(t),this.numFreeBuffers++):(t.destroy(),this.numBytesAllocated-=i)}getNumUsedBuffers(){return this.numUsedBuffers}getNumFreeBuffers(){return this.numFreeBuffers}dispose(){this.freeBuffers.forEach((t,e)=>{t.forEach(i=>{i.destroy()})}),this.usedBuffers.forEach((t,e)=>{t.forEach(i=>{i.destroy()})}),this.freeBuffers=new Map,this.usedBuffers=new Map,this.numUsedBuffers=0,this.numFreeBuffers=0,this.numBytesUsed=0,this.numBytesAllocated=0}};function sr(o,t){return`${o}_${t}`}var qe=class{constructor(t){this.device=t,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures=new Map,this.usedTextures=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireTexture(t,e,i,r){let s=nr(i),a=t*e*s,n=ar(t,e,i,r);if(this.freeTextures.has(n)||this.freeTextures.set(n,[]),this.usedTextures.has(n)||this.usedTextures.set(n,[]),this.numBytesUsed+=a,this.numUsedTextures++,this.freeTextures.get(n).length>0){this.numFreeTextures--;let p=this.freeTextures.get(n).shift();return this.usedTextures.get(n).push(p),p}this.numBytesAllocated+=a;let u=this.device.createTexture({size:[t,e],format:i,usage:r});return this.usedTextures.get(n).push(u),u}releaseTexture(t){if(this.freeTextures.size===0)return;let e=t.width,i=t.height,r=t.format,s=t.usage,a=ar(e,i,r,s);this.freeTextures.has(a)||this.freeTextures.set(a,[]),this.freeTextures.get(a).push(t),this.numFreeTextures++,this.numUsedTextures--;let n=this.usedTextures.get(a),u=n.indexOf(t);if(u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");n.splice(u,1);let p=nr(r),d=e*i*p;this.numBytesUsed-=d}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){this.freeTextures.forEach((t,e)=>{t.forEach(i=>{i.destroy()})}),this.usedTextures.forEach((t,e)=>{t.forEach(i=>{i.destroy()})}),this.freeTextures=new Map,this.usedTextures=new Map,this.numUsedTextures=0,this.numFreeTextures=0,this.numBytesUsed=0,this.numBytesAllocated=0}};function ar(o,t,e,i){return`${o}_${t}_${e}_${i}`}function nr(o){if(o==="rgba8unorm")return 16;throw new Error(`${o} is not supported!`)}import{backend_util as cr,env as Mn,util as Ye}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ur(o,t){if(Math.max(...o)>5)throw new Error("Cannot symbolically compute strides for rank > 6 tensor.");let e=o.length,i="xyzwuv",r=o.map(a=>`${t}.${i[a]}`),s=new Array(e-1);s[e-2]=r[e-1];for(let a=e-3;a>=0;--a)s[a]=`(${s[a+1]} * ${r[a+1]})`;return s}var q=(o,t,e)=>e==="int32"?`atomicAdd(${o}, bitcast<i32>(${t}));`:`
          {
            var oldValue = 0;
            loop {
              let newValueF32 = bitcast<f32>(oldValue) + (${t});
              let newValue = bitcast<i32>(newValueF32);
              let res = atomicCompareExchangeWeak(${o}, oldValue, newValue);
              if res.exchanged {
                break;
              }
              oldValue = res.old_value;
            }
          }`;var se;(function(o){o[o.FROM_PIXELS=0]="FROM_PIXELS",o[o.DRAW=1]="DRAW"})(se||(se={}));var hr=(o,t,e,i,r)=>{let s={dtype:i.dtype,shape:i.shape},a=Vn(e,s,t),n=o.createShaderModule({code:a,label:t.constructor.name}),u=Mn().get("WEBGPU_PRINT_SHADER");if(u!==""){u=u.toLowerCase();let p=u.split(",");(u==="all"||p.some(d=>t.shaderKey.toLowerCase().includes(d)))&&(console.group(t.shaderKey),console.debug(a),console.groupEnd())}return r?o.createComputePipelineAsync({compute:{module:n,entryPoint:"_start"},label:t.constructor.name,layout:"auto"}):o.createComputePipeline({compute:{module:n,entryPoint:"_start"},label:t.constructor.name,layout:"auto"})},z=(o,t="f32")=>{switch(o){case 1:return`${t}`;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${o}-component ${t} is not supported.`)}};function T(o){if(o<=1)return"i32";if(o===2)return"vec2<i32>";if(o===3)return"vec3<i32>";if(o===4)return"vec4<i32>";if(o===5)return"vec5";if(o===6)return"vec6";throw Error(`GPU for rank ${o} is not yet supported`)}function ee(o){if(o===0)return"x";if(o===1)return"y";if(o===2)return"z";if(o===3)return"w";if(o===4)return"u";if(o===5)return"v";throw Error(`Index ${o} is not yet supported`)}function x(...o){let t;switch(o.length){case 0:t=`
        fn main()
      `;break;case 1:t=`
        fn main(${o[0]} : i32)
      `;break;default:throw Error("Unreachable")}return t}function pr(o,t){let e;return e=`
     ${On(t)}
      fn _start(@builtin(local_invocation_id) LocalId : vec3<u32>,
                @builtin(global_invocation_id) GlobalId : vec3<u32>,
                @builtin(local_invocation_index) LocalIndex: u32,
                @builtin(workgroup_id) WorkgroupId : vec3<u32>,
                @builtin(num_workgroups) NumWorkgroups : vec3<u32>) {
        localId = LocalId;
        localIndex = LocalIndex;
        globalId = GlobalId;
        numWorkgroups = NumWorkgroups;
        workgroupId = WorkgroupId;
        ${o?"main(getGlobalIndex());":"main();"};
      }
    `,e}function On(o){return`
  @compute @workgroup_size(${o.workgroupSize[0]}, ${o.workgroupSize[1]}, ${o.workgroupSize[2]})
`}function Vn(o,t,e){let i=[],r=e.workgroupSize[0]*e.workgroupSize[1]*e.workgroupSize[2];if(e.outputComponent=e.outputComponent?e.outputComponent:1,i.push(`

      var<private> localId: vec3<u32>;
      var<private> localIndex: u32;
      var<private> globalId: vec3<u32>;
      var<private> numWorkgroups: vec3<u32>;
      var<private> workgroupId: vec3<u32>;

      // Only used when the y/z dimension of workgroup size is 1.
      fn getGlobalIndex() -> i32 {
        ${fr(e)?"  return i32(globalId.x);":`  return i32((workgroupId.z * numWorkgroups.x * numWorkgroups.y +
                workgroupId.y * numWorkgroups.x + workgroupId.x) * ${r}u +
                localIndex);
        `}
      }
    `),e.pixelsOpType!=null){let m=e.pixelsOpType===se.FROM_PIXELS?`@group(0) @binding(0) var<storage, read_write> result: array<${pe(t.dtype,e.outputComponent)}>;`:`@group(0) @binding(1) var<storage, read> inBuf : array<${pe(o[0].dtype,e.outputComponent)}>;`,f=t.shape.length===3?"vec2<i32>":"i32";i.push(`
        struct Uniform {
          outShapeStrides : ${f},
          size            : i32,
          numChannels     : i32,
          alpha           : f32,
        };

        ${m}
        @group(0) @binding(2) var<uniform> uniforms: Uniform;
      `);let g=lr(e);return[dr,i.join(`
`),ze(t.shape),e.getUserCode(),pr(g,e)].join(`
`)}let s,a,n="struct Uniforms { NAN : f32, INFINITY : f32, ";e.variableNames.forEach((m,f)=>{let g=T(o[f].shape.length);n+=`${m.charAt(0).toLowerCase()+m.slice(1)}Shape : ${g}, `,s=o[f].shape.length-1,a=T(s),n+=`${m.charAt(0).toLowerCase()+m.slice(1)}ShapeStrides: ${a}, `});let u=T(t.shape.length);n+=`outShape : ${u}, `,s=t.shape.length-1,a=T(s),n+=`
         outShapeStrides: ${a}, `,e.size&&(n+="size : i32, "),e.uniforms&&(n+=e.uniforms),n+="};",n=Qn(n),i.push(n),e.atomic?i.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<atomic<i32>>;
    `):i.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<${pe(t.dtype,e.outputComponent)}>;
    `),e.variableNames.forEach((m,f)=>{i.push(`
      @group(0) @binding(${1+f}) var<storage, read> ${m}: array<${e.variableComponents?pe(o[f].dtype,e.variableComponents[f]):pe(o[f].dtype,e.outputComponent)}>;
        `)}),n!==""&&i.push(`
      @group(0) @binding(${1+e.variableNames.length}) var<uniform> uniforms: Uniforms;
      `);let p=qn(t.shape,e.dispatchLayout),d=[dr,i.join(`
`)+Hn,ze(t.shape),p,Yn(t.shape.length)];e.atomic||d.push(jn(t.shape,t.dtype,e.outputComponent)),e.variableNames.forEach((m,f)=>{d.push(`${ze(o[f].shape,m)}`)});let c=o.map((m,f)=>Xn(m,t.shape,e.variableComponents?e.variableComponents[f]:e.outputComponent,e.dispatchLayout.x.length===t.shape.length)).join(`
`);d.push(c),d.push(e.getUserCode());let l=lr(e);return d.push(pr(l,e)),d.join(`
`)}function mr(o,t,e){let i=o.shaderKey;if(o.pixelsOpType!=null)return i;let r=[],s=[];t.forEach(d=>{r.push(d.shape),s.push(d.dtype)}),r.push(e.shape),s.push(e.dtype);let a=t.map(d=>cr.getBroadcastDims(d.shape,e.shape)),n=t.map(d=>Ye.arraysEqual(d.shape,e.shape)).join("_"),u=a.map(d=>d.join("_")).join(";"),p=fr(o)?"flatDispatch":"";return i+="_"+(o.workgroupSize?o.workgroupSize.join(","):"")+r.map(d=>d.length).join(",")+s.join(",")+o.variableNames.join(",")+u+n+p,i}var dr=`
  struct vec5 {x: i32, y: i32, z: i32, w: i32, u: i32};
  struct vec6 {x: i32, y: i32, z: i32, w: i32, u: i32, v: i32};

  // Checks whether coordinates lie within the bounds of the shape.
  fn coordsInBounds2D(coord : vec2<i32>, shape : vec2<i32>) -> bool {
    return all(coord >= vec2<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds3D(coord : vec3<i32>, shape : vec3<i32>) -> bool {
    return all(coord >= vec3<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds4D(coord : vec4<i32>, shape : vec4<i32>) -> bool {
    return all(coord >= vec4<i32>(0)) && all(coord < shape);
  }

  fn getIndexFromCoords1D(coord : i32, shape : i32) -> i32 {
    return coord;
  }
  fn getIndexFromCoords2D(coords : vec2<i32>, shape : vec2<i32>) -> i32 {
    return dot(coords, vec2<i32>(shape.y, 1));
  }
  fn getIndexFromCoords3D(coords : vec3<i32>, shape : vec3<i32>) -> i32 {
    return dot(coords, vec3<i32>(shape.y * shape.z, shape.z, 1));
  }
  fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
    return dot(coords, vec4<i32>(
        shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
  }
  fn getIndexFromCoords5D(coords : vec5, shape : vec5) -> i32 {
    let shapeStrides: vec5 = vec5(shape.y * shape.z * shape.w * shape.u, shape.z * shape.w * shape.u, shape.w * shape.u, shape.u, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u;
  }
  fn getIndexFromCoords6D(coords : vec6, shape : vec6) -> i32 {
    let shapeStrides: vec6 = vec6(shape.y * shape.z * shape.w * shape.u * shape.v, shape.z * shape.w * shape.u * shape.v, shape.w * shape.u * shape.v, shape.u * shape.v, shape.v, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u + coords.v*shapeStrides.v;
  }

  // NaN defination in IEEE 754-1985 is :
  //   - sign = either 0 or 1.
  //   - biased exponent = all 1 bits.
  //   - fraction = anything except all 0 bits (since all 0 bits represents infinity).
  // https://en.wikipedia.org/wiki/IEEE_754-1985#Representation_of_non-numbers
  fn isnan(val: f32) -> bool {
    let floatToUint: u32 = bitcast<u32>(val);
    return (floatToUint & 0x7fffffffu) > 0x7f800000u;
  }
  fn isnanVec4(val : vec4<f32>) -> vec4<bool> {
    let floatToUint: vec4<u32> = bitcast<vec4<u32>>(val);
    return (floatToUint & vec4<u32>(0x7fffffffu)) > vec4<u32>(0x7f800000u);
  }
`,Hn=`
  fn isinf(val: f32) -> bool {
    return abs(val) == uniforms.INFINITY;
  }
`;function ze(o,t=""){let e=o.length,i=t!==""?`get${t.charAt(0).toUpperCase()+t.slice(1)}CoordsFromIndex`:"getCoordsFromIndex",r=t!==""?`${t.charAt(0).toLowerCase()+t.slice(1)}ShapeStrides`:"outShapeStrides";if(e<=1)return`fn ${i}(index : i32) -> i32 { return index; }`;let s=Ye.computeStrides(o),a=T(e),n=[];for(let p=0;p<e;p++)n.push(`d${p}`);if(s.length===1)return`    fn ${i}(index : i32) -> vec2<i32> {
      let d0 = index / uniforms.${r}; let d1 = index - d0 * uniforms.${r};
      return vec2<i32>(d0, d1);
    }`;let u;return u="var index2 = index;"+s.map((p,d)=>{let c=`let ${n[d]} = index2 / uniforms.${r}.${ee(d)}`,l=d===s.length-1?`let ${n[d+1]} = index2 - ${n[d]} * uniforms.${r}.${ee(d)}`:`index2 = index2 - ${n[d]} * uniforms.${r}.${ee(d)}`;return`${c}; ${l};`}).join(""),`
    fn ${i}(index : i32) -> ${a} {
      ${u}
      return ${a}(${n.join(",")});
    }
  `}function Gn(o,t){let e=o.name,i=o.shape.length,r=T(i),s="get"+e.charAt(0).toUpperCase()+e.slice(1),a=["d0","d1","d2","d3","d4","d5"].slice(0,i),n=a.map(d=>`${d} : i32`).join(", ");if(i<1)return`
      fn ${s}() -> ${z(t)} {
        return ${z(t)}(${e}[0]);
      }
    `;let u=`uniforms.${e.charAt(0).toLowerCase()+e.slice(1)}Shape`,p=`${i}D`;return i===0&&(p="1D"),`
    fn ${s}(${n}) -> ${z(t)} {
      return ${z(t)}(${e}[getIndexFromCoords${p}(${r}(${a.join(",")}),
        ${u})${t===1?"":` / ${t}`}]);
    }
   `}function Kn(o,t,e,i){let r=o.name,s=r.charAt(0).toUpperCase()+r.slice(1),a="get"+s+"ByOutput",n=o.shape.length,u=t.length,p=T(u);if(Ye.arraysEqual(o.shape,t)&&i)return`
    fn ${a}Index(globalIndex : i32) -> ${z(e)} {
      return ${z(e)}(${r}[globalIndex]);
    }

    fn ${a}Coords(coords : ${p}) -> ${z(e)} {
      return ${z(e)}(${r}[${u>1?"getOutputIndexFromCoords(coords)":"coords"}${e===1?"":` / ${e}`}]);
    }
    `;let d=cr.getBroadcastDims(o.shape,t),c=u-n,l="";if(n===0)return`
    fn ${a}Index(globalIndex : i32) -> ${z(e)}{
      return get${s}();
    }

    fn ${a}Coords(coords : ${p}) -> ${z(e)}{
      return get${s}();
    }
  `;u<2&&d.length>=1?l="coords = 0;":l=d.map(g=>`coords.${ee(g+c)} = 0;`).join(`
`);let h="";if(u<2&&n>0)h="coords";else if(u>1){let g=T(n),w=o.shape.map((b,v)=>`coords.${ee(v+c)}`).join(", ");h=`${g}(${w})`}else h="coords";let m=`uniforms.${r.charAt(0).toLowerCase()+r.slice(1)}Shape`,f=`${n}D`;return`
  fn ${a}Index(globalIndex : i32) -> ${z(e)} {
    var coords = getCoordsFromIndex(globalIndex);
    ${l}
    return ${z(e)}(${r}[getIndexFromCoords${f}(${h}, ${m})${e===1?"":` / ${e}`}]);
  }

  fn ${a}Coords(coordsIn : ${p}) -> ${z(e)} {
    var coords = coordsIn;
    ${l}
    return ${z(e)}(${r}[getIndexFromCoords${f}(${h}, ${m})${e===1?"":` / ${e}`}]);
  }
`}function Xn(o,t,e,i){let r=Gn(o,e);return o.shape.length<=t.length&&(r+=Kn(o,t,e,i)),r}function qn(o,t){let{x:e,y:i=[],z:r=[]}=t,s=o.length,a=e.length+i.length+r.length;if(a!==s)return"";if(e.length===s)return`fn getOutputCoords() -> ${T(s)}{
    let globalIndex = getGlobalIndex();
    return getCoordsFromIndex(globalIndex);
  }
  `;let n="",u=[e,i,r];for(let l=0;l<u.length;l++){let h=u[l];if(h.length!==0)if(h.length===1)n+=`let d${h[0]} = i32(globalId[${l}]);`;else{let m=ur(h,"uniforms.outShape");n+=`var index${l} = i32(globalId[${l}]);`;for(let f=0;f<m.length;f++)n+=`let d${h[f]} = index${l} / ${m[f]};`,f===m.length-1?n+=`let d${h[f+1]} = index${l} - d${h[f]} * ${m[f]};`:n+=`index${l} = index${l} - d${h[f]} * ${m[f]};`}}let p=[];for(let l=0;l<a;l++)p.push(`d${l}`);let d=T(a),c=`fn getOutputCoords() -> ${d} {
  ${n}
`;return p.length===0?c+=`return ${d}(0); }`:c+=`return ${d}(${p.join(",")}); }`,c}function Yn(o){let t="";switch(o){case 0:case 1:t+=`
        fn getOutputIndexFromCoords(coords : i32) -> i32 {
          return coords;
        }
        `;break;case 2:t+=`
        fn getOutputIndexFromCoords(coords : vec2<i32>) -> i32 {
          return dot(coords, vec2<i32>(uniforms.outShapeStrides, 1));
        }
        `;break;case 3:t+=`
        fn getOutputIndexFromCoords(coords : vec3<i32>) -> i32 {
          return dot(coords, vec3<i32>(uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, 1));
        }
        `;break;case 4:t+=`
        fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
          return dot(coords, vec4<i32>(
            uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, uniforms.outShapeStrides.z, 1));
        }
        `;break;case 5:t+=`
        fn getOutputIndexFromCoords(coords : vec5) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u;
        }
        `;break;case 6:t+=`
        fn getOutputIndexFromCoords(coords : vec6) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u * uniforms.outShapeStrides.u +
              coords.v;
        }
        `;break;default:Ye.assert(!1,()=>`Unsupported ${o}D shape`);break}return t}function fr(o){return o.dispatch[1]===1&&o.dispatch[2]===1}function pe(o,t=1){if(o==="float32")return z(t,"f32");if(o==="int32"||o==="bool")return z(t,"i32");throw new Error(`type ${o} is not supported.`)}function jn(o,t,e){let i=o.length,r=pe(t,e),s=`fn setOutputAtIndex(flatIndex : i32, value : ${z(e)}) {
      result[flatIndex] = ${r}(value);
    }

    fn setOutputAtIndexI32(flatIndex : i32, value : ${z(e,"i32")}) {
      result[flatIndex] = ${r}(value);
    }
    `;if(i>=2){let a=["d0","d1","d2","d3","d4","d5"].slice(0,i),n=T(i);s+=`
      fn setOutputAtCoords(${a.map(u=>`${u} : i32`).join(", ")}, value : ${z(e)}) {
        let flatIndex = getOutputIndexFromCoords(${n}(${a.join(", ")}));
        setOutputAtIndex(flatIndex${e===1?"":` / ${e}`}, value);
      }
      fn setOutputAtCoordsI32(${a.map(u=>`${u} : i32`).join(", ")}, value : ${z(e,"i32")}) {
        let flatIndex = getOutputIndexFromCoords(${n}(${a.join(", ")}));
        setOutputAtIndexI32(flatIndex${e===1?"":` / ${e}`}, value);
      }
    `}return s}function Qn(o){let t=/(\w+)\s*:\s*vec(5|6)/g;o=o.replace(t,i=>"@align(16) "+i);let e=/vec(5|6)\s*,\s*(\w+)/g;return o=o.replace(e,(i,r,s)=>`vec${r}, @align(16) ${s}`),o}function lr(o){return!(o.dispatchLayout.hasOwnProperty("y")&&o.dispatchLayout.y.length!==0||o.dispatchLayout.hasOwnProperty("z")&&o.dispatchLayout.z.length!==0)}var $o={};Un($o,{GPUBytesPerElement:()=>je,MatMulProgramType:()=>te,assertNotComplex:()=>Te,computeDispatch:()=>C,computeWorkPerThreadForConv2d:()=>Fe,computeWorkgroupInfoForMatMul:()=>Po,computeWorkgroupSizeForConv2d:()=>Ae,flatDispatchLayout:()=>y,isWebGPUSupported:()=>Le,tilesFitEvenlyIntoShape:()=>eu});import{util as Jn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ce=o=>{let t=1;for(let e=0;e<o.length;e++)t*=o[e];return t};function eu(o,t){if(o.length!==t.length)throw new Error(`Cannot compute whether rank ${o.length} tiles fit evenly into rank ${t.length} shape - ranks must match.`);return t.every((e,i)=>e%o[i]===0)}function C(o,t,e=[1,1,1],i=[1,1,1]){let[r,s,a]=[Math.ceil(ce(o.x.map(n=>t[n]))/(e[0]*i[0])),o.y?Math.ceil(ce(o.y.map(n=>t[n]))/(e[1]*i[1])):1,o.z?Math.ceil(ce(o.z.map(n=>t[n]))/(e[2]*i[2])):1];return[r,s,a]}function Po(o,t,e,i=!1){let r=[8,8,1],s=[4,4,1];return i||(o<=8&&(s[1]=1),t<=16&&e<=16&&(r[0]=4)),{workgroupSize:r,elementsPerThread:s}}function Ae(o,t,e=!1){if(e)return[8,8,1];let i=ce(o.x.map(s=>t[s])),r=ce(o.y.map(s=>t[s]));return i<=4?[4,16,1]:r<=4?[16,4,1]:[16,16,1]}function Fe(o,t,e=!1){if(e)return[4,4,1];let i=ce(o.x.map(s=>t[s])),r=ce(o.y.map(s=>t[s]));return i<=4?[1,2,1]:r<=4?[2,1,1]:[2,2,1]}function y(o){return{x:o.map((t,e)=>e)}}function je(o){if(o==="float32"||o==="int32"||o==="bool"||o==="string")return 4;if(o==="complex64")return 8;throw new Error(`Unknown dtype ${o}`)}function Le(){return!!(typeof globalThis<"u"&&globalThis.navigator&&globalThis.navigator.gpu)}function Te(o,t){Array.isArray(o)||(o=[o]),o.forEach(e=>{e!=null&&Jn.assert(e.dtype!=="complex64",()=>`${t} does not support complex64 tensors in the WebGPU backend.`)})}var te;(function(o){o[o.MatMulReduceProgram=0]="MatMulReduceProgram",o[o.MatMulSplitKProgram=1]="MatMulSplitKProgram",o[o.MatMulSmallOutputSizeProgram=2]="MatMulSmallOutputSizeProgram",o[o.MatMulPackedProgram=3]="MatMulPackedProgram",o[o.MatMulMax=4]="MatMulMax"})(te||(te={}));var ru=he().getNumber("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD"),iu=(o,t)=>{let e=o.limits.maxComputeWorkgroupsPerDimension,i=t.dispatchLayout,r=t.dispatch;if(r.every(a=>a<=e))return r;U.assert(r[0]>e&&i.y===void 0&&i.z===void 0,()=>"Dispatch size exceeds WebGPU limits in Y or Z dimension.");let s=Math.ceil(Math.sqrt(r[0]));return s>e?(s=Math.ceil(Math.cbrt(r[0])),U.assert(s<=e,()=>"Total dispatch size exceeds WebGPU maximum."),[s,s,s]):[s,s,1]},Se=class o extends ou{nextDataId(){return o.nextDataId++}constructor(t,e){if(super(),this.commandQueueOwnedIds=new WeakSet,this.dispatchCountInPass=0,this.disposed=!1,this.downloadWaitMs=0,this.tensorDataPendingDisposal=[],this.queryResolveBuffer=null,this.querySet=null,this.querySetCount=2,this.stagingPendingDisposal=[],this.uniformPendingDisposal=[],this.uploadWaitMs=0,this.hasReadSyncWarned=!1,this.hasTimestampQueryWarned=!1,!Le())throw new Error("WebGPU is not supported on this device");this.pipelineCache={},this.device=t,this.queue=t.queue,this.commandEncoder=null,this.computePassEncoder=null,this.adapterInfo=new Ke(e),this.supportTimestampQuery=this.device.features.has("timestamp-query"),this.thresholdToIncreaseWorkgroups=this.adapterInfo.intelGPUGeneration>=12?16:8,this.bufferManager=new Xe(this.device),this.textureManager=new qe(this.device),this.tensorMap=new tu(this,No()),he().getBool("WEBGPU_USE_PROFILE_TOOL")&&(this.dummyCanvas=document.createElement("canvas"),this.dummyCanvas.width=1,this.dummyCanvas.height=1,this.dummyContext=this.dummyCanvas.getContext("webgpu"),this.dummyContext.configure({device:t,format:"bgra8unorm"}),document.body.appendChild(this.dummyCanvas))}floatPrecision(){return 32}disposeData(t,e=!1){if(!this.tensorMap.has(t))return!0;let i=this.tensorMap.get(t);return e?i.refCount=0:i.refCount--,i.refCount>0?!1:(i.complexTensorInfos!=null&&(this.disposeData(i.complexTensorInfos.real.dataId),this.disposeData(i.complexTensorInfos.imag.dataId)),this.commandQueueOwnedIds.has(t)?(this.tensorDataPendingDisposal.push(t),!0):(this.releaseResource(t),this.tensorMap.delete(t),!0))}memory(){return{numBytesInGPU:this.bufferManager.numBytesUsed,numBytesAllocatedInGPU:this.bufferManager.numBytesAllocated,unreliable:!1}}releaseResource(t){let e=this.tensorMap.get(t);if(!(!e||!e.resource)){if(e.external){e.resource=null;return}e.resource instanceof GPUBuffer?this.bufferManager.releaseBuffer(e.resource):e.resource instanceof GPUTexture&&this.textureManager.releaseTexture(e.resource),e.resource=null}}refCount(t){return this.tensorMap.has(t)?this.tensorMap.get(t).refCount:0}incRef(t){let e=this.tensorMap.get(t);e.refCount++}decRef(t){if(this.tensorMap.has(t)){let e=this.tensorMap.get(t);e.refCount--}}write(t,e,i){if(i==="complex64"&&t!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let r={id:this.nextDataId()};return this.tensorMap.set(r,{dtype:i,shape:e,values:t,refCount:1}),r}move(t,e,i,r,s){if(r==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.tensorMap.set(t,{dtype:r,shape:i,values:e,refCount:s})}submitQueue(){this.queue.submit([this.commandEncoder.finish()]),this.commandEncoder=null,this.dispatchCountInPass=0,this.commandQueueOwnedIds=new WeakSet,this.tensorDataPendingDisposal.forEach(t=>{this.releaseResource(t),this.tensorMap.delete(t)}),this.uniformPendingDisposal.forEach(t=>this.bufferManager.releaseBuffer(t)),this.stagingPendingDisposal.forEach(t=>this.bufferManager.releaseBuffer(t,!1)),this.tensorDataPendingDisposal=[],this.uniformPendingDisposal=[],this.stagingPendingDisposal=[]}ensureCommandEncoderReady(){this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder())}endComputePassEncoder(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}async checkCompileCompletionAsync(){let t;try{t=await Promise.all(Object.values(this.pipelineCache))}catch(e){throw new Error(e.message)}Object.keys(this.pipelineCache).map((e,i)=>{this.pipelineCache[e]=t[i]})}async getBufferData(t){if(he().getBool("WEBGPU_ENGINE_COMPILE_ONLY"))return console.warn("The data may be invalid since WEBGPU_ENGINE_COMPILE_ONLY is true, this can only be called when WEBGPU_ENGINE_COMPILE_ONLY is false"),null;let e=t.size,i=this.bufferManager.acquireBuffer(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(t,0,i,0,e),this.submitQueue(),await i.mapAsync(GPUMapMode.READ);let r=i.getMappedRange().slice(0);return i.unmap(),i!=null&&this.bufferManager.releaseBuffer(i),he().getBool("WEBGPU_USE_PROFILE_TOOL")&&(U.assert(this.dummyContext!==void 0,()=>"Fail to get context for profiling tool"),this.dummyContext.getCurrentTexture()),r}convertAndCacheOnCPU(t,e){let i=this.tensorMap.get(t);return i.values=e,i.values}readSync(t){let e=this.tensorMap.get(t),{values:i,complexTensorInfos:r}=e;if(i!=null||e.dtype==="string")return i;if(e.dtype==="complex64"){let f=this.readSync(r.real.dataId),g=this.readSync(r.imag.dataId),w=U.convertBackendValuesAndArrayBuffer(gr.mergeRealAndImagArrays(f,g).buffer,"float32");return this.convertAndCacheOnCPU(t,w),w}this.hasReadSyncWarned||(this.hasReadSyncWarned=!0,console.warn("The performance of synchronously reading data from GPU to CPU is poor on the webgpu backend, please use asynchronous APIs instead."));let s=["opaque","premultiplied"],a=e.resource,n=a.size;U.assert(n%4===0,()=>"Because there is 4 bytes for one pixel, buffer size must be multiple of 4.");let u=n/4,p=new ArrayBuffer(n),d=256,c=256,l=s.map(f=>new OffscreenCanvas(d,c)),h=new OffscreenCanvas(d,c);this.endComputePassEncoder(),l.map((f,g)=>{let w=f.getContext("webgpu");return w.configure({device:this.device,format:"bgra8unorm",usage:GPUTextureUsage.COPY_DST,alphaMode:s[g]}),w.getCurrentTexture()}).map((f,g)=>{let w=d*4,b=(L,F,W)=>{this.ensureCommandEncoderReady(),this.commandEncoder.copyBufferToTexture({buffer:a,bytesPerRow:w,offset:W},{texture:f},{width:L,height:F}),this.submitQueue();let E=h.getContext("2d",{willReadFrequently:!0});E.clearRect(0,0,L,F),E.drawImage(l[g],0,0);let X=E.getImageData(0,0,L,F).data,H=s[g],M=new Uint8ClampedArray(p,W,L*F*4);for(let O=0;O<M.length;O+=4)if(H==="premultiplied")M[O+3]=X[O+3];else{let G=X[O];M[O]=X[O+2],M[O+1]=X[O+1],M[O+2]=G}},v=Math.floor(u/(d*c)),k=d,R=c,$=0;for(let L=0;L<v;L++)b(k,R,$),$+=d*c*4;let N=u%(d*c);R=Math.floor(N/d),R>0&&(b(k,R,$),$+=R*(d*4)),k=N%d,k>0&&b(k,1,$)});let m=U.convertBackendValuesAndArrayBuffer(p,e.dtype);return this.convertAndCacheOnCPU(t,m),m}async read(t){if(!this.tensorMap.has(t))throw new Error(`Tensor ${t} was not registered!`);let e=this.tensorMap.get(t),{values:i}=e;if(i!=null)return i;let r;if(e.dtype==="complex64"){let s=await Promise.all([this.read(e.complexTensorInfos.real.dataId),this.read(e.complexTensorInfos.imag.dataId)]),a=s[0],n=s[1];r=gr.mergeRealAndImagArrays(a,n)}else{let s=await this.getBufferData(e.resource);r=U.convertBackendValuesAndArrayBuffer(s,e.dtype)}return this.convertAndCacheOnCPU(t,r),r}copyBuffer(t){let e=t.size,i=t.usage,r=this.bufferManager.acquireBuffer(e,i);return this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(t,0,r,0,e),this.submitQueue(),r}createTensorFromGPUData(t,e,i){let r=t.buffer;if(i==="complex64")throw new Error("Cannot write to a complex64 dtype. ");let s={id:this.nextDataId()};this.tensorMap.set(s,{dtype:i,shape:e,values:null,refCount:1,external:t.zeroCopy});let a=this.tensorMap.get(s),n=je(a.dtype)*U.sizeFromShape(a.shape);if(t.buffer.size<n)throw new Error(`GPUBuffer size(${t.buffer.size}) is smaller than tensor size(${n})!`);if((t.buffer.usage&(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))!==(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))throw new Error("GPUBuffer.usage should include GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC!");return t.zeroCopy!==!0&&(r=this.copyBuffer(r)),a.resource=r,No().makeTensorFromDataId(s,e,i,this)}readToGPU(t){let e=this.tensorMap.get(t),{values:i,dtype:r,shape:s,resource:a}=e;if(r==="complex64")throw new Error("Does not support reading buffer for complex64 dtype.");if(a==null)throw i!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");let n=a,u=n.size,p=n.usage,d=this.bufferManager.acquireBuffer(u,p);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(a,0,d,0,u),this.submitQueue();let c=this.makeTensorInfo(s,r),l=No().makeTensorFromTensorInfo(c),h=this.tensorMap.get(c.dataId);return h.resource=d,{tensorRef:l,buffer:d}}bufferSync(t){let e=this.readSync(t.dataId);if(t.dtype==="string")try{let i=e.map(r=>U.decodeString(r));return xr(t.shape,t.dtype,i)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return xr(t.shape,t.dtype,e)}async time(t){!this.supportTimestampQuery&&!this.hasTimestampQueryWarned&&(console.warn("This device doesn't support timestamp-query extension. Start Chrome browser with flag --enable-dawn-features=allow_unsafe_apis to try it again. Otherwise, zero will be shown for the kernel time when profiling mode is enabled."),this.hasTimestampQueryWarned=!0);let e=this.activeTimers,i=[],r=!1;this.programTimersStack==null?(this.programTimersStack=i,r=!0):this.activeTimers.push(i),this.activeTimers=i,t();let s=U.flatten(this.activeTimers.map(p=>p.query)).filter(p=>p!=null),a=U.flatten(this.activeTimers.map(p=>p.name)).filter(p=>p!=null);this.activeTimers=e,r&&(this.programTimersStack=null);let n={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},u=await Promise.all(s);return n.kernelMs=U.sum(u),n.getExtraProfileInfo=()=>u.map((p,d)=>({name:a[d],ms:p})).map(p=>`${p.name}: ${p.ms}`).join(", "),this.uploadWaitMs=0,this.downloadWaitMs=0,n}makeTensorInfo(t,e,i){return e==="string"&&i!=null&&i.length>0&&U.isString(i[0])&&(i=i.map(s=>U.encodeString(s))),{dataId:this.write(i,t,e),shape:t,dtype:e}}tensorToBinding(t){if(!t)return null;let i=this.tensorMap.get(t.dataId).resource;return i instanceof GPUBuffer?{buffer:i}:i instanceof GPUTexture?i.createView():i}uploadToGPU(t){let e=this.tensorMap.get(t);if(e.resource!=null)return;let i=je(e.dtype)*U.sizeFromShape(e.shape),r,s=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(e.values){if(r=this.bufferManager.acquireBuffer(i,s,!0),r.mapState==="unmapped"){let a=this.bufferManager.acquireBuffer(i,GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,!0,!1),n=a.getMappedRange();e.dtype==="int32"||e.dtype==="bool"?new Int32Array(n).set(e.values):new Float32Array(n).set(e.values),a.unmap(),this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(a,0,r,0,i),this.stagingPendingDisposal.push(a)}else{let a=r.getMappedRange();e.dtype==="int32"||e.dtype==="bool"?new Int32Array(a).set(e.values):new Float32Array(a).set(e.values),r.unmap()}e.values=null}else r=this.bufferManager.acquireBuffer(i,s);e.resource=r}makeUniforms(t){let e=0,i=0,r=[],s=1;t.forEach(u=>{u.data.length===0&&(u.data=[1]);let p;switch(u.data.length){case 1:p=4;break;case 2:p=8;break;case 3:p=16;break;case 4:p=16;break;case 5:p=16;break;case 6:p=16;break;default:U.assert(!1,()=>`Unsupported ${u.data.length}D shape`)}(i===5||i===6)&&(p=16),p>s&&(s=p),e=Math.ceil(e/p)*p,i=u.data.length,r.push(e),e+=u.data.length*4}),e=Math.ceil(e/s)*s;let a=new ArrayBuffer(e);t.forEach((u,p)=>{let d=r[p];u.type==="int32"?new Int32Array(a,d,u.data.length).set(u.data):u.type==="uint32"?new Uint32Array(a,d,u.data.length).set(u.data):new Float32Array(a,d,u.data.length).set(u.data)});let n=this.bufferManager.acquireBuffer(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);return this.queue.writeBuffer(n,0,a,0,e),this.uniformPendingDisposal.push(n),{offset:0,size:e,buffer:n}}runWebGPUProgram(t,e,i,r,s){if(s||(s=this.makeTensorInfo(t.outputShape,i)),U.sizeFromShape(s.shape)===0)return this.tensorMap.get(s.dataId).values=U.getTypedArrayFromDType(s.dtype,0),s;this.uploadToGPU(s.dataId),t.dispatch=iu(this.device,t);let a=e.map((u,p)=>{if(u.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");return this.uploadToGPU(u.dataId),{dtype:this.tensorMap.get(u.dataId).dtype,shape:u.shape,name:t.variableNames[p]}});t.shaderKey=mr(t,a,s);let n=he().getBool("WEBGPU_ENGINE_COMPILE_ONLY");return t.shaderKey in this.pipelineCache||(this.pipelineCache[t.shaderKey]=hr(this.device,t,a,s,n)),t.pipeline=this.pipelineCache[t.shaderKey],n||this.recordAndSubmit(t,s,e,r),s}recordAndSubmit(t,e,i,r){if(t.pipeline instanceof Promise)throw new Error("Please call checkCompileCompletionAsync to ensure parallel compilation is done!");let s=[],a=[],n="int32";if(t.pixelsOpType==null){s.push({type:"float32",data:[NaN]},{type:"float32",data:[1/0]}),a=i.concat(e).map(h=>h.shape);let l="int32";a.map(h=>{s.push({type:l,data:h});let m=U.computeStrides(h);s.push({type:l,data:m})})}else{let l=U.computeStrides(e.shape);s.push({type:n,data:l})}if(t.size){let l=U.sizeFromShape(t.outputShape);s.push({type:n,data:[t.outputComponent?l/t.outputComponent:l]})}r&&(s=[...s,...r]);let u=[this.tensorToBinding(e),...i.map(l=>this.tensorToBinding(l)),this.makeUniforms(s)];i.forEach(l=>{this.commandQueueOwnedIds.add(l.dataId)}),this.commandQueueOwnedIds.add(e.dataId);let p=this.device.createBindGroup({layout:t.pipeline.getBindGroupLayout(0),entries:u.map((l,h)=>({binding:h,resource:l}))}),d=this.activeTimers!=null;this.ensureCommandEncoderReady();let c={};d&&this.supportTimestampQuery?(this.endComputePassEncoder(),this.querySet==null&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.querySetCount})),c.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},this.computePassEncoder=this.commandEncoder.beginComputePass(c)):this.computePassEncoder||(this.computePassEncoder=this.commandEncoder.beginComputePass(c)),this.computePassEncoder.setPipeline(t.pipeline),this.computePassEncoder.setBindGroup(0,p),this.computePassEncoder.dispatchWorkgroups(t.dispatch[0],t.dispatch[1],t.dispatch[2]),this.dispatchCountInPass++,(d||he().get("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE")<=this.dispatchCountInPass||t.pixelsOpType===se.DRAW)&&(this.endComputePassEncoder(),d?this.activeTimers.push({name:t.constructor.name,query:this.getQueryTime()}):this.submitQueue())}async getQueryTime(){if(!this.supportTimestampQuery)return 0;this.queryResolveBuffer==null&&(this.queryResolveBuffer=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|GPUBufferUsage.QUERY_RESOLVE)),this.commandEncoder.resolveQuerySet(this.querySet,0,this.querySetCount,this.queryResolveBuffer,0);let t=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,t,0,this.querySetCount*8),this.submitQueue(),await t.mapAsync(GPUMapMode.READ);let e=new BigUint64Array(t.getMappedRange()),i=Number(e[1]-e[0])/1e6;return t.unmap(),this.bufferManager.releaseBuffer(t),i}shouldExecuteOnCPU(t,e=ru){return he().getBool("WEBGPU_CPU_FORWARD")&&t.every(i=>this.tensorMap.get(i.dataId).resource==null&&U.sizeFromShape(i.shape)<e)}numDataIds(){return this.tensorMap.numDataIds()-this.tensorDataPendingDisposal.length}dispose(){this.disposed||(this.querySet!=null&&this.querySet.destroy(),this.bufferManager.dispose(),this.textureManager.dispose(),this.disposed=!0)}};Se.nextDataId=0;Le()&&au("webgpu",async()=>{let o={powerPreference:su().get("WEBGPU_USE_LOW_POWER_GPU")?"low-power":"high-performance"},t=await navigator.gpu.requestAdapter(o),e={},i=[];t.features.has("timestamp-query")&&i.push("timestamp-query"),t.features.has("bgra8unorm-storage")&&i.push(["bgra8unorm-storage"]),e.requiredFeatures=i;let r=t.limits;e.requiredLimits={maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxBufferSize:r.maxBufferSize,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup};let s=await t.requestDevice(e),a=await t.requestAdapterInfo();return new Se(s,a)},3);import{registerKernel as Tg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{_FusedMatMul as Ep}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{broadcast_util as Bp,env as wr,util as Fo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Ze}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var D;(function(o){o[o.ADD=0]="ADD",o[o.ATAN2=1]="ATAN2",o[o.COMPLEX_MULTIPLY_IMAG=2]="COMPLEX_MULTIPLY_IMAG",o[o.COMPLEX_MULTIPLY_REAL=3]="COMPLEX_MULTIPLY_REAL",o[o.DIV=4]="DIV",o[o.ELU_DER=5]="ELU_DER",o[o.EQUAL=6]="EQUAL",o[o.FLOOR_DIV=7]="FLOOR_DIV",o[o.GREATER=8]="GREATER",o[o.GREATER_EQUAL=9]="GREATER_EQUAL",o[o.LESS=10]="LESS",o[o.LESS_EQUAL=11]="LESS_EQUAL",o[o.LOGICAL_AND=12]="LOGICAL_AND",o[o.LOGICAL_OR=13]="LOGICAL_OR",o[o.MAX=14]="MAX",o[o.MIN=15]="MIN",o[o.MOD=16]="MOD",o[o.MUL=17]="MUL",o[o.NOT_EQUAL=18]="NOT_EQUAL",o[o.POW=19]="POW",o[o.PRELU=20]="PRELU",o[o.SQUARED_DIFFERENCE=21]="SQUARED_DIFFERENCE",o[o.SUB=22]="SUB"})(D||(D={}));var nu="let resultTemp = a + b;",uu="let resultTemp = atan2(a, b);",pu="let resultTemp = areal * breal - aimag * bimag;",du="let resultTemp = areal * bimag + aimag * breal;",lu="let resultTemp = a / b;",cu="let resultTemp = select(a * (b + 1.0), a, b >= b - b);",hu=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a == b);
`,mu=`
  let remainder =
      select(a % b, round(a % b), (round(a) == a) & (round(b) == b));
  let quotient = (a - remainder) / b;
  let resultTemp =
      round(select(quotient, quotient - 1, sign(remainder) == -sign(b)));
`,fu=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a > b);
`,gu=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a >= b);
`,xu=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a < b);
`,Cu=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a <= b);
`,yu="return f32(a >= 1.0 && b >= 1.0);",Su=`return (vec4<f32>(a >= vec4<f32>(1.0)) *
  vec4<f32>(b >= vec4<f32>(1.0)));`,wu="return f32(a >= 1.0 || b >= 1.0);",bu=`return min(vec4<f32>(a >= vec4<f32>(1.0)) +
  vec4<f32>(b >= vec4<f32>(1.0)), vec4<f32>(1.0));`,vu="let resultTemp = max(a, b);",Iu="let resultTemp = min(a, b);",ku=`
  let isNaN = b == 0.;
  var resultTemp = a % b;
  resultTemp = select((resultTemp + b) % b, resultTemp,
      (a < 0. && b < 0.) || (a >= 0. && b > 0.));
`,Ru=`
  let isNaN = !vec4<bool>(b);
  var resultTemp = vec4<f32>(a % b);
  if (!((a[0] < 0. && b[0] < 0.) || (a[0] >= 0. && b[0] > 0.))) {
    resultTemp[0] = (resultTemp[0] + b[0]) % b[0];
  }
  if (!((a[1] < 0. && b[1] < 0.) || (a[1] >= 0. && b[1] > 0.))) {
    resultTemp[1] = (resultTemp[1] + b[1]) % b[1];
  }
  if (!((a[2] < 0. && b[2] < 0.) || (a[2] >= 0. && b[2] > 0.))) {
    resultTemp[2] = (resultTemp[2] + b[2]) % b[2];
  }
  if (!((a[3] < 0. && b[3] < 0.) || (a[3] >= 0. && b[3] > 0.))) {
    resultTemp[3] = (resultTemp[3] + b[3]) % b[3];
  }
`,Du="let resultTemp = a * b;",Pu=`
  var resultTemp = f32(a != b);
  let valueForNaN = 1.0;
`,$u=`
  var resultTemp = vec4<f32>(a != b);
  let valueForNaN = 1.0;
`,Nu=`
  let isNaN = a < 0.0 && floor(b) < b;
  if (b == 0.0) {
    return 1.0;
  }
  var resultTemp = select(sign(a) * pow(abs(a), b), pow(abs(a), b),
      round(abs(b) % 2.0) != 1.0);
`,zu=`
  let isModRound1Bool = vec4<i32>(round(abs(b) % vec4<f32>(2.0))) == vec4<i32>(1);
  let isModRound1 = vec4<f32>(isModRound1Bool);
  let multiplier = sign(a) * isModRound1 + (vec4<f32>(1.0) - isModRound1);
  var resultTemp = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  let isExpZero = b == vec4<f32>(0.0);
  if (isExpZero.r) {
    resultTemp.r = 1.0;
  }
  if (isExpZero.g) {
    resultTemp.g = 1.0;
  }
  if (isExpZero.b) {
    resultTemp.b = 1.0;
  }
  if (isExpZero.a) {
    resultTemp.a = 1.0;
  }
  let isNaN = (a < vec4<f32>(0.0)) & (floor(b) < b);
`,Au="if (a < 0.0) { return b * a; }  return a;",Fu=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (b * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,Lu="let resultTemp = (a - b) * (a - b);",Tu="let resultTemp = a - b;";function we(o,t){let e;do{switch(o){case D.ATAN2:e=uu;break;case D.MAX:e=vu;break;case D.MIN:e=Iu;break;case D.MOD:e=t?Ru:ku;break;case D.NOT_EQUAL:e=t?$u:Pu;break;case D.POW:e=t?zu:Nu;break;default:continue}let i,r,s;return t?(i="isnanVec4",r="vec4<f32>",s="vec4<bool>"):(i="isnan",r="f32",s="bool"),`
      let aIsNaN = ${i}(a);
      let aPostLegalization = select(a, ${r}(42), aIsNaN);
      let bIsNaN = ${i}(b);
      let bPostLegalization = select(b, ${r}(42), bIsNaN);
      let isNaN = false;
      let valueForNaN = uniforms.NAN;
      {
        let a = aPostLegalization;
        let b = bPostLegalization;
        ${e}
        return select(
            resultTemp, ${r}(valueForNaN),
            ${s}(isNaN) | aIsNaN | bIsNaN);
      }
    `}while(!1);switch(o){case D.ADD:e=nu;break;case D.COMPLEX_MULTIPLY_IMAG:e=du;break;case D.COMPLEX_MULTIPLY_REAL:e=pu;break;case D.DIV:e=lu;break;case D.ELU_DER:e=cu;break;case D.EQUAL:e=hu;break;case D.FLOOR_DIV:e=mu;break;case D.GREATER:e=fu;break;case D.GREATER_EQUAL:e=gu;break;case D.LESS:e=xu;break;case D.LESS_EQUAL:e=Cu;break;case D.LOGICAL_AND:return t?Su:yu;case D.LOGICAL_OR:return t?bu:wu;case D.MUL:e=Du;break;case D.PRELU:return t?Fu:Au;case D.SQUARED_DIFFERENCE:e=Lu;break;case D.SUB:e=Tu;break;default:}return`
    ${e}
    return resultTemp;
  `}import{backend_util as de}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var S;(function(o){o[o.ABS=0]="ABS",o[o.ACOS=1]="ACOS",o[o.ACOSH=2]="ACOSH",o[o.ASIN=3]="ASIN",o[o.ASINH=4]="ASINH",o[o.ATAN=5]="ATAN",o[o.ATANH=6]="ATANH",o[o.CEIL=7]="CEIL",o[o.COS=8]="COS",o[o.COSH=9]="COSH",o[o.ELU=10]="ELU",o[o.ERF=11]="ERF",o[o.EXP=12]="EXP",o[o.EXPM1=13]="EXPM1",o[o.FLOOR=14]="FLOOR",o[o.IS_FINITE=15]="IS_FINITE",o[o.IS_INF=16]="IS_INF",o[o.IS_NAN=17]="IS_NAN",o[o.LINEAR=18]="LINEAR",o[o.LOG=19]="LOG",o[o.LOG1P=20]="LOG1P",o[o.LOGICAL_NOT=21]="LOGICAL_NOT",o[o.NEG=22]="NEG",o[o.RELU=23]="RELU",o[o.RELU6=24]="RELU6",o[o.LEAKYRELU=25]="LEAKYRELU",o[o.RECIPROCAL=26]="RECIPROCAL",o[o.ROUND=27]="ROUND",o[o.RSQRT=28]="RSQRT",o[o.SELU=29]="SELU",o[o.SIGMOID=30]="SIGMOID",o[o.SIGN=31]="SIGN",o[o.SIN=32]="SIN",o[o.SINH=33]="SINH",o[o.SOFTPLUS=34]="SOFTPLUS",o[o.SQRT=35]="SQRT",o[o.SQUARE=36]="SQUARE",o[o.STEP=37]="STEP",o[o.TAN=38]="TAN",o[o.TANH=39]="TANH",o[o.TO_INT=40]="TO_INT"})(S||(S={}));var _u="return abs(a);",Bu=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return acos(a);
`,Eu=`
  if (a < 1.) {
    return uniforms.NAN;
  }
  return acosh(a);
`,Uu=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return asin(a);
`,Wu="return asinh(a);",Mu=`
  if (isnan(a)) {
    return uniforms.NAN;
  }
  return atan(a);
`,Ou=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  if (a == 1.) {
    return uniforms.INFINITY;
  }
  if (a == -1.) {
    return -uniforms.INFINITY;
  }
  return atanh(a);
`,Vu="return ceil(a);",Hu="return cos(a);",Gu=`
  let e2x = exp(-a);
  return (e2x + 1.0 / e2x) / 2.0;
`,Ku="return exp(a) - 1.0;",Xu="if (a >= 0.0) { return a; }  return (exp(a) - 1.0);",qu=`
  var resFloat = exp(a) - vec4<f32>(1.0);
  if (a.r >= 0.0) {
    resFloat.r = a.r;
  }
  if (a.g >= 0.0) {
    resFloat.g = a.g;
  }
  if (a.b >= 0.0) {
    resFloat.b = a.b;
  }
  if (a.a >= 0.0) {
    resFloat.a = a.a;
  }
  return resFloat;
`,Yu=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  let p = ${de.ERF_P};
  let a1 = ${de.ERF_A1};
  let a2 = ${de.ERF_A2};
  let a3 = ${de.ERF_A3};
  let a4 = ${de.ERF_A4};
  let a5 = ${de.ERF_A5};

  let sign = sign(a);
  let absA = abs(a);
  let t = 1.0 / (1.0 + p * absA);
  return sign * (1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-absA * absA));
`,ju="return exp(a);",Qu="return floor(a);",Zu="return f32(!isnan(a) && !isinf(a));",Ju="return f32(isinf(a));",ep="return f32(isnan(a));",tp="return a;",op=`if (a < 0.0) { return uniforms.NAN; }
  return log(a);`,rp=`
  if (isnan(a)) { return a; }
  return log(1.0 + a);
`,ip="return f32(!(a >= 1.0));",sp="return -a;",ap="if (a < 0.0) { return uniforms.alpha * a; } return a;",np=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (uniforms.alpha * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,up="return 1.0 / a;",pp="return select(a, 0.0, a < 0.0);",dp="return clamp(a, 0.0, 6.0);",lp="return clamp(a, vec4<f32>(0.0, 0.0, 0.0, 0.0), vec4<f32>(6.0, 6.0, 6.0, 6.0));",cp=`
  return select(a, vec4<f32>(0.0), a < vec4<f32>(0.0));
`,hp="return round(a);",mp="return inverseSqrt(a);",fp=`
  if (a >= 0.0) {
    return ${de.SELU_SCALE} * a;
  } else {
    return ${de.SELU_SCALEALPHA} * (exp(a) - 1.0);
  }
`,gp="return 1.0 / (1.0 + exp(-1.0 * a));",xp="return sign(a);",Cp="return sin(a);",yp=`
  let e2x = exp(a);
  return (e2x - 1.0 / e2x) / 2.0;
`,Sp=`
  let epsilon = 1.1920928955078125e-7;
  let threshold = log(epsilon) + 2.0;

  let too_large = a > -threshold;
  let too_small = a < threshold;
  let exp_a = exp(a);

  if (too_large) {
    return a;
  } else if (too_small) {
    return exp_a;
  } else {
    return log(exp_a + 1.0);
  }
`,wp="return sqrt(a);",bp="return a * a;",vp=`
  if (isnan(a)) {
    return a;
  }

  return select(uniforms.stepAlpha, 1.0, a > 0.0);
`,Ip="return tan(a);",kp=`
  let e2x = exp(-2.0 * abs(a));
  return sign(a) * (1.0 - e2x) / (1.0 + e2x);
`,Rp="return f32(i32((a)));";function ae(o,t){switch(o){case S.ABS:return _u;case S.ACOS:return Bu;case S.ACOSH:return Eu;case S.ASIN:return Uu;case S.ASINH:return Wu;case S.ATAN:return Mu;case S.ATANH:return Ou;case S.COS:return Hu;case S.COSH:return Gu;case S.CEIL:return Vu;case S.ELU:return t?qu:Xu;case S.ERF:return Yu;case S.EXP:return ju;case S.EXPM1:return Ku;case S.FLOOR:return Qu;case S.IS_FINITE:return Zu;case S.IS_INF:return Ju;case S.IS_NAN:return ep;case S.LINEAR:return tp;case S.LOG:return op;case S.LOG1P:return rp;case S.LOGICAL_NOT:return ip;case S.NEG:return sp;case S.LEAKYRELU:return t?np:ap;case S.RECIPROCAL:return up;case S.RELU:return t?cp:pp;case S.RELU6:return t?lp:dp;case S.ROUND:return hp;case S.RSQRT:return mp;case S.SELU:return fp;case S.SIGMOID:return gp;case S.SIGN:return xp;case S.SIN:return Cp;case S.SINH:return yp;case S.SOFTPLUS:return Sp;case S.SQRT:return wp;case S.SQUARE:return bp;case S.STEP:return vp;case S.TAN:return Ip;case S.TANH:return kp;case S.TO_INT:return Rp;default:throw new Error(`BinaryType ${o} is not implemented!`)}}function V(o,t=!1,e=!1,i=3){if(o===null)return"";let r="";if(o==="linear")r=ae(S.LINEAR);else if(o==="relu")r=ae(S.RELU,e);else if(o==="elu")r=ae(S.ELU,e);else if(o==="relu6")r=ae(S.RELU6,e);else if(o==="prelu")r=we(D.PRELU,e);else if(o==="sigmoid")r=ae(S.SIGMOID,e);else if(o==="leakyrelu")r=ae(S.LEAKYRELU,e);else throw new Error(`Activation ${o} has not been implemented for the WebGPU backend.`);let a=z(e?4:1),n="";return t?n=`
      fn activation(a : ${a}, coords : vec${i}<i32>) -> ${a} {
        let b = getPreluActivationWeightsByOutputCoords(coords);
        ${r}
      }`:n=`
      fn activation(a : ${a}, coords : vec${i}<i32>) -> ${a} {
        ${r}
      }`,n}function Y(o,t){return`
      ${o?"value = value + getBiasByOutputCoords(coords);":""}
      ${t?"value = activation(value, coords);":""}
      `}function zo(o,t,e=!1,i=!1,r=!1,s=1){Ze.assert(o&&s===1||!o,()=>`transposeA ${o} is not compatible with component size ${s}`);let a=`
      ${o?"value = getA(batch, col, row);":"value = getA(batch, row, col);"}

    `,n=t?"value = getB(batch, col, row);":"value = getB(batch, row, col);";return`
  fn mm_readA(batch: i32, row: i32, col: i32) -> ${z(s)} {
    var value = ${z(s)}(0.0);
    ${e&&r?a:`
    ${o?"if(row < uniforms.dimAOuter && col < uniforms.dimInner)":"if(row < uniforms.aShape[1] && col < uniforms.aShape[2])"}
    {
      ${a}
    }
    `}
    return value;
  }

  fn mm_readB(batch: i32, row: i32, col: i32) -> ${z(s)} {
    var value = ${z(s)}(0.0);
    ${n}
    return value;
  }
  `}function _e(o,t,e,i,r=!1,s=!1,a=!1,n=1){return`
  ${zo(e,i,r,s,a,n)}
  fn mm_write(batch: i32, row: i32, col: i32, valueIn: ${z(n)}) {
    ${r&&s?"":"if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)"}
    {
      var value = valueIn;
      let coords = vec3<i32>(batch, row, col);
      ${Y(o,t)}
      setOutputAtCoords(coords[0], coords[1], coords[2], value);
    }
  }
  `}var Dp=(o,t)=>o?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol * ${t});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRow + innerRow,
          kStart + inputCol * ${t});
        `,Pp=(o,t,e,i)=>{if(o)return`
      for (var k = 0; k < ${i}; k++) {
        let BCached0 = mm_Bsub[k][tileCol];
        let ACached0 = mm_Asub[k][localRow];
        for (var i = 0; i < ${e}; i++) {
          acc[i] = fma(BCached0, vec4<f32>(ACached0[i]), acc[i]);
        }
      }`;{let r="",s="";for(let a=0;a<t;a++)r+=`let BCached${a} = mm_Bsub[k * ${t} + ${a}][tileCol];`,s+=`acc[i] = fma(BCached${a}, vec4<f32>(ACached[${a}]), acc[i]);`;return`
      for (var k = 0; k < ${i/t}; k++) {
        ${r}
        for (var i = 0; i < ${e}; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          ${s}
        }
      }`}};function me(o,t,e=!1,i=32,r=!1,s=32,a=!1){let n=t[1]*o[1],u=t[0]*o[0],p=e?n:i,d=e?i:n,c=p/t[0],l=i/t[1],h=o[1],m=o[0];return Ze.assert((e&&c===4&&o[1]===4||!e&&(c===3||c===4))&&p%t[0]===0&&i%t[1]===0&&o[0]===4,()=>`If transposeA ${e} is true, innerElementSize ${c} and workPerThread[1] ${o[1]} must be 4.
          Otherwise, innerElementSize ${c} must be 3 or 4.
      tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${o[0]} must be 4.`),`
  var<workgroup> mm_Asub : array<array<vec${c}<f32>, ${p/c}>, ${d}>;
  var<workgroup> mm_Bsub : array<array<vec4<f32>, ${u/o[0]}>, ${i}>;

  ${x()} {
    let localRow = i32(localId.y);
    let tileRow = localRow * ${h};
    let tileCol = i32(localId.x);

    let globalRow = i32(globalId.y) * ${h};
    let globalCol = i32(globalId.x) * ${m};
    let batch = ${r?"0":"i32(globalId.z)"};
    let batchA = ${r||!a?"batch":"batch % uniforms.aShape[0]"};
    let batchB = ${r||!a?"batch":"batch % uniforms.bShape[0]"};
    let globalRowStart = i32(workgroupId.y) * ${n};

    let numTiles = ${r?`${Math.ceil(s/i)}`:`(uniforms.dimInner - 1) / ${i} + 1`};
    var kStart = ${r?`i32(globalId.z) * ${s}`:"0"};

    var acc: array<vec4<f32>, ${h}>;

    // Loop over shared dimension.
    let tileRowB = localRow * ${l};
    for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var innerRow = 0; innerRow < ${h}; innerRow++) {
            let inputRow = tileRow + innerRow;
            let inputCol = tileCol;
            ${Dp(e,c)}
        }

        // Load one tile of B into local memory.
        for (var innerRow = 0; innerRow < ${l}; innerRow++) {
            let inputRow = tileRowB + innerRow;
            let inputCol = tileCol;
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB, kStart + inputRow, globalCol);
        }
        kStart = kStart + ${i};
        workgroupBarrier();

        // Compute acc values for a single thread.
        ${Pp(e,c,h,i)}
        workgroupBarrier();
    }

    for (var innerRow = 0; innerRow < ${h}; innerRow++) {
        mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
    }
  }`}var Cr=o=>o?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol);
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRowStart + inputRow,
          kStart + inputCol);
        `,$p=o=>o?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];";function fe(o,t,e=!1,i=32,r=!1,s=32,a=!1,n=!1){let u=o[1]*t[1],p=o[0]*t[0],d=e?u:i,c=e?i:u;Ze.assert(c%t[1]===0&&d%t[0]===0&&i%t[1]===0,()=>`tileAHight ${c} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let l=c/t[1],h=d/t[0],m=i/t[1],f=o[1],g=o[0],w=a?`
      let localRow = i32(localId.y);
      let localCol = i32(localId.x);
      let globalRowStart = i32(workgroupId.y) * ${u};
      let globalColStart = i32(workgroupId.x) * ${p};

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${t[1]}) {
          for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
            ${Cr(e)}
          }
        }
        // Load one tile of B into local memory.
        for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
              for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
              kStart + inputRow,
              globalColStart + inputCol);
          }
        }
        kStart = kStart + ${i};
        workgroupBarrier();

        // Compute acc values for a single thread.
        var BCached : array<f32, ${g}>;
        for (var k = 0; k < ${i}; k++) {
          for (var inner = 0; inner < ${g}; inner++) {
            BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
          }
          for (var innerRow = 0; innerRow < ${f}; innerRow++) {
            let ACached = ${e?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
            for (var innerCol = 0; innerCol < ${g}; innerCol++) {
              acc[innerRow][innerCol] =
                  fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
            }
          }
        }
        workgroupBarrier();
      }
      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        let gRow = globalRowStart + localRow + innerRow * ${t[1]};
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          let gCol = globalColStart + localCol + innerCol * ${t[0]};
          mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
        }
      }
      `:`
  let tileRow = i32(localId.y) * ${f};
  let tileCol = i32(localId.x) * ${g};

  let globalRow = i32(globalId.y) * ${f};
  let globalCol = i32(globalId.x) * ${g};
  let globalRowStart = i32(workgroupId.y) * ${u};

  let tileRowA = i32(localId.y) * ${l};
  let tileColA = i32(localId.x) * ${h};
  let tileRowB = i32(localId.y) * ${m};
  // Loop over shared dimension.
  for (var t = 0; t < numTiles; t++) {
    // Load one tile of A into local memory.
    for (var innerRow = 0; innerRow < ${l}; innerRow++) {
      for (var innerCol = 0; innerCol < ${h}; innerCol++) {
        let inputRow = tileRowA + innerRow;
        let inputCol = tileColA + innerCol;
        ${Cr(e)}
      }
    }

    // Load one tile of B into local memory.
    for (var innerRow = 0; innerRow < ${m}; innerRow++) {
      for (var innerCol = 0; innerCol < ${g}; innerCol++) {
        let inputRow = tileRowB + innerRow;
        let inputCol = tileCol + innerCol;
        mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
          kStart + inputRow,
          globalCol + innerCol);
      }
    }
    kStart = kStart + ${i};
    workgroupBarrier();

    // Compute acc values for a single thread.
    var BCached : array<f32, ${g}>;
    for (var k = 0; k < ${i}; k++) {
      for (var inner = 0; inner < ${g}; inner++) {
        BCached[inner] = mm_Bsub[k][tileCol + inner];
      }

      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        ${$p(e)}
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] =
              fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
        }
      }
    }

    workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < ${f}; innerRow++) {
    for (var innerCol = 0; innerCol < ${g}; innerCol++) {
      mm_write(batch, globalRow + innerRow, globalCol + innerCol,
          acc[innerRow][innerCol]);
    }
  }
  `;return`
    var<workgroup> mm_Asub : array<array<f32, ${d}>, ${c}>;
    var<workgroup> mm_Bsub : array<array<f32, ${p}>, ${i}>;

    ${x()} {
      let batch = ${r?"0":"i32(globalId.z)"};
      let batchA = ${r||!n?"batch":"batch % uniforms.aShape[0]"};
      let batchB = ${r||!n?"batch":"batch % uniforms.bShape[0]"};
      let numTiles = ${r?`${Math.ceil(s/i)}`:`(uniforms.dimInner - 1) / ${i} + 1`};
      var kStart = ${r?`i32(globalId.z) * ${s}`:"0"};

      var acc : array<array<f32, ${g}>, ${f}>;

      // Without this initialization strange values show up in acc.
      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] = 0.0;
        }
      }
      ${w}
    }
  `}var Np=o=>o?`
      mm_readA(batchA, colA, globalRow),
      mm_readA(batchA, colA + 1, globalRow),
      mm_readA(batchA, colA + 2, globalRow),
      mm_readA(batchA, colA + 3, globalRow)
  `:`
      mm_readA(batchA, globalRow, colA),
      mm_readA(batchA, globalRow, colA + 1),
      mm_readA(batchA, globalRow, colA + 2),
      mm_readA(batchA, globalRow, colA + 3)
  `;function zp(o,t=!1){Ze.assert(o[1]===1&&o[2]===1,()=>`A linear work group size is required. But got ${o}.`);let e=o[0]*4;return`
    var<workgroup> mm_Asub : array<vec4<f32>, ${o[0]}>;

    ${x()} {
      let tileCol = i32(localId.x);
      let globalCol = i32(globalId.x);
      let globalRow = i32(globalId.y);

      let numTiles = (uniforms.dimInner - 1) / ${e} + 1;
      let batch = i32(globalId.z);
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      // Without this initialization strange values show up in acc.
      var acc = 0.0;

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        let colA = t * ${e} + tileCol * 4;
        mm_Asub[tileCol] = vec4<f32>(${Np(t)});
        workgroupBarrier();

        // Compute acc values for a single thread.
        for (var k = 0; k < ${e/4}; k++) {
          let rowB = t * ${e} + k * 4;
          let BCached = vec4<f32>(mm_readB(batchB, rowB, globalCol),
                              mm_readB(batchB, rowB + 1, globalCol),
                              mm_readB(batchB, rowB + 2, globalCol),
                              mm_readB(batchB, rowB + 3, globalCol));

          let ACached = mm_Asub[k];
          acc = acc + dot(ACached, BCached);
        }

        workgroupBarrier();
      }

      mm_write(batch, globalRow, globalCol, acc);
    }
  `}var Qe=class{constructor(t,e,i=!1,r=!1,s=null,a=null,n=null,u=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=e,this.dispatchLayout={x:[2],y:[1],z:[0]};let p=i?t[1]:t[2];if(this.isVec4=(p%4===0&&!i||e[1]%4===0&&i)&&e[2]%4===0&&!r,this.outputComponent=this.isVec4?4:1,this.isVectorA=e[1]===1&&!i,!this.isVec4&&this.isVectorA)this.elementsPerThread=[1,1,1],this.workgroupSize=[32,1,1];else{let l=Po(e[1],p,e[2],i);this.workgroupSize=l.workgroupSize,this.elementsPerThread=l.elementsPerThread}this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread);let d=s!=null,c=n!=null;d&&this.variableNames.push("bias"),c&&this.variableNames.push("preluActivationWeights"),this.sequentialAccessByThreads=u,this.transposeA=i,this.transposeB=r,this.addBias=d,this.activation=a,this.hasPreluActivationWeights=c,[this.fitAOuter,this.fitBOuter,this.fitInner]=this.getShapeFit(e[1],e[2],p),this.shaderKey=`matMulPacked_${this.elementsPerThread}_${i}_${r}_${this.activation}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.isVectorA}_${this.sequentialAccessByThreads}`}getShapeFit(t,e,i){let r=this.workgroupSize[1]*this.elementsPerThread[1],s=this.workgroupSize[0]*this.elementsPerThread[0];!this.isVec4&&this.isVectorA?this.tileInner=this.workgroupSize[0]*4:this.tileInner=s;let a=t%r===0,n=e%s===0,u=i%this.tileInner===0;return[a,n,u]}getUserCode(){return`
      ${V(this.activation,this.hasPreluActivationWeights,this.isVec4)}
      ${_e(this.addBias,this.activation,!1,this.transposeB,this.fitAOuter,this.fitBOuter,this.fitInner,this.isVec4?4:1)}
      ${this.isVec4?me(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,!0):this.isVectorA?zp(this.workgroupSize,this.transposeA):fe(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,this.sequentialAccessByThreads,!0)}
    `}};function Ap(o){return`
    var<workgroup> sumValues : array<f32, ${o}>;
    ${x()} {
      let coords = getOutputCoords();
      let batch = coords[0];
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      let row = coords[1];
      let col = coords[2];
      var sum = 0.0;
      let Length = uniforms.dimInner;
      for (var k = i32(localId.x); k < Length; k = k + ${o}) {
        let dataA = mm_readA(batchA, row, k);
        let dataB = mm_readB(batchB, k, col);
        sum = sum + dataA * dataB;
      }
      sumValues[localId.x] = sum;
      workgroupBarrier();

      for(var currentSize = ${o/2}u; currentSize > 1u;
          currentSize = currentSize / 2u) {
        if (localId.x < currentSize)
        {
          sumValues[localId.x] = sumValues[localId.x] + sumValues[localId.x + currentSize];
        }
        workgroupBarrier();
      }

      if (localId.x == 0u) {
        sum = sumValues[0] + sumValues[1];
        mm_write(batch, row, col, sum);
      }
    }
  `}var Je=class{constructor(t,e=!1,i=!1,r=null,s=null,a=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[256,1,1],this.outputShape=t,this.dispatchLayout={x:[],y:[1,2],z:[0]},this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize);let n=r!=null,u=a!=null;n&&this.variableNames.push("bias"),u&&this.variableNames.push("preluActivationWeights"),this.transposeA=e,this.transposeB=i,this.addBias=n,this.activation=s,this.hasPreluActivationWeights=u,this.shaderKey=`matMulReduce_${this.activation}_${e}_${i}`}getUserCode(){return`
      ${V(this.activation,this.hasPreluActivationWeights)}
      ${_e(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Ap(this.workgroupSize[0])}
    `}};function Fp(o){let t=o[1],e=o[0],i=t>e?t:e;return`
  var<workgroup> mm_Asub : array<array<f32, ${i}>, ${t}>;
  var<workgroup> mm_Bsub : array<array<f32, ${e}>, ${i}>;

  // If the output size is small for matrix multiplication, avoid to use vec4
  // and handle some elements per thread to optimally utilize the ALU.
  // Read data from global memory to registers firstly, then store them into
  // shared memory, so it is instruction-Level parallelism for arithmetic
  // operations and others handle IO operations between barrier api, makes ALU
  // and load/store units work simultaneously, could improves the performance.
  ${x()} {
    let tileRow = i32(localId.y);
    let tileCol = i32(localId.x);
    let globalRow = i32(globalId.y);
    let globalCol = i32(globalId.x);
    let batch = i32(globalId.z);
    let batchA = batch % uniforms.aShape[0];
    let batchB = batch % uniforms.bShape[0];

    // uniforms.dimInner should be greater than 0.
    let numTiles = (uniforms.dimInner - 1) / ${i} + 1;
    var acc = 0.0;

    var globalColA = tileCol;
    var globalRowB = 0;
    var regA = mm_readA(batchA, globalRow, globalColA);
    var regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
    var regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
    globalColA = globalColA + ${i};
    globalRowB = globalRowB + ${i};

    for (var t = 0; t < numTiles; t = t + 1) {
      mm_Asub[tileRow][tileCol] = regA;
      mm_Bsub[2 * tileRow][tileCol] = regB0;
      mm_Bsub[2 * tileRow + 1][tileCol] = regB1;

      workgroupBarrier();

      regA = mm_readA(batchA, globalRow, globalColA);
      regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
      regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
      globalColA = globalColA + ${i};
      globalRowB = globalRowB + ${i};

      for (var k = 0; k < ${i}; k = k + 1) {
        acc = acc + mm_Asub[tileRow][k] * mm_Bsub[k][tileCol];
      }
      workgroupBarrier();
    }

    mm_write(batch, globalRow, globalCol, acc);
  }
  `}var et=class{constructor(t,e,i,r=!1,s=!1,a=null,n=null,u=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[16,8,1],this.outputShape=i,this.dispatchLayout={x:[2],y:[1],z:[0]},this.dispatch=[Math.ceil(i[2]/this.workgroupSize[0]),Math.ceil(i[1]/this.workgroupSize[1]),i[0]];let p=a!=null;p&&this.variableNames.push("bias");let d=u!=null;d&&this.variableNames.push("preluActivationWeights"),this.transposeA=r,this.transposeB=s,this.addBias=p,this.activation=n,this.hasPreluActivationWeights=d,this.shaderKey=`matMulSmallOutputSize_${this.activation}_${r}_${s}`}getUserCode(){return`
      ${V(this.activation,this.hasPreluActivationWeights)}
      ${_e(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Fp(this.workgroupSize)}
    `}};import{util as Lp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var tt=class{constructor(t,e,i=!1,r=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[8,8,1],this.atomic=!0,this.splitedDimInner=128,Lp.assert(t[0]===1,()=>"MatMulSplitKProgram only supports batch = 1."),this.outputShape=t,this.dispatchLayout={x:[2],y:[1],z:[0,3]};let s=(i&&this.outputShape[1]%4===0||!i&&e%4===0)&&this.outputShape[2]%4===0;this.elementsPerThread=[4,4,this.splitedDimInner],this.outputComponent=s?4:1,s||(this.outputShape[1]<16&&(this.elementsPerThread[1]=1),this.outputShape[2]<16&&(this.elementsPerThread[0]=1)),this.dispatch=C(this.dispatchLayout,[this.outputShape[0],this.outputShape[1],this.outputShape[2],e],this.workgroupSize,this.elementsPerThread),this.transposeA=i,this.transposeB=r,this.shaderKey=`matMulSplitK_${i}_${r}_${this.elementsPerThread}_${this.outputComponent}`}getUserCode(){let t=this.outputComponent;return`
      ${zo(!1,this.transposeB,!1,!1,!1,t)}
      fn mm_write(batch: i32, row : i32, col : i32, value : ${z(t)}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
          let coords = vec3<i32>(batch, row, col);
          let flatIndex = getOutputIndexFromCoords(coords);
          // The problem is that we should initialize output to zero before using.
          // Otherwise, the original value will be added to the result.
          for (var i = 0; i < ${t}; i = i + 1) {
            ${q("&result[flatIndex + i]",`${t>1?"value[i]":"value"}`,"float32")}
          }
        }
      }
      ${t===4?me(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner):fe(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner)}
    `}},ot=class{constructor(t,e=null,i=null,r=null){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=e!=null,this.hasPreluActivationWeights=r!=null,this.activation=i,this.addBias&&this.variableNames.push("bias"),this.hasPreluActivationWeights&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`biasActivation_${i}`}getUserCode(){return`
    ${V(this.activation,this.hasPreluActivationWeights)}
    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        var value = getXByOutputIndex(index);
        ${Y(this.addBias,this.activation)}
        setOutputAtIndex(index, value);
      }
    }
    `}};import{Fill as Tp,util as Ao}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var rt=class{constructor(t){this.variableNames=[],this.outputShape=[],this.uniforms="value : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="fill"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        setOutputAtIndex(index, uniforms.value);
      }
    }
  `}};function _(o){let{backend:t,attrs:e}=o,{shape:i,value:r}=e,{dtype:s}=e;if(s=s||Ao.inferDtype(r),s==="string"){let a=Ao.getArrayFromDType(s,Ao.sizeFromShape(i));return a.fill(r),t.makeTensorInfo(i,s,a)}else{let a=new rt(i),n=[{type:"float32",data:[r]}];return t.runWebGPUProgram(a,[],s,n)}}var yr={kernelName:Tp,backendName:"webgpu",kernelFunc:_};import{Reshape as _p,util as it}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function I(o){let{inputs:t,attrs:e}=o,{x:i}=t,{shape:r}=e,s=it.sizeFromShape(i.shape),a=it.inferFromImplicitShape(r,s),n=it.sizeFromShape(a);return it.assert(s===n,()=>`The new shape (${a}) has ${n} elements and the old shape (${i.shape}) has ${s} elements. The new shape and old shape must have the same number of elements.`),o.backend.incRef(i.dataId),{dataId:i.dataId,shape:a,dtype:i.dtype}}var Sr={kernelName:_p,backendName:"webgpu",kernelFunc:I};function ge({a:o,b:t,transposeA:e,transposeB:i,backend:r,bias:s=null,preluActivationWeights:a=null,leakyreluAlpha:n=0,activation:u=null}){let p=o.shape.length,d=t.shape.length,c=e?o.shape[p-2]:o.shape[p-1],l=i?t.shape[d-1]:t.shape[d-2],h=e?o.shape[p-1]:o.shape[p-2],m=i?t.shape[d-2]:t.shape[d-1],f=o.shape.slice(0,-2),g=t.shape.slice(0,-2),w=Fo.sizeFromShape(f),b=Fo.sizeFromShape(g),k=Bp.assertAndGetBroadcastShape(o.shape.slice(0,-2),t.shape.slice(0,-2)).concat([h,m]);Fo.assert(c===l,()=>`Error in matMul: inner shapes (${c}) and (${l}) of Tensors with shapes ${o.shape} and ${t.shape} and transposeA=${e} and transposeB=${i} must match.`);let R=e?[w,c,h]:[w,h,c],$=i?[b,m,l]:[b,l,m],N=I({inputs:{x:o},backend:r,attrs:{shape:R}}),L=I({inputs:{x:t},backend:r,attrs:{shape:$}}),F=[N,L],W=Math.max(w,b),E=[N,L],X=[{type:"int32",data:[h]},{type:"int32",data:[m]},{type:"int32",data:[c]}],H,M,O=[W,h,m],G=wr().get("WEBGPU_MATMUL_PROGRAM_TYPE");if(G<0){let ye=wr().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),$e=ye>0?ye:r.thresholdToIncreaseWorkgroups,Ne=W*Math.ceil(h/32)*Math.ceil(m/32);Ne<=$e||h<=8&&Ne<=$e*2?W*h*m<=128?G=te.MatMulReduceProgram:W===1&&l>=2e3?G=te.MatMulSplitKProgram:G=te.MatMulSmallOutputSizeProgram:G=te.MatMulPackedProgram}switch(G){case te.MatMulReduceProgram:H=new Je(O,e,i,s,u,a);break;case te.MatMulSplitKProgram:{if(M=_({backend:r,attrs:{shape:O,value:0,dtype:o.dtype}}),H=new tt(O,l,e,i),s||u){M=r.runWebGPUProgram(H,E,o.dtype,X,M);let $e=new ot(M.shape,s,u,a),Ne=null,Ge=[M];s&&Ge.push(s),a&&Ge.push(a),u==="leakyrelu"&&(Ne=[{type:"float32",data:[n]}],$e.uniforms+=" alpha : f32,");let ir=r.runWebGPUProgram($e,Ge,M.dtype,Ne);F.push(M);let _n=I({inputs:{x:ir},backend:r,attrs:{shape:k}});F.push(ir);for(let Bn of F)r.disposeData(Bn.dataId);return _n}break}case te.MatMulSmallOutputSizeProgram:H=new et(R,$,O,e,i,s,u,a);break;case te.MatMulPackedProgram:let ye=r.adapterInfo.isIntel();H=new Qe(R,O,e,i,s,u,a,ye);break;default:throw new Error(`Unsupported MatMulProgramType ${G}.`)}s&&E.push(s),a&&E.push(a),u==="leakyrelu"&&(X.push({type:"float32",data:[n]}),H.uniforms+=" alpha : f32,"),M=r.runWebGPUProgram(H,E,o.dtype,X,M);let Tn=I({inputs:{x:M},backend:r,attrs:{shape:k}});F.push(M);for(let ye of F)r.disposeData(ye.dataId);return Tn}function Up(o){let{inputs:t,backend:e,attrs:i}=o,{a:r,b:s,bias:a,preluActivationWeights:n}=t,{transposeA:u,transposeB:p,activation:d,leakyreluAlpha:c}=i;return ge({a:r,b:s,transposeA:u,transposeB:p,backend:e,bias:a,preluActivationWeights:n,leakyreluAlpha:c,activation:d})}var br={kernelName:Ep,backendName:"webgpu",kernelFunc:Up};import{Abs as Gp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Rr,upcastType as Dr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Wp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Be=class{constructor(t,e,i){this.variableNames=["AReal","AImag","BReal","BImag"],this.workgroupSize=[128,1,1],this.size=!0,this.outputShape=Wp.assertAndGetBroadcastShape(e,i),this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`binaryOpComplex_${t}`,this.op=t}getUserCode(){return`
      fn binaryOpComplex(
          areal : f32, aimag : f32, breal : f32, bimag : f32) -> f32 {
        ${we(this.op,!1)}
      }

      ${x("index")} {
        if(index < uniforms.size) {
          let areal = getARealByOutputIndex(index);
          let aimag = getAImagByOutputIndex(index);
          let breal = getBRealByOutputIndex(index);
          let bimag = getBImagByOutputIndex(index);
          setOutputAtIndex(index, binaryOpComplex(areal, aimag, breal, bimag));
        }
      }
    `}};import{backend_util as Mp,util as vr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ne=class{constructor(t,e,i){if(this.size=!0,this.variableNames=["A","B"],this.outputShape=Mp.assertAndGetBroadcastShape(e,i),this.dispatchLayout=y(this.outputShape),this.op=t,this.useSharedMemoryWithA=e.length<=1&&i.length>1&&e[0]<128,this.useSharedMemoryWithB=i.length<=1&&e.length>1&&i[0]<128,this.useSharedMemoryWithA||this.useSharedMemoryWithB)this.outputComponent=1,this.variableComponents=[1,1],this.lastDimensionSize=this.useSharedMemoryWithB?i[0]:e[0],this.shaderKey=`binary_${t}_${this.lastDimensionSize}`,this.type="shared",this.workgroupSize=[256,1,1];else{let r=e.length>0&&e[e.length-1]%4===0,s=i.length>0&&i[i.length-1]%4===0;r&&s?(this.outputComponent=4,this.variableComponents=[4,4]):r&&(vr.isScalarShape(i)||i[i.length-1]===1)||s&&(vr.isScalarShape(e)||e[e.length-1]===1)?(this.outputComponent=4,this.variableComponents=r?[4,1]:[1,4]):(this.outputComponent=1,this.variableComponents=[1,1]),this.type="nonshared",this.shaderKey=`binary_${t}_${this.variableComponents}`,this.workgroupSize=[128,1,1]}this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.outputComponent,1,1])}getUserCode(){let t,e=this.outputComponent===4?"vec4<f32>":"f32",i=`
    fn binaryOperation(a : ${e}, b : ${e}) -> ${e} {
      ${we(this.op,this.outputComponent===4)}
    };
    `;if(this.type==="shared"){let r=this.lastDimensionSize>1?`coords[${this.outputShape.length-1}]`:"0",s=this.useSharedMemoryWithB?`let a = getAByOutputIndex(index);
          let b = sharedBuf[${r}];`:`let a = sharedBuf[${r}];
          let b = getBByOutputIndex(index);`;t=`
        ${i}
        var<workgroup> sharedBuf : array<f32, ${this.lastDimensionSize}>;
        ${x("index")} {
          // Fill in the shared memory buffer.
          let localIndex = i32(localId.x);
          if(localIndex < ${this.lastDimensionSize}) {
            sharedBuf[localIndex] = f32(${this.useSharedMemoryWithB?"B":"A"}[localIndex]);
          }
          workgroupBarrier();

          if(index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            ${s}
            setOutputAtIndex(index, binaryOperation(a, b));
          }
        }
        `}else t=`
       ${i}
       ${x("index")} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index * ${this.outputComponent});
           let a = ${e}(getAByOutputCoords(coords));
           let b = ${e}(getBByOutputCoords(coords));
           setOutputAtIndex(index, binaryOperation(a, b));
         }
       }
       `;return t}};import{Complex as Vp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Identity as Op}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function B(o){let{inputs:t}=o,{x:e}=t;return o.backend.incRef(e.dataId),{dataId:e.dataId,shape:e.shape,dtype:e.dtype}}var Ir={kernelName:Op,backendName:"webgpu",kernelFunc:B};function J(o){let{inputs:t,backend:e}=o,{real:i,imag:r}=t,s=e.makeTensorInfo(i.shape,"complex64"),a=e.tensorMap.get(s.dataId),n=B({inputs:{x:i},backend:e}),u=B({inputs:{x:r},backend:e});return a.complexTensorInfos={real:n,imag:u},s}var kr={kernelName:Vp,backendName:"webgpu",kernelFunc:J};var j=class{constructor(t,e,i=""){this.variableNames=["A"],this.size=!0;let r=128;this.workgroupSize=[r,1,1],this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.op=e,i!==""&&(this.uniforms=i),this.shaderKey=`unary_${e}`}getUserCode(){return`
      fn unaryOperation(a : f32) -> f32 {
        ${ae(this.op,!1)}
      }
      ${x("index")} {
        if (index < uniforms.size) {
          let a = getAByOutputIndex(index);
          setOutputAtIndex(index, unaryOperation(a));
        }
      }
      `}};function P({opType:o,cpuKernelImpl:t,dtype:e}){return({inputs:i,backend:r})=>{let{x:s}=i,a=r,n=e||s.dtype;if(a.shouldExecuteOnCPU([s])&&t!=null){let p=a.tensorMap.get(s.dataId),d=t(p.values,n);return a.makeTensorInfo(s.shape,n,d)}let u=new j(s.shape,o);return a.runWebGPUProgram(u,[s],n)}}function A({opType:o,cpuKernelImpl:t,supportsComplex:e=!1,dtype:i}){return({inputs:r,backend:s})=>{let{a,b:n}=r,u=s;if(e&&a.dtype==="complex64"){let c=u.tensorMap.get(a.dataId),l=u.tensorMap.get(n.dataId),h,m;if(o!==D.MUL)[h,m]=[[c.complexTensorInfos.real,l.complexTensorInfos.real],[c.complexTensorInfos.imag,l.complexTensorInfos.imag]].map(g=>{let[w,b]=g,v={dataId:w.dataId,dtype:w.dtype,shape:a.shape},k={dataId:b.dataId,dtype:b.dtype,shape:n.shape},R=new ne(o,a.shape,n.shape);return u.runWebGPUProgram(R,[v,k],Dr(w.dtype,b.dtype))});else{let g=new Be(D.COMPLEX_MULTIPLY_REAL,a.shape,n.shape),w=new Be(D.COMPLEX_MULTIPLY_IMAG,a.shape,n.shape),b=[{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:a.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:a.shape},{dataId:l.complexTensorInfos.real.dataId,dtype:l.complexTensorInfos.real.dtype,shape:n.shape},{dataId:l.complexTensorInfos.imag.dataId,dtype:l.complexTensorInfos.imag.dtype,shape:n.shape}];h=u.runWebGPUProgram(g,b,"float32"),m=u.runWebGPUProgram(w,b,"float32")}let f=J({inputs:{real:h,imag:m},backend:u});return u.disposeData(h.dataId),u.disposeData(m.dataId),f}let p=i||Dr(a.dtype,n.dtype);if((a.dtype==="string"||n.dtype==="string"||u.shouldExecuteOnCPU([a,n]))&&t!=null){let c=u.tensorMap.get(a.dataId).values,l=u.tensorMap.get(n.dataId).values,h=a.dtype==="string"?Rr.fromUint8ToStringArray(c):c,m=a.dtype==="string"?Rr.fromUint8ToStringArray(l):l,[f,g]=t(a.shape,n.shape,h,m,p);return u.makeTensorInfo(g,p,f)}let d=new ne(o,a.shape,n.shape);return u.runWebGPUProgram(d,[a,n],p)}}import*as Hp from"/v135/@tensorflow/tfjs-backend-cpu@4.15.0/denonext/dist/shared.js";var{addImpl:Pr,castImpl:$r,ceilImpl:Nr,concatImpl:zr,equalImpl:Ar,expImpl:Fr,expm1Impl:Lr,floorImpl:Tr,floorDivImpl:_r,gatherNdImpl:Br,gatherV2Impl:Er,greaterEqualImpl:Ur,greaterImpl:Wr,lessEqualImpl:Mr,lessImpl:Or,logImpl:Vr,maxImpl:Hr,maximumImpl:Gr,minimumImpl:Kr,multiplyImpl:Xr,negImpl:qr,notEqualImpl:Yr,prodImpl:jr,rangeImpl:Qr,rsqrtImpl:Zr,scatterImpl:Jr,simpleAbsImpl:ei,sliceImpl:ti,stridedSliceImpl:oi,stringNGramsImpl:ri,subImpl:ii,tileImpl:si,topKImpl:ai,transposeImpl:ni,uniqueImpl:RC}=Hp;var Kp=P({opType:S.ABS,cpuKernelImpl:ei}),ui={kernelName:Gp,backendName:"webgpu",kernelFunc:Kp};import{Acos as Xp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var qp=P({opType:S.ACOS}),pi={kernelName:Xp,backendName:"webgpu",kernelFunc:qp};import{Acosh as Yp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jp=P({opType:S.ACOSH}),di={kernelName:Yp,backendName:"webgpu",kernelFunc:jp};import{Add as Qp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Zp=A({opType:D.ADD,cpuKernelImpl:Pr,supportsComplex:!0}),li={kernelName:Qp,backendName:"webgpu",kernelFunc:Zp};import{AddN as Jp,upcastType as ed}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var st=class{constructor(t){this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t[0],this.variableNames=t.map((e,i)=>`T${i}`),this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey="addN"}getUserCode(){let t=[];this.variableNames.forEach(r=>{t.push(`let v${r} = get${r}ByOutputCoords(coords);`)});let e=this.variableNames.map(r=>`v${r}`).join(" + ");return`
      ${x("index")} {
        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if (flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            ${t.join(`
        `)}
            setOutputAtIndex(flatIndex, ${e});
          }
        }
      }
    `}};function td(o){let{inputs:t,backend:e}=o,i=t;if(i.length===1)return B({inputs:{x:i[0]},backend:e});let r=i.map(n=>n.dtype).reduce((n,u)=>ed(n,u)),s=i.map(n=>n.shape),a=new st(s);return e.runWebGPUProgram(a,i,r)}var ci={kernelName:Jp,backendName:"webgpu",kernelFunc:td};import{All as ud}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Ee,sumOutType as ad,util as pt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Transpose as rd,util as id}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as od}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var at=class{constructor(t,e){this.variableNames=["A"],this.workgroupSize=[16,16,1];let i=new Array(t.length);for(let r=0;r<i.length;r++)i[r]=t[e[r]];this.outputShape=i,this.dispatchLayout={x:[0],y:[1]},this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[1,1,1]),this.shaderKey="transposeShared"}getUserCode(){od.assert(this.workgroupSize[0]===this.workgroupSize[1],()=>`Must be a square tile, current tile shape is ${this.workgroupSize[0]} x ${this.workgroupSize[1]}`);let t=this.workgroupSize[0];return`
      var<workgroup> tile : array<array<f32, ${this.workgroupSize[0]+1}>, ${this.workgroupSize[0]}>;
      ${x()} {
        var x = i32(workgroupId.x) * ${t} + i32(localId.x);
        var y = i32(workgroupId.y) * ${t} + i32(localId.y);
        let width = uniforms.outShape[0];
        let height = uniforms.outShape[1];
        if (x < width && y < height) {
          tile[localId.y][localId.x] = f32(A[y * width + x]);
        }
        workgroupBarrier();

        x = i32(workgroupId.y) * ${t} + i32(localId.x);
        y = i32(workgroupId.x) * ${t} + i32(localId.y);
        if (x < height && y < width) {
          setOutputAtIndex((y * height + x), tile[localId.x]
            [localId.y]);
        }
      }
    `}};var nt=class{constructor(t,e){this.variableNames=["A"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0;let i=new Array(t.length);for(let r=0;r<i.length;r++)i[r]=t[e[r]];this.outputShape=i,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.newDim=e,this.shaderKey=`transpose_${e}`}getUserCode(){let t=T(this.outputShape.length),e=Lo(this.newDim);return`
      ${x("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            setOutputAtIndex(flatIndex, A[getIndexFromCoords${this.outputShape.length}D(
              ${t}(${e}), uniforms.aShape)]);
          }
        }
      }
    `}};function Lo(o){let t=o.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);let e=new Array(t);for(let i=0;i<o.length;i++)e[o[i]]=`coords.${ee(i)}`;return e.join()}function K(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{perm:s}=i,a=e,n=r.shape.length,u=new Array(n);for(let d=0;d<u.length;d++)u[d]=r.shape[s[d]];if(e.shouldExecuteOnCPU([r])){let c=a.tensorMap.get(r.dataId).values,l=ni(c,r.shape,r.dtype,s,u);return e.makeTensorInfo(u,r.dtype,l)}if(r.shape.length===2&&id.arraysEqual(s,[1,0])){let d=new at(r.shape,s);return a.runWebGPUProgram(d,[r],r.dtype)}let p=new nt(r.shape,s);return a.runWebGPUProgram(p,[r],r.dtype)}var hi={kernelName:rd,backendName:"webgpu",kernelFunc:K};import{backend_util as sd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ut=class{constructor(t,e,i){this.variableNames=["x"],this.uniforms="reduceSize : i32,",this.size=!0,this.inputShape=[t.batchSize,t.inSize];let[r]=sd.computeOutAndReduceShapes(this.inputShape,[1]);this.outputShape=r.length===0?[1]:r,t.inSize>=32768&&i>=512?this.workgroupSize=[512,1,1]:t.inSize>=4096?this.workgroupSize=[256,1,1]:this.workgroupSize=[64,1,1],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,[1,1,1]),this.reduceType=e,this.shaderKey=`reduce_${e}`}getUserCode(){let t="",e="0.0",i=this.workgroupSize[0];this.reduceType==="min"||this.reduceType==="max"?(t=`
         if (isnan(candidate)) {
          bestValue = uniforms.NAN;
         } else if (!isnan(bestValue) && candidate ${this.reduceType==="min"?"<":">"} bestValue)
           {  bestValue = candidate; }`,e="f32(x[offset])"):this.reduceType==="sum"||this.reduceType==="mean"?t=" bestValue = bestValue + candidate; ":this.reduceType==="prod"?(t=" bestValue = bestValue * candidate; ",e="1.0"):this.reduceType==="all"?(t=" bestValue = f32(bestValue >= 1.0 && candidate >= 1.0); ",e="1.0"):this.reduceType==="any"&&(t=" bestValue = f32(bestValue >= 1.0 || candidate >= 1.0); ",e="0.0");let r=this.reduceType==="mean"?"setOutputAtIndex(outputIndex, bestValue / f32(uniforms.reduceSize));":"setOutputAtIndex(outputIndex, bestValue);";return`
       fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
       }

       ${`
         var<workgroup> xBestValues : array<f32, ${i}>;
       `}
       fn getOffset(outputIndex : i32) -> i32 {
         let outputCoords = getCoordsFromIndex(outputIndex);
         let offset = ${this.outputShape.length===1?"outputCoords":"outputCoords[0]"} * uniforms.reduceSize;
          return offset;
       }
       ${x("index")} {
         let outputIndex = index / ${i};
         let offset = getOffset(outputIndex);
         var bestValue = ${e};
         let Length = uniforms.reduceSize;
         let WorkPerThread = DIV_CEIL(u32(Length), ${i}u);
         for (var k = i32(localId.x); k < Length && outputIndex < uniforms.size;
             k = k + ${i}) {
           let candidate = f32(x[offset + k]);
           ${t}
         }
         xBestValues[localId.x] = bestValue;
         workgroupBarrier();

         var reduceSize = min(u32(Length), ${i}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            ${t}
            xBestValues[localId.x] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (localId.x == 0u && outputIndex < uniforms.size) {
          ${r}
        }
       }
     `}};var nd={mean:"float32",all:"bool",any:"bool"};function Q(o,t,e,i,r){let s=o.shape.length,a=[],n=pt.parseAxisParam(t,o.shape),u=n,p=Ee.getAxesPermutation(u,s),d=o;p!=null&&(d=K({inputs:{x:o},attrs:{perm:p},backend:r}),u=Ee.getInnerMostAxes(u.length,s),a.push(d)),Ee.assertAxesAreInnerMostDims(i,u,s);let[c,l]=Ee.computeOutAndReduceShapes(d.shape,u),h=c;e&&(h=Ee.expandShapeToKeepDim(c,n));let m;if((i==="max"||i==="prod")&&r.shouldExecuteOnCPU([d])){let f=r.tensorMap.get(d.dataId).values;switch(i){case"max":let g=Hr(f,pt.sizeFromShape(l),h,o.dtype);m=r.makeTensorInfo(h,o.dtype,g);break;case"prod":let{outVals:w,outShape:b,outDtype:v}=jr(d.shape,d.dtype,f,u);m=r.makeTensorInfo(b,v,w);break;default:throw new Error(`${i} CPU implementation is not yet supported.`)}}else{let f=pt.sizeFromShape(l),w=pt.sizeFromShape(d.shape)/f,b={windowSize:f,inSize:f,batchSize:w,outSize:1},v=nd[i]||ad(o.dtype),k=[{type:"int32",data:[f]}],R=new ut(b,i,r.device.limits.maxComputeWorkgroupSizeX),$=r.runWebGPUProgram(R,[d],v,k);a.push($),m=I({inputs:{x:$},attrs:{shape:h},backend:r})}return a.forEach(f=>r.disposeData(f.dataId)),m}function pd(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{keepDims:s,axis:a}=i;return Q(r,a,s,"all",e)}var mi={kernelName:ud,backendName:"webgpu",kernelFunc:pd};import{Any as dd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ld(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{keepDims:s,axis:a}=i;return Q(r,a,s,"any",e)}var fi={kernelName:dd,backendName:"webgpu",kernelFunc:ld};import{ArgMax as md,backend_util as To,util as fd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as cd,util as hd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var be=class{constructor(t,e,i){this.workgroupSize=[64,1,1],this.variableNames=["x"],this.uniforms="infinityValue : f32,",this.size=!0;let r=[e];this.op=i==="min"?"<":">";let[s,a]=cd.computeOutAndReduceShapes(t,r);this.outputShape=s.length===0?[1]:s,this.dispatchLayout=y(this.outputShape),hd.sizeFromShape(a)<32?(this.type="plain",this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize)):(this.type="shared",this.dispatch=C(this.dispatchLayout,this.outputShape,[1,1,1])),this.inputShape=t,this.shaderKey=`argMinMax_${this.op}_${this.type}`}getUserCode(){let t=this.workgroupSize[0],e=()=>this.inputShape.length===1?"uniforms.xShape":`uniforms.xShape.${ee(this.inputShape.length-1)}`,i=()=>{let r="";if(this.outputShape.length===1)this.inputShape.length!==1&&(r+="outputCoords,");else for(let s=0;s<this.outputShape.length;s++)r+=`outputCoords.${ee(s)},`;return r};return this.type==="shared"?`
      fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
      }

      ${`
      var<workgroup> xBestIndices : array<i32, ${t}>;
      var<workgroup> xBestValues : array<f32, ${t}>;
    `}

      ${x("index")} {
        let outputIndex = index / ${t};
        let reduceLength = ${e()};

        var bestIndex = i32(localId.x);
        var bestValue = uniforms.infinityValue;
        let outputCoords = getCoordsFromIndex(outputIndex);
        for (var k = i32(localId.x); k < reduceLength && outputIndex < uniforms.size;
            k = k + ${t}) {
          let candidate = getX(${i()} k);
          if (!isnan(candidate) && candidate ${this.op} bestValue) {
            bestValue = candidate;
            bestIndex = k;
          }
        }
        xBestValues[localId.x] = bestValue;
        xBestIndices[localId.x] = bestIndex;
        workgroupBarrier();

        var reduceSize = min(u32(reduceLength), ${t}u);
        for (var currentSize = reduceSize / 2u; reduceSize > 1u;
            currentSize = reduceSize / 2u) {
          let interval = DIV_CEIL(reduceSize, 2u);
          if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              xBestValues[localId.x] = bestValue;
              xBestIndices[localId.x] = xBestIndices[localId.x + interval];
            }
          }
          reduceSize = interval;
          workgroupBarrier();
        }

        if (localId.x == 0u && outputIndex < uniforms.size) {
          setOutputAtIndexI32(outputIndex, xBestIndices[localId.x]);
        }
      }
    `:`
      ${x("index")} {
        if (index < uniforms.size) {
          let outputCoords = getCoordsFromIndex(index);
          var bestIndex = 0;
          var bestValue = getX(${i()} 0);
          let reduceLength = ${e()};
          for (var i = 1; i < reduceLength; i++) {
            let candidate = getX(${i()} i);
            if (candidate ${this.op} bestValue) {
              bestValue = candidate;
              bestIndex = i;
            }
          }
          setOutputAtIndexI32(index, bestIndex);
        }
      }
      `}};function gd(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s}=i,a=fd.parseAxisParam(s,r.shape),n=To.getAxesPermutation(a,r.shape.length),u=r,p=[];n!=null&&(u=K({inputs:{x:r},backend:e,attrs:{perm:n}}),p.push(u),a=To.getInnerMostAxes(a.length,u.shape.length)),To.assertAxesAreInnerMostDims("argMax",[a[0]],u.shape.length);let d=new be(u.shape,a[0],"max"),c=[{type:"float32",data:[Number.NEGATIVE_INFINITY]}],l=e.runWebGPUProgram(d,[u],"int32",c);return p.forEach(h=>e.disposeData(h.dataId)),l}var gi={kernelName:md,backendName:"webgpu",kernelFunc:gd};import{ArgMin as xd,backend_util as _o,util as Cd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function yd(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s}=i,a=Cd.parseAxisParam(s,r.shape),n=_o.getAxesPermutation(a,r.shape.length),u=r,p=[];n!=null&&(u=K({inputs:{x:r},backend:e,attrs:{perm:n}}),p.push(u),a=_o.getInnerMostAxes(a.length,u.shape.length)),_o.assertAxesAreInnerMostDims("argMin",[a[0]],u.shape.length);let d=new be(u.shape,a[0],"min"),c=[{type:"float32",data:[Number.POSITIVE_INFINITY]}],l=e.runWebGPUProgram(d,[u],"int32",c);return p.forEach(h=>e.disposeData(h.dataId)),l}var xi={kernelName:xd,backendName:"webgpu",kernelFunc:yd};import{Asin as Sd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wd=P({opType:S.ASIN}),Ci={kernelName:Sd,backendName:"webgpu",kernelFunc:wd};import{Asinh as bd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vd=P({opType:S.ASINH}),yi={kernelName:bd,backendName:"webgpu",kernelFunc:vd};import{Atan as Id}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var kd=P({opType:S.ATAN}),Si={kernelName:Id,backendName:"webgpu",kernelFunc:kd};import{Atan2 as Rd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Dd=A({opType:D.ATAN2}),wi={kernelName:Rd,backendName:"webgpu",kernelFunc:Dd};import{Atanh as Pd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $d=P({opType:S.ATANH}),bi={kernelName:Pd,backendName:"webgpu",kernelFunc:$d};import{AvgPool as Ad,backend_util as Fd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Uo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var dt=class{constructor(t){this.variableNames=["x"],this.uniforms="strides : vec2<i32>,",this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="poolWithFilterSizeEqualsOne"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];

          let xRCCorner = coords.yz * uniforms.strides;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          let value = getX(batch, xRCorner, xCCorner, d);
          setOutputAtIndex(index, value);
        }
      }
    `}};var re=class{constructor(t,e,i=!1,r=!1,s=!1){if(this.variableNames=["x"],this.uniforms="strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, convDims : vec2<i32>, filterDims : vec2<i32>,",this.workgroupSize=[128,1,1],this.size=!0,e==="avg"&&i)throw new Error("Cannot compute positions for average pool.");this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=e,this.computePositions=i,this.flattenPositions=r,this.includeBatchIndex=s,this.shaderKey=`pool2D_${e}_${i}_${r}_${s}`}getUserCode(){let t;this.poolType==="avg"?t="resultValue = resultValue + value; count = count + 1.0;":this.computePositions?t=`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?"((batch * uniforms.xShape[1] + xR) * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"(xR * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"wR * uniforms.filterDims.y + wC"};
      }`:t="resultValue = max(value, resultValue);";let e="resultValue";return this.poolType==="avg"&&(e="resultValue / max(count, 1.0)"),`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];
          let xRCCorner = vec2<i32>(coords.yz) * uniforms.strides - uniforms.pads;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType==="avg"?"0.0":"-1.0 / pow(10.0, -20.0)"};`}

          var count = 0.0;
          for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + uniforms.dilations.x) {
            let xR = xRCorner + wR;

            if (xR < 0 || xR >= uniforms.convDims.x) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + uniforms.dilations.y) {
              let xC = xCCorner + wC;
              if (xC < 0 || xC >= uniforms.convDims.y) {
                continue;
              }

              let value = getX(batch, xR, xC, d);
              ${t}
            }
          }

          ${this.computePositions?"setOutputAtIndexI32(index, maxPosition);":`setOutputAtIndex(index, ${e});`}
        }
      }
    `}},le=class{constructor(t,e,i=!1,r=!1,s=!1){if(this.variableNames=["x"],this.uniforms="strides : vec3<i32>, pads : vec3<i32>, convDims : vec3<i32>, filterDims : vec3<i32>,",this.workgroupSize=[128,1,1],this.size=!0,e==="avg"&&i)throw new Error("Cannot compute positions for average pool.");this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=e,this.computePositions=i,this.flattenPositions=r,this.includeBatchIndex=s,this.shaderKey=`pool3D_${e}_${i}_${r}_${s}`}getUserCode(){let t;this.poolType==="avg"?t="resultValue += value; count += 1.0;":this.computePositions?t=`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?"(((batch * uniforms.xShape.y + xD) * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch":"((xD * uniforms.xShape.z + xR) * uniforms.xShape.w + xC) * uniforms.xShape.u + ch":"wD * uniforms.filterDims.y * uniforms.filterDims.y + wR * uniforms.filterDims.z + wC"};
      }`:t="resultValue = max(value, resultValue);";let e="resultValue";return this.poolType==="avg"&&(e="resultValue / max(count, 1.0)"),`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords.x;
          let ch = coords.u;

          let xCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
          let xDCorner = xCorner.x;
          let xRCorner = xCorner.y;
          let xCCorner = xCorner.z;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType==="avg"?"0.0":"-1.0 / pow(10.0, -20.0)"};`}

          var count = 0.0;
          for (var wD = 0; wD < uniforms.filterDims.x; wD++) {
            let xD = xDCorner + wD;
            if (xD < 0 || xD >= uniforms.convDims.x) {
              continue;
            }

            for (var wR = 0; wR < uniforms.filterDims.y; wR++) {
              let xR = xRCorner + wR;
              if (xR < 0 || xR >= uniforms.convDims.y) {
                continue;
              }

              for (var wC = 0; wC < uniforms.filterDims.z; wC++) {
                let xC = xCCorner + wC;
                if (xC < 0 || xC >= uniforms.convDims.z) {
                  continue;
                }

                let value = getX(batch, xD, xR, xC, ch);
                ${t}
              }
            }
          }

          ${this.computePositions?"setOutputAtIndexI32(index, maxPosition);":`setOutputAtIndex(index, ${e});`}
        }
      }
    `}};import{Max as Nd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Bo(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{reductionIndices:s,keepDims:a}=i;return Q(r,s,a,"max",e)}var vi={kernelName:Nd,backendName:"webgpu",kernelFunc:Bo};import{Mean as zd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Eo(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{keepDims:s,axis:a}=i;return Q(r,a,s,"mean",e)}var Ii={kernelName:zd,backendName:"webgpu",kernelFunc:Eo};function lt(o,t,e,i){if(t.filterWidth===1&&t.filterHeight===1&&Uo.arraysEqual(t.inShape,t.outShape))return B({inputs:{x:o},backend:i});if(t.filterWidth===t.inWidth&&t.filterHeight===t.inHeight&&t.batchSize===1&&t.padInfo.type==="VALID"){let a=o.shape.length,n=I({inputs:{x:o},backend:i,attrs:{shape:[o.shape[a-3]*o.shape[a-2],o.shape[a-1]]}}),u;e==="avg"?u=Eo({inputs:{x:n},backend:i,attrs:{axis:0,keepDims:!1}}):(Uo.assert(e==="max",()=>`Invalid pool type ${e}`),u=Bo({inputs:{x:n},backend:i,attrs:{reductionIndices:0,keepDims:!1}}));let p=I({inputs:{x:u},backend:i,attrs:{shape:t.outShape}});return i.disposeData(n.dataId),i.disposeData(u.dataId),p}let r,s=[{type:"int32",data:[t.strideHeight,t.strideWidth]}];return t.filterHeight===1&&t.filterWidth===1?r=new dt(t):(e==="avg"?r=new re(t,"avg"):(Uo.assert(e==="max",()=>`Invalid pool type ${e}`),r=new re(t,"max")),s.push({type:"int32",data:[t.padInfo.top,t.padInfo.left]},{type:"int32",data:[t.dilationHeight,t.dilationWidth]},{type:"int32",data:[t.inHeight,t.inWidth]},{type:"int32",data:[t.effectiveFilterHeight,t.effectiveFilterWidth]})),i.runWebGPUProgram(r,[o],o.dtype,s)}function Ld(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{filterSize:s,strides:a,pad:n,dimRoundingMode:u}=i,p=1,d=Fd.computePool2DInfo(r.shape,s,a,p,n,u);return lt(r,d,"avg",e)}var ki={kernelName:Ad,backendName:"webgpu",kernelFunc:Ld};import{AvgPool3D as Td,backend_util as _d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Bd(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{filterSize:s,strides:a,pad:n,dataFormat:u,dimRoundingMode:p}=i,d=[1,1,1],c=_d.computePool3DInfo(r.shape,s,a,d,n,p,u),l=new le(c,"avg"),h=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.front,c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.inDepth,c.inHeight,c.inWidth]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]}];return e.runWebGPUProgram(l,[r],r.dtype,h)}var Ri={kernelName:Td,backendName:"webgpu",kernelFunc:Bd};import{AvgPool3DGrad as Ed,backend_util as Ud}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ct=class{constructor(t){this.variableNames=["dy"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="avgPool2DBackprop"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR = wR + uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC = wC + uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);

            dotProd = dotProd + dyValue * uniforms.avgMultiplier;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},ht=class{constructor(t){this.variableNames=["dy"],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
       outDepth : i32, outHeight : i32, outWidth : i32, avgMultiplier : f32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="avgPool3DBackprop"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              dotProd += dyValue * uniforms.avgMultiplier;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}};function Wd(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,input:s}=t,a=s,{filterSize:n,strides:u,pad:p,dimRoundingMode:d}=i,c=Ud.computePool3DInfo(a.shape,n,u,1,p,d),l=new ht(c),h=1/(c.filterDepth*c.filterHeight*c.filterWidth),m=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.effectiveFilterDepth-1-c.padInfo.front,c.effectiveFilterHeight-1-c.padInfo.top,c.effectiveFilterWidth-1-c.padInfo.left]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]},{type:"int32",data:[c.outDepth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"float32",data:[h]}];return e.runWebGPUProgram(l,[r],a.dtype,m)}var Di={kernelName:Ed,backendName:"webgpu",kernelFunc:Wd};import{AvgPoolGrad as Md,backend_util as Od}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Vd(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,input:s}=t,a=s;Te([r,s],"avgPoolGrad");let{filterSize:n,strides:u,pad:p}=i,d=Od.computePool2DInfo(a.shape,n,u,1,p),c=new ct(d),l=1/(d.filterHeight*d.filterWidth),h=[{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.effectiveFilterHeight-1-d.padInfo.top,d.effectiveFilterWidth-1-d.padInfo.left]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[d.effectiveFilterHeight,d.effectiveFilterWidth]},{type:"int32",data:[d.outHeight]},{type:"int32",data:[d.outWidth]},{type:"float32",data:[l]}];return e.runWebGPUProgram(c,[r],a.dtype,h)}var Pi={kernelName:Md,backendName:"webgpu",kernelFunc:Vd};import{BatchMatMul as Hd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Gd(o){let{inputs:t,backend:e,attrs:i}=o,{a:r,b:s}=t,{transposeA:a,transposeB:n}=i;return ge({a:r,b:s,transposeA:a,transposeB:n,backend:e})}var $i={kernelName:Hd,backendName:"webgpu",kernelFunc:Gd};import{backend_util as Ue,BatchToSpaceND as Yd,util as jd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Slice as Xd,slice_util as Ni,util as qd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var mt=class{constructor(t,e){this.variableNames=["source"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.rank=e.length,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.start=t,this.uniforms=`start : ${T(t.length)}, `,this.shaderKey="slice"}getUserCode(){let t=T(this.rank),e=Kd(this.rank),i;return this.start.length===1?i=this.outputShape.map((s,a)=>"sourceLoc = uniforms.start + coords;"):i=this.outputShape.map((s,a)=>`sourceLoc.${Wo[a]} = uniforms.start.${ee(a)} + coords.${Wo[a]};`),`
      ${x("index")} {
        if (index < uniforms.size) {
          var sourceLoc : ${t};
          let coords = getCoordsFromIndex(index);
          ${i.join(`
`)}
          setOutputAtIndex(index, getSource(${e}));
        }
      }
    `}},Wo=["x","y","z","w","u","v"];function Kd(o){if(o===1)return"sourceLoc";if(o<=6)return Wo.slice(0,o).map(t=>`sourceLoc.${t}`).join(",");throw Error(`Slicing for rank ${o} is not yet supported`)}function oe(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{begin:s,size:a}=i,[n,u]=Ni.parseSliceParams(r,s,a);if(Ni.assertParamsValid(r,n,u),e.shouldExecuteOnCPU([r])||r.dtype==="string"){let c=e.tensorMap.get(r.dataId),l=ti(c.values,n,u,r.shape,r.dtype);return e.makeTensorInfo(u,r.dtype,l)}if(qd.sizeFromShape(u)===0)return e.makeTensorInfo(u,r.dtype,[]);let p=new mt(n,u),d=[{type:"int32",data:n}];return e.runWebGPUProgram(p,[r],r.dtype,d)}var zi={kernelName:Xd,backendName:"webgpu",kernelFunc:oe};var Qd=o=>{let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{blockShape:s,crops:a}=i;jd.assert(r.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGPU backend not implemented yet");let n=s.reduce((b,v)=>b*v),u=Ue.getReshaped(r.shape,s,n),p=Ue.getPermuted(u.length,s.length),d=Ue.getReshapedPermuted(r.shape,s,n),c=Ue.getSliceBeginCoords(a,s.length),l=Ue.getSliceSize(d,a,s.length),h=[],m=I({inputs:{x:r},backend:e,attrs:{shape:u}}),f=K({inputs:{x:m},backend:e,attrs:{perm:p}}),g=I({inputs:{x:f},backend:e,attrs:{shape:d}}),w=oe({inputs:{x:g},backend:e,attrs:{begin:c,size:l}});return h.push(m),h.push(f),h.push(g),h.forEach(b=>e.disposeData(b.dataId)),w},Ai={kernelName:Yd,backendName:"webgpu",kernelFunc:Qd};import{Bincount as el,util as Fi}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Zd=`
  fn bincount_write(index: i32, value: f32) {
    ${q("&result[index]","value","float32")}
  }
`,Jd=`
  fn bincount_write(index: i32, value: f32) {
    atomicStore(&result[index], bitcast<i32>(value));
  }
`,ve=class{constructor(t,e,i=!1){this.outputShape=[],this.variableNames=["x"],this.uniforms="binCountSize : i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.hasWeights=!0,this.binaryOutput=!1,this.outputShape=t,this.rank=t.length,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.binaryOutput=i,i&&(this.atomic=!1),this.hasWeights=e,this.hasWeights&&this.variableNames.push("w"),this.shaderKey=`bincount_${this.hasWeights}_${this.binaryOutput}_${this.rank}`}getUserCode(){return`
    ${this.binaryOutput?Jd:Zd}
  ${x("index")} {
    ${this.rank===1?`if (index < uniforms.xShape) {
      let indexVal = i32(getX(index));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?"getW(index)":"1."};
        bincount_write(indexVal, value);
      }
    }`:`let coord = getCoordsFromIndex(index);
    if (coordsInBounds2D(coord, uniforms.xShape)) {
      let indexVal = i32(getX(coord[0], coord[1]));
      if (indexVal < uniforms.binCountSize) {
        let value = ${this.binaryOutput?1:this.hasWeights?"getW(coord[0], coord[1])":"1."};
        bincount_write(coord.x * uniforms.binCountSize + indexVal, value);
      }
    }`}
  }
  `}};function tl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,weights:s}=t,{size:a}=i,n=Fi.sizeFromShape(r.shape),p=Fi.sizeFromShape(s.shape)>0,d=[a],c=s.dtype,l=_({backend:e,attrs:{shape:d,value:0,dtype:c}}),h=new ve([n],p),m=[{type:"int32",data:[a]}],f=p?[r,s]:[r];return e.runWebGPUProgram(h,f,c,m,l)}var Li={kernelName:el,backendName:"webgpu",kernelFunc:tl};import{backend_util as ol,BroadcastArgs as rl,util as Ti}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ft=class{constructor(t){this.outputShape=[],this.variableNames=["s0","s1"],this.uniforms="s0Size : i32, s1Size : i32, ",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="broadcastArgs"}getUserCode(){return`
  ${x("index")} {
    if (index < uniforms.size) {
      var s0 = 1.0;
      var s1 = 1.0;
      let indexS0 = index - uniforms.size + uniforms.s0Size;
      let indexS1 = index - uniforms.size + uniforms.s1Size;
      if (indexS0 >= 0) {
        s0 = getS0(indexS0);
      }
      if (indexS1 >= 0) {
        s1 = getS1(indexS1);
      }

      if (s0 == 1.0) {
        setOutputAtIndex(index, s1);
      } else if (s1 == 1.0) {
        setOutputAtIndex(index, s0);
      } else if (s0 != s1) {
        setOutputAtIndex(index, uniforms.NAN);
      } else {
        setOutputAtIndex(index, s0);
      }
    }
  }
  `}};function il(o){let{inputs:t,backend:e}=o,{s0:i,s1:r}=t;if(e.shouldExecuteOnCPU([i,r])){let d=e.tensorMap.get(i.dataId),c=e.tensorMap.get(r.dataId),l=d.values,h=c.values,m=ol.assertAndGetBroadcastShape(Array.from(l),Array.from(h));return e.makeTensorInfo([m.length],"int32",Int32Array.from(m))}let s=Ti.sizeFromShape(i.shape),a=Ti.sizeFromShape(r.shape),n=Math.max(s,a),u=new ft(n),p=[{type:"int32",data:[s]},{type:"int32",data:[a]}];return e.runWebGPUProgram(u,[i,r],"int32",p)}var _i={kernelName:rl,backendName:"webgpu",kernelFunc:il};import*as Mi from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Cast as nl,util as Wi}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{NotEqual as sl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Mo=A({opType:D.NOT_EQUAL,dtype:"bool",cpuKernelImpl:Yr}),Bi={kernelName:sl,backendName:"webgpu",kernelFunc:Mo};import{Real as al}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ue(o){let{inputs:t,backend:e}=o,{input:i}=t,r=e.tensorMap.get(i.dataId);return B({inputs:{x:r.complexTensorInfos.real},backend:e})}var Ei={kernelName:al,backendName:"webgpu",kernelFunc:ue};function Ui(o,t){let e=new j(o.shape,S.TO_INT),i=t.runWebGPUProgram(e,[o],"int32");return{dataId:i.dataId,shape:i.shape,dtype:i.dtype}}function Oo(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{dtype:s}=i;if(s==="complex64"){if(r.dtype==="complex64")return B({inputs:{x:r},backend:e});let a=Mi.zeros(r.shape),n=Oo({inputs:{x:r},backend:e,attrs:{dtype:"float32"}}),u=J({inputs:{real:n,imag:a},backend:e});return a.dispose(),e.disposeData(n.dataId),u}if(r.dtype==="complex64"){let a=ue({inputs:{input:r},backend:e}),n=Oo({inputs:{x:a},backend:e,attrs:{dtype:s}});return e.disposeData(a.dataId),n}if(!Wi.hasEncodingLoss(r.dtype,s)){let a=B({inputs:{x:r},backend:e});return{dataId:a.dataId,shape:a.shape,dtype:s}}if(e.shouldExecuteOnCPU([r])){let a=e.tensorMap.get(r.dataId).values,[n,u,p]=$r(a,r.shape,r.dtype,s);return e.makeTensorInfo(n,u,p)}if(s==="int32")return Ui(r,e);if(s==="bool"){let a=e.makeTensorInfo([],"bool",Wi.getTypedArrayFromDType("bool",1)),u=Mo({inputs:{a:r,b:a},backend:e});return e.disposeData(a.dataId),u}throw new Error(`Error in Cast: failed to cast ${r.dtype} to ${s}`)}var Oi={kernelName:nl,backendName:"webgpu",kernelFunc:Oo};import{Ceil as ul}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var pl=P({opType:S.CEIL,cpuKernelImpl:Nr}),Vi={kernelName:ul,backendName:"webgpu",kernelFunc:pl};import{ClipByValue as dl,util as ll}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gt=class{constructor(t){this.variableNames=["A"],this.uniforms="minVal : f32, maxVal : f32,",this.workPerThread=4,this.workgroupSize=[64,1,1],this.outputComponent=4,this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.shaderKey="clipVec4"}getUserCode(){return`
      ${x("index")} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          var clampedValue = clamp(
              value, vec4<f32>(uniforms.minVal), vec4<f32>(uniforms.maxVal));
          clampedValue = select(clampedValue, value, isnanVec4(value));
          setOutputAtIndex(index, clampedValue);
        }
      }
    `}};var xt=class{constructor(t){this.variableNames=["A"],this.uniforms="minVal : f32, maxVal : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="clip"}getUserCode(){return`
      ${x("index")} {
        if(index < uniforms.size) {
          let value = getAByOutputIndex(index);
          if (isnan(value)) {
            setOutputAtIndex(index, value);
            return;
          }
          setOutputAtIndex(index, clamp(value, uniforms.minVal, uniforms.maxVal));
        }
      }
    `}};function cl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{clipValueMin:s,clipValueMax:a}=i,n,u=[{type:"float32",data:[s]},{type:"float32",data:[a]}];return ll.sizeFromShape(r.shape)%4===0?n=new gt(r.shape):n=new xt(r.shape),e.runWebGPUProgram(n,[r],r.dtype,u)}var Hi={kernelName:dl,backendName:"webgpu",kernelFunc:cl};import{ComplexAbs as hl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ct=class{constructor(t){this.outputShape=[],this.variableNames=["real","imag"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="complexAbs"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        let re = abs(getRealByOutputIndex(index));
        let im = abs(getImagByOutputIndex(index));
        let mx = max(re, im);

        // The length function in wgsl may be not underflow-safe on some GPUs.
        // So the safe solution is to ensure underflow-safety in all cases.
        setOutputAtIndex(index, select(mx * length(vec2<f32>(1, min(re, im)/mx)), 0.0, mx == 0.0));
      }
    }
  `}};function Gi(o,t){return{dataId:t.dataId,dtype:t.dtype,shape:o.shape}}function ml(o){let{inputs:t,backend:e}=o,{x:i}=t,r=e.tensorMap.get(i.dataId),s=new Ct(i.shape),a=[Gi(i,r.complexTensorInfos.real),Gi(i,r.complexTensorInfos.imag)];return e.runWebGPUProgram(s,a,a[0].dtype)}var Ki={kernelName:hl,backendName:"webgpu",kernelFunc:ml};import{backend_util as qi,Concat as Cl,util as Go}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Vo,util as Ho}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as fl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var yt=class{constructor(t){this.uniforms="",this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=fl.computeOutShape(t,1),this.variableNames=t.map((e,i)=>`T${i}`),this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.offsetLength=t.length-1;for(let e=0;e<this.offsetLength;e++)this.uniforms+=`offset${e} : i32,`;this.shaderKey="concat"}getUserCode(){let t=[];if(this.offsetLength>0){t.push("if (yC < uniforms.offset0){ setOutputAtCoords(coords.x, coords.y, getT0(yR, yC)); }");for(let s=1;s<this.offsetLength;s++)t.push(`else if (yC < uniforms.offset${[s]}){ setOutputAtCoords(coords.x, coords.y, getT${s}(yR, yC - uniforms.offset${s-1})); }`);let i=this.offsetLength,r=this.offsetLength-1;t.push(`else { setOutputAtCoords(coords.x, coords.y, getT${i}(yR, yC - uniforms.offset${r})); }`)}else t.push("setOutputAtCoords(coords.x, coords.y, getT0(yR, yC));");return`
      ${x("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            let yR = coords.x;
            let yC = coords.y;

            ${t.join(`
        `)}
          }
        }
      }
    `}};import{Imag as gl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function xe(o){let{inputs:t,backend:e}=o,{input:i}=t,r=e.tensorMap.get(i.dataId);return B({inputs:{x:r.complexTensorInfos.imag},backend:e})}var Xi={kernelName:gl,backendName:"webgpu",kernelFunc:xe};function Ie(o,t,e){let i=o[0].dtype;if(i==="complex64"){let m=o.map(v=>ue({inputs:{input:v},backend:e})),f=o.map(v=>xe({inputs:{input:v},backend:e})),g=Ie(m,t,e),w=Ie(f,t,e),b=J({inputs:{real:g,imag:w},backend:e});return m.forEach(v=>e.disposeData(v.dataId)),f.forEach(v=>e.disposeData(v.dataId)),e.disposeData(g.dataId),e.disposeData(w.dataId),b}let r=e.shouldExecuteOnCPU(o);if(i==="string"&&(r=!0),r){let m=o.map(R=>{let N=[-1,Ho.sizeFromShape(R.shape.slice(t))];return I({inputs:{x:R},backend:e,attrs:{shape:N}})}),f=m.map(R=>({vals:e.readSync(R.dataId),shape:R.shape})),g=Vo.computeOutShape(m.map(R=>R.shape),1),w=m[0].shape[0]===1,b=zr(f,g,i,w),v=Vo.computeOutShape(o.map(R=>R.shape),t),k=e.makeTensorInfo(v,i,b);return m.forEach(R=>e.disposeData(R.dataId)),k}let s=e.device.limits.maxStorageBuffersPerShaderStage-1;if(o.length>s){let m=[];for(let g=0;g<o.length;g+=s){let w=o.slice(g,g+s);m.push(Ie(w,t,e))}let f=Ie(m,t,e);for(let g of m)e.disposeData(g.dataId);return f}let{tensors2D:a,outShape:n}=xl(o,t,e),u=a.map(m=>m.shape),p=new yt(u),d=[],c=new Array(u.length-1);if(c.length>0){c[0]=u[0][1],d.push({type:"int32",data:[c[0]]});for(let m=1;m<c.length;m++)c[m]=c[m-1]+u[m][1],d.push({type:"int32",data:[c[m]]})}let l=e.runWebGPUProgram(p,a,a[0].dtype,d);a.forEach(m=>e.disposeData(m.dataId));let h=I({inputs:{x:l},backend:e,attrs:{shape:n}});return e.disposeData(l.dataId),h}function xl(o,t,e){let i=Vo.computeOutShape(o.map(s=>s.shape),t);return{tensors2D:o.map(s=>I({inputs:{x:s},backend:e,attrs:{shape:[Ho.sizeFromShape(s.shape.slice(0,t)),Ho.sizeFromShape(s.shape.slice(t))]}})),outShape:i}}function Ko(o){let{inputs:t,backend:e,attrs:i}=o,{axis:r}=i,s=Go.parseAxisParam(r,t[0].shape)[0],a=t.map(p=>p.shape);qi.assertParamsConsistent(a,s);let n=qi.computeOutShape(t.map(p=>p.shape),s);if(Go.sizeFromShape(n)===0)return e.makeTensorInfo(n,t[0].dtype,[]);let u=t.filter(p=>Go.sizeFromShape(p.shape)>0);return u.length===1?B({inputs:{x:u[0]},backend:e}):Ie(u,s,e)}var Yi={kernelName:Cl,backendName:"webgpu",kernelFunc:Ko};import{backend_util as ji,Conv2D as bl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as Xo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function yl(o,t,e,i,r=!1,s=null,a=!1,n=4,u=4,p=4){let d=F=>{switch(F){case 1:return"resData = f32(x[xIndex]);";case 3:return"resData = vec3<f32>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);";case 4:return"resData = vec4<f32>(x[xIndex / 4]);";default:throw new Error(`innerElementSize ${F} is not supported.`)}},c=F=>{switch(F){case 1:return"return f32(W[row * uniforms.wShape[3] + col]);";case 4:return"return vec4<f32>(W[(row * uniforms.wShape[3] + col) / 4]);";default:throw new Error(`innerElementSize ${F} is not supported.`)}},l=o?`
      let coord = vec4<i32>(batch, xRow, xCol, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, xRow, xCol);
      `,h=o?`
      let coords = vec4<i32>(
        batch,
        row / outWidth,
        row % outWidth,
        col);
      `:`
      let coords = vec4<i32>(
        batch,
        row,
        col / outWidth,
        col % outWidth);
      `,m=o?"uniforms.xShape[1]":"uniforms.xShape[2]",f=o?"uniforms.xShape[2]":"uniforms.xShape[3]",g=o?"row":"col",w=o?"col":"row",b=`
      let inChannels = uniforms.wShape[2];
      let outWidth = ${o?"uniforms.outShape[2]":"uniforms.outShape[3]"};
      let outRow = ${g} / outWidth;
      let outCol = ${g} % outWidth;

      let WRow = ${w} / (uniforms.filterDims[1] * inChannels);
      let WCol = ${w} / inChannels % uniforms.filterDims[1];
      let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * WRow - uniforms.pads[0];
      let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * WCol - uniforms.pads[1];
      let xCh = ${w} % inChannels;
      var resData = ${z(n)}(0.0);
      // The bounds checking is always needed since we use it to pad zero for
      // the 'same' padding type.
      if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${f}) {
        ${l}
        let xIndex = getIndexFromCoords4D(coord, uniforms.xShape);
        ${d(n)}
      }
      return resData;`,v=o?t&&i?`
      ${b}`:`
      if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${b}
      }
      return ${z(n)}(0.0);`:i&&e?`
      ${b}`:`
      if (row < uniforms.dimInner && col < uniforms.dimBOuter) {
        ${b}
      }
      return ${z(n)}(0.0);`,k=`${c(u)}`,R=z(p),$=o?z(n):z(u),N=o?z(u):z(n);return`
      ${V(s,a,p===4,4)}
      fn mm_readA(batch: i32, row : i32, col : i32) -> ${$} {
        ${o?v:k}
      }

      fn mm_readB(batch: i32, row : i32, col : i32) -> ${N} {
        ${o?k:v}
      }

      fn mm_write(batch: i32, row : i32, col : i32, valueIn : ${R}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)
        {
        var value = valueIn;
        let outWidth = ${o?"uniforms.outShape[2]":"uniforms.outShape[3]"};
        ${h}
        ${Y(r,s)}
        setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }`}var St=class{constructor(t,e,i,r,s=!1,a=null,n=!1,u=!1){this.variableNames=["x","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=t.outShape,this.isChannelsLast=t.dataFormat==="channelsLast",this.isVec4=((t.inChannels%4===0||t.inChannels%3===0)&&this.isChannelsLast||t.outWidth%4===0&&!this.isChannelsLast)&&t.outChannels%4===0,this.dispatchLayout=this.isChannelsLast?{x:[3],y:[1,2],z:[0]}:{x:[2,3],y:[1],z:[0]},this.workgroupSize=Ae(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=Fe(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4?(this.outputComponent=4,this.isChannelsLast&&t.inChannels%4!==0?(this.innerElementSize=3,this.variableComponents=[1,4]):(this.innerElementSize=4,this.variableComponents=[4,4]),s&&(this.variableNames.push("bias"),this.variableComponents.push(4)),n&&(this.variableNames.push("preluActivationWeights"),this.variableComponents.push(4))):(this.innerElementSize=this.elementsPerThread[0],s&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights")),this.sequentialAccessByThreads=u,this.addBias=s,this.activation=a,this.hasPreluActivationWeights=n,this.tileAOuter=this.workgroupSize[1]*this.elementsPerThread[1],this.tileBOuter=this.workgroupSize[0]*this.elementsPerThread[0],this.tileInner=Math.max(this.workgroupSize[0]*this.innerElementSize,this.workgroupSize[1]),this.fitAOuter=e%this.tileAOuter===0,this.fitBOuter=i%this.tileBOuter===0,this.fitInner=r%this.tileInner===0,this.shaderKey=`conv2DMM_${this.elementsPerThread}_${this.activation}}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.innerElementSize}_${this.isChannelsLast}_${this.sequentialAccessByThreads}`}getUserCode(){let t=this.isVec4?me(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner):fe(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner,!1,null,this.sequentialAccessByThreads),e=this.isVec4?[this.innerElementSize,4,4]:[1,1,1];return`
    ${yl(this.isChannelsLast,this.fitAOuter,this.fitBOuter,this.fitInner,this.addBias,this.activation,this.hasPreluActivationWeights,e[0],e[1],e[2])}
    ${t}
  `}};var wt=class{constructor(t,e=!1,i=null,r=!1){this.variableNames=["x","W"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>,",this.workgroupSize=[4,4,8],this.outputShape=t.outShape,this.isChannelsLast=t.dataFormat==="channelsLast",this.dispatchLayout=this.isChannelsLast?{x:[2],y:[1],z:[0,3]}:{x:[3],y:[2],z:[0,1]},this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=e,this.activation=i,this.hasPreluActivationWeights=r,e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`conv2dnaive_${this.activation}_${this.isChannelsLast}`}getUserCode(){return`
       ${V(this.activation,this.hasPreluActivationWeights,!1,4)}
       fn readInp(batch : i32, row : i32, col : i32, chan : i32) -> f32{
         let coords = vec4<i32>(batch, row, col, chan);
         if (coordsInBounds4D(coords, uniforms.xShape)) {
           return  getX(batch, row, col, chan);
         } else {
          return 0.0;
         }
       }
       fn readFilt(row : i32, col : i32, xChannel : i32, outChannel : i32) -> f32{
         let coords = vec4<i32>(row, col, xChannel, outChannel);
         if(coordsInBounds4D(coords, uniforms.wShape)) {
           return getW(row, col, xChannel, outChannel);
          } else {
            return 0.0;
          }
       }
       fn writeResult(batch : i32, row : i32, col : i32, chan : i32, valueIn : f32) {
         let coords = ${this.isChannelsLast?"vec4<i32>(batch, row, col, chan);":"vec4<i32>(batch, chan, row, col);"}
         if (coordsInBounds4D(coords, uniforms.outShape)) {
           var value = valueIn;
           ${Y(this.addBias,this.activation)}
           setOutputAtCoords(coords.x, coords.y, coords.z, coords.w, value);
         }
       }
       ${x("index")} {
         let coords = getOutputCoords();
         let batch = coords[0];
         let outChannel = ${this.isChannelsLast?"coords[3];":"coords[1];"}
         let outRow = ${this.isChannelsLast?"coords[1];":"coords[2];"}
         let outCol = ${this.isChannelsLast?"coords[2];":"coords[3];"}
         var acc : f32 = 0.0;
         for (var row = 0; row < uniforms.filterDims[0]; row = row + 1) {
           for (var col = 0; col < uniforms.filterDims[1]; col = col + 1) {
             let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * row - uniforms.pads[0];
             let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * col - uniforms.pads[1];
             for (var xChannel = 0; xChannel < ${this.isChannelsLast?"uniforms.xShape[3];":"uniforms.xShape[1];"} xChannel = xChannel + 1) {
               ${this.isChannelsLast?"let v = readInp(batch, xRow, xCol, xChannel);":"let v = readInp(batch, xChannel, xRow, xCol);"}
               let f = readFilt(row, col, xChannel, outChannel);
               acc = acc + v * f;
             }
           }
         }
         writeResult(batch, outRow, outCol, outChannel, acc);
       }
     `}};var bt=class{constructor(t,e){this.variableNames=["x"],this.uniforms=`pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, outWidth : i32, itemsPerBlockRow : i32,
       inChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=e,this.shaderKey=`im2col_${this.isChannelsLast}`}getUserCode(){let t=this.isChannelsLast?1:2,e=this.isChannelsLast?2:3,i=this.isChannelsLast?"coords[1]":"coords[2]",r=this.isChannelsLast?"coords[2]":"coords[1]",s=this.isChannelsLast?"getX(batch, xRow, xCol, ch)":"getX(batch, ch, xRow, xCol)";return`
    ${x("index")} {
      let coords = getCoordsFromIndex(index);
      if(index < uniforms.size) {
        let batch = coords[0];
        let row = ${i};
        let col = ${r};
        let offsetY = (row / uniforms.outWidth) * uniforms.strides[0] - uniforms.pads[0];
        let xRow = offsetY + uniforms.dilations[0] * (col / uniforms.itemsPerBlockRow);
        var value = 0.0;
        if(xRow < uniforms.xShape[${t}] && xRow >= 0) {
          let offsetX = (row % uniforms.outWidth) * uniforms.strides[1] -
              uniforms.pads[1];
          let xCol = offsetX + uniforms.dilations[1] * ((col %
              uniforms.itemsPerBlockRow) / uniforms.inChannels);
          let ch = col % uniforms.inChannels;
          if(xCol < uniforms.xShape[${e}] && xCol >= 0) {
            value = ${s};
          }
        }
        setOutputAtIndex(index, value);
      }
    }
   `}};function vt(o,t){let e=o.length;return e>=3?t?[...o.slice(0,-3),o[e-3]*o[e-2],o[e-1]]:[...o.slice(0,-3),o[e-3],o[e-2]*o[e-1]]:!t&&e===1&&o[0]>1?[o[0],1]:null}function Sl({x:o,filter:t,convInfo:e,backend:i,bias:r=null,preluActivationWeights:s=null,leakyreluAlpha:a=0,activation:n=null}){let u=e.dataFormat==="channelsLast",p=!u,d=!1,c=u&&e.filterHeight===e.inHeight&&e.filterWidth===e.inWidth&&e.padInfo.type==="VALID",l=[],h,m;if(c){let w=e.inHeight*e.inWidth*e.inChannels;h=I({inputs:{x:o},backend:i,attrs:{shape:[1,e.batchSize,w]}}),m=I({inputs:{x:t},backend:i,attrs:{shape:[1,w,e.outChannels]}})}else h=I({inputs:{x:o},backend:i,attrs:{shape:u?[e.batchSize,e.inHeight*e.inWidth,e.inChannels]:[e.batchSize,e.inChannels,e.inHeight*e.inWidth]}}),m=I({inputs:{x:t},backend:i,attrs:{shape:[1,e.inChannels,e.outChannels]}});if(l.push(h),l.push(m),s!=null){let w=vt(s.shape,u);w!=null&&(s=I({inputs:{x:s},backend:i,attrs:{shape:w}}),l.push(s))}if(r!=null){let w=vt(r.shape,u);w!=null&&(r=I({inputs:{x:r},backend:i,attrs:{shape:w}}),l.push(r))}let f=ge({a:u?h:m,b:u?m:h,transposeA:p,transposeB:d,backend:i,bias:r,activation:n,preluActivationWeights:s,leakyreluAlpha:a}),g=I({inputs:{x:f},backend:i,attrs:{shape:e.outShape}});l.push(f);for(let w of l)i.disposeData(w.dataId);return g}function wl({x:o,filter:t,convInfo:e,backend:i,bias:r=null,preluActivationWeights:s=null,leakyreluAlpha:a=0,activation:n=null}){let{filterWidth:u,filterHeight:p,inChannels:d,strideWidth:c,strideHeight:l,padInfo:h,outWidth:m,outHeight:f,dilationWidth:g,dilationHeight:w,dataFormat:b}=e,v=b==="channelsLast",k=u*p*d,R=f*m,$=v?[e.batchSize,R,k]:[e.batchSize,k,R],N=new bt($,v),L=[{type:"int32",data:[h.top,h.left]},{type:"int32",data:[l,c]},{type:"int32",data:[w,g]},{type:"int32",data:[m]},{type:"int32",data:[d*u]},{type:"int32",data:[d]}],F=i.runWebGPUProgram(N,[o],o.dtype,L),W=[];W.push(F);let E=I({inputs:{x:t},backend:i,attrs:{shape:[1,k,-1]}});if(W.push(E),s!=null){let G=vt(s.shape,v);G!=null&&(s=I({inputs:{x:s},backend:i,attrs:{shape:G}}),W.push(s))}if(r!=null){let G=vt(r.shape,v);G!=null&&(r=I({inputs:{x:r},backend:i,attrs:{shape:G}}),W.push(r))}let M=ge({a:v?F:E,b:v?E:F,transposeA:!v,transposeB:!1,backend:i,bias:r,activation:n,preluActivationWeights:s,leakyreluAlpha:a}),O=I({inputs:{x:M},backend:i,attrs:{shape:e.outShape}});W.push(M);for(let G of W)i.disposeData(G.dataId);return O}function It({x:o,filter:t,convInfo:e,backend:i,bias:r=null,preluActivationWeights:s=null,leakyreluAlpha:a=0,activation:n=null}){let u=r!=null,p=s!=null,d=e.dataFormat==="channelsLast",c=d&&e.filterHeight===e.inHeight&&e.filterWidth===e.inWidth&&e.padInfo.type==="VALID",l=Xo().getBool("WEBGPU_USE_NAIVE_CONV2D_DEBUG");if(!l&&(c||e.filterHeight===1&&e.filterWidth===1&&e.dilationHeight===1&&e.dilationWidth===1&&e.strideHeight===1&&e.strideWidth===1&&(e.padInfo.type==="SAME"||e.padInfo.type==="VALID")))return Sl({x:o,filter:t,convInfo:e,backend:i,bias:r,activation:n,preluActivationWeights:s,leakyreluAlpha:a});let h=Xo().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),m=h>-1?h:i.thresholdToIncreaseWorkgroups,f=e.batchSize*Math.ceil(e.outHeight*e.outWidth/32)*Math.ceil(e.outChannels/32);if(Xo().getBool("WEBGPU_CONV_SEPARATE_IM2COL_SHADER")||f<=m)return wl({x:o,filter:t,convInfo:e,backend:i,bias:r,preluActivationWeights:s,leakyreluAlpha:a,activation:n});let g,w=[e.padInfo.top,e.padInfo.left],b=[{type:"int32",data:[e.filterHeight,e.filterWidth]},{type:"int32",data:[...w]},{type:"int32",data:[e.strideHeight,e.strideWidth]},{type:"int32",data:[e.dilationHeight,e.dilationWidth]}];if(l)g=new wt(e,u,n,p);else{let $=d?e.outHeight*e.outWidth:e.outChannels,N=d?e.outChannels:e.outHeight*e.outWidth,L=e.filterHeight*e.filterWidth*e.inChannels;b.push({type:"int32",data:[$]},{type:"int32",data:[N]},{type:"int32",data:[L]});let F=i.adapterInfo.isIntel();g=new St(e,$,N,L,u,n,p,F)}let v=[],k=[o,t];u&&(!d&&r.shape.length===1&&(r=I({inputs:{x:r},backend:i,attrs:{shape:[r.shape[0],1,1]}}),v.push(r)),k.push(r)),p&&(!d&&s.shape.length===1&&(s=I({inputs:{x:s},backend:i,attrs:{shape:[s.shape[0],1,1]}}),v.push(s)),k.push(s)),n==="leakyrelu"&&(b.push({type:"float32",data:[a]}),g.uniforms+=" alpha : f32,");let R=i.runWebGPUProgram(g,k,o.dtype,b);for(let $ of v)i.disposeData($.dataId);return R}function vl(o){let{inputs:t,attrs:e,backend:i}=o,{x:r,filter:s}=t,{strides:a,pad:n,dataFormat:u,dilations:p,dimRoundingMode:d}=e,c=ji.convertConv2DDataFormat(u),l=ji.computeConv2DInfo(r.shape,s.shape,a,p,n,d,!1,c);return It({x:r,filter:s,convInfo:l,backend:i})}var Qi={kernelName:bl,backendName:"webgpu",kernelFunc:vl};import{backend_util as Zi,Conv2DBackpropFilter as Il}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var kt=class{constructor(t){this.variableNames=["dy","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>,",this.workgroupSize=[64,1,1],this.size=!1,this.isVec4=!1,this.workPerThread=1,this.outputShape=t.inShape,this.isChannelsLast=t.dataFormat==="channelsLast",this.isVec4=this.isChannelsLast&&t.outChannels%4===0&&t.inChannels%4===0,this.isVec4?(this.workPerThread=2,this.outputComponent=4,this.workgroupSize=[4,4,4],this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[4,this.workPerThread,1])):(this.size=!0,this.workPerThread=1,this.workgroupSize=[64,1,1],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize)),this.shaderKey=`conv2DDerInput_${this.isChannelsLast}_${this.isVec4}_${this.workPerThread}`}getUserCode(){let t=this.isChannelsLast?1:2,e=this.isChannelsLast?2:3,i=this.isChannelsLast?3:1,r=`
    ${x()} {
      let batch = i32(globalId.z) / uniforms.outShape[1];
      let r = i32(globalId.z) % uniforms.outShape[1];
      let c = i32(globalId.y) * ${this.workPerThread};
      let d1 = i32(globalId.x) * 4;

      let dyCorner = vec2<i32>(r, c) - uniforms.pads;

      // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
      // ? = to be determined. : = across all values in that axis.
      var dotProd: array<vec4<f32>, ${this.workPerThread}>;
      for (var i = 0; i < ${this.workPerThread}; i++) {
        dotProd[i] = vec4<f32>(0.0);
      }
      for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
        let dyR = f32(dyCorner.x + wR) / f32(uniforms.strides.x);
        let wRPerm = uniforms.filterDims.x - 1 - wR;
        if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) ||
            fract(dyR) > 0.0) {
          continue;
        }
        let idyR = i32(dyR);

        for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
          let dyC = f32(dyCorner.y + wC) / f32(uniforms.strides.y);
          let dyC2 = f32(dyCorner.y + 1 + wC) / f32(uniforms.strides.y);
          let wCPerm = uniforms.filterDims.y - 1 - wC;
          var bDyCVal = true;
          var bDyCVal2 = true;
          if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
              fract(dyC) > 0.0) {
            bDyCVal = false;
          }
          if (dyC2 < 0.0 || dyC2 >= f32(uniforms.outBackprop[2]) ||
              fract(dyC2) > 0.0) {
            bDyCVal2 = false;
          }

          let idyC = i32(dyC);
          let idyC2 = i32(dyC2);
          if (bDyCVal && bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
              xValue = getDy(batch, idyR, idyC2, d2);
              dotProd[1] = dotProd[1] + vec4<f32>(dot(xValue, wValue0),
                                                  dot(xValue, wValue1),
                                                  dot(xValue, wValue2),
                                                  dot(xValue, wValue3));
            }
          } else if (bDyCVal) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[0] = dotProd[0] + tmpval;
            }
          } else if (bDyCVal2) {
            let d2Length = uniforms.outBackprop[3];
            for (var d2 = 0; d2 < d2Length; d2 = d2 + 4) {
              let wValue0 = getW(wRPerm, wCPerm, d1, d2);
              let wValue1 = getW(wRPerm, wCPerm, d1 + 1, d2);
              let wValue2 = getW(wRPerm, wCPerm, d1 + 2, d2);
              let wValue3 = getW(wRPerm, wCPerm, d1 + 3, d2);
              var xValue =  getDy(batch, idyR, idyC2, d2);
              let tmpval = vec4<f32>(dot(xValue, wValue0),
                                     dot(xValue, wValue1),
                                     dot(xValue, wValue2),
                                     dot(xValue, wValue3));
              dotProd[1] = dotProd[1] + tmpval;
            }
          }
        }
      }

      for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
        let coords = vec4<i32>(batch, r, c + i, d1);
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], dotProd[i]);
        }
      }
    }
    `;return this.isVec4?`
    ${r}
    `:`
    ${x("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[${i}];

        let dyCorner = vec2<i32>(coords[${t}], coords[${e}]) - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + 1) {
          let dyR = (f32(dyRCorner) + f32(wR)) / f32(uniforms.strides.x);
          let wRPerm = uniforms.filterDims.x - 1 - wR;
          if (dyR < 0.0 || dyR >= f32(uniforms.outBackprop[1]) || fract(dyR) > 0.0 ||
              wRPerm < 0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + 1) {
            let dyC = (f32(dyCCorner) + f32(wC)) / f32(uniforms.strides.y);
            let wCPerm = uniforms.filterDims.y - 1 - wC;
            if (dyC < 0.0 || dyC >= f32(uniforms.outBackprop[2]) ||
                fract(dyC) > 0.0 || wCPerm < 0) {
              continue;
            }
            let idyC = i32(dyC);

            for (var d2 = 0; d2 < uniforms.outBackprop[3]; d2 = d2 + 1) {
              let xValue = ${this.isChannelsLast?"getDy(batch, idyR, idyC, d2)":"getDy(batch, d2, idyR, idyC)"};
              let wValue = getW(wRPerm, wCPerm, d1, d2);
              dotProd = dotProd + xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},Rt=class{constructor(t){this.variableNames=["x","dy"],this.uniforms="pads : vec2<i32>, strides : vec2<i32>, batchSize : i32, outHeight : i32, outWidth : i32, inHeight : i32, inWidth : i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.filterShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=t.dataFormat==="channelsLast",this.shaderKey=`conv2DDerFilter_${this.isChannelsLast}`}getUserCode(){return`
    ${x("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let d2 = coords[3];

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b = b + 1) {
          for (var yR = 0; yR < uniforms.outHeight; yR = yR + 1) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];
            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC = yC + 1) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              if (${this.isChannelsLast}) {
                let dyValue = getDy(b, yR, yC, d2);
                let xValue = getX(b, xR, xC, d1);
                dotProd = dotProd + xValue * dyValue;
              } else {
                let dyValue = getDy(b, d2, yR, yC);
                let xValue = getX(b, d1, xR, xC);
                dotProd = dotProd + xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},Dt=class{constructor(t){this.variableNames=["x","dy"],this.uniforms=`pads : vec3<i32>, strides : vec3<i32>, batchSize : i32, outDepth : i32,
       outHeight : i32, outWidth : i32, inDepth : i32, inHeight : i32, inWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.filterShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3DDerFilter"}getUserCode(){return`
    ${x("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wF = coords.x;
        let wR = coords.y;
        let wC = coords.z;
        let d1 = coords.w;
        let d2 = coords.u;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yF = 0; yF < uniforms.outDepth; yF++) {
            let xF = wF + yF * uniforms.strides[0] - uniforms.pads[0];
            if (xF < 0 || xF >= uniforms.inDepth) {
              continue;
            }

            for (var yR = 0; yR < uniforms.outHeight; yR++) {
              let xR = wR + yR * uniforms.strides[1] - uniforms.pads[1];
              if (xR < 0 || xR >= uniforms.inHeight) {
                continue;
              }

              for (var yC = 0; yC < uniforms.outWidth; yC++) {
                let xC = wC + yC * uniforms.strides[2] - uniforms.pads[2];
                if (xC < 0 || xC >= uniforms.inWidth) {
                  continue;
                }

                let dyValue = getDy(b, yF, yR, yC, d2);
                let xValue = getX(b, xF, xR, xC, d1);
                dotProd += xValue * dyValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}},Pt=class{constructor(t){this.variableNames=["dy","W"],this.uniforms=`filterDims : vec3<i32>, pads : vec3<i32>, strides : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32, outChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3DDerInput"}getUserCode(){return`
    ${x("index")} {
      if(index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let d1 = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyFCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let dyF = f32(dyFCorner + wF) / f32(uniforms.strides[0]);
          if (dyF < 0.0 || dyF >= f32(uniforms.outDepth) || fract(dyF) > 0.0) {
            continue;
          }
          let idyF = i32(dyF);

          let wFPerm = uniforms.filterDims[0] - 1 - wF;

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            let wRPerm = uniforms.filterDims[1] - 1 - wR;

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let wCPerm = uniforms.filterDims[2] - 1 - wC;

              for (var d2 = 0; d2 < uniforms.outChannels; d2++) {
                let xValue = getDy(batch, idyF, idyR, idyC, d2);
                let wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
  `}};function kl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,dy:s}=t,{strides:a,pad:n,dataFormat:u,dimRoundingMode:p,filterShape:d}=i,c=Zi.convertConv2DDataFormat(u),l=Zi.computeConv2DInfo(r.shape,d,a,1,n,p,!1,c),h=new Rt(l),m=[{type:"int32",data:[l.padInfo.top,l.padInfo.left]},{type:"int32",data:[l.strideHeight,l.strideWidth]},{type:"int32",data:[l.batchSize]},{type:"int32",data:[l.outHeight]},{type:"int32",data:[l.outWidth]},{type:"int32",data:[l.inHeight]},{type:"int32",data:[l.inWidth]}];return e.runWebGPUProgram(h,[r,s],r.dtype,m)}var Ji={kernelName:Il,backendName:"webgpu",kernelFunc:kl};import{backend_util as es,Conv2DBackpropInput as Pl,env as $l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Rl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Dl(o=4){let t=s=>{switch(s){case 1:return"return W[getIndexFromCoords4D(coord, uniforms.wShape)];";case 4:return`
            let coord1 = vec4<i32>(coordX, coordY, col + 1, rowInner);
            let coord2 = vec4<i32>(coordX, coordY, col + 2, rowInner);
            let coord3 = vec4<i32>(coordX, coordY, col + 3, rowInner);
            let v0 = W[getIndexFromCoords4D(coord, uniforms.wShape)];
            let v1 = W[getIndexFromCoords4D(coord1, uniforms.wShape)];
            let v2 = W[getIndexFromCoords4D(coord2, uniforms.wShape)];
            let v3 = W[getIndexFromCoords4D(coord3, uniforms.wShape)];
            return vec4<f32>(v0, v1, v2, v3);
            `;default:throw new Error(`innerElementSize ${s} is not supported.`)}},i=`if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${`
      let outRow = row / uniforms.outShape[2];
      let outCol = row % uniforms.outShape[2];

      let WRow = col / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
      let WCol = col / uniforms.outBackprop[3] % uniforms.filterDims[1];
      let xR = f32(outRow - uniforms.pads[0] + WRow) / f32(uniforms.strides[0]);
      let xC = f32(outCol - uniforms.pads[1] + WCol) / f32(uniforms.strides[1]);
      if (xR < 0.0 || xR >= f32(uniforms.outBackprop[1]) || fract(xR) > 0.0) {
        return ${z(o)}(0.0);
      }
      if (xC < 0.0 || xC >= f32(uniforms.outBackprop[2]) || fract(xC) > 0.0) {
        return ${z(o)}(0.0);
      }
      let coord = vec4<i32>(
          batch,
          i32(xR),
          i32(xC),
          col % uniforms.outBackprop[3]);
      return x[getIndexFromCoords4D(coord, uniforms.xShape)/${o}];`}
      }
      return ${z(o)}(0.0);`;return`
  fn mm_readA(batch: i32, row : i32, col : i32) -> ${z(o)} {
    ${i}
  }

  fn mm_readB(batch: i32, row : i32, col : i32) -> ${z(o)} {
    let coordX = uniforms.filterDims.x - 1 -
        row / (uniforms.filterDims[1] * uniforms.outBackprop[3]);
    let coordY = uniforms.filterDims.y - 1 -
        (row / uniforms.outBackprop[3]) % uniforms.filterDims[1];
    if (row < uniforms.dimInner && col < uniforms.dimBOuter &&
        coordX >= 0 && coordY >= 0) {
      let rowInner = row % uniforms.outBackprop[3];
      let coord = vec4<i32>(coordX, coordY, col, rowInner);
      ${t(o)}
    }
    return ${z(o)}(0.0);
  }

  fn mm_write(batch: i32, row : i32, col : i32, valueInput : ${z(o)}) {
    if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
      var value = valueInput;
      let outCoord = vec4<i32>(
          batch,
          row / uniforms.outShape[2],
          row % uniforms.outShape[2],
          col);
      result[getIndexFromCoords4D(outCoord, uniforms.outShape)/${o}] = value;
    }
  }`}var $t=class{constructor(t){this.variableNames=["x","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, outBackprop : vec4<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=t.inShape,Rl.assert(t.dataFormat==="channelsLast",()=>"TODO: NCHW is unimplemented"),this.isVec4=t.inChannels%4===0&&t.outChannels%4===0,this.dispatchLayout={x:[3],y:[1,2],z:[0]},this.workgroupSize=Ae(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=Fe(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4&&(this.outputComponent=4,this.variableComponents=[4,1]),this.shaderKey=`conv2DDerInputMM_${this.isVec4}_${this.elementsPerThread}`}getUserCode(){let t=this.isVec4?me(this.elementsPerThread,this.workgroupSize):fe(this.elementsPerThread,this.workgroupSize);return`
    ${Dl(this.isVec4?4:1)}
    ${t}
    `}};function Nl(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,filter:s}=t,{inputShape:a,strides:n,pad:u,dataFormat:p,dimRoundingMode:d}=i,c=es.convertConv2DDataFormat(p),l=es.computeConv2DInfo(a,s.shape,n,1,u,d,!1,c),h=[{type:"int32",data:[l.filterHeight,l.filterWidth]},{type:"int32",data:[l.filterHeight-1-l.padInfo.top,l.filterWidth-1-l.padInfo.left]},{type:"int32",data:[l.strideHeight,l.strideWidth]},{type:"int32",data:[l.batchSize,l.outHeight,l.outWidth,l.outChannels]}],m;if($l().getBool("WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE")||l.dataFormat!=="channelsLast")m=new kt(l);else{m=new $t(l);let f=l.inHeight*l.inWidth,g=l.inChannels,w=l.filterHeight*l.filterWidth*l.outChannels;h.push({type:"uint32",data:[f]},{type:"uint32",data:[g]},{type:"uint32",data:[w]})}return e.runWebGPUProgram(m,[r,s],"float32",h)}var ts={kernelName:Pl,backendName:"webgpu",kernelFunc:Nl};import{backend_util as zl,Conv3D as Al,upcastType as Fl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Nt=class{constructor(t){this.variableNames=["x","W"],this.uniforms="filterDims: vec3<i32>, pads: vec3<i32>, strides: vec3<i32>, dilations: vec3<i32>,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="conv3dnaive"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords.x;
        let d2 = coords.u;

        let xFRCCorner = vec3<i32>(coords.y, coords.z, coords.w) * uniforms.strides - uniforms.pads;
        let xFCorner = xFRCCorner.x;
        let xRCorner = xFRCCorner.y;
        let xCCorner = xFRCCorner.z;

        let inputDepthNearestVec4 = (uniforms.xShape.u / 4) * 4;
        let inputDepthVec4Remainder = uniforms.xShape.u % 4;

        var dotProd = 0.0;
        for (var wF = 0; wF < uniforms.filterDims[0]; wF++) {
          let xF = xFCorner + wF * uniforms.dilations[0];
          if (xF < 0 || xF >= uniforms.xShape.y) {
            continue;
          }

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let xR = xRCorner + wR * uniforms.dilations[1];
            if (xR < 0 || xR >= uniforms.xShape.z) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let xC = xCCorner + wC * uniforms.dilations[2];
              if (xC < 0 || xC >= uniforms.xShape.w) {
                continue;
              }

              for (var d1 = 0; d1 < inputDepthNearestVec4; d1 += 4) {
                let xValues = vec4<f32>(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                let wValues = vec4<f32>(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (inputDepthVec4Remainder == 1) {
                dotProd += getX(batch, xF, xR, xC, inputDepthNearestVec4) *
                  getW(wF, wR, wC, inputDepthNearestVec4, d2);
              } else if (inputDepthVec4Remainder == 2) {
                let xValues = vec2<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1)
                );
                let wValues = vec2<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (inputDepthVec4Remainder == 3) {
                let xValues = vec3<f32>(
                  getX(batch, xF, xR, xC, inputDepthNearestVec4),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                  getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2)
                );
                let wValues = vec3<f32>(
                  getW(wF, wR, wC, inputDepthNearestVec4, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 1, d2),
                  getW(wF, wR, wC, inputDepthNearestVec4 + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }`}};function Ll(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s}=t,{strides:a,pad:n,dilations:u}=i,p=zl.computeConv3DInfo(r.shape,s.shape,a,u,n),d=[p.padInfo.front,p.padInfo.top,p.padInfo.left],c=[{type:"int32",data:[p.filterDepth,p.filterHeight,p.filterWidth]},{type:"int32",data:[...d]},{type:"int32",data:[p.strideDepth,p.strideHeight,p.strideWidth]},{type:"int32",data:[p.dilationDepth,p.dilationHeight,p.dilationWidth]}],l=new Nt(p),h=Fl(r.dtype,s.dtype);return e.runWebGPUProgram(l,[r,s],h,c)}var os={kernelName:Al,backendName:"webgpu",kernelFunc:Ll};import{backend_util as Tl,Conv3DBackpropFilterV2 as _l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Bl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,dy:s}=t,{strides:a,pad:n,filterShape:u}=i,p=Tl.computeConv3DInfo(r.shape,u,a,1,n),d=new Dt(p),c=[{type:"int32",data:[p.padInfo.front,p.padInfo.top,p.padInfo.left]},{type:"int32",data:[p.strideDepth,p.strideHeight,p.strideWidth]},{type:"int32",data:[p.batchSize]},{type:"int32",data:[p.outDepth]},{type:"int32",data:[p.outHeight]},{type:"int32",data:[p.outWidth]},{type:"int32",data:[p.inDepth]},{type:"int32",data:[p.inHeight]},{type:"int32",data:[p.inWidth]}];return e.runWebGPUProgram(d,[r,s],s.dtype,c)}var rs={kernelName:_l,backendName:"webgpu",kernelFunc:Bl};import{backend_util as El,Conv3DBackpropInputV2 as Ul}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Wl(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,filter:s}=t,{strides:a,pad:n,inputShape:u}=i,p=El.computeConv3DInfo(u,s.shape,a,1,n),d=new Pt(p),c=[{type:"int32",data:[p.filterDepth,p.filterHeight,p.filterWidth]},{type:"int32",data:[p.filterDepth-1-p.padInfo.front,p.filterHeight-1-p.padInfo.top,p.filterWidth-1-p.padInfo.left]},{type:"int32",data:[p.strideDepth,p.strideHeight,p.strideWidth]},{type:"int32",data:[p.outDepth]},{type:"int32",data:[p.outHeight]},{type:"int32",data:[p.outWidth]},{type:"int32",data:[p.outChannels]}];return e.runWebGPUProgram(d,[r,s],r.dtype,c)}var is={kernelName:Ul,backendName:"webgpu",kernelFunc:Wl};import{Cos as Ml}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ol=P({opType:S.COS}),ss={kernelName:Ml,backendName:"webgpu",kernelFunc:Ol};import{Cosh as Vl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Hl=P({opType:S.COSH}),as={kernelName:Vl,backendName:"webgpu",kernelFunc:Hl};import{CropAndResize as Gl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zt=class{constructor(t,e,i,r){this.variableNames=["Image","Boxes","BoxInd"],this.uniforms="extrapolationValue : f32,",this.workgroupSize=[64,1,1],this.size=!0;let[s]=e;this.outputShape=[s,i[0],i[1],t],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.methodId=r==="bilinear"?1:0,this.cropHeightBiggerThan1=this.outputShape[1]>1,this.cropWidthBiggerThan1=this.outputShape[2]>1,this.shaderKey=`cropAndResize_${this.methodId}_${this.cropHeightBiggerThan1}_${this.cropWidthBiggerThan1}`}getUserCode(){let[t,e]=["f32(uniforms.imageShape[1] - 1)","f32(uniforms.imageShape[2] - 1)"],[i,r,s]=this.cropHeightBiggerThan1?[`(${t} / f32(uniforms.outShape[1] - 1))`,"(y2-y1) * height_ratio",`y1*${t} + f32(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${t}`],[a,n,u]=this.cropWidthBiggerThan1?[`(${e} / f32(uniforms.outShape[2] - 1))`,"(x2-x1) * width_ratio",`x1*${e} + f32(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${e}`];return`
    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let height_ratio = f32(${i});
        let width_ratio = f32(${a});
        let b = coords[0];
        let y = coords[1];
        let x = coords[2];
        let d = coords[3];
        // get box vals
        let y1 = getBoxes(b, 0);
        let x1 = getBoxes(b, 1);
        let y2 = getBoxes(b, 2);
        let x2 = getBoxes(b, 3);
        // get image in batch index
        let bInd = i32(round(getBoxInd(b)));
        if(bInd < 0 || bInd >= uniforms.outShape[0]) {
          return;
        }
        let height_scale = ${r};
        let width_scale = ${n};
        let in_y = ${s};
        if( in_y < 0.0 || in_y > ${t} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let in_x = ${u};
        if( in_x < 0.0 || in_x > ${e} ) {
          setOutputAtIndex(index, uniforms.extrapolationValue);
          return;
        }
        let sourceFracIndexCR = vec2<f32>(in_x,in_y);
        if(${this.methodId} == 1) {
          // Compute the four integer indices.
          let sourceFloorCR = vec2<i32>(sourceFracIndexCR);
          let sourceCeilCR = vec2<i32>(ceil(sourceFracIndexCR));
          let topLeft = getImage(bInd, sourceFloorCR.y, sourceFloorCR.x, d);
          let bottomLeft = getImage(bInd, sourceCeilCR.y, sourceFloorCR.x, d);
          let topRight = getImage(bInd, sourceFloorCR.y, sourceCeilCR.x, d);
          let bottomRight = getImage(bInd, sourceCeilCR.y, sourceCeilCR.x, d);
          let fracCR = sourceFracIndexCR - vec2<f32>(sourceFloorCR);
          let top = topLeft + (topRight - topLeft) * fracCR.x;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          let newValue = top + (bottom - top) * fracCR.y;
          setOutputAtIndex(index, newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          let sourceNearestCR = vec2<i32>(floor(
            sourceFracIndexCR + vec2<f32>(0.5,0.5)));
          let newValue = getImage(
            bInd, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutputAtIndex(index, newValue);
        }
      }
    }
    `}};var Kl=o=>{let{inputs:t,backend:e,attrs:i}=o,{image:r,boxes:s,boxInd:a}=t,{cropSize:n,method:u,extrapolationValue:p}=i,d=new zt(r.shape[3],s.shape,n,u),c=[{type:"float32",data:[p]}];return e.runWebGPUProgram(d,[r,s,a],"float32",c)},ns={kernelName:Gl,backendName:"webgpu",kernelFunc:Kl};import{Cumprod as Xl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ce;(function(o){o.Prod="*",o.Sum="+"})(Ce||(Ce={}));var We=class{constructor(t,e,i,r){this.variableNames=["x"],this.uniforms="index : f32,",this.size=!0,this.workgroupSize=[128,1,1],this.outputShape=e,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.exclusive=i,this.reverse=r,this.op=t,this.shaderKey=`cum_${this.op}_${this.exclusive}_${this.reverse}`}getUserCode(){let t=this.outputShape.length,e=this.op===Ce.Prod?"1.0":"0.0",i=this.exclusive?e:`getX(${us(t,"coords",this.op)})`,r=this.outputShape[this.outputShape.length-1],s="",a="";return this.exclusive?(s=this.reverse?`end != ${r-1}`:"end != 0",a=this.reverse?"end + 1":"end - 1"):(s=this.reverse?`end + pow2 < ${r}`:"end >= pow2",a=this.reverse?"end + pow2":"end - pow2"),`
      ${x("index")} {
       if (index < uniforms.size) {
         var coords = getCoordsFromIndex(index);

         let end = ${ps(t,"coords",this.op)};
         var val = ${i};
         let pow2 = i32(pow(2.0, uniforms.index));
         if (${s}) {
           let idx = ${a};
           ${ps(t,"coords",this.op)} = idx;
           val ${this.op}= getX(${us(t,"coords",this.op)});
         }
         setOutputAtIndex(index, val);
       }
      }
    `}};function us(o,t,e){if(o===1)return`${t}`;if(o===2)return`${t}.x, ${t}.y`;if(o===3)return`${t}.x, ${t}.y, ${t}.z`;if(o===4)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw Error(`Cumulative ${e} for rank ${o} is not yet supported`)}function ps(o,t,e){if(o===1)return`${t}`;if(o===2)return`${t}.y`;if(o===3)return`${t}.z`;if(o===4)return`${t}.w`;throw Error(`Cumulative ${e} for rank ${o} is not yet supported`)}import{backend_util as qo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function At(o,t,e,i,r,s){let a=t.shape.length,n=qo.getAxesPermutation([i],a),u=t;n!=null&&(u=K({inputs:{x:t},backend:e,attrs:{perm:n}}));let p=qo.getInnerMostAxes(1,a)[0];if(p!==a-1)throw new Error(`WebGPU cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${i}`);let d=u.shape[p],c=B({inputs:{x:u},backend:e});for(let l=0;l<=Math.ceil(Math.log2(d))-1;l++){let h=new We(o,u.shape,!1,s),m=c,f=[{type:"float32",data:[l]}];c=e.runWebGPUProgram(h,[c],c.dtype,f),e.disposeData(m.dataId)}if(r){let l=new We(o,u.shape,r,s),h=c,m=[{type:"float32",data:[0]}];c=e.runWebGPUProgram(l,[c],c.dtype,m),e.disposeData(h.dataId)}if(n!=null){let l=qo.getUndoAxesPermutation(n),h=K({inputs:{x:c},backend:e,attrs:{perm:l}});return e.disposeData(c.dataId),e.disposeData(u.dataId),h}return c}function ql(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s,exclusive:a,reverse:n}=i;return At(Ce.Prod,r,e,s,a,n)}var ds={kernelName:Xl,backendName:"webgpu",kernelFunc:ql};import{Cumsum as Yl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function jl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s,exclusive:a,reverse:n}=i;return At(Ce.Sum,r,e,s,a,n)}var ls={kernelName:Yl,backendName:"webgpu",kernelFunc:jl};import{DenseBincount as Ql,util as Zl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Jl(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,weights:s}=t,{size:a,binaryOutput:n}=i,u=r.shape.length===1,d=Zl.sizeFromShape(s.shape)>0,c=s.dtype,l=u?[r.shape[0]]:[r.shape[0],r.shape[1]],h=u?[a]:[r.shape[0],a],m=_({backend:e,attrs:{shape:h,value:0,dtype:c}}),f=new ve(l,d,n),g=[{type:"int32",data:[a]}],w=d?[r,s]:[r];return e.runWebGPUProgram(f,w,c,g,m)}var cs={kernelName:Ql,backendName:"webgpu",kernelFunc:Jl};import{DepthToSpace as ec}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ft=class{constructor(t,e){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.uniforms="blockSize : i32,",this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`depthToSpace_${e}`,this.dataFormat=e}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let h = ${this.getHeightCoordString()};
          let w = ${this.getWidthCoordString()};
          let d = ${this.getDepthCoordString()};

          let in_h = h / uniforms.blockSize;
          let offset_h = h % uniforms.blockSize;
          let in_w = w / uniforms.blockSize;
          let offset_w = w % uniforms.blockSize;
          let offset_d = (offset_h * uniforms.blockSize + offset_w) *
            ${this.getOutputDepthSize()};
          let in_d = d + offset_d;

          let rlt = ${this.getInputSamplingString()};
          setOutputAtIndex(index, rlt);
        }
      }`}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?"uniforms.outShape[3]":"uniforms.outShape[1]"}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}};function tc(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{blockSize:s,dataFormat:a}=i,n=r.shape[0],u=a==="NHWC"?r.shape[1]:r.shape[2],p=a==="NHWC"?r.shape[2]:r.shape[3],d=a==="NHWC"?r.shape[3]:r.shape[1],c=u*s,l=p*s,h=d/(s*s),m=a==="NHWC"?[n,c,l,h]:[n,h,c,l],f=[{type:"int32",data:[s]}],g=new Ft(m,a);return e.runWebGPUProgram(g,[r],r.dtype,f)}var hs={kernelName:ec,backendName:"webgpu",kernelFunc:tc};import{backend_util as ms,DepthwiseConv2dNative as rc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Lt=class{constructor(t,e,i,r=!1,s=null,a=!1){this.variableNames=["x","W"],this.uniforms="pads : vec2<i32>, inDims : vec2<i32>,",this.workgroupSize=[16,16,1],this.outputShape=t,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),r&&this.variableNames.push("bias"),a&&this.variableNames.push("preluActivationWeights"),this.addBias=r,this.activation=s,this.hasPreluActivation=a,this.filterHeight=e,this.filterWidth=i,this.shaderKey=`depthwiseNCHW_${this.activation}_${this.filterHeight}_${this.filterWidth}`}getUserCode(){let t=this.filterWidth*this.filterHeight,e=this.workgroupSize[0]*this.workgroupSize[1]*this.workgroupSize[2],i=this.workgroupSize[1]+this.filterHeight-1,r=this.workgroupSize[0]+this.filterWidth-1;return`
      ${V(this.activation,this.hasPreluActivation,!1,4)}

      var<workgroup> mm_Asub : array<array<f32, ${r}>, ${i}>;
      var<workgroup> mm_Bsub : array<array<f32, ${this.filterWidth}>, ${this.filterHeight}>;
      fn readX(batch : i32, channel : i32, row : i32, col : i32) -> f32 {
        var value = 0.0;
        if (row >=0 && row < uniforms.inDims[0] && col >=0 && col < uniforms.inDims[1])
        {
          value = getX(batch, channel, row, col);
        }
        return value;
      }

      ${x()} {
        let coords = getOutputCoords();
        let batch = coords[0];
        let xRCCorner = vec2<i32>(coords.zw) - uniforms.pads;
        let channelMul = uniforms.wShape[3];
        let d1 = coords[1] / channelMul;
        let q = coords[1] % channelMul;

        let inputRowStart = xRCCorner.x;
        let inputColStart = xRCCorner.y;

        let localRow = i32(localId.y);
        let localCol = i32(localId.x);

        // Load one tile of X into local memory.
        for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${this.workgroupSize[1]}) {
          for (var inputCol = localCol; inputCol < ${r}; inputCol = inputCol + ${this.workgroupSize[0]}) {
            let rowOffset = inputRow - localRow;
            let colOffset = inputCol - localCol;
            mm_Asub[inputRow][inputCol] = readX(batch, d1, inputRowStart + rowOffset, inputColStart + colOffset);
          }
        }

        // Load one tile of W into local memory.
        var wIndex = i32(localIndex);
        ${t<e?`if (wIndex < ${t})`:`for(; wIndex < ${t}; wIndex = wIndex + ${e})`}

        {
          let wRow = wIndex / ${this.filterWidth};
          let wCol = wIndex % ${this.filterWidth};
          mm_Bsub[wRow][wCol] = getW(wRow, wCol, d1, q);
        }

        workgroupBarrier();

        var value = 0.0;
        for (var wR = 0; wR < ${this.filterHeight}; wR = wR + 1) {
          for (var wC = 0; wC < ${this.filterWidth}; wC = wC + 1) {
            let xVal = mm_Asub[localRow + wR][localCol + wC];
            let wVal = mm_Bsub[wR][wC];
            value = fma(xVal, wVal, value);
          }
        }
        ${Y(this.addBias,this.activation)}
        if (coordsInBounds4D(coords, uniforms.outShape)) {
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}};import{util as oc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ke=class{constructor(t,e=!1,i=null,r=!1){this.variableNames=["x","W"],this.uniforms="pads : vec2<i32>, inDims : vec2<i32>, virtualWidth : i32,",this.workgroupSize=[64,1,1],this.workPerThread=4,this.outputComponent=4,this.outputShape=t.outShape,this.virtualWidth=Math.ceil(this.outputShape[2]/this.workPerThread)*this.workPerThread;let s=[this.outputShape[0],this.outputShape[1],this.virtualWidth,this.outputShape[3]];this.dispatchLayout=y(s),this.dispatch=C(this.dispatchLayout,s,this.workgroupSize,[this.outputComponent*this.workPerThread,1,1]),oc.assert(t.dataFormat==="channelsLast",()=>"TODO: NCHW is unimplemented"),e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),this.convInfo=t,this.addBias=e,this.activation=i,this.hasPreluActivation=r,this.shaderKey=`depthwiseVec4_${i}_${this.convInfo.filterHeight}_${this.convInfo.filterWidth}_${this.convInfo.strideHeight}_${this.convInfo.strideWidth}_${this.workPerThread}`}getUserCode(){let t=(this.workPerThread-1)*this.convInfo.strideWidth+this.convInfo.filterWidth,e=this.convInfo.strideHeight,i=this.convInfo.strideWidth;return`
      ${V(this.activation,this.hasPreluActivation,!0,4)}
      fn readX(batch : i32, row : i32, col : i32, channel : i32) -> vec4<f32> {
        var value = vec4<f32>(0.0);
        if (col >=0 && col < uniforms.inDims[1]) {
          value = getX(batch, row, col, channel);
        }
        return value;
      }

      ${x("index")} {
        let width0 = uniforms.outShape[3] / ${this.outputComponent};
        let d1 = (index % width0) * ${this.outputComponent};
        var index1 = index / width0;
        let width1 = uniforms.virtualWidth / ${this.workPerThread};
        let c = (index1 % width1) * ${this.workPerThread};
        index1 = index1 / width1;
        let r = index1 % uniforms.outShape[1];
        let batch = index1 / uniforms.outShape[1];

        let xRCCorner = vec2<i32>(r, c) * vec2<i32>(${e}, ${i}) - uniforms.pads;

        let xRCorner = xRCCorner.x;
        let xCCorner = xRCCorner.y;
        var xVals : array<vec4<f32>, ${t}>;
        var dotProd : array<vec4<f32>, ${this.workPerThread}>;
        for (var i = 0; i < ${this.workPerThread}; i++) {
          dotProd[i] = vec4<f32>(0.0);
        }

        // Use constant instead of uniform can give better performance.
        for (var wR = 0; wR < ${this.convInfo.filterHeight}; wR = wR + 1) {
          let xR = xRCorner + wR;
          if (xR >=0 && xR < uniforms.inDims[0]) {
            for (var i = 0; i < ${t}; i++) {
              xVals[i] = readX(batch, xR, xCCorner + i, d1);
            }
            for (var wC = 0; wC < ${this.convInfo.filterWidth}; wC = wC + 1) {
              let wValue = getW(wR, wC, d1, 0);
              for (var i = 0; i < ${this.workPerThread}; i++) {
                dotProd[i] = fma(xVals[i * ${i} + wC], wValue, dotProd[i]);
              }
            }
          }
        }

        for (var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let coords = vec4<i32>(batch, r, c + i, d1);
          if (coordsInBounds4D(coords, uniforms.outShape)) {
            var value = dotProd[i];
            ${Y(this.addBias,this.activation)}
            setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
          }
        }
      }
    `}};var Re=class{constructor(t,e=!1,i=null,r=!1){this.variableNames=["x","W"],this.uniforms=`pads : vec2<i32>, inDims : vec2<i32>, filterHeight : i32,
      filterWidth : i32, strides : vec2<i32>, dilations : vec2<i32>,`,this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=t.dataFormat==="channelsLast",e&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),this.convInfo=t,this.addBias=e,this.activation=i,this.hasPreluActivation=r,this.shaderKey=`depthwise_${this.activation}_${this.isChannelsLast}`}getUserCode(){let t=this.isChannelsLast?"getX(batch, xR, xC, d1);":"getX(batch, d1, xR, xC);";return`
      ${V(this.activation,this.hasPreluActivation,!1,4)}

      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let batch = coords[0];
          let xRCCorner = vec2<i32>(coords.${this.isChannelsLast?"yz":"zw"}) * uniforms.strides - uniforms.pads;
          let d2 = coords[${this.isChannelsLast?3:1}];
          let channelMul = uniforms.wShape[3];
          let d1 = d2 / channelMul;
          let q = d2 % channelMul;

          let inputRowStart = xRCCorner.x;
          let inputColStart = xRCCorner.y;
          let inputRowEnd = inputRowStart + uniforms.filterHeight *
              uniforms.dilations[0];
          let inputColEnd = inputColStart + uniforms.filterWidth *
              uniforms.dilations[1];

          // Convolve x(?, ?, d1)|x(d1, ?, ?) with w(:, :, d1, q) to get
          // y(yR, yC, d2)|y(d2, yR, yC). ? = to be determined. : = across all
          // values in that axis. x(?, ?, d1) and y(yR, yC, d2) is for NHWC.
          // x(d1, ?, ?) and y(d2, yR, yC) is for NCHW.
          var value = 0.0;

          // Extract if checking out of for loop for performance.
          if (inputRowStart >= 0 && inputColStart >= 0 &&
            inputRowEnd < uniforms.inDims[0] &&
                inputColEnd < uniforms.inDims[1]) {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  let xVal = ${t};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            } else {
              for (var wR = 0; wR < uniforms.filterHeight; wR = wR + 1) {
                let xR = inputRowStart + wR * uniforms.dilations[0];

                if (xR < 0 || xR >= uniforms.inDims[0]) {
                  continue;
                }

                for (var wC = 0; wC < uniforms.filterWidth; wC = wC + 1) {
                  let xC = inputColStart + wC * uniforms.dilations[1];

                  if (xC < 0 || xC >= uniforms.inDims[1]) {
                    continue;
                  }

                  let xVal = ${t};
                  let wVal = getW(wR, wC, d1, q);
                  value = value + xVal * wVal;
                }
              }
            }
            ${Y(this.addBias,this.activation)}
          setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }
    `}};function ic(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s}=t,{strides:a,pad:n,dataFormat:u,dilations:p,dimRoundingMode:d}=i,c=ms.convertConv2DDataFormat(u),l=p;l==null&&(l=[1,1]);let h=ms.computeConv2DInfo(r.shape,s.shape,a,l,n,d,!0,c),m=[{type:"int32",data:[h.padInfo.top,h.padInfo.left]},{type:"int32",data:[h.inHeight,h.inWidth]}],f=h.dataFormat==="channelsLast",g;return!f&&h.inHeight>16&&h.inWidth>16&&h.strideHeight===1&&h.strideWidth===1&&h.dilationWidth===1&&h.dilationHeight===1&&h.inChannels===h.outChannels?g=new Lt(h.outShape,h.filterHeight,h.filterWidth):f&&h.outHeight>4&&h.outWidth>4&&h.strideWidth<=2&&h.inChannels===h.outChannels&&h.dilationHeight===1&&h.dilationWidth===1&&h.inChannels%4===0?(g=new ke(h),m.push({type:"int32",data:[g.virtualWidth]})):(g=new Re(h),m.push({type:"int32",data:[h.filterHeight]},{type:"int32",data:[h.filterWidth]},{type:"int32",data:[h.strideHeight,h.strideWidth]},{type:"int32",data:[h.dilationHeight,h.dilationWidth]})),e.runWebGPUProgram(g,[r,s],r.dtype,m)}var fs={kernelName:rc,backendName:"webgpu",kernelFunc:ic};import{backend_util as sc,DepthwiseConv2dNativeBackpropFilter as ac}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Tt=class{constructor(t){this.variableNames=["x","dy"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>, outHeight : i32,
      outWidth : i32, inHeight : i32, inWidth : i32, batchSize : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.filterShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="depthwise_conv2d_backprop_filter"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let wR = coords[0];
        let wC = coords[1];
        let d1 = coords[2];
        let dm = coords[3];
        let d2 = d1 * uniforms.channelMul + dm;

        var dotProd = 0.0;
        for (var b = 0; b < uniforms.batchSize; b++) {
          for (var yR = 0; yR < uniforms.outHeight; yR++) {
            let xR = wR + yR * uniforms.strides[0] - uniforms.pads[0];

            if (xR < 0 || xR >= uniforms.inHeight) {
              continue;
            }

            for (var yC = 0; yC < uniforms.outWidth; yC++) {
              let xC = wC + yC * uniforms.strides[1] - uniforms.pads[1];

              if (xC < 0 || xC >= uniforms.inWidth) {
                continue;
              }

              let dyValue = getDy(b, yR, yC, d2);
              let xValue = getX(b, xR, xC, d1);
              dotProd += xValue * dyValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},_t=class{constructor(t){this.variableNames=["dy","W"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32, channelMul : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="depthwise_conv2d_backprop_input"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d1 = coords[3];
        let dyCorner = coords.yz - uniforms.pads;
        let dyRCorner = dyCorner.x;
        let dyCCorner = dyCorner.y;

        var dotProd = 0.0;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }

          let idyR = i32(dyR);
          let wRPerm = uniforms.filterDims[0] - 1 - wR;

          for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }

            let idyC = i32(dyC);
            let wCPerm = uniforms.filterDims[1] - 1 - wC;

            for (var dm = 0; dm < uniforms.channelMul; dm++) {
              let d2 = d1 * uniforms.channelMul + dm;
              let xValue = getDy(batch, idyR, idyC, d2);
              let wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}};function nc(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,dy:s}=t,{strides:a,dilations:n,pad:u,dimRoundingMode:p,filterShape:d}=i,c=sc.computeConv2DInfo(r.shape,d,a,n,u,p,!0),l=new Tt(c),h=[{type:"int32",data:[c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.filterHeight,c.filterWidth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"int32",data:[c.inHeight]},{type:"int32",data:[c.inWidth]},{type:"int32",data:[c.batchSize]},{type:"int32",data:[c.outChannels/c.inChannels]}];return e.runWebGPUProgram(l,[r,s],"float32",h)}var gs={kernelName:ac,backendName:"webgpu",kernelFunc:nc};import{backend_util as uc,DepthwiseConv2dNativeBackpropInput as pc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function dc(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,filter:s}=t,{strides:a,dilations:n,pad:u,dimRoundingMode:p,inputShape:d}=i,c=uc.computeConv2DInfo(d,s.shape,a,n,u,p,!0),l=new _t(c),h=[{type:"int32",data:[c.strideHeight,c.strideWidth]},{type:"int32",data:[c.filterHeight-1-c.padInfo.top,c.filterWidth-1-c.padInfo.left]},{type:"int32",data:[c.filterHeight,c.filterWidth]},{type:"int32",data:[c.outHeight]},{type:"int32",data:[c.outWidth]},{type:"int32",data:[c.outChannels/c.inChannels]}];return e.runWebGPUProgram(l,[r,s],r.dtype,h)}var xs={kernelName:pc,backendName:"webgpu",kernelFunc:dc};import{Diag as lc,util as cc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bt=class{constructor(t){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t,t],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="diag"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let value = select(0.0, getX(coords[0]), coords[0] == coords[1]);
          setOutputAtIndex(index, value);
        }
      }
    `}};function hc(o){let{inputs:t,backend:e}=o,{x:i}=t,r=[...i.shape,...i.shape],s=cc.sizeFromShape(i.shape),a=I({inputs:{x:i},backend:e,attrs:{shape:[s]}}),n=new Bt(s),u=e.runWebGPUProgram(n,[a],a.dtype),p=I({inputs:{x:u},backend:e,attrs:{shape:r}});return e.disposeData(a.dataId),e.disposeData(u.dataId),p}var Cs={kernelName:lc,backendName:"webgpu",kernelFunc:hc};import{backend_util as mc,Dilation2D as fc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Et=class{constructor(t){this.variableNames=["x","w"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.outShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="dilation2d"}getUserCode(){return`
       ${x("index")} {
         if (index < uniforms.size) {
           let neg_infinity = -3.4e38;
           let coords = getOutputCoords();
           let batch = coords.x;
           let d1 = coords.w;
           let outTopLeftCorner = coords.yz * uniforms.strides - uniforms.pads;
           let hBeg = outTopLeftCorner.x;
           let wBeg = outTopLeftCorner.y;

           var curVal = neg_infinity;
           for (var h = 0; h < uniforms.filterDims[0]; h = h + 1) {
             let hIn = hBeg + h * uniforms.dilations[0];

             if (hIn >= 0 && hIn < uniforms.xShape[1]) {
               for (var w = 0; w < uniforms.filterDims[1]; w = w + 1) {
                 let wIn = wBeg + w * uniforms.dilations[1];

                 if (wIn >= 0 && wIn < uniforms.xShape[2]) {
                   let val = getX(batch, hIn, wIn, d1) + getW(h, w, d1);
                   if (val > curVal) {
                     curVal = val;
                   }
                 }
               }
             }
           }

           setOutputAtIndex(index, curVal);
         }
       }
     `}};function gc(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s}=t,{strides:a,pad:n,dilations:u}=i,p=mc.computeDilation2DInfo(r.shape,s.shape,a,n,"NHWC",u),d=[p.padInfo.top,p.padInfo.left],c=[{type:"int32",data:[p.filterHeight,p.filterWidth]},{type:"int32",data:[...d]},{type:"int32",data:[p.strideHeight,p.strideWidth]},{type:"int32",data:[p.dilationHeight,p.dilationWidth]}],l=new Et(p);return e.runWebGPUProgram(l,[r,s],r.dtype,c)}var ys={kernelName:fc,backendName:"webgpu",kernelFunc:gc};import{backend_util as xc,Dilation2DBackpropFilter as Cc,util as yc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ut=class{constructor(t,e){if(this.variableNames=["x","w","dy"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=t.inShape,this.dispatchLayout=y(t.outShape),this.dispatch=C(this.dispatchLayout,t.outShape,this.workgroupSize),e!=="float32"&&e!=="int32")throw new Error(`Dilation2DBackpropInput only supports float32 and int32
          types, does not support ${e} type.`);this.type=e,this.shaderKey="dilation2DBackpropInput"}getUserCode(){return`
       ${x("index")} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var xRMax = 0;
           var xCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     xRMax = xR;
                     xCMax = xC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.xShape[3] *
               (xCMax + uniforms.xShape[2] * (xRMax + uniforms.xShape[1] * b));
           let value = getDy(b, r, c, d);
           ${q("&result[flatIndexIn]","value",this.type)}
         }
       }
     `}},Wt=class{constructor(t,e,i){if(this.variableNames=["x","w","dy"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>, dySize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=t.filterShape,this.dispatchLayout=y(t.outShape),this.dispatch=C(this.dispatchLayout,t.outShape,this.workgroupSize),i!=="float32"&&i!=="int32")throw new Error(`Dilation2DBackpropFilter only supports float32 and int32
          types, does not support ${i} type.`);this.type=i,this.shaderKey="dilation2DBackpropFilter"}getUserCode(){return`
       ${x("index")} {
         if (index < uniforms.dySize) {
           let coords = getDyCoordsFromIndex(index);
           let b = coords[0];
           let r = coords[1];
           let c = coords[2];
           let d = coords[3];

           let dyCorner = vec2<i32>(r, c) * uniforms.strides - uniforms.pads;
           var curVal = -3.4e38;  // neg_infinity
           var wRMax = 0;
           var wCMax = 0;

           // In the case of multiple argmax branches, we only back-propagate
           // along the last branch, i.e., the one with largest value of
           // 'wR * uniforms.filterDims[1] + wC', similarly to the max-pooling
           // backward routines.
           for (var wR = 0; wR < uniforms.filterDims[0]; wR++) {
             let xR = dyCorner.x + wR * uniforms.dilations[0];

             if (xR >= 0 && xR < uniforms.xShape[1]) {
               for (var wC = 0; wC < uniforms.filterDims[1]; wC++) {
                 let xC = dyCorner.y + wC * uniforms.dilations[1];

                 if (xC >= 0 && xC < uniforms.xShape[2]) {
                   let val = getX(b, xR, xC, d) + getW(wR, wC, d);
                   if (val > curVal) {
                     curVal = val;
                     wRMax = wR;
                     wCMax = wC;
                   }
                 }
               }
             }
           }

           let flatIndexIn = d + uniforms.wShape[2] * (wCMax + wRMax * uniforms.wShape[1]);
           let value = getDy(b, r, c, d);
           ${q("&result[flatIndexIn]","value",this.type)}
         }
       }
     `}};function Sc(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s,dy:a}=t,{strides:n,pad:u,dilations:p}=i,d=xc.computeDilation2DInfo(r.shape,s.shape,n,u,"NHWC",p),c=s.dtype,l=new Wt(d,s.shape,c),h=[{type:"int32",data:[d.filterHeight,d.filterWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[yc.sizeFromShape(d.outShape)]}],m=_({backend:e,attrs:{shape:s.shape,value:0,dtype:c}});return e.runWebGPUProgram(l,[r,s,a],c,h,m)}var Ss={kernelName:Cc,backendName:"webgpu",kernelFunc:Sc};import{backend_util as wc,Dilation2DBackpropInput as bc,util as vc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ic(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s,dy:a}=t,{strides:n,pad:u,dilations:p}=i,d=wc.computeDilation2DInfo(r.shape,s.shape,n,u,"NHWC",p),c=r.dtype,l=new Ut(d,c),h=[{type:"int32",data:[d.filterHeight,d.filterWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[vc.sizeFromShape(d.outShape)]}],m=_({backend:e,attrs:{shape:d.inShape,value:0,dtype:c}});return e.runWebGPUProgram(l,[r,s,a],c,h,m)}var ws={kernelName:bc,backendName:"webgpu",kernelFunc:Ic};import{Draw as kc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Mt=class{constructor(t,e,i){this.variableNames=["Image"],this.uniforms="alpha: f32,",this.workgroupSize=[64,1,1],this.pixelsOpType=se.DRAW,this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.type=e,this.textureFormat=i,this.shaderKey=`draw_${e}_${i}`}getUserCode(){let t,e=this.type==="float32"?"value":"value / 255.0";return t=`
      if (uniforms.numChannels == 1) {
        rgba[0] = ${e};
        rgba[1] = ${e};
        rgba[2] = ${e};
      } else {
        rgba[d] = ${e};
      }`,`
       @group(0) @binding(0) var outImage : texture_storage_2d<${this.textureFormat}, write>;
       ${x("index")} {
         if (index < uniforms.size) {
           var rgba = vec4<f32>(0.0, 0.0, 0.0, uniforms.alpha);
           for (var d = 0; d < uniforms.numChannels; d = d + 1) {
             let value = f32(inBuf[index * uniforms.numChannels + d]);
             ${t}
           }
           rgba.x = rgba.x * rgba.w;
           rgba.y = rgba.y * rgba.w;
           rgba.z = rgba.z * rgba.w;
           let coords = getCoordsFromIndex(index);
           textureStore(outImage, vec2<i32>(coords.yx), rgba);
         }
       }
      `}};function Rc(o){let{inputs:t,backend:e,attrs:i}=o,{image:r}=t,{canvas:s,options:a}=i,[n,u]=r.shape.slice(0,2),{imageOptions:p}=a||{},d=p?.alpha||1,c=e.device.features.has("bgra8unorm-storage")?"bgra8unorm":"rgba8unorm",l=[n,u],h=new Mt(l,r.dtype,c);s.width=u,s.height=n;let m="webgpu",f=s.getContext(m),g;f||(g=new OffscreenCanvas(u,n),f=g.getContext(m));let w=r.shape.length===3?r.shape[2]:1;f.configure({device:e.device,format:c,usage:GPUTextureUsage.STORAGE_BINDING,alphaMode:"premultiplied"});let b="int32",v=e.makeTensorInfo(l,b),k=e.tensorMap.get(v.dataId);k.resource=f.getCurrentTexture(),k.external=!0;let R=[{type:"uint32",data:[w]},{type:"float32",data:[d]}];if(e.runWebGPUProgram(h,[r],b,R,v),g){let $=s.getContext("2d");if(!$)throw new Error("Please make sure this canvas has only been used for 2d or webgpu context!");$.drawImage(g,0,0)}return e.disposeData(v.dataId),r}var bs={kernelName:kc,backendName:"webgpu",kernelFunc:Rc};import{backend_util as Me,Einsum as $c,util as Nc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Multiply as Dc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Yo=A({opType:D.MUL,cpuKernelImpl:Xr,supportsComplex:!0}),vs={kernelName:Dc,backendName:"webgpu",kernelFunc:Yo};import{Sum as Pc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function jo(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s,keepDims:a}=i;return Q(r,s,a,"sum",e)}var Is={kernelName:Pc,backendName:"webgpu",kernelFunc:jo};function zc(o){let{inputs:t,backend:e,attrs:i}=o,{equation:r}=i,s=t,{allDims:a,summedDims:n,idDims:u}=Me.decodeEinsumEquation(r,s.length);Me.checkEinsumDimSizes(a.length,u,s);let{path:p,steps:d}=Me.getEinsumComputePath(n,u),c=d.length,l=null,h=a.length,m=[];for(let f=0;f<c;++f){for(let g of d[f]){let{permutationIndices:w,expandDims:b}=Me.getEinsumPermutation(h,u[g]),v;Me.isIdentityPermutation(w)?v=s[g]:(v=K({inputs:{x:s[g]},backend:e,attrs:{perm:w}}),m.push(v));let k=v.shape.slice();for(let R=0;R<b.length;++R)k.splice(b[R],0,1);Nc.arraysEqual(v.shape,k)||(v=I({inputs:{x:v},backend:e,attrs:{shape:k}}),m.push(v)),l===null?l=v:(l=Yo({inputs:{a:v,b:l},backend:e}),m.push(l))}f<c-1&&(p[f]>=0&&(l=jo({inputs:{x:l},backend:e,attrs:{axis:p[f]-(a.length-h),keepDims:!1}}),m.push(l)),h--)}for(let f of m)f!==l&&e.disposeData(f.dataId);return l}var ks={kernelName:$c,backendName:"webgpu",kernelFunc:zc};import{Elu as Ac}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Fc=P({opType:S.ELU}),Rs={kernelName:Ac,backendName:"webgpu",kernelFunc:Fc};import{EluGrad as Lc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Tc=o=>{let{inputs:t,backend:e}=o,{dy:i,y:r}=t,s=new ne(D.ELU_DER,i.shape,r.shape);return e.runWebGPUProgram(s,[i,r],i.dtype)},Ds={kernelName:Lc,backendName:"webgpu",kernelFunc:Tc};import{Equal as _c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bc=A({opType:D.EQUAL,dtype:"bool",cpuKernelImpl:Ar}),Ps={kernelName:_c,backendName:"webgpu",kernelFunc:Bc};import{Erf as Ec}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Uc=P({opType:S.ERF}),$s={kernelName:Ec,backendName:"webgpu",kernelFunc:Uc};import{Exp as Wc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Mc=P({opType:S.EXP,cpuKernelImpl:Fr,dtype:"float32"}),Ns={kernelName:Wc,backendName:"webgpu",kernelFunc:Mc};import{ExpandDims as Oc,util as Vc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ot(o){let{inputs:t,attrs:e,backend:i}=o,{dim:r}=e,{input:s}=t,a=s.shape.length,n=s.shape.slice(),u=r;return r<0&&(Vc.assert(-(a+1)<=r,()=>`Axis must be in the interval [${-(a+1)}, ${a}]`),u=a+r+1),n.splice(u,0,1),I({inputs:{x:s},backend:i,attrs:{shape:n}})}var zs={kernelName:Oc,backendName:"webgpu",kernelFunc:Ot};import{Expm1 as Hc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Gc=P({opType:S.EXPM1,cpuKernelImpl:Lr}),As={kernelName:Hc,backendName:"webgpu",kernelFunc:Gc};import{FFT as Xc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Kc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Oe=class{constructor(t,e){this.variableNames=["real","imag"],this.outputShape=[],this.uniforms="exponentMultiplier : f32, denominator: f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.component=t,this.shaderKey=`fft_${t}`}getUserCode(){return`
    fn unaryOpComplex(real: f32, expR: f32, imag: f32, expI: f32) -> f32 {
      ${this.component==="real"?"return real * expR - imag * expI;":"return real * expI + imag * expR;"}
    }

    fn mulMatDFT(batch: i32, index: i32) -> f32 {
      let indexRatio = f32(index) / f32(uniforms.realShape[1]);
      let exponentMultiplierTimesIndexRatio =
          uniforms.exponentMultiplier * indexRatio;

      var result = 0.0;

      for (var i = 0; i < uniforms.realShape[1]; i = i + 1) {
        // x = (-2|2 * PI / N) * index * i;
        let x = exponentMultiplierTimesIndexRatio * f32(i);
        let expR = cos(x);
        let expI = sin(x);
        let real = getReal(batch, i);
        let imag = getImag(batch, i);

        result = result +
            unaryOpComplex(real, expR, imag, expI) / uniforms.denominator;
      }

      return result;
    }

    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        setOutputAtIndex(index, mulMatDFT(coords[0], coords[1]));
      }
    }
  `}};function Vt(o,t,e){let i=e.tensorMap.get(o.dataId),r=Kc.sizeFromShape(o.shape),s=o.shape[o.shape.length-1],a=r/s,n=[],u=I({inputs:{x:o},backend:e,attrs:{shape:[a,s]}});n.push(u);let p=u.shape,d=new Oe("real",p),c=new Oe("imag",p),l=[{dataId:i.complexTensorInfos.real.dataId,dtype:i.complexTensorInfos.real.dtype,shape:p},{dataId:i.complexTensorInfos.imag.dataId,dtype:i.complexTensorInfos.imag.dtype,shape:p}],h=t?2*Math.PI:-2*Math.PI,m=t?p[1]:1,f=[{type:"float32",data:[h]},{type:"float32",data:[m]}],g=e.runWebGPUProgram(d,l,"float32",f);n.push(g);let w=e.runWebGPUProgram(c,l,"float32",f);n.push(w);let b=J({inputs:{real:g,imag:w},backend:e});n.push(b);let v=I({inputs:{x:b},backend:e,attrs:{shape:o.shape}});return n.forEach(k=>e.disposeData(k.dataId)),v}function qc(o){let{inputs:t,backend:e}=o,{input:i}=t;return Vt(i,!1,e)}var Fs={kernelName:Xc,backendName:"webgpu",kernelFunc:qc};import{FlipLeftRight as Yc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ht=class{constructor(t){this.outputShape=[],this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="flipLeftRight"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let coordX = uniforms.xShape[2] - coords[2] - 1;
          let outputValue = getX(coords[0], coords[1], coordX, coords[3]);
          setOutputAtIndex(index, outputValue);
        }
      }
    `}};var Ls={kernelName:Yc,backendName:"webgpu",kernelFunc:({inputs:o,backend:t})=>{let{image:e}=o,i=t,r=new Ht(e.shape);return i.runWebGPUProgram(r,[e],e.dtype)}};import{Floor as jc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Qc=P({opType:S.FLOOR,cpuKernelImpl:Tr}),Ts={kernelName:jc,backendName:"webgpu",kernelFunc:Qc};import{FloorDiv as Zc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Jc=A({opType:D.FLOOR_DIV,cpuKernelImpl:_r,dtype:"int32"}),_s={kernelName:Zc,backendName:"webgpu",kernelFunc:Jc};import{env as Zo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{FromPixels as eh,util as Bs}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Gt=class{constructor(t,e,i=!1){this.pixelsOpType=se.FROM_PIXELS,this.outputShape=[0],this.variableNames=[],this.workgroupSize=[256,1,1],this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[e,1,1]),this.importVideo=i,this.shaderKey=`fromPixels_${this.importVideo}`}getUserCode(){let t=this.importVideo?"textureLoad(src, vec2<i32>(coords.yx));":"textureLoad(src, vec2<i32>(coords.yx), 0)";return`
      @binding(1) @group(0) var src: ${this.importVideo?"texture_external":"texture_2d<f32>"};
      ${x("index")} {
        let flatIndex = index * uniforms.numChannels;
        if (flatIndex < uniforms.size) {
          let coords = getCoordsFromIndex(flatIndex);
          let values = ${t};
          for (var i = 0; i < uniforms.numChannels; i = i + 1) {
            result[flatIndex + i] = i32(floor(255.0 * values[i]));
          }
        }
      }
  `}};var Es={kernelName:eh,backendName:"webgpu",kernelFunc:th},De,Qo=Zo().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function th(o){let{inputs:t,backend:e,attrs:i}=o,{pixels:r}=t,{numChannels:s}=i;if(r==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let a=typeof HTMLVideoElement<"u"&&r instanceof HTMLVideoElement,n=typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement,u=typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas,p=typeof ImageBitmap<"u"&&r instanceof ImageBitmap,[d,c]=a?[r.videoWidth,r.videoHeight]:[r.width,r.height],l=[c,d,s],h=Zo().getBool("WEBGPU_IMPORT_EXTERNAL_TEXTURE")&&a,m=a||n;if(p||u||m){let b;if(h)b=e.device.importExternalTexture({source:r});else{if(m){let H=Zo().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(De==null||H!==Qo)&&(Qo=H,De=document.createElement("canvas").getContext("2d",{willReadFrequently:Qo})),De.canvas.width=d,De.canvas.height=c,De.drawImage(r,0,0,d,c),r=De.canvas}let W=GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,E="rgba8unorm",X=e.textureManager.acquireTexture(l[1],l[0],E,W);e.queue.copyExternalImageToTexture({source:r},{texture:X},[l[1],l[0]]),b=X}let v=Bs.sizeFromShape(l),k=Bs.computeStrides(l),R=new Gt(l,s,h),$=[{type:"uint32",data:[v]},{type:"uint32",data:[s]},{type:"uint32",data:[...k]}],N=e.makeTensorInfo([c,d],"int32"),L=e.tensorMap.get(N.dataId);L.resource=b;let F=e.runWebGPUProgram(R,[N],"int32",$);return e.disposeData(N.dataId),F}let f=r.data,g=f;if(s!=null&&s!==4){g=new Uint8Array(r.width*r.height*s);let b=f.length,v=0;for(let k=0;k<b;k++)k%4<s&&(g[v++]=f[k])}let w=e.makeTensorInfo(l,"int32",new Int32Array(g));return e.uploadToGPU(w.dataId),w}import{FusedBatchNorm as oh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Kt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Xt=class{constructor(t,e,i,r,s){this.uniforms="varianceEpsilon : f32,",this.workgroupSize=[128,1,1],this.size=!0,this.variableNames=["x","mean","variance"],Kt.assertAndGetBroadcastShape(t,e),Kt.assertAndGetBroadcastShape(t,i),this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),r!=null&&(Kt.assertAndGetBroadcastShape(t,r),this.variableNames.push("offset")),s!=null&&(Kt.assertAndGetBroadcastShape(t,s),this.variableNames.push("scale")),this.offsetShape=r,this.scaleShape=s,this.shaderKey="batchNorm"}getUserCode(){let t="0.0";this.offsetShape!=null&&(t="getOffsetByOutputIndex(index)");let e="1.0";return this.scaleShape!=null&&(e="getScaleByOutputIndex(index)"),`
      ${x("index")} {
        if (index < uniforms.size)
        {
          let xValue = getXByOutputIndex(index);
          let meanValue = getMeanByOutputIndex(index);
          let varianValue = getVarianceByOutputIndex(index);
          let offsetValue = ${t};
          let scaleValue = ${e};
          let inv = scaleValue * inverseSqrt(varianValue + f32(uniforms.varianceEpsilon));
          setOutputAtIndex(index,dot(vec3<f32>(xValue, -meanValue, offsetValue), vec3<f32>(inv, inv, 1.0)));
        }
      }
  `}};var Us={kernelName:oh,backendName:"webgpu",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{x:i,scale:r,offset:s,mean:a,variance:n}=o,{varianceEpsilon:u}=t,p=e,d=[i,a,n],c=null;s!=null&&(c=s.shape,d.push(s));let l=null;r!=null&&(l=r.shape,d.push(r));let h=new Xt(i.shape,a.shape,n.shape,c,l),m=[{type:"float32",data:[u]}];return p.runWebGPUProgram(h,d,i.dtype,m)}};import{backend_util as Ws,FusedConv2D as rh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ih(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s,bias:a,preluActivationWeights:n}=t,{strides:u,pad:p,dataFormat:d,dilations:c,dimRoundingMode:l,activation:h,leakyreluAlpha:m}=i,f=Ws.convertConv2DDataFormat(d),g=Ws.computeConv2DInfo(r.shape,s.shape,u,c,p,l,!1,f);return It({x:r,filter:s,convInfo:g,backend:e,bias:a,preluActivationWeights:n,leakyreluAlpha:m,activation:h})}var Ms={kernelName:rh,backendName:"webgpu",kernelFunc:ih};import{backend_util as Os,FusedDepthwiseConv2D as sh,util as ah}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function nh(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,filter:s,bias:a,preluActivationWeights:n}=t,{strides:u,pad:p,dilations:d,dimRoundingMode:c,activation:l,leakyreluAlpha:h}=i,m=d;m==null&&(m=[1,1]),ah.assert(Os.eitherStridesOrDilationsAreOne(u,m),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${u} and dilations '${m}'`);let f=Os.computeConv2DInfo(r.shape,s.shape,u,m,p,c,!0),g=[r,s],w=a!=null,b=n!=null;w&&g.push(a),b&&g.push(n);let v=[{type:"int32",data:[f.padInfo.top,f.padInfo.left]},{type:"int32",data:[f.inHeight,f.inWidth]}],k;return f.outHeight>4&&f.outWidth>4&&f.strideWidth<=2&&f.inChannels===f.outChannels&&f.dilationHeight===1&&f.dilationWidth===1&&f.inChannels%4===0?(k=new ke(f,w,l,b),v.push({type:"int32",data:[k.virtualWidth]})):(k=new Re(f,w,l,b),v.push({type:"int32",data:[f.filterHeight]},{type:"int32",data:[f.filterWidth]},{type:"int32",data:[f.strideHeight,f.strideWidth]},{type:"int32",data:[f.dilationHeight,f.dilationWidth]})),l==="leakyrelu"&&(v.push({type:"float32",data:[h]}),k.uniforms+=" alpha : f32,"),e.runWebGPUProgram(k,g,"float32",v)}var Vs={kernelName:sh,backendName:"webgpu",kernelFunc:nh};import{backend_util as uh,GatherNd as ph,util as Hs}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var qt=class{constructor(t,e){this.variableNames=["A","indices"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey=`gathernd_${t}`,this.sliceDim=t,this.uniforms=`sliceDim : i32, strides : ${T(t)},`}getUserCode(){let t;return this.sliceDim>1?t="uniforms.strides[j]":t="uniforms.strides",`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          var flattenIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexTemp = i32(round(getIndices(coords[0], j)));
            let strideNum = ${t};
            flattenIndex = flattenIndex + indexTemp * strideNum;
          }

          setOutputAtIndex(index, getA(flattenIndex, coords[1]));
        }
      }
      `}};function dh(o){let{inputs:t,backend:e}=o,{params:i,indices:r}=t,s=r.shape,a=s[s.length-1],n=Hs.sizeFromShape(i.shape),[u,p,d,c]=uh.prepareAndValidate(i,r),l=I({inputs:{x:r},backend:e,attrs:{shape:[p,a]}}),h=I({inputs:{x:i},backend:e,attrs:{shape:[Hs.sizeFromShape(i.shape)/d,d]}});if(e.shouldExecuteOnCPU([i,r])||i.dtype==="string"){let b=e.readSync(r.dataId),v=e.bufferSync(i),k=Br(b,v,i.dtype,p,a,d,c,i.shape,n);return e.makeTensorInfo(u,i.dtype,k.values)}let m=new qt(a,[p,d]),f=[{type:"int32",data:[a]},{type:"int32",data:c}],g=e.runWebGPUProgram(m,[h,l],h.dtype,f),w=I({inputs:{x:g},backend:e,attrs:{shape:u}});return e.disposeData(l.dataId),e.disposeData(h.dataId),e.disposeData(g.dataId),w}var Gs={kernelName:ph,backendName:"webgpu",kernelFunc:dh};import{backend_util as ch,buffer as Ks,GatherV2 as hh,util as Xs}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Yt=class{constructor(t,e){this.variableNames=["A","indices"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.slice(),this.aShape=t,this.outputShape=e,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="gather"}getUserCode(){let t=lh(this.aShape);return`
      ${x("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let indexZ = i32(getIndices(resRC.x, resRC.z));
          let inBounds = select(0.0, 1.0, indexZ >= 0 && indexZ < uniforms.aShape[2]);
          setOutputAtIndex(index, inBounds * getA(${t}));
        }
      }
    `}};function lh(o){let t=["resRC.x","resRC.y","resRC.z","resRC.w"],e=[];for(let i=0;i<o.length;i++)i===2?e.push("indexZ"):e.push(`${t[i]}`);return e.join()}function Jo(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,indices:s}=t,{axis:a,batchDims:n}=i,u=Xs.parseAxisParam(a,r.shape)[0],p=ch.segment_util.collectGatherOpShapeInfo(r,s,u,n),d=Xs.sizeFromShape(s.shape),c=[],l=I({inputs:{x:r},backend:e,attrs:{shape:[p.batchSize,p.outerSize,p.dimSize,p.sliceSize]}}),h=I({inputs:{x:s},backend:e,attrs:{shape:[p.batchSize,d/p.batchSize]}});c.push(l),c.push(h);let m=[p.batchSize,p.outerSize,d/p.batchSize,p.sliceSize];if(e.shouldExecuteOnCPU([r,s])){let v=e.tensorMap.get(h.dataId).values,k=Ks(h.shape,h.dtype,v),$=e.tensorMap.get(l.dataId).values,N=Ks(l.shape,l.dtype,$),L=Er(N,k,m);return c.forEach(F=>e.disposeData(F.dataId)),e.makeTensorInfo(p.outputShape,L.dtype,L.values)}let f=new Yt(l.shape,m),g=e.runWebGPUProgram(f,[l,h],l.dtype);c.push(g);let w=I({inputs:{x:g},backend:e,attrs:{shape:p.outputShape}});return c.forEach(b=>e.disposeData(b.dataId)),w}var qs={kernelName:hh,backendName:"webgpu",kernelFunc:Jo};import{Greater as mh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var fh=A({opType:D.GREATER,cpuKernelImpl:Wr,dtype:"bool"}),Ys={kernelName:mh,backendName:"webgpu",kernelFunc:fh};import{GreaterEqual as gh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var xh=A({opType:D.GREATER_EQUAL,dtype:"bool",cpuKernelImpl:Ur}),js={kernelName:gh,backendName:"webgpu",kernelFunc:xh};import{IFFT as Ch}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function yh(o){let{inputs:t,backend:e}=o,{input:i}=t;return Vt(i,!0,e)}var Qs={kernelName:Ch,backendName:"webgpu",kernelFunc:yh};import{IsFinite as Sh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wh=P({opType:S.IS_FINITE,dtype:"bool"}),Zs={kernelName:Sh,backendName:"webgpu",kernelFunc:wh};import{IsInf as bh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vh=P({opType:S.IS_INF,dtype:"bool"}),Js={kernelName:bh,backendName:"webgpu",kernelFunc:vh};import{IsNan as Ih}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var kh=P({opType:S.IS_NAN,dtype:"bool"}),ea={kernelName:Ih,backendName:"webgpu",kernelFunc:kh};import{LeakyRelu as Rh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Dh(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{alpha:s}=i,a=[{type:"float32",data:[s]}],n=new j(r.shape,S.LEAKYRELU,"alpha : f32,");return e.runWebGPUProgram(n,[r],"float32",a)}var ta={kernelName:Rh,backendName:"webgpu",kernelFunc:Dh};import{Less as Ph}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $h=A({opType:D.LESS,dtype:"bool",cpuKernelImpl:Or}),oa={kernelName:Ph,backendName:"webgpu",kernelFunc:$h};import{LessEqual as Nh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zh=A({opType:D.LESS_EQUAL,dtype:"bool",cpuKernelImpl:Mr}),ra={kernelName:Nh,backendName:"webgpu",kernelFunc:zh};import{LinSpace as Ah}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jt=class{constructor(t){this.variableNames=[],this.outputShape=[],this.uniforms="start : f32, step : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="linSpace"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          setOutputAtIndex(index, uniforms.start + f32(index) * uniforms.step);
        }
      }
    `}};function Fh(o){let{backend:t,attrs:e}=o,{start:i,stop:r,num:s}=e,a=(r-i)/(s-1),n=new jt(s),u=[{type:"float32",data:[i]},{type:"float32",data:[a]}];return t.runWebGPUProgram(n,[],"float32",u)}var ia={kernelName:Ah,backendName:"webgpu",kernelFunc:Fh};import{Log as Lh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Th=P({opType:S.LOG,cpuKernelImpl:Vr}),sa={kernelName:Lh,backendName:"webgpu",kernelFunc:Th};import{Log1p as _h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bh=P({opType:S.LOG1P}),aa={kernelName:_h,backendName:"webgpu",kernelFunc:Bh};import{LogicalAnd as Eh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Uh=A({opType:D.LOGICAL_AND,dtype:"bool"}),na={kernelName:Eh,backendName:"webgpu",kernelFunc:Uh};import{LogicalNot as Wh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Mh=P({opType:S.LOGICAL_NOT}),ua={kernelName:Wh,backendName:"webgpu",kernelFunc:Mh};import{LogicalOr as Oh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Vh=A({opType:D.LOGICAL_OR}),pa={kernelName:Oh,backendName:"webgpu",kernelFunc:Vh};import{LRN as Gh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Hh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var da=`
  var powValue = 0.0;
  let basis = uniforms.bias + uniforms.alpha * sum;
  if (uniforms.beta == 0.5) {
    powValue = inverseSqrt(basis);
  } else if (uniforms.beta == 1.0) {
    powValue = 1.0 / basis;
  } else {
    powValue = exp(log(basis) * (-uniforms.beta));
  }
`,Qt=class{constructor(t){this.outputShape=[],this.variableNames=["x"],this.uniforms="radius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="lrn"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];
        let d = coords[3];

        let x = getX(b, r, c, d);
        var sum = 0.0;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let idx = d + i;
          if (idx >= 0 && idx < uniforms.xShape[3]) {
            let z = getX(b, r, c, idx);
            sum = sum + z * z;
          }
        }
        ${da}

        setOutputAtIndex(index, x * powValue);
      }
    }
  `}},Zt=class{constructor(t,e){this.outputShape=[],this.variableNames=["x"],this.uniforms="radius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[256,1,1],this.maxAllowRadius=16,Hh.assert(e<=this.maxAllowRadius,()=>`Radius must be less than or equal to ${this.maxAllowRadius}, current radius is ${e}`),this.outputShape=t,this.elementsPerWorkgroup=this.workgroupSize[0]-2*this.maxAllowRadius,this.dispatchLayout={x:[3],y:[2],z:[0,1]},this.dispatch=C(this.dispatchLayout,this.outputShape,[this.elementsPerWorkgroup,this.workgroupSize[1],this.workgroupSize[2]]),this.shaderKey="lrn_shared"}getUserCode(){return`
    var <workgroup>lrnSub: array<f32, ${this.workgroupSize[0]}>;
    const elementsPerWorkgroup = ${this.elementsPerWorkgroup};
    const maxAllowRadius = ${this.maxAllowRadius};

    ${x()} {
      let localDepth = i32(localId.x);
      let workgroupDepth = i32(workgroupId.x) * elementsPerWorkgroup;
      let xDepth = workgroupDepth + localDepth - maxAllowRadius;
      let b = i32(globalId.z) / uniforms.xShape[1];
      let r = i32(globalId.z) - b * uniforms.xShape[1];
      let c = i32(globalId.y);
      let d = workgroupDepth + localDepth;

      var x = 0.0;
      if (xDepth >= 0 && xDepth < uniforms.xShape[3]) {
        x = getX(b, r, c, xDepth);
      }
      lrnSub[localDepth] = x;
      workgroupBarrier();

      if (localDepth < elementsPerWorkgroup && d < uniforms.outShape[3]) {
        var sum = 0.0;
        let index = localDepth + maxAllowRadius;
        for (var i = -uniforms.radius; i <= uniforms.radius; i = i + 1) {
          let z = lrnSub[index + i];
          sum = sum + z * z;
        }
        ${da}

        setOutputAtCoords(b, r, c, d, lrnSub[index] * powValue);
      }
    } `}};function Kh(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{depthRadius:s,bias:a,alpha:n,beta:u}=i,p;s>16?p=new Qt(r.shape):p=new Zt(r.shape,s);let d=[{type:"int32",data:[s]},{type:"float32",data:[a]},{type:"float32",data:[n]},{type:"float32",data:[u]}];return e.runWebGPUProgram(p,[r],r.dtype,d)}var la={kernelName:Gh,backendName:"webgpu",kernelFunc:Kh};import{LRNGrad as Xh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Jt=class{constructor(t){this.outputShape=[],this.variableNames=["inputImage","outputImage","dy"],this.uniforms="depthRadius : i32, bias : f32, alpha : f32, beta : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="lrn_grad"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let b = coords[0];
        let r = coords[1];
        let c = coords[2];

        let MIN_DEPTH_BEGIN = 0;
        let MAX_DEPTH_END = uniforms.outShape[3];
        var result = 0.0;
        for (var d = MIN_DEPTH_BEGIN; d < MAX_DEPTH_END; d++) {
          let depthBegin = max(MIN_DEPTH_BEGIN, d - uniforms.depthRadius);
          let depthEnd = min(MAX_DEPTH_END, d + uniforms.depthRadius + 1);

          var norm = 0.0;
          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            } else {
              break;
            }
          }

          norm = uniforms.alpha * norm + uniforms.bias;

          for (var k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; k++) {
            if (k < depthBegin) {
              continue;
            } else if (k >= depthBegin && k < depthEnd) {
              var dyi = -2.0 * uniforms.alpha * uniforms.beta
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d) / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * uniforms.beta);
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            } else {
              break;
            }
          }
        }

        setOutputAtIndex(index, result);
      }
    }
  `}};function qh(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,y:s,dy:a}=t,{depthRadius:n,bias:u,alpha:p,beta:d}=i,c=new Jt(r.shape),l=[{type:"int32",data:[n]},{type:"float32",data:[u]},{type:"float32",data:[p]},{type:"float32",data:[d]}];return e.runWebGPUProgram(c,[r,s,a],r.dtype,l)}var ca={kernelName:Xh,backendName:"webgpu",kernelFunc:qh};import{Maximum as Yh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jh=A({opType:D.MAX,cpuKernelImpl:Gr}),ha={kernelName:Yh,backendName:"webgpu",kernelFunc:jh};import{backend_util as Qh,MaxPool as Zh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Jh(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{filterSize:s,strides:a,pad:n,dimRoundingMode:u}=i,p=1,d=Qh.computePool2DInfo(r.shape,s,a,p,n,u);return lt(r,d,"max",e)}var ma={kernelName:Zh,backendName:"webgpu",kernelFunc:Jh};import{backend_util as em,MaxPool3D as tm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function om(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{filterSize:s,strides:a,pad:n,dataFormat:u,dimRoundingMode:p}=i,d=[1,1,1],c=em.computePool3DInfo(r.shape,s,a,d,n,p,u),l=new le(c,"max"),h=[{type:"int32",data:[c.strideDepth,c.strideHeight,c.strideWidth]},{type:"int32",data:[c.padInfo.front,c.padInfo.top,c.padInfo.left]},{type:"int32",data:[c.inDepth,c.inHeight,c.inWidth]},{type:"int32",data:[c.effectiveFilterDepth,c.effectiveFilterHeight,c.effectiveFilterWidth]}];return e.runWebGPUProgram(l,[r],r.dtype,h)}var fa={kernelName:tm,backendName:"webgpu",kernelFunc:om};import{backend_util as rm,MaxPool3DGrad as im}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var eo=class{constructor(t){this.variableNames=["dy","maxPos"],this.uniforms=`strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, filterDims : vec2<i32>,
       outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="maxPool2DBackprop"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords[0];
        let d = coords[3];

        let dyRCCorner = vec2<i32>(coords.yz) - uniforms.pads;
        let dyRCorner = dyRCCorner.x;
        let dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] - 1;
        for (var wR = 0; wR < uniforms.filterDims[0]; wR += uniforms.dilations[0]) {
          let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[0]);

          if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
            continue;
          }
          let idyR = i32(dyR);

          for (var wC = 0; wC < uniforms.filterDims[1]; wC += uniforms.dilations[1]) {
            let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[1]);

            if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
              continue;
            }
            let idyC = i32(dyC);

            let dyValue = getDy(batch, idyR, idyC, d);
            let maxPosValue = lastIndex - i32(getMaxPos(batch, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            let curPosValue = wR * uniforms.filterDims[1] + wC;
            let mask = select(0.0, 1.0, maxPosValue == curPosValue);
            dotProd += dyValue * mask;
          }
        }
        setOutputAtIndex(index, dotProd);
      }
    }
    `}},to=class{constructor(t){this.variableNames=["dy","maxPos"],this.uniforms=`strides : vec3<i32>, pads : vec3<i32>, filterDims : vec3<i32>,
      outDepth : i32, outHeight : i32, outWidth : i32`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.inShape,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="maxPool3DBackprop"}getUserCode(){return`
      ${x("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        let batch = coords.x;
        let ch = coords.u;

        let dyCorner = vec3<i32>(coords.y, coords.z, coords.w) - uniforms.pads;
        let dyDCorner = dyCorner.x;
        let dyRCorner = dyCorner.y;
        let dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        var dotProd = 0.0;
        let lastIndex = uniforms.filterDims[0] * uniforms.filterDims[1] * uniforms.filterDims[2] - 1;

        for (var wD = 0; wD < uniforms.filterDims[0]; wD++) {
          let dyD = f32(dyDCorner + wD) / f32(uniforms.strides[0]);

          if (dyD < 0.0 || dyD >= f32(uniforms.outDepth) || fract(dyD) > 0.0) {
            continue;
          }
          let idyD = i32(dyD);

          for (var wR = 0; wR < uniforms.filterDims[1]; wR++) {
            let dyR = f32(dyRCorner + wR) / f32(uniforms.strides[1]);

            if (dyR < 0.0 || dyR >= f32(uniforms.outHeight) || fract(dyR) > 0.0) {
              continue;
            }
            let idyR = i32(dyR);

            for (var wC = 0; wC < uniforms.filterDims[2]; wC++) {
              let dyC = f32(dyCCorner + wC) / f32(uniforms.strides[2]);

              if (dyC < 0.0 || dyC >= f32(uniforms.outWidth) || fract(dyC) > 0.0) {
                continue;
              }
              let idyC = i32(dyC);

              let dyValue = getDy(batch, idyD, idyR, idyC, ch);
              let maxPosValue = lastIndex - i32(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              let curPosValue = wD * uniforms.filterDims[1] * uniforms.filterDims[2] + wR * uniforms.filterDims[2] + wC;
              let mask = select(0.0, 1.0, maxPosValue == curPosValue);
              dotProd += dyValue * mask;
            }
          }
        }

        setOutputAtIndex(index, dotProd);
      }
    }
    `}};function sm(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,input:s}=t,a=s,{filterSize:n,strides:u,pad:p,dimRoundingMode:d}=i,c=[1,1,1],l=rm.computePool3DInfo(a.shape,n,u,c,p,d),h=new le(l,"max",!0),m=[{type:"int32",data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:"int32",data:[l.padInfo.front,l.padInfo.top,l.padInfo.left]},{type:"int32",data:[l.inDepth,l.inHeight,l.inWidth]},{type:"int32",data:[l.effectiveFilterDepth,l.effectiveFilterHeight,l.effectiveFilterWidth]}],f=e.runWebGPUProgram(h,[a],"int32",m),g=new to(l);m=[{type:"int32",data:[l.strideDepth,l.strideHeight,l.strideWidth]},{type:"int32",data:[l.effectiveFilterDepth-1-l.padInfo.front,l.effectiveFilterHeight-1-l.padInfo.top,l.effectiveFilterWidth-1-l.padInfo.left]},{type:"int32",data:[l.effectiveFilterDepth,l.effectiveFilterHeight,l.effectiveFilterWidth]},{type:"int32",data:[l.outDepth]},{type:"int32",data:[l.outHeight]},{type:"int32",data:[l.outWidth]}];let w=e.runWebGPUProgram(g,[r,f],a.dtype,m);return e.disposeData(f.dataId),w}var ga={kernelName:im,backendName:"webgpu",kernelFunc:sm};import{backend_util as am,MaxPoolGrad as nm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function um(o){let{inputs:t,backend:e,attrs:i}=o,{dy:r,input:s,output:a}=t,n=s;Te([s,a],"maxPoolGrad");let{filterSize:u,strides:p,pad:d,dimRoundingMode:c}=i,l=am.computePool2DInfo(n.shape,u,p,1,d,c),h=new re(l,"max",!0),m=[{type:"int32",data:[l.strideHeight,l.strideWidth]},{type:"int32",data:[l.padInfo.top,l.padInfo.left]},{type:"int32",data:[l.dilationHeight,l.dilationWidth]},{type:"int32",data:[l.inHeight,l.inWidth]},{type:"int32",data:[l.effectiveFilterHeight,l.effectiveFilterWidth]}],f=e.runWebGPUProgram(h,[n],"int32",m),g=new eo(l);m=[{type:"int32",data:[l.strideHeight,l.strideWidth]},{type:"int32",data:[l.effectiveFilterHeight-1-l.padInfo.top,l.effectiveFilterWidth-1-l.padInfo.left]},{type:"int32",data:[l.dilationHeight,l.dilationWidth]},{type:"int32",data:[l.effectiveFilterHeight,l.effectiveFilterWidth]},{type:"int32",data:[l.outHeight]},{type:"int32",data:[l.outWidth]}];let w=e.runWebGPUProgram(g,[r,f],n.dtype,m);return e.disposeData(f.dataId),w}var xa={kernelName:nm,backendName:"webgpu",kernelFunc:um};import{MaxPoolWithArgmax as pm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Ca,util as ya}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function dm(o){let{inputs:t,backend:e,attrs:i}=o,{filterSize:r,strides:s,pad:a,includeBatchInIndex:n}=i,{x:u}=t;ya.assert(u.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${u.shape.length}.`);let p=[1,1];ya.assert(Ca.eitherStridesOrDilationsAreOne(s,p),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${s} and dilations '${p}'`);let d=Ca.computePool2DInfo(u.shape,r,s,p,a),c=[{type:"int32",data:[d.strideHeight,d.strideWidth]},{type:"int32",data:[d.padInfo.top,d.padInfo.left]},{type:"int32",data:[d.dilationHeight,d.dilationWidth]},{type:"int32",data:[d.inHeight,d.inWidth]},{type:"int32",data:[d.effectiveFilterHeight,d.effectiveFilterWidth]}],l=new re(d,"max",!1),h=e.runWebGPUProgram(l,[u],u.dtype,c);l=new re(d,"max",!0,!0,n);let m=e.runWebGPUProgram(l,[u],"int32",c);return[h,m]}var Sa={kernelName:pm,backendName:"webgpu",kernelFunc:dm};import{Min as lm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function cm(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s,keepDims:a}=i;return Q(r,s,a,"min",e)}var wa={kernelName:lm,backendName:"webgpu",kernelFunc:cm};import{Minimum as hm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var mm=A({opType:D.MIN,cpuKernelImpl:Kr}),ba={kernelName:hm,backendName:"webgpu",kernelFunc:mm};import{MirrorPad as fm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var oo=class{constructor(t,e,i){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.map((r,s)=>r[0]+t[s]+r[1]),this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=t,e.map((r,s)=>{this.uniforms+=` pad${s} : vec2<i32>,`}),this.offset=i==="reflect"?0:1,this.shaderKey=`mirrorPad_${i}`}getUserCode(){let t=this.xShape.length,e=this.xShape.map((p,d)=>`uniforms.pad${d}[0]`).join(","),i=this.xShape.map((p,d)=>`uniforms.pad${d}[0] + uniforms.xShape${t>1?`[${d}]`:""}`).join(","),r=t===1?"start":"start[i]",s=t===1?"end":"end[i]",a=t===1?"outC":"outC[i]",n=T(t),u=t>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,t):"coords";return`
      ${x("index")} {
        if (index < uniforms.size) {
          let start = ${n}(${e});
          let end = ${n}(${i});
          var outC = getCoordsFromIndex(index);
          for (var i = 0; i < ${t}; i = i + 1) {
            if (${a} < ${r}) {
              ${a} = ${r} * 2 - ${a} - ${this.offset};
            } else if(${a} >= ${s}) {
              ${a} = (${s} - 1) * 2 - ${a} + ${this.offset};
            }
          }
          let coords = outC - start;
          setOutputAtIndex(index, getX(${u}));
        }
      }
    `}};var va={kernelName:fm,backendName:"webgpu",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{x:i}=o,{paddings:r,mode:s}=t,a=e,n=r.map(d=>({type:"int32",data:[d[0],d[1]]})),u=new oo(i.shape,r,s);return a.runWebGPUProgram(u,[i],i.dtype,n)}};import{Mod as gm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var xm=A({opType:D.MOD}),Ia={kernelName:gm,backendName:"webgpu",kernelFunc:xm};import{Multinomial as Sm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ro=class{constructor(t,e){this.variableNames=["probs"],this.outputShape=[],this.uniforms="seed : f32, numOutcomes: i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t,e],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="multinomial"}getUserCode(){return`
    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    fn random (seed : f32, resultUV : vec2<f32>) -> f32 {
      let HASHSCALE1 = 443.8975;
      let p = resultUV * seed;
      var p3  = fract(vec3<f32>(p.xyx) * HASHSCALE1);
      p3 = p3 + dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${x("index")} {
      if (index < uniforms.size) {
        let coords = getOutputCoords();
        let batch = coords[0];

        let resUV = vec2<f32>(f32(coords[1]) / f32(uniforms.outShape[1]),
            f32(coords[0]) / f32(uniforms.outShape[0]));
        let r = random(uniforms.seed, resUV);
        var cdf = 0.0;
        for (var i = 0; i < uniforms.numOutcomes - 1; i = i + 1) {
          cdf = cdf + getProbs(batch, i);

          if (r < cdf) {
            setOutputAtIndexI32(index, i);
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutputAtIndexI32(index, uniforms.numOutcomes - 1);
      }
    }
  `}};import{Softmax as Cm,util as ym}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var io=class{constructor(t){this.variableNames=["logits"],this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=[this.outputShape[0],1,1],this.outputShape[1]>=4096?this.workgroupSize=[256,1,1]:this.workgroupSize=[64,1,1],this.shaderKey="softmax"}getUserCode(){return`
    var<workgroup> buf : array<f32, ${this.workgroupSize[0]}>;
    var<workgroup> rowMaxShared : f32;
    var<workgroup> rowSumShared : f32;
    const blockSize = ${this.workgroupSize[0]};
    ${x("index")} {
      let row = index / blockSize;
      let tid = i32(localId.x);
      let cols = uniforms.outShape[1];

      var threadMax = -3.402823e+38f;
      for (var col = tid; col < cols; col += blockSize) {
        let value = getLogits(row, col);
        threadMax = max(threadMax, value);
      }
      if (tid < cols) {
        buf[tid] = threadMax;
      }
      workgroupBarrier();

      var reduceSize = min(cols, blockSize);
      for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
        reduceSize = currSize + (reduceSize & 1);
        if (tid < currSize) {
          buf[tid] = max(buf[tid], buf[tid + reduceSize]);
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowMaxShared = buf[0];
      }
      workgroupBarrier();

      var threadSum = 0.0;
      for (var col = tid; col < cols; col += blockSize) {
        let subExp = exp(getLogits(row, col) - rowMaxShared);
        threadSum += subExp;
      }
      buf[tid] = threadSum;
      workgroupBarrier();

      for (var currSize = blockSize >> 1;  currSize > 0; currSize = currSize >> 1) {
        if (tid < currSize) {
          buf[tid] = buf[tid] + buf[tid + currSize];
        }
        workgroupBarrier();
      }

      if (tid == 0) {
        rowSumShared = buf[0];
      }
      workgroupBarrier();

      for (var col = tid; col < cols; col += blockSize) {
        let value = exp(getLogits(row, col) - rowMaxShared) / rowSumShared;
        setOutputAtCoords(row, col, value);
      }
  }
    `}};function er(o){let{inputs:t,backend:e,attrs:i}=o,{logits:r}=t,{dim:s}=i,a=I({inputs:{x:r},backend:e,attrs:{shape:[ym.sizeFromShape(r.shape)/r.shape[s],r.shape[s]]}}),n=new io(a.shape),u=e.runWebGPUProgram(n,[a],r.dtype),p=I({inputs:{x:u},backend:e,attrs:{shape:r.shape}});return e.disposeData(a.dataId),e.disposeData(u.dataId),p}var ka={kernelName:Cm,backendName:"webgpu",kernelFunc:er};function wm(o){let{inputs:t,backend:e,attrs:i}=o,{logits:r}=t,{numSamples:s,seed:a,normalized:n}=i,u=n?r:er({inputs:{logits:r},backend:e,attrs:{dim:r.shape.length-1}}),p=u.shape[0],d=u.shape[1],c=new ro(p,s),l=[{type:"float32",data:[a]},{type:"int32",data:[d]}],h=e.runWebGPUProgram(c,[u],"int32",l);return n||e.disposeData(u.dataId),h}var Ra={kernelName:Sm,backendName:"webgpu",kernelFunc:wm};import{Neg as bm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function vm(o){let{inputs:t,backend:e}=o,{x:i}=t;if(e.shouldExecuteOnCPU([i])){let s=e.tensorMap.get(i.dataId),[a,n]=qr(s.values,i.shape,i.dtype);return e.makeTensorInfo(n,i.dtype,a)}let r=new j(i.shape,S.NEG);return e.runWebGPUProgram(r,[i],i.dtype)}var Da={kernelName:bm,backendName:"webgpu",kernelFunc:vm};import{kernel_impls as Im,NonMaxSuppressionV3 as km}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Rm(o){console.warn("tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:e,attrs:i}=o,{boxes:r,scores:s}=t,{maxOutputSize:a,iouThreshold:n,scoreThreshold:u}=i,p=e.readSync(r.dataId),d=e.readSync(s.dataId),{selectedIndices:c}=Im.nonMaxSuppressionV3Impl(p,d,a,n,u);return e.makeTensorInfo([c.length],"int32",new Int32Array(c))}var Pa={kernelName:km,backendName:"webgpu",kernelFunc:Rm};import{kernel_impls as Dm,NonMaxSuppressionV5 as Pm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function $m(o){console.warn("tf.nonMaxSuppression() in webgpu locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:e,attrs:i}=o,{boxes:r,scores:s}=t,{maxOutputSize:a,iouThreshold:n,scoreThreshold:u,softNmsSigma:p}=i,d=e.readSync(r.dataId),c=e.readSync(s.dataId),l=a,h=n,m=u,f=p,{selectedIndices:g,selectedScores:w}=Dm.nonMaxSuppressionV5Impl(d,c,l,h,m,f);return[e.makeTensorInfo([g.length],"int32",new Int32Array(g)),e.makeTensorInfo([w.length],"float32",new Float32Array(w))]}var $a={kernelName:Pm,backendName:"webgpu",kernelFunc:$m};import{OneHot as Nm,util as zm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var so=class{constructor(t,e){this.variableNames=["x"],this.uniforms="onValue : f32, offValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t,e],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="onehot"}getUserCode(){return`
      ${x("index")} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          setOutputAtIndex(index, mix(uniforms.offValue, uniforms.onValue,
                                      f32(i32(round(getX(coords.x))) == coords.y)));
        }
      }
    `}};function Am(o){let{inputs:t,backend:e,attrs:i}=o,{indices:r}=t,{dtype:s,depth:a,onValue:n,offValue:u}=i,p=zm.sizeFromShape(r.shape),d=new so(p,a),c=I({inputs:{x:r},backend:e,attrs:{shape:[p]}}),l=[{type:"float32",data:[n]},{type:"float32",data:[u]}],h=e.runWebGPUProgram(d,[c],s,l);e.disposeData(c.dataId);let m=[...r.shape,a],f=I({inputs:{x:h},backend:e,attrs:{shape:m}});return e.disposeData(h.dataId),f}var Na={kernelName:Nm,backendName:"webgpu",kernelFunc:Am};import{OnesLike as Lm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ZerosLike as Fm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ve(o){let{inputs:t,backend:e}=o,{x:i}=t;if(i.dtype==="complex64"){let r=ue({inputs:{input:i},backend:e}),s=Ve({inputs:{x:r},backend:e}),a=xe({inputs:{input:i},backend:e}),n=Ve({inputs:{x:a},backend:e}),u=J({inputs:{real:s,imag:n},backend:e});return e.disposeData(r.dataId),e.disposeData(s.dataId),e.disposeData(a.dataId),e.disposeData(n.dataId),u}else return _({attrs:{shape:i.shape,dtype:i.dtype,value:i.dtype==="string"?"":0},backend:e})}var za={kernelName:Fm,backendName:"webgpu",kernelFunc:Ve};function Aa(o){let{inputs:t,backend:e}=o,{x:i}=t;if(i.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(i.dtype==="complex64"){let r=ue({inputs:{input:i},backend:e}),s=Aa({inputs:{x:r},backend:e}),a=xe({inputs:{input:i},backend:e}),n=Ve({inputs:{x:a},backend:e}),u=J({inputs:{real:s,imag:n},backend:e});return e.disposeData(r.dataId),e.disposeData(s.dataId),e.disposeData(a.dataId),e.disposeData(n.dataId),u}else return _({attrs:{shape:i.shape,dtype:i.dtype,value:1},backend:e})}var Fa={kernelName:Lm,backendName:"webgpu",kernelFunc:Aa};import{Pack as Tm,util as La}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function _m(o){let{inputs:t,backend:e,attrs:i}=o,{axis:r}=i;if(t.length===1)return Ot({inputs:{input:t[0]},backend:e,attrs:{dim:r}});let s=t[0].shape,a=t[0].dtype;t.forEach(d=>{La.assertShapesMatch(s,d.shape,"All tensors passed to stack must have matching shapes"),La.assert(a===d.dtype,()=>"All tensors passed to stack must have matching dtypes")});let n=[],u=t.map(d=>{let c=Ot({inputs:{input:d},backend:e,attrs:{dim:r}});return n.push(c),c}),p=Ko({inputs:u,backend:e,attrs:{axis:r}});return n.forEach(d=>e.disposeData(d.dataId)),p}var Ta={kernelName:Tm,backendName:"webgpu",kernelFunc:_m};import{PadV2 as Bm,util as _a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function tr(o,t=!1){let e=o.length,i=T(e),r=o.map((c,l)=>`uniforms.pad${l}[0]`).join(","),s=o.map((c,l)=>`uniforms.pad${l}[0] + uniforms.xShape${e>1?`[${l}]`:""}`).join(","),a=e>1?`${i}(${r})`:`${r}`,n=e>1?`${i}(${s})`:`${s}`,u=e>1?"any(paddedCoords < start)":"paddedCoords < start",p=e>1?"any(paddedCoords >= end)":"paddedCoords >= end",d=e>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,e):"coords";return`
        let start = ${a};
        let end = ${n};
        if (${u} || ${p}) {
          setOutputAtIndex(index, ${t?0:"uniforms.constantValue"});
        } else {
          let coords = paddedCoords - start;
          setOutputAtIndex(index, getX(${d}));
        }
  `}var ao=class{constructor(t,e){this.variableNames=["x"],this.uniforms="constantValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e.map((i,r)=>i[0]+t[r]+i[1]),this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),e.map((i,r)=>{this.uniforms+=` pad${r} : vec2<i32>,`}),this.xShape=t,this.shaderKey="pad"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let paddedCoords = getCoordsFromIndex(index);
          ${tr(this.xShape)}
        }
      }
    `}};var Em=o=>{let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{paddings:s,constantValue:a}=i;if(s.every(p=>_a.arraysEqual(p,[0,0])))return B({inputs:{x:r},backend:e});if(_a.sizeFromShape(r.shape)===0){let p=s.map((d,c)=>d[0]+r.shape[c]+d[1]);return _({backend:e,attrs:{shape:p,value:a,dtype:r.dtype}})}let n=[{type:"float32",data:[a]}];s.map(p=>n.push({type:"int32",data:[p[0],p[1]]}));let u=new ao(r.shape,s);return e.runWebGPUProgram(u,[r],r.dtype,n)},Ba={kernelName:Bm,backendName:"webgpu",kernelFunc:Em};import{Pow as Um}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Wm=A({opType:D.POW}),Ea={kernelName:Um,backendName:"webgpu",kernelFunc:Wm};import{Prelu as Mm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Om(o){let{inputs:t,backend:e}=o,{x:i,alpha:r}=t,s=new ne(D.PRELU,i.shape,r.shape);return e.runWebGPUProgram(s,[i,r],"float32")}var Ua={kernelName:Mm,backendName:"webgpu",kernelFunc:Om};import{Prod as Vm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Hm(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{axis:s,keepDims:a}=i;return Q(r,s,a,"prod",e)}var Wa={kernelName:Vm,backendName:"webgpu",kernelFunc:Hm};import{Range as Gm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Km=o=>{let{backend:t,attrs:e}=o,{start:i,stop:r,step:s,dtype:a}=e,n=Qr(i,r,s,a);return t.makeTensorInfo([n.length],a,n)},Ma={kernelName:Gm,backendName:"webgpu",kernelFunc:Km};import{RealDiv as Xm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var qm=A({opType:D.DIV}),Oa={kernelName:Xm,backendName:"webgpu",kernelFunc:qm};import{Reciprocal as Ym}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jm=P({opType:S.RECIPROCAL}),Va={kernelName:Ym,backendName:"webgpu",kernelFunc:jm};import{Relu as Qm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Zm=P({opType:S.RELU}),Ha={kernelName:Qm,backendName:"webgpu",kernelFunc:Zm};import{Relu6 as Jm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ef=P({opType:S.RELU6}),Ga={kernelName:Jm,backendName:"webgpu",kernelFunc:ef};import{ResizeBilinear as tf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var no=class{constructor(t,e,i){this.variableNames=["x"],this.uniforms="adjustHeightWidth : vec2<f32>, halfPixelCenters : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t[0],e,i,t[3]],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="resizeBilinear"}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC =
            (vec2<f32>(rc) + vec2<f32>(uniforms.halfPixelCenters)) *
            effectiveInputOverOutputRatioRC - vec2<f32>(uniforms.halfPixelCenters);

          // Compute the four integer indices.
          let sourceFloorRC = vec2<i32>(sourceFracIndexRC);
          let sourceCeilRC = vec2<i32>(
            min(vec2<f32>(uniforms.xShape.yz) - vec2<f32>(1.0), ceil(sourceFracIndexRC)));

          let topLeft = getX(b, sourceFloorRC.x, sourceFloorRC.y, d);
          let bottomLeft = getX(b, sourceCeilRC.x, sourceFloorRC.y, d);
          let topRight = getX(b, sourceFloorRC.x, sourceCeilRC.y, d);
          let bottomRight = getX(b, sourceCeilRC.x, sourceCeilRC.y, d);

          let fracRC = sourceFracIndexRC - vec2<f32>(sourceFloorRC);

          let top = topLeft + (topRight - topLeft) * fracRC.y;
          let bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
          let newValue = top + (bottom - top) * fracRC.x;

          setOutputAtIndex(index, newValue);
        }
      }
    `}};function of(o){let{inputs:t,backend:e,attrs:i}=o,{images:r}=t,{alignCorners:s,size:a,halfPixelCenters:n}=i,[u,p]=a,d=s&&u>1?1:0,c=s&&p>1?1:0,h=[{type:"float32",data:[d,c]},{type:"float32",data:[n?.5:0]}],m=new no(r.shape,u,p);return e.runWebGPUProgram(m,[r],"float32",h)}var Ka={kernelName:tf,backendName:"webgpu",kernelFunc:of};import{ResizeBilinearGrad as rf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var uo=class{constructor(t,e){this.variableNames=["dy"],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, heightScale : f32, widthScale : f32,
       invHeightScale : f32, invWidthScale : f32, winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=e,this.shaderKey=`resizeBilinearBackprop_${e}`}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(startRLerp - f32(uniforms.winHeight / 2));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(startCLerp - f32(uniforms.winWidth / 2));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let dxR = f32(dyR) * uniforms.heightScale;
              let topDxRIndex = i32(floor(dxR));
              let bottomDxRIndex = i32(min(ceil(dxR), f32(uniforms.outShape[1] - 1)));
              let dxRLerp = dxR - f32(topDxRIndex);
              let inverseDxRLerp = 1.0 - dxRLerp;

              let dxC = f32(dyC) * uniforms.widthScale;
              let leftDxCIndex = i32(floor(dxC));
              let rightDxCIndex = i32(min(ceil(dxC), f32(uniforms.outShape[2] - 1)));
              let dxCLerp = dxC - f32(leftDxCIndex);
              let inverseDxCLerp = 1.0 - dxCLerp;

              if (r == topDxRIndex && c == leftDxCIndex) {
                // topLeft
                accumulator +=
                  getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
              }

              if (r == topDxRIndex && c == rightDxCIndex) {
                // topRight
                accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
              }

              if (r == bottomDxRIndex && c == leftDxCIndex) {
                // bottomLeft
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
              }

              if (r == bottomDxRIndex && c == rightDxCIndex) {
                // bottomRight
                accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}};function sf(o){let{inputs:t,backend:e,attrs:i}=o,{images:r,dy:s}=t,{alignCorners:a}=i,[,n,u]=r.shape,[,p,d]=s.shape,c=[a&&p>1?n-1:n,a&&d>1?u-1:u],l=[a&&p>1?p-1:p,a&&d>1?d-1:d],h=c[0]/l[0],m=c[1]/l[1],f=1/h,g=1/m,w=Math.ceil(f)*2+2,b=Math.ceil(g)*2+2,v=new uo(r.shape,a),k=[{type:"int32",data:c},{type:"int32",data:l},{type:"float32",data:[h]},{type:"float32",data:[m]},{type:"float32",data:[f]},{type:"float32",data:[g]},{type:"int32",data:[w]},{type:"int32",data:[b]}];return e.runWebGPUProgram(v,[s],s.dtype,k)}var Xa={kernelName:rf,backendName:"webgpu",kernelFunc:sf};import{ResizeNearestNeighbor as af}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var po=class{constructor(t,e,i,r){this.variableNames=["x"],this.uniforms="adjustHeightWidth : vec2<f32>, roundBase : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[t[0],e,i,t[3]],this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.halfPixelCenters=r,this.shaderKey=`resizeNearest_${r}`}getUserCode(){let t;return this.halfPixelCenters?t="max((vec2<f32>(rc) + vec2<f32>(0.5)) * effectiveInputOverOutputRatioRC, vec2<f32>(0.0))":t="vec2<f32>(rc) * effectiveInputOverOutputRatioRC",`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC = ${t};

          // Compute the coordinators of nearest neighbor point.
          let inputShapeRC = vec2<f32>(f32(uniforms.xShape.y), f32(uniforms.xShape.z));
          let sourceNearestRC = vec2<i32>(
            min(inputShapeRC - 1.0, floor(sourceFracIndexRC + uniforms.roundBase)));
          let newValue = getX(b, sourceNearestRC.x, sourceNearestRC.y, d);

          setOutputAtIndex(index, newValue);
        }
      }
    `}};function nf(o){let{inputs:t,backend:e,attrs:i}=o,{images:r}=t,{alignCorners:s,halfPixelCenters:a,size:n}=i,[u,p]=n,d=s&&u>1?1:0,c=s&&p>1?1:0,h=[{type:"float32",data:[d,c]},{type:"float32",data:[s?.5:0]}],m=new po(r.shape,u,p,a);return e.runWebGPUProgram(m,[r],r.dtype,h)}var qa={kernelName:af,backendName:"webgpu",kernelFunc:nf};import{ResizeNearestNeighborGrad as uf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var lo=class{constructor(t,e){this.variableNames=["dy"],this.uniforms=`effectiveXSize : vec2<i32>, effectiveYSize : vec2<i32>, invHeightScale : f32, invWidthScale : f32,
       winHeight : i32, winWidth : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.alignCorners=e,this.shaderKey=`resizeNearestNeigborBackprop_${e}`}getUserCode(){return`
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getOutputCoords();
          let b = coords[0];
          let d = coords[3];
          let r = coords[1];
          let c = coords[2];

          var accumulator = 0.0;

          // Compute bounds for where in dy we will look
          let startRLerp = floor(f32(r) * uniforms.invHeightScale);
          let startDyR = i32(floor(startRLerp - f32(uniforms.winHeight / 2)));

          let startCLerp = floor(f32(c) * uniforms.invWidthScale);
          let startDyC = i32(floor(startCLerp - f32(uniforms.winWidth / 2)));

          // Loop over dy
          for (var dyROffset = 0; dyROffset < uniforms.winHeight; dyROffset++) {
            let dyR = startDyR + dyROffset;

            // Guard against the window exceeding the bounds of dy
            if (dyR < 0 || dyR >= uniforms.dyShape[1]) {
              continue;
            }

            for (var dyCOffset = 0; dyCOffset < uniforms.winWidth; dyCOffset++) {
              let dyC = startDyC + dyCOffset;

              // Guard against the window exceeding the bounds of dy
              if (dyC < 0 || dyC >= uniforms.dyShape[2]) {
                continue;
              }

              let sourceFracRow = f32(uniforms.effectiveXSize[0]) *
                  (f32(dyR) / f32(uniforms.effectiveYSize[0]));

              let sourceFracCol = f32(uniforms.effectiveXSize[1]) *
                  (f32(dyC) / f32(uniforms.effectiveYSize[1]));

              let sourceNearestRow =
                  i32(min(f32(uniforms.outShape[1] - 1),
                  ${this.alignCorners?"floor(sourceFracRow + 0.5)":"floor(sourceFracRow)"}));

              let sourceNearestCol =
                  i32(min(f32(uniforms.outShape[2] - 1),
                  ${this.alignCorners?"floor(sourceFracCol + 0.5)":"floor(sourceFracCol)"}));

              if (r == sourceNearestRow && c == sourceNearestCol) {
                accumulator += getDy(b, dyR, dyC, d);
              }
            }
          }
          // End loop over dy

          setOutputAtIndex(index, accumulator);
        }
      }
    `}};function pf(o){let{inputs:t,backend:e,attrs:i}=o,{images:r,dy:s}=t,{alignCorners:a}=i,[,n,u]=r.shape,[,p,d]=s.shape,c=[a&&p>1?n-1:n,a&&d>1?u-1:u],l=[a&&p>1?p-1:p,a&&d>1?d-1:d],h=c[0]/l[0],m=c[1]/l[1],f=1/h,g=1/m,w=Math.ceil(f)*2+2,b=Math.ceil(g)*2+2,v=new lo(r.shape,a),k=[{type:"int32",data:c},{type:"int32",data:l},{type:"float32",data:[f]},{type:"float32",data:[g]},{type:"int32",data:[w]},{type:"int32",data:[b]}];return e.runWebGPUProgram(v,[s],s.dtype,k)}var Ya={kernelName:uf,backendName:"webgpu",kernelFunc:pf};import{Reverse as df,util as lf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var co=class{constructor(t){this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=" axis : vec4<i32>,",this.shaderKey="reverse"}getUserCode(){return`
      
      // Using uniform variables as judging conditions, so the function has
      // coherent execution within all threads.
      fn getReverseCoords(coords : vec4<i32>) -> vec4<i32> {
        var reverseCoords = coords;
        if (uniforms.axis[0] == 1) {
          reverseCoords[0] = uniforms.xShape[0] - coords[0] - 1;
        }
        if (uniforms.axis[1] == 1) {
          reverseCoords[1] = uniforms.xShape[1] - coords[1] - 1;
        }
        if (uniforms.axis[2] == 1) {
          reverseCoords[2] = uniforms.xShape[2] - coords[2] - 1;
        }
        if (uniforms.axis[3] == 1) {
          reverseCoords[3] = uniforms.xShape[3] - coords[3] - 1;
        }

        return reverseCoords;
      }
    
      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let reverseCoords = getReverseCoords(coords);
          setOutputAtIndex(index, getX(reverseCoords[0],
              reverseCoords[1], reverseCoords[2], reverseCoords[3]));
        }
      }
    `}};function cf(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{dims:s}=i,a=r.shape.length;if(a===0)return B({inputs:{x:r},backend:e});let n=r.shape,u=[1,1,1,1];n.forEach((g,w)=>{let b=w+4-a;u[b]=g});let p=lf.parseAxisParam(s,r.shape),d=[0,0,0,0];p.forEach(g=>{let w=g+4-a;d[w]=1});let c=[{type:"int32",data:d}],l=I({inputs:{x:r},backend:e,attrs:{shape:u}}),h=new co(u),m=e.runWebGPUProgram(h,[l],l.dtype,c);e.disposeData(l.dataId);let f=I({inputs:{x:m},backend:e,attrs:{shape:n}});return e.disposeData(m.dataId),f}var ja={kernelName:df,backendName:"webgpu",kernelFunc:cf};import{backend_util as hf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{RotateWithOffset as mf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ho=class{constructor(t,e){this.outputShape=[],this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`centerX : f32, centerY : f32, sinRadians : f32,
          cosRadians : f32,`,this.shaderKey="rotate",this.outputShape=t,typeof e=="number"?(this.uniforms+=" fillValue : f32,",this.fillSnippet="var outputValue = uniforms.fillValue;",this.shaderKey+="_float"):(this.uniforms+=" fillValue : vec3<f32>,",this.fillSnippet="var outputValue = uniforms.fillValue[coords[3]];",this.shaderKey+="_vec3")}getUserCode(){return`
        ${x("index")} {
          if (index < uniforms.size) {
            let coords = getCoordsFromIndex(index);
            let coordXFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.cosRadians - (f32(coords[1]) - uniforms.centerY) *
                uniforms.sinRadians;
            let coordYFloat = (f32(coords[2]) - uniforms.centerX) *
                uniforms.sinRadians + (f32(coords[1]) - uniforms.centerY) *
                uniforms.cosRadians;
            let coordX = i32(round(coordXFloat + uniforms.centerX));
            let coordY = i32(round(coordYFloat + uniforms.centerY));
            ${this.fillSnippet}
            if(coordX >= 0 && coordX < uniforms.xShape[2] && coordY >= 0 &&
                coordY < uniforms.xShape[1]) {
              outputValue = getX(coords[0], coordY, coordX, coords[3]);
            }
            setOutputAtIndex(index, outputValue);
          }
        }
      `}};var Qa={kernelName:mf,backendName:"webgpu",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{image:i}=o,{radians:r,fillValue:s,center:a}=t,n=e,u=new ho(i.shape,s),[p,d]=hf.getImageCenter(a,i.shape[1],i.shape[2]),c=[{type:"float32",data:[p]},{type:"float32",data:[d]},{type:"float32",data:[Math.sin(r)]},{type:"float32",data:[Math.cos(r)]}];return typeof s=="number"?c.push({type:"float32",data:[Number.parseFloat(s.toFixed(2))]}):c.push({type:"float32",data:s}),n.runWebGPUProgram(u,[i],i.dtype,c)}};import{Round as ff}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gf=P({opType:S.ROUND}),Za={kernelName:ff,backendName:"webgpu",kernelFunc:gf};import{Rsqrt as xf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Cf=P({opType:S.RSQRT,cpuKernelImpl:Zr}),Ja={kernelName:xf,backendName:"webgpu",kernelFunc:Cf};import{backend_util as yf,ScatterNd as Sf,util as wf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ie=class{constructor(t,e,i,r,s,a,n,u=!0){this.variableNames=["updates","indices"],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=a,this.type=n,this.sumDupeIndices=u,this.dispatchLayout=y(t),this.dispatch=C(this.dispatchLayout,t,this.workgroupSize),this.sliceDimGreaterThanOne=e>1,this.shaderKey=`scatter_${i}_${r}_${this.sliceDimGreaterThanOne}_${n}_${u}_${s.length}`;let p=T(s.length);this.uniforms=`sliceDim : i32, strides: ${p}, updatesSize: i32,`,this.updatesRank=r,this.indicesRank=i}getUserCode(){let t="";this.indicesRank===1?t="coords[0]":this.indicesRank===2&&(t="coords[0], j");let e=`getIndices(${t})`,i=this.sliceDimGreaterThanOne?"uniforms.strides[j]":"uniforms.strides",r="",s="";this.dispatchLayout.x.length===1?(r="flattenedIndex",s=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> i32 {
        return index;
      }
      `):this.dispatchLayout.x.length===2&&(r="vec2<i32>(flattenedIndex, coords[1])",s=`
      fn getUpdatesCoordsFromFlatIndex(index : i32) -> vec2<i32> {
        // N.B. |updates| could be a scalar tensor, conceptually representing a
        // 2D tensor with all values equal to that. By design, its size must be
        // the same as |outShape[1]| in one dimension, and |indicesShape[0]|
        // gives the other.
        let sliceSize = uniforms.outShape[1];
        let d0 = index / sliceSize;
        let d1 = index - d0 * sliceSize;
        return vec2<i32>(d0, d1);
      }
      `);let n=`getUpdates(${Array.from({length:this.updatesRank},(p,d)=>`coords[${d}]`).join(", ")})`;return`
    ${s}
      ${x("index")} {
        if (index < uniforms.updatesSize) {
          let coords = getUpdatesCoordsFromFlatIndex(index);
          var flattenedIndex = 0;
          for (var j = 0; j < uniforms.sliceDim; j = j + 1) {
            let indexInside = i32(round(${e}));
            flattenedIndex = flattenedIndex + indexInside * ${i};
          }
          let updateValue =
              ${pe(this.type)}(${n});
          let flatIndex = getOutputIndexFromCoords(${r});

          ${this.sumDupeIndices?q("&result[flatIndex]","updateValue",this.type):"atomicStore(&result[flatIndex], bitcast<i32>(updateValue));"}
        }
      }`}};function bf(o){let{inputs:t,backend:e,attrs:i}=o,{indices:r,updates:s}=t,{shape:a}=i,{sliceRank:n,numUpdates:u,sliceSize:p,strides:d,outputSize:c}=yf.calculateShapes(s,r,a),l=[c/p,p];if(c===0)return e.makeTensorInfo(a,r.dtype);let h=I({inputs:{x:r},backend:e,attrs:{shape:[u,n]}}),m=I({inputs:{x:s},backend:e,attrs:{shape:[u,p]}}),f=m.dtype,g=_({backend:e,attrs:{shape:l,value:0,dtype:f}}),w=wf.sizeFromShape(m.shape),b=[{type:"int32",data:[n]},{type:"int32",data:d},{type:"int32",data:[w]}],v=new ie(m.shape,n,h.shape.length,m.shape.length,d,l,f),k=e.runWebGPUProgram(v,[m,h],f,b,g),R=I({inputs:{x:k},backend:e,attrs:{shape:a}});return e.disposeData(h.dataId),e.disposeData(m.dataId),e.disposeData(k.dataId),R}var en={kernelName:Sf,backendName:"webgpu",kernelFunc:bf};import{SearchSorted as vf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var mo=class{constructor(t,e){this.outputShape=[],this.variableNames=["sortedSequence","values"],this.uniforms="numInputs : i32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.side=e,this.shaderKey=`search_sorted_${e}`}getUserCode(){return`
      fn findBound(batch: i32, value: f32) -> i32 {
        var left = i32(0);
        var right = uniforms.numInputs;
        while (left < right) {
          var mid = (left + right) / 2;
          if (getSortedSequence(batch, mid) ${this.side==="left"?"<":"<="} value) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }
        return right;
      }

      ${x("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let value = getValuesByOutputIndex(index);
          setOutputAtIndexI32(index, findBound(coords[0], value));
        }
      }
    `}};function If(o){let{inputs:t,backend:e,attrs:i}=o,{sortedSequence:r,values:s}=t,{side:a}=i,n=new mo([s.shape[0],s.shape[1]],a),u=[{type:"int32",data:[r.shape[1]]}];return e.runWebGPUProgram(n,[r,s],"int32",u)}var tn={kernelName:vf,backendName:"webgpu",kernelFunc:If};import{Select as kf,upcastType as Rf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var fo=class{constructor(t,e,i){this.variableNames=["c","a","b"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.cRank=t,this.rank=i,this.shaderKey="select"}getUserCode(){let t,e;if(this.rank>4)throw Error(`Where for rank ${this.rank} is not yet supported`);if(this.rank===1)e="resRC",t="resRC";else{let r=["resRC.x","resRC.y","resRC.z","resRC.w"],s=[],a=[];for(let n=0;n<this.outputShape.length;n++)a.push(`${r[n]}`),n<this.cRank&&s.push(`${r[n]}`);t=s.join(),e=a.join()}return`
      ${x("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          let cVal = getC(${t});
          if (cVal >= 1.0) {
            setOutputAtIndex(index, getA(${e}));
          } else {
            setOutputAtIndex(index, getB(${e}));
          }
        }
      }
    `}};function Df(o){let{inputs:t,backend:e}=o,{condition:i,t:r,e:s}=t,a=new fo(i.shape.length,r.shape,r.shape.length);return e.runWebGPUProgram(a,[i,r,s],Rf(r.dtype,s.dtype))}var on={kernelName:kf,backendName:"webgpu",kernelFunc:Df};import{Selu as Pf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $f=P({opType:S.SELU}),rn={kernelName:Pf,backendName:"webgpu",kernelFunc:$f};import{Sigmoid as Nf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zf=P({opType:S.SIGMOID}),sn={kernelName:Nf,backendName:"webgpu",kernelFunc:zf};import{Sign as Af}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ff=P({opType:S.SIGN}),an={kernelName:Af,backendName:"webgpu",kernelFunc:Ff};import{Sin as Lf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Tf=P({opType:S.SIN}),nn={kernelName:Lf,backendName:"webgpu",kernelFunc:Tf};import{Sinh as _f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bf=P({opType:S.SINH}),un={kernelName:_f,backendName:"webgpu",kernelFunc:Bf};import{Softplus as Ef}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Uf=P({opType:S.SOFTPLUS}),pn={kernelName:Ef,backendName:"webgpu",kernelFunc:Uf};import{backend_util as or,SpaceToBatchND as Wf,util as dn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var go=class{constructor(t,e,i,r,s,a){this.variableNames=["x"],this.outputShape=[],this.uniforms="",this.workgroupSize=[64,1,1],this.size=!0;let n=new Array(r.length);for(let u=0;u<n.length;u++)n[u]=r[s[u]];this.outputShape=n,this.newDim=s,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=t,this.paddedXShape=e,this.uniforms+=`reshapedPaddedXShape : ${T(r.length)}, paddedXShapeStrides : ${T(a)}, `,i.map((u,p)=>{this.uniforms+=` pad${p} : vec2<i32>,`}),this.shaderKey=`spaceToBatchND_${s}`}getUserCode(){let t=T(this.outputShape.length),e=Lo(this.newDim);return`
      ${ze(this.paddedXShape,"PaddedX")}
      ${x("index")} {
        if(index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let switchedIndex = getIndexFromCoords${this.outputShape.length}D(${t}(${e}), uniforms.reshapedPaddedXShape);
          let paddedCoords = getPaddedXCoordsFromIndex(switchedIndex);
          ${tr(this.xShape,!0)}
        }
      }
    `}};var Mf=o=>{let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{blockShape:s,paddings:a}=i;dn.assert(r.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGPU backend not implemented yet");let n=s.reduce((b,v)=>b*v),u=[[0,0]];u.push(...a);for(let b=1+s.length;b<r.shape.length;++b)u.push([0,0]);let p=u.map((b,v)=>b[0]+r.shape[v]+b[1]),d=or.getReshaped(p,s,n,!1),c=or.getPermuted(d.length,s.length,!1),l=or.getReshapedPermuted(p,s,n,!1),h=dn.computeStrides(p),m=new go(r.shape,p,u,d,c,h.length),f=[{type:"int32",data:d},{type:"int32",data:h}];u.map(b=>f.push({type:"int32",data:[b[0],b[1]]}));let g=e.runWebGPUProgram(m,[r],r.dtype,f),w=I({inputs:{x:g},backend:e,attrs:{shape:l}});return e.disposeData(g.dataId),w},ln={kernelName:Wf,backendName:"webgpu",kernelFunc:Mf};import{SparseSegmentMean as Of}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as cn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var xo=class{constructor(t,e,i){this.variableNames=["input","indices","segmentIds"],this.outputShape=[],this.uniforms="segmentSize : i32, sparseSize : i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=t,this.type=i,this.dispatchLayout=y([e]),this.dispatch=C(this.dispatchLayout,[e],this.workgroupSize),this.shaderKey="sparseSegmentSum"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.sparseSize) {
        let indexInSegmentIds = index / uniforms.segmentSize;
        let indexInSegment = index % uniforms.segmentSize;
        let indexInInput = indices[indexInSegmentIds];
        let segmentId = segmentIds[indexInSegmentIds];

        let value = input[indexInInput * uniforms.segmentSize + indexInSegment];
        let outIndex = segmentId * uniforms.segmentSize + indexInSegment;
        ${q("&result[outIndex]","value",this.type)}
      }
    }
  `}},Co=class{constructor(t,e){this.variableNames=["segmentIds"],this.outputShape=[],this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=[t],this.dispatchLayout=y(e),this.dispatch=C(this.dispatchLayout,e,this.workgroupSize),this.shaderKey="sparseSegmentIdCountProgram"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.segmentIdsShape) {
        let segmentId = segmentIds[index];
        ${q("&result[segmentId]","1","int32")}
      }
    }
  `}},yo=class{constructor(t,e){this.variableNames=["segmentSum","sameSegmentIdCount"],this.outputShape=[],this.uniforms="segmentSize : i32",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.type=e,this.dispatchLayout=y(t),this.dispatch=C(this.dispatchLayout,t,this.workgroupSize),this.shaderKey="sparseSegmentMean"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.size) {
        let segmentId = index / uniforms.segmentSize;
        let count = sameSegmentIdCount[segmentId];
        if (count != 0) {
          ${this.type==="float32"?"setOutputAtIndex(index, segmentSum[index] / f32(count));":"setOutputAtIndexI32(index, segmentSum[index] / count);"}
        }
      }
    }
  `}};function So(o,t,e,i=!1,r){let a=cn.sizeFromShape(o.shape)/o.shape[0],n=o.dtype,u=cn.sizeFromShape(t.shape),p=r.readSync(e.dataId),c=u>0?p[u-1]+1:0,l,h=o.shape.slice();h[0]=c;let m=u*a,f=_({backend:r,attrs:{shape:h,value:0,dtype:n}});l=new xo(h,m,n);let g=[{type:"int32",data:[a]},{type:"int32",data:[m]}],w=r.runWebGPUProgram(l,[o,t,e],n,g,f);if(i)return w;let b=_({backend:r,attrs:{shape:[c],value:0,dtype:"int32"}});l=new Co(c,e.shape);let v=r.runWebGPUProgram(l,[e],"int32",null,b),k=_({backend:r,attrs:{shape:h,value:0,dtype:n}});l=new yo(h,n),g=[{type:"int32",data:[a]}];let R=r.runWebGPUProgram(l,[w,v],n,g,k);return r.disposeData(w.dataId),r.disposeData(v.dataId),R}function Vf(o){let{inputs:t,backend:e}=o,{data:i,indices:r,segmentIds:s}=t;return So(i,r,s,!1,e)}var hn={kernelName:Of,backendName:"webgpu",kernelFunc:Vf};import{SparseSegmentSum as Hf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Gf(o){let{inputs:t,backend:e}=o,{data:i,indices:r,segmentIds:s}=t;return So(i,r,s,!0,e)}var mn={kernelName:Hf,backendName:"webgpu",kernelFunc:Gf};import{backend_util as jf,SparseToDense as Qf,util as rr}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{buffer as Xf,Tile as qf,util as Yf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wo=class{constructor(t,e){this.variableNames=["A"],this.workgroupSize=[64,1,1],this.size=!0;let i=new Array(t.length);for(let r=0;r<i.length;r++)i[r]=t[r]*e[r];this.outputShape=i,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.rank=this.outputShape.length,this.shaderKey="tile"}getUserCode(){let t=Kf(this.rank,"uniforms.");return`
      ${x("index")} {
        if (index < uniforms.size) {
          let resRC = getCoordsFromIndex(index);
          setOutputAtIndex(index, getA(${t}));
        }
      }
    `}};function Kf(o,t=""){if(o>=5)throw Error(`Tile for rank ${o} is not yet supported`);if(o===1)return`(resRC % ${t}aShape)`;let e=["resRC.x","resRC.y","resRC.z","resRC.w"],i=[];for(let r=0;r<o;r++)i.push(`(${e[r]} % ${t}aShape[${r}])`);return i.join()}function He(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{reps:s}=i;if(e.shouldExecuteOnCPU([r])||r.dtype==="string"||r.shape.length>=5){let u=e.readSync(r.dataId),p=r.dtype==="string"?u.map(l=>Yf.decodeString(l)):u,d=Xf(r.shape,r.dtype,p),c=si(d,s);return e.makeTensorInfo(c.shape,c.dtype,c.values)}let a=new wo(r.shape,s);return e.runWebGPUProgram(a,[r],r.dtype)}var fn={kernelName:qf,backendName:"webgpu",kernelFunc:He};function Zf(o){let{inputs:t,backend:e,attrs:i}=o,{sparseIndices:r,sparseValues:s,defaultValue:a}=t,{outputShape:n}=i,{sliceRank:u,numUpdates:p,sliceSize:d,strides:c,outputSize:l}=jf.calculateShapes(s,r,n),h=!1;if(s.dtype==="string"){let L=e.bufferSync(r),F=e.bufferSync(s),W=rr.decodeString(e.readSync(a.dataId)[0]),E=Jr(L,F,n,l,d,p,u,c,W,h);return e.makeTensorInfo(n,E.dtype,E.values)}let m=[l/d,d],f=I({inputs:{x:r},backend:e,attrs:{shape:[p,u]}}),g=s.shape.length?I({inputs:{x:s},backend:e,attrs:{shape:[p,d]}}):B({inputs:{x:s},backend:e}),w=g.dtype,b=e.makeTensorInfo([],w,rr.makeZerosTypedArray(1,w)),v=I({inputs:{x:a},backend:e,attrs:{shape:Array(m.length).fill(1)}}),k=He({inputs:{x:v},backend:e,attrs:{reps:m}}),R=rr.sizeFromShape([p,d]),$=[{type:"int32",data:[u]},{type:"int32",data:c},{type:"int32",data:[R]}];switch(p){case 0:break;case 1:{let L=new ie([p,d],u,f.shape.length,g.shape.length,c,m,w,h);e.runWebGPUProgram(L,[g,f],w,$,k)}break;default:{let L=new ie([p,d],u,f.shape.length,b.shape.length,c,m,w,h);e.runWebGPUProgram(L,[b,f],w,$,k)}{let L=new ie([p,d],u,f.shape.length,g.shape.length,c,m,w);e.runWebGPUProgram(L,[g,f],w,$,k)}}let N=I({inputs:{x:k},backend:e,attrs:{shape:n}});return e.disposeData(f.dataId),e.disposeData(g.dataId),e.disposeData(v.dataId),e.disposeData(b.dataId),e.disposeData(k.dataId),N}var gn={kernelName:Qf,backendName:"webgpu",kernelFunc:Zf};import{backend_util as Jf,SplitV as eg,util as tg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function og(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{numOrSizeSplits:s,axis:a}=i,n=tg.parseAxisParam(a,r.shape)[0],u=Jf.prepareSplitSize(r,s,n),p=r.shape.length,d=new Array(p).fill(0),c=r.shape.slice();return u.map(l=>{let h=[...c];h[n]=l;let m=oe({inputs:{x:r},backend:e,attrs:{begin:d,size:h}});return d[n]+=l,m})}var xn={kernelName:eg,backendName:"webgpu",kernelFunc:og};import{Sqrt as rg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ig=P({opType:S.SQRT}),Cn={kernelName:rg,backendName:"webgpu",kernelFunc:ig};import{Square as sg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var yn={kernelName:sg,backendName:"webgpu",kernelFunc:({inputs:o,backend:t})=>{let{x:e}=o,i=t,r=new j(e.shape,S.SQUARE);return i.runWebGPUProgram(r,[e],e.dtype)}};import{SquaredDifference as ag}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ng=A({opType:D.SQUARED_DIFFERENCE}),Sn={kernelName:ag,backendName:"webgpu",kernelFunc:ng};import{Step as ug}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function pg({inputs:o,attrs:t,backend:e}){let{x:i}=o,r=new j(i.shape,S.STEP,"stepAlpha : f32,"),s=[{type:"float32",data:[t.alpha]}];return e.runWebGPUProgram(r,[i],i.dtype,s)}var wn={kernelName:ug,backendName:"webgpu",kernelFunc:pg};import{buffer as dg,slice_util as bn,StridedSlice as lg,util as cg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var bo=class{constructor(t){this.variableNames=["x"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]);let e=T(this.outputShape.length);this.uniforms=`begin : ${e},  strides : ${e}, `,this.shaderKey="stridedSlice"}getUserCode(){let t=this.outputShape.length,e="";if(t===1)e="coords * uniforms.strides + uniforms.begin";else{let r=0;e=this.outputShape.map((s,a)=>(r++,this.outputShape.length===1?`coords * uniforms.strides[${a}] + uniforms.begin[${a}]`:`coords[${r-1}] * uniforms.strides[${a}] + uniforms.begin[${a}]`)).join(",")}return`
       ${x("index")} {
         if (index < uniforms.size) {
           let coords = getCoordsFromIndex(index);
           setOutputAtIndex(index, getX(${e}));
         }
       }
     `}};function hg(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{begin:s,end:a,strides:n,beginMask:u,endMask:p,ellipsisMask:d,newAxisMask:c,shrinkAxisMask:l}=i,{finalShapeSparse:h,finalShape:m,isIdentity:f,sliceDim0:g,isSimpleSlice:w,begin:b,end:v,strides:k}=bn.sliceInfo(r.shape,s,a,n,u,p,d,c,l),R;if(f)R=I({inputs:{x:r},backend:e,attrs:{shape:m}});else if(g||w){cg.assert(r.shape.length>=1,()=>`Input must have rank at least 1, got: ${r.shape.length}`);let $=bn.computeOutShape(b,v,k),N=oe({inputs:{x:r},backend:e,attrs:{begin:b,size:$}});R=I({inputs:{x:N},backend:e,attrs:{shape:m}}),e.disposeData(N.dataId)}else if(e.shouldExecuteOnCPU([r])){let N=e.readSync(r.dataId),L=dg(r.shape,r.dtype,N),F=oi(h,L,k,b);R=e.makeTensorInfo(m,r.dtype,F.values)}else{let N=new bo(h),L=[{type:"int32",data:b},{type:"int32",data:k}],F=e.runWebGPUProgram(N,[r],r.dtype,L);R=I({inputs:{x:F},backend:e,attrs:{shape:m}}),e.disposeData(F.dataId)}return R}var vn={kernelName:lg,backendName:"webgpu",kernelFunc:hg};import{StringNGrams as mg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function fg(o){let{inputs:t,backend:e,attrs:i}=o,{separator:r,nGramWidths:s,leftPad:a,rightPad:n,padWidth:u,preserveShortSequences:p}=i,{data:d,dataSplits:c}=t,l=e.readSync(d.dataId),h=e.readSync(c.dataId),[m,f]=ri(l,h,r,s,a,n,u,p);return[e.makeTensorInfo([m.length],"string",m),e.makeTensorInfo(c.shape,"int32",f)]}var In={kernelName:mg,backendName:"webgpu",kernelFunc:fg};import{Sub as gg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var xg=A({opType:D.SUB,cpuKernelImpl:ii,supportsComplex:!0}),kn={kernelName:gg,backendName:"webgpu",kernelFunc:xg};import{Tan as Cg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var yg=P({opType:S.TAN}),Rn={kernelName:Cg,backendName:"webgpu",kernelFunc:yg};import{Tanh as Sg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wg=P({opType:S.TANH}),Dn={kernelName:Sg,backendName:"webgpu",kernelFunc:wg};import{backend_util as bg,TensorScatterUpdate as vg,util as Ig}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function kg(o){let{inputs:t,backend:e,attrs:i}=o,{tensor:r,indices:s,updates:a}=t,{}=i,{sliceRank:n,numUpdates:u,sliceSize:p,strides:d,outputSize:c}=bg.calculateShapes(a,s,r.shape),l=[c/p,p];if(c===0)return e.makeTensorInfo(r.shape,s.dtype);let h=[],m=I({inputs:{x:s},backend:e,attrs:{shape:[u,n]}});h.push(m);let f=I({inputs:{x:a},backend:e,attrs:{shape:[u,p]}});h.push(f);let g=I({inputs:{x:r},backend:e,attrs:{shape:l}});h.push(g);let w=He({inputs:{x:g},backend:e,attrs:{reps:Array(l.length).fill(1)}}),b=new ie([u,p],n,m.shape.length,f.shape.length,d,l,r.dtype,!1),v=Ig.sizeFromShape([u,p]),k=[{type:"int32",data:[n]},{type:"int32",data:d},{type:"int32",data:[v]}],R=e.runWebGPUProgram(b,[f,m],g.dtype,k,w);h.push(R);let $=I({inputs:{x:R},backend:e,attrs:{shape:r.shape}});return h.forEach(N=>e.disposeData(N.dataId)),$}var Pn={kernelName:vg,backendName:"webgpu",kernelFunc:kg};import{TopK as Rg,util as Dg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vo=class{constructor(t){this.variableNames=["x","indices"],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms=`inputSize : i32, firstPass : i32, negativeInf : f32,
        dir : i32, inc : i32,`,this.shaderKey="swap"}getUserCode(){return`
        ${x("index")} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // We compare elements pair-wise within a group of size 2 * inc.
            // The comparing rule for each group alternates between ascending
            // and descending. Within each group, we compare each pair at
            // positions i and i+inc. To decide whether an element at position i
            // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
            // inc, it is in the first half of the group, we denote it as x0,
            // otherwise we denote it as x1.
            // For example, as shown in the Bitonic top K paper referenced
            // above, Figure5(a) shows that element[1] is in the second half of
            // the group when group size is 2, but it is in the first half of
            // the group when group size is 4.
            let isFirstInPair = elemIdx % (2 * uniforms.inc) < uniforms.inc;
            var i = 0;
            if (isFirstInPair) {
              i = elemIdx;
            } else {
              i = elemIdx - uniforms.inc;
            }

            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }

            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.inc;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.inc));
            }

            var x0 = f32(0.0);
            var x1 = f32(0.0);
            if (i0 < uniforms.inputSize) {
              x0 = getX(batch, i0);
            } else {
              x0 = uniforms.negativeInf;
            }
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = uniforms.negativeInf;
            }

            let reverse = elemIdx % (2 * uniforms.dir) >= uniforms.dir;
            let isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
            if (reverse == isGreater) {
              // Elements in opposite order of direction
              let iTemp = i0;
              i0 = i1;
              i1 = iTemp;
            }
            if (isFirstInPair) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}},Io=class{constructor(t){this.variableNames=["x","indices"],this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.uniforms="inputSize : i32, firstPass : i32, k : i32,",this.shaderKey="merge"}getUserCode(){return`
        ${x("index")} {
          if (index < uniforms.size) {
            let outC = getCoordsFromIndex(index);
            let batch = outC[0];
            let elemIdx = outC[1];
            // The output size is half of the previous size.
            // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _
            // (k=4), we only need to output the indices at positions |, the
            // indices at positions _ can be thrown away, see Figure5(b) After
            // Phase 2 (Merge phase) in the Bitonic Top K paper referenced
            // above.
            // For example, the paper shows we only need to output the orange
            // bars. The output sequence should look like this | | | | | | | |.
            // Because the sequence is halved, to map the output index back to
            // the previous sequence to find the corresponding value, we need
            // to double the index. When we double the index, we basically
            // interpolate a position, so 2i looks like
            // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k
            // position of each 2k positions by - elemIdx % k. E.g. for output
            // at index 4,5,6,7, we want to get the corresponding element at
            // original index 8,9,10,11, for output at index 8,9,10,11,
            // we want to get the corresponding element at original index
            // 16,17,18,19, so on and so forth.

            var i = 0;
            if (elemIdx < uniforms.k) {
              i = elemIdx;
            } else {
              i = elemIdx * 2 - elemIdx % uniforms.k;
            }
            var i0 = 0;
            if (uniforms.firstPass == 1) {
              i0 = i;
            } else {
              i0 = i32(getIndices(batch, i));
            }
            var i1 = 0;
            if (uniforms.firstPass == 1) {
              i1 = i + uniforms.k;
            } else {
              i1 = i32(getIndices(batch, i + uniforms.k));
            }

            let x0 = getX(batch, i0);
            var x1 = f32(0.0);
            if (i1 < uniforms.inputSize) {
              x1 = getX(batch, i1);
            } else {
              x1 = x0;
            }

            if (x0 >= x1) {
              setOutputAtIndex(index, f32(i0));
            } else {
              setOutputAtIndex(index, f32(i1));
            }
          }
        }
      `}};function Pe(o,t){t!==null&&o.disposeData(t.dataId)}function $n(o){let t=1;for(;t<o;)t*=2;return t}function Pg(o){let{inputs:t,backend:e,attrs:i}=o,{x:r}=t,{k:s,sorted:a}=i,n=r.shape,u=n[n.length-1];if(e.shouldExecuteOnCPU([r])){let R=e.readSync(r.dataId),[$,N]=ai(R,n,r.dtype,s,a);return[e.makeTensorInfo($.shape,$.dtype,$.values),e.makeTensorInfo(N.shape,N.dtype,N.values)]}if(s===0)return n[n.length-1]=0,[e.makeTensorInfo(n,r.dtype,[]),e.makeTensorInfo(n,"int32",[])];if(u===1)return[r,_({attrs:{shape:n,dtype:"int32",value:0},backend:e})];let d=Dg.sizeFromShape(n)/u,c=I({inputs:{x:r},attrs:{shape:[d,u]},backend:e}),l=$n(s),h=$n(u),m=null,f=()=>m===null?[c,c]:[c,m],g=(R,$,N)=>{let L=f(),F=new vo(N),E=[{type:"int32",data:[u]},{type:"int32",data:[m===null?1:0]},{type:"float32",data:[Number.NEGATIVE_INFINITY]},{type:"int32",data:[R]},{type:"int32",data:[$]}],X=m;m=e.runWebGPUProgram(F,L,"int32",E),Pe(e,X)};for(let R=1;R<l;R*=2){let $=R*2;for(let N=R;N>=1;N/=2)g($,N,[d,h])}for(let R=h;R>l;R/=2){let $=f(),N=new Io([d,R/2]),F=[{type:"int32",data:[u]},{type:"int32",data:[m===null?1:0]},{type:"int32",data:[l]}],W=m;m=e.runWebGPUProgram(N,$,"int32",F),Pe(e,W);let E=l/2,X=E*2;for(let H=E;H>=1;H/=2)g(X,H,m.shape)}let w=m;m=oe({inputs:{x:m},backend:e,attrs:{begin:0,size:[d,s]}}),Pe(e,w);let b=Jo({inputs:{x:c,indices:m},backend:e,attrs:{axis:1,batchDims:1}});Pe(e,c);let v=n.slice(0,-1);v.push(s),w=m,m=I({inputs:{x:m},attrs:{shape:v},backend:e}),Pe(e,w);let k=b;return b=I({inputs:{x:b},attrs:{shape:v},backend:e}),Pe(e,k),[b,m]}var Nn={kernelName:Rg,backendName:"webgpu",kernelFunc:Pg};import{Transform as $g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ko=class{constructor(t){this.variableNames=["Image","Transforms"],this.uniforms="interpolationModeId : i32, fillModeId : i32, fillValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.dispatchLayout=y(this.outputShape),this.dispatch=C(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="transform"}getUserCode(){return`
          fn mapCoord(outCoord : f32, len : f32) -> f32{
            var inCoord = outCoord;
            if(uniforms.fillModeId == 2) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  if (inCoord < sz2) {
                    inCoord = sz2 * f32(i32(f32(-inCoord / sz2))) +
                    inCoord;
                  }
                  if (inCoord < -len) {
                    inCoord = inCoord + sz2;
                  } else {
                    inCoord = -inCoord - 1.0;
                  }
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz2 = 2.0 * len;
                  inCoord = inCoord - sz2 * f32(i32(f32(inCoord / sz2)));
                  if (inCoord >= len) {
                    inCoord = sz2 - inCoord - 1.0;
                  }
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 3) {
              if (inCoord < 0.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord + len * (f32(i32(f32(-inCoord / sz))) + 1.0);
                }
              } else if (inCoord > len - 1.0) {
                if (len <= 1.0) {
                  inCoord = 0.0;
                } else {
                  let sz = len - 1.0;
                  inCoord = inCoord - len * f32(i32(f32(inCoord / sz)));
                }
              }
              return clamp(inCoord, 0.0, len - 1.0);
            } else if (uniforms.fillModeId == 4) {
              return clamp(outCoord, 0.0, len - 1.0);
            }
            return outCoord;
          }
          fn readWithFillValue(batch : i32, coordY : i32, coordX : i32,
            channel : i32) -> f32 {
            var outputValue : f32;
            if (0 <= coordY && coordY < uniforms.imageShape[1] && 0 <= coordX && coordX < uniforms.imageShape[2]) {
                outputValue = getImage(batch, coordY, coordX, channel);
            } else {
              outputValue = uniforms.fillValue;
            }
            return outputValue;
          }

          ${x("index")} {
            if (index < uniforms.size) {
              let coords = getCoordsFromIndex(index);
              var outputValue : f32;
              let batch = coords[0];
              let x = coords[2];
              let y = coords[1];
              let channel = coords[3];
              let xf = f32(x);
              let yf = f32(y);
              let a1 = getTransforms(batch, 0);
              let a2 = getTransforms(batch, 1);
              let a3 = getTransforms(batch, 2);
              let b1 = getTransforms(batch, 3);
              let b2 = getTransforms(batch, 4);
              let b3 = getTransforms(batch, 5);
              let c1 = getTransforms(batch, 6);
              let c2 = getTransforms(batch, 7);
              let projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = uniforms.fillValue;
              } else {
                let inX = (a1 * xf + a2 * yf + a3) / projection;
                let inY = (b1 * xf + b2 * yf + b3) / projection;
                let mapX = mapCoord(inX, f32(uniforms.imageShape[2]));
                let mapY = mapCoord(inY, f32(uniforms.imageShape[1]));

                if (uniforms.interpolationModeId == 1) {
                  let coordY = i32(round(mapY));
                  let coordX = i32(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  let yFloor = floor(mapY);
                  let xFloor = floor(mapX);
                  let yCeil = yFloor + 1.0;
                  let xCeil = xFloor + 1.0;
                  let valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yFloor), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yFloor), i32(xCeil), channel);
                  let valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, i32(yCeil), i32(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, i32(yCeil), i32(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutputAtIndex(index, outputValue);
            }
          }
        `}};function Ng(o){let{inputs:t,backend:e,attrs:i}=o,{image:r,transforms:s}=t,{interpolation:a,fillMode:n,fillValue:u,outputShape:p}=i,[d,c,l,h]=r.shape,[m,f]=p??[c,l],g=[d,m,f,h],w=new ko(g),b=a==="nearest"?1:2,v;switch(n){case"constant":v=1;break;case"reflect":v=2;break;case"wrap":v=3;break;case"nearest":v=4;break;default:v=1;break}let k=[{type:"int32",data:[b]},{type:"int32",data:[v]},{type:"float32",data:[u]}];return e.runWebGPUProgram(w,[r,s],"float32",k)}var zn={kernelName:$g,backendName:"webgpu",kernelFunc:Ng};import{Unpack as zg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ag(o){let{inputs:t,backend:e,attrs:i}=o,{value:r}=t,{axis:s}=i;s<0&&(s+=r.shape.length);let a=r,n=a.shape.length,u=r.shape[s],p=new Array(n-1),d=0;for(let f=0;f<n;f++)f!==s&&(p[d++]=a.shape[f]);let c=[],l=new Array(n).fill(0),h=a.shape.slice();h[s]=1;let m=new Array(u);for(let f=0;f<m.length;f++){l[s]=f;let g=oe({inputs:{x:a},backend:e,attrs:{begin:l,size:h}}),w=I({inputs:{x:g},backend:e,attrs:{shape:p}});m[f]=w,c.push(g)}return c.forEach(f=>e.disposeData(f.dataId)),m}var An={kernelName:zg,backendName:"webgpu",kernelFunc:Ag};import{backend_util as Do,UnsortedSegmentSum as Fg,util as Fn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ro=class{constructor(t,e,i){if(this.outputShape=[],this.variableNames=["x","segmentIds"],this.uniforms="numSegments : i32, xSize: i32,",this.workgroupSize=[64,1,1],this.atomic=!0,this.outputShape=e,this.dispatchLayout=y(t),this.dispatch=C(this.dispatchLayout,t,this.workgroupSize),i!=="float32"&&i!=="int32")throw new Error(`UnsortedSegmentSum only supports float32 and int32
              types, does not support ${i} type.`);this.type=i,this.shaderKey="unsortedSegmentSum"}getUserCode(){return`
    ${x("index")} {
      if (index < uniforms.xSize) {
        let coords = getXCoordsFromIndex(index);
        let b = coords[0];
        let inCol = coords[1];

        let segmentId = i32(getSegmentIds(inCol));
        if (segmentId >= 0) {
          let flatIndex = b * uniforms.numSegments + segmentId % uniforms.numSegments;
          let value = getX(b, inCol);

          ${q("&result[flatIndex]","value",this.type)}
        }
      }
    }
  `}};function Lg(o){let{inputs:t,backend:e,attrs:i}=o,{x:r,segmentIds:s}=t,{numSegments:a}=i,n=r.shape.length,u=[],p=0,d=Do.getAxesPermutation([p],n),c=r;d!=null&&(c=K({inputs:{x:r},backend:e,attrs:{perm:d}}),u.push(c),p=Do.getInnerMostAxes(1,n)[0]);let l=Do.segment_util.computeOutShape(c.shape,p,a),h=Fn.sizeFromShape([c.shape[p]]),m=I({inputs:{x:c},backend:e,attrs:{shape:[-1,h]}});u.push(m);let f=r.dtype,g=[m.shape[0],a],w=_({backend:e,attrs:{shape:g,value:0,dtype:f}}),b=new Ro(m.shape,g,f),v=[{type:"int32",data:[a]},{type:"int32",data:[Fn.sizeFromShape(m.shape)]}],k=e.runWebGPUProgram(b,[m,s],f,v,w),R=I({inputs:{x:k},backend:e,attrs:{shape:l}});u.push(k);let $=R;if(d!=null){u.push(R);let N=Do.getUndoAxesPermutation(d);$=K({inputs:{x:$},backend:e,attrs:{perm:N}})}return u.forEach(N=>e.disposeData(N.dataId)),$}var Ln={kernelName:Fg,backendName:"webgpu",kernelFunc:Lg};var _g=[br,ui,pi,di,li,ci,mi,fi,gi,xi,Ci,yi,Si,wi,bi,ki,Ri,Di,Pi,$i,Ai,Li,_i,Oi,Vi,Hi,kr,Ki,Yi,Qi,Ji,ts,os,rs,is,ss,as,ns,ds,ls,cs,hs,gs,xs,fs,Cs,ys,Ss,ws,bs,ks,Rs,Ds,Ps,$s,Ns,zs,As,Fs,yr,Ls,Es,Ts,_s,Us,Ms,Vs,Gs,qs,Ys,js,Ir,Qs,Xi,Zs,Js,ea,ta,oa,ra,ia,aa,sa,na,ua,pa,la,ca,vi,ha,ma,xa,fa,ga,Sa,Ii,wa,ba,va,Ia,Ra,vs,Da,Pa,$a,Bi,Na,Fa,Ta,Ba,Ea,Ua,Wa,Ma,Ei,Oa,Va,Ha,Ga,Sr,Ka,Xa,qa,Ya,ja,Qa,Za,Ja,en,tn,on,rn,sn,an,nn,un,zi,wn,vn,In,ka,pn,ln,hn,mn,gn,xn,Cn,yn,Sn,kn,Is,Rn,Dn,Pn,fn,Nn,zn,hi,An,Ln,za];for(let o of _g)Tg(o);export{Se as WebGPUBackend,$o as webgpu_util};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgpu/dist/flags_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/adapter_info.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/buffer_manager.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/texture_manager.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/shader_util.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/webgpu_program.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/webgpu_util.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/backend_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/webgpu.js:
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

@tensorflow/tfjs-backend-webgpu/dist/base.js:
  (**
   * @license
   * Copyright 2022 Google Inc. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/binary_op_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/unary_op_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/activation_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/matmul_packed_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/matmul_reduce_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/matmul_small_output_size_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/matmul_splitK_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/fill_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Fill.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Reshape.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/BatchMatMul_impl.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/_FusedMatMul.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/binary_op_complex_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/binary_op_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Identity.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Complex.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/unary_op_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernel_utils/kernel_funcs_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernel_utils/shared.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Abs.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Acos.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Acosh.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Add.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/addn_packed_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/AddN.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/transpose_shared_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/transpose_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Transpose.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/reduce_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernel_utils/reduce.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/All.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Any.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/argminmax_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ArgMax.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ArgMin.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Asin.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Asinh.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Atan.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Atan2.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Atanh.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/pool_filtersizeone_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/pool_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Max.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Mean.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Pool_impl.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/AvgPool.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/AvgPool3D.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/avg_pool_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/AvgPool3DGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/AvgPoolGrad.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/BatchMatMul.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/slice_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Slice.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/BatchToSpaceND.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/bincount_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Bincount.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/broadcast_args_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/BroadcastArgs.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/NotEqual.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Real.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernel_utils/int.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cast.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Ceil.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/clip_vec4_webgpu.js:
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

@tensorflow/tfjs-backend-webgpu/dist/clip_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ClipByValue.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/complex_abs_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ComplexAbs.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/concat_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Imag.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Concat_impl.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Concat.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/conv2d_mm_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/conv2d_naive_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/im2col_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv2D_impl.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv2D.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/conv_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv2DBackpropFilter.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/conv_backprop_mm_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv2DBackpropInput.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/conv3d_naive_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv3D.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv3DBackpropFilterV2.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Conv3DBackpropInputV2.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cos.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cosh.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/crop_and_resize_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/CropAndResize.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/cum_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cum_impl.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cumprod.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Cumsum.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/DenseBincount.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/depth_to_space_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/DepthToSpace.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/depthwise_conv2d_nchw_shared_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/depthwise_conv2d_vec4_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/depthwise_conv2d_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/DepthwiseConv2dNative.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/conv_backprop_depthwise_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/DepthwiseConv2dNativeBackpropFilter.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/DepthwiseConv2dNativeBackpropInput.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/diag_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Diag.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/dilation_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Dilation2D.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/dilation_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Dilation2DBackpropFilter.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Dilation2DBackpropInput.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/draw_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Draw.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use backend file except in compliance with the License.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Multiply.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Einsum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Elu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/EluGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Equal.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Erf.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Exp.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ExpandDims.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-webgpu/dist/kernels/Expm1.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/fft_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FFT_impl.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FFT.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/flip_left_right_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FlipLeftRight.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Floor.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FloorDiv.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/from_pixels_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FromPixels.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use backend file except in compliance with the License.
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

@tensorflow/tfjs-backend-webgpu/dist/batchnorm_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FusedBatchNorm.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FusedConv2D.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/FusedDepthwiseConv2D.js:
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

@tensorflow/tfjs-backend-webgpu/dist/gather_nd_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/GatherNd.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/gather_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/GatherV2.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Greater.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/GreaterEqual.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/IFFT.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/IsFinite.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/IsInf.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/IsNaN.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LeakyRelu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Less.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LessEqual.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/lin_space_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LinSpace.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Log.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Log1p.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LogicalAnd.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LogicalNot.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LogicalOr.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/lrn_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LRN.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/lrn_grad_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/LRNGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Maximum.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MaxPool.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MaxPool3D.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/max_pool_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MaxPool3DGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MaxPoolGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MaxPoolWithArgmax.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Min.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Minimum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/mirror_pad_webgpu.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/MirrorPad.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Mod.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/multinomial_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/softmax_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Softmax.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Multinomial.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Neg.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/NonMaxSuppressionV3.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/NonMaxSuppressionV5.js:
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

@tensorflow/tfjs-backend-webgpu/dist/onehot_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/OneHot.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ZerosLike.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/OnesLike.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Pack.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/pad_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/PadV2.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Pow.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Prelu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Prod.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Range.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/RealDiv.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Reciprocal.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Relu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Relu6.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/resize_bilinear_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ResizeBilinear.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/resize_bilinear_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ResizeBilinearGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/resize_nearest_neighbor_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ResizeNearestNeighbor.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/resize_nearest_neighbor_backprop_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ResizeNearestNeighborGrad.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/reverse_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Reverse.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/rotate_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/RotateWithOffset.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Round.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Rsqrt.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/scatter_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/ScatterNd.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/search_sorted_webgpu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SearchSorted.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/select_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Select.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Selu.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sigmoid.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sign.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sin.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sinh.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Softplus.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/space_to_batchND_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SpaceToBatchND.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/sparse_segment_reduce_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernel_utils/sparse_segment_reduce.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SparseSegmentMean.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SparseSegmentSum.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/tile_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Tile.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SparseToDense.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SplitV.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sqrt.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Square.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/SquaredDifference.js:
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Step.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/strided_slice_webgpu.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/StridedSlice.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/StringNGrams.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Sub.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Tan.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Tanh.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/TensorScatterUpdate.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/top_k_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/TopK.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/transform_webgpu.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Transform.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/Unpack.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgpu/dist/unsorted_segment_sum_webgpu.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/kernels/UnsortedSegmentSum.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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

@tensorflow/tfjs-backend-webgpu/dist/register_all_kernels.js:
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

@tensorflow/tfjs-backend-webgpu/dist/index.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=tfjs-backend-webgpu.mjs.map