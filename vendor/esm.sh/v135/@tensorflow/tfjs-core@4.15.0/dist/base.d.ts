/**
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
 */
/// <amd-module name="@tensorflow/tfjs-core/dist/base" />
/**
 * @fileoverview
 * @suppress {partialAlias} Optimization disabled due to passing the module
 * object into a function below:
 *
 *   import * as ops from './ops/ops';
 *   setOpHandler(ops);
 */
import * as io from './io/io.d.ts';
import * as math from './math.d.ts';
import * as broadcast_util from './ops/broadcast_util.d.ts';
import * as browser from './ops/browser.d.ts';
import * as gather_util from './ops/gather_nd_util.d.ts';
import * as scatter_util from './ops/scatter_nd_util.d.ts';
import * as slice_util from './ops/slice_util.d.ts';
import * as serialization from './serialization.d.ts';
import * as tensor_util from './tensor_util.d.ts';
import * as test_util from './test_util.d.ts';
import * as util from './util.d.ts';
import { version } from './version.d.ts';
export { InferenceModel, MetaGraph, MetaGraphInfo, ModelPredictConfig, ModelTensorInfo, SavedModelTensorInfo, SignatureDef, SignatureDefEntry, SignatureDefInfo } from './model_types.d.ts';
export { AdadeltaOptimizer } from './optimizers/adadelta_optimizer.d.ts';
export { AdagradOptimizer } from './optimizers/adagrad_optimizer.d.ts';
export { AdamOptimizer } from './optimizers/adam_optimizer.d.ts';
export { AdamaxOptimizer } from './optimizers/adamax_optimizer.d.ts';
export { MomentumOptimizer } from './optimizers/momentum_optimizer.d.ts';
export { Optimizer } from './optimizers/optimizer.d.ts';
export { OptimizerConstructors } from './optimizers/optimizer_constructors.d.ts';
export { RMSPropOptimizer } from './optimizers/rmsprop_optimizer.d.ts';
export { SGDOptimizer } from './optimizers/sgd_optimizer.d.ts';
export { DataToGPUOptions, DataToGPUWebGLOption, GPUData, Scalar, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D, Tensor5D, TensorBuffer, Variable } from './tensor.d.ts';
export { GradSaveFunc, NamedTensorMap, TensorContainer, TensorContainerArray, TensorContainerObject } from './tensor_types.d.ts';
export { BackendValues, DataType, DataTypeMap, DataTypeFor, DataValues, NumericDataType, PixelData, Rank, RecursiveArray, ScalarLike, ShapeMap, sumOutType, TensorLike, TypedArray, upcastType, WebGLData, WebGPUData } from './types.d.ts';
export * from './ops/ops.d.ts';
export { Reduction } from './ops/loss_ops_utils.d.ts';
export * from './train.d.ts';
export * from './globals.d.ts';
export * from './kernel_registry.d.ts';
export { TensorInfo, DataId } from './tensor_info.d.ts';
export { customGrad, grad, grads, valueAndGrad, valueAndGrads, variableGrads } from './gradients.d.ts';
export { TimingInfo, MemoryInfo, ForwardFunc } from './engine.d.ts';
export { Environment, env, ENV } from './environment.d.ts';
export { Platform } from './platforms/platform.d.ts';
export { version as version_core };
export { nextFrame } from './browser_util.d.ts';
import * as backend_util from './backends/backend_util.d.ts';
import * as device_util from './device_util.d.ts';
export { browser, io, math, serialization, test_util, util, backend_util, broadcast_util, tensor_util, slice_util, gather_util, scatter_util, device_util };
import * as kernel_impls from './backends/kernel_impls.d.ts';
export { kernel_impls };
export { KernelBackend, BackendTimingInfo, DataMover, DataStorage } from './backends/backend.d.ts';
export * from './kernel_names.d.ts';
