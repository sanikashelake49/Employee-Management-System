import { configureStore } from '@reduxjs/toolkit';
import countryService from '../../services/countryService';
import countryReducer, { fetchCountries } from '../../features/countries/countrySlice';

jest.mock('../../services/countryService');

const buildStore = () =>
  configureStore({ reducer: { countries: countryReducer } });

describe('countrySlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has the expected initial state', () => {
    const store = buildStore();
    expect(store.getState().countries).toEqual({
      countries: [],
      status: 'idle',
      error: null,
    });
  });

  it('sets loading state while pending', () => {
    const store = buildStore();
    store.dispatch({ type: fetchCountries.pending.type });
    expect(store.getState().countries.status).toBe('loading');
  });

  it('stores countries on success', async () => {
    const countries = [{ id: '1', country: 'India' }];
    countryService.getAllCountries.mockResolvedValueOnce(countries);
    const store = buildStore();

    await store.dispatch(fetchCountries());

    expect(store.getState().countries.status).toBe('succeeded');
    expect(store.getState().countries.countries).toEqual(countries);
  });

  it('stores an error message on failure', async () => {
    countryService.getAllCountries.mockRejectedValueOnce(new Error('boom'));
    const store = buildStore();

    await store.dispatch(fetchCountries());

    expect(store.getState().countries.status).toBe('failed');
    expect(store.getState().countries.error).toBeTruthy();
  });
});
