import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface UIState {
  mobileMenuOpen: boolean;
  city: string;
  availableCities: string[];
  theme: Theme;
  offlineMode: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  city: 'Алматы',
  availableCities: ['Алматы', 'Астана', 'Шымкент', 'Караганда'],
  theme: 'light',
  offlineMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setCityFilter: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
      // If this is a new city, add it to available cities
      if (!state.availableCities.includes(action.payload)) {
        state.availableCities.push(action.payload);
      }
    },
    addCity: (state, action: PayloadAction<string>) => {
      if (!state.availableCities.includes(action.payload)) {
        state.availableCities.push(action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;

      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
  },
});

export const {
  setMobileMenuOpen,
  setCityFilter,
  addCity,
  setTheme,
  setOfflineMode,
} = uiSlice.actions;

export default uiSlice.reducer;