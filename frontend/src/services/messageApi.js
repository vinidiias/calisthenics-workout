import api from '.';

export async function fetchMessages(selectedConversationId) {
  const response = await api.get('/messages', { params: { conversationId: selectedConversationId } });

  return response.data;
}

export async function patchMarkMessageAsRead(selectedConversationId, user_id) {
  await api.patch('/messages/read', {
    conversationId: selectedConversationId,
    userId: user_id,
  });
}
