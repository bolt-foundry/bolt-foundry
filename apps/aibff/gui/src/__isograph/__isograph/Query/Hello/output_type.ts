import type {
  CombineWithIntrinsicAttributes,
  ExtractSecondParam,
} from "@isograph/react";
import type React from "react";
import type { Hello as resolver } from "@bfmono/apps/aibff/gui/src/components/Hello";
export type Query__Hello__output_type = React.FC<
  CombineWithIntrinsicAttributes<ExtractSecondParam<typeof resolver>>
>;
