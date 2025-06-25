import {
  type FeatureFlagsEnabled,
  featureFlagsEnabled,
} from "@bfmono/apps/boltFoundry/featureFlags/featureFlagsList.ts";
import { useAppEnvironment } from "@bfmono/apps/boltFoundry/contexts/AppEnvironmentContext.tsx";

export function useFeatureFlagEnabled(
  flag: keyof FeatureFlagsEnabled,
): boolean {
  const { featureFlags } = useAppEnvironment();
  let flagEnabled = featureFlagsEnabled[flag];
  if (featureFlags && featureFlags[flag] != undefined) {
    flagEnabled = Boolean(featureFlags[flag]);
  }
  return flagEnabled;
}

export function useFeatureTier(
  tier: "starter" | "basic" | "pro",
): boolean {
  const flag = `gating_${tier}` as keyof FeatureFlagsEnabled;
  return useFeatureFlagEnabled(flag);
}
