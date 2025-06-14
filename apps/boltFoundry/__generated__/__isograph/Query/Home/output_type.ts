import type {
  CombineWithIntrinsicAttributes,
  ExtractSecondParam,
} from "@isograph/react";
import type React from "react";
import { Home as resolver } from "../../../../components/Home.tsx";
export type Query__Home__output_type = React.FC<
  CombineWithIntrinsicAttributes<ExtractSecondParam<typeof resolver>>
>;
