import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import background from '../assets/images/backgound.jpg'

function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isDirty, isValid }
  } = useForm({ mode: "onchange" });
  const navigate = useNavigate();
  const { signIn, token, tenant } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  },[token])

  const onSubmit = async (data) => {
    try {
      await signIn(data);
      if (tenant?.tenant_id) {
        toast.success('Logged In', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid credentials. Please try again.', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`Login failed: ${error.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };
  

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center px-2" style={{ backgroundImage:` url('${background}')` }}>
      <div className="p-8 rounded-lg shadow-xl w-96 backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200">
          <h2 className="text-2xl font-semibold text-center mb-6 text-teal-900">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                {...register('email', { required: true })}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                {...register('password', { required: true })}
                placeholder="Enter your password"
              />
            </Form.Group>
            <Button
              type="submit"
              className="bg-teal-900 mt-4 text-white py-2 px-4 rounded-full font-semibold hover:bg-teal-700 transition duration-300 w-full"
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;