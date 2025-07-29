
import React from 'react';
// No PrimeReact, no PrimeFlex, no React Native imports needed for this.

// You might still have some global CSS in your project
// For example, if you have an index.css or App.css, you can put styles there
// import './About.css'; // If you create a separate CSS file for this component

function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Team 11</h1>

      <p style={styles.paragraph}>
        Welcome to Team 11! We are dedicated to deliver the best travel risk solution.
      </p>

      <p style={styles.paragraph}>
        We believe in team work and providing robost clean solutions.
        Thank you for being a part of our journey!
      </p>

      <div style={styles.contactInfo}>
        <h2 style={styles.subHeading}>Contact Us</h2>
        <p>
          Have questions or feedback? Feel free to reach out to us at:
          <br />
          <a href="purnjappie@gamil.com" style={styles.link}>support@team11.com</a>
        </p>
      </div>

      <p style={styles.footerText}>&copy; {new Date().getFullYear()} Team 11. All rights reserved.</p>
    </div>
  );
}

// Simple inline styles (or move these to a separate CSS file if preferred)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif', // A common, readable font
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '800px', // Max width for readability
    margin: '40px auto', // Center the content with some top/bottom margin
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center', // Center text for a clean look
  },
  title: {
    fontSize: '2.5em',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '1.5em',
    color: '#34495e',
    marginTop: '30px',
    marginBottom: '15px',
  },
  paragraph: {
    fontSize: '1.1em',
    marginBottom: '15px',
    textAlign: 'justify', // Justify paragraphs for better readability
    padding: '0 20px', // Add some internal padding
  },
  contactInfo: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  footerText: {
    fontSize: '0.9em',
    color: '#777',
    marginTop: '40px',
  }
};

export default About;