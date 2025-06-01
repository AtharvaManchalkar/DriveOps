import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Legal.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/home" className="legal-logo">
            <img src="/logo.svg" alt="DriveOps Logo" className="logo-image" />
            <span className="logo-text">Drive<span className="logo-highlight">Ops</span></span>
          </Link>
          <h1 className="legal-title">Privacy Policy</h1>
        </div>
        
        <div className="legal-content">
          <p className="legal-updated">Last Updated: May 15, 2023</p>
          
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>This Privacy Policy explains how DriveOps collects, uses, and discloses information about you when you use our web application. We are committed to protecting your privacy and handling your data in a secure manner.</p>
          </section>
          
          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We collect personal information that you voluntarily provide when registering for an account, such as your name and email address.</p>
            
            <h3>Vehicle Information</h3>
            <p>We collect information about vehicles that you add to our platform, including make, model, year, VIN, maintenance history, and images.</p>
            
            <h3>Usage Data</h3>
            <p>We automatically collect certain information about your device and how you interact with DriveOps, including IP address, browser type, pages visited, time spent on pages, and other analytical data.</p>
          </section>
          
          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain DriveOps services</li>
              <li>Process and respond to your requests</li>
              <li>Improve and develop new features</li>
              <li>Monitor usage patterns and track user activity</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Send you service-related emails and updates</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>4. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>We implement reasonable security measures to protect your information from unauthorized access, destruction, use, modification, or disclosure. However, no internet transmission is completely secure, and we cannot guarantee the security of information transmitted to or from DriveOps.</p>
          </section>
          
          <section className="legal-section">
            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Request data portability</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@driveops-example.com.</p>
          </section>
          
          <section className="legal-section">
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings, but disabling cookies may limit your use of certain features.</p>
          </section>
          
          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>DriveOps is not intended for children under 16. We do not knowingly collect information from children under 16. If you believe we have collected information from a child under 16, please contact us.</p>
          </section>
          
          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>
          </section>
          
          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us at privacy@driveops-example.com.</p>
          </section>
        </div>
        
        <div className="legal-footer">
          <Link to="/login" className="back-link">Back to Login</Link>
          <Link to="/terms" className="terms-link">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;