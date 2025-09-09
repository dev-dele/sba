import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { username, password, rememberMe })
    // Handle login logic here
  }

  return (
    <div className="App">
      {/* Skip to Content Link */}
      <a href="#content-wrapper" className="skip-link">Skip to Content</a>

      {/* Header */}
      <header className="header">
        <div className="container">
          <a href="/" className="logo">SBA PPP Forgiveness</a>
        </div>
      </header>

      {/* Browser Warning */}
      <div className="browser-warning">
        <div className="container">
          Your browser is out of date.
        </div>
      </div>

      {/* Main Content */}
      <main id="content-wrapper" className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <p>Welcome to the</p>
            <h1 className="hero-title">SBA PPP Direct Forgiveness Portal</h1>
            <hr className="hero-divider" />
            
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80" 
              alt="SBA PPP Direct Forgiveness Portal" 
              className="hero-image"
            />
            
            <h2>Register and Apply for PPP Forgiveness</h2>
            
            <p className="hero-description">
              This portal is made available by the US Small Business Administration to streamline 
              forgiveness processing for PPP Borrowers. After registration, you may use this 
              streamlined process to automatically submit your forgiveness request to your lender.
            </p>
            
            <p className="hero-description">
              For assistance, please visit{' '}
              <a href="https://caweb.sba.gov/cls/dsp_contactus.cfm" target="_blank" rel="noopener noreferrer">
                caweb.sba.gov/cls/dsp_contactus.cfm
              </a>.
            </p>
            
            <a href="/accounts/signup/?next=/" className="register-button">
              Register to Start Your Request
            </a>
          </div>
        </section>

        {/* Login Section */}
        <section className="login-section">
          <div className="container">
            <div className="login-container">
              <h2 className="login-title">Registered User Login</h2>
              <p>If you already have Log-in credentials, you can login here.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                
                <button type="submit" className="signin-button">
                  Sign In
                </button>
              </form>
              
              <div className="forgot-links">
                <a href="/accounts/password/reset/">Forgot Password?</a>
                <a href="/users/~forgot/username/">Forgot Username?</a>
              </div>
              
              <div className="new-user">
                New User? <strong><a href="/accounts/signup/?next=/">Register to Start Your Request</a></strong>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="resources-section">
          <div className="container">
            <h3 className="resources-title">Resources</h3>
            <p>
              <a href="https://sba-forgiveness-docs.s3-us-gov-west-1.amazonaws.com/SBA-PPP-DF-User-Guide.pdf" target="_blank" rel="noopener noreferrer">
                PPP Direct Forgiveness Platform User Guide
              </a>{' '}
              <em>
                <a href="https://dfussbaforgiveness.zendesk.com/hc/en-us/articles/4405857645083-Direct-Forgiveness-User-Guide-in-Additional-Languages" target="_blank" rel="noopener noreferrer">
                  User Guide in Other Languages
                </a>
              </em>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="https://connect.sba.gov/Home/Accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a>
            <a href="https://www.sba.gov/document/policy-guidance--privacy-impact-assessments" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms of Service</a>
            <a href="tel:877-552-2692">Customer Service: 877-552-2692</a>
          </div>
          <div className="copyright">
            <strong>Copyright ©2021 Small Business Administration.</strong> All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
