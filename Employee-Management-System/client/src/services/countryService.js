import apiClient, { COUNTRY_API_BASE_URL } from './apiClient';

const countryService = {
  getAllCountries: async () => {
    const response = await apiClient.get(COUNTRY_API_BASE_URL);
    return response.data;
  },
};

export default countryService;
