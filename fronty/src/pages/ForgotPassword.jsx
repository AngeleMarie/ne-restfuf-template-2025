import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import password from "../assets/password.jpg"
import { Loader, AlertCircle, Mail } from 'lucide-react';
import logo from '/logo.svg'

const FORGOT_PASSWORD_URL = '/auth/forgot-password';
const REDIRECT_DELAY = 3000;

function ForgotPassword() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const errRef = useRef(null);

  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email) {
      setErrMsg('Email is required');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify({ email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/reset', { state: { email } });
      }, REDIRECT_DELAY);

    } catch (err) {
      setSuccess(false);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 404) {
        setErrMsg('Email not found');
      } else {
        setErrMsg('Failed to send reset code');
      }
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-6">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden  bg-white max-w-6xl w-full">
        <div className="hidden md:block w-1/2 bg-white">
          <img
            src={password}
            alt="Forgot Password"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-8">
                    <img src={logo} alt="logo" className='h-12  mx-auto my-2' />
              <h1 className="text-2xl font-semibold text-main-black">Forgot Password?</h1>
              <p className="text-gray-600 mt-2">Enter your email to receive a reset code</p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg" aria-live="polite">
                <p>Reset code has been sent to your email.</p>
                <p className="text-sm mt-2">Redirecting to reset password page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errMsg && (
                  <div ref={errRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" aria-live="assertive">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{errMsg}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      ref={emailRef}
                      className="w-full border border-gray-300 rounded-md pl-10 p-2 focus:ring-1 outline-none focus:ring-main-blue focus:border-main-blue"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-main-blue text-white py-3 rounded-lg text-lg font-medium hover:bg-main-blue transition duration-200 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </form>
            )}

            <div className="text-center mt-6">
              <Link to="/login" className="text-main-blue hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
