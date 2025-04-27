import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Coaching Finder</h1>
        <p className="text-lg">Find the best coaching institutes for your needs.</p>
        {/* Add institute data and sorting/filtering here */}
      </div>
    </div>
  );
};

export default HomePage;
