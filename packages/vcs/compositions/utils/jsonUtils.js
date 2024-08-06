export function getValueFromJson(json, value, defaultValue) {
  if (!json) return defaultValue;
  const additionalJson = JSON.parse(json);
  let returnValue = defaultValue;
  if (additionalJson[value]) {
    returnValue = additionalJson[value];
  }
  return returnValue;
}
