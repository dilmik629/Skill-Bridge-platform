import api from './api'

const quizService = {
  getQuiz:    (projectId)       => api.get(`/my/quiz/${projectId}`),
  submit:     (quizId, answers) => api.post(`/my/quiz/${quizId}/submit`, { answers }),
  adminGetAll:()                => api.get('/admin/quizzes'),
  adminCreate:(data)            => api.post('/admin/quizzes', data),
  adminUpdate:(id, data)        => api.put(`/admin/quizzes/${id}`, data),
  adminDelete:(id)              => api.delete(`/admin/quizzes/${id}`),
}

export default quizService