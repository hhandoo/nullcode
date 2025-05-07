import ResponsiveAppBar from '../component/ResponsiveAppBar';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Courses from '../pages/Courses';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

import { Container } from '@mui/material';

const AppBarData = {
  website_name: "Null Code",
  pages: [
    {
      page_name: "Home",
      page_path: "/",
      element: <Home />,
      index: true,
      is_in_RAB: true
    },
    {
      page_name: "Courses",
      page_path: "/courses",
      element: <Courses />,
      index: false,
      is_in_RAB: true
    },
    {
      page_name: "Settings",
      page_path: "/settings",
      element: <Settings />,
      index: false,
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
    <Container maxWidth="xl">
      <ResponsiveAppBar AppBarData={AppBarData} />
      <Routes>
        {
          AppBarData.pages.map(
            (elem) => {
              return <Route index={elem.index} path={elem.page_path} element={elem.element} />
            }
          )
        }
      </Routes>
    </Container>
  );
}

export default App;
