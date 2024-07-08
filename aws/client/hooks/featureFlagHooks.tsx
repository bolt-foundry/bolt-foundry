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
  if (variant === "sv_swear_words") {
    return tempSwears;
  }
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

const tempSwears = [
  "ass",
  "bitch",
  "cock",
  "cunt",
  "dick",
  "dickhead",
  "douche",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "fucks",
  "pussy",
  "shit",
  "bitching",
  "motherfucker",
  "motherfuckers",
  "goddammit",
  "fucker",
  "retarded",
  "asshole",
  "shitty",
  "nigga",
  "nigger",
  "shittier",
];
