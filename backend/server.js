const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const session = require('express-session');
const userdb = require('./models/User'); // Ensure you have this model

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ["profile", "email"]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userdb.findOne({ googleId: profile.id });

      if (!user) {
        user = new userdb({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        });

        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:3000/audience",
  failureRedirect: "http://localhost:3000"
}));

app.get("/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User Logged In", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.use('/api', require('./routes/CustomerRoutes'));
app.use('/api', require('./routes/OrderRoutes'));
app.use('/api', require('./routes/CommunicationRoutes'));

app.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
