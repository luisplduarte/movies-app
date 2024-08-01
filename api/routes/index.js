const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Users = require('../models/userModel')
const axios = require('axios')

const router = express.Router();

/**
 * Login route
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await Users.findOne({ username: username })
  if (!user) return res.status(400).json({ success: false })

  // Check if password is correct
  const isMatch = await user.isValidPassword(password)
  if (isMatch) {
    const payload = {
      id: user._id.toString(),
      username: user.username
    };

    // Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        res.json({
          success: true,
          token: `Bearer ${token}`
        });
      }
    )
  } else {
    return res.status(400).json({ success: false })
  }
})

/* Sign up route */
router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const user = await Users.findOne({ username: username })
  if (user) {
    return res.status(400).json({ success: false })
  } else {
    const newUser = new Users({
      username: username,
      password: password
    })

    newUser.save()
      .then(() => res.sendStatus(201))
      .catch(err => {console.log(err); return res.status(400).json({ success: false })} )
  }
})

/**
 * Test route to check if user is logged in.
 * Returns current user if logged in or unauthorized response if not
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
  })
})

/**
 * Get movie information from the external moviesDB API
 */
router.get('/movies/:id', async (req, res) => {
  const { id } = req.params
  const apiToken = process.env.MOVIES_DB_API_TOKEN; // Ensure you have this environment variable set with your API key
  const url = `https://api.themoviedb.org/3/movie/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch movie' });
  }
});

/**
 * Get movies that have the specified string in the title from moviesDB API
 */
router.get('/movies', async (req, res) => {
  const { title } = req.query
  const apiToken = process.env.MOVIES_DB_API_TOKEN; // Ensure you have this environment variable set with your API key
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch movies' });
  }
});

/**
 * Get popular movies from the external moviesDB API
 */
router.get('/movies/popular', async (req, res) => {
  const apiToken = process.env.MOVIES_DB_API_TOKEN; // Ensure you have this environment variable set with your API key
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch popular movies' });
  }
});

module.exports = router;