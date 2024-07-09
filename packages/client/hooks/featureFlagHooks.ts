export function useFeatureFlag(str: string) {
  return true;
}
export function useFeatureTier(str: string) {
  return true;
}
export function useFeatureVariant(str: string) {
  if (str === "sv_swear_words") {
    return tempSwears;
  }
  return true;
}

const tempSwears = [
  "ass",
  "asshole",
  "bitch",
  "bitching",
  "cock",
  "cum",
  "cunt",
  "cunts",
  "dick",
  "dickhead",
  "douche",
  "fag",
  "faggot",
  "faggots",
  "fuck",
  "fucked",
  "fucker",
  "fucker",
  "fucking",
  "fucks",
  "goddammit",
  "motherfucker",
  "motherfuckers",
  "nigga",
  "niggas",
  "nigger",
  "pussy",
  "retarded",
  "sex",
  "shit",
  "shittier",
  "shitty",
];