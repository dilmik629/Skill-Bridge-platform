import api from './api'

const reportService = {
  // GET /api/admin/reports/export?type=students&format=csv&from=&to=
  export: (type, format, dateFrom = '', dateTo = '') =>
    api.get('/admin/reports/export', {
      params:       { type, format, from: dateFrom, to: dateTo },
      responseType: format === 'pdf' ? 'blob' : 'blob', // blob for both CSV + PDF
    }),

  // GET /api/admin/reports/stats
  getStats: () => api.get('/admin/reports/stats'),
}

export default reportService