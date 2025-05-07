import React, { useState } from 'react';
import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import logo from '/logo.svg';

function Welcome() {
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (!accepted) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000); 
    } else {
      setShowError(false);
      navigate(path);
    }
  };

  return (
    <div className='relative h-screen w-full flex flex-col justify-center items-center'>

      {showError && (
        <div className={`absolute top-4 right-4 bg-red-100 text-red-700 px-6 py-3 rounded-lg shadow-lg flex items-start gap-3 z-50 w-[320px] `}>
          <div className="flex-1 text-sm  font-medium">
            You must check the checkbox to continue.
          </div>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setShowError(false);
                setIsExiting(false);
              }, 200); 
            }}
            className="text-red-700 hover:text-red-900 text-lg font-bold"
          >
            <MdCancel className='h-1/2 my-2' />
          </button>
        </div>
      )}

      <img src={logo} alt="logo" className='text-main-blue my-10' />
      <p className='text-main-black capitalize text-3xl font-medium p-4 text-center md:text-left'>
        Manage Your Finances Easily
      </p>

      <div className="flex my-8 justify-center items-center space-x-4">
        <div className="w-6 h-6 bg-main-black rounded-full animate-bounceX"></div>
        <div className="w-6 h-6 bg-main-blue rounded-full animate-bounceY"></div>
        <div className="w-6 h-6 bg-main-black rounded-full animate-bounce"></div>
        <div className="w-6 h-6 bg-main-blue rounded-full animate-bounceX"></div>
        <div className="w-6 h-6 bg-main-black rounded-full animate-bounceY"></div>
        <div className="w-6 h-6 bg-main-blue rounded-full animate-bounce"></div>
      </div>

      <div>
        <div className='flex justify-center items-center'>
          <input
            type="checkbox"
            className='cursor-pointer mx-3 my-1'
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <p className='capitalize text-main-black text-center pb-3'>
            Accept terms & conditions
          </p>
        </div>

        <div className='flex flex-row gap-x-6 justify-center'>
          <button
            onClick={() => handleNavigation('/login')}
            className='rounded-full border-2 underline border-main-blue text-main-blue px-12 py-2 my-4'
          >
            Signin
          </button>
          <button
            onClick={() => handleNavigation('/register')}
            className='bg-main-blue capitalize rounded-full font-medium text-white px-12 py-2 my-4'
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
