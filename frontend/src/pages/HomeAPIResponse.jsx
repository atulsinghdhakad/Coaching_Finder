import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [coachingCenters, setCoachingCenters] = useState([]);

  useEffect(() => {
    const fetchCoachingCenters = async () => {
      const response = await axios.get('/api/coaching-centers?city=yourCity');
      setCoachingCenters(response.data);
    };

    fetchCoachingCenters();
  }, []);

  return (
    <div className="home-page">
      <h1>Coaching Institutes</h1>
      <div>
        {coachingCenters.google && coachingCenters.google.map((center, index) => (
          <div key={index}>
            <h3>{center.name}</h3>
            <p>{center.formatted_address}</p>
            <p>Rating: {center.rating}</p>
          </div>
        ))}
        {coachingCenters.directory && coachingCenters.directory.map((center, index) => (
          <div key={index}>
            <h3>{center.name}</h3>
            <p>{center.address}</p>
            <p>Rating: {center.rating}</p>
          </div>
        ))}
        {coachingCenters.scraped && coachingCenters.scraped.map((center, index) => (
          <div key={index}>
            <h3>{center.name}</h3>
            <p>{center.address}</p>
            <p>Rating: {center.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;