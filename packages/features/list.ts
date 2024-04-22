/**
 * This file is used to define the features and their variants.
 *
 * The `featureFlags` object is used to define the features that are
 * either on or off. The `featureVariants` object is used to define
 * the features that have multiple variants.
 *
 * Important: This is a file used both on clients and servers. Do not
 * import anything that is not available on both.
 *
 * To use feature flags, define the "key" in either object, and then
 * add the respective related item in posthog.
 */
export type FeatureFlags = typeof featureFlags;
export type FeatureVariants = typeof featureVariants;
export type FeatureVariant<T extends keyof FeatureVariants> =
  FeatureVariants[T];
export type FeatureFlag<T extends keyof FeatureFlags> = FeatureFlags[T];

/**
 * For ease of pasting into posthog, make it be "real json" including
 * quoted string keys.
 *
 * Also, please keep them alphabetized.
 */
export const featureVariants = {
  marketing_page_headline: {
    "text": [
      { "style": "normal", "text": "Custom video clips" },
      {
        "style": "blueWord",
        "text": "for comedy clubs",
      },
    ],
  },
  sv_swear_words: ["shit"],
};

/**
 * Gating flags are how we separate subscriptions. These should
 * be set to false, and relate to each tier. Server side, we enable
 * and disable gating, using posthog properties right now.
 */
const gatingFlags = {
  gating_starter: false,
  gating_basic: false,
  gating_pro: false,
};

// Keep alphabetized please!
export const featureFlags = {
  disable_clip_list_videos: false,
  enable_caption_fonts: true,
  enable_caption_templates: true,
  enable_dashboard: false,
  enable_face_tracking: true,
  enable_google_login: false,
  enable_old_login: true, // production: https://us.posthog.com/project/31224/feature_flags/38324, development: https://us.posthog.com/project/32716/feature_flags/38323
  enable_red_frame_hack: true,
  enable_review_page: false,
  enable_settings_presets: false,
  enable_signup: false,
  enable_srt_export: false,
  enable_transcript_view: false,
  enable_watermark_picker: false,
  enable_whisper: false,
  enable_word_editing: true,
  landing_page_expansion: false,
  local_audio_transcribing_pipeline: true,
  marketing_v3_video_block: false,
  should_use_flag: true,
  toggle_watermark: true,
  ...gatingFlags, // should always be last so they don't accidentally get overwritten
};
