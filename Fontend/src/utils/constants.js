// ============================================
// SKILL-BRIDGE — Constants
// ============================================

export const STORAGE_KEYS = {
  TOKEN: 'sb_token',
  USER:  'sb_user',
}

export const ROLES = {
  ADMIN:   'admin',
  STUDENT: 'student',
}

export const LEVELS = {
  BEGINNER:     'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED:     'advanced',
}

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR:   'error',
  WARNING: 'warning',
  INFO:    'info',
}
export const TOAST_DURATION = 3000;


export const ROUTES = {
  // Public
  HOME:        '/',
  PROJECTS:    '/projects',
  COMMUNITY:   '/community',       // ← NEW peer review page
  LOGIN:       '/login',
  REGISTER:    '/register',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',
  EMAIL_VERIFICATION: '/verify-email',

  // Student
  STUDENT_DASHBOARD: '/dashboard',
  MY_PROJECTS:       '/my-projects',
  QUIZ:              '/quiz/:projectId',
  QUIZ_RESULT:       '/quiz/:projectId/result',
  SUBMIT:            '/submit/:projectId',
  LEADERBOARD:       '/leaderboard',
  PROFILE:           '/profile',
  PORTFOLIO:         '/portfolio',
  PROGRESS:          '/progress',
  NOTIFICATIONS:     '/notifications',

  // Admin
  ADMIN_DASHBOARD:   '/admin',
  ADMIN_PROJECTS:    '/admin/projects',
  ADMIN_QUIZZES:     '/admin/quizzes',
  ADMIN_SUBMISSIONS: '/admin/submissions',
  ADMIN_USERS:       '/admin/users',
  ADMIN_REPORTS:     '/admin/reports',
}