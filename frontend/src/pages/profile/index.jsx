import api from "../../services";
import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import { FriendsFollowing } from "../../components/pages/profile/FriendsFollowing";
import { WorkoutCard } from "../../components/pages/profile/WorkoutCard";
import { HeaderProfile } from "../../components/pages/profile/HeaderProfile";

const getUser = async ({ id }) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

export default function Profile() {
  const [isMe, setIsMe] = useState(false);
  const params = useParams();
  const { user } = useContext(UserContext);

  const { data } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUser({ id: params.id, auth: user._id }),
  });

  useEffect(() => {
    setIsMe(params.id === user._id);
  }, [params.id, user._id]);

  return (
    <Container
      maxWidth={false}
      sx={{ p: 2, width: { xs: "100%", sm: "90%" } }}
      disableGutters
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12}>
          <HeaderProfile
            backgroundPhoto={data?.backgroundPhoto}
            isMe={isMe}
            user={data}
          />
        </Grid>
        <Grid size={{ xs: 12, md: "auto" }} sx={{ alignSelf: "flex-start", position: { xs: "inherit", md: "sticky" }, top: { xs: 0, md: 69 }}}>
          <FriendsFollowing friends={data} />
        </Grid>
        <Grid container size={{ xs: 12, md: "grow" }}>
          {data?.history?.length > 0 ? (
            <Grid container gap={2}>
              {data.history?.map((hist) => {
                const date = new Date(hist.date);
                return (
                  <Grid key={hist.id} size={12}>
                    <Paper>
                      <WorkoutCard
                        photo={data.photo}
                        hist={hist}
                        name={data.name}
                        date={date}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Grid container size={12}>
              <Paper sx={{ flex: 1, alignContent: "center" }}>
                <Typography textAlign="center" sx={{ alignSelf: "center" }}>
                  Sem atividades
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
