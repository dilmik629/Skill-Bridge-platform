import api from './api'

const peerReviewService = {
  // Public feed
  getApproved:   (params)             => api.get('/submissions/approved', { params }),
  getSubmission: (id)                 => api.get(`/submissions/${id}/public`),

  // Auth required
  addReview:     (submissionId, data) => api.post(`/submissions/${submissionId}/review`, data),
  removeReview:  (submissionId)       => api.delete(`/submissions/${submissionId}/review`),
}

export default peerReviewService