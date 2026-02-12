const { Router } = require("express");

const UserController = require("../Controller/UserController");
const AddressController = require("../Controller/AddressController");
const OutdoorGymController = require("../Controller/OutdoorGymController");
const WorkoutController = require("../Controller/WorkoutController");
const WorkoutCommentController = require("../Controller/WorkoutCommentController");
const MessageController = require("../Controller/MessageController");

const routes = Router();

// Auth
routes.post("/auth/login", UserController.auth); // Autentica um usuario

// Users
routes.post("/users", UserController.create); // Cria um novo usuario
routes.post("/users/:id/followers", UserController.followUser); // Segue um usuario
routes.get("/users", UserController.getUsers); // Lista todos os usuarios
routes.get("/users/:id", UserController.getUser); // Busca um usuario por ID
routes.get("/users/:id/followers", UserController.getFollowersByUser); // Lista seguidores de um usuario
routes.get("/users/:id/following", UserController.getFollowingByUser); // Lista seguidores de um usuario
routes.patch("/users/:id", UserController.updateUser); // Atualiza dados de um usuario
routes.delete("/users/:userId/followers/:id", UserController.unfollowUser);

// Workouts
routes.post("/workouts", WorkoutController.create); // Cria um novo treino
routes.post("/workouts/:id/subscriptions", WorkoutController.subscribeToWorkout); // Inscreve o usuario em um treino
routes.post("/workouts/:workoutId/comments", WorkoutCommentController.create); // Cria um comentario em um treino
routes.get("/workouts", WorkoutController.getWorkouts); // Lista treinos (filtros: ?subscribed, ?creator, ?hasComments)
routes.get("/workouts/:id/comments", WorkoutCommentController.fetchCommentsByWorkout); // Lista comentarios de um treino
routes.delete("/workouts/:id", WorkoutController.deleteWorkout); // Remove um treino
routes.delete("/workouts/:id/subscriptions", WorkoutController.unsubscribeToWorkout); // Cancela inscricao de um treino
routes.delete("/workouts", WorkoutController.deleteAllWorkouts); // Remove todos os treinos
routes.patch("/workouts/:id", WorkoutController.patchWorkout); // Atualiza dados de um treino
routes.patch("/workouts/:id/likes", WorkoutController.patchLikeWorkout); // Alterna like em um treino

// Workout Comments
routes.delete("/comments/:id", WorkoutCommentController.deleteCommentByWorkout); // Remove um comentario

// Outdoor Gym Addresses
routes.post("/outdoor-gym-addresses", AddressController.create); // Cria um novo endereco
routes.get("/outdoor-gym-addresses", AddressController.getAll); // Lista todos os enderecos

// Outdoor Gyms
routes.post("/outdoor-gyms", OutdoorGymController.create); // Cria uma nova academia ao ar livre
routes.get("/outdoor-gyms", OutdoorGymController.getAll); // Lista todas as academias ao ar livre
routes.delete("/outdoor-gyms/:id", OutdoorGymController.deleteOutdoorGym); // Remove uma academia ao ar livre

// Messages
routes.post("/messages", MessageController.create); // Envia uma nova mensagem
routes.get("/messages", MessageController.getConversationMessages); // Lista mensagens de uma conversa (filtro: ?conversationId=xxx)
routes.get("/messages/unread-count", MessageController.getUnreadCount); // Retorna total de mensagens nao lidas
routes.patch("/messages/read", MessageController.markAsRead); // Marca mensagens de uma conversa como lidas

module.exports = routes