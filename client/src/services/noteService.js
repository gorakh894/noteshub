import api from './api'

export const noteService = {
  getNotes: (params) => api.get('/notes', { params }),
  getNoteById: (id) => api.get(`/notes/${id}`),
  uploadNote: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  downloadNote: (id) => api.post(`/notes/${id}/download`),
  rateNote: (id, data) => api.post(`/notes/${id}/rate`, data),
  bookmarkNote: (id) => api.post(`/notes/${id}/bookmark`),
  getMyNotes: (params) => api.get('/notes/my-notes', { params }),
}

export const paperService = {
  getPapers: (params) => api.get('/papers', { params }),
  getPaper: (id) => api.get(`/papers/${id}`),
  uploadPaper: (formData) => api.post('/papers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadPaper: (id) => api.post(`/papers/${id}/download`),
  uploadSolution: (id, formData) => api.put(`/papers/${id}/solution`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubjects: (params) => api.get('/papers/subjects', { params }),
}

export const discussionService = {
  getDiscussions: (params) => api.get('/discussions', { params }),
  getDiscussion: (id) => api.get(`/discussions/${id}`),
  createDiscussion: (data) => api.post('/discussions', data),
  addAnswer: (id, data) => api.post(`/discussions/${id}/answers`, data),
  voteAnswer: (id, answerId, vote) => api.post(`/discussions/${id}/answers/${answerId}/vote`, { vote }),
  voteDiscussion: (id) => api.post(`/discussions/${id}/vote`),
  acceptAnswer: (id, answerId) => api.put(`/discussions/${id}/answers/${answerId}/accept`),
  deleteDiscussion: (id) => api.delete(`/discussions/${id}`),
}

export const groupService = {
  getGroups: (params) => api.get('/groups', { params }),
  getGroup: (id) => api.get(`/groups/${id}`),
  createGroup: (data) => api.post('/groups', data),
  joinGroup: (id, data) => api.post(`/groups/${id}/join`, data),
  leaveGroup: (id) => api.delete(`/groups/${id}/leave`),
  shareNote: (id, noteId) => api.post(`/groups/${id}/share`, { noteId }),
  getMyGroups: () => api.get('/groups/my-groups'),
}

export const userService = {
  getUserProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (formData) => api.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.put('/users/change-password', data),
  getBookmarks: (params) => api.get('/users/bookmarks', { params }),
  followUser: (id) => api.post(`/users/${id}/follow`),
  getLeaderboard: () => api.get('/users/leaderboard'),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getPendingNotes: (params) => api.get('/admin/notes/pending', { params }),
  approveNote: (id) => api.put(`/admin/notes/${id}/approve`),
  rejectNote: (id, reason) => api.put(`/admin/notes/${id}/reject`, { reason }),
  deleteNote: (id) => api.delete(`/admin/notes/${id}`),
  featureNote: (id) => api.put(`/admin/notes/${id}/feature`),
  approvePaper: (id) => api.put(`/admin/papers/${id}/approve`),
}

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
}
