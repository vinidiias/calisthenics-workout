import api from '.';

export const postUser = async (dataUser) => {
  const { data } = await api.post("/users", dataUser);

  return data.data;
};

export async function fetchFollowersByUser(user_id, query) {
  const { data } = await api.get(
    `/users/${user_id}/followers${query && query.length > 0 ? `?filter=${query.join(',')}` : ''}`,
  );

  return data.data;
}

export async function fetchFollowingByUser(user_id, query) {
  const { data } = await api.get(
    `/users/${user_id}/following${query && query.length > 0 ? `?filter=${query.join(',')}` : ''}`,
  );

  return data.data;
}

export const postFollowToUser = async ({ userFrom, userTo }) => {
  const { data } = await api.post(`/users/${userTo}/followers`, { userFrom });

  return data.data;
};

export const deleteFollowToUser = async ({ userFrom, userTo }) => {
  const { data } = await api.delete(`/users/${userFrom}/followers/${userTo}`);

  return data.data;
};