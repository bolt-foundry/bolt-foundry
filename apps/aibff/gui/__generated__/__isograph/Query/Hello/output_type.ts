import type { ExtractSecondParam, CombineWithIntrinsicAttributes } from '@isograph/react';
import type React from 'react';
import { Hello as resolver } from '../../../../src/components/Hello.tsx';
export type Query__Hello__output_type = (React.FC<CombineWithIntrinsicAttributes<ExtractSecondParam<typeof resolver>>>);
