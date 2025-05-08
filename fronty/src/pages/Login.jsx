import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Loader, AlertCircle, CheckCircle, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import logo from '/logo.svg';

const LOGIN_URL = '/auth/login';

function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const emailRef = useRef(null);
  const errRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [persist, setPersist] = useLocalStorage('persist', false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setErrMsg('Email and password are required');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axiosInstance.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
  
      const { accessToken, user } = response.data;
      setAuth({ user, accessToken: accessToken, role: user.role });
      setEmail('');
      setPassword('');
  
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/store', { replace: true });
      }
  
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('role', response.data.user.role);
  
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 403) {
        if (error.response.data?.message?.includes('activate')) {
          setErrMsg('Please activate your account first');
          setTimeout(() => {
            navigate(`/verify?email=${encodeURIComponent(email)}`);
          }, 3000);
        } else {
          setErrMsg('User not found. Please register.');
        }
      } else if (error.response?.status === 401) {
        setErrMsg('Password incorrect');
      } else {
        setErrMsg(error.response?.data?.message || 'Login Failed');
      }
  
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };
  
  
  const togglePersist = () => {
    setPersist(prev => !prev);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-6">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white max-w-6xl w-full">
        <div className="hidden md:block w-1/2 bg-white">
          <img
            src="/src/assets/login.jpg"
            alt="Login"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6 max-w-md mx-auto py-8">
            <div className="text-center mb-4">
              <img src={logo} alt="logo" className='h-12 mx-auto my-2' />
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Login to your account</p>
            </div>

            {errMsg && (
              <div ref={errRef} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start" aria-live="assertive">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{errMsg}</p>
                  {errMsg.includes('activate') && (
                    <p className="text-sm mt-1">Redirecting to verification page...</p>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{successMsg}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    ref={emailRef}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-1 outline-none focus:ring-main-blue focus:border-main-blue"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 p-3 focus:ring-1 outline-none focus:ring-main-blue focus:border-main-blue"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="persist"
                    type="checkbox"
                    checked={persist}
                    onChange={togglePersist}
                    className="h-4 w-4 text-main-blue focus:ring-main-blue border-gray-300 rounded"
                  />
                  <label htmlFor="persist" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot" className="text-sm font-medium text-main-blue hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="bg-main-blue text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-500 transition duration-200 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-main-blue font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
