const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback endpoint
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // On success, redirect to root for browser flows or return JSON
    if (req.accepts('html')) return res.redirect('/');
    res.json({ message: 'Authentication successful', user: req.user });
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

router.get('/logout', (req, res, next) => {
  // Passport 0.6 requires callback for logout
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      if (req.accepts('html')) return res.redirect('/');
      res.json({ message: 'Logged out' });
    });
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.json(req.user);
  return res.status(200).json(null);
});

module.exports = router;
