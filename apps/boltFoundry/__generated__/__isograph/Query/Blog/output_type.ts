import type {
  CombineWithIntrinsicAttributes,
  ExtractSecondParam,
} from "@isograph/react";
import type React from "react";
import { Blog as resolver } from "../../../../components/Blog.tsx";
export type Query__Blog__output_type = React.FC<
  CombineWithIntrinsicAttributes<ExtractSecondParam<typeof resolver>>
>;
