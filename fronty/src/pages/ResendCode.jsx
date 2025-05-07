import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import login from '../assets/login.jpg';
import logo from '/logo.svg';

const RESEND_URL = '/auth/resend-activation-code';

function ResendCode() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  const errRef = useRef(null);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrMsg('Email is required');
      return;
    }

    setLoading(true);
    setErrMsg('');

    try {
      const response = await axiosInstance.post(
        RESEND_URL,
        JSON.stringify({ email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setCountdown(60);

      setTimeout(() => {
        navigate(`/verify?email=${encodeURIComponent(email)}`);
      }, 3000);

    } catch (error) {
      setSuccess(false);

      if (!error?.response) {
        setErrMsg('No server response');
      } else if (error.response?.status === 429) {
        const message = error.response.data?.message;
        setErrMsg(message || 'Too many attempts. Please try again later.');

        const timeMatch = message?.match(/(\d+)\s+(minute|second)/);
        if (timeMatch) {
          const amount = parseInt(timeMatch[1]);
          const unit = timeMatch[2];
          setCountdown(unit === 'minute' ? amount * 60 : amount);
        }
      } else if (error.response?.status === 404) {
        setErrMsg('Email not found. Please check your email or register.');
      } else {
        setErrMsg(error.response?.data?.message || 'Failed to resend activation code');
      }

      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-6">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white max-w-6xl w-full">
        {/* Image Section */}
        <div className="hidden md:block w-1/2">
          <img
            src={login}
            alt="Login"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Form Section */}
        <div className="flex flex-col justify-center items-center p-8 w-full md:w-1/2">
          <div className="text-center mb-6">
            <img src={logo} alt="logo" className="h-12 mx-auto my-2" />
            <h1 className="text-2xl font-semibold text-main-black">Resend Activation Code</h1>
            <p className="text-gray-600 mt-2">We'll send a new verification code to your email</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success!</p>
                <p>A new activation code has been sent to {email}.</p>
                <p className="mt-2 text-sm">Redirecting to verification page in 3 seconds...</p>
              </div>
            </div>
          ) : errMsg ? (
            <div ref={errRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" aria-live="assertive">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p>{errMsg}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                ref={emailRef}
                className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-describedby="email-error"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-main-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex justify-center items-center disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={loading || countdown > 0}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Try again in ${countdown}s`
              ) : (
                "Send New Code"
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Remember your code?{" "}
                <Link to="/verify" className="text-main-blue font-medium hover:underline">
                  Go to verification
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Return to{" "}
                <Link to="/login" className="text-main-blue font-medium hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResendCode;
