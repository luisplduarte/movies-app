import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';
import Movie from './pages/Movie';
import Movies from './pages/Movies';
import PrivateRoutes from './components/PrivateRoutes';
import DefaultLayout from './layouts/DefaultLayout';
import ProfileEdit from './pages/ProfileEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<Movie />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Catch-all route to show 404 page */}
      </Routes>
    </Router>
  );
}

export default App;
