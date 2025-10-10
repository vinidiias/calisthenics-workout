import { Avatar, Button, Grid2, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Lens } from "@mui/icons-material";

export const HeaderInformationFriend = ({ selectedContact, isActive, handleClose }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid2 size={12}>
      {matches && (
        <Button startIcon={<ArrowBackIosIcon />} sx={{ textTransform: "none" }} onClick={handleClose}>
          Voltar
        </Button>
      )}
      <Stack alignItems="center" justifyContent="center">
        <Avatar src={selectedContact.photo} />
        <Typography variant="h6">{selectedContact.name}</Typography>
        <Stack direction="row" alignItems={"center"} gap={1}>
          {isActive && <Lens color="success" sx={{ fontSize: 10 }} />}
          <Typography>{isActive ? "online" : "offline"}</Typography>
        </Stack>
      </Stack>
    </Grid2>
  );
};