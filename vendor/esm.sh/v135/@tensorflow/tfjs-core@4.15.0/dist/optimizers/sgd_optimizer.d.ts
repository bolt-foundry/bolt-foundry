/**
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
 */
/// <amd-module name="@tensorflow/tfjs-core/dist/optimizers/sgd_optimizer" />
import { ConfigDict, Serializable, SerializableConstructor } from '../serialization.d.ts';
import { Scalar } from '../tensor.d.ts';
import { NamedTensor, NamedTensorMap } from '../tensor_types.d.ts';
import { Optimizer } from './optimizer.d.ts';
/** @doclink Optimizer */
export declare class SGDOptimizer extends Optimizer {
    protected learningRate: number;
    /** @nocollapse */
    static get className(): string;
    protected c: Scalar;
    constructor(learningRate: number);
    applyGradients(variableGradients: NamedTensorMap | NamedTensor[]): void;
    /**
     * Sets the learning rate of the optimizer.
     */
    setLearningRate(learningRate: number): void;
    dispose(): void;
    getWeights(): Promise<NamedTensor[]>;
    setWeights(weightValues: NamedTensor[]): Promise<void>;
    getConfig(): ConfigDict;
    /** @nocollapse */
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
