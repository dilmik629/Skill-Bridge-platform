import api from './api'

const leaderboardService = {
  // GET /api/leaderboard?filter=all_time|monthly|weekly
  get: (filter = 'all_time') => api.get('/leaderboard', { params: { filter } }),
}

export default leaderboardService