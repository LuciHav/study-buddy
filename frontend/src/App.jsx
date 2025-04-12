import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./components/AdminLayout";
import AuthRoute from "./components/AuthRoute";
import IndexRoute from "./components/IndexRoute";
import RootLayout from "./components/RootLayout";
import TutorLayout from "./components/TutorLayout";
import { ROLES } from "./constants";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPosts from "./pages/admin/adminPosts/AdminPosts";
import AdminTutors from "./pages/admin/adminTutors/AdminTutors";
import Reports from "./pages/admin/reports/Reports";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AboutUs from "./pages/info/AboutUs";
import ContactUs from "./pages/info/ContactUs";
import PageNotFound from "./pages/info/PageNotFound";
import Post from "./pages/posts/Post";
import Posts from "./pages/posts/Posts";
import TutorDashboard from "./pages/tutor/Dashboard";
import BookTutor from "./pages/tutors/BookTutor";
import BookingSuccess from "./pages/tutors/BookingSuccess";
import Bookings from "./pages/tutors/Bookings";
import Tutors from "./pages/tutors/Tutors";
import ListBookings from "./pages/tutor/ListBookings";
import Conversation from "./pages/conversation/Conversation";

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
            <Route path="tutors/:id" element={<BookTutor />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id/chat" element={<Conversation />} />
            <Route path="booking/success" element={<BookingSuccess />} />
            <Route path="posts">
              <Route index element={<Posts />} />
              <Route path=":postId" element={<Post />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<AuthRoute role={ROLES.TUTOR} />}>
          <Route element={<TutorLayout />}>
            <Route path="tutor">
              <Route index element={<TutorDashboard />} />
              <Route path="bookings" element={<ListBookings />} />
              <Route path="bookings/:id/chat" element={<Conversation />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Route>

        <Route element={<AuthRoute role={ROLES.ADMIN} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="tutors" element={<AdminTutors />} />
              <Route path="reports" element={<Reports />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
