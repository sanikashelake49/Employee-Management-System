import apiClient from '../../services/apiClient';
import countryService from '../../services/countryService';

jest.mock('../../services/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  EMPLOYEE_API_BASE_URL: 'https://mock-api.test/employee',
  COUNTRY_API_BASE_URL: 'https://mock-api.test/country',
  extractErrorMessage: jest.fn((error, fallback) => fallback),
}));

describe('countryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all countries', async () => {
    const countries = [{ id: '1', country: 'India' }];
    apiClient.get.mockResolvedValueOnce({ data: countries });

    const result = await countryService.getAllCountries();

    expect(apiClient.get).toHaveBeenCalledWith('https://mock-api.test/country');
    expect(result).toEqual(countries);
  });

  it('propagates errors from the API client', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('country api failure'));

    await expect(countryService.getAllCountries()).rejects.toThrow(
      'country api failure'
    );
  });
});
