/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0) denonext production */
var op=Object.defineProperty;var ds=(o,e)=>{for(var t in e)op(o,t,{get:e[t],enumerable:!0})};import{device_util as Id,registerBackend as Nd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{device_util as $s,env as xp}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ke={};ds(Ke,{assertNotComplex:()=>ce,bindCanvasToFramebuffer:()=>dp,bindColorTextureToFramebuffer:()=>ht,bindTextureToProgramUniformSampler:()=>on,bindTextureUnit:()=>Cs,bindVertexBufferToProgramAttribute:()=>Mt,callAndCheck:()=>y,canBeRepresented:()=>zr,createFragmentShader:()=>Xr,createFramebuffer:()=>Jr,createProgram:()=>Kr,createStaticIndexBuffer:()=>Yr,createStaticVertexBuffer:()=>jr,createTexture:()=>Qr,createVertexShader:()=>Hr,getBatchDim:()=>Ce,getExtensionOrThrow:()=>ze,getFramebufferErrorMessage:()=>bs,getMaxTexturesInShader:()=>sn,getNumChannels:()=>up,getProgramUniformLocation:()=>tn,getProgramUniformLocationOrThrow:()=>en,getRowsCols:()=>be,getShapeAs3D:()=>Xe,getTextureShapeFromLogicalShape:()=>rn,getWebGLDisjointQueryTimerVersion:()=>an,getWebGLErrorMessage:()=>gs,getWebGLMaxTextureSize:()=>nn,hasExtension:()=>ee,isCapableOfRenderingToFloatTexture:()=>cn,isDownloadFloatTextureEnabled:()=>ln,isReshapeFree:()=>Te,isWebGLFenceEnabled:()=>un,isWebGLVersionEnabled:()=>zt,linkProgram:()=>qr,logShaderSourceAndInfoLog:()=>Wt,resetMaxTextureSize:()=>mp,resetMaxTexturesInShader:()=>fp,unbindColorTextureFromFramebuffer:()=>Gt,unbindTextureUnit:()=>pp,validateFramebuffer:()=>He,validateProgram:()=>ft,validateTextureSize:()=>Zr});import{env as xe,util as fe}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as ms}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var _e={},Lt={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function Wr(o,e){_e[o]=e}function J(o,e){if(!(o in _e)||e!=null){let r=np(o,e);if(r!==null)_e[o]=r;else return console.log("Could not get context for WebGL version",o),null}let t=_e[o];return t==null||t.isContextLost()?(delete _e[o],J(o)):(t.disable(t.DEPTH_TEST),t.disable(t.STENCIL_TEST),t.disable(t.BLEND),t.disable(t.DITHER),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SAMPLE_COVERAGE),t.enable(t.SCISSOR_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),_e[o])}function rp(o){if(!ms().getBool("IS_SAFARI")&&typeof OffscreenCanvas<"u"&&o===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function np(o,e){if(o!==1&&o!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");let t=e??rp(o);return t.addEventListener("webglcontextlost",r=>{r.preventDefault(),delete _e[o]},!1),ms().getBool("SOFTWARE_WEBGL_ENABLED")&&(Lt.failIfMajorPerformanceCaveat=!1),o===1?t.getContext("webgl",Lt)||t.getContext("experimental-webgl",Lt):t.getContext("webgl2",Lt)}import{env as sp,util as fs}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Re;(function(o){o[o.DENSE=0]="DENSE",o[o.SHARED_BATCH=1]="SHARED_BATCH"})(Re||(Re={}));var H;(function(o){o[o.RENDER=0]="RENDER",o[o.UPLOAD=1]="UPLOAD",o[o.PIXELS=2]="PIXELS",o[o.DOWNLOAD=3]="DOWNLOAD"})(H||(H={}));var G;(function(o){o[o.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",o[o.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",o[o.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",o[o.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",o[o.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(G||(G={}));function Ae(o,e){return[e,o]}function hs(o,e){return o*e}function dt(o){let e=fs.sizeFromShape(o),t=Math.ceil(e/4);return fs.sizeToSquarishShape(t)}function me(o,e){return[Math.max(1,Math.ceil(e/2)),Math.max(1,Math.ceil(o/2))]}function xs(o,e){let[t,r]=me(o,e);return t*r*4}function mt(o,e){let t=o,r,n,s,i,c,a,l,u,p,d;return sp().getNumber("WEBGL_VERSION")===2?(r=t.R32F,n=t.R16F,s=t.RGBA16F,i=t.RGBA32F,c=t.RED,l=4,u=1,p=t.HALF_FLOAT,d=t.FLOAT,a=t.RGBA8):(r=o.RGBA,n=o.RGBA,s=o.RGBA,i=t.RGBA,c=o.RGBA,l=4,u=4,p=e!=null?e.HALF_FLOAT_OES:null,d=o.FLOAT,a=o.RGBA),{internalFormatFloat:r,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:s,internalFormatPackedFloat:i,textureFormatFloat:c,downloadTextureFormat:a,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:p,textureTypeFloat:d}}function y(o,e){let t=e();return xe().getBool("DEBUG")&&ip(o),t}function ip(o){let e=o.getError();if(e!==o.NO_ERROR)throw new Error("WebGL Error: "+gs(o,e))}var ap=596e-10,cp=65504;function zr(o){return!!(xe().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||o===0||ap<Math.abs(o)&&Math.abs(o)<cp)}function gs(o,e){switch(e){case o.NO_ERROR:return"NO_ERROR";case o.INVALID_ENUM:return"INVALID_ENUM";case o.INVALID_VALUE:return"INVALID_VALUE";case o.INVALID_OPERATION:return"INVALID_OPERATION";case o.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case o.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case o.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${e}`}}function ze(o,e){return ge(o,()=>o.getExtension(e),'Extension "'+e+'" not supported on this browser.')}function Hr(o,e){let t=ge(o,()=>o.createShader(o.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(y(o,()=>o.shaderSource(t,e)),y(o,()=>o.compileShader(t)),o.getShaderParameter(t,o.COMPILE_STATUS)===!1)throw console.log(o.getShaderInfoLog(t)),new Error("Failed to compile vertex shader.");return t}function Xr(o,e){let t=ge(o,()=>o.createShader(o.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(y(o,()=>o.shaderSource(t,e)),y(o,()=>o.compileShader(t)),xe().get("ENGINE_COMPILE_ONLY"))return t;if(o.getShaderParameter(t,o.COMPILE_STATUS)===!1)throw Wt(e,o.getShaderInfoLog(t)),new Error("Failed to compile fragment shader.");return t}var lp=/ERROR: [0-9]+:([0-9]+):/g;function Wt(o,e){let t=lp.exec(e);if(t==null){console.log(`Couldn't parse line number in error: ${e}`),console.log(o);return}let r=+t[1],n=o.split(`
`),s=n.length.toString().length+2,i=n.map((p,d)=>fe.rightPad((d+1).toString(),s)+p),c=0;for(let p=0;p<i.length;p++)c=Math.max(i[p].length,c);let a=i.slice(0,r-1),l=i.slice(r-1,r),u=i.slice(r);console.log(a.join(`
`)),console.log(e.split(`
`)[0]),console.log(`%c ${fe.rightPad(l[0],c)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(u.join(`
`))}function Kr(o){return ge(o,()=>o.createProgram(),"Unable to create WebGLProgram.")}function qr(o,e){if(y(o,()=>o.linkProgram(e)),!xe().get("ENGINE_COMPILE_ONLY")&&o.getProgramParameter(e,o.LINK_STATUS)===!1)throw console.log(o.getProgramInfoLog(e)),new Error("Failed to link vertex and fragment shaders.")}function ft(o,e){if(y(o,()=>o.validateProgram(e)),o.getProgramParameter(e,o.VALIDATE_STATUS)===!1)throw console.log(o.getProgramInfoLog(e)),new Error("Shader program validation failed.")}function jr(o,e){let t=ge(o,()=>o.createBuffer(),"Unable to create WebGLBuffer");return y(o,()=>o.bindBuffer(o.ARRAY_BUFFER,t)),y(o,()=>o.bufferData(o.ARRAY_BUFFER,e,o.STATIC_DRAW)),t}function Yr(o,e){let t=ge(o,()=>o.createBuffer(),"Unable to create WebGLBuffer");return y(o,()=>o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,t)),y(o,()=>o.bufferData(o.ELEMENT_ARRAY_BUFFER,e,o.STATIC_DRAW)),t}function up(){return xe().getNumber("WEBGL_VERSION")===2?1:4}function Qr(o){return ge(o,()=>o.createTexture(),"Unable to create WebGLTexture.")}function Zr(o,e){let t=xe().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(o<=0||e<=0){let r=`[${o}x${e}]`;throw new Error("Requested texture size "+r+" is invalid.")}if(o>t||e>t){let r=`[${o}x${e}]`,n=`[${t}x${t}]`;throw new Error("Requested texture size "+r+" greater than WebGL maximum on this browser / GPU "+n+".")}}function Jr(o){return ge(o,()=>o.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function Mt(o,e,t,r,n,s,i){let c=o.getAttribLocation(e,t);return c===-1?!1:(y(o,()=>o.bindBuffer(o.ARRAY_BUFFER,r)),y(o,()=>o.vertexAttribPointer(c,n,o.FLOAT,!1,s,i)),y(o,()=>o.enableVertexAttribArray(c)),!0)}function Cs(o,e,t){vs(o,t),y(o,()=>o.activeTexture(o.TEXTURE0+t)),y(o,()=>o.bindTexture(o.TEXTURE_2D,e))}function pp(o,e){vs(o,e),y(o,()=>o.activeTexture(o.TEXTURE0+e)),y(o,()=>o.bindTexture(o.TEXTURE_2D,null))}function en(o,e,t){return ge(o,()=>o.getUniformLocation(e,t),'uniform "'+t+'" not present in program.')}function tn(o,e,t){return o.getUniformLocation(e,t)}function on(o,e,t,r){y(o,()=>Cs(o,e,r)),y(o,()=>o.uniform1i(t,r))}function dp(o){y(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,null)),y(o,()=>o.viewport(0,0,o.canvas.width,o.canvas.height)),y(o,()=>o.scissor(0,0,o.canvas.width,o.canvas.height))}function ht(o,e,t){y(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,t)),y(o,()=>o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,e,0))}function Gt(o,e){y(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,e)),y(o,()=>o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,null,0))}function He(o){let e=o.checkFramebufferStatus(o.FRAMEBUFFER);if(e!==o.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+bs(o,e))}function bs(o,e){switch(e){case o.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case o.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case o.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case o.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${e}`}}function ge(o,e,t){let r=y(o,()=>e());if(r==null)throw new Error(t);return r}function vs(o,e){let t=o.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,r=e+o.TEXTURE0;if(r<o.TEXTURE0||r>t){let n=`[gl.TEXTURE0, gl.TEXTURE${t}]`;throw new Error(`textureUnit must be in ${n}.`)}}function Ce(o,e=2){return fe.sizeFromShape(o.slice(0,o.length-e))}function be(o){if(o.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[o.length>1?o[o.length-2]:1,o[o.length-1]]}function Xe(o){let e=[1,1,1];return o.length===0||o.length===1&&o[0]===1||(e=[Ce(o),...be(o)]),e}function rn(o,e=!1){let t=xe().getNumber("WEBGL_MAX_TEXTURE_SIZE"),r=xe().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");r===1/0&&xe().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(r=t/2),e&&(t=t*2,r=r*2,o=o.map((c,a)=>a>=o.length-2?fe.nearestLargerEven(o[a]):o[a]),o.length===1&&(o=[2,o[0]])),o.length!==2&&(o=fe.squeezeShape(o).newShape);let n=fe.sizeFromShape(o),s=null;o.length<=1&&n<=t?s=[1,n]:o.length===2&&o[0]<=t&&o[1]<=t?s=o:o.length===3&&o[0]*o[1]<=t&&o[2]<=t?s=[o[0]*o[1],o[2]]:o.length===3&&o[0]<=t&&o[1]*o[2]<=t?s=[o[0],o[1]*o[2]]:o.length===4&&o[0]*o[1]*o[2]<=t&&o[3]<=t?s=[o[0]*o[1]*o[2],o[3]]:o.length===4&&o[0]<=t&&o[1]*o[2]*o[3]<=t&&(s=[o[0],o[1]*o[2]*o[3]]);let i=s!=null&&Math.max(...s)>r&&Math.min(...s)<=(e?2:1)&&Math.min(...s)>0;if(s==null||i)if(e){let c=Ce(o),a=2,l=2;o.length&&([a,l]=be(o)),n=c*(a/2)*(l/2),s=fe.sizeToSquarishShape(n).map(u=>u*2)}else s=fe.sizeToSquarishShape(n);return s}function Bt(o){return o%2===0}function Te(o,e){if(o=o.slice(-2),e=e.slice(-2),fe.arraysEqual(o,e)||!o.length||!e.length||o[0]===0||o[1]===0||e[0]===0||e[1]===0)return!0;if(o.length!==e.length){let t=o[o.length-1],r=e[e.length-1];if(t===r||Bt(t)&&Bt(r)&&(o[0]===1||e[0]===1))return!0}return o[1]===e[1]&&Bt(o[0])&&Bt(e[0])}var Ut,Vt;function nn(o){if(Ut==null){let e=J(o);Ut=e.getParameter(e.MAX_TEXTURE_SIZE)}return Ut}function mp(){Ut=null}function fp(){Vt=null}function sn(o){if(Vt==null){let e=J(o);Vt=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,Vt)}function an(o){if(o===0)return 0;let e,t=J(o);return ee(t,"EXT_disjoint_timer_query_webgl2")&&o===2?e=2:ee(t,"EXT_disjoint_timer_query")?e=1:e=0,e}function ee(o,e){return o.getExtension(e)!=null}function zt(o){try{if(J(o)!=null)return!0}catch(e){return console.log("Error when getting WebGL context: ",e),!1}return!1}function cn(o){if(o===0)return!1;let e=J(o);if(o===1){if(!ee(e,"OES_texture_float"))return!1}else if(!ee(e,"EXT_color_buffer_float"))return!1;return Gr(e)}function ln(o){if(o===0)return!1;let e=J(o);if(o===1){if(!ee(e,"OES_texture_float")||!ee(e,"WEBGL_color_buffer_float"))return!1}else{if(ee(e,"EXT_color_buffer_float"))return Gr(e);let r="EXT_color_buffer_half_float";if(ee(e,r)){let n=e.getExtension(r);return hp(e,n)}return!1}return Gr(e)}function Gr(o){let e=mt(o),t=o.createTexture();o.bindTexture(o.TEXTURE_2D,t);let r=1,n=1;o.texImage2D(o.TEXTURE_2D,0,e.internalFormatFloat,r,n,0,e.textureFormatFloat,e.textureTypeFloat,null);let s=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,s),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,t,0);let i=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindTexture(o.TEXTURE_2D,null),o.bindFramebuffer(o.FRAMEBUFFER,null),o.deleteTexture(t),o.deleteFramebuffer(s),i}function hp(o,e){let t=mt(o,e),r=o.createTexture();o.bindTexture(o.TEXTURE_2D,r);let n=1,s=1;o.texImage2D(o.TEXTURE_2D,0,t.internalFormatHalfFloat,n,s,0,t.textureFormatFloat,t.textureTypeHalfFloat,null);let i=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,r,0);let c=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindTexture(o.TEXTURE_2D,null),o.bindFramebuffer(o.FRAMEBUFFER,null),o.deleteTexture(r),o.deleteFramebuffer(i),c}function un(o){return o!==2?!1:J(o).fenceSync!=null}function ce(o,e){Array.isArray(o)||(o=[o]),o.forEach(t=>{t!=null&&fe.assert(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the WebGL backend.`)})}var w=xp();w.registerFlag("HAS_WEBGL",()=>w.getNumber("WEBGL_VERSION")>0);w.registerFlag("WEBGL_VERSION",()=>zt(2)?2:zt(1)?1:0);w.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1);w.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>w.get("WEBGL_VERSION")===2);w.registerFlag("WEBGL_CPU_FORWARD",()=>!0);w.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1);w.registerFlag("WEBGL_PACK",()=>w.getBool("HAS_WEBGL"));w.registerFlag("WEBGL_PACK_NORMALIZATION",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_CLIP",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_REDUCE",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_LAZILY_UNPACK",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_CONV_IM2COL",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>w.getBool("WEBGL_PACK"));w.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>nn(w.getNumber("WEBGL_VERSION")));w.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>sn(w.getNumber("WEBGL_VERSION")));w.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{let o=w.getNumber("WEBGL_VERSION");return o===0?0:an(o)});w.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>w.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!$s.isMobile());w.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>cn(w.getNumber("WEBGL_VERSION")));w.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>w.getBool("WEBGL_FORCE_F16_TEXTURES")?!1:w.getBool("WEBGL_RENDER_FLOAT32_CAPABLE"));w.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>ln(w.getNumber("WEBGL_VERSION")));w.registerFlag("WEBGL_FENCE_API_ENABLED",()=>un(w.getNumber("WEBGL_VERSION")));w.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>w.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0);w.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,o=>{if(typeof o!="number")throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${o}.`);if(o<0&&o!==-1)throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${o}.`)});w.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>$s.isMobile()?1:-1,o=>{if(typeof o!="number")throw new Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${o}.`);if(o<0&&o!==-1)throw new Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${o}.`)});w.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128);w.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1);w.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5);w.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128);w.registerFlag("WEBGL_EXP_CONV",()=>!1);w.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>w.getBool("IS_TEST"));w.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0);w.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1);w.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1);w.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);import{backend_util as An,buffer as Vi,DataStorage as pd,engine as Ie,env as F,kernel_impls as dd,KernelBackend as md,nextFrame as fd,scalar as hd,tidy as xd,util as M}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as Ss}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function O(){let o,e,t,r,n,s,i,c,a,l;return Ss().getNumber("WEBGL_VERSION")===2?(o="#version 300 es",e="in",t="out",r="in",n="texture",s="outputColor",i="out vec4 outputColor;",c=Ss().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",a="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(o="",e="attribute",t="varying",r="varying",n="texture2D",s="gl_FragColor",i="",c=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,a=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:o,attribute:e,varyingVs:t,varyingFs:r,texture2D:n,output:s,defineOutput:i,defineSpecialNaN:c,defineSpecialInf:a,defineRound:l}}import{backend_util as td,env as xt,util as we}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Cp,util as q}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as pn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function le(o,e,t="index"){let r=pn.computeStrides(e);return r.map((n,s)=>{let i=`int ${o[s]} = ${t} / ${n}`,c=s===r.length-1?`int ${o[s+1]} = ${t} - ${o[s]} * ${n}`:`index -= ${o[s]} * ${n}`;return`${i}; ${c};`}).join("")}function Fe(o,e,t="index"){let r=pn.computeStrides(e);return r.map((n,s)=>{let i=`int ${o[s]} = ${t} / outShapeStrides[${s}]`,c=s===r.length-1?`int ${o[s+1]} = ${t} - ${o[s]} * outShapeStrides[${s}]`:`index -= ${o[s]} * outShapeStrides[${s}]`;return`${i}; ${c};`}).join("")}function gp(o,e){let t=o.length,r=o.map(s=>`${e}[${s}]`),n=new Array(t-1);n[t-2]=r[t-1];for(let s=t-3;s>=0;--s)n[s]=`(${n[s+1]} * ${r[s+1]})`;return n}function ys(o,e,t="index"){let r=o.map((s,i)=>i),n=gp(r,e);return n.map((s,i)=>{let c=`int ${o[i]} = ${t} / ${n[i]}`,a=i===n.length-1?`int ${o[i+1]} = ${t} - ${o[i]} * ${n[i]}`:`index -= ${o[i]} * ${n[i]}`;return`${c}; ${a};`}).join("")}function qe(o){let e=pn.computeStrides(o).map(t=>t.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${e[0]} + coords.y * ${e[1]} + coords.z;
  }
`}function je(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}var Ht=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;var{getBroadcastDims:Rs}=Cp;function Ts(o,e,t){let r=[];if(o.forEach(m=>{let f=q.sizeFromShape(m.shapeInfo.logicalShape);if(m.shapeInfo.isUniform?r.push(`uniform float ${m.name}${f>1?`[${f}]`:""};`):(r.push(`uniform sampler2D ${m.name};`),r.push(`uniform int offset${m.name};`)),t.enableShapeUniforms){let{uniformShape:x}=Xt(t.packedInputs,m.shapeInfo.logicalShape,m.shapeInfo.texShape);switch(x.length){case 1:r.push(`uniform int ${m.name}Shape;`);break;case 2:r.push(`uniform ivec2 ${m.name}Shape;`);break;case 3:r.push(`uniform ivec3 ${m.name}Shape;`);break;case 4:r.push(`uniform ivec4 ${m.name}Shape;`);break;default:break}r.push(`uniform ivec2 ${m.name}TexShape;`)}}),t.enableShapeUniforms){switch(e.logicalShape.length){case 1:r.push("uniform int outShape;");break;case 2:r.push("uniform ivec2 outShape;"),r.push("uniform int outShapeStrides;");break;case 3:r.push("uniform ivec3 outShape;"),r.push("uniform ivec2 outShapeStrides;");break;case 4:r.push("uniform ivec4 outShape;"),r.push("uniform ivec3 outShapeStrides;");break;default:break}r.push("uniform ivec2 outTexShape;")}t.customUniforms&&t.customUniforms.forEach(m=>{r.push(`uniform ${m.type} ${m.name}${m.arrayIndex?`[${m.arrayIndex}]`:""};`)});let n=r.join(`
`),s=o.map(m=>bp(m,e,t.packedInputs,t.enableShapeUniforms)).join(`
`),i=e.texShape,c=O(),a=Sp(c),l,u,p=Tp(c);return e.isPacked?(l=vp(e.logicalShape,i,t.enableShapeUniforms),u=Rp(c)):(l=$p(e.logicalShape,i,t.enableShapeUniforms),u=yp(c)),t.packedInputs&&(p+=Ep),[p,a,u,n,l,s,t.userCode].join(`
`)}function Qe(o,e=!1){let t=o.shapeInfo.logicalShape;switch(t.length){case 0:return Wp(o,e);case 1:return Gp(o,e);case 2:return Hp(o,e);case 3:return Kp(o,e);case 4:return jp(o,e);case 5:return Yp(o);case 6:return Qp(o);default:throw new Error(`${t.length}-D input sampling is not yet supported`)}}function ws(o,e){switch(o.shapeInfo.logicalShape.length){case 0:return Vp(o);case 1:return Mp(o,e);case 2:return zp(o,e);case 3:return Xp(o,e);default:return qp(o,e)}}function bp(o,e,t=!1,r){let n="";t?n+=ws(o,r):n+=Qe(o,r);let s=o.shapeInfo.logicalShape,i=e.logicalShape;return s.length<=i.length&&(t?n+=Zp(o,e):n+=Jp(o,e)),n}function vp(o,e,t){switch(o.length){case 0:return Is();case 1:return kp(o,e,t);case 2:return Bp(o,e,t);case 3:return Ap(o,e,t);default:return Dp(o,e,t)}}function $p(o,e,t){switch(o.length){case 0:return Is();case 1:return _p(o,e,t);case 2:return Up(o,e,t);case 3:return Fp(o,e,t);case 4:return Pp(o,e,t);case 5:return Op(o,e);case 6:return Lp(o,e);default:throw new Error(`${o.length}-D output sampling is not yet supported`)}}function Sp(o){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${o.texture2D}(textureSampler, uv).r;
    }
  `}function yp(o){return`
    void setOutput(float val) {
      ${o.output} = vec4(val, 0, 0, 0);
    }
  `}function Rp(o){return`
    void setOutput(vec4 val) {
      ${o.output} = val;
    }
  `}function Tp(o){return`${o.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${o.varyingFs} vec2 resultUV;
    ${o.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${o.defineSpecialNaN}
    ${o.defineSpecialInf}
    ${o.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${wp}
    ${Ip}
    ${Np}
  `}var wp=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Ip=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Np=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Ep=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function Is(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function kp(o,e,t){let r=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];return r[0]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${r[1]}.0);
      }
    `:r[1]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${r[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      return 2 * (resTexRC.x * ${r[1]} + resTexRC.y);
    }
  `}function _p(o,e,t){return e[0]===1?t?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${e[1]}.0);
      }
    `:e[1]===1?t?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${e[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      return resTexRC.x * ${e[1]} + resTexRC.y;
    }
  `}function Ap(o,e,t){if(t)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;let r=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],n=Math.ceil(o[2]/2),s=n*Math.ceil(o[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      int index = resTexRC.x * ${r[1]} + resTexRC.y;

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec3(b, r, c);
    }
  `}function Fp(o,e,t){if(t)return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${Fe(["r","c","d"],o)}
    return ivec3(r, c, d);
  }
`;let r=le(["r","c","d"],o);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${r}
      return ivec3(r, c, d);
    }
  `}function Dp(o,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;let r=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],n=Math.ceil(o[o.length-1]/2),s=n*Math.ceil(o[o.length-2]/2),i=s,c="",a="b, r, c";for(let l=2;l<o.length-1;l++)i*=o[o.length-l-1],c=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+c,a=`b${l}, `+a;return`
    ivec${o.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      int index = resTexRC.x * ${r[1]} + resTexRC.y;

      ${c}

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec${o.length}(${a});
    }
  `}function Pp(o,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${Fe(["r","c","d","d2"],o)}
      return ivec4(r, c, d, d2);
    }
  `;let r=le(["r","c","d","d2"],o);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${r}
      return ivec4(r, c, d, d2);
    }
  `}function Op(o,e){let t=le(["r","c","d","d2","d3"],o);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${e[0]},
                             ${e[1]}));

      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function Lp(o,e){let t=le(["r","c","d","d2","d3","d4"],o);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function Bp(o,e,t){let r=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];if(q.arraysEqual(o,e))return t?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${r[0]}, ${r[1]}));
      }
    `;let n=Math.ceil(o[1]/2);return t?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));

      int index = resTexRC.x * ${r[1]} + resTexRC.y;
      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec2(r, c);
    }
  `}function Up(o,e,t){return q.arraysEqual(o,e)?t?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${e[0]}, ${e[1]}));
      }
    `:o[1]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:o[0]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:t?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      int r = index / ${o[1]};
      int c = index - r * ${o[1]};
      return ivec2(r, c);
    }
  `}function De(o){return`offset${o}`}function Vp(o){let e=o.name,t="get"+e.charAt(0).toUpperCase()+e.slice(1),r=O();return`
    vec4 ${t}() {
      return ${r.texture2D}(${e}, halfCR);
    }
  `}function Wp(o,e){let t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1);if(o.shapeInfo.isUniform)return`float ${r}() {return ${t};}`;let[n,s]=o.shapeInfo.texShape;if(n===1&&s===1)return`
      float ${r}() {
        return sampleTexture(${t}, halfCR);
      }
    `;let i=De(t);if(e)return`
    float ${r}() {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], ${i});
      return sampleTexture(${t}, uv);
    }
  `;let[c,a]=o.shapeInfo.texShape;return`
    float ${r}() {
      vec2 uv = uvFromFlat(${c}, ${a}, ${i});
      return sampleTexture(${t}, uv);
    }
  `}function Mp(o,e){let t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1),n=o.shapeInfo.texShape,s=O();if(e)return`
    vec4 ${r}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${s.texture2D}(${t}, uv);
    }
  `;let i=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];return`
    vec4 ${r}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${s.texture2D}(${t}, uv);
    }
  `}function Gp(o,e){let t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1);if(o.shapeInfo.isUniform)return`
      float ${r}(int index) {
        ${Ze(o)}
      }
    `;let n=o.shapeInfo.texShape,s=n[0],i=n[1];if(i===1&&s===1)return`
      float ${r}(int index) {
        return sampleTexture(${t}, halfCR);
      }
    `;let c=De(t);return i===1?e?`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${c}) + 0.5) / float(${t}TexShape[0]));
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${c}) + 0.5) / ${s}.0);
        return sampleTexture(${t}, uv);
      }
    `:s===1?e?`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${c}) + 0.5) / float(${t}TexShape[1]), 0.5);
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${c}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${t}, uv);
      }
    `:e?`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index + ${c});
      return sampleTexture(${t}, uv);
    }
  `:`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${s}, ${i}, index + ${c});
      return sampleTexture(${t}, uv);
    }
  `}function zp(o,e){let t=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape,i=s[0],c=s[1],a=O();if(s!=null&&q.arraysEqual(t,s))return e?`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);

        return ${a.texture2D}(${r}, uv);
      }
    `:`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${c}.0, ${i}.0);

        return ${a.texture2D}(${r}, uv);
      }
    `;if(e)return`
    vec4 ${n}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${a.texture2D}(${r}, uv);
    }
  `;let l=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],u=Math.ceil(t[1]/2);return`
    vec4 ${n}(int row, int col) {
      vec2 uv = packedUVfrom2D(${u}, ${l[0]}, ${l[1]}, row, col);
      return ${a.texture2D}(${r}, uv);
    }
  `}function Hp(o,e){let t=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape;if(s!=null&&q.arraysEqual(t,s)){if(e)return`
      float ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `;let d=s[0],m=s[1];return`
    float ${n}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${m}.0, ${d}.0);
      return sampleTexture(${r}, uv);
    }
  `}let{newShape:i,keptDims:c}=q.squeezeShape(t),a=i;if(a.length<t.length){let d=Je(o,a),m=["row","col"];return`
      ${Qe(d,e)}
      float ${n}(int row, int col) {
        return ${n}(${et(m,c)});
      }
    `}if(o.shapeInfo.isUniform)return`
      float ${n}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${t[1]}, 1)));
        ${Ze(o)}
      }
    `;let l=s[0],u=s[1],p=De(r);return u===1?e?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${r}TexShape[0]));
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${r}, uv);
    }
  `:l===1?e?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${r}TexShape[1]), 0.5);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${u}.0, 0.5);
      return sampleTexture(${r}, uv);
    }
  `:e?`
      float ${n}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${r}Shape[1] + col + ${p};
        vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
        return sampleTexture(${r}, uv);
      }
    `:`
  float ${n}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${t[1]} + col + ${p};
    vec2 uv = uvFromFlat(${l}, ${u}, index);
    return sampleTexture(${r}, uv);
  }
