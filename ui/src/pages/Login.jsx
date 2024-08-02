import React, { useState, useContext } from "react";
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import useApiServices from '../api';
import AuthContext from '../AuthContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const { saveToken } = useContext(AuthContext);
  const { login } = useApiServices();
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: ({username, password}) => login(username, password),
    onSuccess: (data) => {
      saveToken(data.token)
      navigate('/')
    },
    onError: (error) => {
      console.error('Login failed:', error)
      setErrorMessage('Login error.')
    },
  })
   
  const onSubmit = (data) => {
    setErrorMessage('')
    mutation.mutate(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <div>
          <label>Username</label>
          <input 
            {...register('username', { required: 'Username is required' })} 
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Password</label>
          <input 
            type="password" 
            {...register('password', { required: 'Password is required' })} 
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#6200ee', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        
      </form>
    </div>
  );
}

export default Login;