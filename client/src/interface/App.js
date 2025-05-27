import ResponsiveAppBar from '../component/ResponsiveAppBar';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import CoursesMaster from '../pages/CoursesMaster';
import About from '../pages/About';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFound from '../pages/NotFound';
import Course from '../pages/Course';
import Profile from '../pages/Profile';
import Footer from '../component/Footer';
import PrivateRoute from '../component/PrivateRoute'
import DeleteAccount from '../pages/DeleteAccount';
import PublicOnlyRoute from '../component/PublicOnlyRoute';
import { Container } from '@mui/material';
import DynamicBreadcrumbs from '../component/DynamicBreadcrumbs';
import SchoolIcon from '@mui/icons-material/School';
import EmailVerificationSent from '../pages/EmailVerificationSent';
import ProblemsSigningIn from '../pages/ProblemsSigningIn';
import TokenVerificationEmail from '../pages/TokenVerificationEmail'
import ResetPassword from '../pages/ResetPassword';

import CourseHomePage from '../pages/Course/CourseHomePage';
const AppBarData = {
  website_name: "YALS World",
  icon: <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} color='inherit' />,
  icon2: <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} color='inherit' />,
  pages: [
    {
      page_name: "Home",
      page_path: "/",
      element: <Home hero_header={'Yet Another Learning Site'} hero_footer={'Master everything from Art to AI, Cooking to Cloud Computing, all in one place.'} />,
      index: true,
      is_in_RAB: true
    },
    {
      page_name: "Courses",
      page_path: "/courses",
      element: <CoursesMaster />,
      index: false,
      is_in_RAB: true
    },
    {
      page_name: "Profile",
      page_path: "/profile",
      element: <PrivateRoute><Profile /></PrivateRoute>,
      index: true,
      is_in_RAB: false
    },
    {
      page_name: "Settings",
      page_path: "/settings",
      element: <Settings />,
      index: false,
      is_in_RAB: false
    },
    {
      page_name: "Login",
      page_path: "/login",
      element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },
    {
      page_name: "Login",
      page_path: "/register",
      element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },
    {
      page_name: "Delete",
      page_path: "/delete-account",
      element: <PrivateRoute><DeleteAccount /></PrivateRoute>,
      index: false,
      is_in_RAB: false
    },
    // {
    //   page_name: "Course",
    //   page_path: "/course",
    //   element: <Course />,
    //   index: true,
    //   is_in_RAB: false
    // },
     {
      page_name: "Course",
      page_path: "/course/:course_slug",
      element: <CourseHomePage />,
      index: true,
      is_in_RAB: false
    },
    {
      page_name: "About",
      page_path: "/about",
      element: <About />,
      index: false,
      is_in_RAB: true
    },
    
    {
      page_name: "Email Verification Sent",
      page_path: "/email-verification-sent",
      element: <PublicOnlyRoute><EmailVerificationSent /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },

    {
      page_name: "Token Verification Email",
      page_path: "/token-verification-email/:uidb64/:token",
      element: <PublicOnlyRoute><TokenVerificationEmail /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },
    

    {
      page_name: "Problems Signing In",
      page_path: "/login/problems-signing-in",
      element: <PublicOnlyRoute><ProblemsSigningIn /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },

    {
      page_name: "Reset Password",
      page_path: "/reset-password/:uid/:token",
      element: <PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>,
      index: false,
      is_in_RAB: false
    },
    {
      page_name: "Not found",
      page_path: "*",
      element: <NotFound />,
      index: false,
      is_in_RAB: false
    },
  ]
};

function App() {
  return (
    <Container maxWidth='xl'>
      <ResponsiveAppBar AppBarData={AppBarData} />
      <DynamicBreadcrumbs />

      <Routes>
        {
          AppBarData.pages.map(
            (elem) => {
              return <Route index={elem.index} path={elem.page_path} element={elem.element} />
            }
          )
        }
      </Routes>



      <Footer />
    </Container>
  );
}

export default App;
