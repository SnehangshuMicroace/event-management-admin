import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useGlobalState } from '../context/GlobalStateContext';
import { TfiMenu } from 'react-icons/tfi';
import { useState, useEffect } from 'react';
import logo from '../assets/logo/tnb2.png'
function AppNavbar() {
  const { state, dispatch } = useGlobalState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);

    const userdetails = JSON.parse(localStorage.getItem('userdetails'))
  return (
    <div className={`bg-gradient-to-r from-blue-700 via-purple-700 to-pink-900  overflow-hidden fixed w-screen z-1 drop-shadow ${sidebarOpen ? 'md:pl-[250px]' : ''}`}>
      <Navbar >
      <Container>
        <div className='flex items-center'>
          <div onClick={()=>{ dispatch({ type: 'TOGGLE_SIDEBAR'})}}>
              <TfiMenu className=' text-white'/>
            </div>
            <img className='w-[130px] -my-[20px] ms-4' src={logo} alt="Logo" />
        </div>
        <Navbar.Brand href="#home" className='text-white font-bold text-xl font-serif'>Event Manager</Navbar.Brand>
      </Container>
      </Navbar>
    </div>
  );
}

export default AppNavbar;