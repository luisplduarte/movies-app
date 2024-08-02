import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';
import Movie from './pages/Movie';
import PrivateRoutes from './components/PrivateRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Catch-all route to show 404 page */}
      </Routes>
    </Router>
  );
}

export default App;
