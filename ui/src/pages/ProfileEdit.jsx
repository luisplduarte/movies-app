import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useApiServices from '../api';
import Dropzone from '../components/Dropzone';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Page to edit user's information
 */
function ProfileEdit() {
  const { getProfile, updateProfile } = useApiServices();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: profile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (profile) {
      setValue('username', profile.username);
      if (profile.bio) setValue('bio', profile.bio);
      if (profile.profileImage) setValue('profileImage', profile.profileImage);
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: ({ username, bio, profileImage }) => updateProfile(username, bio, profileImage),
    onSuccess: async () => {
      queryClient.invalidateQueries(['profile']); // Invalidate possible cached query to user's profile
      queryClient.invalidateQueries(['user']);
      navigate('/profile');
    },
    onError: (error) => {
      if (error.response.status === 400) {
        setError('username', {
          type: 'manual',
          message: 'Invalid username',
        });
      } else {
        console.error('Profile update failed: ', error);
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleFileAccepted = async (file) => {
    setValue('profileImage', file);
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (isPending) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error: {error.message}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Edit your profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
        <div>
          <label>Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          {errors.username && <p style={{ color: 'red', marginTop: '0px' }}>{errors.username.message}</p>}

          <label>Bio</label>
          <input {...register('bio')} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          {errors.bio && <p style={{ color: 'red', marginTop: '0px' }}>{errors.bio.message}</p>}
        </div>

        <Dropzone initialImage={`${API_URL}/uploads/${profile.profileImage}`} onFileAccepted={handleFileAccepted} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            type="submit"
            style={{ padding: '10px', backgroundColor: '#6200ee', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
            style={{ padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEdit;
