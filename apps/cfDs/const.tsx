const paletteLight = {
  primary: [255, 215, 0], // rgba(255, 215, 0, 1)
  secondary: [34, 217, 229], // rgba(34, 217, 229, 1)
  tertiary: [11, 41, 75], // rgba(11, 41, 75, 1)
  tertiaryDark: [11, 41, 75], // rgba(11, 41, 75, 1)
  fourthary: [238, 130, 238], // rgba(238, 130, 238, 1)
  negative: [248, 113, 113], // rgba(248, 113, 113, 1)
  // success: use 'secondary'
  text: [35, 42, 49], // rgba(35, 42, 49, 1)
  textMarketing: [46, 46, 46], // rgba(46, 46, 46, 1)
  secondaryText: [168, 168, 168], // rgba(141, 147, 154, 1)
  background: [255, 255, 255], // rgba(255, 255, 255, 1)
  pageBackground: [253, 253, 253],
  border: [242, 242, 242], // rgba(242, 242, 242, 1)
  menuBackground: [255, 255, 255], // background
  glimmerBackground: [250, 250, 250],
  glimmer: [255, 255, 255],
};

export const paletteForPlinko = {
  yellow: paletteLight.primary.join(", "),
  blue: paletteLight.secondary.join(", "),
  pink: paletteLight.fourthary.join(", "),
};

const constantColors = {
  lightText: [230, 230, 235], // rgba(230, 230, 235, 1)
  alwaysWhite: [255, 255, 255], // rgba(255, 255, 255, 1)
  alwaysDark: paletteLight.text,
};

const paletteDark = {
  primary: [255, 215, 0], // rgba(255, 215, 0, 1)
  secondary: [34, 217, 229], // rgba(34, 217, 229, 1)
  tertiary: [255, 255, 255],
  tertiaryDark: [15, 16, 17],
  fourthary: [238, 130, 238], // rgba(238, 130, 238, 1)
  negative: [248, 113, 113], // rgba(248, 113, 113, 1)
  // success: use 'secondary'
  text: [250, 250, 255],
  textMarketing: [230, 230, 235], // rgba(46, 46, 46, 1)
  accentText: [19, 201, 212], // rgba(19, 201, 212, 1)
  secondaryText: [141, 147, 154], // rgba(141, 147, 154, 1)
  background: [20, 21, 22],
  pageBackground: [24, 25, 26],
  border: [64, 65, 66],
  menuBackground: [49, 50, 53],
  glimmerBackground: [30, 30, 30],
  glimmer: [26, 26, 26],
};

const defaultAdjustment = 10;

function caplitalize(word: string) {
  return word.charAt(0).toUpperCase() +
    word.slice(1);
}

function mixPalette(
  color: Array<number> | undefined,
  mixColor: Array<number> | undefined = undefined,
  mixColorPercent: number | undefined = 0.5,
) {
  if (!color || !mixColor) return [255, 0, 0, 1];
  return color.map((c, index) =>
    Math.round(c * (1 - mixColorPercent) + mixColor[index] * mixColorPercent)
  );
}

function color(
  color: Array<number> | undefined,
  adjust: number | null = 0,
  opacity: number | null = 1,
) {
  if (!color) {
    return "rgba(255, 0, 0, 1)";
  }
  const adjustedColor = color.map((c) => {
    let newColor = c + (adjust ?? 0);
    if (newColor > 255) {
      newColor = 255;
    }
    if (newColor < 0) {
      newColor = 0;
    }
    return newColor;
  });
  return `rgba(${adjustedColor[0]}, ${adjustedColor[1]}, ${adjustedColor[2]}, ${
    opacity ?? 1
  })`;
}

function createSet(name: string, colorArr: Array<number>, adjustment: number) {
  return {
    [`${name}`]: color(colorArr),
    [`${name}002`]: color(colorArr, null, 0.02),
    [`${name}005`]: color(colorArr, null, 0.05),
    [`${name}010`]: color(colorArr, null, 0.10),
    [`${name}015`]: color(colorArr, null, 0.15),
    [`${name}030`]: color(colorArr, null, 0.30),
    [`${name}060`]: color(colorArr, null, 0.60),
    [`${name}090`]: color(colorArr, null, 0.90),
    [`${name}Hover`]: color(colorArr, -adjustment),
  };
}

function createMixSet(
  colorName: string,
  mixName: string,
  colorArr: Array<number>,
  mixArr: Array<number>,
  adjustment: number,
) {
  const capName = caplitalize(mixName);
  const mixSet = {
    [`${colorName}Mix020${capName}`]: mixPalette(colorArr, mixArr, 0.2),
    [`${colorName}Mix040${capName}`]: mixPalette(colorArr, mixArr, 0.4),
    [`${colorName}Mix060${capName}`]: mixPalette(colorArr, mixArr, 0.6),
    [`${colorName}Mix080${capName}`]: mixPalette(colorArr, mixArr, 0.8),
  };
  return Object.entries(mixSet).reduce((runningObj, [key, arr]) => {
    return {
      ...runningObj,
      ...createSet(key, arr, adjustment),
    };
  }, {});
}

