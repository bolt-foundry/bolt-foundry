import {
  FeatureFlag,
  FeatureFlags,
  featureFlags,
  FeatureVariant,
  FeatureVariants,
  featureVariants,
} from "aws/features/list.ts";

import {
  ensurePosthogClientIsSetUp,
  getCurrentClients,
} from "aws/events/mod.ts";

export async function getFeatureFlag(
  flag: keyof FeatureFlags,
  personBfGraphId?: string | undefined,
): Promise<FeatureFlag<typeof flag>> {
  const { frontendClient, backendClient } = await ensurePosthogClientIsSetUp();
  if (frontendClient) {
    return frontendClient.getFeatureFlag(flag) as FeatureFlag<typeof flag>;
  }
  if (backendClient && personBfGraphId) {
    return await backendClient.getFeatureFlag(
      flag,
      personBfGraphId,
    ) as FeatureFlag<typeof flag>;
  }
  return featureFlags[flag];
}

export function getFeatureVariant(
  variant: keyof FeatureVariants,
  personBfGraphId?: string | undefined,
): FeatureVariant<typeof variant> | Promise<FeatureVariant<typeof variant>> {
  const { frontendClient, backendClient } = getCurrentClients();

  if (frontendClient) {
    const key = frontendClient.getFeatureFlag(variant);
    if (key) {
      return frontendClient.getFeatureFlagPayload(variant) as FeatureVariant<
        typeof variant
      >;
    }
  }

  if (backendClient && personBfGraphId) {
    const flagPromise = backendClient.getFeatureFlag(variant, personBfGraphId);
    const payloadPromise = backendClient.getFeatureFlagPayload(
      variant,
      personBfGraphId,
    );
    return Promise.all([
      flagPromise,
      payloadPromise,
    ]).then(([flagValue, flagPayload]) => [flagValue, flagPayload]).then(
      ([flagValue, flagPayload]) => {
        if (!flagValue) {
          return featureVariants[variant];
        }
        return flagPayload as FeatureVariant<typeof variant>;
      },
    );
  }

  return featureVariants[variant];
}
