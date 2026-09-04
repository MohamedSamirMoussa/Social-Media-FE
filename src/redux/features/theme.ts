import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  themes as defaultTheme,
  type ThemeKey,
  type IThemes,
} from "../../theme/theme";

export interface IThemeProps {
  name: string;
  main: string;
  secondary: string;
  background: string;
  color: string;
  boxShadow: string;
  inputBack: string;
}

export interface IThemeState {
  activeTheme: ThemeKey;
  themes: IThemes;
}

const initialState: IThemeState = {
  activeTheme: "light",
  themes: defaultTheme,
};

export const themeSlice = createSlice({
  name: "theme",

  initialState,

  reducers: {
    setActiveTheme: (state, action: PayloadAction<ThemeKey>) => {
      state.activeTheme = action.payload;
    },

    updateTheme: (
      state,
      action: PayloadAction<{
        themeKey: ThemeKey;
        values: Partial<IThemeProps>;
      }>,
    ) => {
      const { themeKey, values } = action.payload;

      state.themes[themeKey] = {
        ...state.themes[themeKey],
        ...values,
      };
    },
  },
});

export const { setActiveTheme, updateTheme } = themeSlice.actions;

export default themeSlice.reducer;
