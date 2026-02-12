import { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo Component
const Logo = () => (
  <svg viewBox="0 0 500 500" className="w-32 h-32 md:w-40 md:h-40">
    <defs>
      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#2D8B4E',stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#1A5C33',stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="lightGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#4CAF50',stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#2E7D32',stopOpacity:1}} />
      </linearGradient>
    </defs>
    <g transform="translate(150, 80)">
      <path d="M100 40 L180 100 L180 180 L20 180 L20 100 Z" fill="url(#greenGradient)"/>
      <path d="M100 10 L195 90 L185 100 L100 30 L15 100 L5 90 Z" fill="url(#lightGreen)"/>
      <rect x="80" y="120" width="40" height="60" fill="#FFFFFF" rx="3"/>
      <rect x="35" y="110" width="30" height="30" fill="#FFFFFF" rx="2"/>
      <rect x="135" y="110" width="30" height="30" fill="#FFFFFF" rx="2"/>
      <circle cx="155" cy="55" r="28" fill="none" stroke="#1A5C33" strokeWidth="8"/>
      <line x1="175" y1="75" x2="200" y2="100" stroke="#1A5C33" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="155" cy="45" r="10" fill="#2D8B4E"/>
      <path d="M145 70 Q155 58 165 70" fill="#2D8B4E"/>
    </g>
    <text x="250" y="320" fontFamily="Arial, Helvetica, sans-serif" fontSize="52" fontWeight="700" fill="#1A5C33" textAnchor="middle">
      <tspan fill="#2D8B4E">find</tspan><tspan fill="#4CAF50">me</tspan>
    </text>
    <text x="250" y="380" fontFamily="Arial, Helvetica, sans-serif" fontSize="58" fontWeight="700" fill="#1A5C33" textAnchor="middle">agent</text>
    <text x="250" y="430" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="400" fill="#666666" textAnchor="middle">Real Estate Agent Finder</text>
    <text x="250" y="460" fontFamily="Arial, Helvetica, sans-serif" fontSize="16" fontWeight="400" fill="#888888" textAnchor="middle">.com.au</text>
  </svg>
);

// Main Landing Page
function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Submit to backend
      await axios.post(`${API}/leads`, formData);
      
      // Fire Google Analytics conversion event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'Submit', {
          'event_callback': () => {
            console.log('Conversion tracked');
          },
          'event_timeout': 2000,
        });
      }
      
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">We've received your details. One of our expert real estate agents will contact you shortly.</p>
          <button 
            onClick={() => {setSubmitted(false); setFormData({name:'',email:'',phone:'',suburb:'',message:''});}}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
            data-testid="submit-another-btn"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <Logo />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Find Your Perfect <br/>
                <span className="text-green-600">Real Estate Agent</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-xl">
                Connect with top-rated local agents in Australia. Whether buying, selling, or renting - we'll match you with the right expert.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Free Service</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Verified Agents</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Australia Wide</span>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Get Started Today</h2>
                <p className="text-gray-500 text-center mb-6">Fill in your details and we'll find the best agent for you</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0412 345 678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suburb / Location *</label>
                    <input
                      type="text"
                      name="suburb"
                      value={formData.suburb}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Sydney, Melbourne, Brisbane"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      data-testid="input-suburb"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What do you need help with?</label>
                    <select
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      data-testid="select-service"
                    >
                      <option value="">Select a service</option>
                      <option value="Buying">Buying a property</option>
                      <option value="Selling">Selling a property</option>
                      <option value="Renting">Renting a property</option>
                      <option value="Property Management">Property Management</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm" data-testid="error-message">
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    data-testid="submit-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Find My Agent'
                    )}
                  </button>
                </form>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  By submitting, you agree to be contacted by local real estate agents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit Your Details</h3>
              <p className="text-gray-600">Tell us about your property needs and location preferences.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Matched</h3>
              <p className="text-gray-600">We connect you with top-rated local agents in your area.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Journey</h3>
              <p className="text-gray-600">Work with your chosen agent to buy, sell, or rent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">© 2025 FindMeAgent.com.au - All Rights Reserved</p>
          <p className="text-gray-500 text-sm">Connecting Australians with trusted real estate professionals</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
