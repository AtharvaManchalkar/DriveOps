import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/AuthForms.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
    
    // Check for remembered credentials
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });
      
      // Save token
      localStorage.setItem("token", data.token);
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Navigate to home
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!resetEmail) {
        setErrorMessage("Please enter your email address");
        return;
      }
      
      await API.post("/auth/reset-password", { email: resetEmail });
      setSuccessMessage("If your email exists in our system, you will receive password reset instructions shortly.");
      
      // Auto-hide reset form after success
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrorMessage("Password reset failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setLoading(true);
    setEmail("demo@example.com");
    setPassword("demopassword");
    
    try {
      const { data } = await API.post("/auth/login", { 
        email: "demo@example.com", 
        password: "demopassword" 
      });
      
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      console.error("Demo login failed:", error);
      setErrorMessage("Demo login failed. Please try again or use regular login.");
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
              <h2>Welcome back!</h2>
              <p>Log in to access your car management dashboard and manage your vehicle inventory with ease.</p>
              <div className="auth-features">
                <div className="auth-feature">
                  <span className="feature-icon">🚗</span>
                  <span className="feature-text">Manage your car inventory</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">⚖️</span>
                  <span className="feature-text">Compare cars side by side</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">🔍</span>
                  <span className="feature-text">Track maintenance history</span>
                </div>
                <div className="auth-feature">
                  <span className="feature-icon">📊</span>
                  <span className="feature-text">Get detailed analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          {!showForgotPassword ? (
            // Login form
            <div className="auth-form">
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
              
              {errorMessage && (
                <div className="auth-message error">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="auth-message success">{successMessage}</div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📧</span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              
              <div className="auth-separator">
                <span>or</span>
              </div>
              
              <div className="social-login">
                <button className="social-button google" disabled>
                  <img src="/google-logo.png" alt="Google" className="social-icon" />
                  Sign in with Google
                </button>
                <button className="social-button github" disabled>
                  <img src="/github-logo.png" alt="GitHub" className="social-icon" />
                  Sign in with GitHub
                </button>
              </div>
              
              <button
                className="demo-login-button"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Try Demo Account
              </button>
              
              <div className="auth-footer">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="auth-link">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            // Forgot password form
            <div className="auth-form">
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">Enter your email to receive a password reset link</p>
              
              {errorMessage && (
                <div className="auth-message error">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="auth-message success">{successMessage}</div>
              )}
              
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="resetEmail">Email Address</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📧</span>
                    <input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </button>
                
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={loading}
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;