function generateColors(dark = false) {
  const palette = dark ? paletteDark : paletteLight;
  const adjustment = dark ? -defaultAdjustment : defaultAdjustment;
  return {
    ...createSet("primaryColor", palette.primary, adjustment),
    ...createSet("secondaryColor", palette.secondary, adjustment),
    ...createSet("tertiaryColor", palette.tertiary, adjustment),
    ...createSet("fourtharyColor", palette.fourthary, adjustment),
    tertiaryColorDark: color(palette.tertiaryDark),
    alwaysWhite: color(constantColors.alwaysWhite),
    ...createSet("alwaysDark", constantColors.alwaysDark, adjustment),
    ...createSet("alwaysLight", constantColors.lightText, adjustment),
    logoBolt: color(palette.primary),
    logoFoundry: color(palette.secondary),
    primaryButton: color(palette.primary),
    primaryButtonHover: color(palette.primary, -adjustment),
    secondaryButton: color(palette.background, -adjustment * 2),
    secondaryButtonHover: color(palette.background, -adjustment * 3),
    secondaryButtonBackground: color(palette.background, -adjustment * 12),
    secondaryButtonBackgroundHover: color(
      palette.background,
      -adjustment * 14,
    ),
    accentButton: color(palette.fourthary),
    accentButtonHover: color(palette.fourthary, -adjustment),
    sidebarText: color(constantColors.lightText),
    outlineHover: color(palette.background, -adjustment),
    outlineDark: color(palette.secondaryText, null, 0.2),
    outlineDarkHover: color(palette.secondaryText, null, 0.4),
    ...createSet("alert", palette.negative, adjustment),
    success: color(palette.secondary),
    successHover: color(palette.secondary, -adjustment),
    ...createSet("background", palette.background, adjustment),
    backgroundAlert: color(palette.negative, -adjustment * 20),
    backgroundIcon: color(palette.background, -adjustment),
    backgroundIconHover: color(palette.background, -adjustment * 2),
    itemDarkHovered: color(palette.background, -adjustment * 2, 0.1),
    ...createSet("text", palette.text, adjustment),
    textMarketing: color(palette.textMarketing),
    ...createSet("textSecondary", palette.secondaryText, adjustment),
    textLight: color(palette.secondaryText, adjustment * 4),
    textOnPrimary: color(palette.tertiaryDark),
    textOnSecondary: color(palette.text),
    textOnAccent: color(palette.background),
    textOnSuccess: color(palette.background),
    textOnAlert: color(palette.background),
    textOnBackground: color(palette.text),
    textOnDark: color(palette.background),
    border: color(palette.border),
    borderDark: color(palette.border, -adjustment * 2),
    pageBackground: color(palette.pageBackground),
    pageBackgroundTransparent: color(palette.pageBackground, null, 0.97), // used with backdropFilter
    menuBackground: color(palette.menuBackground),
    menuBackgroundHover: color(palette.menuBackground, -adjustment),
    marketingBackground: `black linear-gradient(125deg, ${
      color(palette.tertiaryDark, 0, 0.5)
    }, ${color(palette.fourthary, 0, 0.4)})`,
    marketingGradient: `linear-gradient(in oklch 90deg, ${
      color(palette.secondary)
    }, ${color(palette.fourthary)})`,
    marketingBackgroundSecondary: `black linear-gradient(in oklch 125deg, ${
      color(palette.tertiaryDark, 0, 0.5)
    }, ${color(palette.secondary, 0, 0.8)})`,
    marketingBackgroundFourthary: `black linear-gradient(in oklch 125deg, ${
      color(palette.tertiaryDark, 0, 0.5)
    }, ${color(palette.fourthary, 0, 0.8)})`,
    transparentGray: color(palette.secondaryText, 0, 0.1),
    transparentSecondary: color(palette.secondary, 0, 0.2),
    transparentBackground: color(palette.background, 0, 0.97),
    transparentDark: color(palette.tertiaryDark, 0, 0.95),
    glimmerBackground: color(palette.glimmerBackground),
    glimmer: color(palette.glimmer),
    ...createMixSet(
      "secondary",
      "alert",
      palette.secondary,
      palette.negative,
      adjustment,
    ),
  };
}

export const colors = generateColors();
export const colorsDark = generateColors(true);

export const fonts = {
  fontFamily: "DM Sans, sans-serif",
  marketingFontFamily: "Bebas Neue, sans-serif",
  fontFamilyMono: "DM Mono, monospace",
};

export const textStyles = {
  h1: {
    color: "var(--text)",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0,
    marginBottom: 12,
  },
  h2: {
    color: "var(--text)",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0,
    marginBottom: 12,
  },
};
