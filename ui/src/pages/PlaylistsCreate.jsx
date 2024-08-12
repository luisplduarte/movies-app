import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useApiServices from '../api';

/**
 * Page to edit user's information
 */
function PlaylistsCreate() {
  const { createPlaylist } = useApiServices();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: ({ name, description, initialMovie }) => createPlaylist(name, description, initialMovie),
    onSuccess: (response) => {
      navigate(`/playlists/${response._id}`);
    },
    onError: (error) => {
      console.error('Profile update failed: ', error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate('/playlists');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Create new playlist</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
        <div>
          <label>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
          {errors.name && <p style={{ color: 'red', marginTop: '0px' }}>{errors.name.message}</p>}

          <label>Description (optional)</label>
          <input {...register('description')} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          {errors.description && <p style={{ color: 'red', marginTop: '0px' }}>{errors.description.message}</p>}
        </div>

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

export default PlaylistsCreate;
