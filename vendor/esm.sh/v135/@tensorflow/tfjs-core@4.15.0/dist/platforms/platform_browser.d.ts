/**
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
 */
/// <amd-module name="@tensorflow/tfjs-core/dist/platforms/platform_browser" />
import '../flags.d.ts';
import { Platform } from './platform.d.ts';
export declare class PlatformBrowser implements Platform {
    private textEncoder;
    private readonly messageName;
    private functionRefs;
    private handledMessageCount;
    private hasEventListener;
    fetch(path: string, init?: RequestInit): Promise<Response>;
    now(): number;
    encode(text: string, encoding: string): Uint8Array;
    decode(bytes: Uint8Array, encoding: string): string;
    setTimeoutCustom(functionRef: Function, delay: number): void;
    isTypedArray(a: unknown): a is Uint8Array | Float32Array | Int32Array | Uint8ClampedArray;
}
