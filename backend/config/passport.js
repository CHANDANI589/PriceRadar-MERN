const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Only accept verified Google email addresses
          if (!profile.emails || !profile.emails[0] || !profile.emails[0].verified) {
            return done(null, false, { message: "Google email address is not verified" });
          }

          const email = profile.emails[0].email.toLowerCase();
          const googleId = profile.id;

          // 1. Find existing user by Google ID
          let user = await User.findOne({ googleId });

          if (!user) {
            // 2. Try to link by email (account already exists with email/password)
            user = await User.findOne({ email });

            if (user) {
              // Link Google account to existing user without creating duplicates
              user.googleId = googleId;
              if (!user.avatar && profile.photos && profile.photos[0]) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              // 3. No existing account — create a new user from Google profile
              user = await User.create({
                name: profile.displayName || profile.name?.givenName || "Google User",
                email,
                googleId,
                password: undefined, // Google users have no password
                avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
              });
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
