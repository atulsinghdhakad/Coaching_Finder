import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();

// Google Places API integration
const fetchCoachingCentersGoogle = async (query, location) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
    params: {
      query: query,
      location: location,
      radius: 5000,
      key: 'YOUR_GOOGLE_API_KEY',
    },
  });
  return response.data.results;
};

// Yellow Pages API integration
const fetchCoachingCentersDirectory = async (city) => {
  const response = await axios.get('https://api.yellowpages.com/v3/search', {
    params: {
      query: 'coaching centers',
      location: city,
      category: 'education',
      apiKey: 'YOUR_YELLOW_PAGES_API_KEY',
    },
  });
  return response.data.businesses;
};

// Web scraping example
const scrapeCoachingCenters = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let coachingCenters = [];
  $('div.coaching-center').each((index, element) => {
    const name = $(element).find('h3').text();
    const address = $(element).find('.address').text();
    const rating = $(element).find('.rating').text();
    coachingCenters.push({ name, address, rating });
  });
  return coachingCenters;
};

// Aggregate all data
app.get('/api/coaching-centers', async (req, res) => {
  try {
    const city = req.query.city || 'your default city';
    
    const googleResults = await fetchCoachingCentersGoogle('coaching center', city);
    const directoryResults = await fetchCoachingCentersDirectory(city);
    const scrapedResults = await scrapeCoachingCenters('https://example.com/coaching-listings');

    const allResults = {
      google: googleResults,
      directory: directoryResults,
      scraped: scrapedResults,
    };

    res.json(allResults);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching coaching center data' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});