import { Avatar, Box, Button, Grid2, Typography } from "@mui/material";

export const FriendsFollowing = ({ friends }) => {
    return (
      <Box className="flex flex-col gap-2 p-7">
        <Typography
          variant="body1"
          fontSize="large"
          color="textSecondary"
          fontWeight="regular"
        >
          Friends
        </Typography>
        <Grid2
          container
          columns={3}
          rowSpacing={2}
          spacing={1}
          sx={{
            justifyContent: {
              xs: "center",
              sm: "space-between",
              lg: "start",
            },
          }}
          wrap="wrap"
        >
          {friends ? (
            <>
              {friends?.followers?.slice(0, 9).map((follower) => (
                <Grid2 key={follower._id} size="auto">
                  <Button
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textTransform: "none",
                      color: "white",
                      fontSize: "16px",
                      alignItems: "start",
                      width: "auto",
                    }}
                  >
                    <div className="w-[min-content]">
                      <Avatar
                        variant="rounded"
                        alt={`${follower.name}-photo`}
                        src={follower.photo}
                        sx={{
                          minWidth: { xs: "130px" },
                          minHeight: { xs: "130px" },
                        }}
                      />
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        fontSize="1em"
                        textAlign="left"
                        sx={{
                          color: "text.primary",
                          wordBreak: "break-word",
                        }}
                      >
                        {follower.name}
                      </Typography>
                    </div>
                  </Button>
                </Grid2>
              ))}
            </>
          ) : (
            <Grid2>
              <Typography textAlign="center" variant="body1">
                No friends
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </Box>
    );
}