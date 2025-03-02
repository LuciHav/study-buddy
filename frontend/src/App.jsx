import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./components/AdminLayout";
import AuthRoute from "./components/AuthRoute";
import IndexRoute from "./components/IndexRoute";
import RootLayout from "./components/RootLayout";
import { ROLES } from "./constants";
import AdminTutors from "./pages/admin/adminTutors/AdminTutors";
import Dashboard from "./pages/admin/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AboutUs from "./pages/info/AboutUs";
import ContactUs from "./pages/info/ContactUs";
import PageNotFound from "./pages/info/PageNotFound";
import Posts from "./pages/posts/Posts";
import Tutors from "./pages/tutors/Tutors";
import Post from "./pages/posts/Post";
import Reports from "./pages/admin/reports/Reports";
import AdminPosts from "./pages/admin/adminPosts/AdminPosts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<IndexRoute />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="tutors" element={<Tutors />} />

          <Route element={<AuthRoute role={ROLES.USER} />}>
            <Route path="posts">
              <Route index element={<Posts />} />
              <Route path=":postId" element={<Post />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<AuthRoute role={ROLES.ADMIN} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin">
              <Route index element={<Dashboard />} />
              <Route path="tutors" element={<AdminTutors />} />
              <Route path="reports" element={<Reports />} />
              <Route path="posts" element={<AdminPosts />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
