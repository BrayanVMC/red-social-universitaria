import api from './api';

export async function login(email: string, password: string) {
  return api.post('/users/login', { email, password });
}

export async function register(username: string, email: string, password: string) {
  return api.post('/users/register', { username, email, password });
}

export async function getUsers() {
  return await api.get('/users/getusers');
}

export async function updateUser(userData: FormData) {
  return api.put('/users/update', userData, { headers: { 'content-type': 'multipart/form-data' } });
}

export async function createUser(userData: FormData) {
  return api.post('/users/create', userData, { headers: { 'content-type': 'multipart/form-data' } });
}

export async function deleteUser(id: string) {
  return api.delete(`/users/delete/${id}`);
}

// Nuevas funciones para ver perfil de otros usuarios
export async function getUserProfile(userId: string) {
  return api.get(`/users/profile/${userId}`);
}

export async function followUser(followerId: string, followedId: string) {
  return api.post(`/users/follow/${followerId}`, { followedId });
}

export async function unfollowUser(followerId: string, followedId: string) {
  return api.post(`/users/unfollow/${followerId}`, { followedId });
}