import {
  FeatureFlag,
  FeatureFlags,
  FeatureVariant,
  FeatureVariants,
} from "aws/features/list.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";

export function useFeatureVariant(
  variant: keyof FeatureVariants,
): FeatureVariant<typeof variant> {
  const { featureVariants } = useAppEnvironment();

  return featureVariants[variant];
}

export function useFeatureFlag(
  flag: keyof FeatureFlags,
): FeatureFlag<typeof flag> {
  const { featureFlags } = useAppEnvironment();
  return featureFlags[flag];
}

export function useFeatureTier(
  tier: "starter" | "basic" | "pro",
): boolean {
  const flag = `gating_${tier}` as keyof FeatureFlags;
  return useFeatureFlag(flag);
}
