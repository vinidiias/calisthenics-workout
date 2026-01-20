import Box from '@mui/material/Box';
import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { ParticipantsList } from './ParticipantsList';

export default function ParticipantsListModal({ openModal, onClose, title, participants, handleFollowFn }) {

  const follow = async({ userFrom, userTo }) => {
    try {
      handleFollowFn({ userFrom, userTo })
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {!participants ? (
          <CircularProgress />
        ) : (
          <Box>
            <ParticipantsList dataTable={participants} handleFollow={follow} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}