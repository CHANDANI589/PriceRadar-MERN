const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Validate required Google OAuth environment variables at module load time.
const requiredEnv = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    "Google OAuth: missing required environment variables: " +
      missingEnv.join(", ") +
      ". Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL in Render."
  );
}

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
          // Guard against missing profile or profile.id (prevents crashes).
          if (!profile || !profile.id) {
            console.error("Google OAuth: missing profile or profile.id");
            return done(null, false, { message: "Google authentication failed: invalid profile" });
          }

          // Passport Google OAuth2 provides emails as [{ value: "...", verified: true }]
          // Use profile.emails[0].value (NOT .email) for the email address.
          const emailEntry =
            profile.emails && Array.isArray(profile.emails) && profile.emails[0]
              ? profile.emails[0]
              : null;
          const email =
            emailEntry && emailEntry.value ? String(emailEntry.value).toLowerCase().trim() : null;

          // Google communicates email verification via profile._json.email_verified.
          // profile.emails[0].verified may be missing even for verified accounts.
          let emailVerified = false;
          if (
            profile._json &&
            Object.prototype.hasOwnProperty.call(profile._json, "email_verified")
          ) {
            emailVerified =
              profile._json.email_verified === true ||
              profile._json.email_verified === "true";
          } else if (emailEntry) {
            emailVerified = emailEntry.verified === true;
          }

          // Reject safely without crashing when Google does not provide a verified email.
          // NO email whitelist is applied here: every verified Google account is allowed.
          if (!email || !emailVerified) {
            console.error(
              "Google OAuth: missing or unverified email",
              { hasEmail: Boolean(email), emailVerified, hasProfileJson: Boolean(profile._json) }
            );
            return done(null, false, { message: "Google email address is not verified or not available" });
          }

          const googleId = profile.id;

          // 1. Find existing user by Google ID (existing Google account)
          let user = await User.findOne({ googleId });

          if (!user) {
            // 2. Try to link by email (account already exists with email/password)
            user = await User.findOne({ email });

            if (user) {
              // Safety: never hijack an account whose googleId is already bound to a
              // different Google account. Only link when this user has no googleId yet.
              if (user.googleId && user.googleId !== googleId) {
                console.error(
                  "Google OAuth: email already bound to a different Google account",
                  { email, existingGoogleId: user.googleId, incomingGoogleId: googleId }
                );
                return done(null, false, { message: "This email is already linked to another Google account" });
              }

              // Link Google account to existing user without creating duplicates.
              // Password, role, wishlist, addresses and all other account data are preserved.
              user.googleId = googleId;
              if (!user.avatar && profile.photos && profile.photos[0]) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              // 3. No existing account — create a new user from Google profile
              user = await User.create({
                name: (profile.displayName || profile.name?.givenName || "Google User").trim(),
                email,
                googleId,
                password: undefined, // Google users have no password (never set/overwrite)
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
