import axios from 'axios';

const fetchCoachingCentersGoogle = async (query, location) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
    params: {
      query: query,
      location: location, // Lat, Lng of the city or area
      radius: 5000, // Search within a 5km radius
      key: 'YOUR_GOOGLE_API_KEY',
    },
  });

  return response.data.results; // Return results containing places
};