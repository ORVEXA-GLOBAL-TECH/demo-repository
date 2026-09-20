import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('superadmin@alleviare.com');
  const [password, setPassword] = useState('SuperAdmin@2026!GlobalHQ');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login({
        email,
        password
      });
    } catch (err) {
      setErrorMessage(err.message || 'Super Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneClickSuperAdmin = () => {
    setEmail('superadmin@alleviare.com');
    setPassword('SuperAdmin@2026!GlobalHQ');
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  return (
    <div className="salesskip-split-container">
      {/* LEFT BLUE HERO PANEL */}
      <div className="salesskip-left-panel">
        {/* Geometric Wireframe Curves Background */}
        <div className="geometric-arcs-bg">
          <svg className="arcs-svg" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50 450 C 150 150, 450 100, 700 250" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />
            <path d="M-10 490 C 180 200, 480 140, 740 300" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.5" />
            <path d="M30 530 C 210 250, 510 180, 780 350" stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1.5" />
            <path d="M70 570 C 240 300, 540 220, 820 400" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />
            <path d="M110 610 C 270 350, 570 260, 860 450" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1.5" />
            <path d="M150 650 C 300 400, 600 300, 900 500" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="left-panel-content">
          {/* Top Starburst Icon */}
          <div className="starburst-icon-box">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" stroke="white"></line>
              <line x1="2" y1="12" x2="22" y2="12" stroke="white"></line>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white"></line>
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white"></line>
            </svg>
          </div>

          <div className="left-hero-text">
            <h1 className="hero-main-greeting">
              Hello<br />
              <span>Orvexa SuperAdmin!</span> <span className="wave-emoji">👋</span>
            </h1>
            <p className="hero-subtext">
              Centralized SaaS multi-tenant governance, sovereign compliance, and enterprise automation. Get highly productive and save tons of time!
            </p>
          </div>

          {/* Left Footer Copyright */}
          <div className="left-panel-footer">
            &copy; 2026 Orvexa Global Tech. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT WHITE LOGIN PANEL */}
      <div className="salesskip-right-panel">
        <div className="right-panel-inner">
          {/* Brand Header */}
          <div className="brand-title-row">
            <h2 className="brand-logo-text">Orvexa</h2>
          </div>

          {/* Welcome Back Header */}
          <div className="welcome-header-group">
            <h1 className="welcome-heading">Welcome Back!</h1>
            <p className="welcome-subtext">
              Don't have an account? <a href="#contact-hq" onClick={(e) => e.preventDefault()} className="create-account-link">Request new tenant access</a>. It takes less than a minute.
            </p>
          </div>

          {errorMessage && (
            <div className="auth-error-banner-clean">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="clean-login-form">
            <div className="clean-form-group">
              <input
                id="superadmin-email"
                type="email"
                className="clean-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="clean-form-group password-input-wrap">
              <input
                id="superadmin-password"
                type={showPassword ? 'text' : 'password'}
                className="clean-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="clean-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Login Now Button */}
            <button
              type="submit"
              className="clean-login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login Now'}
            </button>
          </form>

          {/* Quick 1-Click Evaluation Bar */}
          <div className="quick-access-chip-row">
            <button
              type="button"
              className="quick-eval-pill"
              onClick={handleOneClickSuperAdmin}
            >
              <CheckCircle2 size={15} color="#10b981" />
              <span>1-Click Super Admin Auto Fill &amp; Login</span>
            </button>
          </div>

          {/* Forget Password */}
          <div className="forget-password-row">
            <span>Forget password? </span>
            <button
              type="button"
              className="forget-link-btn"
              onClick={() => alert('Please contact global infrastructure security team at security@orvexa.com')}
            >
              Click here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
