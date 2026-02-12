import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { PeopleList } from "./PeopleList";

export const PeopleListDialog = ({
  openModal,
  onClose,
  title,
  participants,
}) => {
  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {!participants ? (
          <CircularProgress />
        ) : (
          <PeopleList people={participants} />
        )}
      </DialogContent>
    </Dialog>
  );
};