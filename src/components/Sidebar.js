import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { LuFileEdit } from 'react-icons/lu';
import { BsFileEarmarkBarGraph } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { MdOutlineFolderSpecial } from "react-icons/md";
import { BsBoxes } from 'react-icons/bs';
import { BiSolidReceipt } from 'react-icons/bi';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { MdPerson } from "react-icons/md";
import { RxAvatar } from 'react-icons/rx';
import { FaCashRegister } from 'react-icons/fa';
import { TbTruckReturn } from 'react-icons/tb';
import { TbReport } from 'react-icons/tb';
import { MdOutlineBorderColor } from 'react-icons/md';
import { MdSecurity } from 'react-icons/md';
import { MdLogout } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { VscFileSubmodule } from 'react-icons/vsc';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GetCollection, collections } from '../config';
import logo from '../assets/logo/msc.png'

function Sidebar() {
  const { user, tenant } = useAuth()
  const isAdmin = tenant?.role === 'ADMIN' ? true : false;
  const { state, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const [salesEntryOpen, setSalesEntryOpen] = useState(false);
  const [purchaseEntryOpen, setPurchaseEntryOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const windowWidth = window.innerWidth;
  const { logout } = useAuth()

  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);

  const toggleMasterMenu = () => {
    setMasterMenuOpen(!masterMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login')
  }
  
  const closeSidebarOutsideClick = (e) => {
    if (
      sidebarOpen &&
      !e.target.closest('.sidebar')
    ) {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }
  };
  const NavigateAndToggleSidebar = (path) => {
    navigate(path)
    if (windowWidth < 768) {
      dispatch({ type: 'TOGGLE_SIDEBAR' })
    }
  }
  useEffect(() => {
    if (sidebarOpen && windowWidth < 768) {
      document.addEventListener('click', closeSidebarOutsideClick);
      document.addEventListener('touchstart', closeSidebarOutsideClick);
    }

    return () => {
      document.removeEventListener('click', closeSidebarOutsideClick);
      document.removeEventListener('touchstart', closeSidebarOutsideClick);
    };
  }, [sidebarOpen, dispatch]);

  return (
    <aside
      className={`bg-gradient-to-r from-purple-700 to-blue-800 overflow-hidden flex flex-col sidebar text-white h-full fixed transition ease-in-out duration-200 z-2 w-[250px] ${sidebarOpen ? '' : '-translate-x-full'
        }`}
    >
      <div className=''>
        {/* avatar and close button */}
        <div className='w-full px-3 py-3'>
          <div className='flex justify-between items-center'>
            <div
              className='flex items-center'
              onClick={() => NavigateAndToggleSidebar('/user')}>
              <RxAvatar className='w-10 h-10 bg-purple-800 rounded-full me-2' />
            </div>
            <AiOutlineClose
              className='w-6 h-6'
              onClick={() => {
                console.log(location.pathname === '/purchase/return');
                dispatch({ type: 'TOGGLE_SIDEBAR' });
              }}
            />
          </div>
          <div className='mt-2 w-full'>
            <p className='font-semibold mb-0 text-slate-100'>{user?.email}</p>
          </div>
        </div>
        <div className='max-h-[72vh] overflow-y-auto'>
          {/* <div
            onClick={() => { NavigateAndToggleSidebar('/') }}
            className={`${location.pathname === '/' ? 'bg-teal-900' : 'bg-teal-800'
              } flex items-center py-2 hover:bg-teal-900 border-b-[1px] border-t-[1px] border-teal-950 bg-teal-800 cursor-pointer`}
          >
            <LuFileEdit className='h-5 w-5 mx-4' />
            <p className="no-underline text-white text-lg m-0">
              Dashboard
            </p>
          </div>
          <div
            onClick={() => { NavigateAndToggleSidebar('/return') }}
            className={`${location.pathname === '/return' ? 'bg-teal-900' : 'bg-teal-800'
              } flex items-center py-2 hover:bg-teal-900 border-b-[1px] border-t-[1px] border-teal-950 bg-teal-800 cursor-pointer`}
          >
            <LuFileEdit className='h-5 w-5 mx-4' />
            <p className="no-underline text-white text-lg m-0">
              Returns
            </p>
          </div>
          <div
            onClick={() => { NavigateAndToggleSidebar('/special-order') }}
            className={`${location.pathname === '/special-order' ? 'bg-teal-900' : 'bg-teal-800'
              } flex items-center py-2 hover:bg-teal-900 border-b-[1px] border-t-[1px] border-teal-950 bg-teal-800 cursor-pointer`}
          >
            <LuFileEdit className='h-5 w-5 mx-4' />
            <p className="no-underline text-white text-lg m-0">
              Special Order
            </p>
          </div> */}
          <div
            onClick={() => { NavigateAndToggleSidebar('/event') }}
            className={`${location.pathname === '/event' ? 'backdrop-filter backdrop-blur-sm bg-opacity-10 bg-white' : ''
              } flex items-center py-2  border-b-[1px] border-t-[1px] border-slate-400 cursor-pointer hover:backdrop-filter hover:backdrop-blur-sm hover:bg-opacity-10 hover:bg-white`}
          >
            <LuFileEdit className='h-5 w-5 mx-4' />
            <p className="no-underline text-white text-lg m-0">
              Event
            </p>
          </div>
          {/* <div
            onClick={() => { NavigateAndToggleSidebar('/vendor') }}
            className={`${location.pathname === '/vendor' ? 'bg-teal-900' : 'bg-teal-800'
              } flex items-center py-2 hover:bg-teal-900 border-b-[1px] border-t-[1px] border-teal-950 bg-teal-800 cursor-pointer`}
          >
            <LuFileEdit className='h-5 w-5 mx-4' />
            <p className="no-underline text-white text-lg m-0">
              Vendor
            </p>
          </div> */}
        </div>
      </div>

      <div
        onClick={handleLogout}
        className='flex justify-around items-center mt-auto mx-auto border-2 border-purple-300 hover:border-purple-100 py-2 h-max w-2/3 rounded-md mb-24 drop-shadow cursor-pointer hover:shadow-xl'>
        <p className="no-underline text-white text-lg m-0">
          Logout
        </p>
        <MdLogout className='h-5 w-5' />
      </div>
      <div className='px-2 fixed w-[250px] bottom-0 flex items-center'>
        <img src={logo} className='w-12' alt='logo' />
        <span className='ms-2 mt-3'>
          <small className='text-red-500'>Developed by</small>
          <p className='font-semibold text-gray-400'>Microace Software</p>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
