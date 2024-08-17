"use client";
import { navigate } from '@/functions/actions';
import { googleAuth } from '@/functions/api';
import React from 'react';

const Login = () => {

  const handleLogin = async () => {
    
      const response = await googleAuth();
      navigate(response.url)
  } 

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
