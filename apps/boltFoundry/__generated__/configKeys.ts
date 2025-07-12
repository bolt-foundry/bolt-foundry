/* @generated */

// Temporary empty config to unblock build
export const PUBLIC_CONFIG_KEYS = [] as const;
export const PRIVATE_CONFIG_KEYS = [] as const;
export const CONFIG_KEYS = [] as const;

export type PublicConfigKey  = typeof PUBLIC_CONFIG_KEYS[number];
export type PrivateConfigKey = typeof PRIVATE_CONFIG_KEYS[number];
export type ConfigKey        = typeof CONFIG_KEYS[number];

export type PublicConfigMap  = { [K in PublicConfigKey]: string };
export type PrivateConfigMap = { [K in PrivateConfigKey]: string };
export type ConfigMap        = PublicConfigMap & PrivateConfigMap;

export type ClientEnvironment = {
  [K in PublicConfigKey]?: string | boolean;
};