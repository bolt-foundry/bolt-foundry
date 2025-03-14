const palletteLight = {
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
  pageBackground: [252, 252, 252],
  border: [242, 242, 242], // rgba(242, 242, 242, 1)
  menuBackground: [255, 255, 255], // background
  glimmerBackground: [250, 250, 250],
  glimmer: [255, 255, 255],
};

const constantColors = {
  lightText: [230, 230, 235], // rgba(230, 230, 235, 1)
  alwaysWhite: [255, 255, 255], // rgba(255, 255, 255, 1)
  alwaysDark: palletteLight.text,
};

const palletteDark = {
  primary: [255, 215, 0], // rgba(255, 215, 0, 1)
  secondary: [34, 217, 229], // rgba(34, 217, 229, 1)
  tertiary: [255, 255, 255],
  tertiaryDark: [15, 16, 17],
  fourthary: [238, 130, 238], // rgba(238, 130, 238, 1)
  negative: [248, 113, 113], // rgba(248, 113, 113, 1)
  // success: use 'secondary'
  text: [220, 220, 225],
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

function color(
  color: number[] | undefined,
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

function createSet(name: string, colorArr: number[], adjustment: number) {
  return {
    [`${name}`]: color(colorArr),
    [`${name}015`]: color(colorArr, null, 0.15),
    [`${name}030`]: color(colorArr, null, 0.30),
    [`${name}060`]: color(colorArr, null, 0.60),
    [`${name}Hover`]: color(colorArr, -adjustment),
  };
}

function generateColors(dark = false) {
  const pallette = dark ? palletteDark : palletteLight;
  const adjustment = dark ? -defaultAdjustment : defaultAdjustment;
  return {
    ...createSet("primaryColor", pallette.primary, adjustment),
    ...createSet("secondaryColor", pallette.secondary, adjustment),
    ...createSet("tertiaryColor", pallette.tertiary, adjustment),
    ...createSet("fourtharyColor", pallette.fourthary, adjustment),
    tertiaryColorDark: color(pallette.tertiaryDark),
    alwaysWhite: color(constantColors.alwaysWhite),
    alwaysDark: color(constantColors.alwaysDark),
    alwaysLight: color(constantColors.lightText),
    logoBolt: color(pallette.primary),
    logoFoundry: color(pallette.secondary),
    primaryButton: color(pallette.primary),
    primaryButtonHover: color(pallette.primary, -adjustment),
    secondaryButton: color(pallette.background, -adjustment * 2),
    secondaryButtonHover: color(pallette.background, -adjustment * 3),
    secondaryButtonBackground: color(pallette.background, -adjustment * 12),
    secondaryButtonBackgroundHover: color(
      pallette.background,
      -adjustment * 14,
    ),
    accentButton: color(pallette.fourthary),
    accentButtonHover: color(pallette.fourthary, -adjustment),
    sidebarText: color(constantColors.lightText),
    outlineHover: color(pallette.background, -adjustment),
    outlineDark: color(pallette.secondaryText, null, 0.2),
    outlineDarkHover: color(pallette.secondaryText, null, 0.4),
    ...createSet("alert", pallette.negative, adjustment),
    success: color(pallette.secondary),
    successHover: color(pallette.secondary, -adjustment),
    background: color(pallette.background),
    backgroundAlert: color(pallette.negative, -adjustment * 20),
    backgroundIcon: color(pallette.background, -adjustment),
    backgroundIconHover: color(pallette.background, -adjustment * 2),
    itemDarkHovered: color(pallette.background, -adjustment * 2, 0.1),
    ...createSet("text", pallette.text, adjustment),
    textMarketing: color(pallette.textMarketing),
    ...createSet("textSecondary", pallette.secondaryText, adjustment),
    textLight: color(pallette.secondaryText, adjustment * 4),
    textOnPrimary: color(pallette.tertiaryDark),
    textOnSecondary: color(pallette.text),
    textOnAccent: color(pallette.background),
    textOnSuccess: color(pallette.background),
    textOnAlert: color(pallette.background),
    textOnBackground: color(pallette.text),
    textOnDark: color(pallette.background),
    border: color(pallette.border),
    borderDark: color(pallette.border, -adjustment * 2),
    pageBackground: color(pallette.pageBackground),
    pageBackgroundTransparent: color(pallette.pageBackground, null, 0.97), // used with backdropFilter
    menuBackground: color(pallette.menuBackground),
    menuBackgroundHover: color(pallette.menuBackground, -adjustment),
    marketingBackground: `black linear-gradient(125deg, ${
      color(pallette.tertiaryDark, 0, 0.5)
    }, ${color(pallette.fourthary, 0, 0.4)})`,
    marketingGradient: `linear-gradient(in oklch 90deg, ${
      color(pallette.secondary)
    }, ${color(pallette.fourthary)})`,
    marketingBackgroundSecondary: `black linear-gradient(in oklch 125deg, ${
      color(pallette.tertiaryDark, 0, 0.5)
    }, ${color(pallette.secondary, 0, 0.8)})`,
    marketingBackgroundFourthary: `black linear-gradient(in oklch 125deg, ${
      color(pallette.tertiaryDark, 0, 0.5)
    }, ${color(pallette.fourthary, 0, 0.8)})`,
    transparentGray: color(pallette.secondaryText, 0, 0.1),
    transparentSecondary: color(pallette.secondary, 0, 0.2),
    transparentBackground: color(pallette.background, 0, 0.97),
    transparentDark: color(pallette.tertiaryDark, 0, 0.95),
    glimmerBackground: color(pallette.glimmerBackground),
    glimmer: color(pallette.glimmer),
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
