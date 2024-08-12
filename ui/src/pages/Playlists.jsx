import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useApiServices from '../api';
import AddIcon from '@mui/icons-material/Add';
import Card from '../components/Card';

/**
 * User playlists page
 */
function Playlists() {
  const { getUserPlaylists } = useApiServices();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: playlists,
  } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => getUserPlaylists(),
  });

  const onAddButton = () => {
    navigate('/playlists/new');
  };

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Error loading playlists...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <h1>Your playlists</h1>
      <AddIcon
        onClick={onAddButton}
        fontSize="large"
        style={{
          marginBottom: '16px',
          cursor: 'pointer'
        }}
      />
      {playlists?.length ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            width: '100%', // Garante que o contêiner dos cartões usa toda a largura disponível
          }}
        >
          {playlists?.map((playlist, index) => (
            <Card key={index} title={playlist.name} description={playlist.description} />
          ))}
        </div>
      ) : (
        <h2>{`You don't have any playlists yet`}</h2>
      )}
    </div>
  );
}

export default Playlists;
