/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const CAN_USE_DOM: boolean = typeof globalThis !== "undefined" &&
  typeof globalThis.document !== "undefined" &&
  typeof globalThis.document.createElement !== "undefined";

import { useEffect, useLayoutEffect } from "react";

const useLayoutEffectImpl: typeof useLayoutEffect = CAN_USE_DOM
  ? useLayoutEffect
  : useEffect;

export default useLayoutEffectImpl;
