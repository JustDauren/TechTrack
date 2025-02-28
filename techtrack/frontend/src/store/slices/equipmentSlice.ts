import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Equipment } from '../../types';
// Удалили зависимость от services/api

interface EquipmentState {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
}

const initialState: EquipmentState = {
  equipment: [],
  loading: false,
  error: null
};

// Добавляем отсутствующий fetchEquipment action creator
export const fetchEquipment = createAsyncThunk(
  'equipment/fetchEquipment',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Здесь должен быть вызов API
      // Вместо внешнего API, используем имитацию
      // В реальном проекте здесь должен быть вызов вашего API
      const mockResponse = await new Promise<Equipment[]>((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 500);
      });

      dispatch(setLoading(false));
      return mockResponse;
    } catch (error: any) {
      dispatch(setLoading(false));
      return rejectWithValue(error.message || 'Не удалось загрузить оборудование');
    }
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setEquipment: (state, action: PayloadAction<Equipment[]>) => {
      state.equipment = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.equipment = action.payload;
        state.loading = false;
      })
      .addCase(fetchEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setEquipment, setLoading, setError } = equipmentSlice.actions;
export default equipmentSlice.reducer;