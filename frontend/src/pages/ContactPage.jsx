// src/pages/ContactPage.jsx
import React from 'react';
import ScrollToTop from './ScrollToTop';

const ContactPage = () => {
  return (
    <div className="contact-page bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <header className="text-center py-10 bg-purple-500 text-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We are here to help you. Reach out to us anytime!</p>
        </header>

        {/* Contact Form */}
        <section className="my-10">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4 text-center">Get in Touch</h2>
          <form className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" placeholder="Your Email" className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea rows="5" placeholder="Your Message" className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg">Send Message</button>
          </form>
        </section>

        {/* Address Section */}
        <section className="my-10 text-center">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Our Office</h2>
          <p className="text-lg">Hardiya Cable Network, Shivampri Colony, Ring Road, 452014, Indore</p>
          <p className="text-lg">Email: support@coachingfinder.com</p>
          <p className="text-lg">Phone: +91 7427802072</p>
        </section>

        {/* Scroll To Top */}
        <ScrollToTop />
      </div>
    </div>
  );
};

export default ContactPage;