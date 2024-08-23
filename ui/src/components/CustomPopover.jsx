/* eslint-disable react/prop-types */
import React from 'react';
import { Popover, List, ListItemText, ListItemButton } from '@mui/material';

/**
 * Custom popover to show list of playlists when user clicks in the button to add movie to playlist
 * @param {DOMElement} anchorEl the button that was clicked to add movie to playlists
 * @param {Function} onClose callback function when closing the popover
 * @param {Array} playlists list of user playlists
 * @param {Function} onPlaylistSelected callback function when playlist is selected
 * @param {Function} navigateToNewPlaylist callback function to redirect user to new playlist creation page when new playlist option is selected
 * @returns popover so user can select which playlist will movie be added to
 */
function CustomPopover({ anchorEl, onClose, playlists, onPlaylistSelected, navigateToNewPlaylist }) {
  const popoverOpen = Boolean(anchorEl);
  const idPopover = popoverOpen ? 'simple-popover' : undefined;

  return (
    <Popover
      id={idPopover}
      open={popoverOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <List
        sx={{
          maxHeight: '150px',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Scrollbar color
            borderRadius: '4px',
            cursor: 'pointer',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Scrollbar color on hover
          },
        }}
      >
        <ListItemButton key={0} onClick={navigateToNewPlaylist}>
          <ListItemText primary={'Create new playlist'} />
        </ListItemButton>
        {playlists?.length ? (
          playlists?.map((playlist, index) => (
            <ListItemButton key={index + 1} onClick={() => onPlaylistSelected(playlist)} disabled={playlist.disabled}>
              <ListItemText primary={playlist.name} />
            </ListItemButton>
          ))
        ) : (
          <ListItemButton key={'no lists'} sx={{ cursor: 'auto' }}>
            <ListItemText primary={"There aren't lists created"} />
          </ListItemButton>
        )}
      </List>
    </Popover>
  );
}

export default CustomPopover;
