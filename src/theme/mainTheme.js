const fontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
};

const fontSize = {
  xs: '0.8rem',
  s: '1.3rem',
  m: '1.6rem',
  l: '2.1rem',
  xl: '3.4rem',
};

const colors = {
  error: 'rgb(211, 47, 47)',
};

export const theme = {
  light: {
    name: 'light',
    ...fontWeight,
    ...fontSize,
    ...colors,
    background: 'rgb(242, 242, 247)',
    dp08: 'rgba(255, 255, 255, 1)',
    text: 'rgb(28, 28, 30)',
    textSecondary: 'rgb(142, 142, 147)',
  },
  dark: {
    name: 'dark',
    ...fontWeight,
    ...fontSize,
    ...colors,
    background: 'rgb(18, 18, 18)',
    dp08: 'rgba(255, 255, 255, .12)',
    text: 'rgba(255, 255, 255, .87)',
    textSecondary: 'rgba(255, 255, 255, .6)',
  },
};

// disabled opacity = .38
