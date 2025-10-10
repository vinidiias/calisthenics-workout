import { Avatar, Box, Button, Grid2, Stack, Typography } from "@mui/material";

export const FriendsFollowing = ({ friends }) => {
    return (
      <Box className="flex flex-col gap-2 p-7">
        <Typography variant="h6" color="textSecondary" fontWeight="regular">
          Friends
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent={{ xs: "space-around", md: "inherit" }}>
          {friends ? (
            <>
              {friends?.followers?.slice(0, 9).map((follower) => (
                <Button sx={{ textTransform: "none", alignItems: "start" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: { xs: 100, md: 100 },
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      alt={`${follower.name}-photo`}
                      src={follower.photo}
                      sx={{
                        width: { xs: 90, md: 100 },
                        height: { xs: 90, md: 100 },
                        objectFit: "contain",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        wordBreak: "break-word",
                      }}
                    >
                      {follower.name}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </>
          ) : (
            <Grid2>
              <Typography textAlign="center" variant="body1">
                Sem amigos
              </Typography>
            </Grid2>
          )}
        </Stack>
      </Box>
    );
}