import {
  Avatar,
  Box,
  Button,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const FriendsFollowing = ({ friends }) => {
  const navigate = useNavigate();

  return (
    <Paper>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
        <Typography variant="h6" color="textSecondary" fontWeight="regular">
          Friends
        </Typography>
        <Grid2
          container
          spacing={2}
          justifyContent={friends?.length > 2 ? "space-around" : "space-evenly"}
        >
          {friends ? (
            <>
              {friends?.followers?.slice(0, 9).map((follower) => (
                <Grid2 key={follower._id} size="auto">
                  <Button
                    onClick={() => navigate(`/profile/${follower._id}`)}
                    key={follower.name}
                    sx={{
                      alignItems: "start",
                      backgroundColor: "background.default",
                      color: "primary.light",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: { xs: 100, md: 120 },
                        maxHeight: { xs: 140, md: 160 },
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        alt={`${follower.name}-photo`}
                        src={follower.photo}
                        sx={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "1/1",
                          maxWidth: { xs: 90, sm: 100, md: 120 },
                          objectFit: "contain",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          mt: 1,
                        }}
                      >
                        {follower.name}
                      </Typography>
                    </Box>
                  </Button>
                </Grid2>
              ))}
            </>
          ) : (
            <Grid2 size={12}>
              <Typography textAlign="center" variant="body1">
                Sem amigos
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </Box>
    </Paper>
  );
};
