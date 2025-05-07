import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import { Loader, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import password from "../assets/password.jpg"
import logo from '/logo.svg'

const RESET_PASSWORD_URL = '/auth/reset-password';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const codeRef = useRef(null);
  const errRef = useRef(null);
  
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot');
    }
    if (codeRef.current) codeRef.current.focus();
  }, [email, navigate]);

  useEffect(() => {
    setErrMsg('');
  }, [code, newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setErrMsg('Invalid reset code');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrMsg('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrMsg('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        RESET_PASSWORD_URL,
        JSON.stringify({
          email,
          resetCode: code,
          newPassword
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      navigate('/login', {
        state: { message: 'Password reset successful! You can now login with your new password.' }
      });

    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 400) {
        setErrMsg('Invalid reset code');
      } else {
        setErrMsg('Failed to reset password');
      }

      if (errRef.current) errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-6">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white max-w-6xl w-full">
        <div className="hidden md:block w-1/2">
          <img
            src={password}
            alt="Reset Password"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-8">
              <img sc={logo} alt="logo" className='mx-auto h-12'/>
              <h1 className="text-2xl font-semibold text-main-black">Reset Password</h1>
              <p className="text-gray-600 mt-2">Enter the code sent to your email and your new password</p>
            </div>

            {errMsg && (
              <div ref={errRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start" aria-live="assertive">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{errMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                <input
                  id="code"
                  type="text"
                  ref={codeRef}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 outline-none focus:ring-main-blue focus:border-main-blue"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-10 p-2 focus:ring-1 outline-none focus:ring-main-blue focus:border-main-blue"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-md outline-none pl-10 pr-10 p-2 focus:ring-1 focus:ring-main-blue focus:border-main-blue"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-main-blue text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="text-main-blue font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
