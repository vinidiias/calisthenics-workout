import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { CircularProgress } from '@mui/material';
import { UserTable } from './UserTable'
import { SearchInput } from './SearchInput';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ParticipantsListModal({ openModal, onClose, participants, handleFollowFn }) {
  const [search, setSearch] = useState('')

  const follow = async({ userFrom, userTo }) => {
    try {
      handleFollowFn({ userFrom, userTo })
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          {!participants ? (
            <CircularProgress />
          ) : (
            <div className="flex flex-col items-start gap-5 w-full">
              <SearchInput search={search} setSearch={setSearch}  />
              <UserTable dataTable={participants} handleFollow={follow} search={search} setSearch={setSearch} />
            </div>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}