// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStateProvider } from './context/GlobalStateContext'; // Import the GlobalStateProvider
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';
import Layout from './layouts/Layout';
import { AuthProvider } from './context/AuthContext';
import MainContent from './layouts/Content';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './pages/PrivateRoute';
import Event from './pages/event/Event';
import EventView from './pages/event/EventView';


function App() {

  document.addEventListener('ionBackButton', (ev) => {
    ev.detail.register(10, () => {
      // console.log('Handler was called!');
    });
  });

  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <GlobalStateProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Layout>
            <MainContent>
              <Routes>
              <Route path="/" element={<PrivateRoute />} >
                <Route path="/" element={<Dashboard />} />
                <Route path="/event" element={<Event />} />
                <Route path="/event/:id" element={<EventView />} />
              </Route>
              </Routes>
            </MainContent>
          </Layout>
        </GlobalStateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
