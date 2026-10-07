import React, { useState, useRef, useEffect } from 'react';
import ChatbotMenu from './ChatbotMenu';
import ChatbotMessage from './ChatbotMessage';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ChatbotWindow = ({ onClose }) => {
  const [view, setView] = useState('MAIN_MENU');
  const [email, setEmail] = useState('');
  const [trackingNum, setTrackingNum] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Trap focus inside the modal for accessibility
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    if (closeButtonRef.current) {
        closeButtonRef.current.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!email || !trackingNum) {
      setErrorMsg('Please enter both your email and tracking number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const response = await api.get(`/orders/${email}/${trackingNum}`);
      if (response.data && response.data.status === 200) {
        setOrderData(response.data.data || response.data.Data);
        setView('TRACK_SUCCESS');
      } else {
        setErrorMsg("We couldn't find an order with those details. Please check your email and tracking number.");
        setView('TRACK_ERROR');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMsg("We couldn't find an order with those details. Please check your email and tracking number.");
      } else {
        setErrorMsg("We're unable to check your order right now. Please try again later.");
      }
      setView('TRACK_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const renderContent = () => {
    switch (view) {
      case 'MAIN_MENU':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>Hi!</p>
              <p>How can I help you today?</p>
            </ChatbotMessage>
            <ChatbotMenu setView={setView} />
          </>
        );
      case 'TRACK_ORDER':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>Please enter your email and tracking number to check your order.</p>
            </ChatbotMessage>
            <form onSubmit={handleTrackOrder} className="chatbot-form">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address"
              />
              <input
                type="text"
                placeholder="Tracking Number"
                value={trackingNum}
                onChange={(e) => setTrackingNum(e.target.value)}
                aria-label="Tracking Number"
              />
              {errorMsg && <p className="chatbot-error">{errorMsg}</p>}
              <button type="submit" disabled={loading} className="chatbot-submit-btn">
                {loading ? 'Loading...' : 'Track'}
              </button>
            </form>
            <button className="chatbot-back-btn" onClick={() => { setView('MAIN_MENU'); setErrorMsg(''); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Menu
            </button>
          </>
        );
      case 'TRACK_SUCCESS':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>Here are your order details:</p>
            </ChatbotMessage>
            <div className="chatbot-order-card">
              <p><strong>Status:</strong> {orderData?.orderStatus}</p>
              <p><strong>Tracking:</strong> {orderData?.trackingNumber}</p>
              <p><strong>Total:</strong> Rs. {orderData?.totalPrice}</p>
            </div>
            <button className="chatbot-back-btn" onClick={() => { setView('MAIN_MENU'); setOrderData(null); setEmail(''); setTrackingNum(''); }}>
              Main Menu
            </button>
          </>
        );
      case 'TRACK_ERROR':
        return (
          <>
            <ChatbotMessage type="bot">
              <p className="chatbot-error-text"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px', verticalAlign:'middle'}}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>{errorMsg}</p>
            </ChatbotMessage>
            <button className="chatbot-back-btn" onClick={() => setView('TRACK_ORDER')}>
              Try Again
            </button>
            <button className="chatbot-back-btn" onClick={() => { setView('MAIN_MENU'); setErrorMsg(''); }}>
              Main Menu
            </button>
          </>
        );
      case 'RETURN_REFUND':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>For help with a return or refund, please contact our support team with your order details.</p>
            </ChatbotMessage>
            <a href="mailto:kanhajena45@gmail.com" className="chatbot-contact-btn">
              Contact Support
            </a>
            <button className="chatbot-back-btn" onClick={() => setView('MAIN_MENU')}>
              Main Menu
            </button>
          </>
        );
      case 'CANCEL_ORDER':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>If you need to cancel an order, please contact our support team as soon as possible before the item ships.</p>
            </ChatbotMessage>
            <a href="mailto:kanhajena45@gmail.com" className="chatbot-contact-btn">
              Contact Support
            </a>
            <button className="chatbot-back-btn" onClick={() => setView('MAIN_MENU')}>
              Main Menu
            </button>
          </>
        );
      case 'PAYMENT_ISSUE':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>Having trouble with your payment?</p>
              <p>If money was deducted but your order was not completed, please contact our support team with your payment details.</p>
            </ChatbotMessage>
            <a href="mailto:kanhajena45@gmail.com" className="chatbot-contact-btn">
              Contact Support
            </a>
            <button className="chatbot-back-btn" onClick={() => setView('MAIN_MENU')}>
              Main Menu
            </button>
          </>
        );
      case 'ACCOUNT_HELP':
        return (
          <>
            <ChatbotMessage type="bot">
              <p>Need help accessing your account?</p>
            </ChatbotMessage>
            <div className="chatbot-menu">
              <button className="chatbot-menu-btn" onClick={() => handleNavigate('/login')}>Go to Login</button>
              <button className="chatbot-menu-btn" onClick={() => handleNavigate('/register')}>Create Account</button>
            </div>
            <button className="chatbot-back-btn" onClick={() => setView('MAIN_MENU')}>
              Main Menu
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chatbot-window" ref={containerRef} role="dialog" aria-modal="true" aria-label="Support Assistant">
      <div className="chatbot-header">
        <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> Support Assistant</h3>
        <button className="chatbot-close-btn" onClick={onClose} ref={closeButtonRef} aria-label="Close support assistant">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div className="chatbot-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatbotWindow;
