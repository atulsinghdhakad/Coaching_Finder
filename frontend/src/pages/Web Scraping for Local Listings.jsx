import axios from 'axios';
import cheerio from 'cheerio';

const scrapeCoachingCenters = async (url) => {
  const { data } = await axios.get(url);  // URL to scrape

  const $ = cheerio.load(data);
  let coachingCenters = [];
  
  // Scrape data from the page
  $('div.coaching-center').each((index, element) => {
    const name = $(element).find('h3').text();
    const address = $(element).find('.address').text();
    const rating = $(element).find('.rating').text();
    coachingCenters.push({ name, address, rating });
  });

  return coachingCenters;
};