const palletteLight = {
  primary: [255, 215, 0], // rgba(255, 215, 0, 1)
  secondary: [34, 217, 229], // rgba(34, 217, 229, 1)
  tertiary: [11, 41, 75], // rgba(11, 41, 75, 1)
  fourthary: [238, 130, 238], // rgba(238, 130, 238, 1)
  negative: [248, 113, 113], // rgba(248, 113, 113, 1)
  // success: use 'secondary'
  text: [35, 42, 49], // rgba(35, 42, 49, 1)
  textMarketing: [46, 46, 46], // rgba(46, 46, 46, 1)
  accentText: [19, 201, 212], // rgba(19, 201, 212, 1)
  secondaryText: [141, 147, 154], // rgba(141, 147, 154, 1)
  background: [255, 255, 255], // rgba(255, 255, 255, 1)
  border: [242, 242, 242], // rgba(242, 242, 242, 1)
  menuBackground: [255, 255, 255], // background
};

const constantColors = {
  lightText: [230, 230, 235], // rgba(230, 230, 235, 1)
};

const palletteDark = {
  primary: [255, 215, 0], // rgba(255, 215, 0, 1)
  secondary: [34, 217, 229], // rgba(34, 217, 229, 1)
  tertiary: [15, 16, 17],
  fourthary: [238, 130, 238], // rgba(238, 130, 238, 1)
  negative: [248, 113, 113], // rgba(248, 113, 113, 1)
  // success: use 'secondary'
  text: [200, 200, 205],
  textMarketing: [230, 230, 235], // rgba(46, 46, 46, 1)
  accentText: [19, 201, 212], // rgba(19, 201, 212, 1)
  secondaryText: [141, 147, 154], // rgba(141, 147, 154, 1)
  background: [24, 25, 26],
  border: [64, 65, 66],
  menuBackground: [49, 50, 53],
};

const defaultAdjustment = 10;

function color(
  color: number[] | undefined,
  adjust: number | null = 0,
  opacity: number | null = 1,
) {
  if (!color) {
    return "rgba(255, 0, 0, 0)";
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

function generateColors(dark = false) {
  const pallette = dark ? palletteDark : palletteLight;
  const adjustment = dark ? -defaultAdjustment : defaultAdjustment;
  return {
    primaryColor: color(pallette.primary),
    secondaryColor: color(pallette.secondary),
    secondaryColor015: color(pallette.secondary, null, 0.15),
    secondaryColor030: color(pallette.secondary, null, 0.3),
    tertiaryColor: color(pallette.tertiary),
    fourtharyColor: color(pallette.fourthary),
    fourtharyColor015: color(pallette.fourthary, null, 0.15),
    fourtharyColor030: color(pallette.fourthary, null, 0.3),
    logoBolt: color(pallette.primary),
    logoFoundry: color(pallette.secondary),
    accent: color(pallette.fourthary),
    highlight: color(pallette.secondary, null, 0.3),
    transcriptHighlight: color(pallette.secondaryText, null, 0.1),
    transcriptHover: color(pallette.secondary, null, 0.15),
    transcriptSelected: color(pallette.secondary, null, 0.3),
    transcriptWordHover: color(pallette.secondary, null, 0.45),
    transcriptWordPlaying: color(pallette.secondary),
    transcriptWordSelected: color(pallette.secondary, null, 0.6),
    primaryButton: color(pallette.primary),
    primaryButtonHover: color(pallette.primary, -adjustment),
    secondaryButton: color(pallette.background, -adjustment * 2),
    secondaryButtonHover: color(pallette.background, -adjustment * 3),
    accentButton: color(pallette.fourthary),
    accentButtonHover: color(pallette.fourthary, -adjustment),
    sidebarBackground: color(pallette.tertiary),
    sidebarBackgroundDark: color(pallette.tertiary, -defaultAdjustment),
    sidebarText: color(constantColors.lightText),
    outlineHover: color(pallette.background, -adjustment),
    overlayDark: color(pallette.secondaryText, null, 0.2),
    overlayDarkHover: color(pallette.fourthary, null, 0.2),
    alert: color(pallette.negative),
    alertHover: color(pallette.negative, -adjustment),
    success: color(pallette.secondary),
    successHover: color(pallette.secondary, -adjustment),
    background: color(pallette.background),
    backgroundAlert: color(pallette.negative, -adjustment * 20),
    backgroundIcon: color(pallette.background, -adjustment),
    backgroundIconHover: color(pallette.background, -adjustment * 2),
    itemDarkHovered: color(pallette.background, -adjustment * 2, 0.1),
    text: color(pallette.text),
    textAccent: color(pallette.accentText),
    textMarketing: color(pallette.textMarketing),
    textSecondary: color(pallette.secondaryText),
    textLight: color(pallette.secondaryText, adjustment * 4),
    textOnPrimary: color(pallette.tertiary),
    textOnSecondary: color(pallette.text),
    textOnAccent: color(pallette.background),
    textOnSuccess: color(pallette.background),
    textOnAlert: color(pallette.background),
    textOnBackground: color(pallette.text),
    textOnDark: color(pallette.background),
    border: color(pallette.border),
    borderDark: color(pallette.border, -adjustment * 2),
    pageBackground: color(pallette.background, -adjustment),
    pageBackgroundTransparent: color(pallette.background, -adjustment, 0.97), // used with backdropFilter
    menuBackground: color(pallette.menuBackground),
    menuBackgroundHover: color(pallette.menuBackground, -adjustment),
    marketingBackground: `black linear-gradient(125deg, ${
      color(pallette.tertiary, 0, 0.5)
    }, ${color(pallette.fourthary, 0, 0.4)})`,
    marketingGradient: `linear-gradient(in oklch 90deg, ${
      color(pallette.secondary)
    }, ${color(pallette.fourthary)})`,
    videoControlsBackground: color(pallette.tertiary, +adjustment * 4),
    videoControl: color(pallette.tertiary),
    videoControlHover: color(pallette.secondary, -adjustment),
    transparentGray: color(pallette.secondaryText, 0, 0.1),
    transparentSecondary: color(pallette.secondary, 0, 0.2),
    transparentBackground: color(pallette.background, 0, 0.97),
    transparentDark: color(pallette.tertiary, 0, 0.95),
  };
}

export const colors = generateColors();
export const colorsDark = generateColors(true);

export const fonts = {
  fontFamily: "DM Sans, sans-serif",
  marketingFontFamily: "Ubuntu, sans-serif",
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
