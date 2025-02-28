import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Part {
  id: string;
  name: string;
  equipmentType: string;
  compatibleYears: string;
  quantity: number;
  status: string;
  articleNumber: string;
}

interface PartsState {
  parts: Part[];
  loading: boolean;
  error: string | null;
}

const initialState: PartsState = {
  parts: [],
  loading: false,
  error: null
};

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setParts: (state, action: PayloadAction<Part[]>) => {
      state.parts = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setParts, setLoading, setError } = partsSlice.actions;
export default partsSlice.reducer;
export {};
