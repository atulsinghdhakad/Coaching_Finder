import React from "react";

const DataDeletionPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Data Deletion Instructions</h1>
      <p className="mb-4 text-center max-w-xl">
        If you logged into Coaching Finder using Facebook and want to delete your data, follow these steps:
      </p>
      <ol className="list-decimal list-inside text-left max-w-xl space-y-2">
        <li>Go to your Facebook Account Settings</li>
        <li>Click <strong>Apps and Websites</strong></li>
        <li>Find <strong>Coaching Finder</strong> and click <strong>Remove</strong></li>
        <li>Facebook will notify us and your data will be deleted.</li>
      </ol>
      <p className="mt-6">
        For manual deletion, email us at: <a href="mailto:contact@coachingfinder.com" className="text-blue-500 underline">contact@coachingfinder.com</a>
      </p>
    </div>
  );
};

export default DataDeletionPage;

