import { Routes, Route } from "react-router-dom";
import Register from "pages/auth/Register";
import Home from "pages/Home";
import Login from "pages/auth/Login";
import ForgotPassword from "pages/auth/ForgotPassword";
import ResetPassword from "pages/auth/ResetPassword";
import JobApplications from "pages/admin/JobApplications";
import AdminJobList from "pages/admin/Jobs";
import UserJobList from "pages/user/Jobs";
import JobCategories from "pages/admin/JobCategories";
import JobTypes from "pages/admin/JobTypes";
import PostNewJob from "pages/admin/PostNewJob";
import { AuthProvider } from "contexts/auth";
import RequireAuth from "components/RequireAuth";
import config from "config/config";

function App() {
  return (
    <AuthProvider>
      <div className="bg-slate-200">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<RequireAuth roles={[config.roles.ADMIN]}><Home /></RequireAuth>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="admin">
            <Route path="job-applications" element={<RequireAuth roles={[config.roles.ADMIN]}><JobApplications /></RequireAuth>} />
            <Route path="jobs">
              <Route index element={<RequireAuth roles={[config.roles.ADMIN]}><AdminJobList /></RequireAuth>} />
              <Route path="create" element={<RequireAuth roles={[config.roles.ADMIN]}><PostNewJob /></RequireAuth>} />
            </Route>
            <Route path="job-categories" element={<RequireAuth roles={[config.roles.ADMIN]}><JobCategories /></RequireAuth>} />
            <Route path="job-types" element={<RequireAuth roles={[config.roles.ADMIN]}><JobTypes /></RequireAuth>} />
          </Route>

          {/* User Routes */}
          <Route path="user">
            <Route path="jobs" element={<RequireAuth roles={[config.roles.USER]}><UserJobList /></RequireAuth>} />
          </Route>

          {/* Other Route */}
          <Route path="*" element={<div>404 Error</div>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
