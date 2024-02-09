import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useLocation } from 'react-router';

const MainContent = ({ children }) => {

  const { state } = useGlobalState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);

  if (location.pathname === '/login') {
    return <div />;
  }

  return <main className={`bg-gradient-to-r from-blue-700 via-purple-700 to-pink-900 w-full min-h-[100vh] pt-16 ${sidebarOpen ? 'md:pl-[250px]' : ''}`}>{children}</main>;
};

export default MainContent;
