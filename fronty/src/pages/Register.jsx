import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../assets/signup.jpg";
import logo from "/logo.svg";
import { axiosInstance } from "../api/axios";

import { Loader,AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
const PWD_LENGTH = /^.{8,24}$/;
const PWD_LOWER = /[a-z]/;
const PWD_UPPER = /[A-Z]/;
const PWD_NUM = /[0-9]/;
const PWD_SPECIAL = /[!@#$%]/;
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const PHONE_REGEX = /^[0-9]{10}$/;

const Register = () => {
  const navigate = useNavigate();
  const fnameRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });

  const [focus, setFocus] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [valid, setValid] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (fnameRef.current) fnameRef.current.focus();
  }, []);

  const validateField = useCallback((field, value) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return USER_REGEX.test(value);
      case "email":
        return EMAIL_REGEX.test(value);
      case "phoneNumber":
        return PHONE_REGEX.test(value);
      default:
        return false;
    }
  }, []);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name !== "password" && name !== "address") {
        setValid((prev) => ({
          ...prev,
          [name]: validateField(name, value),
        }));
      }
    },
    [validateField]
  );

  const isPwdValid = useCallback(() => {
    const { password } = formData;
    return (
      PWD_LENGTH.test(password) &&
      PWD_LOWER.test(password) &&
      PWD_UPPER.test(password) &&
      PWD_NUM.test(password) &&
      PWD_SPECIAL.test(password)
    );
  }, [formData.password]);

  const clearMessages = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const invalidFields = [];
  
    if (!valid.firstName || !formData.firstName) {
      invalidFields.push("First Name");
    }
    if (!valid.lastName || !formData.lastName) {
      invalidFields.push("Last Name");
    }
    if (!valid.email || !formData.email) {
      invalidFields.push("Email");
    }
    if (!valid.phoneNumber || !formData.phoneNumber) {
      invalidFields.push("Phone Number");
    }
    if (!isPwdValid() || !formData.password) {
      invalidFields.push("Password");
    }
  
    if (invalidFields.length > 0) {
      setErrorMessage(`Please fill out the following fields correctly: ${invalidFields.join(", ")}`);
      setSuccessMessage("");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      if (response.status === 201) {
        setSuccessMessage("Account created successfully! Redirecting...");
        setErrorMessage("");
        setTimeout(() => navigate("/verify", { state: { email: formData.email } }), 2000);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Server error, please try again."
      );
      setSuccessMessage("");
    }
    finally {
      setLoading(false);
    }
  };
  


  const togglePasswordVisibility = useCallback(() => {
    setShowPwd((prev) => !prev);
  }, []);

  const handleFocus = useCallback((field, value) => {
    setFocus((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-white px-4">
      <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white max-w-6xl w-full py-8">
        <div className="hidden md:flex items-center justify-center w-full md:w-1/3">
          <img src={auth} alt="Authentication" className="object-contain rounded-lg" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col justify-center px-6 md:px-12 w-full md:w-2/3">
          <div className="my-6 text-center">
            <img src={logo} alt="Logo" className="h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Create New Account</h2>
            <p className="text-gray-600 text-sm mt-1">Welcome! Please enter your details.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {["firstName", "lastName"].map((field) => (
              <div className="w-full" key={field}>
                <label htmlFor={field} className="font-medium text-gray-700">
                  {field === "firstName" ? "First Name" : "Last Name"}
                </label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  ref={field === "firstName" ? fnameRef : null}
                  className="w-full border rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field === "firstName" ? "first" : "last"} name`}
                  autoComplete="off"
                  onFocus={() => handleFocus(field, true)}
                  onBlur={() => handleFocus(field, false)}
                  onChange={handleChange}
                  value={formData[field]}
                  required
                />
                {focus[field] && formData[field] && !valid[field] && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    3-24 characters. Must start with a letter.
                  </p>
                )}
              </div>
            ))}
          </div>

          {["email", "phoneNumber"].map((field) => (
            <div className="mt-4" key={field}>
              <label htmlFor={field} className="font-medium text-gray-700">
                {field === "email" ? "Email" : "Phone Number"}
              </label>
              <input
                id={field}
                type={field === "email" ? "email" : "tel"}
                name={field}
                className="w-full border rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter your ${field === "email" ? "email" : "10-digit phone number"}`}
                onFocus={() => handleFocus(field, true)}
                onBlur={() => handleFocus(field, false)}
                onChange={handleChange}
                value={formData[field]}
                required
              />
              {focus[field] && formData[field] && !valid[field] && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {field === "email" ? "Enter a valid email." : "Must be exactly 10 digits."}
                </p>
              )}
            </div>
          ))}

          <div className="mt-4">
            <label htmlFor="password" className="font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                name="password"
                className="w-full outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                onFocus={() => handleFocus('password', true)}
                onBlur={() => handleFocus('password', false)}
                value={formData.password}
                required
              />
              <button type="button" className="text-gray-500" onClick={togglePasswordVisibility}>
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {focus.password && (
              <div className="text-sm mt-1 space-y-1">
                {[
                  [PWD_LENGTH, "8-24 characters"],
                  [PWD_LOWER, "At least one lowercase letter"],
                  [PWD_UPPER, "At least one uppercase letter"],
                  [PWD_NUM, "At least one number"],
                  [PWD_SPECIAL, "At least one special character (!@#$%)"],
                ].map(([regex, label], i) => (
                  <p key={i} className={regex.test(formData.password) ? "text-green-600 flex items-center" : "text-red-500 flex items-center"}>
                    {regex.test(formData.password) ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
                    {label}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="font-medium text-gray-700">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              className="w-full border rounded-md p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your address"
              onChange={handleChange}
              value={formData.address}
              required
            />
          </div>

          {errorMessage && (
            <div className="fixed top-4 right-4 bg-red-100 text-red-700 px-6 py-2 rounded-lg shadow-lg flex items-start gap-3 z-50 w-[320px]">
              <AlertCircle className="w-5 h-5 cursor-pointer" onClick={clearMessages} />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="fixed top-4 right-4 bg-green-100 text-green-700 px-6 py-2 rounded-lg shadow-lg flex items-start gap-3 z-50 w-[320px]">
              <CheckCircle className="w-5 h-5 cursor-pointer" onClick={clearMessages} />
              {successMessage}
            </div>
          )}

          <div className="mt-4">
            <button type="submit" className="bg-main-blue text-white py-3 rounded-lg text-lg font-medium cursor-pointer hover:bg-blue-500 transition w-full duration-200 flex justify-center items-center" disabled={loading}>
              
                {loading ? (
                              <>
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Setting up...
                              </>
                            ) : (
                              "Create An Account"
                            )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-main-blue font-medium hover:text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
