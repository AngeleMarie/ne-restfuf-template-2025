import React from 'react'


function MetricCard({ title, total, dark ,icon}) {
    return (
      <div 
        className={`p-4 rounded-lg cursor-pointer shadow-sm flex m-4 items-center gap-3 transition-all group hover:bg-main-blue h-40 w-full ${dark ? 'bg-main-blue text-white' : 'bg-[#F8F8F8] text-main-blue'}`}>
        <div className={`rounded-full p-4 transition-all  ${dark ? '' : 'bg-[#EBE8E8]'} group-hover:bg-white`}>
        
          {icon}

        </div>
        <div>
          <p className={`text-sm transition-all ${dark ? '' : 'text-main-blue'} group-hover:text-white`}>{title}</p>
          <p className={`text-2xl font-medium transition-all group-hover:text-white`}>{total}</p>
        </div>
      </div>
    );
  }
export default MetricCard