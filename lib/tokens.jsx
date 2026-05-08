// Zattoo mobile — design tokens
// Premium European streaming aesthetic: dark cinematic for Watch/Listen,
// warm editorial paper for Read. Three accent palettes selectable via Tweaks.

const ACCENTS = {
  zattoo: {
    name: 'Zattoo Orange',
    solid: '#FF5F1F',
    solidHi: '#FF7A3D',
    solidLo: '#E24A0A',
    soft: 'rgba(255, 95, 31, 0.14)',
    text: '#FFB896',
    glow: 'rgba(255, 95, 31, 0.45)',
    onSolid: '#FFFFFF',
  },
  alpine: {
    name: 'Alpine Ice',
    solid: '#6FB7E8',
    solidHi: '#8FCDF5',
    solidLo: '#4A9BD4',
    soft: 'rgba(111, 183, 232, 0.16)',
    text: '#BCDFF3',
    glow: 'rgba(111, 183, 232, 0.45)',
    onSolid: '#0A0A0C',
  },
  crimson: {
    name: 'Rotkäppchen',
    solid: '#E5173F',
    solidHi: '#F23C5F',
    solidLo: '#B8002A',
    soft: 'rgba(229, 23, 63, 0.14)',
    text: '#F3A8B7',
    glow: 'rgba(229, 23, 63, 0.45)',
    onSolid: '#FFFFFF',
  },
  electric: {
    name: 'Neon Chartreuse',
    solid: '#D4FF3A',
    solidHi: '#E7FF6E',
    solidLo: '#A8D410',
    soft: 'rgba(212, 255, 58, 0.18)',
    text: '#E6FF8C',
    glow: 'rgba(212, 255, 58, 0.5)',
    // Dark ink for WCAG AAA contrast on the bright chartreuse fill (~17:1)
    onSolid: '#0A0A0C',
  },
};

// dark theme — used for Watch, Listen, Player
const DARK = {
  bg: '#0A0A0C',
  bgRaised: '#131317',
  bgCard: '#1A1A1F',
  bgCardHi: '#22222A',
  hairline: 'rgba(255,255,255,0.08)',
  hairlineStrong: 'rgba(255,255,255,0.14)',
  text: '#F5F4F2',
  textDim: 'rgba(245,244,242,0.68)',
  textMute: 'rgba(245,244,242,0.44)',
  textFaint: 'rgba(245,244,242,0.22)',
};

// light/warm editorial — Read tab
const PAPER = {
  bg: '#F3EFE7',          // warm ivory
  bgRaised: '#EAE4D8',
  bgCard: '#FFFFFF',
  ink: '#1A1612',          // warm black
  inkDim: 'rgba(26,22,18,0.72)',
  inkMute: 'rgba(26,22,18,0.52)',
  inkFaint: 'rgba(26,22,18,0.28)',
  rule: 'rgba(26,22,18,0.14)',
  highlight: '#FBF5E9',
};

// font stacks
const FONTS = {
  // Compasse primary, Roboto fallback — used across Watch + Listen surfaces
  ui: '"Compasse", "Roboto", -apple-system, sans-serif',
  // Display for hero numbers/titles (Watch/Listen → Compasse; Read keeps serif)
  display: '"Compasse", "Roboto", Georgia, serif',
  // Editorial serif (Read) — unchanged
  editorial: '"GT Sectra", "Tiempos Text", "Lyon Text", Georgia, serif',
  // Editorial sans (labels, captions) — unchanged
  editorialSans: '"GT America", "Söhne", "Suisse Int\'l", -apple-system, sans-serif',
  // Mono for timestamps/data
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};

// tiny type util — consistent tracking
const type = (size, weight = 400, tracking = 0, lineHeight = 1.3) => ({
  fontSize: size,
  fontWeight: weight,
  letterSpacing: tracking,
  lineHeight,
});

Object.assign(window, { ACCENTS, DARK, PAPER, FONTS, type });
