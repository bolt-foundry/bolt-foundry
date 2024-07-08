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

const tempSwears = ["ass", "bitch", "cock", "cunt", "dick", "dickhead", "douche", "fuck", "fucked", "fucker", "fucking", "fucks", "pussy", "shit", "bitching", "motherfucker", "motherfuckers", "goddammit", "fucker", "retarded", "asshole", "shitty", "nigga", "nigger", "shittier"];
