import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { WorkoutCardInformations } from "./WorkoutCardInformations";

export const DialogWorkoutCard = ({
  initialTab,
  open,
  onClose,
  user_id,
  workout,
  onLike,
  onComment,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Workout Informations</DialogTitle>
      <DialogContent dividers>
        <WorkoutCardInformations
          initialTab={initialTab}
          user_id={user_id}
          workout={workout}
          onLike={onLike}
          onComment={onComment}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};