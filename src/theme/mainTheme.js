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

const lessonsPalette = {
  default: 'rgb(51, 154, 240)',
  zajeciazwychowawca: '#ffb340',
  programowanieialgorytmika: '#409cff',
  jezykangielski: '#ffcc00',
  religia: '#c5e1a5',
  wychowaniefizyczne: '#ce93d8',
  matematyka: '#ffe082',
  jezykniemiecki: '#90caf9',
  informatyka: '#b0bec5',
  jezykpolski: '#ffab91',
  siecikomputerowe: '#d1c4e9',
  urzadzeniatechnikikomputerowej: '#a5d6a7',
  bazydanych: '#b39ddb',
  wiedzaokulturze: '#dcedc8',
  podstawyprzedsiebiorczosci: '#fff9c4',
  systemyoperacyjne: '#f8bbd0',
};

const colors = {
  error: 'rgb(211, 47, 47)',
  textBlack: 'rgb(28, 28, 30)',
  dp00: 'rgba(255, 255, 255, 0)',
  dp01: 'rgba(255, 255, 255, .05)',
  dp02: 'rgba(255, 255, 255, .07)',
  dp03: 'rgba(255, 255, 255, .08)',
  dp04: 'rgba(255, 255, 255, .09)',
  dp06: 'rgba(255, 255, 255, .11)',
  dp08: 'rgba(255, 255, 255, .12)',
  dp12: 'rgba(255, 255, 255, .14)',
  dp16: 'rgba(255, 255, 255, .15)',
  dp24: 'rgba(255, 255, 255, .16)',
  themePreviewLight: 'rgb(255, 255, 255)',
  themePreviewDark: 'rgb(28, 28, 30)',
  gray5: 'rgb(229, 229, 234)',
};

const transitions = {
  themeTransition: '0.3s ease-in-out 0.05s',
};

export const theme = {
  light: {
    name: 'light',
    ...fontWeight,
    ...fontSize,
    ...colors,
    ...lessonsPalette,
    ...transitions,
    background: 'rgb(242, 242, 247)',
    burger: 'rgb(28, 28, 30)',
    navbar: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    collapse: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    textSecondary: 'rgb(142, 142, 147)',
    border: 'rgb(199, 199, 204)',
    buttonHover: 'rgb(242, 242, 247)',
    modalHover: 'rgba(0, 0, 0, .04)',
    modalFocus: 'rgba(0, 0, 0, .12)',
    blue: 'rgb(0, 122, 255)',
    green: 'rgb(52, 199, 89)',
    checkmark: 'rgb(255, 255, 255)',
    switch: 'rgb(209, 209, 214)',
    switchHover: 'rgb(199, 199, 204)',
  },
  dark: {
    name: 'dark',
    ...fontWeight,
    ...fontSize,
    ...colors,
    ...lessonsPalette,
    ...transitions,
    background: 'rgb(28, 28, 30)',
    burger: 'rgb(255, 255, 255)',
    navbar: colors.dp08,
    card: colors.dp01,
    collapse: 'rgb(58, 58, 60)',
    text: 'rgba(255, 255, 255, .87)',
    textSecondary: 'rgba(255, 255, 255, .6)',
    border: 'rgb(99, 99, 102)',
    buttonHover: colors.dp02,
    modalHover: 'rgba(255, 255, 255, .04)',
    modalFocus: 'rgba(255, 255, 255, .12)',
    blue: 'rgb(10, 132, 255)',
    green: 'rgb(48, 209, 88)',
    checkmark: 'rgb(28, 28, 30)',
    switch: 'rgb(72, 72, 74)',
    switchHover: 'rgb(99, 99, 102)',
  },
};

// disabled opacity = .38
