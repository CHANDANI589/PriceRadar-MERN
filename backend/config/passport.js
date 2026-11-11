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
          // Passport Google OAuth2 provides emails as [{ value: "...", verified: true }]
          // Use profile.emails[0].value (NOT .email) for the email address.
          const emailEntry = profile.emails && profile.emails[0] ? profile.emails[0] : null;
          const email = emailEntry ? String(emailEntry.value).toLowerCase() : null;

          // Google communicates email verification via profile._json.email_verified.
          // profile.emails[0].verified may be missing even for verified accounts.
          let emailVerified = false;
          if (
            profile._json &&
            Object.prototype.hasOwnProperty.call(profile._json, "email_verified")
          ) {
            emailVerified = profile._json.email_verified === true || profile._json.email_verified === "true";
          } else if (emailEntry) {
            emailVerified = emailEntry.verified === true;
          }

          // Reject safely without crashing when Google does not provide a verified email.
          if (!email || !emailVerified) {
            console.error(
              "Google OAuth: missing or unverified email",
              { hasEmail: Boolean(email), emailVerified, hasProfileJson: Boolean(profile._json) }
            );
            return done(null, false, { message: "Google email address is not verified or not available" });
          }

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
          // Safe error logging: never log OAuth tokens, client secrets, or passwords.
          console.error("Google OAuth strategy error:", err.message);
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
