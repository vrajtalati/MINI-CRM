const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Passport Google OAuth Strategy
passport.use(new GoogleStrateg({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (token, tokenSecret, profile, done) => {
  try {
    // Check if user already exists in the database
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // If user doesn't exist, create a new one
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    });
    await user.save();

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
