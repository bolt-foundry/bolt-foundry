/**
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
 */
/// <amd-module name="@tensorflow/tfjs-backend-webgl/dist/gpgpu_math" />
import { Tensor, TypedArray } from 'https://esm.sh/v135/@tensorflow/tfjs-core@4.15.0/dist/index.d.ts';
import { GPGPUContext, GPGPUContextProgram } from './gpgpu_context.d.ts';
import { ShapeInfo, UniformType } from './shader_compiler.d.ts';
import { PackingScheme, TextureData, TextureUsage } from './tex_util.d.ts';
export interface GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    enableShapeUniforms?: boolean;
    /** If true, this program expects packed input textures. Defaults to false. */
    packedInputs?: boolean;
    /** If true, this program produces a packed texture. Defaults to false. */
    packedOutput?: boolean;
    /**
     * Affects what type of texture we allocate for the output. Defaults to
     * `TextureUsage.RENDER`.
     */
    outTexUsage?: TextureUsage;
    /**
     * The type of scheme to use when packing texels for the output values.
     * See `PackingScheme` for details. Defaults to `PackingScheme.SHARED_BATCH`.
     */
    outPackingScheme?: PackingScheme;
    customUniforms?: Array<{
        name: string;
        arrayIndex?: number;
        type: UniformType;
    }>;
}
export interface GPGPUBinary extends GPGPUBinaryLocations {
    webGLProgram: GPGPUContextProgram;
    program: GPGPUProgram;
    source: string;
    fragmentShader: WebGLShader;
    inShapeInfos: ShapeInfo[];
    outShapeInfo: ShapeInfo;
}
export interface GPGPUBinaryLocations {
    customUniformLocations?: WebGLUniformLocation[];
    infLoc: WebGLUniformLocation;
    nanLoc: WebGLUniformLocation;
    outShapeLocation?: WebGLUniformLocation;
    outShapeStridesLocation?: WebGLUniformLocation;
    outTexShapeLocation?: WebGLUniformLocation;
    variablesLocations?: GPGPUVariableLocations[];
}
export interface GPGPUVariableLocations {
    name: string;
    uniform: WebGLUniformLocation;
    offset: WebGLUniformLocation;
    shape?: WebGLUniformLocation;
    texShape?: WebGLUniformLocation;
}
export interface TensorData {
    shape: number[];
    texData: TextureData;
    isUniform: boolean;
    uniformValues?: TypedArray;
}
export declare function compileProgram<T extends Tensor, K extends Tensor>(gpgpu: GPGPUContext, program: GPGPUProgram, inputs: TensorData[], output: TensorData): GPGPUBinary;
export declare function getUniformLocations(gpgpu: GPGPUContext, program: GPGPUProgram, webGLProgram: WebGLProgram): GPGPUBinaryLocations;
export declare function runProgram<T extends Tensor, K extends Tensor>(gpgpu: GPGPUContext, binary: GPGPUBinary, inputs: TensorData[], output: TensorData, customUniformValues?: number[][]): void;
export declare function makeShaderKey(program: GPGPUProgram, inputs: TensorData[], output: TensorData): string;
export declare function useShapeUniforms(rank: number): boolean;
