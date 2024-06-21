/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/shader_compiler) denonext production */
import{backend_util as V,util as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{getGlslDifferences as R}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/glsl_version.js";import*as m from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/shader_compiler_util.js";var{getBroadcastDims:O}=V;function fe(e,n,r){let t=[];if(e.forEach(a=>{let h=$.sizeFromShape(a.shapeInfo.logicalShape);if(a.shapeInfo.isUniform?t.push(`uniform float ${a.name}${h>1?`[${h}]`:""};`):(t.push(`uniform sampler2D ${a.name};`),t.push(`uniform int offset${a.name};`)),r.enableShapeUniforms){let{uniformShape:v}=he(r.packedInputs,a.shapeInfo.logicalShape,a.shapeInfo.texShape);switch(v.length){case 1:t.push(`uniform int ${a.name}Shape;`);break;case 2:t.push(`uniform ivec2 ${a.name}Shape;`);break;case 3:t.push(`uniform ivec3 ${a.name}Shape;`);break;case 4:t.push(`uniform ivec4 ${a.name}Shape;`);break;default:break}t.push(`uniform ivec2 ${a.name}TexShape;`)}}),r.enableShapeUniforms){switch(n.logicalShape.length){case 1:t.push("uniform int outShape;");break;case 2:t.push("uniform ivec2 outShape;"),t.push("uniform int outShapeStrides;");break;case 3:t.push("uniform ivec3 outShape;"),t.push("uniform ivec2 outShapeStrides;");break;case 4:t.push("uniform ivec4 outShape;"),t.push("uniform ivec3 outShapeStrides;");break;default:break}t.push("uniform ivec2 outTexShape;")}r.customUniforms&&r.customUniforms.forEach(a=>{t.push(`uniform ${a.type} ${a.name}${a.arrayIndex?`[${a.arrayIndex}]`:""};`)});let o=t.join(`
`),c=e.map(a=>U(a,n,r.packedInputs,r.enableShapeUniforms)).join(`
`),i=n.texShape,u=R(),s=z(u),l,x,d=M(u);return n.isPacked?(l=P(n.logicalShape,i,r.enableShapeUniforms),x=L(u)):(l=E(n.logicalShape,i,r.enableShapeUniforms),x=A(u)),r.packedInputs&&(d+=_),[d,s,x,o,l,c,r.userCode].join(`
`)}function w(e,n=!1){let r=e.shapeInfo.logicalShape;switch(r.length){case 0:return te(e,n);case 1:return re(e,n);case 2:return ce(e,n);case 3:return ae(e,n);case 4:return se(e,n);case 5:return le(e);case 6:return xe(e);default:throw new Error(`${r.length}-D input sampling is not yet supported`)}}function D(e,n){switch(e.shapeInfo.logicalShape.length){case 0:return ee(e);case 1:return ne(e,n);case 2:return oe(e,n);case 3:return ie(e,n);default:return ue(e,n)}}function U(e,n,r=!1,t){let o="";r?o+=D(e,t):o+=w(e,t);let c=e.shapeInfo.logicalShape,i=n.logicalShape;return c.length<=i.length&&(r?o+=pe(e,n):o+=de(e,n)),o}function P(e,n,r){switch(e.length){case 0:return I();case 1:return j(e,n,r);case 2:return Y(e,n,r);case 3:return G(e,n,r);default:return J(e,n,r)}}function E(e,n,r){switch(e.length){case 0:return I();case 1:return H(e,n,r);case 2:return Z(e,n,r);case 3:return X(e,n,r);case 4:return K(e,n,r);case 5:return W(e,n);case 6:return Q(e,n);default:throw new Error(`${e.length}-D output sampling is not yet supported`)}}function z(e){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${e.texture2D}(textureSampler, uv).r;
    }
  `}function A(e){return`
    void setOutput(float val) {
      ${e.output} = vec4(val, 0, 0, 0);
    }
  `}function L(e){return`
    void setOutput(vec4 val) {
      ${e.output} = val;
    }
  `}function M(e){return`${e.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${e.varyingFs} vec2 resultUV;
    ${e.defineOutput}
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
    ${e.defineSpecialNaN}
    ${e.defineSpecialInf}
    ${e.defineRound}

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

    ${B}
    ${b}
    ${q}
  `}var B=`
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
`,b=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,q=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,_=`
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
`;function I(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function j(e,n,r){let t=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];return t[0]===1?r?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${t[1]}.0);
      }
    `:t[1]===1?r?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${t[0]}.0);
      }
    `:r?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      return 2 * (resTexRC.x * ${t[1]} + resTexRC.y);
    }
  `}function H(e,n,r){return n[0]===1?r?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${n[1]}.0);
      }
    `:n[1]===1?r?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${n[0]}.0);
      }
    `:r?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${n[0]}, ${n[1]}));
      return resTexRC.x * ${n[1]} + resTexRC.y;
    }
  `}function G(e,n,r){if(r)return`
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
  `;let t=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)],o=Math.ceil(e[2]/2),c=o*Math.ceil(e[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      int b = index / ${c};
      index -= b * ${c};

      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec3(b, r, c);
    }
  `}function X(e,n,r){if(r)return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${m.getOutputLogicalCoordinatesFromFlatIndexByUniform(["r","c","d"],e)}
    return ivec3(r, c, d);
  }
`;let t=m.getLogicalCoordinatesFromFlatIndex(["r","c","d"],e);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${n[0]}, ${n[1]}));
      int index = resTexRC.x * ${n[1]} + resTexRC.y;
      ${t}
      return ivec3(r, c, d);
    }
  `}function J(e,n,r){if(r)return`
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
  `;let t=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)],o=Math.ceil(e[e.length-1]/2),c=o*Math.ceil(e[e.length-2]/2),i=c,u="",s="b, r, c";for(let l=2;l<e.length-1;l++)i*=e[e.length-l-1],u=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+u,s=`b${l}, `+s;return`
    ivec${e.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      ${u}

      int b = index / ${c};
      index -= b * ${c};

      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec${e.length}(${s});
    }
  `}function K(e,n,r){if(r)return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${m.getOutputLogicalCoordinatesFromFlatIndexByUniform(["r","c","d","d2"],e)}
      return ivec4(r, c, d, d2);
    }
  `;let t=m.getLogicalCoordinatesFromFlatIndex(["r","c","d","d2"],e);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${n[0]}, ${n[1]}));
      int index = resTexRC.x * ${n[1]} + resTexRC.y;
      ${t}
      return ivec4(r, c, d, d2);
    }
  `}function W(e,n){let r=m.getLogicalCoordinatesFromFlatIndex(["r","c","d","d2","d3"],e);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${n[0]},
                             ${n[1]}));

      int index = resTexRC.x * ${n[1]} + resTexRC.y;

      ${r}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function Q(e,n){let r=m.getLogicalCoordinatesFromFlatIndex(["r","c","d","d2","d3","d4"],e);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${n[0]}, ${n[1]}));
      int index = resTexRC.x * ${n[1]} + resTexRC.y;

      ${r}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function Y(e,n,r){let t=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];if($.arraysEqual(e,n))return r?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${t[0]}, ${t[1]}));
      }
    `;let o=Math.ceil(e[1]/2);return r?`
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
                             vec2(${t[0]}, ${t[1]}));

      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec2(r, c);
    }
  `}function Z(e,n,r){return $.arraysEqual(e,n)?r?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${n[0]}, ${n[1]}));
      }
    `:e[1]===1?r?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${n[0]}, ${n[1]}));
        int index = resTexRC.x * ${n[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:e[0]===1?r?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${n[0]}, ${n[1]}));
        int index = resTexRC.x * ${n[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:r?`
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
                             vec2(${n[0]}, ${n[1]}));
      int index = resTexRC.x * ${n[1]} + resTexRC.y;
      int r = index / ${e[1]};
      int c = index - r * ${e[1]};
      return ivec2(r, c);
    }
  `}function T(e){return`offset${e}`}function ee(e){let n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),t=R();return`
    vec4 ${r}() {
      return ${t.texture2D}(${n}, halfCR);
    }
  `}function te(e,n){let r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1);if(e.shapeInfo.isUniform)return`float ${t}() {return ${r};}`;let[o,c]=e.shapeInfo.texShape;if(o===1&&c===1)return`
      float ${t}() {
        return sampleTexture(${r}, halfCR);
      }
    `;let i=T(r);if(n)return`
    float ${t}() {
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], ${i});
      return sampleTexture(${r}, uv);
    }
  `;let[u,s]=e.shapeInfo.texShape;return`
    float ${t}() {
      vec2 uv = uvFromFlat(${u}, ${s}, ${i});
      return sampleTexture(${r}, uv);
    }
  `}function ne(e,n){let r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1),o=e.shapeInfo.texShape,c=R();if(n)return`
    vec4 ${t}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${c.texture2D}(${r}, uv);
    }
  `;let i=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)];return`
    vec4 ${t}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${c.texture2D}(${r}, uv);
    }
  `}function re(e,n){let r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1);if(e.shapeInfo.isUniform)return`
      float ${t}(int index) {
        ${y(e)}
      }
    `;let o=e.shapeInfo.texShape,c=o[0],i=o[1];if(i===1&&c===1)return`
      float ${t}(int index) {
        return sampleTexture(${r}, halfCR);
      }
    `;let u=T(r);return i===1?n?`
      float ${t}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${u}) + 0.5) / float(${r}TexShape[0]));
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${t}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${u}) + 0.5) / ${c}.0);
        return sampleTexture(${r}, uv);
      }
    `:c===1?n?`
      float ${t}(int index) {
        vec2 uv = vec2((float(index + ${u}) + 0.5) / float(${r}TexShape[1]), 0.5);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${t}(int index) {
        vec2 uv = vec2((float(index + ${u}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${r}, uv);
      }
    `:n?`
    float ${t}(int index) {
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index + ${u});
      return sampleTexture(${r}, uv);
    }
  `:`
    float ${t}(int index) {
      vec2 uv = uvFromFlat(${c}, ${i}, index + ${u});
      return sampleTexture(${r}, uv);
    }
  `}function oe(e,n){let r=e.shapeInfo.logicalShape,t=e.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),c=e.shapeInfo.texShape,i=c[0],u=c[1],s=R();if(c!=null&&$.arraysEqual(r,c))return n?`
      vec4 ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${t}TexShape[1], ${t}TexShape[0]);

        return ${s.texture2D}(${t}, uv);
      }
    `:`
      vec4 ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${u}.0, ${i}.0);

        return ${s.texture2D}(${t}, uv);
      }
    `;if(n)return`
    vec4 ${o}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${t}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${s.texture2D}(${t}, uv);
    }
  `;let l=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)],x=Math.ceil(r[1]/2);return`
    vec4 ${o}(int row, int col) {
      vec2 uv = packedUVfrom2D(${x}, ${l[0]}, ${l[1]}, row, col);
      return ${s.texture2D}(${t}, uv);
    }
  `}function ce(e,n){let r=e.shapeInfo.logicalShape,t=e.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),c=e.shapeInfo.texShape;if(c!=null&&$.arraysEqual(r,c)){if(n)return`
      float ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${t}TexShape[1], ${t}TexShape[0]);
        return sampleTexture(${t}, uv);
      }
    `;let p=c[0],a=c[1];return`
    float ${o}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${a}.0, ${p}.0);
      return sampleTexture(${t}, uv);
    }
  `}let{newShape:i,keptDims:u}=$.squeezeShape(r),s=i;if(s.length<r.length){let p=k(e,s),a=["row","col"];return`
      ${w(p,n)}
      float ${o}(int row, int col) {
        return ${o}(${N(a,u)});
      }
    `}if(e.shapeInfo.isUniform)return`
      float ${o}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${r[1]}, 1)));
        ${y(e)}
      }
    `;let l=c[0],x=c[1],d=T(t);return x===1?n?`
      float ${o}(int row, int col) {
        float index = dot(vec3(row, col, ${d}), vec3(${t}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${t}TexShape[0]));
        return sampleTexture(${t}, uv);
      }
    `:`
    float ${o}(int row, int col) {
      float index = dot(vec3(row, col, ${d}), vec3(${r[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${t}, uv);
    }
  `:l===1?n?`
      float ${o}(int row, int col) {
        float index = dot(vec3(row, col, ${d}), vec3(${t}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${t}TexShape[1]), 0.5);
        return sampleTexture(${t}, uv);
      }
    `:`
    float ${o}(int row, int col) {
      float index = dot(vec3(row, col, ${d}), vec3(${r[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${x}.0, 0.5);
      return sampleTexture(${t}, uv);
    }
  `:n?`
      float ${o}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${t}Shape[1] + col + ${d};
        vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index);
        return sampleTexture(${t}, uv);
      }
    `:`
  float ${o}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${r[1]} + col + ${d};
    vec2 uv = uvFromFlat(${l}, ${x}, index);
    return sampleTexture(${t}, uv);
  }
`}function ie(e,n){let r=e.shapeInfo.logicalShape,t=e.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),c=e.shapeInfo.texShape,i=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)];if(r[0]===1){let p=r.slice(1),a=[1,2],h=k(e,p),v=["b","row","col"];return`
        ${D(h,n)}
        vec4 ${o}(int b, int row, int col) {
          return ${o}(${N(v,a)});
        }
      `}let u=R();if(n)return`
    vec4 ${o}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${t}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${t}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${u.texture2D}(${t}, uv);
    }
  `;let s=i[0],l=i[1],x=Math.ceil(r[2]/2),d=x*Math.ceil(r[1]/2);return`
    vec4 ${o}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${s}, ${l}, ${d}, ${x}, b, row, col);
      return ${u.texture2D}(${t}, uv);
    }
  `}function ae(e,n){let r=e.shapeInfo.logicalShape,t=e.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),c=r[1]*r[2],i=r[2],{newShape:u,keptDims:s}=$.squeezeShape(r),l=u;if(l.length<r.length){let v=k(e,l),f=["row","col","depth"];return`
        ${w(v,n)}
        float ${o}(int row, int col, int depth) {
          return ${o}(${N(f,s)});
        }
      `}if(e.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${c}, ${i}, 1)));
        ${y(e)}
      }
    `;let x=e.shapeInfo.texShape,d=x[0],p=x[1],a=e.shapeInfo.flatOffset;if(p===c&&a==null)return n?`
      float ${o}(int row, int col, int depth) {
        int stride1 = ${t}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${t}TexShape[1], ${t}TexShape[0]);
        return sampleTexture(${t}, uv);
      }
    `:`
        float ${o}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${p}.0, ${d}.0);
          return sampleTexture(${t}, uv);
        }
      `;if(p===i&&a==null)return n?`
      float ${o}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${t}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${t}TexShape[1], ${t}TexShape[0]);
        return sampleTexture(${t}, uv);
      }
    `:`
    float ${o}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${r[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${p}.0, ${d}.0);
      return sampleTexture(${t}, uv);
    }
  `;let h=T(t);return n?`
    float ${o}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${t}Shape[1] * ${t}Shape[2];
      int stride1 = ${t}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${h};
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index);
      return sampleTexture(${t}, uv);
    }
    `:`
      float ${o}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${c} + col * ${i} + depth + ${h};
        vec2 uv = uvFromFlat(${d}, ${p}, index);
        return sampleTexture(${t}, uv);
      }
  `}function ue(e,n){let r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1),o=R();if(n)return`
    vec4 ${t}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${r}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${r}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${r}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${o.texture2D}(${r}, uv);
    }
  `;let c=e.shapeInfo.logicalShape,i=c.length,u=e.shapeInfo.texShape,s=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)],l=s[0],x=s[1],d=Math.ceil(c[i-1]/2),p=d*Math.ceil(c[i-2]/2),a="int b, int row, int col",h=`b * ${p} + (row / 2) * ${d} + (col / 2)`;for(let v=2;v<i-1;v++)a=`int b${v}, `+a,p*=c[i-v-1],h=`b${v} * ${p} + `+h;return`
    vec4 ${t}(${a}) {
      int index = ${h};
      int texR = index / ${x};
      int texC = index - texR * ${x};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${x}, ${l});
      return ${o.texture2D}(${r}, uv);
    }
  `}function se(e,n){let r=e.shapeInfo.logicalShape,t=e.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),c=r[3],i=r[2]*c,u=r[1]*i,{newShape:s,keptDims:l}=$.squeezeShape(r);if(s.length<r.length){let S=k(e,s),g=["row","col","depth","depth2"];return`
      ${w(S,n)}
      float ${o}(int row, int col, int depth, int depth2) {
        return ${o}(${N(g,l)});
      }
    `}if(e.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${u}, ${i}, ${c}, 1)));
        ${y(e)}
      }
    `;let x=e.shapeInfo.flatOffset,d=e.shapeInfo.texShape,p=d[0],a=d[1],h=`int stride2 = ${t}Shape[3];`,v=`int stride1 = ${t}Shape[2] * stride2;`,f=`int stride0 = ${t}Shape[1] * stride1;`;if(a===u&&x==null)return n?`
      float ${o}(int row, int col, int depth, int depth2) {
        ${h}
        ${v}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${t}TexShape[1], ${t}TexShape[0]);
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${c}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${a}.0, ${p}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(a===c&&x==null)return n?`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${t}Shape[1] * ${t}Shape[2], ${t}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${t}TexShape[1], ${t}TexShape[0]);
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${r[1]*r[2]}, ${r[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${a}.0, ${p}.0);
        return sampleTexture(${t}, uv);
      }
    `;let C=T(t);return n?`
    float ${o}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${h}
      ${v}
      ${f}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index + ${C});
      return sampleTexture(${t}, uv);
    }
  `:`
    float ${o}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${i} +
          depth * ${c} + depth2;
      vec2 uv = uvFromFlat(${p}, ${a}, index + ${C});
      return sampleTexture(${t}, uv);
    }
  `}function le(e){let n=e.shapeInfo.logicalShape,r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1),o=n[4],c=n[3]*o,i=n[2]*c,u=n[1]*i,{newShape:s,keptDims:l}=$.squeezeShape(n);if(s.length<n.length){let v=k(e,s),f=["row","col","depth","depth2","depth3"];return`
      ${w(v)}
      float ${t}(int row, int col, int depth, int depth2, int depth3) {
        return ${t}(${N(f,l)});
      }
    `}if(e.shapeInfo.isUniform)return`
      float ${t}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${u}, ${i}, ${c}, ${o})) +
          depth3;
        ${y(e)}
      }
    `;let x=e.shapeInfo.flatOffset,d=e.shapeInfo.texShape,p=d[0],a=d[1];if(a===u&&x==null)return`
      float ${t}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${c}, ${o}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${a}.0, ${p}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(a===o&&x==null)return`
      float ${t}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${n[1]*n[2]*n[3]},
               ${n[2]*n[3]}, ${n[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${a}.0, ${p}.0);
        return sampleTexture(${r}, uv);
      }
    `;let h=T(r);return`
    float ${t}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${i} + depth * ${c} +
          depth2 * ${o} + depth3 + ${h};
      vec2 uv = uvFromFlat(${p}, ${a}, index);
      return sampleTexture(${r}, uv);
    }
  `}function xe(e){let n=e.shapeInfo.logicalShape,r=e.name,t="get"+r.charAt(0).toUpperCase()+r.slice(1),{newShape:o,keptDims:c}=$.squeezeShape(n);if(o.length<n.length){let f=k(e,o),C=["row","col","depth","depth2","depth3","depth4"];return`
      ${w(f)}
      float ${t}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${t}(${N(C,c)});
      }
    `}let i=n[5],u=n[4]*i,s=n[3]*u,l=n[2]*s,x=n[1]*l;if(e.shapeInfo.isUniform)return`
      float ${t}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${x}, ${l}, ${s}, ${u})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${y(e)}
      }
    `;let d=e.shapeInfo.flatOffset,p=e.shapeInfo.texShape,a=p[0],h=p[1];if(h===x&&d==null)return`
      float ${t}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${s}, ${u}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${h}.0, ${a}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(h===i&&d==null)return`
      float ${t}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${n[1]*n[2]*n[3]*n[4]},
               ${n[2]*n[3]*n[4]},
               ${n[3]*n[4]},
               ${n[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${h}.0, ${a}.0);
        return sampleTexture(${r}, uv);
      }
    `;let v=T(r);return`
    float ${t}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${x} + col * ${l} + depth * ${s} +
          depth2 * ${u} + depth3 * ${i} + depth4 + ${v};
      vec2 uv = uvFromFlat(${a}, ${h}, index);
      return sampleTexture(${r}, uv);
    }
  `}function y(e){let n=e.name,r=$.sizeFromShape(e.shapeInfo.logicalShape);return r<2?`return ${n};`:`
    for (int i = 0; i < ${r}; i++) {
      if (i == index) {
        return ${n}[i];
      }
    }
  `}function pe(e,n){let r=e.name,t=r.charAt(0).toUpperCase()+r.slice(1),o="get"+t+"AtOutCoords",c=e.shapeInfo.logicalShape.length,i=n.logicalShape.length,u=O(e.shapeInfo.logicalShape,n.logicalShape),s=F(i),l=i-c,x,d=["x","y","z","w","u","v"];c===0?x="":i<2&&u.length>=1?x="coords = 0;":x=u.map(S=>`coords.${d[S+l]} = 0;`).join(`
