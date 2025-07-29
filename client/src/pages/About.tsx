import React from 'react';

function About() {
  return (
    <div className="font-sans leading-relaxed text-gray-800 max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-4xl text-gray-900 mb-6 font-bold">About Team 11</h1>

      <p className="text-lg mb-4 text-justify px-4">
        Welcome to Team 11! We are dedicated to deliver the best travel risk solution.
      </p>

      <p className="text-lg mb-4 text-justify px-4">
        We believe in team work and providing robust clean solutions.
        Thank you for being a part of our journey!
      </p>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-2xl text-gray-700 mb-4 font-semibold">Contact Us</h2>
        <p>
          Have questions or feedback? Feel free to reach out to us at:
          <br />
          <a href="mailto:support@team11.com" className="text-blue-600 hover:underline">
            support@team11.com
          </a>
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Team 11. All rights reserved.
      </p>
    </div>
  );
}

export default About;