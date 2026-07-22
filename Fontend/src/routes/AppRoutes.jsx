import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AuthLayout    from '../layouts/AuthLayout'
import AppLayout     from '../layouts/AppLayout'
import AdminLayout   from '../layouts/AdminLayout'

// Guards
import ProtectedRoute from './ProtectedRoute'
import AdminRoute     from './AdminRoute'

// Auth
import Login             from '../pages/auth/Login'
import Register          from '../pages/auth/Register'
import ForgotPassword    from '../pages/auth/ForgotPassword'
import ResetPassword     from '../pages/auth/ResetPassword'
import EmailVerification from '../pages/auth/EmailVerification'

// Public
import Home          from '../pages/public/Home'
import ProjectList   from '../pages/public/ProjectList'
import ProjectDetail from '../pages/public/ProjectDetail'
import Community     from '../pages/public/Community'

// Student
import StudentDashboard from '../pages/student/Dashboard'
import MyProjects       from '../pages/student/MyProjects'
import QuizPage         from '../pages/student/QuizPage'
import QuizResult       from '../pages/student/QuizResult'
import SubmitProject    from '../pages/student/SubmitProject'
import Leaderboard      from '../pages/student/Leaderboard'
import Profile          from '../pages/student/Profile'
import Portfolio        from '../pages/student/Portfolio'
import ProgressTracker  from '../pages/student/ProgressTracker'
import Notifications    from '../pages/student/Notifications'

// Admin
import AdminDashboard     from '../pages/admin/Dashboard'
import AdminProjectList   from '../pages/admin/Projects/ProjectList'
import AdminProjectCreate from '../pages/admin/Projects/ProjectCreate'
import AdminProjectEdit   from '../pages/admin/Projects/ProjectEdit'
import AdminQuizList      from '../pages/admin/Quizzes/QuizList'
import AdminQuizCreate    from '../pages/admin/Quizzes/QuizCreate'
import AdminQuizEdit      from '../pages/admin/Quizzes/QuizEdit'
import SubmissionList     from '../pages/admin/Submissions/SubmissionList'
import SubmissionReview   from '../pages/admin/Submissions/SubmissionReview'
import UserList           from '../pages/admin/Users/UserList'
import UserDetail         from '../pages/admin/Users/UserDetail'
import ReportsPage        from '../pages/admin/Reports/ReportsPage'

// Errors
import NotFound    from '../pages/errors/NotFound'
import Unauthorized from '../pages/errors/Unauthorized'

const AppRoutes = () => (
  <Routes>

    {/* ── AUTH ── */}
    <Route element={<AuthLayout />}>
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
      <Route path="/verify-email"    element={<EmailVerification />} />
    </Route>

    {/* ── PUBLIC ── */}
    <Route element={<AppLayout />}>
      <Route path="/"              element={<Home />} />
      <Route path="/projects"      element={<ProjectList />} />
      <Route path="/projects/:id"  element={<ProjectDetail />} />
      <Route path="/community"     element={<Community />} />
      <Route path="/leaderboard"   element={<Leaderboard />} />
    </Route>

    {/* ── STUDENT ── */}
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/dashboard"              element={<StudentDashboard />} />
      <Route path="/my-projects"            element={<MyProjects />} />
      <Route path="/quiz/:projectId"        element={<QuizPage />} />
      <Route path="/quiz/:projectId/result" element={<QuizResult />} />
      <Route path="/submit/:projectId"      element={<SubmitProject />} />
      <Route path="/profile"                element={<Profile />} />
      <Route path="/portfolio"              element={<Portfolio />} />
      <Route path="/progress"               element={<ProgressTracker />} />
      <Route path="/notifications"          element={<Notifications />} />
    </Route>

    {/* ── ADMIN ── */}
    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route path="/admin"                    element={<AdminDashboard />} />
      <Route path="/admin/projects"           element={<AdminProjectList />} />
      <Route path="/admin/projects/create"    element={<AdminProjectCreate />} />
      <Route path="/admin/projects/:id/edit"  element={<AdminProjectEdit />} />
      <Route path="/admin/quizzes"            element={<AdminQuizList />} />
      <Route path="/admin/quizzes/create"     element={<AdminQuizCreate />} />
      <Route path="/admin/quizzes/:id/edit"   element={<AdminQuizEdit />} />
      <Route path="/admin/submissions"        element={<SubmissionList />} />
      <Route path="/admin/submissions/:id"    element={<SubmissionReview />} />
      <Route path="/admin/users"              element={<UserList />} />
      <Route path="/admin/users/:id"          element={<UserDetail />} />
      <Route path="/admin/reports"            element={<ReportsPage />} />
    </Route>

    {/* ── ERROR PAGES ── */}
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/404"          element={<NotFound />} />

    {/* ── FALLBACK ── */}
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes