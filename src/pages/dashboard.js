import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  BarElement,
  RadialLinearScale,
  PolarAreaController,
} from 'chart.js';
import { Line, Pie, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  BarController,
  BarElement,
  RadialLinearScale,
  PolarAreaController,
);
function Dashboard() {
  const { company } = useAuth()
  useEffect(() => {
    // console.log('712201', company);
  },[company])
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const salesReportData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Report Data',
        data: [20, 19, 3, 8, 16, 32],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const todaySalesData = {
    labels: ['Cash Sales', 'Card Sales', 'Upi Sales'],
    datasets: [
      {
        data: [2500, 1500, 600],
        backgroundColor: ['#69bb56f7', '#f16464f7', '#3498db'],
      },
    ],
  };

  const barChartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    datasets: [
      {
        label: 'Bar Chart Data',
        data: [12, 19, 3, 5, 2],
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        data: [20, 15, 25, 10, 30],
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
      },
    ],
  };

  const radarChartData = {
    labels: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
    datasets: [
      {
        label: 'Radar Chart Data',
        data: [90, 70, 50, 80, 60],
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  const polarAreaChartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    datasets: [
      {
        label: 'Polar Area Chart Data',
        data: [15, 25, 20, 10, 30],
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
      },
    ],
  };
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      setDeferredPrompt(null);
    }
  };
  return (
    <div className="container min-h-screen p-4">
      {deferredPrompt && (
        <div className="fixed bottom-0 right-0 p-4">
          <button onClick={handleAddToHomeScreen} className="bg-blue-500 text-white p-2 rounded">
            Add to Home Screen
          </button>
        </div>
      )}
      <div className='flex items-center justify-start w-full h-full'>
        <p className='text-[30px] text-slate-600 font-bold'> {company?.CName || 'Welcome'}</p>
      </div>
      <Row className='pt-4'>
        <Col sm={6} md={6} lg={4} xl={3} className=''>
          <div className='rounded-xl bg-slate-200 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Returns</p>
              <p className='text-[30px] font-bold text-green-700 text-right'>16</p>
            </div>
          </div>
        </Col>
        <Col sm={6} md={6} lg={4} xl={3} className=''>
          <div className='rounded-xl bg-slate-200 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Special Orders</p>
              <p className='text-[30px] font-bold text-sky-700 text-right'>15</p>
            </div>
          </div>
        </Col>
        <Col  sm={6} md={6} lg={4} xl={3} className=''>
          <div className='rounded-xl bg-slate-200 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Products</p>
              <p className='text-[30px] font-bold text-yellow-700 text-right'>32</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
