import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Legal.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/home" className="legal-logo">
            <img src="/logo.svg" alt="DriveOps Logo" className="logo-image" />
            <span className="logo-text">Drive<span className="logo-highlight">Ops</span></span>
          </Link>
          <h1 className="legal-title">Terms of Service</h1>
        </div>
        
        <div className="legal-content">
          <p className="legal-updated">Last Updated: May 15, 2023</p>
          
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>Welcome to DriveOps ("we," "our," or "us"). These Terms of Service govern your use of our web application and services. By using DriveOps, you agree to these Terms. Please read them carefully.</p>
          </section>
          
          <section className="legal-section">
            <h2>2. Definitions</h2>
            <p>"DriveOps" refers to our car management web application, accessible at driveops.example.com.</p>
            <p>"User," "you," or "your" refers to individuals accessing or using DriveOps.</p>
            <p>"Content" includes text, images, data, and other materials uploaded to or displayed on DriveOps.</p>
          </section>
          
          <section className="legal-section">
            <h2>3. User Accounts</h2>
            <p>You must register for an account to access certain features of DriveOps. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
            <p>You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          </section>
          
          <section className="legal-section">
            <h2>4. User Content</h2>
            <p>You retain ownership of any content you upload or create on DriveOps. By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, display, reproduce, modify, and distribute your content for the purpose of operating DriveOps.</p>
            <p>You are solely responsible for the content you upload and must ensure it does not violate any laws or infringe on others' rights.</p>
          </section>
          
          <section className="legal-section">
            <h2>5. Prohibited Activities</h2>
            <p>When using DriveOps, you agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon any third-party rights</li>
              <li>Upload malicious code or attempt to hack our systems</li>
              <li>Use the service to distribute unsolicited advertising</li>
              <li>Impersonate others or provide false information</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>6. Intellectual Property</h2>
            <p>DriveOps and its original content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws.</p>
          </section>
          
          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of DriveOps.</p>
          </section>
          
          <section className="legal-section">
            <h2>8. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last Updated" date at the top of these Terms or by other means as determined by us.</p>
          </section>
          
          <section className="legal-section">
            <h2>9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </section>
          
          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@driveops-example.com.</p>
          </section>
        </div>
        
        <div className="legal-footer">
          <Link to="/login" className="back-link">Back to Login</Link>
          <Link to="/privacy" className="privacy-link">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;