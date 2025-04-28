// src/components/InstituteList.js
import React from "react";

const InstituteList = ({ institutes }) => {
  return (
    <div className="institute-list">
      {institutes.map((institute, index) => (
        <div key={index} className="institute-card">
          <h3>{institute.name}</h3>
          <p>{institute.location}</p>
          <p>Rating: {institute.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default InstituteList;
