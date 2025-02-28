import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../types';
// Удалили зависимость от services/api

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null
};

// Добавляем отсутствующий fetchTasks action creator
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Здесь должен быть вызов API
      // Вместо внешнего API, используем имитацию
      // В реальном проекте здесь должен быть вызов вашего API
      const mockResponse = await new Promise<Task[]>((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 500);
      });

      dispatch(setLoading(false));
      return mockResponse;
    } catch (error: any) {
      dispatch(setLoading(false));
      return rejectWithValue(error.message || 'Не удалось загрузить задачи');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setTasks, setLoading, setError } = tasksSlice.actions;
export default tasksSlice.reducer;