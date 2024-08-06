const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const axios = require('axios');
const Users = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;  // Get user ID from req.user
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${userId}${extension}`);
  }
});

const upload = multer({ storage: storage });


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
 * Get user's info endpoint
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      bio: user.bio,  
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})

/**
 * Update user information
 */
router.put('/profile', passport.authenticate('jwt', { session: false }), upload.single('profileImage'), async (req, res) => {
  const userId = req.user.id;
  const { username, bio } = req.body;
  const profileImage = req.file;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false })
    }
    user.username = username;
    user.bio = bio;
    if (profileImage) {
      //if (user.profileImage) {
        // Remove old profile image if exists - this seems to be wrong tho
        // fs.unlink(path.join(__dirname, '../uploads', user.profileImage), (err) => {
        //   if (err) console.error('Failed to delete old profile image:', err);
        // });
      //}
      const userId = req.user.id;
      user.profileImage = `${profileImage.fieldname}-${userId}${path.extname(profileImage.originalname)}`;
    }

    await user.save()
      .then(() => res.sendStatus(201))
      .catch(err => {console.log(err); return res.status(400).json({ success: false })} )
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

/**
 * Get movie information from the external moviesDB API
 */
router.get('/movies/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;
  const apiToken = process.env.MOVIES_DB_API_TOKEN;
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
router.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title } = req.query
  const apiToken = process.env.MOVIES_DB_API_TOKEN;
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
router.get('/movies/popular', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const apiToken = process.env.MOVIES_DB_API_TOKEN;
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