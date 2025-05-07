import React, { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import verify from "../assets/login.jpg";
import { axiosInstance } from "../api/axios";
import { Loader } from "lucide-react";
import logo from '/logo.svg'
const VERIFY_URL = "/auth/activate-account";

function VerifyAccount() {
  const { setAuth } = useAuth();
  const codeRef = useRef(null);
  const errRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeFocus, setCodeFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    codeRef.current?.focus();

    // Check if email is in URL parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  useEffect(() => {
    setErrMsg("");
  }, [code, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setErrMsg("Invalid verification code format.");
      return;
    }

    if (!email) {
      setErrMsg("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        VERIFY_URL,
        JSON.stringify({ email, code }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setAuth({ email, verified: true });
      setCode("");
      setEmail("");
      navigate("/login", {
        state: {
          message: "Account activated successfully! You can now login.",
        },
      });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No server response");
      } else if (error.response?.status === 401) {
        setErrMsg("Invalid or expired code");
      } else if (error.response?.status === 400) {
        setErrMsg("Missing verification code or email");
      } else {
        setErrMsg(error.response?.data?.message || "Something went wrong");
      }
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-6">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white max-w-6xl w-full">
        <div className="hidden md:block w-1/2 ">
          <img
            src={verify}
            alt="Verification"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 max-w-md mx-auto py-8"
          >
            <div className="text-center mb-4">
                    <img src={logo} alt="logo" className='h-12  mx-auto my-2' />
              
              <h1 className="text-2xl font-semibold text-main-black">
                Verify Your Account
              </h1>
              <p className="text-gray-600 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {errMsg && (
              <div
                ref={errRef}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                aria-live="assertive"
              >
                {errMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!location.search.includes("email")}
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  ref={codeRef}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  onFocus={() => setCodeFocus(true)}
                  onBlur={() => setCodeFocus(false)}
                  aria-invalid={code.length !== 6 ? "true" : "false"}
                  aria-describedby="codenote"
                  maxLength={6}
                  required
                />
                <p
                  id="codenote"
                  className={`text-sm mt-1 ${
                    codeFocus && code && code.length !== 6
                      ? "text-red-500"
                      : "sr-only"
                  }`}
                >
                  <CancelIcon className="inline mr-1 h-4 w-4" /> Code must be
                  exactly 6 digits.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="bg-main-blue text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-200 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Now"
              )}
            </button>

            <div className="text-center space-y-3 pt-2">
              <p className="text-sm text-gray-600">
                Didn't receive a code?{" "}
                <Link
                  to="/resend-code"
                  className="text-main-blue font-medium hover:underline"
                >
                  Resend it
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Return to{" "}
                <Link
                  to="/login"
                  className="text-main-blue font-medium hover:underline"
                >
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

export default VerifyAccount;
