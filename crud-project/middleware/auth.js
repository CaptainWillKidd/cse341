function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

// export with two names to match existing imports
function ensureAuthenticated(req, res, next) {
  return ensureAuth(req, res, next);
}

module.exports = { ensureAuth, ensureAuthenticated };
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

module.exports = { ensureAuthenticated };
