import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useApiServices from '../api';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Page to edit playlist
 */
function PlaylistEdit() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getPlaylist, updatePlaylist } = useApiServices();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const {
    isPending,
    error,
    data: playlist,
  } = useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id),
    onError: (error) => {
      console.error('Error getting playlist: ', error);
    },
  });

  useEffect(() => {
    if (playlist) {
      setValue('name', playlist.name);
      if (playlist.description) setValue('description', playlist.description);
    }
  }, [playlist]);

  const mutation = useMutation({
    mutationFn: ({ name, description }) => updatePlaylist(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist']); // Invalidate possible cached query to user's playlist
      navigate(`/playlists/${id}`);
    },
    onError: (error) => {
      if (error.response.status === 400) {
        setError('name', {
          type: 'manual',
          message: 'Invalid name',
        });
      } else {
        console.error('Profile update failed: ', error);
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
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
      <h1>Edit playlist</h1>
      {error ? (
        <p>Error loading playlist...</p> // Show error message
      ) : isPending ? (
        <CircularProgress /> // Show pending component
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
          <div>
            <label>Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            />
            {errors.name && <p style={{ color: 'red', marginTop: '0px' }}>{errors.name.message}</p>}

            <label>Description</label>
            <input {...register('description')} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
            {errors.description && <p style={{ color: 'red', marginTop: '0px' }}>{errors.description.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px',
                backgroundColor: '#6200ee',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => navigate(`/playlists/${id}`)}
              style={{ padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PlaylistEdit;
