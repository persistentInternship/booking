export const defaultStyles = {
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  buttonColor: '#000000',
  logoColor: '#FFFFFF',
  hoverColor: '#1F2937',
  logoname: 'DoorDash'
};

export type StyleType = typeof defaultStyles;

export const getStylesAsCSS = (styles: StyleType) => `
  .navbar {
    background-color: ${styles.backgroundColor};
    color: ${styles.textColor};
  }
  .navbar button {
    background-color: ${styles.buttonColor};
    color: ${styles.textColor};
  }
  .navbar button:hover {
    background-color: ${styles.hoverColor};
  }
  .navbar .logo {
    color: ${styles.logoColor};
  }
`;