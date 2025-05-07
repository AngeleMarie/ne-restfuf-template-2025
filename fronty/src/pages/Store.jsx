import React from 'react'
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import ItemGrid from '../components/ItemGrid';

function Store() {
  return (
    <main className='flex flex-row bg-white min-h-screen md:mr-8'>
    <SideBar />
    <div className='flex-1 overflow-hidden'>
      <TopBar />
     <div>
      <ItemGrid/>
     </div>
    </div>
  </main>
);
}


export default Store