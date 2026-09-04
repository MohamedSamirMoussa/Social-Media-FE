export interface IThemes {
  light: {
    name: string;
    main: string;
    secondary: string;
    background: string;
    color: string;
    boxShadow: string;
    inputBack: string;
  };

  dark: {
    name: string;
    main: string;
    secondary: string;
    background: string;
    color: string;
    boxShadow: string;
    inputBack: string;
  };
}

export type ThemeKey = keyof IThemes;

export const themes: IThemes = {
  light: {
    name: "Light Theme",
    main: "#1976d2",
    secondary: "#9c27b0",
    background: "#f5f5f5",
    color: "#121212",
    boxShadow: "10px 10px 0",
    inputBack: "#f5f5f5",
  },

  dark: {
    name: "Dark Theme",
    main: "#90caf9",
    secondary: "#ce93d8",
    background: "#121212",
    color: "#f5f5f5",
    boxShadow: "10px 10px 0 #fff",
    inputBack: "#f5f5f5",
  },
};
