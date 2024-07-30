import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";
import useApiServices from '../api';

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const { signUp } = useContext(useApiServices);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({username, password}) => signUp(username, password),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Sign up failed:', error)
      setErrorMessage('Error while creating user.')
    },
  })
   
  const onSubmit = (data) => {
    setErrorMessage('')
    mutation.mutate(data)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column' }}>
        <h2>Sign up</h2>
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
            Sign up
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      </form>
    </div>
  );
}

export default SignUp;