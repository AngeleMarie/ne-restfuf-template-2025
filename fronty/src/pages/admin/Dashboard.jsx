import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../../api/axios'; // Import axiosPrivate
import SideBar from './SideBar';
import TopBar from '../../components/TopBar';
import MetricCard from '../../components/MetricCard';
import Table from '../../components/Table';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    adminBalance: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosPrivate.get('/admin/statistics',{
          headers:{
            "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className='flex flex-row bg-white min-h-screen md:mr-8'>
      <SideBar />
      <div className='flex-1 overflow-hidden'>
        <TopBar />
        <section className='p-4'>
          <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8'>
            <MetricCard
              icon={<PeopleIcon className='transition-all text-main-blue/90 group-hover:text-main-blue' />}
              title="Total Clients"
              total={stats.totalUsers}
            />
            <MetricCard
              icon={<MenuBookIcon className='transition-all text-main-blue/90 group-hover:text-main-blue' />}
              title="Total Books"
              total={stats.totalBooks}
            />
            <MetricCard
              icon={<LocalOfferIcon className='transition-all text-main-blue/90 group-hover:text-main-blue' />}
              title="Total Sales"
              total={stats.adminBalance}
            />
          </main>
          <div className='w-full  overflow-x-auto'>
            <Table />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
