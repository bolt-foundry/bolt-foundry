import type { ExtractSecondParam, CombineWithIntrinsicAttributes } from '@isograph/react';
import type React from 'react';
import { RegisterMutation as resolver } from '../../../../mutations/Register.tsx';
export type Mutation__Register__output_type = (React.FC<CombineWithIntrinsicAttributes<ExtractSecondParam<typeof resolver>>>);