`);let p="";i<2&&c>0?p="coords":p=e.shapeInfo.logicalShape.map((S,g)=>`coords.${d[g+l]}`).join(", ");let a="return outputValue;",v=$.sizeFromShape(e.shapeInfo.logicalShape)===1,C=$.sizeFromShape(n.logicalShape)===1;if(c===1&&!v&&!C)a=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(v&&!C)i===1?a=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:a=`
        return vec4(outputValue.x);
      `;else if(u.length){let S=c-2,g=c-1;u.indexOf(S)>-1&&u.indexOf(g)>-1?a="return vec4(outputValue.x);":u.indexOf(S)>-1?a="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":u.indexOf(g)>-1&&(a="return vec4(outputValue.xx, outputValue.zz);")}return`
    vec4 ${o}() {
      ${s} coords = getOutputCoords();
      ${x}
      vec4 outputValue = get${t}(${p});
      ${a}
    }
  `}function de(e,n){let r=e.name,t=r.charAt(0).toUpperCase()+r.slice(1),o="get"+t+"AtOutCoords",c=n.texShape,i=e.shapeInfo.texShape,u=e.shapeInfo.logicalShape.length,s=n.logicalShape.length;if(!e.shapeInfo.isUniform&&u===s&&e.shapeInfo.flatOffset==null&&$.arraysEqual(i,c))return`
      float ${o}() {
        return sampleTexture(${r}, resultUV);
      }
    `;let l=F(s),x=O(e.shapeInfo.logicalShape,n.logicalShape),d=s-u,p,a=["x","y","z","w","u","v"];u===0?p="":s<2&&x.length>=1?p="coords = 0;":p=x.map(v=>`coords.${a[v+d]} = 0;`).join(`
