import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import countryService from '../../services/countryService';
import { extractErrorMessage } from '../../services/apiClient';

export const fetchCountries = createAsyncThunk(
  'countries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await countryService.getAllCountries();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Unable to load countries. Please try again.')
      );
    }
  }
);

const initialState = {
  countries: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load countries.';
      });
  },
});

export default countrySlice.reducer;
