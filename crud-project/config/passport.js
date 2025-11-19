const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db/connection');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('Google OAuth not fully configured: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing. Strategy will be disabled.');
}

passport.serializeUser((user, done) => {
  // store the user's id in session
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const users = db.getCollection('users');
    const user = await users.findOne({ _id: typeof id === 'string' ? require('mongodb').ObjectId(id) : id });
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

if (CLIENT_ID && CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Ensure DB is connected
    if (!db.isConnected()) {
      // try connecting if possible
      if (process.env.MONGO_URI) await db.connect(process.env.MONGO_URI);
    }
    const users = db.getCollection('users');
    const googleId = profile.id;
    const existing = await users.findOne({ googleId });
    if (existing) return done(null, existing);

    const userDoc = {
      googleId,
      displayName: profile.displayName,
      emails: profile.emails || [],
      photos: profile.photos || [],
      provider: 'google',
      createdAt: new Date()
    };
    const result = await users.insertOne(userDoc);
    const user = await users.findOne({ _id: result.insertedId });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
  }));
}

module.exports = passport;
