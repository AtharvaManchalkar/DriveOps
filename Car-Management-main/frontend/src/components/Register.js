import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/AuthForms.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ""
  });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    // Check password strength when password changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    let score = 0;
    let message = "";
    
    if (password.length === 0) {
      setPasswordStrength({ score: 0, message: "" });
      return;
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Set message based on score
    if (score < 3) {
      message = "Weak";
    } else if (score < 5) {
      message = "Moderate";
    } else {
      message = "Strong";
    }
    
    setPasswordStrength({ score, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (!formData.agreeTerms) {
      setErrorMessage("You must agree to the terms and conditions");
      return;
    }
    
    if (passwordStrength.score < 3) {
      setErrorMessage("Please use a stronger password");
      return;
    }
    
    setLoading(true);

    try {
      const { name, email, password } = formData;
      await API.post("/auth/register", { name, email, password });
      
      setSuccessMessage("Registration successful! You can now log in.");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="auth-sidebar-content">
            <div className="auth-logo">
              <img src="/logo.svg" alt="DriveOps Logo" className="logo-image" />
              <h1 className="logo-text">Drive<span className="logo-highlight">Ops</span></h1>
            </div>
            <div className="auth-sidebar-info">
              <h2>Create Your Account</h2>
              <p>Join DriveOps and start managing your car inventory with our powerful platform.</p>
              <div className="auth-features">
                <div className="auth-feature">
                  <span className="feature-icon">🚀</span>
                  <span className="feature-text">Quick and easy setup</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">🔄</span>
                  <span className="feature-text">Seamless inventory management</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">📱</span>
                  <span className="feature-text">Access from any device</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">🛡️</span>
                  <span className="feature-text">Secure and reliable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form">
            <h2 className="auth-title">Sign Up</h2>
            <p className="auth-subtitle">Create a new account to get started</p>
            
            {errorMessage && (
              <div className="auth-message error">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="auth-message success">{successMessage}</div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength="8"
                  />
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar-container">
                      <div 
                        className={`strength-bar strength-${passwordStrength.score > 4 ? "strong" : passwordStrength.score > 2 ? "medium" : "weak"}`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                    <span className="strength-text">{passwordStrength.message}</span>
                  </div>
                )}
                <div className="password-tip">
                  Password should be at least 8 characters with letters, numbers, and special characters.
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to the <Link to="/terms" className="term-link">Terms of Service</Link> and <Link to="/privacy" className="term-link">Privacy Policy</Link>
                </label>
              </div>
              
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            
            <div className="auth-separator">
              <span>or</span>
            </div>
            
            <div className="social-login">
              <button className="social-button google" disabled>
                <img src="/google-logo.png" alt="Google" className="social-icon" />
                Sign up with Google
              </button>
              <button className="social-button github" disabled>
                <img src="/github-logo.png" alt="GitHub" className="social-icon" />
                Sign up with GitHub
              </button>
            </div>
            
            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;