`}function Xp(o,e){let t=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape,i=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)];if(t[0]===1){let d=t.slice(1),m=[1,2],f=Je(o,d),x=["b","row","col"];return`
        ${ws(f,e)}
        vec4 ${n}(int b, int row, int col) {
          return ${n}(${et(x,m)});
        }
      `}let c=O();if(e)return`
    vec4 ${n}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${c.texture2D}(${r}, uv);
    }
  `;let a=i[0],l=i[1],u=Math.ceil(t[2]/2),p=u*Math.ceil(t[1]/2);return`
    vec4 ${n}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${a}, ${l}, ${p}, ${u}, b, row, col);
      return ${c.texture2D}(${r}, uv);
    }
  `}function Kp(o,e){let t=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=t[1]*t[2],i=t[2],{newShape:c,keptDims:a}=q.squeezeShape(t),l=c;if(l.length<t.length){let x=Je(o,l),g=["row","col","depth"];return`
        ${Qe(x,e)}
        float ${n}(int row, int col, int depth) {
          return ${n}(${et(g,a)});
        }
      `}if(o.shapeInfo.isUniform)return`
      float ${n}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${s}, ${i}, 1)));
        ${Ze(o)}
      }
    `;let u=o.shapeInfo.texShape,p=u[0],d=u[1],m=o.shapeInfo.flatOffset;if(d===s&&m==null)return e?`
      float ${n}(int row, int col, int depth) {
        int stride1 = ${r}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
        float ${n}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${d}.0, ${p}.0);
          return sampleTexture(${r}, uv);
        }
      `;if(d===i&&m==null)return e?`
      float ${n}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${r}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${t[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}.0, ${p}.0);
      return sampleTexture(${r}, uv);
    }
  `;let f=De(r);return e?`
    float ${n}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${r}Shape[1] * ${r}Shape[2];
      int stride1 = ${r}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${f};
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
      return sampleTexture(${r}, uv);
    }
    `:`
      float ${n}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${s} + col * ${i} + depth + ${f};
        vec2 uv = uvFromFlat(${p}, ${d}, index);
        return sampleTexture(${r}, uv);
      }
  `}function qp(o,e){let t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1),n=O();if(e)return`
    vec4 ${r}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${t}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${t}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${t}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${n.texture2D}(${t}, uv);
    }
  `;let s=o.shapeInfo.logicalShape,i=s.length,c=o.shapeInfo.texShape,a=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)],l=a[0],u=a[1],p=Math.ceil(s[i-1]/2),d=p*Math.ceil(s[i-2]/2),m="int b, int row, int col",f=`b * ${d} + (row / 2) * ${p} + (col / 2)`;for(let x=2;x<i-1;x++)m=`int b${x}, `+m,d*=s[i-x-1],f=`b${x} * ${d} + `+f;return`
    vec4 ${r}(${m}) {
      int index = ${f};
      int texR = index / ${u};
      int texC = index - texR * ${u};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${u}, ${l});
      return ${n.texture2D}(${t}, uv);
    }
  `}function jp(o,e){let t=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=t[3],i=t[2]*s,c=t[1]*i,{newShape:a,keptDims:l}=q.squeezeShape(t);if(a.length<t.length){let C=Je(o,a),v=["row","col","depth","depth2"];return`
      ${Qe(C,e)}
      float ${n}(int row, int col, int depth, int depth2) {
        return ${n}(${et(v,l)});
      }
    `}if(o.shapeInfo.isUniform)return`
      float ${n}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${c}, ${i}, ${s}, 1)));
        ${Ze(o)}
      }
    `;let u=o.shapeInfo.flatOffset,p=o.shapeInfo.texShape,d=p[0],m=p[1],f=`int stride2 = ${r}Shape[3];`,x=`int stride1 = ${r}Shape[2] * stride2;`,g=`int stride0 = ${r}Shape[1] * stride1;`;if(m===c&&u==null)return e?`
      float ${n}(int row, int col, int depth, int depth2) {
        ${f}
        ${x}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${s}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${m}.0, ${d}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(m===s&&u==null)return e?`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${r}Shape[1] * ${r}Shape[2], ${r}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${t[1]*t[2]}, ${t[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${m}.0, ${d}.0);
        return sampleTexture(${r}, uv);
      }
    `;let h=De(r);return e?`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${f}
      ${x}
      ${g}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index + ${h});
      return sampleTexture(${r}, uv);
    }
  `:`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${i} +
          depth * ${s} + depth2;
      vec2 uv = uvFromFlat(${d}, ${m}, index + ${h});
      return sampleTexture(${r}, uv);
    }
  `}function Yp(o){let e=o.shapeInfo.logicalShape,t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1),n=e[4],s=e[3]*n,i=e[2]*s,c=e[1]*i,{newShape:a,keptDims:l}=q.squeezeShape(e);if(a.length<e.length){let x=Je(o,a),g=["row","col","depth","depth2","depth3"];return`
      ${Qe(x)}
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        return ${r}(${et(g,l)});
      }
    `}if(o.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${c}, ${i}, ${s}, ${n})) +
          depth3;
        ${Ze(o)}
      }
    `;let u=o.shapeInfo.flatOffset,p=o.shapeInfo.texShape,d=p[0],m=p[1];if(m===c&&u==null)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${s}, ${n}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${m}.0, ${d}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(m===n&&u==null)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]},
               ${e[2]*e[3]}, ${e[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${m}.0, ${d}.0);
        return sampleTexture(${t}, uv);
      }
    `;let f=De(t);return`
    float ${r}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${i} + depth * ${s} +
          depth2 * ${n} + depth3 + ${f};
      vec2 uv = uvFromFlat(${d}, ${m}, index);
      return sampleTexture(${t}, uv);
    }
  `}function Qp(o){let e=o.shapeInfo.logicalShape,t=o.name,r="get"+t.charAt(0).toUpperCase()+t.slice(1),{newShape:n,keptDims:s}=q.squeezeShape(e);if(n.length<e.length){let g=Je(o,n),h=["row","col","depth","depth2","depth3","depth4"];return`
      ${Qe(g)}
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${r}(${et(h,s)});
      }
    `}let i=e[5],c=e[4]*i,a=e[3]*c,l=e[2]*a,u=e[1]*l;if(o.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${u}, ${l}, ${a}, ${c})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${Ze(o)}
      }
    `;let p=o.shapeInfo.flatOffset,d=o.shapeInfo.texShape,m=d[0],f=d[1];if(f===u&&p==null)return`
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${a}, ${c}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${m}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(f===i&&p==null)return`
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]*e[4]},
               ${e[2]*e[3]*e[4]},
               ${e[3]*e[4]},
               ${e[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${m}.0);
        return sampleTexture(${t}, uv);
      }
    `;let x=De(t);return`
    float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${l} + depth * ${a} +
          depth2 * ${c} + depth3 * ${i} + depth4 + ${x};
      vec2 uv = uvFromFlat(${m}, ${f}, index);
      return sampleTexture(${t}, uv);
    }
  `}function Ze(o){let e=o.name,t=q.sizeFromShape(o.shapeInfo.logicalShape);return t<2?`return ${e};`:`
    for (int i = 0; i < ${t}; i++) {
      if (i == index) {
        return ${e}[i];
      }
    }
  `}function Zp(o,e){let t=o.name,r=t.charAt(0).toUpperCase()+t.slice(1),n="get"+r+"AtOutCoords",s=o.shapeInfo.logicalShape.length,i=e.logicalShape.length,c=Rs(o.shapeInfo.logicalShape,e.logicalShape),a=N(i),l=i-s,u,p=["x","y","z","w","u","v"];s===0?u="":i<2&&c.length>=1?u="coords = 0;":u=c.map(C=>`coords.${p[C+l]} = 0;`).join(`
`);let d="";i<2&&s>0?d="coords":d=o.shapeInfo.logicalShape.map((C,v)=>`coords.${p[v+l]}`).join(", ");let m="return outputValue;",x=q.sizeFromShape(o.shapeInfo.logicalShape)===1,h=q.sizeFromShape(e.logicalShape)===1;if(s===1&&!x&&!h)m=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(x&&!h)i===1?m=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:m=`
        return vec4(outputValue.x);
      `;else if(c.length){let C=s-2,v=s-1;c.indexOf(C)>-1&&c.indexOf(v)>-1?m="return vec4(outputValue.x);":c.indexOf(C)>-1?m="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":c.indexOf(v)>-1&&(m="return vec4(outputValue.xx, outputValue.zz);")}return`
    vec4 ${n}() {
      ${a} coords = getOutputCoords();
      ${u}
      vec4 outputValue = get${r}(${d});
      ${m}
    }
  `}function Jp(o,e){let t=o.name,r=t.charAt(0).toUpperCase()+t.slice(1),n="get"+r+"AtOutCoords",s=e.texShape,i=o.shapeInfo.texShape,c=o.shapeInfo.logicalShape.length,a=e.logicalShape.length;if(!o.shapeInfo.isUniform&&c===a&&o.shapeInfo.flatOffset==null&&q.arraysEqual(i,s))return`
      float ${n}() {
        return sampleTexture(${t}, resultUV);
      }
    `;let l=N(a),u=Rs(o.shapeInfo.logicalShape,e.logicalShape),p=a-c,d,m=["x","y","z","w","u","v"];c===0?d="":a<2&&u.length>=1?d="coords = 0;":d=u.map(x=>`coords.${m[x+p]} = 0;`).join(`
`);let f="";return a<2&&c>0?f="coords":f=o.shapeInfo.logicalShape.map((x,g)=>`coords.${m[g+p]}`).join(", "),`
    float ${n}() {
      ${l} coords = getOutputCoords();
      ${d}
      return get${r}(${f});
    }
  `}function N(o){if(o<=1)return"int";if(o===2)return"ivec2";if(o===3)return"ivec3";if(o===4)return"ivec4";if(o===5)return"ivec5";if(o===6)return"ivec6";throw Error(`GPU for rank ${o} is not yet supported`)}function Xt(o,e,t){let{newShape:r,keptDims:n}=q.squeezeShape(e),s=e.length,i=o&&s===3&&e[0]===1,c=i?e.slice(1):r,a=!o&&s>1&&!q.arraysEqual(e,t)&&r.length<s||i;return{useSqueezeShape:a,uniformShape:a?c:e,keptDims:n}}function Je(o,e){let t=JSON.parse(JSON.stringify(o));return t.shapeInfo.logicalShape=e,t}function et(o,e){return e.map(t=>o[t]).join(", ")}function Es(o,e,t,r){let n=t.map((u,p)=>{let d={logicalShape:u.shape,texShape:u.isUniform?null:u.texData.texShape,isUniform:u.isUniform,isPacked:u.isUniform?!1:u.texData.isPacked,flatOffset:null};return u.texData!=null&&u.texData.slice!=null&&u.texData.slice.flatOffset>0&&(d.flatOffset=u.texData.slice.flatOffset),{name:e.variableNames[p],shapeInfo:d}}),s=n.map(u=>u.shapeInfo),i={logicalShape:r.shape,texShape:r.texData.texShape,isUniform:!1,isPacked:r.texData.isPacked,flatOffset:null},c=Ts(n,i,e),a=Xr(o.gl,c),l=o.createProgram(a);return xt().get("ENGINE_COMPILE_ONLY")?{program:e,fragmentShader:a,source:c,webGLProgram:l,inShapeInfos:s,outShapeInfo:i,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(o.buildVao(l),Object.assign({program:e,fragmentShader:a,source:c,webGLProgram:l,inShapeInfos:s,outShapeInfo:i},dn(o,e,l)))}function dn(o,e,t){let r=[],n=[],s,i,c,a=null,l=null;l=o.getUniformLocation(t,"NAN",!1),xt().getNumber("WEBGL_VERSION")===1&&(a=o.getUniformLocation(t,"INFINITY",!1));let u=!1;for(let p of e.variableNames){let d={name:p,uniform:o.getUniformLocation(t,p,u),offset:o.getUniformLocation(t,`offset${p}`,u)};e.enableShapeUniforms&&(d.shape=o.getUniformLocation(t,`${p}Shape`,u),d.texShape=o.getUniformLocation(t,`${p}TexShape`,u)),r.push(d)}if(e.enableShapeUniforms&&(s=o.getUniformLocation(t,"outShape",u),c=o.getUniformLocation(t,"outShapeStrides",u),i=o.getUniformLocation(t,"outTexShape",u)),e.customUniforms)for(let p of e.customUniforms)n.push(o.getUniformLocation(t,p.name,u));return{variablesLocations:r,customUniformLocations:n,infLoc:a,nanLoc:l,outShapeLocation:s,outShapeStridesLocation:c,outTexShapeLocation:i}}function Ns(o,e){if(o.length!==e.length)throw Error(`Binary was compiled with ${o.length} inputs, but was executed with ${e.length} inputs`);o.forEach((t,r)=>{let n=t.logicalShape,s=e[r],i=s.shape;if(!we.arraysEqual(n,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${n} and ${i} must match`);if(t.isUniform&&s.isUniform)return;let c=t.texShape,a=s.isUniform?null:s.texData.texShape;if(!we.arraysEqual(c,a))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${c} and ${a} must match`)})}function ks(o,e,t,r,n){e.program.enableShapeUniforms||(Ns(e.inShapeInfos,t),Ns([e.outShapeInfo],[r]));let s=r.texData.texture,i=r.texData.texShape;r.texData.isPacked?o.setOutputPackedMatrixTexture(s.texture,i[0],i[1]):o.setOutputMatrixTexture(s.texture,i[0],i[1]),o.setProgram(e.webGLProgram),o.bindVertexArray(e.webGLProgram.vao),xt().getNumber("WEBGL_VERSION")===1&&e.infLoc!==null&&o.gl.uniform1f(e.infLoc,1/0),e.nanLoc!==null&&o.gl.uniform1f(e.nanLoc,NaN);for(let a=0;a<t.length;++a){let l=t[a],{uniform:u,offset:p,shape:d,texShape:m}=e.variablesLocations[a];if(d){let{uniformShape:f}=Xt(e.program.packedInputs,l.shape,l.texData.texShape);switch(f.length){case 1:o.gl.uniform1iv(d,new Int32Array(f));break;case 2:o.gl.uniform2iv(d,new Int32Array(f));break;case 3:o.gl.uniform3iv(d,new Int32Array(f));break;case 4:o.gl.uniform4iv(d,new Int32Array(f));break;default:break}}if(m&&o.gl.uniform2i(m,l.texData.texShape[0],l.texData.texShape[1]),u!=null){if(l.isUniform){if(we.sizeFromShape(l.shape)<2)o.gl.uniform1f(u,l.uniformValues[0]);else{let f=l.uniformValues;f instanceof Float32Array||(f=new Float32Array(f)),o.gl.uniform1fv(u,f)}continue}l.texData.slice!=null&&p!=null&&o.gl.uniform1i(p,l.texData.slice.flatOffset),o.setInputMatrixTexture(l.texData.texture.texture,u,a)}}let c=e.outShapeLocation;if(c)switch(r.shape.length){case 1:o.gl.uniform1iv(c,new Int32Array(r.shape));break;case 2:o.gl.uniform2iv(c,new Int32Array(r.shape));break;case 3:o.gl.uniform3iv(c,new Int32Array(r.shape));break;case 4:o.gl.uniform4iv(c,new Int32Array(r.shape));break;default:break}if(e.outShapeStridesLocation){let a=we.computeStrides(r.shape);switch(r.shape.length){case 2:o.gl.uniform1iv(e.outShapeStridesLocation,new Int32Array(a));break;case 3:o.gl.uniform2iv(e.outShapeStridesLocation,new Int32Array(a));break;case 4:o.gl.uniform3iv(e.outShapeStridesLocation,new Int32Array(a));break;default:break}}if(e.outTexShapeLocation&&o.gl.uniform2i(e.outTexShapeLocation,r.texData.texShape[0],r.texData.texShape[1]),e.program.customUniforms&&n)for(let a=0;a<e.program.customUniforms.length;++a){let l=e.program.customUniforms[a],u=e.customUniformLocations[a],p=n[a];if(l.type==="float")o.gl.uniform1fv(u,p);else if(l.type==="vec2")o.gl.uniform2fv(u,p);else if(l.type==="vec3")o.gl.uniform3fv(u,p);else if(l.type==="vec4")o.gl.uniform4fv(u,p);else if(l.type==="int")o.gl.uniform1iv(u,p);else if(l.type==="ivec2")o.gl.uniform2iv(u,p);else if(l.type==="ivec3")o.gl.uniform3iv(u,p);else if(l.type==="ivec4")o.gl.uniform4iv(u,p);else throw Error(`uniform type ${l.type} is not supported yet.`)}o.executeProgram()}function _s(o,e,t){let r="";e.concat(t).forEach(i=>{let c=i.texData!=null&&i.texData.slice!=null&&i.texData.slice.flatOffset>0;if(o.enableShapeUniforms&&!i.isUniform){let a=i.texData.texShape,{useSqueezeShape:l,uniformShape:u,keptDims:p}=Xt(o.packedInputs,i.shape,a),d="",m="",f="";if(u.length===1&&o.packedInputs){let S=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)];d=`${S[0]>1}_${S[1]>1}`}else if(u.length===2&&!o.packedInputs)m=`${u[0]>1}_${u[1]>1}`;else if(u.length>2&&!o.packedInputs){let S=we.computeStrides(u);f=`${S[0]===a[1]}_${S[S.length-1]===a[1]}`}let x=i.shape.length,g=u.length===2&&we.arraysEqual(i.shape,a),h=we.sizeFromShape(i.shape)===1,C=td.getBroadcastDims(i.shape,t.shape),v=!o.packedInputs&&x===t.shape.length&&we.arraysEqual(a,t.texData.texShape),b=o.packedInputs||u.length>2?"":`${a[0]>1}_${a[1]>1}`;r+=`${x}_${v}_${l?p:""}_${u.length}_${h}_${C}_${g}_${d}_${m}_${f}_${b}_${c}`}else{let a=i.isUniform?"uniform":i.texData.texShape;r+=`${i.shape}_${a}_${c}`}});let n=o.userCode,s=o.constructor.name;return s+="_"+r+"_"+n+`${xt().getNumber("WEBGL_VERSION")}`,s}function D(o){return xt().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&o<=4}var Kt=class{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=Re.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let t=O();this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Fe(["r","c","d"],e):le(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${t.output} = result;
      }
    `}};var qt=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=Re.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let t=O();this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Fe(["r","c","d"],e):le(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${t.output} = result;
      }
    `}};var jt=class{constructor(e){this.variableNames=["A"],this.outTexUsage=H.DOWNLOAD;let t=O();this.outputShape=e,this.userCode=`
      ${Ht}

      void main() {
        float x = getAAtOutCoords();
        ${t.output} = encode_float(x);
      }
    `}};var Yt=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=H.DOWNLOAD;let t=O();this.outputShape=e,this.userCode=`
      ${Ht}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${t.output} = encode_float(x);
      }
    `}};var rd={R:0,G:1,B:2,A:3},gt=class{constructor(e,t=!1,r="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];let n=O();this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length);let s="result";t&&(s="floor(result * 255. + 0.5)");let i="";for(let c=0;c<r.length;c++){let a=r[c];i+=`
          if(offset == ${c}) {
            result = values[${rd[a]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?je():qe(e)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${r.length});

        flatIndex = idiv(flatIndex, ${r.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${n.texture2D}(A, uv);
          ${i}
        }
        ${n.output} = vec4(${s}, 0., 0., 0.);
      }
    `}};var Qt=class{constructor(e,t=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];let r=O();this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length);let n="",s="result";t&&(s="floor(result * 255. + 0.5)");for(let i=0;i<=1;i++)for(let c=0;c<=1;c++){let a=i*2+c;n+=`
          localCoords = coords;
          if(localCoords[2] + ${c} < ${this.enableShapeUniforms?"outShape[2]":`${e[2]}`}) {
          localCoords[2] += ${c};
          if (localCoords[1] + ${i} < ${this.enableShapeUniforms?"outShape[1]":`${e[1]}`}) {
            localCoords[1] += ${i};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${r.texture2D}(A, uv);

            if (offset == 0) {
              result[${a}] = values[0];
            } else if (offset == 1) {
              result[${a}] = values[1];
            } else if (offset == 2) {
              result[${a}] = values[2];
            } else {
              result[${a}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?je():qe(e)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${n}

          ${r.output} = ${s};
        }
    `}};import{env as X,util as As}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var En={};ds(En,{bindVertexProgramAttributeStreams:()=>$n,createBufferFromOutputTexture:()=>Rn,createFloat16MatrixTexture:()=>gn,createFloat16PackedMatrixTexture:()=>vn,createFloat32MatrixTexture:()=>xn,createIndexBuffer:()=>hn,createPackedMatrixTexture:()=>bn,createUnsignedBytesMatrixTexture:()=>Cn,createVertexBuffer:()=>fn,createVertexShader:()=>mn,downloadByteEncodedFloatMatrixFromOutputTexture:()=>wn,downloadFloat32MatrixFromBuffer:()=>Tn,downloadMatrixFromPackedOutputTexture:()=>Nn,downloadPackedMatrixFromBuffer:()=>In,getInternalFormatForFloat16MatrixTexture:()=>eo,getInternalFormatForFloat16PackedMatrixTexture:()=>ro,getInternalFormatForFloat32MatrixTexture:()=>Jt,getInternalFormatForPackedMatrixTexture:()=>oo,getInternalFormatForUnsignedBytesMatrixTexture:()=>to,uploadDenseMatrixToTexture:()=>Sn,uploadPixelDataToTexture:()=>yn});import{env as Zt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function mn(o){let e=O(),t=`${e.version}
    precision highp float;
    ${e.attribute} vec3 clipSpacePos;
    ${e.attribute} vec2 uv;
    ${e.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;return Hr(o,t)}function fn(o){let e=new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]);return jr(o,e)}function hn(o){let e=new Uint16Array([0,1,2,2,1,3]);return Yr(o,e)}function Ct(o,e,t,r,n,s){Zr(e,t);let i=Qr(o),c=o.TEXTURE_2D;return y(o,()=>o.bindTexture(c,i)),y(o,()=>o.texParameteri(c,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE)),y(o,()=>o.texParameteri(c,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE)),y(o,()=>o.texParameteri(c,o.TEXTURE_MIN_FILTER,o.NEAREST)),y(o,()=>o.texParameteri(c,o.TEXTURE_MAG_FILTER,o.NEAREST)),Zt().getNumber("WEBGL_VERSION")===1?y(o,()=>o.texImage2D(c,0,r,e,t,0,n,s,null)):y(o,()=>o.texStorage2D(c,1,r,e,t)),y(o,()=>o.bindTexture(o.TEXTURE_2D,null)),{texture:i,texShape:[t,e]}}function Jt(o){return o.internalFormatFloat}function xn(o,e,t,r){let[n,s]=Ae(e,t);return Ct(o,n,s,Jt(r),r.textureFormatFloat,o.FLOAT)}function eo(o){return o.internalFormatHalfFloat}function gn(o,e,t,r){let[n,s]=Ae(e,t);return Ct(o,n,s,eo(r),r.textureFormatFloat,r.textureTypeHalfFloat)}function to(o){return o.downloadTextureFormat}function Cn(o,e,t,r){let[n,s]=Ae(e,t);return Ct(o,n,s,to(r),o.RGBA,o.UNSIGNED_BYTE)}function oo(o){return o.internalFormatPackedFloat}function bn(o,e,t,r){let[n,s]=me(e,t);return Ct(o,n,s,oo(r),o.RGBA,o.FLOAT)}function ro(o){return o.internalFormatPackedHalfFloat}function vn(o,e,t,r){let[n,s]=me(e,t);return Ct(o,n,s,ro(r),o.RGBA,r.textureTypeHalfFloat)}function $n(o,e,t){return y(o,()=>o.bindBuffer(o.ARRAY_BUFFER,t)),Mt(o,e,"clipSpacePos",t,3,20,0)&&Mt(o,e,"uv",t,2,20,12)}function Sn(o,e,t,r,n,s){y(o,()=>o.bindTexture(o.TEXTURE_2D,e));let i,c,a;n instanceof Uint8Array?(i=new Uint8Array(t*r*4),c=o.UNSIGNED_BYTE,a=o.RGBA):(i=new Float32Array(t*r*4),c=o.FLOAT,a=s.internalFormatPackedFloat),i.set(n),Zt().getNumber("WEBGL_VERSION")===2?y(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,t,r,o.RGBA,c,i)):y(o,()=>o.texImage2D(o.TEXTURE_2D,0,a,t,r,0,o.RGBA,c,i)),y(o,()=>o.bindTexture(o.TEXTURE_2D,null))}function yn(o,e,t){y(o,()=>o.bindTexture(o.TEXTURE_2D,e)),t.data instanceof Uint8Array?Zt().getNumber("WEBGL_VERSION")===2?y(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,t.width,t.height,o.RGBA,o.UNSIGNED_BYTE,t.data)):y(o,()=>o.texImage2D(o.TEXTURE_2D,0,o.RGBA,t.width,t.height,0,o.RGBA,o.UNSIGNED_BYTE,t.data)):Zt().getNumber("WEBGL_VERSION")===2?y(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,o.RGBA,o.UNSIGNED_BYTE,t)):y(o,()=>o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,t)),y(o,()=>o.bindTexture(o.TEXTURE_2D,null))}function Rn(o,e,t,r){let n=o.createBuffer();y(o,()=>o.bindBuffer(o.PIXEL_PACK_BUFFER,n));let c=4*4*e*t;return y(o,()=>o.bufferData(o.PIXEL_PACK_BUFFER,c,o.STREAM_READ)),y(o,()=>o.readPixels(0,0,t,e,o.RGBA,o.FLOAT,0)),y(o,()=>o.bindBuffer(o.PIXEL_PACK_BUFFER,null)),n}function Tn(o,e,t){let r=o,n=new Float32Array(t);return r.bindBuffer(r.PIXEL_PACK_BUFFER,e),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,n),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),n}function wn(o,e,t,r){let[n,s]=Ae(e,t),i=4,c=new Uint8Array(hs(e*t,i));return y(o,()=>o.readPixels(0,0,n,s,r.downloadTextureFormat,o.UNSIGNED_BYTE,c)),new Float32Array(c.buffer)}function In(o,e,t,r,n,s,i,c){let a=o,l=new Float32Array(xs(s,i));return a.bindBuffer(a.PIXEL_PACK_BUFFER,e),a.getBufferSubData(a.PIXEL_PACK_BUFFER,0,l),a.bindBuffer(a.PIXEL_PACK_BUFFER,null),l}function Nn(o,e,t){let r=new Float32Array(e*t*4);return y(o,()=>o.readPixels(0,0,t,e,o.RGBA,o.FLOAT,r)),r}var Pe=class{constructor(e){this.outputTexture=null,this.program=null,this.disposed=!1,this.itemsToPoll=[];let t=X().getNumber("WEBGL_VERSION");if(e!=null?(this.gl=e,Wr(t,e)):this.gl=J(t),e=this.gl,X().getNumber("WEBGL_VERSION")===2){let s=e;this.createVertexArray=()=>y(s,()=>s.createVertexArray()),this.bindVertexArray=i=>y(s,()=>s.bindVertexArray(i)),this.deleteVertexArray=i=>y(s,()=>s.deleteVertexArray(i)),this.getVertexArray=()=>y(s,()=>s.getParameter(s.VERTEX_ARRAY_BINDING))}else if(e!=null){let s=e.getExtension("OES_vertex_array_object");if(s==null)throw new Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>y(e,()=>s.createVertexArrayOES()),this.bindVertexArray=i=>y(e,()=>s.bindVertexArrayOES(i)),this.deleteVertexArray=i=>y(e,()=>s.deleteVertexArrayOES(i)),this.getVertexArray=()=>y(e,()=>e.getParameter(s.VERTEX_ARRAY_BINDING_OES))}let r="WEBGL_color_buffer_float",n="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),X().getNumber("WEBGL_VERSION")===1){let s="OES_texture_float",i="OES_texture_half_float";if(this.textureFloatExtension=ze(this.gl,s),ee(this.gl,i))this.textureHalfFloatExtension=ze(this.gl,i);else if(X().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(r),ee(this.gl,n))this.colorBufferHalfFloatExtension=ze(this.gl,n);else if(X().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(r="EXT_color_buffer_float",ee(this.gl,r))this.colorBufferFloatExtension=this.gl.getExtension(r);else if(ee(this.gl,n))this.colorBufferHalfFloatExtension=this.gl.getExtension(n);else throw new Error("GL context does not support color renderable floats");this.vertexBuffer=fn(this.gl),this.indexBuffer=hn(this.gl),this.framebuffer=Jr(this.gl),this.textureConfig=mt(this.gl,this.textureHalfFloatExtension)}get debug(){return X().getBool("DEBUG")}dispose(){if(this.disposed)return;this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");let e=this.gl;y(e,()=>e.finish()),y(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),y(e,()=>e.deleteFramebuffer(this.framebuffer)),y(e,()=>e.bindBuffer(e.ARRAY_BUFFER,null)),y(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),y(e,()=>e.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(e,t){return this.throwIfDisposed(),xn(this.gl,e,t,this.textureConfig)}createFloat16MatrixTexture(e,t){return this.throwIfDisposed(),gn(this.gl,e,t,this.textureConfig)}createUnsignedBytesMatrixTexture(e,t){return this.throwIfDisposed(),Cn(this.gl,e,t,this.textureConfig)}uploadPixelDataToTexture(e,t){this.throwIfDisposed(),yn(this.gl,e,t)}uploadDenseMatrixToTexture(e,t,r,n){this.throwIfDisposed(),Sn(this.gl,e,t,r,n,this.textureConfig)}createFloat16PackedMatrixTexture(e,t){return this.throwIfDisposed(),vn(this.gl,e,t,this.textureConfig)}createPackedMatrixTexture(e,t){return this.throwIfDisposed(),bn(this.gl,e,t,this.textureConfig)}deleteMatrixTexture(e){this.throwIfDisposed(),this.outputTexture===e&&(Gt(this.gl,this.framebuffer),this.outputTexture=null),y(this.gl,()=>this.gl.deleteTexture(e))}downloadByteEncodedFloatMatrixFromOutputTexture(e,t,r){return this.downloadMatrixDriver(e,()=>wn(this.gl,t,r,this.textureConfig))}downloadPackedMatrixFromBuffer(e,t,r,n,s,i){return In(this.gl,e,t,r,n,s,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(e,t){return Tn(this.gl,e,t)}createBufferFromTexture(e,t,r){this.bindTextureToFrameBuffer(e);let n=Rn(this.gl,t,r,this.textureConfig);return this.unbindTextureToFrameBuffer(),n}createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,r;if(X().getBool("WEBGL_FENCE_API_ENABLED")){let n=e,s=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),r=()=>{let i=n.clientWaitSync(s,0,0);return i===n.ALREADY_SIGNALED||i===n.CONDITION_SATISFIED},t=s}else X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(t=this.beginQuery(),this.endQuery(),r=()=>this.isQueryAvailable(t,X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):r=()=>!0;return{query:t,isFencePassed:r}}downloadMatrixFromPackedTexture(e,t,r){return this.downloadMatrixDriver(e,()=>Nn(this.gl,t,r))}createProgram(e){this.throwIfDisposed();let t=this.gl;this.vertexShader==null&&(this.vertexShader=mn(t));let r=Kr(t);y(t,()=>t.attachShader(r,this.vertexShader)),y(t,()=>t.attachShader(r,e)),qr(t,r);let n=Object.assign(r,{vao:this.createVertexArray()});return this.debug&&ft(t,n),n}buildVao(e){this.setProgram(e),this.bindVertexArray(e.vao);let t=this.gl;y(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),$n(t,e,this.vertexBuffer)}deleteProgram(e){this.throwIfDisposed(),e===this.program&&(this.program=null),e!=null&&(y(this.gl,()=>this.gl.deleteProgram(e)),this.deleteVertexArray(e.vao))}setProgram(e){this.throwIfDisposed(),this.program=e,this.program!=null&&this.debug&&ft(this.gl,this.program),y(this.gl,()=>this.gl.useProgram(e))}getUniformLocation(e,t,r=!0){return this.throwIfDisposed(),r?en(this.gl,e,t):tn(this.gl,e,t)}getAttributeLocation(e,t){return this.throwIfDisposed(),y(this.gl,()=>this.gl.getAttribLocation(e,t))}getUniformLocationNoThrow(e,t){return this.throwIfDisposed(),this.gl.getUniformLocation(e,t)}setInputMatrixTexture(e,t,r){this.throwIfDisposed(),this.throwIfNoProgram(),on(this.gl,e,t,r)}setOutputMatrixTexture(e,t,r){this.setOutputMatrixTextureDriver(e,r,t)}setOutputPackedMatrixTexture(e,t,r){this.throwIfDisposed();let[n,s]=me(t,r);this.setOutputMatrixTextureDriver(e,n,s)}setOutputMatrixWriteRegion(e,t,r,n){this.setOutputMatrixWriteRegionDriver(r,e,n,t)}setOutputPackedMatrixWriteRegion(e,t,r,n){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){this.program!=null&&ft(this.gl,this.program),He(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();let e=this.gl;if(this.debug){let t=this.getVertexArray();console.assert(t===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate()}y(e,()=>e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),y(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=ze(this.gl,X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let r=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=r.createQuery();return r.beginQuery(n.TIME_ELAPSED_EXT,s),s}let e=this.getQueryTimerExtensionWebGL1(),t=e.createQueryEXT();return e.beginQueryEXT(e.TIME_ELAPSED_EXT,t),t}endQuery(){if(X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let t=this.gl,r=this.getQueryTimerExtensionWebGL2();t.endQuery(r.TIME_ELAPSED_EXT);return}let e=this.getQueryTimerExtensionWebGL1();e.endQueryEXT(e.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(e){return await As.repeatedTry(()=>this.disposed||this.isQueryAvailable(e,X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(e,X().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(e,t){if(t===0)return null;if(t===2){let r=this.gl;return r.getQueryParameter(e,r.QUERY_RESULT)/1e6}else{let r=this.getQueryTimerExtensionWebGL1();return r.getQueryObjectEXT(e,r.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(e,t){if(t===0)return!0;if(t===2){let r=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=r.getQueryParameter(e,r.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(n.GPU_DISJOINT_EXT)),s&&!this.disjoint}else{let r=this.getQueryTimerExtensionWebGL1(),n=r.getQueryObjectEXT(e,r.QUERY_RESULT_AVAILABLE_EXT);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(r.GPU_DISJOINT_EXT)),n&&!this.disjoint}}pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=nd(this.itemsToPoll.map(t=>t.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:r}=this.itemsToPoll[t];r()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}addItemToPoll(e,t){if(this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1)return;let r;"setTimeoutCustom"in X().platform&&(r=X().platform.setTimeoutCustom.bind(X().platform)),As.repeatedTry(()=>(this.pollItems(),this.itemsToPoll.length===0),()=>0,null,r)}bindTextureToFrameBuffer(e){this.throwIfDisposed(),ht(this.gl,e,this.framebuffer),this.debug&&He(this.gl)}unbindTextureToFrameBuffer(){this.outputTexture!=null?(ht(this.gl,this.outputTexture,this.framebuffer),this.debug&&He(this.gl)):Gt(this.gl,this.framebuffer)}downloadMatrixDriver(e,t){this.bindTextureToFrameBuffer(e);let r=t();return this.unbindTextureToFrameBuffer(),r}setOutputMatrixTextureDriver(e,t,r){this.throwIfDisposed();let n=this.gl;ht(n,e,this.framebuffer),this.debug&&He(n),this.outputTexture=e,y(n,()=>n.viewport(0,0,t,r)),y(n,()=>n.scissor(0,0,t,r))}setOutputMatrixWriteRegionDriver(e,t,r,n){this.throwIfDisposed(),y(this.gl,()=>this.gl.scissor(e,t,r,n))}throwIfDisposed(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(this.program==null)throw new Error("No GPU program is currently set.")}};function nd(o){let e=0;for(;e<o.length&&o[e]();++e);return e-1}import*as sd from"/v135/@tensorflow/tfjs-backend-cpu@4.15.0/denonext/dist/shared.js";var{addImpl:Fs,bincountImpl:no,bincountReduceImpl:Ds,bitwiseAndImpl:Ps,castImpl:Os,ceilImpl:Ls,concatImpl:Bs,equalImpl:Us,expImpl:Vs,expm1Impl:Ws,floorImpl:Ms,gatherNdImpl:Gs,gatherV2Impl:zs,greaterImpl:Hs,greaterEqualImpl:Xs,lessImpl:Ks,lessEqualImpl:qs,linSpaceImpl:js,logImpl:Ys,maxImpl:Qs,maximumImpl:Zs,minimumImpl:Js,multiplyImpl:ei,negImpl:ti,notEqualImpl:oi,prodImpl:ri,raggedGatherImpl:ni,raggedRangeImpl:si,raggedTensorToTensorImpl:ii,rangeImpl:ai,rsqrtImpl:ci,scatterImpl:li,sigmoidImpl:ui,simpleAbsImpl:so,sliceImpl:pi,sparseFillEmptyRowsImpl:di,sparseReshapeImpl:mi,sparseSegmentReductionImpl:io,sqrtImpl:fi,staticRegexReplaceImpl:hi,stridedSliceImpl:xi,stringNGramsImpl:gi,stringSplitImpl:Ci,stringToHashBucketFastImpl:bi,subImpl:vi,tileImpl:$i,topKImpl:Si,transposeImpl:Oe,uniqueImpl:yi}=sd;function kn(o,e){return["x","y","z","w","u","v"].slice(0,e).map(t=>`${o}.${t}`)}function L(o,e){return e===1?[o]:kn(o,e)}function Ri(o,e){if(o===1)return"rc";let t="";for(let r=0;r<o;r++)t+=e[r],r<o-1&&(t+=",");return t}var ao=class{constructor(e){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.enableShapeUniforms=D(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{let t=L("rc",this.rank),r=N(this.rank),n=this.getOutOfBoundsCondition(t),s=this.getSetup(t),i=this.getOutput(t);this.userCode=`
        void main() {
          ${r} rc = getOutputCoords();

          if(${n}) {
            setOutput(vec4(0));
          } else {
            ${s}

            setOutput(vec4(${i}));
          }
        }
      `}}getSourceCoordsArr(e){let t=[];for(let r=0;r<=1;r++)for(let n=0;n<=1;n++){let s=`${r===0?"r":"rp1"}, ${n===0?"c":"cp1"}`;for(let i=2;i<this.rank;i++)s=`${e[e.length-1-i]},`+s;t.push(s)}return t}getOutOfBoundsCondition(e){if(this.rank===1)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let r=this.rank-2;r<this.rank;r++)t+=`${e[r]} >= ${this.enableShapeUniforms?`outShape[${r}]`:this.outputShape[r]}`,r<this.rank-1&&(t+="||");return t}getSetup(e){if(this.rank===1)return"";let t=e.slice(-2),r=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],n=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${r};
      bool rEdge = rp1 >= ${n};
    `}getOutput(e){let t=this.getSourceCoordsArr(e);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}};var tt=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length);let r="";for(let n=0;n<4;n++){let s="thisRC = rc;";n%2===1&&(s+="thisRC.z += 1;"),n>1&&(s+="thisRC.y += 1;"),r+=`
        ${s}
        ${n>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${n}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${n>0?"}":""}
      `}this.userCode=`
      ${id(t,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?je():qe(e)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":e[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":e[2]};

        ${r}

        setOutput(result);
      }
    `}};function id(o,e){return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${e?ys(["r","c","d"],"inputShape"):le(["r","c","d"],o)}
      return ivec3(r, c, d);
    }
  `}import{env as Ni}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var co=class{constructor(e){this.gpgpu=e,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=!1}acquireTexture(e,t,r){let n=wi(t,r),s=Ii(e,n,r);s in this.freeTextures||(this.freeTextures[s]=[]),s in this.usedTextures||(this.usedTextures[s]=[]);let i=Ti(e,n,this.gpgpu.gl,this.gpgpu.textureConfig,r);if(this.freeTextures[s].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();let a=this.freeTextures[s].pop();return this.usedTextures[s].push(a),a}let c;return n===G.PACKED_2X2_FLOAT32?c=this.gpgpu.createPackedMatrixTexture(e[0],e[1]):n===G.PACKED_2X2_FLOAT16?c=this.gpgpu.createFloat16PackedMatrixTexture(e[0],e[1]):n===G.UNPACKED_FLOAT32?c=this.gpgpu.createFloat32MatrixTexture(e[0],e[1]):n===G.UNPACKED_FLOAT16?c=this.gpgpu.createFloat16MatrixTexture(e[0],e[1]):n===G.PACKED_4X1_UNSIGNED_BYTE&&(c=this.gpgpu.createUnsignedBytesMatrixTexture(e[0],e[1])),this.usedTextures[s].push(c),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),c}releaseTexture(e,t,r,n){if(this.freeTextures==null)return;let s=wi(r,n),i=Ii(t,s,n);i in this.freeTextures||(this.freeTextures[i]=[]);let c=Ti(t,s,this.gpgpu.gl,this.gpgpu.textureConfig,n),a=Ni().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");a!==-1&&this._numBytesAllocated>a?(this.gpgpu.deleteMatrixTexture(e.texture),this._numBytesAllocated-=c):(this.freeTextures[i].push(e),this.numFreeTextures++,this._numBytesFree+=c),this.numUsedTextures--;let l=this.usedTextures[i],u=l&&l.indexOf(e);if(u==null||u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");l[u]=l[l.length-1],l.pop(),this.log()}log(){if(!this.logEnabled)return;let e=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${e})`);let t=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*t)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(this.freeTextures!=null){for(let e in this.freeTextures)this.freeTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});for(let e in this.usedTextures)this.usedTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}};function ad(o,e){let t=o;if(e===t.R32F)return 4;if(e===t.R16F)return 2;if(e===t.RGBA32F)return 16;if(e===o.RGBA)return 16;if(e===t.RGBA16F)return 8;if(e===t.RGBA8)return 4;throw new Error(`Unknown internal format ${e}`)}function Ti(o,e,t,r,n){let s=cd(e,r),i;if(n){let[a,l]=me(o[0],o[1]);i=a*l}else{let[a,l]=Ae(o[0],o[1]);i=a*l}let c=ad(t,s);return i*c}function cd(o,e){switch(o){case G.PACKED_2X2_FLOAT32:return oo(e);case G.PACKED_2X2_FLOAT16:return ro(e);case G.UNPACKED_FLOAT32:return Jt(e);case G.UNPACKED_FLOAT16:return eo(e);case G.PACKED_4X1_UNSIGNED_BYTE:return to(e);default:throw new Error(`Unknown physical texture type ${o}`)}}function ld(o){return Ni().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?o?G.PACKED_2X2_FLOAT32:G.UNPACKED_FLOAT32:o?G.PACKED_2X2_FLOAT16:G.UNPACKED_FLOAT16}function wi(o,e){if(o===H.UPLOAD)return G.PACKED_2X2_FLOAT32;if(o===H.RENDER||o==null)return ld(e);if(o===H.DOWNLOAD||o===H.PIXELS)return G.PACKED_4X1_UNSIGNED_BYTE;throw new Error(`Unknown logical texture type ${o}`)}function Ii(o,e,t){return`${o[0]}_${o[1]}_${e}_${t}`}var z=class{constructor(e,t){this.variableNames=["A"],this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${t}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}},W="if (isnan(x)) return x;",Ei="return x;",_n="return abs(x);";var ki="return (x >= 0.0) ? x : (exp(x) - 1.0);",_i=W+`
  return (x < 0.0) ? 0.0 : x;
`,Ai=W+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,he="return x;",Fi="return 1.0 / (1.0 + exp(-1.0 * x));";var Pi="return x;",Oi=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,Li=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Bi=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Ui="return 1.0 / (1.0 + exp(-1.0 * x));",j=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${t}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}};var lo=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length);let t=e.length,r=L("rc",t),n=N(t),s=Ri(t,r),i=r.slice(-2),c=t<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${n} rc = getOutputCoords();
        vec4 packedInput = getA(${s});

        setOutput(getChannel(packedInput, ${c}));
      }
    `}};var gd=dd.whereImpl,Cd=1e-7,bd=1e-4,uo={};function vd(o){return o in uo||(uo[o]={}),uo[o]}var $d=F().getNumber("CPU_HANDOFF_SIZE_THRESHOLD"),Sd=600;function yd(){return F().global.screen==null?1024:F().global.screen.height*F().global.screen.width*window.devicePixelRatio*Sd/1024/1024}var ot=class o extends md{nextDataId(){return o.nextDataId++}constructor(e){if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!F().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");let t;if(e!=null){if(e instanceof Pe)t=e;else{let r=J(F().getNumber("WEBGL_VERSION"),e);t=new Pe(r)}this.binaryCache={},this.gpgpuCreatedLocally=!1}else{let r=J(F().getNumber("WEBGL_VERSION"));t=new Pe(r),this.binaryCache=vd(F().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0}this.gpgpu=t,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new co(this.gpgpu),this.numMBBeforeWarning=yd(),this.texData=new pd(this,Ie())}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,t,r,n,s,i){let c=this.makeTensorInfo(t,r),a=this.texData.get(c.dataId);a.isPacked=!1,a.texture={texture:e,texShape:[n,s]},a.texShape=[n,s];let l=Xe(t),u=new gt(l,!1,i),p=this.runWebGLProgram(u,[c],r,[[n,s]]);return p.shape=t,a.texture=null,this.disposeIntermediateTensorInfo(c),p.dataId}write(e,t,r){if((F().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||F().getBool("DEBUG"))&&this.checkNumericalProblems(e),r==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let n={id:this.nextDataId()};return this.texData.set(n,{shape:t,dtype:r,values:e,usage:H.UPLOAD,refCount:1}),n}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){let t=this.texData.get(e);t.refCount++}decRef(e){if(this.texData.has(e)){let t=this.texData.get(e);t.refCount--}}move(e,t,r,n,s){if(F().getBool("DEBUG")&&this.checkNumericalProblems(t),n==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:r,dtype:n,values:t,usage:H.UPLOAD,refCount:s})}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}readSync(e){let t=this.texData.get(e),{values:r,dtype:n,complexTensorInfos:s,slice:i,shape:c,isPacked:a}=t;if(i!=null){let d;a?d=new j(c,he):d=new z(c,he);let m=this.runWebGLProgram(d,[{dataId:e,shape:c,dtype:n}],n),f=this.readSync(m.dataId);return this.disposeIntermediateTensorInfo(m),f}if(r!=null)return this.convertAndCacheOnCPU(e);if(n==="string")return r;let l=this.activeTimers!=null,u;l&&(u=M.now());let p;if(n==="complex64"){let d=this.readSync(s.real.dataId),m=this.readSync(s.imag.dataId);p=An.mergeRealAndImagArrays(d,m)}else p=this.getValuesFromTexture(e);return l&&(this.downloadWaitMs+=M.now()-u),this.convertAndCacheOnCPU(e,p)}async read(e){if(this.pendingRead.has(e)){let f=this.pendingRead.get(e);return new Promise(x=>f.push(x))}let t=this.texData.get(e),{values:r,shape:n,slice:s,dtype:i,complexTensorInfos:c,isPacked:a}=t;if(s!=null){let f;a?f=new j(n,he):f=new z(n,he);let x=this.runWebGLProgram(f,[{dataId:e,shape:n,dtype:i}],i),g=this.read(x.dataId);return this.disposeIntermediateTensorInfo(x),g}if(r!=null)return this.convertAndCacheOnCPU(e);if(F().getBool("DEBUG")&&!F().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&F().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let l=null,u;if(i!=="complex64"&&F().get("WEBGL_BUFFER_SUPPORTED")){u=this.decode(e);let f=this.texData.get(u.dataId);l=this.gpgpu.createBufferFromTexture(f.texture.texture,...dt(n))}this.pendingRead.set(e,[]),i!=="complex64"&&await this.gpgpu.createAndWaitForFence();let p;if(i==="complex64"){let f=await Promise.all([this.read(c.real.dataId),this.read(c.imag.dataId)]),x=f[0],g=f[1];p=An.mergeRealAndImagArrays(x,g)}else if(l==null)p=this.getValuesFromTexture(e);else{let f=M.sizeFromShape(n);p=this.gpgpu.downloadFloat32MatrixFromBuffer(l,f)}if(u!=null&&this.disposeIntermediateTensorInfo(u),l!=null){let f=this.gpgpu.gl;y(f,()=>f.deleteBuffer(l))}let d=this.convertAndCacheOnCPU(e,p),m=this.pendingRead.get(e);return this.pendingRead.delete(e),m.forEach(f=>f(d)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&Ie().removeDataId(e,this),this.pendingDeletes--),d}readToGPU(e,t={}){let r=this.texData.get(e),{values:n,shape:s,slice:i,dtype:c,isPacked:a,texture:l}=r;if(c==="complex64")throw new Error("Does not support reading texture for complex64 dtype.");if(i!=null){let m;a?m=new j(s,he):m=new z(s,he);let f=this.runWebGLProgram(m,[{dataId:e,shape:s,dtype:c}],c),x=this.readToGPU(f,t);return this.disposeIntermediateTensorInfo(f),x}if(l==null)throw n!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");let u=this.decode(e,t.customTexShape),p=Ie().makeTensorFromTensorInfo(u),d=this.texData.get(u.dataId);return Object.assign({tensorRef:p},d.texture)}bufferSync(e){let t=this.readSync(e.dataId);if(e.dtype==="string")try{let r=t.map(n=>M.decodeString(n));return Vi(e.shape,e.dtype,r)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return Vi(e.shape,e.dtype,t)}checkNumericalProblems(e){if(e!=null)for(let t=0;t<e.length;t++){let r=e[t];if(!zr(r))throw F().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error(`The value ${r} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`):Error(`The value ${r} cannot be represented on this device.`)}}getValuesFromTexture(e){let{shape:t,dtype:r,isPacked:n}=this.texData.get(e),s=M.sizeFromShape(t);if(F().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){let d=this.decode(e),m=this.texData.get(d.dataId),f=this.gpgpu.downloadMatrixFromPackedTexture(m.texture.texture,...dt(t)).subarray(0,s);return this.disposeIntermediateTensorInfo(d),f}let i=F().getBool("WEBGL_PACK")&&n===!0,c=i?Xe(t):t,a=i?new Yt(c):new jt(c),l=this.runWebGLProgram(a,[{shape:c,dtype:r,dataId:e}],"float32"),u=this.texData.get(l.dataId),p=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(u.texture.texture,u.texShape[0],u.texShape[1]).subarray(0,s);return this.disposeIntermediateTensorInfo(l),p}timerAvailable(){return F().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){let t=this.activeTimers,r=[],n=!1;this.programTimersStack==null?(this.programTimersStack=r,n=!0):this.activeTimers.push(r),this.activeTimers=r,e();let s=M.flatten(this.activeTimers.map(a=>a.query)).filter(a=>a!=null),i=M.flatten(this.activeTimers.map(a=>a.name)).filter(a=>a!=null);this.activeTimers=t,n&&(this.programTimersStack=null);let c={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if(F().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){let a=await Promise.all(s);c.kernelMs=M.sum(a),c.getExtraProfileInfo=()=>a.map((l,u)=>({name:i[u],ms:l})).map(l=>`${l.name}: ${l.ms}`).join(", ")}else c.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,c})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return F().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:M.now(),endMs:null}}endTimer(e){return F().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=M.now(),e)}async getQueryTime(e){if(F().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0)return this.gpgpu.waitForQueryAndGetTime(e);let t=e;return t.endMs-t.startMs}disposeData(e,t=!1){if(this.pendingDisposal.has(e))return!1;if(!this.texData.has(e))return!0;if(t?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!t&&this.texData.get(e).refCount>0)return!1;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,!1;this.releaseGPUData(e);let{complexTensorInfos:r}=this.texData.get(e);return r!=null&&(this.disposeData(r.real.dataId,t),this.disposeData(r.imag.dataId,t)),this.texData.delete(e),!0}releaseGPUData(e){let{texture:t,dtype:r,texShape:n,usage:s,isPacked:i,slice:c}=this.texData.get(e),a=c&&c.origDataId||e,l=this.dataRefCount.get(a);l>1?this.dataRefCount.set(a,l-1):(this.dataRefCount.delete(a),t!=null&&(this.numBytesInGPU-=this.computeBytes(n,r),this.textureManager.releaseTexture(t,n,s,i)));let u=this.texData.get(e);u.texture=null,u.texShape=null,u.isPacked=!1,u.slice=null}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,t=$d){return F().getBool("WEBGL_CPU_FORWARD")&&e.every(r=>this.texData.get(r.dataId).texture==null&&M.sizeFromShape(r.shape)<t)}getGPGPUContext(){return this.gpgpu}where(e){An.warn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");let t=e.dataSync();return gd(e.shape,t)}packedUnaryOp(e,t,r){let n=new j(e.shape,t),s=this.compileAndRun(n,[e],r);return Ie().makeTensorFromTensorInfo(s)}abs(e){if(this.shouldExecuteOnCPU([e])&&e.dtype!=="complex64"){let n=so(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,n)}if(F().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,_n,e.dtype);let t=new z(e.shape,_n),r=this.compileAndRun(t,[e]);return Ie().makeTensorFromTensorInfo(r)}makeTensorInfo(e,t,r){let n;if(t==="string"&&r!=null&&r.length>0&&M.isString(r[0])){let s=r.map(i=>M.encodeString(i));n=this.write(s,e,t)}else n=this.write(r,e,t);return this.texData.get(n).usage=null,{dataId:n,shape:e,dtype:t}}makeOutput(e,t,r){return Ie().makeTensorFromTensorInfo(this.makeTensorInfo(e,t,r),this)}unpackTensor(e){let t=new lo(e.shape);return this.runWebGLProgram(t,[e],e.dtype)}packTensor(e){let t=new ao(e.shape),r=!0;return this.runWebGLProgram(t,[e],e.dtype,null,r)}packedReshape(e,t){let r=[Ce(e.shape),...be(e.shape)],n={dtype:e.dtype,shape:r,dataId:e.dataId},s=[Ce(t),...be(t)],i=new tt(s,r),c=!0,a=[r],l=this.runWebGLProgram(i,[n],e.dtype,a,c);return{dataId:l.dataId,shape:t,dtype:l.dtype}}decode(e,t){let r=this.texData.get(e),{isPacked:n,shape:s,dtype:i}=r;if(t!=null){let d=M.sizeFromShape(s),m=t[0]*t[1]*4;M.assert(d<=m,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}let c=Xe(s),a;n?a=new qt(c):a=new Kt(c);let l=!0,u=[t??dt(c)],p=this.runWebGLProgram(a,[{shape:c,dtype:i,dataId:e}],i,u,l,t);return{dtype:i,shape:s,dataId:p.dataId}}runWebGLProgram(e,t,r,n,s=!1,i){let c=this.makeTensorInfo(e.outputShape,r),a=this.texData.get(c.dataId);if(e.packedOutput&&(a.isPacked=!0),e.outPackingScheme===Re.DENSE){let h=i??dt(e.outputShape);a.texShape=h.map(C=>C*2)}if(e.outTexUsage!=null&&(a.usage=e.outTexUsage),M.sizeFromShape(c.shape)===0)return a.values=M.getTypedArrayFromDType(c.dtype,0),c;let l=[],u=t.map(h=>{if(h.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let C=this.texData.get(h.dataId);if(C.texture==null){if(!e.packedInputs&&M.sizeFromShape(h.shape)<=F().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:h.shape,texData:null,isUniform:!0,uniformValues:C.values};e.packedInputs&&(C.isPacked=!0,C.shape=h.shape)}if(this.uploadToGPU(h.dataId),!!C.isPacked!=!!e.packedInputs)h=C.isPacked?this.unpackTensor(h):this.packTensor(h),l.push(h),C=this.texData.get(h.dataId);else if(C.isPacked&&!Te(C.shape,h.shape)){let v=h,b=h.shape;h.shape=C.shape,h=this.packedReshape(h,b),l.push(h),C=this.texData.get(h.dataId),v.shape=b}return{shape:h.shape,texData:C,isUniform:!1}});this.uploadToGPU(c.dataId);let p={shape:c.shape,texData:a,isUniform:!1},d=_s(e,u,p),m=this.getAndSaveBinary(d,()=>Es(this.gpgpu,e,u,p)),f=this.activeTimers!=null,x;f&&(x=this.startTimer()),F().get("ENGINE_COMPILE_ONLY")||ks(this.gpgpu,m,u,p,n),l.forEach(h=>this.disposeIntermediateTensorInfo(h)),f&&(x=this.endTimer(x),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(x)}));let g=F().getNumber("WEBGL_FLUSH_THRESHOLD");if(g>0){let h=M.now();h-this.lastGlFlushTime>g&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=h)}if(!F().getBool("WEBGL_LAZILY_UNPACK")&&a.isPacked&&s===!1){let h=this.unpackTensor(c);return this.disposeIntermediateTensorInfo(c),h}return c}compileAndRun(e,t,r,n,s=!1){return r=r||t[0].dtype,this.runWebGLProgram(e,t,r,n,s)}getAndSaveBinary(e,t){return e in this.binaryCache||(this.binaryCache[e]=t()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||(F().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(t=>{this.gpgpu.deleteProgram(this.binaryCache[t].webGLProgram),delete this.binaryCache[t]}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return this.floatPrecisionValue==null&&(this.floatPrecisionValue=xd(()=>{if(!F().get("WEBGL_RENDER_FLOAT32_ENABLED")){let e=F().getBool("DEBUG");F().set("DEBUG",!1);let t=this.abs(hd(1e-8)).dataSync()[0];if(F().set("DEBUG",e),t>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return this.floatPrecision()===32?Cd:bd}uploadToGPU(e){let t=this.texData.get(e),{shape:r,dtype:n,values:s,texture:i,usage:c,isPacked:a}=t;if(i!=null)return;let l=this.activeTimers!=null,u;l&&(u=M.now());let p=t.texShape;if(p==null&&(p=rn(r,a),t.texShape=p),s!=null){let d=Xe(r),m,f=p[1],x=p[0],g=s instanceof Uint8Array||s instanceof Uint8ClampedArray;(a||!g)&&([f,x]=me(p[0],p[1])),a?m=new Qt(d,g):m=new gt(d,g);let h=g?[x,f]:p,C=this.makeTensorInfo(h,n),v=this.texData.get(C.dataId);g?v.usage=H.PIXELS:v.usage=H.UPLOAD,v.texShape=h,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(C.dataId),f,x,s);let b=[[x,f]],S=!0,E=this.runWebGLProgram(m,[C],n,b,S),I=this.texData.get(E.dataId);t.texShape=I.texShape,t.isPacked=I.isPacked,t.usage=I.usage,F().get("ENGINE_COMPILE_ONLY")?this.disposeData(E.dataId):(t.texture=I.texture,t.values=null,this.texData.delete(E.dataId)),this.disposeIntermediateTensorInfo(C),l&&(this.uploadWaitMs+=M.now()-u)}else{let d=this.acquireTexture(p,c,n,a);t.texture=d}}convertAndCacheOnCPU(e,t){let r=this.texData.get(e),{dtype:n}=r;return t!=null&&(r.values=Rd(t,n)),r.values}acquireTexture(e,t,r,n){if(this.numBytesInGPU+=this.computeBytes(e,r),!this.warnedAboutMemory&&this.numBytesInGPU>this.numMBBeforeWarning*1024*1024){let s=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${s} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(e,t,n)}computeBytes(e,t){return e[0]*e[1]*M.bytesPerElement(t)}checkCompileCompletion(){for(let[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e)}async checkCompileCompletionAsync(){let e=[];if(this.gpgpu.parallelCompilationExtension){for(let[,t]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(t));return Promise.all(e)}else{for(let[,t]of Object.entries(this.binaryCache)){let r=new Promise(n=>{try{this.checkCompletion_(t),n(!0)}catch(s){throw s}});e.push(r)}return Promise.all(e)}}async checkCompletionAsync_(e){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(await fd(),this.checkCompletionAsync_(e))}checkCompletion_(e){if(this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)===!1)throw console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS)===!1?(Wt(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),new Error("Failed to compile fragment shader.")):new Error("Failed to link vertex and fragment shaders.");return!0}getUniformLocations(){for(let e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);let{variablesLocations:t,customUniformLocations:r,infLoc:n,nanLoc:s,outShapeLocation:i,outShapeStridesLocation:c,outTexShapeLocation:a}=dn(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=t,e.customUniformLocations=r,e.infLoc=n,e.nanLoc=s,e.outShapeLocation=i,e.outShapeStridesLocation=c,e.outTexShapeLocation=a}}createTensorFromGPUData(e,t,r){e.channels=e.channels||"RGBA";let{texture:n,height:s,width:i,channels:c}=e,a=Ie().backend;if(!a.gpgpu.gl.isTexture(n))throw new Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");let l=a.writeTexture(n,t,r,s,i,c);return Ie().makeTensorFromDataId(l,t,r,a)}};ot.nextDataId=0;function Rd(o,e){if(e==="float32"||e==="complex64")return o;if(e==="int32"||e==="bool"){let t=e==="int32"?new Int32Array(o.length):new Uint8Array(o.length);for(let r=0;r<t.length;++r)t[r]=Math.round(o[r]);return t}else throw new Error(`Unknown dtype ${e}`)}var Td="4.15.0";import{env as wd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Wi(){wd().set("WEBGL_FORCE_F16_TEXTURES",!0)}Id.isBrowser()&&Nd("webgl",()=>new ot,2);var b0={forceHalfFloat:Wi};import{registerKernel as P$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{_FusedMatMul as rm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{broadcast_util as tm,upcastType as om,util as xo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Xi,env as qi,upcastType as Ki}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Ed}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var rt=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;var Y=class{constructor(e,t,r){this.variableNames=["A","B"],this.outputShape=Ed.assertAndGetBroadcastShape(t,r),this.enableShapeUniforms=D(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${e}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}};import{backend_util as kd,util as _d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var oe=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;var te=class{constructor(e,t,r,n=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=kd.assertAndGetBroadcastShape(t,r);let s=this.outputShape.length;this.enableShapeUniforms=D(s);let i="";if(n)if(s===0||_d.sizeFromShape(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          ${N(s)} coords = getOutputCoords();
        `,s===1)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{let a=L("coords",s);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${a[s-2]} + 1) >= outShape[${s} - 2];
            bool nextColOutOfBounds =
              (${a[s-1]} + 1) >= outShape[${s} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${a[s-2]} + 1) >= ${this.outputShape[s-2]};
            bool nextColOutOfBounds =
              (${a[s-1]} + 1) >= ${this.outputShape[s-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${e}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `}};import{Complex as Fd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Identity as Ad}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function B(o){let{inputs:e,backend:t}=o,{x:r}=e;return t.incRef(r.dataId),{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}var Mi={kernelName:Ad,backendName:"webgl",kernelFunc:B};function Q(o){let{inputs:e,backend:t}=o,{real:r,imag:n}=e,s=t.makeTensorInfo(r.shape,"complex64"),i=t.texData.get(s.dataId),c=B({inputs:{x:r},backend:t}),a=B({inputs:{x:n},backend:t});return i.complexTensorInfos={real:c,imag:a},s}var Gi={kernelName:Fd,backendName:"webgl",kernelFunc:Q};import{env as Dd,LeakyRelu as Pd,util as Od}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Fn="return (a < 0.) ? b * a : a;",Dn=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function Ld(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{alpha:s}=r,i=t.makeTensorInfo([],"float32",Od.createScalarValue(s,"float32")),c=Dd().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(Dn,n.shape,i.shape):new Y(Fn,n.shape,i.shape),a=t.runWebGLProgram(c,[n,i],"float32");return t.disposeIntermediateTensorInfo(i),a}var zi={kernelName:Pd,backendName:"webgl",kernelFunc:Ld};import{env as Bd,Prelu as Ud}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Pn="return (a < 0.) ? b * a : a;",On=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function Vd(o){let{inputs:e,backend:t}=o,{x:r,alpha:n}=e,s=Bd().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(On,r.shape,n.shape):new Y(Pn,r.shape,n.shape);return t.runWebGLProgram(s,[r,n],"float32")}var Hi={kernelName:Ud,backendName:"webgl",kernelFunc:Vd};var ie="if (isnan(x)) return x;";function R({opSnippet:o,packedOpSnippet:e,cpuKernelImpl:t,dtype:r}){return({inputs:n,backend:s})=>{let{x:i}=n,c=s,a=r||i.dtype;if(c.shouldExecuteOnCPU([i])&&t!=null){let p=c.texData.get(i.dataId),d=t(p.values,a);return c.makeTensorInfo(i.shape,a,d)}let l=qi().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&e!=null,u;return l?u=new j(i.shape,e):u=new z(i.shape,o),c.runWebGLProgram(u,[i],a)}}function A({opSnippet:o,packedOpSnippet:e,checkOutOfBounds:t=!1,supportsComplex:r=!1,cpuKernelImpl:n,dtype:s}){return({inputs:i,backend:c})=>{let{a,b:l}=i,u=c;if(r&&a.dtype==="complex64"){let f=u.texData.get(a.dataId),x=u.texData.get(l.dataId),[g,h]=[[f.complexTensorInfos.real,x.complexTensorInfos.real],[f.complexTensorInfos.imag,x.complexTensorInfos.imag]].map(v=>{let[b,S]=v,E={dataId:b.dataId,dtype:b.dtype,shape:a.shape},I={dataId:S.dataId,dtype:S.dtype,shape:l.shape},T=new Y(o,a.shape,l.shape);return u.runWebGLProgram(T,[E,I],Ki(b.dtype,S.dtype))}),C=Q({inputs:{real:g,imag:h},backend:u});return u.disposeIntermediateTensorInfo(g),u.disposeIntermediateTensorInfo(h),C}let p=s||Ki(a.dtype,l.dtype);if((a.dtype==="string"||l.dtype==="string"||u.shouldExecuteOnCPU([a,l]))&&n!=null){let f=u.texData.get(a.dataId).values,x=u.texData.get(l.dataId).values,g=a.dtype==="string"?Xi.fromUint8ToStringArray(f):f,h=a.dtype==="string"?Xi.fromUint8ToStringArray(x):x,[C,v]=n(a.shape,l.shape,g,h,p),b=u.makeTensorInfo(v,p),S=u.texData.get(b.dataId);return S.values=C,b}let d=qi().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&e!=null,m;return d?m=new te(e,a.shape,l.shape,t):m=new Y(o,a.shape,l.shape),u.runWebGLProgram(m,[a,l],p)}}function ve(o,e=!1){if(o==="linear")return e?Pi:Ei;if(o==="relu")return e?Li:_i;if(o==="elu")return e?Oi:ki;if(o==="relu6")return e?Bi:Ai;if(o==="prelu")return e?On:Pn;if(o==="leakyrelu")return e?Dn:Fn;if(o==="sigmoid")return e?Ui:Fi;throw new Error(`Activation ${o} has not been implemented for the WebGL backend.`)}var nt=class{constructor(e,t,r,n=!1,s=!1,i=!1,c=null,a=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r,this.enableShapeUniforms=D(this.outputShape.length);let u=n?e[1]:e[2],p=Math.ceil(u/2),d=n?"i * 2, rc.y":"rc.y, i * 2",m=s?"rc.z, i * 2":"i * 2, rc.z",f=n?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],x=s?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],g="",h="";c&&(a?g=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${c}
        }`:l?g=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${c}
        }`:g=`vec4 activation(vec4 x) {
          ${c}
        }`,h="result = activation(result);");let C=i?"result += getBiasAtOutCoords();":"";i&&this.variableNames.push("bias"),a&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let v="rc.x",b="rc.x";e[0]<t[0]?v=`imod(rc.x, ${e[0]})`:t[0]<e[0]&&(b=`imod(rc.x, ${t[0]})`),this.userCode=`
      ${g}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${p}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${v};
        int batchB = ${b};
        for (int i = 0; i < ${p}; i++) {
          vec4 a = getMatrixA(batchA, ${d});
          vec4 b = getMatrixB(batchB, ${m});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${f[0]} * ${x[0]});
          result += (${f[1]} * ${x[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${C}

        ${h}

        setOutput(result);
      }
    `}};import{backend_util as Gd,env as zd,Multiply as Hd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Wd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ln={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"},bt=class{constructor(e,t,r){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=Wd.assertAndGetBroadcastShape(t,r),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${e}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}};var ji="return a * b;";function vt(o){let{inputs:e,backend:t}=o,{a:r,b:n}=e,s=Gd.upcastType(r.dtype,n.dtype);if(r.dtype==="complex64"){let c=t.texData.get(r.dataId),a=t.texData.get(n.dataId),l=new bt(Ln.REAL,r.shape,n.shape),u=new bt(Ln.IMAG,r.shape,n.shape),p=[{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:r.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:r.shape},{dataId:a.complexTensorInfos.real.dataId,dtype:a.complexTensorInfos.real.dtype,shape:n.shape},{dataId:a.complexTensorInfos.imag.dataId,dtype:a.complexTensorInfos.imag.dtype,shape:n.shape}],d=t.runWebGLProgram(l,p,"float32"),m=t.runWebGLProgram(u,p,"float32"),f=Q({inputs:{real:d,imag:m},backend:t});return t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(m),f}if(t.shouldExecuteOnCPU([r,n])){let c=t.texData.get(r.dataId),a=t.texData.get(n.dataId),[l,u]=ei(r.shape,n.shape,c.values,a.values,s),p=t.makeTensorInfo(u,s),d=t.texData.get(p.dataId);return d.values=l,p}let i;return zd().getBool("WEBGL_PACK_BINARY_OPERATIONS")?i=new te(ji,r.shape,n.shape):i=new Y(ji,r.shape,n.shape),t.runWebGLProgram(i,[r,n],s)}var Yi={kernelName:Hd,backendName:"webgl",kernelFunc:vt};import{Reshape as Xd,util as po}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Qi(o,e,t){let r=[Ce(o.shape),...be(o.shape)],n={dtype:o.dtype,shape:r,dataId:o.dataId},s=[Ce(e),...be(e)],i=new tt(s,r),c=!0,a=[r],l=t.runWebGLProgram(i,[n],o.dtype,a,c);return{dataId:l.dataId,shape:e,dtype:l.dtype}}function $(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{shape:s}=r,i=t,c=po.sizeFromShape(n.shape),a=po.inferFromImplicitShape(s,c),l=po.sizeFromShape(a);po.assert(c===l,()=>`The new shape (${a}) has ${l} elements and the old shape (${n.shape}) has ${c} elements. The new shape and old shape must have the same number of elements.`);let u=i.texData.get(n.dataId);return u.isPacked&&!Te(n.shape,a)&&!(u.texture!==null&&Te(u.shape,a))?Qi(n,a,i):(i.incRef(n.dataId),{dataId:n.dataId,shape:a,dtype:n.dtype})}var Zi={kernelName:Xd,backendName:"webgl",kernelFunc:$};import{Sum as Jd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as St,sumOutType as Zd,util as Bn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as qd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Kd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $t=class{constructor(e,t){this.variableNames=["x"];let{windowSize:r,batchSize:n,inSize:s,outSize:i}=e;this.outputShape=[n,i];let c=Math.floor(r/4)*4,a=r%4,l="sumValue += dot(values, ones);";if(t!=null){let p=1/t;l=`sumValue += dot(values * ${Kd.isInt(p)?p.toPrecision(2):p}, ones);`}let u="";s%r>0&&(u=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        float sumValue = 0.0;

        for (int i = 0; i < ${c}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${c};
        if (${a===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${a===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${a===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}};var mo=class{constructor(e,t){this.variableNames=["x"];let{windowSize:r,batchSize:n,inSize:s,outSize:i}=e;this.outputShape=[n,i];let c="0.0",a="";t==="prod"?c="1.0":t==="min"?(c="1.0 / 1e-20",a="min"):t==="max"&&(c="-1.0 / 1e-20",a="max");let l=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="sum"?l="sumValue":t==="prod"?l="prodValue":t==="all"?l="allValue":t==="any"&&(l="anyValue");let u=Math.floor(r/4)*4,p=r%4,d=`
      if (${t==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${t==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${a}(values, minMaxValue);
        if (${t==="min"} || ${t==="max"}) {
          minMaxValue = ${a}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,m="vec4";t==="all"?(c="1.0",d=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,m="bvec4"):t==="any"&&(c="0.0",d=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,m="bvec4");let f="";s%r>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${c};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        vec4 minMaxValue = vec4(${c});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${p===1}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${p===2}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${p===3}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${d}
        }
        setOutput(${l});
      }
    `}};function jd(o){let e=[];for(;e.length===0||e[e.length-1].outSize!==1;){let t=e.length?e[e.length-1].outSize:o[1],r=qd.computeOptimalWindowSize(t);e.push({inSize:t,windowSize:r,outSize:Math.ceil(t/r)})}return e}function re(o,e,t,r){let n=jd(o.shape),s=o;for(let i=0;i<n.length;i++){let{inSize:c,windowSize:a,outSize:l}=n[i],u,p;t==="mean"?u=i===0?new $t({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l},c):new $t({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l}):u=new mo({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l},t),p=s,s=r.runWebGLProgram(u,[s],e),p.dataId!==o.dataId&&r.disposeIntermediateTensorInfo(p)}return s}import{env as Qd}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var fo=class{constructor(e,t){this.variableNames=["A"];let r=new Array(e.length);for(let i=0;i<r.length;i++)r[i]=e[t[i]];this.outputShape=r,this.rank=r.length;let n=N(this.rank),s=Yd(t);this.userCode=`
    void main() {
      ${n} resRC = getOutputCoords();
      setOutput(getA(${s}));
    }
    `}};function Yd(o){let e=o.length;if(e>6)throw Error(`Transpose for rank ${e} is not yet supported`);let t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],r=new Array(e);for(let n=0;n<o.length;n++)r[o[n]]=t[n];return r.join()}var ho=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;let r=new Array(e.length);for(let u=0;u<r.length;u++)r[u]=e[t[u]];if(this.outputShape=r,this.rank=r.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);let n=N(this.rank),s=kn("rc",this.rank),i=new Array(this.rank);for(let u=0;u<t.length;u++)i[t[u]]=s[u];let c=`vec2(${i.slice(-2).join()})`,a=`++${s[this.rank-1]} < ${r[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${c})`;this.userCode=`
    void main() {
      ${n} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${a}) {
        result[1] = ${l};
      }
      --${s[this.rank-1]};
      if(++${s[this.rank-2]} < ${r[this.rank-2]}) {
        result[2] = ${l};
        if(${a}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}};function Ne(o,e,t){let r=Qd().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new ho(o.shape,e):new fo(o.shape,e);return t.runWebGLProgram(r,[o],o.dtype)}function Ji(o,e,t,r){let n=e,s=o.shape.length,i=Bn.parseAxisParam(n,o.shape),c=i,a=St.getAxesPermutation(c,s),l=a!=null,u=o;l&&(u=Ne(o,a,r),c=St.getInnerMostAxes(c.length,s)),St.assertAxesAreInnerMostDims("sum",c,s);let[p,d]=St.computeOutAndReduceShapes(u.shape,c),m=p;t&&(m=St.expandShapeToKeepDim(p,i));let f=Bn.sizeFromShape(d),g=Bn.sizeFromShape(o.shape)/f,h=$({inputs:{x:u},attrs:{shape:[g,f]},backend:r}),C=Zd(o.dtype),v=re(h,C,"sum",r),b=$({inputs:{x:v},attrs:{shape:m},backend:r});return r.disposeIntermediateTensorInfo(h),r.disposeIntermediateTensorInfo(v),l&&r.disposeIntermediateTensorInfo(u),b}function Le(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,keepDims:i}=r;return Ji(n,s,i,t)}var ea={kernelName:Jd,backendName:"webgl",kernelFunc:Le};import{Transpose as em}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function P(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{perm:s}=r,i=t,c=n.shape.length,a=new Array(c);for(let u=0;u<a.length;u++)a[u]=n.shape[s[u]];let l;if(i.shouldExecuteOnCPU([n])){let p=i.texData.get(n.dataId).values,d=Oe(p,n.shape,n.dtype,s,a);l=i.makeTensorInfo(a,n.dtype);let m=i.texData.get(l.dataId);m.values=d}else l=Ne(n,s,i);return l}var ta={kernelName:em,backendName:"webgl",kernelFunc:P};var Un=1e3;function Be({a:o,b:e,transposeA:t,transposeB:r,backend:n,bias:s=null,preluActivationWeights:i=null,leakyreluAlpha:c=0,activation:a=null}){let l=o.shape.length,u=e.shape.length,p=t?o.shape[l-2]:o.shape[l-1],d=r?e.shape[u-1]:e.shape[u-2],m=t?o.shape[l-1]:o.shape[l-2],f=r?e.shape[u-2]:e.shape[u-1],x=o.shape.slice(0,-2),g=e.shape.slice(0,-2),h=xo.sizeFromShape(x),C=xo.sizeFromShape(g),b=tm.assertAndGetBroadcastShape(o.shape.slice(0,-2),e.shape.slice(0,-2)).concat([m,f]);xo.assert(p===d,()=>`Error in matMul: inner shapes (${p}) and (${d}) of Tensors with shapes ${o.shape} and ${e.shape} and transposeA=${t} and transposeB=${r} must match.`);let S=t?[h,p,m]:[h,m,p],E=r?[C,f,d]:[C,d,f],I=$({inputs:{x:o},backend:n,attrs:{shape:S}}),T=$({inputs:{x:e},backend:n,attrs:{shape:E}}),_=[I,T],k=Math.max(h,C),U=t?I.shape[1]:I.shape[2],V=s!=null,de=i!=null,Z=a==="leakyrelu",ne=a!=null?ve(a,!0):null,se=V||de||Z||ne!=null,ae;if((m===1||f===1)&&U>Un&&se===!1){let ye=I,Me=T;t&&(ye=P({inputs:{x:I},backend:n,attrs:{perm:[0,2,1]}}),_.push(ye)),r&&(Me=P({inputs:{x:T},backend:n,attrs:{perm:[0,2,1]}}),_.push(Me));let Ge=f!==1,Ot=f===1,Ur=ye;Ge&&(Ur=$({inputs:{x:ye},backend:n,attrs:{shape:[k,U,1]}}),_.push(Ur));let tp=f===1?2:1,Vr=Me;Ot&&(Vr=$({inputs:{x:Me},backend:n,attrs:{shape:[k,1,U]}}),_.push(Vr));let ps=vt({inputs:{a:Ur,b:Vr},backend:n});ae=Le({inputs:{x:ps},backend:n,attrs:{axis:tp,keepDims:!0}}),_.push(ps)}else{let ye=om(o.dtype,e.dtype),Me=new nt(S,E,[k,m,f],t,r,V,ne,de,Z),Ge=[I,T];if(s!=null&&Ge.push(s),de&&Ge.push(i),Z){let Ot=n.makeTensorInfo([],"float32",xo.createScalarValue(c,"float32"));Ge.push(Ot),_.push(Ot)}ae=n.runWebGLProgram(Me,Ge,ye)}let K=$({inputs:{x:ae},backend:n,attrs:{shape:b}});_.push(ae);for(let ye of _)n.disposeIntermediateTensorInfo(ye);return K}function nm(o){let{inputs:e,backend:t,attrs:r}=o,{a:n,b:s,bias:i,preluActivationWeights:c}=e,{transposeA:a,transposeB:l,activation:u,leakyreluAlpha:p}=r;return Be({a:n,b:s,transposeA:a,transposeB:l,backend:t,bias:i,preluActivationWeights:c,leakyreluAlpha:p,activation:u})}var oa={kernelName:rm,backendName:"webgl",kernelFunc:nm};import{Abs as sm,env as im}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ra="return abs(x);";function am(o){let{inputs:e,backend:t}=o,{x:r}=e;if(t.shouldExecuteOnCPU([r])&&r.dtype!=="complex64"){let s=t.texData.get(r.dataId),i=so(s.values);return t.makeTensorInfo(r.shape,r.dtype,i)}let n;return im().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new j(r.shape,ra):n=new z(r.shape,ra),t.runWebGLProgram(n,[r],r.dtype)}var na={kernelName:sm,backendName:"webgl",kernelFunc:am};import{Acos as cm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var lm=W+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,um=R({opSnippet:lm}),sa={kernelName:cm,backendName:"webgl",kernelFunc:um};import{Acosh as pm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var dm=W+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`,mm=R({opSnippet:dm}),ia={kernelName:pm,backendName:"webgl",kernelFunc:mm};import{Add as fm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var aa="return a + b;",hm=A({opSnippet:aa,packedOpSnippet:aa,supportsComplex:!0,cpuKernelImpl:Fs}),ca={kernelName:fm,backendName:"webgl",kernelFunc:hm};import{AddN as xm,env as la,upcastType as gm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var go=class{constructor(e,t){this.outputShape=[],this.outputShape=e,this.variableNames=t.map((s,i)=>`T${i}`);let r=[];this.variableNames.forEach(s=>{r.push(`float v${s} = get${s}AtOutCoords();`)});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${r.join(`
        `)}

        float result = ${n};
        setOutput(result);
      }
    `}};var Co=class{constructor(e,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.variableNames=t.map((s,i)=>`T${i}`);let r=[];this.variableNames.forEach(s=>{r.push(`vec4 v${s} = get${s}AtOutCoords();`)});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${r.join(`
        `)}

        vec4 result = ${n};
        setOutput(result);
      }
    `}};function bo(o){let{inputs:e,backend:t}=o,r=e;if(r.length===1)return B({inputs:{x:r[0]},backend:t});if(r.length>la().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let a=Math.floor(r.length/2),l=bo({inputs:r.slice(0,a),backend:t}),u=bo({inputs:r.slice(a),backend:t});return bo({inputs:[l,u],backend:t})}let n=r.map(a=>a.dtype).reduce((a,l)=>gm(a,l)),s=r.map(a=>a.shape),c=la().getBool("WEBGL_PACK")?new Co(r[0].shape,s):new go(r[0].shape,s);return t.runWebGLProgram(c,r,n)}var ua={kernelName:xm,backendName:"webgl",kernelFunc:bo};import{All as Cm,backend_util as yt,util as pa}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function bm(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,keepDims:i}=r,c=n.shape.length,a=pa.parseAxisParam(s,n.shape),l=a,u=yt.getAxesPermutation(l,c),p=n;u!=null&&(p=P({inputs:{x:n},backend:t,attrs:{perm:u}}),l=yt.getInnerMostAxes(l.length,c)),yt.assertAxesAreInnerMostDims("all",l,c);let[d,m]=yt.computeOutAndReduceShapes(p.shape,l),f=pa.sizeFromShape(m),x=$({inputs:{x:p},backend:t,attrs:{shape:[-1,f]}}),g=re(x,x.dtype,"all",t),h;if(i){let C=yt.expandShapeToKeepDim(d,a);h=$({inputs:{x:g},backend:t,attrs:{shape:C}})}else h=$({inputs:{x:g},backend:t,attrs:{shape:d}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(p),h}var da={kernelName:Cm,backendName:"webgl",kernelFunc:bm};import{Any as vm,backend_util as Rt,util as ma}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function $m(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,keepDims:i}=r,c=n.shape.length,a=ma.parseAxisParam(s,n.shape),l=a,u=Rt.getAxesPermutation(l,c),p=n;u!=null&&(p=P({inputs:{x:n},backend:t,attrs:{perm:u}}),l=Rt.getInnerMostAxes(l.length,c)),Rt.assertAxesAreInnerMostDims("any",l,c);let[d,m]=Rt.computeOutAndReduceShapes(p.shape,l),f=ma.sizeFromShape(m),x=$({inputs:{x:p},backend:t,attrs:{shape:[-1,f]}}),g=re(x,x.dtype,"any",t),h;if(i){let C=Rt.expandShapeToKeepDim(d,a);h=$({inputs:{x:g},backend:t,attrs:{shape:C}})}else h=$({inputs:{x:g},backend:t,attrs:{shape:d}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(p),h}var fa={kernelName:vm,backendName:"webgl",kernelFunc:$m};import{ArgMax as Tm,backend_util as Vn,util as wm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as So,env as ym,util as Rm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vo=class{constructor(e,t,r){this.variableNames=["A"];let{windowSize:n,batchSize:s,outSize:i}=e;r||this.variableNames.push("bestIndicesA"),this.outputShape=[s,i];let c=t==="max"?">":"<",a=r?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${n}; i++) {
          int inIdx = ${a};
          float candidate = getA(batch, inIdx);
          if (candidate ${c} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}};import{util as Sm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $o=class{constructor(e,t,r,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,Sm.assert(e.length>2,()=>`Packed arg${r.charAt(0).toUpperCase()+r.slice(1)} supports only inputs with rank above 2.`);let s=e[e.length-1],i=Math.ceil(s/t);this.outputShape=e.slice(0,-1),i>1&&this.outputShape.push(i),n||this.variableNames.push("bestIndicesA");let c=this.outputShape,a=c.length,l=N(a),u=L("coords",a),p,d;if(i===1){d=a+1;let T=N(d);p=`
        ${T} sourceLocR = ${T}(${u.join()}, 0);
        ++${u[a-1]};
        ${T} sourceLocG = ${T}(${u.join()}, 0);
        ++${u[a-2]};
        ${T} sourceLocA = ${T}(${u.join()}, 0);
        --${u[a-1]};
        ${T} sourceLocB = ${T}(${u.join()}, 0);
        --${u[a-2]};`}else d=a,p=`
        ${l} sourceLocR = coords;
        ++${u[a-1]};
        ${l} sourceLocG = coords;
        ++${u[a-2]};
        ${l} sourceLocA = coords;
        --${u[a-1]};
        ${l} sourceLocB = coords;
        --${u[a-2]};`;let m=["x","y","z","w","u","v"].slice(0,d),f="."+m[d-1],x=m.map(T=>"int "+T),g=L("sourceLocR",d-1).concat("inIdx.r"),h=L("sourceLocG",d-1).concat("inIdx.g"),C=L("sourceLocB",d-1).concat("inIdx.b"),v=L("sourceLocA",d-1).concat("inIdx.a"),b=r==="max"?"greaterThan":"lessThan",S=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${g.join()}),
                             getBestIndicesAChannel(${h.join()}),
                             getBestIndicesAChannel(${C.join()}),
                             getBestIndicesAChannel(${v.join()})));`,E=`vec4(
            getAChannel(${g.join()}),
            hasNextCol ? getAChannel(${h.join()}) : 0.,
            hasNextRow ? getAChannel(${C.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${v.join()}) : 0.)`,I=n?"":`
      float getBestIndicesAChannel(${x.join()}) {
        return getChannel(getBestIndicesA(${m.join()}),
                                          vec2(${m.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${x.join()}) {
        return getChannel(getA(${m.join()}),
                               vec2(${m.slice(-2).join()}));
      }
      ${I}
      void main() {
        ${l} coords = getOutputCoords();
        bool hasNextCol = ${u[a-1]} < ${c[a-1]-1};
        bool hasNextRow = ${u[a-2]} < ${c[a-2]-1};
        ${p}
        ivec4 srcIdx = ivec4(sourceLocR${f}, sourceLocG${f},
          sourceLocB${f}, sourceLocA${f}) * ${t};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${E};

        for (int i = 0; i < ${t}; i++) {
          inIdx = srcIdx;
          ${S}
          vec4 candidate = ${E};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${b}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}};function ha(o,e,t,r=null){let n=e.shape[0],s=e.shape[1];r!=null&&(n=r.shape[0],s=r.shape[1]);let i=So.computeOptimalWindowSize(s),c={windowSize:i,inSize:s,batchSize:n,outSize:Math.ceil(s/i)},a=new vo(c,t,r==null),l=[e];r!=null&&l.push(r);let u=o.runWebGLProgram(a,l,"int32");if(u.shape[1]===1)return u;let p=ha(o,e,t,u);return o.disposeIntermediateTensorInfo(u),p}function xa(o,e,t,r=null){let n=r!=null?r.shape:e.shape,s=n[n.length-1],i=So.computeOptimalWindowSize(s),c=new $o(n,i,t,r==null),a=r==null?[e]:[e,r],l=o.runWebGLProgram(c,a,"int32");if(l.shape.length===e.shape.length){let u=xa(o,e,t,l);return o.disposeIntermediateTensorInfo(l),u}return l}function yo(o,e,t,r){let n=[t];if(So.assertAxesAreInnerMostDims("arg"+r.charAt(0).toUpperCase()+r.slice(1),n,e.shape.length),!ym().getBool("WEBGL_PACK_REDUCE")||e.shape.length<=2){let s=[],i=o.texData.get(e.dataId),c=i!==null&&i.isPacked,a=e;c&&(a=o.unpackTensor(e),s.push(a));let[l,u]=So.computeOutAndReduceShapes(a.shape,n),p=Rm.sizeFromShape(u),d=$({inputs:{x:a},backend:o,attrs:{shape:[-1,p]}});s.push(d);let m=ha(o,d,r);s.push(m);let f=$({inputs:{x:m},backend:o,attrs:{shape:l}});return s.forEach(x=>o.disposeIntermediateTensorInfo(x)),f}return xa(o,e,r)}function Im(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s}=r,i=wm.parseAxisParam(s,n.shape),c=Vn.getAxesPermutation(i,n.shape.length),a=n,l=[];c!=null&&(a=P({inputs:{x:n},backend:t,attrs:{perm:c}}),l.push(a),i=Vn.getInnerMostAxes(i.length,a.shape.length)),Vn.assertAxesAreInnerMostDims("argMax",[i[0]],a.shape.length);let u=yo(t,a,i[0],"max");return l.forEach(p=>t.disposeIntermediateTensorInfo(p)),u}var ga={kernelName:Tm,backendName:"webgl",kernelFunc:Im};import{ArgMin as Nm,backend_util as Wn,util as Em}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function km(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s}=r,i=Em.parseAxisParam(s,n.shape),c=Wn.getAxesPermutation(i,n.shape.length),a=n,l=[];c!=null&&(a=P({inputs:{x:n},backend:t,attrs:{perm:c}}),l.push(a),i=Wn.getInnerMostAxes(i.length,a.shape.length)),Wn.assertAxesAreInnerMostDims("argMin",[i[0]],a.shape.length);let u=yo(t,a,i[0],"min");return l.forEach(p=>t.disposeIntermediateTensorInfo(p)),u}var Ca={kernelName:Nm,backendName:"webgl",kernelFunc:km};import{Asin as _m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Am=W+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,Fm=R({opSnippet:Am}),ba={kernelName:_m,backendName:"webgl",kernelFunc:Fm};import{Asinh as Dm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Pm=W+"return log(x + sqrt(x * x + 1.0));",Om=R({opSnippet:Pm}),va={kernelName:Dm,backendName:"webgl",kernelFunc:Om};import{Atan as Lm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bm=W+`
  return atan(x);
`,Um=R({opSnippet:Bm}),$a={kernelName:Lm,backendName:"webgl",kernelFunc:Um};import{Atan2 as Vm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Wm=rt+`
  return atan(a, b);
`,Mm=`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,Gm=A({opSnippet:Wm,packedOpSnippet:Mm}),Sa={kernelName:Vm,backendName:"webgl",kernelFunc:Gm};import{Atanh as zm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Hm=W+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,Xm=R({opSnippet:Hm}),ya={kernelName:zm,backendName:"webgl",kernelFunc:Xm};import{AvgPool as Km,backend_util as Ra,util as Ta}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ue=class{constructor(e,t,r,n=!1,s=!1){if(this.variableNames=["x"],t==="avg"&&r)throw new Error("Cannot compute positions for average pool.");let i=e.filterWidth,c=e.strideHeight,a=e.strideWidth,l=e.dilationHeight,u=e.dilationWidth,p=e.effectiveFilterHeight,d=e.effectiveFilterWidth,m=e.padInfo.top,f=e.padInfo.left;this.outputShape=e.outShape;let x=t==="avg",g=`((batch  * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + d`,h=`(xR * ${e.inWidth} + xC) * ${e.inChannels} + d`,C="0.0";if(x||(C="-1.0 / 1e-20"),r){let T=">=";this.userCode=`
        const ivec2 strides = ivec2(${c}, ${a});
        const ivec2 pads = ivec2(${m}, ${f});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${p};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${d};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value ${T} currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${n?s?g:h:`wR * ${d} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let v="max",b=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(b="avgValue / max(count, 1.0)");let S=Math.floor(i/4)*4,E=i%4,I=`
      if (${x}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${v}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${c}, ${a});
      const ivec2 pads = ivec2(${m}, ${f});
      const float initializationValue = ${C};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${C});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${p};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${S}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${I}
          }

          int xC = xCCorner + ${S};
          if (${E===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${I}
          } else if (${E===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${I}
          } else if (${E===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${I}
          }
        }
        setOutput(${b});
      }
    `}},Ee=class{constructor(e,t,r,n=!1,s=!1){if(this.variableNames=["x"],t==="avg"&&r)throw new Error("Cannot compute positions for average pool.");let i=e.filterWidth,c=e.strideDepth,a=e.strideHeight,l=e.strideWidth,u=e.dilationDepth,p=e.dilationHeight,d=e.dilationWidth,m=e.effectiveFilterDepth,f=e.effectiveFilterHeight,x=e.effectiveFilterWidth,g=e.padInfo.front,h=e.padInfo.top,C=e.padInfo.left;this.outputShape=e.outShape;let v=t==="avg",b="0.0";if(v||(b="-1.0 / 1e-20"),r){let k=">=";this.userCode=`
        const ivec3 strides =
            ivec3(${c}, ${a}, ${l});
        const ivec3 pads = ivec3(${g}, ${h}, ${C});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${m};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${e.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${f};
                wR += ${p}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${x};
                  wC += ${d}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value ${k} currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${n?s?`(((batch * ${e.inDepth} + xD) * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`((xD * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`wD * ${f} * ${x} +
                      wR * ${x} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let S="max",E=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(E="avgValue / max(count, 1.0)");let I=Math.floor(i/4)*4,T=i%4,_=`
      if (${v}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${S}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${c}, ${a}, ${l});
      const ivec3 pads = ivec3(${g}, ${h}, ${C});
      const float initializationValue = ${b};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${b});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${m};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${f};
            wR += ${p}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${I}; wC += 4) {
              int xC = xCCorner + wC * ${d};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                getValue(batch, xD, xR, xC + 3 * ${d}, ch)
              );

              ${_}
            }

            int xC = xCCorner + ${I};
            if (${T===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${_}
            } else if (${T===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                initializationValue,
                initializationValue
              );

              ${_}
            } else if (${T===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                initializationValue
              );

              ${_}
            }
          }
        }
        setOutput(${E});
      }
    `}};function qm(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e;ce(n,"avgPool");let{filterSize:s,strides:i,pad:c,dimRoundingMode:a}=r,l=1;Ta.assert(Ra.eitherStridesOrDilationsAreOne(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let u=Ra.computePool2DInfo(n.shape,s,i,l,c,a);if(u.filterWidth===1&&u.filterHeight===1&&Ta.arraysEqual(u.inShape,u.outShape))return B({inputs:{x:n},backend:t});let p=new ue(u,"avg",!1);return t.runWebGLProgram(p,[n],"float32")}var wa={kernelName:Km,backendName:"webgl",kernelFunc:qm};import{AvgPool3D as jm,backend_util as Ym}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Qm(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{filterSize:s,strides:i,pad:c,dimRoundingMode:a,dataFormat:l}=r,u=[1,1,1],p=Ym.computePool3DInfo(n.shape,s,i,u,c,a,l),d=new Ee(p,"avg",!1);return t.runWebGLProgram(d,[n],"float32")}var Ia={kernelName:jm,backendName:"webgl",kernelFunc:Qm};import{AvgPool3DGrad as Zm,backend_util as Jm}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ro=class{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;let t=e.filterHeight,r=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=e.dilationHeight,c=e.dilationWidth,a=e.effectiveFilterHeight,l=e.effectiveFilterWidth,u=a-1-e.padInfo.top,p=l-1-e.padInfo.left,d=1/(t*r);this.userCode=`
      const ivec2 pads = ivec2(${u}, ${p});
      const float avgMultiplier = float(${d});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${a};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${c}) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}},To=class{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;let t=e.filterDepth,r=e.filterHeight,n=e.filterWidth,s=e.strideDepth,i=e.strideHeight,c=e.strideWidth,a=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,p=e.effectiveFilterDepth,d=e.effectiveFilterHeight,m=e.effectiveFilterWidth,f=p-1-e.padInfo.front,x=d-1-e.padInfo.top,g=m-1-e.padInfo.left,h=1/(t*r*n);this.userCode=`
      const ivec3 pads = ivec3(${f}, ${x}, ${g});
      const float avgMultiplier = float(${h});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${p};
            wD += ${a}) {
          float dyD = float(dyDCorner + wD) / ${s}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${d};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${m};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${c}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function ef(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,input:s}=e,i=s,{filterSize:c,strides:a,pad:l,dimRoundingMode:u}=r,p=[1,1,1],d=Jm.computePool3DInfo(i.shape,c,a,p,l,u),m=new To(d);return t.runWebGLProgram(m,[n],i.dtype)}var Na={kernelName:Zm,backendName:"webgl",kernelFunc:ef};import{AvgPoolGrad as tf,backend_util as of}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function rf(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,input:s}=e,i=s;ce([n,s],"avgPoolGrad");let{filterSize:c,strides:a,pad:l}=r,u=of.computePool2DInfo(i.shape,c,a,1,l),p=new Ro(u);return t.runWebGLProgram(p,[n],i.dtype)}var Ea={kernelName:tf,backendName:"webgl",kernelFunc:rf};import{BatchMatMul as nf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function sf(o){let{inputs:e,backend:t,attrs:r}=o,{a:n,b:s}=e,{transposeA:i,transposeB:c}=r;return Be({a:n,b:s,transposeA:i,transposeB:c,backend:t})}var ka={kernelName:nf,backendName:"webgl",kernelFunc:sf};import{env as af,FusedBatchNorm as cf,util as Mn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as wo}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Io=class{constructor(e,t,r,n,s,i){this.outputShape=[],this.variableNames=["x","mean","variance"],wo.assertAndGetBroadcastShape(e,t),wo.assertAndGetBroadcastShape(e,r);let c="0.0";n!=null&&(wo.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),c="getOffsetAtOutCoords()");let a="1.0";s!=null&&(wo.assertAndGetBroadcastShape(e,s),this.variableNames.push("scale"),a="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${c};
        float scale = ${a};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}};import{backend_util as No}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Eo=class{constructor(e,t,r,n,s,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],No.assertAndGetBroadcastShape(e,t),No.assertAndGetBroadcastShape(e,r);let c="vec4(0.0)";n!=null&&(No.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),c="getOffsetAtOutCoords()");let a="vec4(1.0)";s!=null&&(No.assertAndGetBroadcastShape(e,s),this.variableNames.push("scale"),a="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${c};
        vec4 scale = ${a};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `}};var lf=({inputs:o,backend:e,attrs:t})=>{let{x:r,mean:n,variance:s,offset:i,scale:c}=o;Mn.assert(n.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),Mn.assert(i==null||n.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),Mn.assert(c==null||n.shape.length===c.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:a}=t;a==null&&(a=.001);let l=[r,n,s],u=null;i!=null&&(u=i.shape,l.push(i));let p=null;c!=null&&(p=c.shape,l.push(c));let d=af().getBool("WEBGL_PACK_NORMALIZATION")?new Eo(r.shape,n.shape,s.shape,u,p,a):new Io(r.shape,n.shape,s.shape,u,p,a);return e.runWebGLProgram(d,l,l[0].dtype)},_a={kernelName:cf,backendName:"webgl",kernelFunc:lf};import{backend_util as Tt,BatchToSpaceND as ff,util as hf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as pf,Slice as df,slice_util as Ao,util as Aa}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ko=class{constructor(e){this.variableNames=["source"],this.outputShape=e,this.rank=e.length;let t=N(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let r=uf(this.rank),n,s=e.map((i,c)=>`sourceLoc.${Gn[c]} = start[${c}] + coords.${Gn[c]};`);n=`
        ${t} sourceLoc;
        ${t} coords = getOutputCoords();
        ${s.join(`
`)}
      `,this.userCode=`
      void main() {
        ${n}
        setOutput(getSource(${r}));
      }
    `}},Gn=["x","y","z","w","u","v"];function uf(o){if(o===1)return"sourceLoc";if(o<=6)return Gn.slice(0,o).map(e=>"sourceLoc."+e).join(",");throw Error(`Slicing for rank ${o} is not yet supported`)}var _o=class{constructor(e){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let t=N(this.rank),r=L("coords",this.rank),n=L("sourceLoc",this.rank),s=this.rank===1?"sourceLoc":`vec2(${n.slice(-2).join()})`,i=`getChannel(getSource(${n.join()}), ${s})`,c=`
      result.x = ${i};
      if (++${r[this.rank-1]} < ${e[this.rank-1]}) {
        ++${n[this.rank-1]};
        result.y = ${i};
        --${n[this.rank-1]};
      }
    `,a=this.rank===1?"":`
      --${r[this.rank-1]};
      if (++${r[this.rank-2]} < ${e[this.rank-2]}) {
        ++${n[this.rank-2]};
        result.z = ${i};
        if (++${r[this.rank-1]} < ${e[this.rank-1]}) {
          ++${n[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${t}(${e.map((u,p)=>`start[${p}]`).join()});`:e.map((u,p)=>`${n[p]} = ${r[p]} + start[${p}];`).join(`
`);this.userCode=`
      void main() {
        ${t} coords = getOutputCoords();
        ${t} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${c}
        ${a}
        setOutput(result);
      }
    `}};function mf(o,e,t,r){let n=r.texData.get(o.dataId),s=r.makeTensorInfo(t,o.dtype),i=r.texData.get(s.dataId);Object.assign(i,n),i.refCount=1,i.shape=t,i.dtype=o.dtype;let c=Ao.computeFlatOffset(e,Aa.computeStrides(o.shape));n.slice&&(c+=n.slice.flatOffset),i.slice={flatOffset:c,origDataId:n.slice&&n.slice.origDataId||o.dataId};let a=r.dataRefCount.get(i.slice.origDataId)||1;return r.dataRefCount.set(i.slice.origDataId,a+1),s}function pe(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{begin:s,size:i}=r,[c,a]=Ao.parseSliceParams(n,s,i);if(Ao.assertParamsValid(n,c,a),Aa.sizeFromShape(a)===0)return t.makeTensorInfo(a,n.dtype,[]);if(t.shouldExecuteOnCPU([n])||n.dtype==="string"){let p=t.texData.get(n.dataId),d=pi(p.values,c,a,n.shape,n.dtype);return t.makeTensorInfo(a,n.dtype,d)}let{isPacked:l}=t.texData.get(n.dataId),u=Ao.isSliceContinous(n.shape,c,a);if(l||!u){let p=pf().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new _o(a):new ko(a),d=[c];return t.runWebGLProgram(p,[n],n.dtype,d)}return t.uploadToGPU(n.dataId),mf(n,c,a,t)}var Fa={kernelName:df,backendName:"webgl",kernelFunc:pe};var xf=o=>{let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{blockShape:s,crops:i}=r;hf.assert(n.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let c=s.reduce((C,v)=>C*v),a=Tt.getReshaped(n.shape,s,c),l=Tt.getPermuted(a.length,s.length),u=Tt.getReshapedPermuted(n.shape,s,c),p=Tt.getSliceBeginCoords(i,s.length),d=Tt.getSliceSize(u,i,s.length),m=[],f=$({inputs:{x:n},backend:t,attrs:{shape:a}}),x=P({inputs:{x:f},backend:t,attrs:{perm:l}}),g=$({inputs:{x},backend:t,attrs:{shape:u}}),h=pe({inputs:{x:g},backend:t,attrs:{begin:p,size:d}});return m.push(f),m.push(x),m.push(g),m.forEach(C=>t.disposeIntermediateTensorInfo(C)),h},Da={kernelName:ff,backendName:"webgl",kernelFunc:xf};import{Bincount as gf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Cf(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,weights:s}=e,{size:i}=r,c=t.readSync(n.dataId),a=t.readSync(s.dataId),l=no(c,a,s.dtype,s.shape,i);return t.makeTensorInfo([i],s.dtype,l)}var Pa={kernelName:gf,backendName:"webgl",kernelFunc:Cf};import{BitwiseAnd as bf,env as Oa}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vf=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,$f=`
  return float(int(a.r) & int(b.r));
`;function Sf(o){let{inputs:e,backend:t}=o,{a:r,b:n}=e,s=Oa().getBool("WEBGL_PACK_BINARY_OPERATIONS"),i=Oa().getNumber("WEBGL_VERSION");if(t.shouldExecuteOnCPU([r,n])||i===1){let a=t.texData.get(r.dataId).values,l=t.texData.get(n.dataId).values,[u,p]=Ps(r.shape,n.shape,a,l,r.dtype),d=t.makeTensorInfo(p,r.dtype),m=t.texData.get(d.dataId);return m.values=u,d}let c;return s?c=new te(vf,r.shape,n.shape,!1):c=new Y($f,r.shape,n.shape),t.runWebGLProgram(c,[r,n],r.dtype)}var La={kernelName:bf,backendName:"webgl",kernelFunc:Sf};import{backend_util as yf,BroadcastArgs as Rf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Tf(o){let{inputs:e,backend:t}=o,{s0:r,s1:n}=e,s=t.readSync(r.dataId),i=t.readSync(n.dataId),c=yf.assertAndGetBroadcastShape(Array.from(s),Array.from(i));return t.makeTensorInfo([c.length],"int32",Int32Array.from(c))}var Ba={kernelName:Rf,backendName:"webgl",kernelFunc:Tf};import*as Ga from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Cast as kf,util as Ma}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{NotEqual as wf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var If="return float(a != b);",zn=A({opSnippet:If,cpuKernelImpl:oi,dtype:"bool"}),Ua={kernelName:wf,backendName:"webgl",kernelFunc:zn};import{Real as Nf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function $e(o){let{inputs:e,backend:t}=o,{input:r}=e,n=t.texData.get(r.dataId);return B({inputs:{x:n.complexTensorInfos.real},backend:t})}var Va={kernelName:Nf,backendName:"webgl",kernelFunc:$e};var Ef="return float(int(x));";function Wa(o,e){let t=new z(o.shape,Ef),r=e.runWebGLProgram(t,[o],"int32");return{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}function Hn(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{dtype:s}=r;if(s==="complex64"){if(n.dtype==="complex64")return B({inputs:{x:n},backend:t});let i=Ga.zeros(n.shape),c=Hn({inputs:{x:n},backend:t,attrs:{dtype:"float32"}}),a=Q({inputs:{real:c,imag:i},backend:t});return i.dispose(),t.disposeIntermediateTensorInfo(c),a}if(n.dtype==="complex64"){let i=$e({inputs:{input:n},backend:t}),c=Hn({inputs:{x:i},backend:t,attrs:{dtype:s}});return t.disposeIntermediateTensorInfo(i),c}if(!Ma.hasEncodingLoss(n.dtype,s)){let i=B({inputs:{x:n},backend:t});return{dataId:i.dataId,shape:i.shape,dtype:s}}if(t.shouldExecuteOnCPU([n])){let i=t.texData.get(n.dataId).values,[c,a,l]=Os(i,n.shape,n.dtype,s);return t.makeTensorInfo(c,a,l)}if(s==="int32")return Wa(n,t);if(s==="bool"){let i=t.makeTensorInfo([],"bool",Ma.getTypedArrayFromDType("bool",1)),a=zn({inputs:{a:n,b:i},backend:t});return t.disposeIntermediateTensorInfo(i),a}throw new Error(`Error in Cast: failed to cast ${n.dtype} to ${s}`)}var za={kernelName:kf,backendName:"webgl",kernelFunc:Hn};import{Ceil as _f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ha="return ceil(x);",Af=R({opSnippet:Ha,packedOpSnippet:Ha,cpuKernelImpl:Ls}),Xa={kernelName:_f,backendName:"webgl",kernelFunc:Af};import{ClipByValue as Ff,env as Df}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Fo=class{constructor(e){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}};var Do=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}};function Pf(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{clipValueMin:s,clipValueMax:i}=r,c;Df().getBool("WEBGL_PACK_CLIP")?c=new Do(n.shape):c=new Fo(n.shape);let a=[[s],[i]];return t.runWebGLProgram(c,[n],n.dtype,a)}var Ka={kernelName:Ff,backendName:"webgl",kernelFunc:Pf};import{ComplexAbs as Of}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Po=class{constructor(e){this.variableNames=["real","imag"],this.outputShape=e,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}};function qa(o,e){return{dataId:e.dataId,dtype:e.dtype,shape:o.shape}}function Lf(o){let{inputs:e,backend:t}=o,{x:r}=e,n=t.texData.get(r.dataId),s=new Po(r.shape),i=[qa(r,n.complexTensorInfos.real),qa(r,n.complexTensorInfos.imag)];return t.runWebGLProgram(s,i,i[0].dtype)}var ja={kernelName:Of,backendName:"webgl",kernelFunc:Lf};import{backend_util as Za,Concat as Mf,util as qn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Xn,env as Qa,util as Kn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Bf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Oo=class{constructor(e){this.outputShape=[],this.outputShape=Bf.computeOutShape(e,1),this.variableNames=e.map((i,c)=>`T${c}`);let t=new Array(e.length-1);t[0]=e[0][1];for(let i=1;i<t.length;i++)t[i]=t[i-1]+e[i][1];let r=[`if (yC < ${t[0]}) setOutput(getT0(yR, yC));`];for(let i=1;i<t.length;i++){let c=t[i-1];r.push(`else if (yC < ${t[i]}) setOutput(getT${i}(yR, yC-${c}));`)}let n=t.length,s=t[t.length-1];r.push(`else setOutput(getT${n}(yR, yC-${s}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${r.join(`
        `)}
      }
    `}};import{backend_util as Uf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bo=class{constructor(e,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=Uf.computeOutShape(e,t);let r=this.outputShape,n=r.length,s=N(n),i=L("coords",n),c=["x","y","z","w","u","v"].slice(0,n);this.variableNames=e.map((x,g)=>`T${g}`);let a=new Array(e.length-1);a[0]=e[0][t];for(let x=1;x<a.length;x++)a[x]=a[x-1]+e[x][t];let l=c[t],u=c.slice(-2),p=c.join(),d=`if (${l} < ${a[0]}) {
        return getChannel(
            getT0(${p}), vec2(${u.join()}));
        }`;for(let x=1;x<a.length;x++){let g=a[x-1];d+=`
        if (${l} < ${a[x]}  && ${l} >= ${a[x-1]}) {
          return getChannel(
            getT${x}(${Lo(c,l,g)}),
            vec2(${Lo(u,l,g)}));
        }`}let m=a.length,f=a[a.length-1];d+=`
        return getChannel(
          getT${m}(${Lo(c,l,f)}),
          vec2(${Lo(u,l,f)}));`,this.userCode=`
      float getValue(${c.map(x=>"int "+x)}) {
        ${d}
      }

      void main() {
        ${s} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[n-1]} = ${i[n-1]} + 1;
        if (${i[n-1]} < ${r[n-1]}) {
          result.g = getValue(${i});
        }

        ${i[n-2]} = ${i[n-2]} + 1;
        if (${i[n-2]} < ${r[n-2]}) {
          result.a = getValue(${i});
        }

        ${i[n-1]} = ${i[n-1]} - 1;
        if (${i[n-2]} < ${r[n-2]} &&
            ${i[n-1]} < ${r[n-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `}};function Lo(o,e,t){let r=o.indexOf(e);return o.map((s,i)=>i===r?`${s} - ${t}`:s).join()}import{Imag as Vf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ue(o){let{inputs:e,backend:t}=o,{input:r}=e,n=t.texData.get(r.dataId);return B({inputs:{x:n.complexTensorInfos.imag},backend:t})}var Ya={kernelName:Vf,backendName:"webgl",kernelFunc:Ue};function st(o,e,t){let r=o[0].dtype;if(r==="complex64"){let m=o.map(C=>$e({inputs:{input:C},backend:t})),f=o.map(C=>Ue({inputs:{input:C},backend:t})),x=st(m,e,t),g=st(f,e,t),h=Q({inputs:{real:x,imag:g},backend:t});return m.forEach(C=>t.disposeIntermediateTensorInfo(C)),f.forEach(C=>t.disposeIntermediateTensorInfo(C)),t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),h}let n=t.shouldExecuteOnCPU(o);if(r==="string"&&(n=!0),n){let m=o.map(b=>{let E=[-1,Kn.sizeFromShape(b.shape.slice(e))];return $({inputs:{x:b},backend:t,attrs:{shape:E}})}),f=m.map(b=>({vals:t.readSync(b.dataId),shape:b.shape})),x=Xn.computeOutShape(m.map(b=>b.shape),1),g=m[0].shape[0]===1,h=Bs(f,x,r,g),C=Xn.computeOutShape(o.map(b=>b.shape),e),v=t.makeTensorInfo(C,r,h);return m.forEach(b=>t.disposeIntermediateTensorInfo(b)),v}let s=o.filter(m=>Kn.sizeFromShape(m.shape)>0),i=Qa().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&s[0].shape.length>1;if(s.length===1){let m=i?new z(o[0].shape,he):new j(o[0].shape,he);return t.runWebGLProgram(m,o,r)}let c=Qa().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(s.length>c){let m=[];for(let x=0;x<s.length;x+=c){let g=s.slice(x,x+c);m.push(st(g,e,t))}let f=st(m,e,t);for(let x of m)t.disposeIntermediateTensorInfo(x);return f}if(i){let m=new Bo(s.map(f=>f.shape),e);return t.runWebGLProgram(m,s,r)}let{tensors2D:a,outShape:l}=Wf(s,e,t),u=new Oo(a.map(m=>m.shape)),p=t.runWebGLProgram(u,a,r);a.forEach(m=>t.disposeIntermediateTensorInfo(m));let d=$({inputs:{x:p},attrs:{shape:l},backend:t});return t.disposeIntermediateTensorInfo(p),d}function Wf(o,e,t){let r=Xn.computeOutShape(o.map(s=>s.shape),e);return{tensors2D:o.map(s=>$({inputs:{x:s},attrs:{shape:[-1,Kn.sizeFromShape(s.shape.slice(e))]},backend:t})),outShape:r}}function jn(o){let{inputs:e,backend:t,attrs:r}=o,{axis:n}=r,s=qn.parseAxisParam(n,e[0].shape)[0],i=e.map(l=>l.shape);Za.assertParamsConsistent(i,s);let c=Za.computeOutShape(e.map(l=>l.shape),s);if(qn.sizeFromShape(c)===0)return t.makeTensorInfo(c,e[0].dtype,[]);let a=e.filter(l=>qn.sizeFromShape(l.shape)>0);return a.length===1?B({inputs:{x:a[0]},backend:t}):st(a,s,t)}var Ja={kernelName:Mf,backendName:"webgl",kernelFunc:jn};import{backend_util as ec,Conv2D as zf,env as tc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var it=class{constructor(e,t=!1,r=null,n=!1,s=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;let i=e.padInfo.top,c=e.padInfo.left,a=e.strideHeight,l=e.strideWidth,u=e.dilationHeight,p=e.dilationWidth,d=e.filterHeight,m=e.filterWidth,f=Math.floor(e.inChannels/4)*4,x=e.inChannels%4,g=e.dataFormat==="channelsLast",h=g?1:2,C=g?2:3,v=g?3:1,b="",S="";r&&(n?b=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?b=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:b=`
          float activation(float x) {
            ${r}
          }
        `,S="result = activation(result);");let E=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${b}

      const ivec2 strides = ivec2(${a}, ${l});
      const ivec2 pads = ivec2(${i}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${v}];

        ivec2 xRCCorner =
            ivec2(coords[${h}], coords[${C}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${d}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${m}; wC++) {
            int xC = xCCorner + wC * ${p};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${f}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${g}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${x===1}) {

              if (${g}) {
                dotProd +=
                    getX(batch, xR, xC, ${f}) *
                    getW(wR, wC, ${f}, d2);
              } else {
                dotProd +=
                    getX(batch, ${f}, xR, xC) *
                    getW(wR, wC, ${f}, d2);
              }

            } else if (${x===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2)
              );

              if (${g}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${x===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2),
                getW(wR, wC, ${f} + 2, d2)
              );

              if (${g}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1),
                  getX(batch, xR, xC, ${f} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC),
                  getX(batch, ${f} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${E}
        ${S}
        setOutput(result);
      }
    `}},Uo=class{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;let t=e.padInfo.front,r=e.padInfo.top,n=e.padInfo.left,s=e.strideDepth,i=e.strideHeight,c=e.strideWidth,a=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,p=e.filterDepth,d=e.filterHeight,m=e.filterWidth,f=Math.floor(e.inChannels/4)*4,x=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${s}, ${i}, ${c});
      const ivec3 pads = ivec3(${t}, ${r}, ${n});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${p}; wF++) {
          int xF = xFCorner + wF * ${a};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${d}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${m}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${f}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${x===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${f}) *
                  getW(wF, wR, wC, ${f}, d2);
              } else if (${x===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${x===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1),
                  getX(batch, xF, xR, xC, ${f} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2),
                  getW(wF, wR, wC, ${f} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}};import{util as Gf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var at=class{constructor(e,t=!1,r=null,n=!1,s=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=D(this.outputShape.length);let i=e.padInfo.left,c=e.strideWidth,a=e.dilationWidth,l=e.filterHeight,u=e.filterWidth,p=u,d=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let g=0;g<u;g++)d+=`
           vec4 xTexelC${g*2};
           int xTexelC${g*2}Ready;
           vec4 xTexelC${g*2+1};
           int xTexelC${g*2+1}Ready;
           vec4 xC${g};`;d+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${e.inChannels}; d1 += 2) {
       `;for(let g=0;g<u;g++)d+=`
           xTexelC${g*2} = vec4(0.0);
           xTexelC${g*2}Ready = 0;
           xTexelC${g*2+1} = vec4(0.0);
           xTexelC${g*2+1}Ready = 0;
           xC${g} = vec4(0.0);`;d+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let g=0;g<(p+1)/2;g++){let h=g*2;if(d+=`
           xC = xCCorner + ${h*a};
           `,c===1){if(h<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${h}Ready == 0) {
                   xTexelC${h} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${h}.zw = vec2(0.0);
                   }
                   xTexelC${h}Ready = 1;
                 }
               `,a===1&&h>0?d+=`
                 xC${h} = vec4(xTexelC${h-2}.zw, xTexelC${h}.xy);
                 `:d+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${h} = vec4(previous.zw, xTexelC${h}.xy);
                   } else {
                     xC${h} = vec4(0.0, 0.0, xTexelC${h}.xy);
                   }
                   `):d+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${h}Ready == 0) {
                   xTexelC${h} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${h}.zw = vec2(0.0);
                   }
                   xTexelC${h}Ready = 1;
                 }

                 xC${h} = xTexelC${h};
                 `,h+1<u)){let C=i%2===0?Gf.nearestLargerEven(a):a;a%2===0&&i%2===1||a%2!==0&&i%2!==1?(d+=`
                   xCOffset = xC + imod(pads[1], 2) + ${C};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${h+1}Ready == 0) {
                     xTexelC${h+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${h+1}.zw = vec2(0.0);
                     }
                     xTexelC${h+1}Ready = 1;
                   }
                   `,a>1?d+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${h+1} = vec4(previous.zw, xTexelC${h+1}.xy);
                     } else {
                      xC${h+1} = vec4(0.0, 0.0, xTexelC${h+1}.xy);
                     }
                     `:d+=`
                     xC${h+1} = vec4(xTexelC${h}.zw, xTexelC${h+1}.xy);
                     `):C===1?d+=`
                     xC${h+1} = xTexelC${h};
                     `:d+=`
                     xCOffset = xC + ${C};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${h+1}Ready == 0) {
                       xTexelC${h+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${h+1}.zw = vec2(0.0);
                       }
                       xTexelC${h+1}Ready = 1;
                     }

                     xC${h+1} = xTexelC${h+1};
                     `}}else h<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${h}Ready == 0) {
                   xTexelC${h} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${h}.zw = vec2(0.0);
                   }
                   xTexelC${h}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${h+1}Ready == 0) {
                   xTexelC${h+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${h+1}.zw = vec2(0.0);
                   }
                   xTexelC${h+1}Ready = 1;
                 }

                 xC${h} = vec4(xTexelC${h}.zw, xTexelC${h+1}.zw);
               `,h+1<u&&(d+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${h+1} = vec4(xTexelC${h+1}.xy, final.xy);
                 `)):(d+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${h}Ready == 0) {
                   xTexelC${h} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${h}.zw = vec2(0.0);
                   }
                   xTexelC${h}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${h+1}Ready == 0) {
                   xTexelC${h+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${h+1}.zw = vec2(0.);
                   }
                   xTexelC${h+1}Ready = 1;
                 }

                 xC${h} = vec4(
                   xTexelC${h}.xy, xTexelC${h+1}.xy);
               `,h+1<u&&(d+=`
                   xC${h+1} = vec4(xTexelC${h}.zw, xTexelC${h+1}.zw);
                 `)));h<u&&(d+=`
             wTexel = getW(r, ${h}, d1, d2);
             dotProd += xC${h}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${e.inChannels}) {
               dotProd += xC${h}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,h+1<u&&(d+=`
               wTexel = getW(r, ${h+1}, d1, d2);
               dotProd += xC${h+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${e.inChannels}) {
                 dotProd += xC${h+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}d+=`
     }
   `,d+=`
     }
   `,d+=`
     }
   `;let m="",f="";r&&(n?m=`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${r}
         }`:s?m=`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${r}
         }`:m=`vec4 activation(vec4 x) {
           ${r}
         }`,f="result = activation(result);");let x=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${m}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${d}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${x}
         ${f}
         setOutput(result);
       }
     `}};import{util as wt}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Vo=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=e,this.enableShapeUniforms=D(this.outputShape.length);let{dataFormat:r}=t,n=O(),s=r==="channelsLast",i=s?1:2,c=s?2:3,a=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${e[2]} && pos < ${e[1]}) {`,l="";for(let u=0;u<=1;u++)for(let p=0;p<=1;p++)l+=`
          blockIndex = rc.z + ${p};
          pos = rc.y + ${u};

          ${a}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${c}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${s}) {
                  innerDims = vec2(d1, ch);
                  result[${u*2+p}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${u*2+p}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${n.output} = result;
      }
    `}};function Wo(o,e){let t=o.length;return t>=3?e?[...o.slice(0,-3),o[t-3]*o[t-2],o[t-1]]:[...o.slice(0,-3),o[t-3],o[t-2]*o[t-1]]:!e&&t===1&&o[0]>1?[o[0],1]:null}function Mo({x:o,filter:e,convInfo:t,backend:r,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:c=null}){let a=o.shape,l=r.texData.get(o.dataId),u=t.inChannels,p=a[0]*a[1]*a[2],d=t.outChannels,m=t.dataFormat==="channelsLast",f=!1,x=!1,g,h=[];if(s!=null){let b=Wo(s.shape,m);b!=null&&(s=$({inputs:{x:s},backend:r,attrs:{shape:b}}),h.push(s))}if(n!=null){let b=Wo(n.shape,m);b!=null&&(n=$({inputs:{x:n},backend:r,attrs:{shape:b}}),h.push(n))}if(!((p===1||d===1)&&u>Un)&&l.isPacked&&m&&l.texture!=null&&a[2]%2!==0&&wt.arraysEqual(l.shape.slice(-3),a.slice(-3))){let b=a[0]*a[1]*(a[2]+1),S={dataId:o.dataId,shape:[1,b,t.inChannels],dtype:o.dtype},E=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,wt.assert(Te(l.shape,S.shape),()=>`packed reshape ${l.shape} to ${S.shape} isn't free`);let I=$({inputs:{x:e},backend:r,attrs:{shape:[1,t.inChannels,t.outChannels]}});h.push(I);let T=Be({a:S,b:I,backend:r,transposeA:f,transposeB:x,bias:n,activation:c,preluActivationWeights:s,leakyreluAlpha:i}),_=r.texData.get(T.dataId);wt.assert(_.isPacked,()=>"batchMatMul result is expected to be packed"),l.shape=E,_.shape=t.outShape,g=B({inputs:{x:T},backend:r}),g.shape=t.outShape,h.push(T)}else{let b=t.outHeight*t.outWidth,S=$({inputs:{x:o},backend:r,attrs:{shape:m?[t.batchSize,b,t.inChannels]:[t.batchSize,t.inChannels,b]}}),E=$({inputs:{x:e},backend:r,attrs:{shape:[1,t.inChannels,t.outChannels]}}),I=Be({a:m?S:E,b:m?E:S,transposeA:!m,transposeB:x,backend:r,bias:n,activation:c,preluActivationWeights:s,leakyreluAlpha:i});g=$({inputs:{x:I},backend:r,attrs:{shape:t.outShape}}),h.push(S),h.push(E),h.push(I)}for(let b of h)r.disposeIntermediateTensorInfo(b);return g}function Go({x:o,filter:e,convInfo:t,backend:r,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:c=null}){let{filterWidth:a,filterHeight:l,inChannels:u,outWidth:p,outHeight:d,dataFormat:m}=t,f=m==="channelsLast",x=a*l*u,g=d*p,h=[t.batchSize,x,g],C=!0,v=!1,b=[];if(s!=null){let K=Wo(s.shape,f);K!=null&&(s=$({inputs:{x:s},backend:r,attrs:{shape:K}}),b.push(s))}if(n!=null){let K=Wo(n.shape,f);K!=null&&(n=$({inputs:{x:n},backend:r,attrs:{shape:K}}),b.push(n))}let S=$({inputs:{x:e},backend:r,attrs:{shape:[1,x,wt.sizeFromShape(e.shape)/x]}});b.push(S);let E=new Vo(h,t),I=[o.shape,[t.padInfo.top,t.padInfo.left],[t.strideHeight,t.strideWidth],[t.dilationHeight,t.dilationWidth],[t.inChannels],[t.filterWidth*t.inChannels],[t.outWidth]],T=r.runWebGLProgram(E,[o],"float32",I),_=$({inputs:{x:T},backend:r,attrs:{shape:h}});b.push(T),b.push(_);let k=n!=null,U=s!=null,V=c==="leakyrelu",de=c?ve(c,!0):null,Z=new nt(f?_.shape:S.shape,f?S.shape:_.shape,f?[t.batchSize,g,t.outChannels]:[t.batchSize,t.outChannels,g],C,v,k,de,U,V),ne=f?[_,S]:[S,_];if(n&&ne.push(n),U&&ne.push(s),V){let K=r.makeTensorInfo([],"float32",wt.createScalarValue(i,"float32"));ne.push(K),b.push(K)}let se=r.runWebGLProgram(Z,ne,"float32"),ae=$({inputs:{x:se},backend:r,attrs:{shape:t.outShape}});b.push(se);for(let K of b)r.disposeIntermediateTensorInfo(K);return ae}function Hf(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s}=e,{strides:i,pad:c,dataFormat:a,dilations:l,dimRoundingMode:u}=r,p=ec.convertConv2DDataFormat(a),d=ec.computeConv2DInfo(n.shape,s.shape,i,l,c,u,!1,p),m;if(d.filterHeight===1&&d.filterWidth===1&&d.dilationHeight===1&&d.dilationWidth===1&&d.strideHeight===1&&d.strideWidth===1&&(d.padInfo.type==="SAME"||d.padInfo.type==="VALID"))m=Mo({x:n,filter:s,convInfo:d,backend:t});else if(d.strideWidth<=2&&p==="channelsLast"&&tc().getBool("WEBGL_EXP_CONV")){let x=new at(d),g=[[d.padInfo.top,d.padInfo.left],[d.strideHeight,d.strideWidth],[d.dilationHeight,d.dilationWidth],[d.inHeight,d.inWidth]];m=t.runWebGLProgram(x,[n,s],"float32",g)}else if(tc().getBool("WEBGL_CONV_IM2COL"))m=Go({x:n,filter:s,convInfo:d,backend:t});else{let x=new it(d);m=t.runWebGLProgram(x,[n,s],"float32")}let f=$({inputs:{x:m},backend:t,attrs:{shape:d.outShape}});return t.disposeIntermediateTensorInfo(m),f}var oc={kernelName:zf,backendName:"webgl",kernelFunc:Hf};import{backend_util as rc,Conv2DBackpropFilter as Xf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zo=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideHeight,r=e.strideWidth,n=e.padInfo.top,s=e.padInfo.left,i=e.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${r} - ${s};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              ${i?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `}},Ho=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterHeight,r=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=e.dataFormat==="channelsLast",c=t-1-e.padInfo.top,a=r-1-e.padInfo.left,l=i?1:2,u=i?2:3,p=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(${c}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${p}];

        ivec2 dyCorner = ivec2(coords[${l}], coords[${u}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${r} - 1 - wC;

            for (int d2 = 0; d2 < ${e.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}},Xo=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideDepth,r=e.strideHeight,n=e.strideWidth,s=e.padInfo.front,i=e.padInfo.top,c=e.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yF = 0; yF < ${e.outDepth}; yF++) {
            int xF = wF + yF * ${t} - ${s};

            if (xF < 0 || xF >= ${e.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${e.outHeight}; yR++) {
              int xR = wR + yR * ${r} - ${i};

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${e.outWidth}; yC++) {
                int xC = wC + yC * ${n} - ${c};

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}},Ko=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterDepth,r=e.filterHeight,n=e.filterWidth,s=e.strideDepth,i=e.strideHeight,c=e.strideWidth,a=t-1-e.padInfo.front,l=r-1-e.padInfo.top,u=n-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${a}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${t}; wF++) {
          float dyF = float(dyFCorner + wF) / ${s}.0;

          if (dyF < 0.0 || dyF >= ${e.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${t} - 1 - wF;

          for (int wR = 0; wR < ${r}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${r} - 1 - wR;

            for (int wC = 0; wC < ${n}; wC++) {
              float dyC = float(dyCCorner + wC) / ${c}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${n} - 1 - wC;

              for (int d2 = 0; d2 < ${e.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function Kf(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,dy:s}=e,{strides:i,pad:c,dataFormat:a,dimRoundingMode:l,filterShape:u}=r,p=rc.convertConv2DDataFormat(a),d=rc.computeConv2DInfo(n.shape,u,i,1,c,l,!1,p),m=new zo(d);return t.runWebGLProgram(m,[n,s],"float32")}var nc={kernelName:Xf,backendName:"webgl",kernelFunc:Kf};import{backend_util as sc,Conv2DBackpropInput as qf,env as jf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var qo=class{constructor(e){this.variableNames=["dy","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=e.inShape,this.enableShapeUniforms=D(this.outputShape.length);let t=e.filterHeight,r=e.filterWidth,n=t-1-e.padInfo.top,s=r-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${n}, ${s});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            int wCPerm = ${r} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${e.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${e.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `}};function Yf(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,filter:s}=e,{inputShape:i,strides:c,pad:a,dataFormat:l,dimRoundingMode:u}=r,p=sc.convertConv2DDataFormat(l),d=sc.computeConv2DInfo(i,s.shape,c,1,a,u,!1,p);if(jf().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&p==="channelsLast"){let m=[[d.strideHeight,d.strideWidth]],f=new qo(d);return t.runWebGLProgram(f,[n,s],"float32",m)}else{let m=new Ho(d);return t.runWebGLProgram(m,[n,s],"float32")}}var ic={kernelName:qf,backendName:"webgl",kernelFunc:Yf};import{backend_util as Qf,Conv3D as Zf}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Jf(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s}=e,{strides:i,pad:c,dilations:a}=r,l=Qf.computeConv3DInfo(n.shape,s.shape,i,a,c),u=new Uo(l);return t.runWebGLProgram(u,[n,s],"float32")}var ac={kernelName:Zf,backendName:"webgl",kernelFunc:Jf};import{backend_util as eh,Conv3DBackpropFilterV2 as th}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function oh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,dy:s}=e,{strides:i,pad:c,filterShape:a}=r,l=eh.computeConv3DInfo(n.shape,a,i,1,c),u=new Xo(l);return t.runWebGLProgram(u,[n,s],"float32")}var cc={kernelName:th,backendName:"webgl",kernelFunc:oh};import{backend_util as rh,Conv3DBackpropInputV2 as nh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function sh(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,filter:s}=e,{pad:i,strides:c,inputShape:a}=r,l=rh.computeConv3DInfo(a,s.shape,c,1,i),u=new Ko(l);return t.runWebGLProgram(u,[n,s],"float32")}var lc={kernelName:nh,backendName:"webgl",kernelFunc:sh};import{Cos as ih}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ah=ie+`
  return cos(x);
`,ch=`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${oe}
  return result;
`,lh=R({opSnippet:ah,packedOpSnippet:ch}),uc={kernelName:ih,backendName:"webgl",kernelFunc:lh};import{Cosh as uh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ph=`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`,dh=R({opSnippet:ph}),pc={kernelName:uh,backendName:"webgl",kernelFunc:dh};import{CropAndResize as mh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jo=class{constructor(e,t,r,n,s){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];let[i,c,a,l]=e,[u]=t,[p,d]=r;this.outputShape=[u,p,d,l];let m=n==="bilinear"?1:0,[f,x]=[`${c-1}.0`,`${a-1}.0`],[g,h,C]=p>1?[`${(c-1)/(p-1)}`,"(y2-y1) * height_ratio",`y1*${f} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${f}`],[v,b,S]=d>1?[`${(a-1)/(d-1)}`,"(x2-x1) * width_ratio",`x1*${x} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${x}`];this.userCode=`
      const float height_ratio = float(${g});
      const float width_ratio = float(${v});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${h};
        float width_scale = ${b};

        float in_y = ${C};
        if( in_y < 0.0 || in_y > ${f} ) {
          setOutput(float(${s}));
          return;
        }
        float in_x = ${S};
        if( in_x < 0.0 || in_x > ${x} ) {
          setOutput(float(${s}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${m} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}};var fh=o=>{let{inputs:e,backend:t,attrs:r}=o,{image:n,boxes:s,boxInd:i}=e,{cropSize:c,method:a,extrapolationValue:l}=r,u=new jo(n.shape,s.shape,c,a,l);return t.runWebGLProgram(u,[n,s,i],"float32")},dc={kernelName:mh,backendName:"webgl",kernelFunc:fh};import{Cumprod as hh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ve;(function(o){o.Prod="*",o.Sum="+"})(Ve||(Ve={}));var It=class{constructor(e,t,r,n){this.op=e,this.outputShape=t,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];let s=this.outputShape.length,i=this.op===Ve.Prod?"1.0":"0.0",c=r?i:`getX(${mc(s,"coords",this.op)})`,a=this.outputShape[this.outputShape.length-1],l="",u="";r?(l=n?`end != ${a-1}`:"end != 0",u=n?"end + 1":"end - 1"):(l=n?`end + pow2 < ${a}`:"end >= pow2",u=n?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${N(s)} coords = getOutputCoords();
        int end = ${fc(s,"coords",this.op)};
        float val = ${c};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${fc(s,"coords",this.op)} = idx;
          val ${this.op}= getX(${mc(s,"coords",this.op)});
        }
        setOutput(val);
      }
    `}};function mc(o,e,t){if(o===1)return`${e}`;if(o===2)return`${e}.x, ${e}.y`;if(o===3)return`${e}.x, ${e}.y, ${e}.z`;if(o===4)return`${e}.x, ${e}.y, ${e}.z, ${e}.w`;throw new Error(`Cumulative ${t} for rank ${o} is not yet supported`)}function fc(o,e,t){if(o===1)return`${e}`;if(o===2)return`${e}.y`;if(o===3)return`${e}.z`;if(o===4)return`${e}.w`;throw new Error(`Cumulative ${t} for rank ${o} is not yet supported`)}import{backend_util as Yn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Yo(o,e,t,r,n,s){let i=e.shape.length,c=Yn.getAxesPermutation([r],i),a=e;c!=null&&(a=P({inputs:{x:e},backend:t,attrs:{perm:c}}));let l=Yn.getInnerMostAxes(1,i)[0];if(l!==i-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${e.shape.length-1} but got axis=${r}`);let u=a.shape[l],p=B({inputs:{x:a},backend:t});for(let d=0;d<=Math.ceil(Math.log2(u))-1;d++){let m=new It(o,a.shape,!1,s),f=[[d]],x=p;p=t.runWebGLProgram(m,[p],p.dtype,f),t.disposeIntermediateTensorInfo(x)}if(n){let d=new It(o,a.shape,n,s),m=p;p=t.runWebGLProgram(d,[p],p.dtype),t.disposeIntermediateTensorInfo(m)}if(c!=null){let d=Yn.getUndoAxesPermutation(c),m=P({inputs:{x:p},backend:t,attrs:{perm:d}});return t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(a),m}return p}function xh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,exclusive:i,reverse:c}=r;return Yo(Ve.Prod,n,t,s,i,c)}var hc={kernelName:hh,backendName:"webgl",kernelFunc:xh};import{Cumsum as gh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ch(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,exclusive:i,reverse:c}=r;return Yo(Ve.Sum,n,t,s,i,c)}var xc={kernelName:gh,backendName:"webgl",kernelFunc:Ch};import{DenseBincount as bh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function vh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,weights:s}=e,{size:i,binaryOutput:c}=r;if(n.shape.length===1){let a=t.readSync(n.dataId),l=t.readSync(s.dataId),u=no(a,l,s.dtype,s.shape,i);return t.makeTensorInfo([i],s.dtype,u)}else if(n.shape.length===2){let a=t.bufferSync(n),l=t.bufferSync(s),u=Ds(a,l,i,c);return t.makeTensorInfo(u.shape,s.dtype,u.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${n.shape.length}.`)}var gc={kernelName:bh,backendName:"webgl",kernelFunc:vh};import{DepthToSpace as $h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Qo=class{constructor(e,t,r){this.variableNames=["x"],this.outputShape=[],this.outputShape=e,this.blockSize=t,this.dataFormat=r,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${t};
      int offset_h = imod(h, ${t});
      int in_w = w / ${t};
      int offset_w = imod(w, ${t});
      int offset_d = (offset_h * ${t} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}};function Sh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{blockSize:s,dataFormat:i}=r,c=n.shape[0],a=i==="NHWC"?n.shape[1]:n.shape[2],l=i==="NHWC"?n.shape[2]:n.shape[3],u=i==="NHWC"?n.shape[3]:n.shape[1],p=a*s,d=l*s,m=u/(s*s),f=i==="NHWC"?[c,p,d,m]:[c,m,p,d],x=new Qo(f,s,i);return t.runWebGLProgram(x,[n],n.dtype)}var Cc={kernelName:$h,backendName:"webgl",kernelFunc:Sh};import{backend_util as bc,DepthwiseConv2dNative as Rh,env as Th,util as wh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ct=class{constructor(e,t=!1,r=null,n=!1,s=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=D(this.outputShape.length);let i=e.filterHeight,c=e.filterWidth,a=e.outChannels/e.inChannels,l="",u="";r&&(n?l=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?l=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:l=`
          float activation(float x) {
            ${r}
          }
        `,u="result = activation(result);");let p=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${a};
        int q = d2 - d1 * ${a};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${c}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${p}
        ${u}
        setOutput(result);
      }
    `}};import{util as yh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var lt=class{constructor(e,t=!1,r=null,n=!1,s=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=D(this.outputShape.length);let i=e.outChannels/e.inChannels,c=e.padInfo.left,a=e.strideWidth,l=e.dilationWidth,u=e.filterHeight,p=e.filterWidth,d=p,m=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let h=0;h<p;h++)m+=`
          vec4 xTexelC${h*2};
          int xTexelC${h*2}Ready;
          vec4 xTexelC${h*2+1};
          int xTexelC${h*2+1}Ready;
          vec4 xC${h};`;m+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let h=0;h<p;h++)m+=`
          xTexelC${h*2} = vec4(0.0);
          xTexelC${h*2}Ready = 0;
          xTexelC${h*2+1} = vec4(0.0);
          xTexelC${h*2+1}Ready = 0;
          xC${h} = vec4(0.0);`;m+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let h=0;h<(d+1)/2;h++){let C=h*2;if(m+=`
          xC = xCCorner + ${C*l};
          `,a===1){if(C<p&&(c%2===1?(m+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }
              `,l===1&&C>0?m+=`
                xC${C} = vec4(xTexelC${C-2}.zw, xTexelC${C}.xy);
                `:m+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${C} = vec4(previous.zw, xTexelC${C}.xy);
                  } else {
                    xC${C} = vec4(0.0, 0.0, xTexelC${C}.xy);
                  }
                  `):m+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xC${C} = xTexelC${C};
                `,C+1<p)){let v=c%2===0?yh.nearestLargerEven(l):l;l%2===0&&c%2===1||l%2!==0&&c%2!==1?(m+=`
                  xCOffset = xC + imod(pads[1], 2) + ${v};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                    xTexelC${C+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${C+1}.zw = vec2(0.0);
                    }
                    xTexelC${C+1}Ready = 1;
                  }
                  `,l>1?m+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${C+1} = vec4(previous.zw, xTexelC${C+1}.xy);
                    } else {
                     xC${C+1} = vec4(0.0, 0.0, xTexelC${C+1}.xy);
                    }
                    `:m+=`
                    xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.xy);
                    `):v===1?m+=`
                    xC${C+1} = xTexelC${C};
                    `:m+=`
                    xCOffset = xC + ${v};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                      xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${C+1}.zw = vec2(0.0);
                      }
                      xTexelC${C+1}Ready = 1;
                    }

                    xC${C+1} = xTexelC${C+1};
                    `}}else C<p&&(c%2===1?(m+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.0);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
              `,C+1<p&&(m+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${C+1} = vec4(xTexelC${C+1}.xy, final.xy);
                `)):(m+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(
                  xTexelC${C}.xy, xTexelC${C+1}.xy);
              `,C+1<p&&(m+=`
                  xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
                `)));C<p&&(m+=`
            wTexel = getW(r, ${C}, d1, q);
            dotProd += xC${C} * vec4(wTexel.xz, wTexel.xz);
          `,C+1<p&&(m+=`
              wTexel = getW(r, ${C+1}, d1, q);
              dotProd += xC${C+1} * vec4(wTexel.xz, wTexel.xz);
            `))}m+=`
    }
  `,m+=`
      }
    `;let f="",x="";r&&(n?f=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?f=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:f=`vec4 activation(vec4 x) {
          ${r}
        }`,x="result = activation(result);");let g=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${f}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${m}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${g}
        ${x}
        setOutput(result);
      }
    `}};function Ih(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s}=e,{strides:i,pad:c,dilations:a,dimRoundingMode:l}=r,u=a;u==null&&(u=[1,1]),wh.assert(bc.eitherStridesOrDilationsAreOne(i,u),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${u}'`);let p=bc.computeConv2DInfo(n.shape,s.shape,i,u,c,l,!0),d;Th().getBool("WEBGL_PACK_DEPTHWISECONV")&&p.strideWidth<=2&&p.outChannels/p.inChannels===1?d=new lt(p):d=new ct(p);let m=[[p.padInfo.top,p.padInfo.left],[p.strideHeight,p.strideWidth],[p.dilationHeight,p.dilationWidth],[p.inHeight,p.inWidth]];return t.runWebGLProgram(d,[n,s],"float32",m)}var vc={kernelName:Rh,backendName:"webgl",kernelFunc:Ih};import{backend_util as Nh,DepthwiseConv2dNativeBackpropFilter as Eh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Zo=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideHeight,r=e.strideWidth,n=e.padInfo.top,s=e.padInfo.left,i=e.outChannels/e.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${r} - ${s};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}},Jo=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterHeight,r=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=t-1-e.padInfo.top,c=r-1-e.padInfo.left,a=e.outChannels/e.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${r} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${a}; dm++) {
              int d2 = d1 * ${a} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function kh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,dy:s}=e,{strides:i,dilations:c,pad:a,dimRoundingMode:l,filterShape:u}=r,p=Nh.computeConv2DInfo(n.shape,u,i,c,a,l,!0),d=new Zo(p);return t.runWebGLProgram(d,[n,s],"float32")}var $c={kernelName:Eh,backendName:"webgl",kernelFunc:kh};import{backend_util as _h,DepthwiseConv2dNativeBackpropInput as Ah}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Fh(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,filter:s}=e,{strides:i,dilations:c,pad:a,dimRoundingMode:l,inputShape:u}=r,p=_h.computeConv2DInfo(u,s.shape,i,c,a,l,!0),d=new Jo(p);return t.runWebGLProgram(d,[n,s],"float32")}var Sc={kernelName:Ah,backendName:"webgl",kernelFunc:Fh};import{Diag as Dh,util as Ph}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var er=class{constructor(e){this.variableNames=["X"],this.outputShape=[e,e],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}};function Oh(o){let{inputs:e,backend:t}=o,{x:r}=e,n=[...r.shape,...r.shape],s=Ph.sizeFromShape(r.shape),i=$({inputs:{x:r},backend:t,attrs:{shape:[s]}}),c=new er(s),a=t.runWebGLProgram(c,[i],i.dtype),l=$({inputs:{x:a},backend:t,attrs:{shape:n}});return t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(a),l}var yc={kernelName:Dh,backendName:"webgl",kernelFunc:Oh};import{backend_util as Lh,Dilation2D as Bh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var tr=class{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;let{inHeight:t,inWidth:r,padInfo:n,strideHeight:s,strideWidth:i,filterHeight:c,filterWidth:a,dilationHeight:l,dilationWidth:u}=e,{top:p,left:d}=n;this.userCode=`
      const ivec2 strides = ivec2(${s}, ${i});
      const ivec2 pads = ivec2(${p}, ${d});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${c}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${t}) {
            for (int w = 0; w < ${a}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${r}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}};function Uh(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s}=e,{strides:i,pad:c,dilations:a}=r,l=Lh.computeDilation2DInfo(n.shape,s.shape,i,c,"NHWC",a),u,p=new tr(l);u=t.runWebGLProgram(p,[n,s],"float32");let d=$({inputs:{x:u},backend:t,attrs:{shape:l.outShape}});return t.disposeIntermediateTensorInfo(u),d}var Rc={kernelName:Bh,backendName:"webgl",kernelFunc:Uh};import{backend_util as Nt,Einsum as Vh,util as Wh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Mh(o){let{inputs:e,backend:t,attrs:r}=o,{equation:n}=r,s=e,{allDims:i,summedDims:c,idDims:a}=Nt.decodeEinsumEquation(n,s.length);Nt.checkEinsumDimSizes(i.length,a,s);let{path:l,steps:u}=Nt.getEinsumComputePath(c,a),p=u.length,d=null,m=i.length,f=[];for(let x=0;x<p;++x){for(let g of u[x]){let{permutationIndices:h,expandDims:C}=Nt.getEinsumPermutation(m,a[g]),v;Nt.isIdentityPermutation(h)?v=s[g]:(v=P({inputs:{x:s[g]},backend:t,attrs:{perm:h}}),f.push(v));let b=v.shape.slice();for(let S=0;S<C.length;++S)b.splice(C[S],0,1);Wh.arraysEqual(v.shape,b)||(v=$({inputs:{x:v},backend:t,attrs:{shape:b}}),f.push(v)),d===null?d=v:(d=vt({inputs:{a:v,b:d},backend:t}),f.push(d))}x<p-1&&(l[x]>=0&&(d=Le({inputs:{x:d},backend:t,attrs:{axis:l[x]-(i.length-m),keepDims:!1}}),f.push(d)),m--)}for(let x of f)x!==d&&t.disposeIntermediateTensorInfo(x);return d}var Tc={kernelName:Vh,backendName:"webgl",kernelFunc:Mh};import{Elu as Gh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zh="return (x >= 0.0) ? x : (exp(x) - 1.0);",Hh=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,Xh=R({opSnippet:zh,packedOpSnippet:Hh}),wc={kernelName:Gh,backendName:"webgl",kernelFunc:Xh};import{EluGrad as Kh,env as qh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jh="return (b >= 0.0) ? a : a * (b + 1.0);",Yh=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,Qh=o=>{let{inputs:e,backend:t}=o,{dy:r,y:n}=e,s=qh().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(Yh,r.shape,n.shape):new Y(jh,r.shape,n.shape);return t.runWebGLProgram(s,[r,n],r.dtype)},Ic={kernelName:Kh,backendName:"webgl",kernelFunc:Qh};import{Equal as Zh}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Jh=`
  return vec4(equal(a, b));
`,ex="return float(a == b);",tx=A({opSnippet:ex,packedOpSnippet:Jh,dtype:"bool",cpuKernelImpl:Us}),Nc={kernelName:Zh,backendName:"webgl",kernelFunc:tx};import{backend_util as ut,Erf as ox}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var rx=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${ut.ERF_P};
  float a1 = ${ut.ERF_A1};
  float a2 = ${ut.ERF_A2};
  float a3 = ${ut.ERF_A3};
  float a4 = ${ut.ERF_A4};
  float a5 = ${ut.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`,nx=R({opSnippet:rx}),Ec={kernelName:ox,backendName:"webgl",kernelFunc:nx};import{Exp as sx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ix=ie+`
  return exp(x);
`,ax=`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Qn=R({opSnippet:ix,packedOpSnippet:ax,cpuKernelImpl:Vs,dtype:"float32"}),kc={kernelName:sx,backendName:"webgl",kernelFunc:Qn};import{ExpandDims as cx,util as lx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function or(o){let{inputs:e,attrs:t,backend:r}=o,{dim:n}=t,{input:s}=e,i=s.shape.length,c=s.shape.slice(),a=n;return n<0&&(lx.assert(-(i+1)<=n,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),a=i+n+1),c.splice(a,0,1),$({inputs:{x:s},backend:r,attrs:{shape:c}})}var _c={kernelName:cx,backendName:"webgl",kernelFunc:or};import{Expm1 as ux}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ac="return exp(x) - 1.0;",px=R({opSnippet:Ac,packedOpSnippet:Ac,cpuKernelImpl:Ws}),Fc={kernelName:ux,backendName:"webgl",kernelFunc:px};import{FFT as mx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as dx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Et=class{constructor(e,t,r){this.variableNames=["real","imag"];let n=t[1];this.outputShape=t;let s=r?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=r?`${n}.0`:"1.0",c;if(e==="real")c="return real * expR - imag * expI;";else if(e==="imag")c="return real * expI + imag * expR;";else throw new Error(`FFT component must be either "real" or "imag", got ${e}.`);this.userCode=`
      const float exponentMultiplier = ${s};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${c}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${n});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${n}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}};function rr(o,e,t){let r=t.texData.get(o.dataId),n=dx.sizeFromShape(o.shape),s=o.shape[o.shape.length-1],i=n/s,c=$({inputs:{x:o},backend:t,attrs:{shape:[i,s]}}),a=c.shape,l=new Et("real",a,e),u=new Et("imag",a,e),p=[{dataId:r.complexTensorInfos.real.dataId,dtype:r.complexTensorInfos.real.dtype,shape:a},{dataId:r.complexTensorInfos.imag.dataId,dtype:r.complexTensorInfos.imag.dtype,shape:a}],d=t.runWebGLProgram(l,p,"float32"),m=t.runWebGLProgram(u,p,"float32"),f=Q({inputs:{real:d,imag:m},backend:t});t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(m);let x=$({inputs:{x:f},backend:t,attrs:{shape:o.shape}});return t.disposeIntermediateTensorInfo(c),t.disposeIntermediateTensorInfo(f),x}function fx(o){let{inputs:e,backend:t}=o,{input:r}=e;return rr(r,!1,t)}var Dc={kernelName:mx,backendName:"webgl",kernelFunc:fx};import{Fill as hx,util as Zn}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var nr=class{constructor(e,t){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=e,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}};function Se(o){let{backend:e,attrs:t}=o,{shape:r,value:n}=t,{dtype:s}=t;if(s=s||Zn.inferDtype(n),s==="string"){let i=Zn.getArrayFromDType(s,Zn.sizeFromShape(r));return i.fill(n),e.makeTensorInfo(r,s,i)}else{let i=new nr(r,n),c=[[n]];return e.runWebGLProgram(i,[],s,c)}}var Pc={kernelName:hx,backendName:"webgl",kernelFunc:Se};import{FlipLeftRight as xx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var sr=class{constructor(e){this.variableNames=["Image"],this.outputShape=[];let t=e[2];this.outputShape=e,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${t} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${t}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}};var Oc={kernelName:xx,backendName:"webgl",kernelFunc:({inputs:o,backend:e})=>{let{image:t}=o,r=e,n=new sr(t.shape);return r.runWebGLProgram(n,[t],t.dtype)}};import{Floor as gx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Lc="return floor(x);",Cx=R({opSnippet:Lc,packedOpSnippet:Lc,cpuKernelImpl:Ms}),Bc={kernelName:gx,backendName:"webgl",kernelFunc:Cx};import{FloorDiv as bx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vx=`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,$x=`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,Sx=A({opSnippet:vx,packedOpSnippet:$x,dtype:"int32"}),Uc={kernelName:bx,backendName:"webgl",kernelFunc:Sx};import{env as es}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{FromPixels as yx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ir=class{constructor(e){this.variableNames=["A"];let t=O(),[r,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${n}.0, ${r}.0);

        vec4 values = ${t.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}};var ar=class{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;let t=O(),[r,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${n}.0, ${r}.0);
            vec4 values = ${t.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${t.output} = result;
      }
    `}};var Vc={kernelName:yx,backendName:"webgl",kernelFunc:Rx},pt,Jn=es().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function Rx(o){let{inputs:e,backend:t,attrs:r}=o,{pixels:n}=e,{numChannels:s}=r,i=typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement,c=typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement,[a,l]=i?[n.videoWidth,n.videoHeight]:[n.width,n.height],u=[l,a],p=[l,a,s];if(c||i){let x=es().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(pt==null||x!==Jn)&&(Jn=x,pt=document.createElement("canvas").getContext("2d",{willReadFrequently:Jn})),pt.canvas.width=a,pt.canvas.height=l,pt.drawImage(n,0,0,a,l),n=pt.canvas}let d=t.makeTensorInfo(u,"int32");t.texData.get(d.dataId).usage=H.PIXELS,t.gpgpu.uploadPixelDataToTexture(t.getTexture(d.dataId),n);let m=es().getBool("WEBGL_PACK")?new ar(p):new ir(p),f=t.runWebGLProgram(m,[d],"int32");return t.disposeData(d.dataId),f}import{backend_util as Wc,env as Mc,FusedConv2D as Tx,util as wx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ix(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s,bias:i,preluActivationWeights:c}=e,{strides:a,pad:l,dataFormat:u,dilations:p,dimRoundingMode:d,activation:m,leakyreluAlpha:f}=r,x=Wc.convertConv2DDataFormat(u),g=Wc.computeConv2DInfo(n.shape,s.shape,a,p,l,d,!1,x),h,C=[],v=i!=null,b=c!=null,S=m==="leakyrelu",E=()=>{let T=[n,s],_=(k,U)=>{if(U==="NCHW"&&k.shape.length===1&&k.shape[0]!==1){let V=$({inputs:{x:k},backend:t,attrs:{shape:[k.shape[0],1,1]}});return C.push(V),V}return k};if(v&&T.push(_(i,u)),b&&T.push(_(c,u)),S){let k=t.makeTensorInfo([],"float32",wx.createScalarValue(f,"float32"));T.push(k),C.push(k)}return T};if(g.filterHeight===1&&g.filterWidth===1&&g.dilationHeight===1&&g.dilationWidth===1&&g.strideHeight===1&&g.strideWidth===1&&(g.padInfo.type==="SAME"||g.padInfo.type==="VALID"))h=Mo({x:n,filter:s,convInfo:g,backend:t,bias:i,activation:m,preluActivationWeights:c,leakyreluAlpha:f});else if(g.strideWidth<=2&&x==="channelsLast"&&Mc().getBool("WEBGL_EXP_CONV")){let T=m?ve(m,!0):null,_=new at(g,v,T,b,S),k=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],U=E();h=t.runWebGLProgram(_,U,"float32",k)}else if(Mc().getBool("WEBGL_CONV_IM2COL"))h=Go({x:n,filter:s,convInfo:g,backend:t,bias:i,activation:m,preluActivationWeights:c,leakyreluAlpha:f});else{let T=m?ve(m,!1):null,_=new it(g,v,T,b,S),k=E();h=t.runWebGLProgram(_,k,"float32")}let I=$({inputs:{x:h},backend:t,attrs:{shape:g.outShape}});return C.push(h),C.forEach(T=>t.disposeIntermediateTensorInfo(T)),I}var Gc={kernelName:Tx,backendName:"webgl",kernelFunc:Ix};import{backend_util as zc,env as Nx,FusedDepthwiseConv2D as Ex,util as Hc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function kx(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,filter:s,bias:i,preluActivationWeights:c}=e,{strides:a,pad:l,dilations:u,dimRoundingMode:p,activation:d,leakyreluAlpha:m}=r,f=[],x=u;x==null&&(x=[1,1]),Hc.assert(zc.eitherStridesOrDilationsAreOne(a,x),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${a} and dilations '${x}'`);let g=zc.computeConv2DInfo(n.shape,s.shape,a,x,l,p,!0),h=Nx().getBool("WEBGL_PACK_DEPTHWISECONV")&&g.strideWidth<=2&&g.outChannels/g.inChannels===1,C=d?ve(d,h):null,v=[n,s],b=i!=null,S=c!=null,E=d==="leakyrelu";if(b&&v.push(i),S&&v.push(c),E){let k=t.makeTensorInfo([],"float32",Hc.createScalarValue(m,"float32"));v.push(k),f.push(k)}let I;h?I=new lt(g,b,C,S,E):I=new ct(g,b,C,S,E);let T=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],_=t.runWebGLProgram(I,v,"float32",T);return f.forEach(k=>t.disposeIntermediateTensorInfo(k)),_}var Xc={kernelName:Ex,backendName:"webgl",kernelFunc:kx};import{backend_util as _x,GatherNd as Ax,util as Kc}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var cr=class{constructor(e,t,r,n){this.sliceDim=e,this.strides=t,this.paramsShape=n,this.variableNames=["x","indices"],this.outputShape=r;let s=N(r.length),i=`
    int index;`;for(let c=0;c<this.sliceDim;c++)i+=`
          index = round(getIndices(coords[0], ${c}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[c]};
          flattenIndex += index * ${this.strides[c]};`;this.userCode=`
         void main() {
          ${s} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}};function Fx(o){let{inputs:e,backend:t}=o,{params:r,indices:n}=e,s=n.shape,i=s[s.length-1],c=Kc.sizeFromShape(r.shape),[a,l,u,p]=_x.prepareAndValidate(r,n),d=$({inputs:{x:n},backend:t,attrs:{shape:[l,i]}}),m=$({inputs:{x:r},backend:t,attrs:{shape:[Kc.sizeFromShape(r.shape)/u,u]}});if(t.shouldExecuteOnCPU([r,n])||r.dtype==="string"){let h=t.readSync(n.dataId),C=t.bufferSync(r),v=Gs(h,C,r.dtype,l,i,u,p,r.shape,c);return t.makeTensorInfo(a,r.dtype,v.values)}let f=new cr(i,p,[l,u],r.shape),x=t.runWebGLProgram(f,[m,d],m.dtype),g=$({inputs:{x},backend:t,attrs:{shape:a}});return t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(x),g}var qc={kernelName:Ax,backendName:"webgl",kernelFunc:Fx};import{backend_util as Px,GatherV2 as Ox,util as ts,env as Lx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var lr=class{constructor(e,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;let r=N(this.rank),n=Dx(e,2);this.userCode=`
      void main() {
        ${r} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${e[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${n}));
      }
    `}};function Dx(o,e){let t=["resRC.x","resRC.y","resRC.z","resRC.w"],r=[];for(let n=0;n<o.length;n++)n===2?r.push("index"):r.push(`${t[n]}`);return r.join()}function os(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,indices:s}=e,{axis:i,batchDims:c}=r,a=ts.parseAxisParam(i,n.shape)[0];if(Lx().get("DEBUG")){let C=t.readSync(s.dataId),v=n.shape[a];for(let b=0;b<C.length;++b){let S=C[b];ts.assert(S<=v-1&&S>=0,()=>`GatherV2: the index value ${S} is not in [0, ${v-1}]`)}}let l=Px.segment_util.collectGatherOpShapeInfo(n,s,a,c),u=ts.sizeFromShape(s.shape),p=[],d=$({inputs:{x:n},backend:t,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),m=$({inputs:{x:s},backend:t,attrs:{shape:[l.batchSize,u/l.batchSize]}});p.push(d),p.push(m);let f=[l.batchSize,l.outerSize,u/l.batchSize,l.sliceSize];if(t.shouldExecuteOnCPU([n,s])||n.dtype==="string"){let C=t.bufferSync(m),v=t.bufferSync(d),b=zs(v,C,f);return p.forEach(S=>t.disposeIntermediateTensorInfo(S)),t.makeTensorInfo(l.outputShape,b.dtype,b.values)}let x=new lr(d.shape,f),g=t.runWebGLProgram(x,[d,m],d.dtype);p.push(g);let h=$({inputs:{x:g},backend:t,attrs:{shape:l.outputShape}});return p.forEach(C=>t.disposeIntermediateTensorInfo(C)),h}var jc={kernelName:Ox,backendName:"webgl",kernelFunc:os};import{Greater as Bx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ux="return float(a > b);",Vx=`
  return vec4(greaterThan(a, b));
`,Wx=A({opSnippet:Ux,packedOpSnippet:Vx,cpuKernelImpl:Hs,dtype:"bool"}),Yc={kernelName:Bx,backendName:"webgl",kernelFunc:Wx};import{GreaterEqual as Mx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Gx="return float(a >= b);",zx=`
  return vec4(greaterThanEqual(a, b));
`,Hx=A({opSnippet:Gx,packedOpSnippet:zx,dtype:"bool",cpuKernelImpl:Xs}),Qc={kernelName:Mx,backendName:"webgl",kernelFunc:Hx};import{IFFT as Xx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Kx(o){let{inputs:e,backend:t}=o,{input:r}=e;return rr(r,!0,t)}var Zc={kernelName:Xx,backendName:"webgl",kernelFunc:Kx};import{IsFinite as qx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var jx="return float(!isnan(x) && !isinf(x));",Yx=R({opSnippet:jx,dtype:"bool"}),Jc={kernelName:qx,backendName:"webgl",kernelFunc:Yx};import{IsInf as Qx}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Zx="return float(isinf(x));",Jx=R({opSnippet:Zx,dtype:"bool"}),el={kernelName:Qx,backendName:"webgl",kernelFunc:Jx};import{IsNan as eg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var tg="return float(isnan(x));",og=R({opSnippet:tg,dtype:"bool"}),tl={kernelName:eg,backendName:"webgl",kernelFunc:og};import{Less as rg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ng="return float(a < b);",sg=`
  return vec4(lessThan(a, b));
`,ig=A({opSnippet:ng,packedOpSnippet:sg,cpuKernelImpl:Ks,dtype:"bool"}),ol={kernelName:rg,backendName:"webgl",kernelFunc:ig};import{LessEqual as ag}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var cg="return float(a <= b);",lg=`
  return vec4(lessThanEqual(a, b));
`,ug=A({opSnippet:cg,packedOpSnippet:lg,cpuKernelImpl:qs,dtype:"bool"}),rl={kernelName:ag,backendName:"webgl",kernelFunc:ug};import{LinSpace as pg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function dg(o){let{backend:e,attrs:t}=o,{start:r,stop:n,num:s}=t,i=js(r,n,s);return e.makeTensorInfo([i.length],"float32",i)}var nl={kernelName:pg,backendName:"webgl",kernelFunc:dg};import{Log as mg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var fg=ie+`
  return x < 0.0 ? 0./0. : log(x);
`,hg=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,xg=R({opSnippet:fg,packedOpSnippet:hg,cpuKernelImpl:Ys}),sl={kernelName:mg,backendName:"webgl",kernelFunc:xg};import{Log1p as gg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Cg=ie+`
  return log(1.0 + x);
`,bg=R({opSnippet:Cg}),il={kernelName:gg,backendName:"webgl",kernelFunc:bg};import{LogicalAnd as vg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $g="return float(a >= 1.0 && b >= 1.0);",Sg=`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,yg=A({opSnippet:$g,packedOpSnippet:Sg,dtype:"bool"}),al={kernelName:vg,backendName:"webgl",kernelFunc:yg};import{LogicalNot as Rg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Tg="return float(!(x >= 1.0));",wg=R({opSnippet:Tg}),cl={kernelName:Rg,backendName:"webgl",kernelFunc:wg};import{LogicalOr as Ig}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ng="return float(a >= 1.0 || b >= 1.0);",Eg=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,kg=A({opSnippet:Ng,packedOpSnippet:Eg,dtype:"bool"}),ll={kernelName:Ig,backendName:"webgl",kernelFunc:kg};import{env as _g,LRN as Ag}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ur=class{constructor(e,t,r,n,s){this.variableNames=["x"],this.outputShape=[];let i=t,c=e[3]-1;this.outputShape=e;let a,l=`float(${r}) + float(${n}) * sum`;s===.5?a=`inversesqrt(${l})`:s===1?a=`1.0/(${l})`:a=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${i}; j <= ${i}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${c}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${a};
        setOutput(val);
      }
    `}};var pr=class{constructor(e,t,r,n,s){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;let i=t,c=e[3]-1;this.outputShape=e;let a,l=`float(${r}) + float(${n}) * sum`;s===.5?a=`inversesqrt(${l})`:s===1?a=`1.0/(${l})`:a=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${i};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${i}; j <= ${i}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${c}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${a};
        setOutput(result);
      }
    `}};var Fg=o=>{let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{depthRadius:s,bias:i,alpha:c,beta:a}=r,l=_g().getBool("WEBGL_PACK_NORMALIZATION")?new pr(n.shape,s,i,c,a):new ur(n.shape,s,i,c,a);return t.runWebGLProgram(l,[n],n.dtype)},ul={kernelName:Ag,backendName:"webgl",kernelFunc:Fg};import{LRNGrad as Dg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var dr=class{constructor(e,t,r,n,s){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=e,this.depth=e[3],this.depthRadius=t,this.bias=r,this.alpha=n,this.beta=s,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${t})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${t} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${n}) * norm + float(${r});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${n})
                * float(${s})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${s});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}};var Pg=o=>{let{inputs:e,backend:t,attrs:r}=o,{x:n,y:s,dy:i}=e,{depthRadius:c,bias:a,alpha:l,beta:u}=r,p=new dr(n.shape,c,a,l,u);return t.runWebGLProgram(p,[n,s,i],n.dtype)},pl={kernelName:Dg,backendName:"webgl",kernelFunc:Pg};import{Max as Og}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as kt,util as fl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as dl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ml(o,e,t,r){let n=dl.sizeFromShape(e),i=dl.sizeFromShape(o.shape)/n,c=$({inputs:{x:o},attrs:{shape:[i,n]},backend:r}),a=re(c,o.dtype,"max",r),l=$({inputs:{x:a},attrs:{shape:t},backend:r});return r.disposeIntermediateTensorInfo(c),r.disposeIntermediateTensorInfo(a),l}function rs(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{reductionIndices:s,keepDims:i}=r,c=n.shape.length,a=fl.parseAxisParam(s,n.shape),l=a,u=kt.getAxesPermutation(l,c),p=u!=null,d=t.shouldExecuteOnCPU([n]),m=n;if(p){if(d){let v=t.texData.get(m.dataId).values,b=new Array(c);for(let I=0;I<b.length;I++)b[I]=n.shape[u[I]];let S=Oe(v,n.shape,n.dtype,u,b);m=t.makeTensorInfo(b,n.dtype);let E=t.texData.get(m.dataId);E.values=S}else m=Ne(n,u,t);l=kt.getInnerMostAxes(l.length,c)}kt.assertAxesAreInnerMostDims("max",l,c);let[f,x]=kt.computeOutAndReduceShapes(m.shape,l),g=f;i&&(g=kt.expandShapeToKeepDim(f,a));let h;if(d){let v=t.texData.get(m.dataId).values,b=Qs(v,fl.sizeFromShape(x),g,n.dtype);h=t.makeTensorInfo(g,n.dtype);let S=t.texData.get(h.dataId);S.values=b}else h=ml(m,x,g,t);return p&&t.disposeIntermediateTensorInfo(m),h}var hl={kernelName:Og,backendName:"webgl",kernelFunc:rs};import{Maximum as Lg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Bg=rt+`
  return max(a, b);
`,Ug=`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,Vg=A({opSnippet:Bg,packedOpSnippet:Ug,cpuKernelImpl:Zs}),xl={kernelName:Lg,backendName:"webgl",kernelFunc:Vg};import{backend_util as gl,MaxPool as Wg,util as Cl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Mg(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e;ce(n,"maxPool");let{filterSize:s,strides:i,pad:c,dimRoundingMode:a}=r,l=1;Cl.assert(gl.eitherStridesOrDilationsAreOne(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let u=gl.computePool2DInfo(n.shape,s,i,l,c,a);if(u.filterWidth===1&&u.filterHeight===1&&Cl.arraysEqual(u.inShape,u.outShape))return B({inputs:{x:n},backend:t});let p=new ue(u,"max",!1);return t.runWebGLProgram(p,[n],n.dtype)}var bl={kernelName:Wg,backendName:"webgl",kernelFunc:Mg};import{backend_util as Gg,MaxPool3D as zg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Hg(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{filterSize:s,strides:i,pad:c,dataFormat:a,dimRoundingMode:l}=r,u=[1,1,1],p=Gg.computePool3DInfo(n.shape,s,i,u,c,l,a),d=new Ee(p,"max",!1);return t.runWebGLProgram(d,[n],n.dtype)}var vl={kernelName:zg,backendName:"webgl",kernelFunc:Hg};import{backend_util as Xg,MaxPool3DGrad as Kg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var mr=class{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;let t=e.strideHeight,r=e.strideWidth,n=e.dilationHeight,s=e.effectiveFilterHeight,i=e.effectiveFilterWidth,c=s-1-e.padInfo.top,a=i-1-e.padInfo.left,l=s*i-1;this.userCode=`
      const ivec2 pads = ivec2(${c}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${s};
          wR += ${n}) {
          float dyR = float(dyRCorner + wR) / ${t}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${l} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}},fr=class{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;let t=e.strideDepth,r=e.strideHeight,n=e.strideWidth,s=e.dilationDepth,i=e.dilationHeight,c=e.dilationWidth,a=e.effectiveFilterDepth,l=e.effectiveFilterHeight,u=e.effectiveFilterWidth,p=a-1-e.padInfo.front,d=l-1-e.padInfo.top,m=u-1-e.padInfo.left,f=a*l*u-1;this.userCode=`
      const ivec3 pads = ivec3(${p}, ${d}, ${m});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${a};
           wD += ${s}) {
          float dyD = float(dyDCorner + wD) / ${t}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${r}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${c}) {
              float dyC = float(dyCCorner + wC) / ${n}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${f} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function qg(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,input:s}=e,i=s,{filterSize:c,strides:a,pad:l,dimRoundingMode:u}=r,p=[1,1,1],d=Xg.computePool3DInfo(i.shape,c,a,p,l,u),m=new Ee(d,"max",!0),f=t.runWebGLProgram(m,[i],i.dtype),x=new fr(d),g=t.runWebGLProgram(x,[n,f],i.dtype);return t.disposeIntermediateTensorInfo(f),g}var $l={kernelName:Kg,backendName:"webgl",kernelFunc:qg};import{backend_util as jg,MaxPoolGrad as Yg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Qg(o){let{inputs:e,backend:t,attrs:r}=o,{dy:n,input:s,output:i}=e,c=s;ce([s,i],"maxPoolGrad");let{filterSize:a,strides:l,pad:u,dimRoundingMode:p}=r,d=jg.computePool2DInfo(c.shape,a,l,1,u,p),m=!0,f=new ue(d,"max",m),x=t.runWebGLProgram(f,[c],c.dtype),g=new mr(d),h=t.runWebGLProgram(g,[n,x],c.dtype);return t.disposeIntermediateTensorInfo(x),h}var Sl={kernelName:Yg,backendName:"webgl",kernelFunc:Qg};import{MaxPoolWithArgmax as Zg}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as Rl,util as Tl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function yl(o,e,t,r){let n=new ue(t,"max",!1),s=r.runWebGLProgram(n,[o],"float32");n=new ue(t,"max",!0,!0,e);let i=r.runWebGLProgram(n,[o],"float32");return[s,i]}var wl={kernelName:Zg,backendName:"webgl",kernelFunc:({inputs:o,attrs:e,backend:t})=>{let{x:r}=o,{filterSize:n,strides:s,pad:i,includeBatchInIndex:c}=e,a=t;Tl.assert(r.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${r.shape.length}.`);let l=[1,1];Tl.assert(Rl.eitherStridesOrDilationsAreOne(s,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${s} and dilations '${l}'`);let u=Rl.computePool2DInfo(r.shape,n,s,l,i),[p,d]=yl(r,c,u,a);return[p,d]}};import{backend_util as _t,Mean as Jg,util as eC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{util as Il}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Nl(o,e,t,r){let n=Il.sizeFromShape(e),i=Il.sizeFromShape(o.shape)/n,c=$({inputs:{x:o},attrs:{shape:[i,n]},backend:r}),a=re(c,"float32","mean",r),l=$({inputs:{x:a},attrs:{shape:t},backend:r});return r.disposeIntermediateTensorInfo(c),r.disposeIntermediateTensorInfo(a),l}var El={kernelName:Jg,backendName:"webgl",kernelFunc:({inputs:o,attrs:e,backend:t})=>{let{x:r}=o,{keepDims:n,axis:s}=e,i=t,c=r.shape.length,a=eC.parseAxisParam(s,r.shape),l=a,u=_t.getAxesPermutation(l,c),p=u!=null,d=i.shouldExecuteOnCPU([r]),m=[],f=r;if(p){if(d){let b=i.texData.get(f.dataId).values,S=new Array(c);for(let T=0;T<S.length;T++)S[T]=r.shape[u[T]];let E=Oe(b,r.shape,r.dtype,u,S);f=i.makeTensorInfo(S,r.dtype);let I=i.texData.get(f.dataId);I.values=E}else f=Ne(r,u,i);m.push(f),l=_t.getInnerMostAxes(l.length,c)}_t.assertAxesAreInnerMostDims("sum",l,c);let[x,g]=_t.computeOutAndReduceShapes(f.shape,l),h=x;n&&(h=_t.expandShapeToKeepDim(x,a));let C=Nl(f,g,h,i);for(let v of m)i.disposeIntermediateTensorInfo(v);return C}};import{backend_util as At,Min as tC,util as kl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function oC(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,keepDims:i}=r,c=n.shape.length,a=kl.parseAxisParam(s,n.shape),l=a,u=At.getAxesPermutation(l,c),p=n;u!=null&&(p=P({inputs:{x:n},backend:t,attrs:{perm:u}}),l=At.getInnerMostAxes(l.length,n.shape.length)),At.assertAxesAreInnerMostDims("min",l,c);let[d,m]=At.computeOutAndReduceShapes(p.shape,l),f=kl.sizeFromShape(m),x=$({inputs:{x:p},backend:t,attrs:{shape:[-1,f]}}),g=re(x,x.dtype,"min",t),h;if(i){let C=At.expandShapeToKeepDim(d,a);h=$({inputs:{x:g},backend:t,attrs:{shape:C}})}else h=$({inputs:{x:g},backend:t,attrs:{shape:d}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(p),h}var _l={kernelName:tC,backendName:"webgl",kernelFunc:oC};import{Minimum as rC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var nC=rt+`
  return min(a, b);
`,sC=`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,iC=A({opSnippet:nC,packedOpSnippet:sC,cpuKernelImpl:Js}),Al={kernelName:rC,backendName:"webgl",kernelFunc:iC};import{env as aC,MirrorPad as cC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var hr=class{constructor(e,t,r){this.variableNames=["x"],this.outputShape=t.map((u,p)=>u[0]+e[p]+u[1]);let n=e.length,s=N(n),i=t.map(u=>u[0]).join(","),c=t.map((u,p)=>u[0]+e[p]).join(","),a=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n),l=r==="reflect"?0:1;if(n===1){this.userCode=`
        int start = ${i};
        int end = ${c};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${c});

      void main() {
        ${s} outC = getOutputCoords();
        for (int i = 0; i < ${n}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${s} coords = outC - start;
        setOutput(getX(${a}));
      }
    `}};var xr=class{constructor(e,t,r){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((f,x)=>f[0]+e[x]+f[1]);let n=e.length,s=N(n),i=t.map(f=>f[0]).join(","),c=t.map((f,x)=>f[0]+e[x]).join(","),a=L("rc",n),l=L("source",n),u=`${a[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,d=r==="reflect"?0:1,m="";if(n===1){let f=`
        ${s} source = rc;
        if (source < start) {
          source = start * 2 - source - ${d};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${d};
        }
        source -= start;
      `;m=`
        ${s} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${a[n-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
      `}else{let f=`
        ${s} source = rc;
        ${s} lt = ${s}(lessThan(source, start));
        ${s} gte = ${s}(greaterThanEqual(source, end));
        ${s} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${d}) +
                gte * ((end - 1) * 2 - source + ${d});
        source -= start;
      `;m=`
        ${s} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${a[n-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
        rc = outputLoc;
        ${a[n-2]} += 1;
        if(${a[n-2]} < ${this.outputShape[n-2]}) {
          ${f}
          result[2] = getChannel(getX(${l.join()}), ${p});
          ${a[n-1]} += 1;
          if(${u}) {
            ${f}
            result[3] = getChannel(getX(${l.join()}), ${p});
          }
        }
      `}this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${c});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${m}
        setOutput(result);
      }
    `}};var lC=({inputs:o,backend:e,attrs:t})=>{let{x:r}=o,{paddings:n,mode:s}=t,i=aC().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new xr(r.shape,n,s):new hr(r.shape,n,s);return e.runWebGLProgram(i,[r],r.dtype)},Fl={kernelName:cC,backendName:"webgl",kernelFunc:lC};import{Mod as uC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var pC=`if (b == 0.0) return NAN;
  return mod(a, b);`,dC=`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+oe+`
  return result;
`,mC=A({opSnippet:pC,packedOpSnippet:dC}),Dl={kernelName:uC,backendName:"webgl",kernelFunc:mC};import{Multinomial as $C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gr=class{constructor(e,t,r){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[e,r],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${t-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${t-1}));
      }
    `}};import{backend_util as CC,Softmax as bC,util as vC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{RealDiv as fC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var hC=`
if (a == b) {
  return 1.0;
};
return a / b;`,xC=`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,ns=A({opSnippet:hC,packedOpSnippet:xC,checkOutOfBounds:!0}),Pl={kernelName:fC,backendName:"webgl",kernelFunc:ns};import{Sub as gC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ol="return a - b;",ss=A({opSnippet:Ol,packedOpSnippet:Ol,supportsComplex:!0,cpuKernelImpl:vi}),Ll={kernelName:gC,backendName:"webgl",kernelFunc:ss};function is(o){let{inputs:e,backend:t,attrs:r}=o,{logits:n}=e,{dim:s}=r,i=vC.parseAxisParam([s],n.shape),c=rs({inputs:{x:n},backend:t,attrs:{reductionIndices:i,keepDims:!1}}),a=CC.expandShapeToKeepDim(c.shape,i),l=$({inputs:{x:c},backend:t,attrs:{shape:a}}),u=ss({inputs:{a:n,b:l},backend:t}),p=Qn({inputs:{x:u},backend:t}),d=Le({inputs:{x:p},backend:t,attrs:{axis:i,keepDims:!1}}),m=$({inputs:{x:d},backend:t,attrs:{shape:a}}),f=ns({inputs:{a:p,b:m},backend:t});return t.disposeIntermediateTensorInfo(c),t.disposeIntermediateTensorInfo(l),t.disposeIntermediateTensorInfo(u),t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(m),f}var Bl={kernelName:bC,backendName:"webgl",kernelFunc:is};function SC(o){let{inputs:e,backend:t,attrs:r}=o,{logits:n}=e,{numSamples:s,seed:i,normalized:c}=r,a=c?n:is({inputs:{logits:n},backend:t,attrs:{dim:n.shape.length-1}}),l=a.shape[0],u=a.shape[1],p=new gr(l,u,s),d=[[i]],m=t.runWebGLProgram(p,[a],"int32",d);return c||t.disposeIntermediateTensorInfo(a),m}var Ul={kernelName:$C,backendName:"webgl",kernelFunc:SC};import{env as yC,Neg as RC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var TC=W+`
  return -x;
`,wC=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function IC(o){let{inputs:e,backend:t}=o,{x:r}=e;if(t.shouldExecuteOnCPU([r])){let s=t.texData.get(r.dataId),[i,c]=ti(s.values,r.shape,r.dtype);return t.makeTensorInfo(c,r.dtype,i)}let n;return yC().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new j(r.shape,wC):n=new z(r.shape,TC),t.runWebGLProgram(n,[r],r.dtype)}var Vl={kernelName:RC,backendName:"webgl",kernelFunc:IC};import{backend_util as NC,kernel_impls as EC,NonMaxSuppressionV3 as kC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var _C=EC.nonMaxSuppressionV3Impl;function AC(o){NC.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:r}=o,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a}=r,l=t.readSync(n.dataId),u=t.readSync(s.dataId),{selectedIndices:p}=_C(l,u,i,c,a);return t.makeTensorInfo([p.length],"int32",new Int32Array(p))}var Wl={kernelName:kC,backendName:"webgl",kernelFunc:AC};import{backend_util as FC,kernel_impls as DC,NonMaxSuppressionV4 as PC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var OC=DC.nonMaxSuppressionV4Impl;function LC(o){FC.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:r}=o,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a,padToMaxOutputSize:l}=r,u=t.readSync(n.dataId),p=t.readSync(s.dataId),{selectedIndices:d,validOutputs:m}=OC(u,p,i,c,a,l);return[t.makeTensorInfo([d.length],"int32",new Int32Array(d)),t.makeTensorInfo([],"int32",new Int32Array([m]))]}var Ml={kernelName:PC,backendName:"webgl",kernelFunc:LC};import{backend_util as BC,kernel_impls as UC,NonMaxSuppressionV5 as VC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var WC=UC.nonMaxSuppressionV5Impl;function MC(o){BC.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:r}=o,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a,softNmsSigma:l}=r,u=t.readSync(n.dataId),p=t.readSync(s.dataId),d=i,m=c,f=a,x=l,{selectedIndices:g,selectedScores:h}=WC(u,p,d,m,f,x);return[t.makeTensorInfo([g.length],"int32",new Int32Array(g)),t.makeTensorInfo([h.length],"float32",new Float32Array(h))]}var Gl={kernelName:VC,backendName:"webgl",kernelFunc:MC};import{OneHot as GC,util as zC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Cr=class{constructor(e,t,r,n){this.variableNames=["indices"],this.outputShape=[e,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${n}), float(${r}),
                      float(index == coords.y)));
      }
    `}};var HC=o=>{let{inputs:e,backend:t,attrs:r}=o,{indices:n}=e,{dtype:s,depth:i,onValue:c,offValue:a}=r,l=zC.sizeFromShape(n.shape),u=new Cr(l,i,c,a),p=$({inputs:{x:n},backend:t,attrs:{shape:[l]}}),d=t.runWebGLProgram(u,[p],s);t.disposeIntermediateTensorInfo(p);let m=[...n.shape,i],f=$({inputs:{x:d},backend:t,attrs:{shape:m}});return t.disposeIntermediateTensorInfo(d),f},zl={kernelName:GC,backendName:"webgl",kernelFunc:HC};import{OnesLike as KC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ZerosLike as XC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ft(o){let{inputs:e,backend:t}=o,{x:r}=e;if(r.dtype==="complex64"){let n=$e({inputs:{input:r},backend:t}),s=Ft({inputs:{x:n},backend:t}),i=Ue({inputs:{input:r},backend:t}),c=Ft({inputs:{x:i},backend:t}),a=Q({inputs:{real:s,imag:c},backend:t});return t.disposeIntermediateTensorInfo(n),t.disposeIntermediateTensorInfo(s),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(c),a}else return Se({attrs:{shape:r.shape,dtype:r.dtype,value:r.dtype==="string"?"":0},backend:t})}var Hl={kernelName:XC,backendName:"webgl",kernelFunc:Ft};function Xl(o){let{inputs:e,backend:t}=o,{x:r}=e;if(r.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(r.dtype==="complex64"){let n=$e({inputs:{input:r},backend:t}),s=Xl({inputs:{x:n},backend:t}),i=Ue({inputs:{input:r},backend:t}),c=Ft({inputs:{x:i},backend:t}),a=Q({inputs:{real:s,imag:c},backend:t});return t.disposeIntermediateTensorInfo(n),t.disposeIntermediateTensorInfo(s),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(c),a}else return Se({attrs:{shape:r.shape,dtype:r.dtype,value:1},backend:t})}var Kl={kernelName:KC,backendName:"webgl",kernelFunc:Xl};import{Pack as qC,util as ql}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function jC(o){let{inputs:e,backend:t,attrs:r}=o,{axis:n}=r;if(e.length===1)return or({inputs:{input:e[0]},backend:t,attrs:{dim:n}});let s=e[0].shape,i=e[0].dtype;e.forEach(u=>{ql.assertShapesMatch(s,u.shape,"All tensors passed to stack must have matching shapes"),ql.assert(i===u.dtype,()=>"All tensors passed to stack must have matching dtypes")});let c=[],a=e.map(u=>{let p=or({inputs:{input:u},backend:t,attrs:{dim:n}});return c.push(p),p}),l=jn({inputs:a,backend:t,attrs:{axis:n}});return c.forEach(u=>t.disposeIntermediateTensorInfo(u)),l}var jl={kernelName:qC,backendName:"webgl",kernelFunc:jC};import{env as YC,PadV2 as QC,util as ZC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var br=class{constructor(e,t,r){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((l,u)=>l[0]+e[u]+l[1]);let n=e.length,s=N(n),i=t.map(l=>l[0]).join(","),c=t.map((l,u)=>l[0]+e[u]).join(","),a=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);if(n===1){this.userCode=`
        int start = ${i};
        int end = ${c};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${c});

      void main() {
        ${s} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${s} coords = outC - start;
          setOutput(getX(${a}));
        }
      }
    `}};var vr=class{constructor(e,t,r){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((x,g)=>x[0]+e[g]+x[1]);let n=e.length,s=N(n),i=t.map(x=>x[0]).join(","),c=t.map((x,g)=>x[0]+e[g]).join(","),a=L("rc",n),l=L("source",n),u=`${a[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,d=[`${s} rc = outputLoc;`,`${a[n-1]} += 1;
       if(${u}) {
      `,n===1?"":`}
       rc = outputLoc;
       ${a[n-2]} += 1;
       if(${a[n-2]} < ${this.outputShape[n-2]}) {`,n===1?"":`  ${a[n-1]} += 1;
         if(${u}) {`],m=n===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",f="";for(let x=0,g=n===1?2:4;x<g;x++)f+=`
        ${d[x]}
        if (${m}) {
          result[${x}] = float(value);
        } else {
          ${s} source = rc - start;
          result[${x}] = getChannel(getX(${l.join()}), ${p});
        }
      `;f+=n===1?"} ":"}}",this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${c});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${f}
        setOutput(result);
      }
    `}};var as=o=>{let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{paddings:s,constantValue:i}=r;if(ZC.sizeFromShape(n.shape)===0){let l=s.map((u,p)=>u[0]+n.shape[p]+u[1]);return Se({backend:t,attrs:{shape:l,value:i,dtype:n.dtype}})}let c=YC().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new vr(n.shape,s,i):new br(n.shape,s,i),a=[[i]];return t.runWebGLProgram(c,[n],n.dtype,a)},Yl={kernelName:QC,backendName:"webgl",kernelFunc:as};import{Pow as JC}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var eb=`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,tb=`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+oe+`
  return result;
`,ob=A({opSnippet:eb,packedOpSnippet:tb}),Ql={kernelName:JC,backendName:"webgl",kernelFunc:ob};import{backend_util as Dt,Prod as rb,sumOutType as nb,util as Zl}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function sb(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{axis:s,keepDims:i}=r,c=n.shape.length,a=[],l=Zl.parseAxisParam(s,n.shape),u=l,p=Dt.getAxesPermutation(u,c),d=n;p!=null&&(d=P({inputs:{x:n},backend:t,attrs:{perm:p}}),u=Dt.getInnerMostAxes(u.length,c),a.push(d)),Dt.assertAxesAreInnerMostDims("prod",u,c);let m;if(t.shouldExecuteOnCPU([d])){let f=t.texData.get(d.dataId).values,{outVals:x,outShape:g,outDtype:h}=ri(d.shape,d.dtype,f,u);m=t.makeTensorInfo(g,h,x)}else{let[f,x]=Dt.computeOutAndReduceShapes(d.shape,u),g=Zl.sizeFromShape(x),h=$({inputs:{x:d},backend:t,attrs:{shape:[-1,g]}}),C=nb(n.dtype),v=re(h,C,"prod",t);m=$({inputs:{x:v},backend:t,attrs:{shape:f}}),a.push(h),a.push(v)}if(i){a.push(m);let f=Dt.expandShapeToKeepDim(m.shape,l);m=$({inputs:{x:m},backend:t,attrs:{shape:f}})}return a.forEach(f=>t.disposeIntermediateTensorInfo(f)),m}var Jl={kernelName:rb,backendName:"webgl",kernelFunc:sb};import{RaggedGather as ib}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function ab(o){let{inputs:e,backend:t,attrs:r}=o,{paramsNestedSplits:n,paramsDenseValues:s,indices:i}=e,{outputRaggedRank:c}=r,a=n.map(h=>t.readSync(h.dataId)),l=n.map(h=>h.shape),u=t.readSync(s.dataId),p=t.readSync(i.dataId),[d,m,f]=ni(a,l,u,s.shape,s.dtype,p,i.shape,c),x=d.map(h=>t.makeTensorInfo([h.length],"int32",h)),g=t.makeTensorInfo(f,s.dtype,m);return x.concat([g])}var eu={kernelName:ib,backendName:"webgl",kernelFunc:ab};import{RaggedRange as cb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function lb(o){let{inputs:e,backend:t}=o,{starts:r,limits:n,deltas:s}=e,i=t.readSync(r.dataId),c=t.readSync(n.dataId),a=t.readSync(s.dataId),[l,u]=si(i,r.shape,r.dtype,c,n.shape,a,s.shape),p=t.makeTensorInfo([l.length],"int32",l),d=t.makeTensorInfo([u.length],r.dtype,u);return[p,d]}var tu={kernelName:cb,backendName:"webgl",kernelFunc:lb};import{RaggedTensorToTensor as ub}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function pb(o){let{inputs:e,backend:t,attrs:r}=o,{shape:n,values:s,defaultValue:i,rowPartitionTensors:c}=e,{rowPartitionTypes:a}=r,l=t.readSync(n.dataId),u=t.readSync(s.dataId),p=t.readSync(i.dataId),d=c.map(g=>t.readSync(g.dataId)),m=c.map(g=>g.shape),[f,x]=ii(l,n.shape,u,s.shape,s.dtype,p,i.shape,d,m,a);return t.makeTensorInfo(f,s.dtype,x)}var ou={kernelName:ub,backendName:"webgl",kernelFunc:pb};import{Range as db}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var cs=o=>{let{backend:e,attrs:t}=o,{start:r,stop:n,step:s,dtype:i}=t,c=ai(r,n,s,i);return e.makeTensorInfo([c.length],i,c)},ru={kernelName:db,backendName:"webgl",kernelFunc:cs};import{Reciprocal as mb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var fb="return 1.0 / x;",hb=R({opSnippet:fb}),nu={kernelName:mb,backendName:"webgl",kernelFunc:hb};import{Relu as xb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gb=W+`
  return (x < 0.0) ? 0.0 : x;
`,Cb=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,bb=R({opSnippet:gb,packedOpSnippet:Cb}),su={kernelName:xb,backendName:"webgl",kernelFunc:bb};import{Relu6 as vb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $b=W+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,Sb=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,yb=R({opSnippet:$b,packedOpSnippet:Sb}),iu={kernelName:vb,backendName:"webgl",kernelFunc:yb};import{env as Rb,ResizeBilinear as Tb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var $r=class{constructor(e,t,r,n,s){this.variableNames=["A"],this.outputShape=[];let[i,c,a,l]=e;this.outputShape=[i,t,r,l];let u=[n&&t>1?c-1:c,n&&r>1?a-1:a],p=[n&&t>1?t-1:t,n&&r>1?r-1:r],d;s?d="(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":d="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/p[0]},
          ${u[1]/p[1]});
      const vec2 inputShapeRC = vec2(${c}.0, ${a}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}};var Sr=class{constructor(e,t,r,n,s){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];let[i,c,a,l]=e;this.outputShape=[i,t,r,l];let u=[n&&t>1?c-1:c,n&&r>1?a-1:a],p=[n&&t>1?t-1:t,n&&r>1?r-1:r],d;s?d="(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":d="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/p[0]},
          ${u[1]/p[1]},
          ${u[1]/p[1]});
      const vec3 inputShapeRC = vec3(${c}.0, ${a}.0,
                                     ${a}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${r-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}};function wb(o){let{inputs:e,backend:t,attrs:r}=o,{images:n}=e,{alignCorners:s,halfPixelCenters:i,size:c}=r,[a,l]=c,u=Rb().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Sr(n.shape,a,l,s,i):new $r(n.shape,a,l,s,i);return t.runWebGLProgram(u,[n],"float32")}var au={kernelName:Tb,backendName:"webgl",kernelFunc:wb};import{ResizeBilinearGrad as Ib}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var yr=class{constructor(e,t,r){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;let[,n,s]=t,[,i,c]=e,a=[r&&i>1?n-1:n,r&&c>1?s-1:s],l=[r&&i>1?i-1:i,r&&c>1?c-1:c],u=a[0]/l[0],p=a[1]/l[1],d=1/u,m=1/p,f=Math.ceil(d)*2+2,x=Math.ceil(m)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${p});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${m});

        const int winHeight = int(${f});
        const int winWidth = int(${x});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${c}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${n-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${s-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

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

        setOutput(accumulator);
      }
    `}};function Nb(o){let{inputs:e,backend:t,attrs:r}=o,{images:n,dy:s}=e,{alignCorners:i}=r,c=new yr(s.shape,n.shape,i);return t.runWebGLProgram(c,[s],s.dtype)}var cu={kernelName:Ib,backendName:"webgl",kernelFunc:Nb};import{env as Eb,ResizeNearestNeighbor as kb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Rr=class{constructor(e,t,r,n,s){this.variableNames=["A"],this.outputShape=[];let[i,c,a,l]=e;this.outputShape=[i,t,r,l];let u=[n&&t>1?c-1:c,n&&r>1?a-1:a],p=[n&&t>1?t-1:t,n&&r>1?r-1:r],d=n?"0.5":"0.0",m;s?m="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":m="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/p[0]},
          ${u[1]/p[1]});
      const vec2 inputShapeRC = vec2(${c}.0, ${a}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${m};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}};var Tr=class{constructor(e,t,r,n,s){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];let[i,c,a,l]=e;this.outputShape=[i,t,r,l];let u=[n&&t>1?c-1:c,n&&r>1?a-1:a],p=[n&&t>1?t-1:t,n&&r>1?r-1:r],d=n?"0.5":"0.0",m;s?m="max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":m="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/p[0]},
          ${u[1]/p[1]},
          ${u[1]/p[1]});
      const vec3 inputShapeRC = vec3(${c}.0, ${a}.0,
                                     ${a}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${m};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${r-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}};function _b(o){let{inputs:e,backend:t,attrs:r}=o,{images:n}=e,{alignCorners:s,halfPixelCenters:i,size:c}=r,[a,l]=c,u=Eb().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Tr(n.shape,a,l,s,i):new Rr(n.shape,a,l,s,i);return t.runWebGLProgram(u,[n],n.dtype)}var lu={kernelName:kb,backendName:"webgl",kernelFunc:_b};import{ResizeNearestNeighborGrad as Ab}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var wr=class{constructor(e,t,r){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;let[,n,s]=t,[,i,c]=e,a=[r&&i>1?n-1:n,r&&c>1?s-1:s],l=[r&&i>1?i-1:i,r&&c>1?c-1:c],u=a[0]/l[0],p=a[1]/l[1],d=1/u,m=1/p,f=Math.ceil(d)*2+2,x=Math.ceil(m)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${p});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${m});

        const int winHeight = int(${f});
        const int winWidth = int(${x});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${c}) {
              continue;
            }

            float sourceFracRow =
              float(${a[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${a[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${n}) - 1),
                ${r} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${s}) - 1),
                ${r} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}};function Fb(o){let{inputs:e,backend:t,attrs:r}=o,{images:n,dy:s}=e,{alignCorners:i}=r,c=new wr(s.shape,n.shape,i);return t.runWebGLProgram(c,[s],s.dtype)}var uu={kernelName:Ab,backendName:"webgl",kernelFunc:Fb};import{env as Db,Reverse as Pb,util as Ob}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ir=class{constructor(e,t){this.variableNames=["x"];let r=e.length;if(r>4)throw new Error(`WebGL backend: Reverse of rank-${r} tensor is not yet supported`);if(this.outputShape=e,r===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${e[0]} - coord - 1));
        }
      `;return}let n=c=>t.indexOf(c)!==-1&&e[c]!==1?`${e[c]} - coords[${c}] - 1`:`coords[${c}]`,s=e.map((c,a)=>n(a)).join(","),i=N(r);this.userCode=`
      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${s}));
      }
    `}};var Nr=class{constructor(e,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;let r=e.length;if(r>4)throw new Error(`WebGL backend: Reverse of rank-${r} tensor is not yet supported`);this.outputShape=e;let n=L("rc",r),s=`${n[r-1]} + 1 < ${this.outputShape[r-1]}`,i=`${n[r-2]} + 1 < ${this.outputShape[r-2]}`,c=N(r);r===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${e[0]} - rc - 1),
            ${e[0]} - rc - 1);
          if(${s}){
              result.g = getChannel(getX(${e[0]} - (rc  + 1) - 1),
                ${e[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${c} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${a(n.slice())};
          if(${s}){
            result.g = ${l(n.slice())};
          }
          if(${i}) {
            result.b = ${u(n.slice())};
            if(${s}) {
              result.a = ${p(n.slice())};
            }
          }
          setOutput(result);
        }
    `;function a(f){return d(f)}function l(f){return f[r-1]="("+f[r-1]+" + 1)",d(f)}function u(f){return f[r-2]="("+f[r-2]+" + 1)",d(f)}function p(f){return f[r-1]="("+f[r-1]+" + 1)",f[r-2]="("+f[r-2]+" + 1)",d(f)}function d(f){let x=e.map((C,v)=>m(v,f)),g=x.join(","),h=x.slice(-2).join(",");return`getChannel(getX(${g}), vec2(${h}))`}function m(f,x){return t.indexOf(f)!==-1&&e[f]!==1?`${e[f]} - ${x[f]} - 1`:`${x[f]}`}}};function Lb(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{dims:s}=r,i=n.shape.length,c=Ob.parseAxisParam(s,n.shape);if(i===0)return B({inputs:{x:n},backend:t});let a=Db().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Nr(n.shape,c):new Ir(n.shape,c);return t.runWebGLProgram(a,[n],n.dtype)}var pu={kernelName:Pb,backendName:"webgl",kernelFunc:Lb};import{backend_util as Bb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{RotateWithOffset as Ub}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Er=class{constructor(e,t){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];let r=e[1],n=e[2];this.outputShape=e;let s="";typeof t=="number"?s=`float outputValue = ${t.toFixed(2)};`:s=`
        vec3 fill = vec3(${t.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${s}
          if(coordX >= 0 && coordX < ${n} && coordY >= 0 && coordY < ${r}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}};var du={kernelName:Ub,backendName:"webgl",kernelFunc:({inputs:o,attrs:e,backend:t})=>{let{image:r}=o,{radians:n,fillValue:s,center:i}=e,c=t,a=new Er(r.shape,s),[l,u]=Bb.getImageCenter(i,r.shape[1],r.shape[2]),p=[[l,u,Math.sin(n),Math.cos(n)]];return c.runWebGLProgram(a,[r],r.dtype,p)}};import{Round as Vb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Wb=`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`,Mb=R({opSnippet:Wb}),mu={kernelName:Vb,backendName:"webgl",kernelFunc:Mb};import{Rsqrt as Gb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zb="return inversesqrt(x);",Hb=R({opSnippet:zb,cpuKernelImpl:ci}),fu={kernelName:Gb,backendName:"webgl",kernelFunc:Hb};import{backend_util as Xb,env as Kb,ScatterNd as qb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var ke=class{constructor(e,t,r,n,s,i,c=!0,a=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;let l=N(s.length),u=N(i.length),p="";r===1?p="i":r===2&&(p="i, j");let d=`getIndices(${p})`,m="";n===1?m="i":n===2&&(m="i, coords[1]");let f=`getUpdates(${m})`,x="";a&&(x="coords[0], coords[1]");let g=`getDefaultValue(${x})`,h=t>1?"strides[j]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${u} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${e}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${t}; j++) {
              int index = round(${d});
              flattenedIndex += index * ${h};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${f};
              found = true;
            }
          }
          setOutput(mix(${g}, sum, float(found)));
        }
      `}};var kr=class{constructor(e,t,r,n,s,i,c=!0,a=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=i;let l=N(s.length),u=N(i.length),p="";r===1?p="i":r===2&&(p="i, j");let d=`getIndices(${p})`,m="";n===1?m="i":n===2&&(m="i, coords[1]");let f=`getUpdates(${m})`,x="";a&&(x="coords[0], coords[1]");let g=`getDefaultValue(${x})`,h=t>1?"strides[j]":"strides",C=t>1?"strides[j + 1]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${u} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${e}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${t}; j+=2) {
              ivec4 index = round(${d});
              flattenedIndex += index.xz * ${h};
              if (j + 1 < ${t}) {
                flattenedIndex += index.yw * ${C};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${f};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${g}, sum, found));
        }
      `}};function jb(o){let{inputs:e,backend:t,attrs:r}=o,{indices:n,updates:s}=e,{shape:i}=r,{sliceRank:c,numUpdates:a,sliceSize:l,strides:u,outputSize:p}=Xb.calculateShapes(s,n,i),d=[p/l,l];if(p===0)return t.makeTensorInfo(i,n.dtype);let m=$({inputs:{x:n},backend:t,attrs:{shape:[a,c]}}),f=$({inputs:{x:s},backend:t,attrs:{shape:[a,l]}}),x=t.makeTensorInfo([],"float32",new Float32Array([0])),g;Kb().getBool("WEBGL_PACK")?g=new kr(a,c,m.shape.length,f.shape.length,u,d):g=new ke(a,c,m.shape.length,f.shape.length,u,d);let h=t.runWebGLProgram(g,[f,m,x],f.dtype),C=$({inputs:{x:h},backend:t,attrs:{shape:i}});return t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(h),t.disposeIntermediateTensorInfo(x),C}var hu={kernelName:qb,backendName:"webgl",kernelFunc:jb};import{SearchSorted as Qb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{env as Yb}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var _r=class{constructor(e,t,r,n){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,r];let s="while (left < right) {",i=`for (int i = 0; i < ${Math.ceil(Math.log2(t+1))}; ++i) { if (left >= right) break;`,c=Yb().getNumber("WEBGL_VERSION")===2?s:i,a=n==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${c}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${a} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}};function Zb(o){let{inputs:e,backend:t,attrs:r}=o,{sortedSequence:n,values:s}=e,{side:i}=r,c=new _r(n.shape[0],n.shape[1],s.shape[1],i),a=[[n.shape[1]]];return t.runWebGLProgram(c,[n,s],"int32",a)}var xu={kernelName:Qb,backendName:"webgl",kernelFunc:Zb};import{Select as Jb,upcastType as ev}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Ar=class{constructor(e,t,r){this.variableNames=["c","a","b"],this.outputShape=t;let n,s;if(r>4)throw Error(`Where for rank ${r} is not yet supported`);if(r===1)s="resRC",n="resRC";else{let c=["resRC.x","resRC.y","resRC.z","resRC.w"],a=[],l=[];for(let u=0;u<t.length;u++)l.push(`${c[u]}`),u<e&&a.push(`${c[u]}`);n=a.join(),s=l.join()}let i=N(r);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${n});
        if (cVal >= 1.0) {
          setOutput(getA(${s}));
        } else {
          setOutput(getB(${s}));
        }
      }
    `}};function tv(o){let{inputs:e,backend:t}=o,{condition:r,t:n,e:s}=e,i=new Ar(r.shape.length,n.shape,n.shape.length);return t.runWebGLProgram(i,[r,n,s],ev(n.dtype,s.dtype))}var gu={kernelName:Jb,backendName:"webgl",kernelFunc:tv};import{backend_util as Cu,Selu as ov}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var rv=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${Cu.SELU_SCALEALPHA};
  float scale = ${Cu.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,nv=R({opSnippet:rv}),bu={kernelName:ov,backendName:"webgl",kernelFunc:nv};import{Sigmoid as sv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var iv=ie+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,av=`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cv=R({opSnippet:iv,packedOpSnippet:av,cpuKernelImpl:ui}),vu={kernelName:sv,backendName:"webgl",kernelFunc:cv};import{Sign as lv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var uv=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,pv=R({opSnippet:uv}),$u={kernelName:lv,backendName:"webgl",kernelFunc:pv};import{Sin as dv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var mv=ie+`
  return sin(x);
`,fv=`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${oe}
  return result;
`,hv=R({opSnippet:mv,packedOpSnippet:fv}),Su={kernelName:dv,backendName:"webgl",kernelFunc:hv};import{Sinh as xv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var gv=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,Cv=R({opSnippet:gv}),yu={kernelName:xv,backendName:"webgl",kernelFunc:Cv};import{Softplus as bv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var vv=`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`,$v=R({opSnippet:vv}),Ru={kernelName:bv,backendName:"webgl",kernelFunc:$v};import{backend_util as ls,SpaceToBatchND as Sv,util as yv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Rv=o=>{let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{blockShape:s,paddings:i}=r;yv.assert(n.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let c=s.reduce((h,C)=>h*C),a=[[0,0]];a.push(...i);for(let h=1+s.length;h<n.shape.length;++h)a.push([0,0]);let l=[],u=as({inputs:{x:n},backend:t,attrs:{paddings:a,constantValue:0}}),p=ls.getReshaped(u.shape,s,c,!1),d=ls.getPermuted(p.length,s.length,!1),m=ls.getReshapedPermuted(u.shape,s,c,!1),f=$({inputs:{x:u},backend:t,attrs:{shape:p}}),x=P({inputs:{x:f},backend:t,attrs:{perm:d}}),g=$({inputs:{x},backend:t,attrs:{shape:m}});return l.push(u),l.push(f),l.push(x),l.forEach(h=>t.disposeIntermediateTensorInfo(h)),g},Tu={kernelName:Sv,backendName:"webgl",kernelFunc:Rv};import{SparseFillEmptyRows as Tv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function wv(o){let{inputs:e,backend:t}=o,{indices:r,values:n,denseShape:s,defaultValue:i}=e;if(s.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${s.shape}`);if(r.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${r.shape}`);if(n.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${n.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);let c=t.readSync(r.dataId),a=t.readSync(n.dataId),l=t.readSync(s.dataId),u=t.readSync(i.dataId)[0],[p,d,m,f,x]=di(c,r.shape,r.dtype,a,n.dtype,l,u);return[t.makeTensorInfo(d,r.dtype,p),t.makeTensorInfo([d[0]],n.dtype,m),t.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(g=>Number(g)))),t.makeTensorInfo([x.length],r.dtype,new Int32Array(x))]}var wu={kernelName:Tv,backendName:"webgl",kernelFunc:wv};import{SparseReshape as Iv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Nv(o){let{inputs:e,backend:t}=o,{inputIndices:r,inputShape:n,newShape:s}=e;if(r.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${r.shape}`);if(n.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${n.shape}`);if(s.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${s.shape}`);let i=Array.from(t.readSync(n.dataId)),c=t.readSync(r.dataId),a=Array.from(t.readSync(s.dataId)),[l,u,p]=mi(c,r.shape,r.dtype,i,a);return[t.makeTensorInfo(u,r.dtype,l),t.makeTensorInfo([p.length],s.dtype,new Int32Array(p))]}var Iu={kernelName:Iv,backendName:"webgl",kernelFunc:Nv};import{SparseSegmentMean as Ev}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function kv(o){let{inputs:e,backend:t}=o,{data:r,indices:n,segmentIds:s}=e;if(r.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
              ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
              ${s.shape}`);let i=t.readSync(r.dataId),c=t.readSync(n.dataId),a=t.readSync(s.dataId),[l,u]=io(i,r.shape,r.dtype,c,a,!0);return t.makeTensorInfo(u,r.dtype,l)}var Nu={kernelName:Ev,backendName:"webgl",kernelFunc:kv};import{SparseSegmentSum as _v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Av(o){let{inputs:e,backend:t}=o,{data:r,indices:n,segmentIds:s}=e;if(r.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${s.shape}`);let i=t.readSync(r.dataId),c=t.readSync(n.dataId),a=t.readSync(s.dataId),[l,u]=io(i,r.shape,r.dtype,c,a);return t.makeTensorInfo(u,r.dtype,l)}var Eu={kernelName:_v,backendName:"webgl",kernelFunc:Av};import{backend_util as Fv,SparseToDense as Dv,util as Pv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Ov(o){let{inputs:e,backend:t,attrs:r}=o,{sparseIndices:n,sparseValues:s,defaultValue:i}=e,{outputShape:c}=r,{sliceRank:a,numUpdates:l,sliceSize:u,strides:p,outputSize:d}=Fv.calculateShapes(s,n,c),m=!1;if(s.dtype==="string"){let h=t.bufferSync(n),C=t.bufferSync(s),v=Pv.decodeString(t.readSync(i.dataId)[0]),b=li(h,C,c,d,u,l,a,p,v,m);return t.makeTensorInfo(c,b.dtype,b.values)}let f=new ke(l,a,n.shape.length,s.shape.length,p,[d,1],m),x=t.runWebGLProgram(f,[s,n,i],s.dtype),g=$({inputs:{x},backend:t,attrs:{shape:c}});return t.disposeIntermediateTensorInfo(x),g}var ku={kernelName:Dv,backendName:"webgl",kernelFunc:Ov};import{backend_util as Lv,SplitV as Bv,util as Uv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Vv(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{numOrSizeSplits:s,axis:i}=r,c=Uv.parseAxisParam(i,n.shape)[0],a=Lv.prepareSplitSize(n,s,c),l=n.shape.length,u=new Array(l).fill(0),p=n.shape.slice();return a.map(d=>{let m=[...p];m[c]=d;let f=pe({inputs:{x:n},backend:t,attrs:{begin:u,size:m}});return u[c]+=d,f})}var _u={kernelName:Bv,backendName:"webgl",kernelFunc:Vv};import{Sqrt as Wv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Au="return sqrt(x);",Mv=R({opSnippet:Au,packedOpSnippet:Au,cpuKernelImpl:fi}),Fu={kernelName:Wv,backendName:"webgl",kernelFunc:Mv};import{Square as Gv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var zv="return x * x;",Hv=R({opSnippet:zv}),Du={kernelName:Gv,backendName:"webgl",kernelFunc:Hv};import{SquaredDifference as Xv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Pu="return (a - b) * (a - b);",Kv=A({opSnippet:Pu,packedOpSnippet:Pu}),Ou={kernelName:Xv,backendName:"webgl",kernelFunc:Kv};import{backend_util as qv,StaticRegexReplace as jv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Yv(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e;if(n.dtype!=="string")throw new Error("Input must be of datatype string");let s=t.readSync(n.dataId),i=qv.fromUint8ToStringArray(s),c=hi(i,"string",r);return t.makeTensorInfo(n.shape,"string",c)}var Lu={kernelName:jv,backendName:"webgl",kernelFunc:Yv};import{Step as Qv}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function Zv({inputs:o,attrs:e,backend:t}){let{x:r}=o,n=W+`
    return x > 0.0 ? 1.0 : float(${e.alpha});
  `,s=new z(r.shape,n);return t.runWebGLProgram(s,[r],r.dtype)}var Bu={kernelName:Qv,backendName:"webgl",kernelFunc:Zv};import{buffer as Jv,slice_util as Uu,StridedSlice as e$,util as t$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Fr=class{constructor(e,t,r){this.variableNames=["x"],this.outputShape=r;let n=r.length,s=N(r.length),i=N(r.length),c="";if(n===1)c="coords * strides + begin";else{let a=0;c=r.map((l,u)=>(a++,r.length===1?`coords * strides[${u}] + begin[${u}]`:`coords[${a-1}] * strides[${u}] + begin[${u}]`)).join(",")}this.userCode=`
      ${s} begin = ${s}(${e});
      ${s} strides = ${s}(${t});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${c}));
      }
    `}};function o$(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{begin:s,end:i,strides:c,beginMask:a,endMask:l,ellipsisMask:u,newAxisMask:p,shrinkAxisMask:d}=r,{finalShapeSparse:m,finalShape:f,isIdentity:x,sliceDim0:g,isSimpleSlice:h,begin:C,end:v,strides:b}=Uu.sliceInfo(n.shape,s,i,c,a,l,u,p,d),S;if(x)S=$({inputs:{x:n},backend:t,attrs:{shape:f}});else if(g||h){t$.assert(n.shape.length>=1,()=>`Input must have rank at least 1, got: ${n.shape.length}`);let I=Uu.computeOutShape(C,v,b),T=pe({inputs:{x:n},backend:t,attrs:{begin:C,size:I}});S=$({inputs:{x:T},backend:t,attrs:{shape:f}}),t.disposeIntermediateTensorInfo(T)}else if(t.shouldExecuteOnCPU([n])){let T=t.readSync(n.dataId),_=Jv(n.shape,n.dtype,T),k=xi(m,_,b,C);S=t.makeTensorInfo(f,n.dtype,k.values)}else{let T=new Fr(C,b,m);S=t.runWebGLProgram(T,[n],n.dtype)}let E=$({inputs:{x:S},backend:t,attrs:{shape:f}});return t.disposeIntermediateTensorInfo(S),E}var Vu={kernelName:e$,backendName:"webgl",kernelFunc:o$};import{StringNGrams as r$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function n$(o){let{inputs:e,backend:t,attrs:r}=o,{separator:n,nGramWidths:s,leftPad:i,rightPad:c,padWidth:a,preserveShortSequences:l}=r,{data:u,dataSplits:p}=e,d=t.readSync(u.dataId),m=t.readSync(p.dataId),[f,x]=gi(d,m,n,s,i,c,a,l);return[t.makeTensorInfo([f.length],"string",f),t.makeTensorInfo(p.shape,"int32",x)]}var Wu={kernelName:r$,backendName:"webgl",kernelFunc:n$};import{StringSplit as s$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function i$(o){let{inputs:e,backend:t,attrs:r}=o,{skipEmpty:n}=r,{input:s,delimiter:i}=e;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(s.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${s.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);let c=t.readSync(s.dataId),a=t.readSync(i.dataId)[0],[l,u,p]=Ci(c,a,n),d=u.length;return[t.makeTensorInfo([d,2],"int32",l),t.makeTensorInfo([d],"string",u),t.makeTensorInfo([2],"int32",new Int32Array(p))]}var Mu={kernelName:s$,backendName:"webgl",kernelFunc:i$};import{StringToHashBucketFast as a$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function c$(o){let{inputs:e,backend:t,attrs:r}=o,{numBuckets:n}=r,{input:s}=e;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(n<=0)throw new Error("Number of buckets must be at least 1");let i=t.readSync(s.dataId),c=bi(i,n);return t.makeTensorInfo(s.shape,"int32",c)}var Gu={kernelName:a$,backendName:"webgl",kernelFunc:c$};import{Tan as l$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var u$="return tan(x);",p$=R({opSnippet:u$}),zu={kernelName:l$,backendName:"webgl",kernelFunc:p$};import{Tanh as d$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var m$=`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`,f$=R({opSnippet:m$}),Hu={kernelName:d$,backendName:"webgl",kernelFunc:f$};import{backend_util as h$,TensorScatterUpdate as x$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function g$(o){let{inputs:e,backend:t,attrs:r}=o,{tensor:n,indices:s,updates:i}=e,{}=r,{sliceRank:c,numUpdates:a,sliceSize:l,strides:u,outputSize:p}=h$.calculateShapes(i,s,n.shape),d=[p/l,l];if(p===0)return t.makeTensorInfo(n.shape,s.dtype);let m=$({inputs:{x:s},backend:t,attrs:{shape:[a,c]}}),f=$({inputs:{x:i},backend:t,attrs:{shape:[a,l]}}),x=$({inputs:{x:n},backend:t,attrs:{shape:d}}),g=new ke(a,c,m.shape.length,f.shape.length,u,d,!1,!0),h=t.runWebGLProgram(g,[f,m,x],x.dtype),C=$({inputs:{x:h},backend:t,attrs:{shape:n.shape}});return t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(h),C}var Xu={kernelName:x$,backendName:"webgl",kernelFunc:g$};import{buffer as b$,Tile as v$,util as $$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Dr=class{constructor(e,t){this.variableNames=["A"];let r=new Array(e.length);for(let i=0;i<r.length;i++)r[i]=e[i]*t[i];this.outputShape=r,this.rank=r.length;let n=N(this.rank),s=C$(e);this.userCode=`
      void main() {
        ${n} resRC = getOutputCoords();
        setOutput(getA(${s}));
      }
    `}};function C$(o){let e=o.length;if(e>5)throw Error(`Tile for rank ${e} is not yet supported`);if(e===1)return`imod(resRC, ${o[0]})`;let t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],r=[];for(let n=0;n<o.length;n++)r.push(`imod(${t[n]}, ${o[n]})`);return r.join()}function us(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{reps:s}=r;if(n.dtype==="string"||n.shape.length>5){let a=t.readSync(n.dataId),l=n.dtype==="string"?a.map(d=>$$.decodeString(d)):a,u=b$(n.shape,n.dtype,l),p=$i(u,s);return t.makeTensorInfo(p.shape,p.dtype,p.values)}let i=new Dr(n.shape,s);return t.runWebGLProgram(i,[n],n.dtype)}var Ku={kernelName:v$,backendName:"webgl",kernelFunc:us};import{env as qu,TopK as S$,util as y$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Pr=class{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=e,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}},Or=class{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=e,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}};function We(o,e){e!==null&&o.disposeIntermediateTensorInfo(e)}function ju(o){let e=1;for(;e<o;)e*=2;return e}function R$(o){let{inputs:e,backend:t,attrs:r}=o,{x:n}=e,{k:s,sorted:i}=r,c=qu().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),a=qu().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),l=n.shape,u=l[l.length-1];if(t.shouldExecuteOnCPU([n])||u<c||s>a){let k=t.readSync(n.dataId),[U,V]=Si(k,l,n.dtype,s,i);return[t.makeTensorInfo(U.shape,U.dtype,U.values),t.makeTensorInfo(V.shape,V.dtype,V.values)]}if(s===0)return l[l.length-1]=0,[t.makeTensorInfo(l,n.dtype,[]),t.makeTensorInfo(l,"int32",[])];if(u===1)return[n,Se({attrs:{shape:l,dtype:"int32",value:0},backend:t})];let p=t.texData.get(n.dataId),d=p!==null&&p.isPacked,m=d?t.unpackTensor(n):n,x=y$.sizeFromShape(l)/u,g=$({inputs:{x:m},attrs:{shape:[x,u]},backend:t});d&&We(t,m);let h=ju(s),C=ju(u),v=null,b=()=>v===null?[g,g]:[g,v],S=(k,U,V)=>{let de=b(),Z=new Pr(V),se=[[u],[v===null?1:0],[Number.NEGATIVE_INFINITY],[k],[U]],ae=v;v=t.runWebGLProgram(Z,de,"int32",se),We(t,ae)};for(let k=1;k<h;k*=2){let U=k*2;for(let V=k;V>=1;V/=2)S(U,V,[x,C])}for(let k=C;k>h;k/=2){let U=b(),V=new Or([x,k/2]),Z=[[u],[v===null?1:0],[h]],ne=v;v=t.runWebGLProgram(V,U,"int32",Z),We(t,ne);let se=h/2,ae=se*2;for(let K=se;K>=1;K/=2)S(ae,K,v.shape)}let E=v;v=pe({inputs:{x:v},backend:t,attrs:{begin:0,size:[x,s]}}),We(t,E);let I=os({inputs:{x:g,indices:v},backend:t,attrs:{axis:1,batchDims:1}});We(t,g);let T=l.slice(0,-1);T.push(s),E=v,v=$({inputs:{x:v},attrs:{shape:T},backend:t}),We(t,E);let _=I;return I=$({inputs:{x:I},attrs:{shape:T},backend:t}),We(t,_),[I,v]}var Yu={kernelName:S$,backendName:"webgl",kernelFunc:R$};import{Transform as T$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Lr=class{constructor(e,t,r,n,s,i){this.variableNames=["Image","Transforms"],this.outputShape=i;let c=r==="nearest"?1:2,a;switch(n){case"constant":a=1;break;case"reflect":a=2;break;case"wrap":a=3;break;case"nearest":a=4;break;default:a=1;break}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${a} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${a} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${a} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${e} && 0 <= coordX && coordX < ${t}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${s});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${s});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${t}));
                float mapY = mapCoord(inY, float(${e}));

                if (${c} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}};function w$(o){let{inputs:e,backend:t,attrs:r}=o,{image:n,transforms:s}=e,{interpolation:i,fillMode:c,fillValue:a,outputShape:l}=r,[u,p,d,m]=n.shape,[f,x]=l??[p,d],g=[u,f,x,m],h=new Lr(p,d,i,c,a,g);return t.runWebGLProgram(h,[n,s],"float32")}var Qu={kernelName:T$,backendName:"webgl",kernelFunc:w$};import{Unique as I$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function N$(o){let{inputs:e,attrs:t,backend:r}=o,{axis:n}=t,{x:s}=e;ce(s,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let i=r.readSync(s.dataId),{outputValues:c,outputShape:a,indices:l}=yi(i,n,s.shape,s.dtype);return[r.makeTensorInfo(a,s.dtype,c),r.makeTensorInfo([l.length],"int32",l)]}var Zu={kernelName:I$,backendName:"webgl",kernelFunc:N$};import{Unpack as E$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function k$(o){let{inputs:e,backend:t,attrs:r}=o,{value:n}=e,{axis:s}=r;s<0&&(s+=n.shape.length);let i=n,c=i.shape.length,a=n.shape[s],l=new Array(c-1),u=0;for(let x=0;x<c;x++)x!==s&&(l[u++]=i.shape[x]);let p=[],d=new Array(c).fill(0),m=i.shape.slice();m[s]=1;let f=new Array(a);for(let x=0;x<f.length;x++){d[s]=x;let g=pe({inputs:{x:i},backend:t,attrs:{begin:d,size:m}}),h=$({inputs:{x:g},backend:t,attrs:{shape:l}});f[x]=h,p.push(g)}return p.forEach(x=>t.disposeIntermediateTensorInfo(x)),f}var Ju={kernelName:E$,backendName:"webgl",kernelFunc:k$};import{backend_util as Pt,sumOutType as _$,UnsortedSegmentSum as A$,util as F$}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var Br=class{constructor(e,t){this.variableNames=["x","segmentIds"];let r=e.windowSize,n=e.batchSize,s=e.inSize,i=e.numSegments,c=i*Math.ceil(s/r);this.outputShape=[n,c];let a="0.0",l="sumValue",u=Math.floor(r/4)*4,p=r%4,d=`
        sumValue += dot(values, segFilter);
    `,m="";s%r>0&&(m=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `);let f="";s%r>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = ${a};

      float getValue(int batch, int inIdx) {
        ${m}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${f}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${r}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${p===1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${d}
        } else if (${p===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${d}
        } else if (${p===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${d}
        }
        setOutput(${l});
      }
    `}};function D$(o){let{inputs:e,backend:t,attrs:r}=o,{x:n,segmentIds:s}=e,{numSegments:i}=r,c=n.shape.length,a=[],l=0,u=Pt.getAxesPermutation([l],c),p=n;u!=null&&(p=P({inputs:{x:n},backend:t,attrs:{perm:u}}),a.push(p),l=Pt.getInnerMostAxes(1,c)[0]);let d=Pt.segment_util.computeOutShape(p.shape,l,i),m=F$.sizeFromShape([p.shape[l]]),f=$({inputs:{x:p},backend:t,attrs:{shape:[-1,m]}});a.push(f);let x=_$(n.dtype),g=(b,S,E,I,T)=>{let _=b.shape[0],k=b.shape[1],U=Pt.segment_util.segOpComputeOptimalWindowSize(k,T),V={windowSize:U,inSize:k,batchSize:_,numSegments:T},de=new Br(V,S),Z=t.compileAndRun(de,[b,E],I);if(a.push(Z),Z.shape[1]===T)return Z;let ne=cs({backend:t,attrs:{start:0,stop:T,step:1,dtype:"float32"}}),se=us({inputs:{x:ne},backend:t,attrs:{reps:[k/U]}});return a.push(ne),a.push(se),g(Z,S,se,I,T)},h=g(f,"unsortedSegmentSum",s,x,i),C=$({inputs:{x:h},backend:t,attrs:{shape:d}}),v=C;if(u!=null){a.push(C);let b=Pt.getUndoAxesPermutation(u);v=P({inputs:{x:v},backend:t,attrs:{perm:b}})}return a.forEach(b=>t.disposeIntermediateTensorInfo(b)),v}var ep={kernelName:A$,backendName:"webgl",kernelFunc:D$};var O$=[oa,na,sa,ia,ca,ua,da,fa,ga,Ca,ba,va,$a,Sa,ya,wa,Ia,Na,Ea,ka,_a,Da,Pa,La,Ba,za,Xa,Ka,Gi,ja,Ja,oc,nc,ic,ac,cc,lc,uc,pc,dc,hc,xc,gc,Cc,vc,$c,Sc,yc,Rc,Tc,wc,Ic,Nc,Ec,kc,_c,Fc,Dc,Pc,Oc,Bc,Uc,Vc,Gc,Xc,qc,jc,Yc,Qc,Mi,Zc,Ya,Jc,el,tl,zi,ol,rl,nl,sl,il,al,cl,ll,ul,pl,hl,xl,bl,vl,$l,Sl,wl,El,_l,Al,Fl,Dl,Ul,Yi,Vl,Wl,Ml,Gl,Ua,zl,Kl,jl,Yl,Ql,Hi,Jl,eu,tu,ou,ru,Va,Pl,nu,su,iu,Zi,au,cu,lu,uu,pu,du,mu,fu,hu,xu,gu,bu,vu,$u,Su,yu,Fa,Bl,Ru,Tu,wu,Iu,Nu,Eu,ku,_u,Fu,Du,Ou,Lu,Bu,Vu,Wu,Mu,Gu,Ll,ea,zu,Hu,Xu,Ku,Yu,Qu,ta,Zu,Ju,ep,Hl];for(let o of O$)P$(o);export{Pe as GPGPUContext,ot as MathBackendWebGL,Wi as forceHalfFloat,En as gpgpu_util,Wr as setWebGLContext,Td as version_webgl,b0 as webgl,Ke as webgl_util};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/canvas_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/tex_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/webgl_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/flags_webgl.js:
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

@tensorflow/tfjs-backend-webgl/dist/glsl_version.js:
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

@tensorflow/tfjs-backend-webgl/dist/shader_compiler_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/shader_compiler.js:
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

@tensorflow/tfjs-backend-webgl/dist/gpgpu_math.js:
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

@tensorflow/tfjs-backend-webgl/dist/decode_matrix_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/decode_matrix_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/encode_float_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/encode_float_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/encode_matrix_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/encode_matrix_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/gpgpu_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/gpgpu_context.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/shared.js:
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

@tensorflow/tfjs-backend-webgl/dist/packing_util.js:
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

@tensorflow/tfjs-backend-webgl/dist/pack_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/texture_manager.js:
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

@tensorflow/tfjs-backend-webgl/dist/unaryop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/unaryop_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/unpack_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/backend_webgl.js:
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

@tensorflow/tfjs-backend-webgl/dist/version.js:
  (** @license See the LICENSE file. *)

@tensorflow/tfjs-backend-webgl/dist/webgl.js:
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

@tensorflow/tfjs-backend-webgl/dist/base.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-backend-webgl/dist/binaryop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Identity.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Complex.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LeakyRelu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Prelu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/kernel_funcs_utils.js:
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

@tensorflow/tfjs-backend-webgl/dist/binaryop_complex_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Multiply.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reshape.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Reshape.js:
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

@tensorflow/tfjs-backend-webgl/dist/mean_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/reduce_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reduce.js:
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

@tensorflow/tfjs-backend-webgl/dist/transpose_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/transpose_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sum_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sum.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/_FusedMatMul.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Abs.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Acos.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Acosh.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Add.js:
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

@tensorflow/tfjs-backend-webgl/dist/addn_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/addn_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/AddN.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/All.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Any.js:
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

@tensorflow/tfjs-backend-webgl/dist/argminmax_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/argminmax_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/arg_min_max.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMax.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMin.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Asin.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Asinh.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Atan.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Atan2.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Atanh.js:
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

@tensorflow/tfjs-backend-webgl/dist/pool_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3D.js:
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

@tensorflow/tfjs-backend-webgl/dist/avg_pool_backprop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3DGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPoolGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchNorm.js:
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

@tensorflow/tfjs-backend-webgl/dist/slice_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/slice_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Slice.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchToSpaceND.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Bincount.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BitwiseAnd.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/BroadcastArgs.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/NotEqual.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Real.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernel_utils/int.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cast.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Ceil.js:
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

@tensorflow/tfjs-backend-webgl/dist/clip_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/clip_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ClipByValue.js:
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

@tensorflow/tfjs-backend-webgl/dist/complex_abs_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ComplexAbs.js:
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

@tensorflow/tfjs-backend-webgl/dist/concat_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Imag.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Concat_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Concat.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/im2col_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2D_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2D.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_backprop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropFilter.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_backprop_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropInput.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3D.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropFilterV2.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropInputV2.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cos.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cosh.js:
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

@tensorflow/tfjs-backend-webgl/dist/crop_and_resize_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/CropAndResize.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cum_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cumprod.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Cumsum.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/DenseBincount.js:
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

@tensorflow/tfjs-backend-webgl/dist/depth_to_space_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthToSpace.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_gpu_depthwise.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_packed_gpu_depthwise.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNative.js:
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

@tensorflow/tfjs-backend-webgl/dist/conv_backprop_gpu_depthwise.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropFilter.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropInput.js:
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

@tensorflow/tfjs-backend-webgl/dist/diag_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Diag.js:
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

@tensorflow/tfjs-backend-webgl/dist/dilation_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Dilation2D.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Einsum.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Elu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/EluGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Equal.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Erf.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Exp.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ExpandDims.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Expm1.js:
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

@tensorflow/tfjs-backend-webgl/dist/fft_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FFT_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FFT.js:
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

@tensorflow/tfjs-backend-webgl/dist/fill_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Fill.js:
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

@tensorflow/tfjs-backend-webgl/dist/flip_left_right_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FlipLeftRight.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Floor.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FloorDiv.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels_utils/from_pixels_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels_utils/from_pixels_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FusedConv2D.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/FusedDepthwiseConv2D.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/GatherNd.js:
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

@tensorflow/tfjs-backend-webgl/dist/gather_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/GatherV2.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Greater.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/GreaterEqual.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/IFFT.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/IsFinite.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/IsInf.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/IsNaN.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Less.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LessEqual.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LinSpace.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Log.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Log1p.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalAnd.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalNot.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalOr.js:
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

@tensorflow/tfjs-backend-webgl/dist/lrn_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/lrn_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LRN.js:
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

@tensorflow/tfjs-backend-webgl/dist/lrn_grad_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/LRNGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Max_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Max.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Maximum.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3D.js:
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

@tensorflow/tfjs-backend-webgl/dist/max_pool_backprop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3DGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Mean_impl.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Mean.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Min.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Minimum.js:
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

@tensorflow/tfjs-backend-webgl/dist/mirror_pad_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/mirror_pad_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/MirrorPad.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Mod.js:
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

@tensorflow/tfjs-backend-webgl/dist/multinomial_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/RealDiv.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sub.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Softmax.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Multinomial.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Neg.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV3.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV4.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV5.js:
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

@tensorflow/tfjs-backend-webgl/dist/onehot_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/OneHot.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ZerosLike.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/OnesLike.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Pack.js:
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

@tensorflow/tfjs-backend-webgl/dist/pad_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/pad_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/PadV2.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Pow.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Prod.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedGather.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedRange.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedTensorToTensor.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Range.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Reciprocal.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Relu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Relu6.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeBilinear.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_backprop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeBilinearGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighbor.js:
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

@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_backprop_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighborGrad.js:
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

@tensorflow/tfjs-backend-webgl/dist/reverse_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/reverse_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Reverse.js:
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

@tensorflow/tfjs-backend-webgl/dist/rotate_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/RotateWithOffset.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Round.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Rsqrt.js:
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

@tensorflow/tfjs-backend-webgl/dist/scatter_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/scatter_packed_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/ScatterNd.js:
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

@tensorflow/tfjs-backend-webgl/dist/search_sorted_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SearchSorted.js:
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

@tensorflow/tfjs-backend-webgl/dist/select_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Select.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Selu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sigmoid.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sign.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sin.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sinh.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Softplus.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SpaceToBatchND.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseFillEmptyRows.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseReshape.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseSegmentMean.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseSegmentSum.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseToDense.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SplitV.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Sqrt.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Square.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/SquaredDifference.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/StaticRegexReplace.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Step.js:
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

@tensorflow/tfjs-backend-webgl/dist/strided_slice_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/StridedSlice.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/StringNGrams.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/StringSplit.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/StringToHashBucketFast.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Tan.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Tanh.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/TensorScatterUpdate.js:
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

@tensorflow/tfjs-backend-webgl/dist/tile_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Tile.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/TopK.js:
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

@tensorflow/tfjs-backend-webgl/dist/transform_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Transform.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Unique.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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

@tensorflow/tfjs-backend-webgl/dist/kernels/Unpack.js:
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

@tensorflow/tfjs-backend-webgl/dist/segment_gpu.js:
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

@tensorflow/tfjs-backend-webgl/dist/kernels/UnsortedSegmentSum.js:
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

@tensorflow/tfjs-backend-webgl/dist/register_all_kernels.js:
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

@tensorflow/tfjs-backend-webgl/dist/index.js:
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
//# sourceMappingURL=tfjs-backend-webgl.mjs.map