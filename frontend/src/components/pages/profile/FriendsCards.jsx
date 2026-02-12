import { useNavigate } from "react-router-dom";
// MATERIAL UI
import { Avatar, Box, Button, Grid2, Paper, Typography } from "@mui/material";

export const FriendsCards= ({ friends }) => {
  const navigate = useNavigate();

  return (
    <Paper>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
        <Typography
          variant="h6"
          fontSize="1em"
          color="textSecondary"
          fontWeight="normal"
          letterSpacing="1px"
        >
          Friends
        </Typography>
        <Grid2
          container
          spacing={2}
          justifyContent={{
            xs: "space-evenly",
            md: friends && friends.length > 2 ? "space-around" : "start",
          }}
        >
          {friends ? (
            <>
              {friends?.slice(0, 9).map((follower) => (
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
                        width:
                          friends.length === 1
                            ? { xs: 120, md: 125 }
                            : { xs: 100, md: 120 },
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