`);let h="";return s<2&&u>0?h="coords":h=e.shapeInfo.logicalShape.map((v,f)=>`coords.${a[f+d]}`).join(", "),`
    float ${o}() {
      ${l} coords = getOutputCoords();
      ${p}
      return get${t}(${h});
    }
  `}function F(e){if(e<=1)return"int";if(e===2)return"ivec2";if(e===3)return"ivec3";if(e===4)return"ivec4";if(e===5)return"ivec5";if(e===6)return"ivec6";throw Error(`GPU for rank ${e} is not yet supported`)}function he(e,n,r){let{newShape:t,keptDims:o}=$.squeezeShape(n),c=n.length,i=e&&c===3&&n[0]===1,u=i?n.slice(1):t,s=!e&&c>1&&!$.arraysEqual(n,r)&&t.length<c||i;return{useSqueezeShape:s,uniformShape:s?u:n,keptDims:o}}function k(e,n){let r=JSON.parse(JSON.stringify(e));return r.shapeInfo.logicalShape=n,r}function N(e,n){return n.map(r=>e[r]).join(", ")}export{F as getCoordsDataType,he as getUniformInfoFromShape,fe as makeShader,k as squeezeInputInfo};
/*! Bundled license information:

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
*/
//# sourceMappingURL=shader_compiler.js.map