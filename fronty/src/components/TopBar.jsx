import React from 'react'
import { useLocation } from 'react-router-dom';

function TopBar() {
  const location = useLocation();
  const pageTitle = location.pathname.substring(1);

  
  const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', role: 'Visitor' };

  return (
    <section className='bg-white justify-between px-12 items-center flex flex-row'>
      <h1 className='text-2xl font-semibold text-main-black capitalize'>{pageTitle}</h1>
      <div className='flex flex-col justify-end items-center p-4'>
        <p className='text-main-black font-semibold text-lg'>{user.fullName}</p>
        <p className='text-main-blue ml-12 font-medium  text-sm uppercase'>{user.role}</p>
      </div>
    </section>
  )
}

export default TopBar;
