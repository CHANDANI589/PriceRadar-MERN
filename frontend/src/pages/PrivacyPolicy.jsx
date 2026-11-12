import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Clock, Globe } from "lucide-react";

const LAST_UPDATED = "November 12, 2026";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-navy text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-mustard hover:text-mustard-light transition-colors">
              <span className="text-sm font-display font-bold">PriceRadar</span>
            </Link>
            <span className="text-xs text-white/50 mx-1">/</span>
            <span className="text-xs text-mustard/80 font-medium">Privacy Policy</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-3 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            This Privacy Policy explains how PriceRadar collects, uses, shares, and protects your
            personal information when you use our website, products, and services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Clock size={14} /> Last updated: {LAST_UPDATED}
            </span>
            <span className="flex items-center gap-1">
              <Lock size={14} /> Secure &amp; encrypted
            </span>
          </div>
        </div>
      </section>

      <section className="bg-offwhite py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-8 md:p-12">

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                1. Introduction
              </h2>
              <p className="text-slate-text leading-relaxed text-sm">
                Welcome to PriceRadar ("we", "us", "our"). PriceRadar is a price-comparison shopping
                platform that lets you search real products, compare prices, track deals, save
                wishlists, set price alerts, and manage orders. Your privacy matters to us. This
                policy describes what information we collect, why we collect it, how we use it, and
                your rights over that data.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                2. Information We Collect
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-4">
                We collect information you provide directly, plus information collected automatically
                when you interact with our site.
              </p>
              <h3 className="font-display font-semibold text-lg text-navy mb-2">A. Account information</h3>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Email &amp; password accounts:</strong> When you register or log in with
                  email and password, we collect your name, email address, and a hashed password. We
                  never store passwords in plain text.
                </li>
                <li>
                  <strong>Google OAuth authentication:</strong> When you choose "Continue with
                  Google," we receive your Google profile ID, name, email address, and profile
                  picture from Google so you can register or log in. We do not receive or store your
                  Google password. Any verified Google account can sign up or log in.
                </li>
                <li>
                  <strong>Account linking:</strong> If your verified Google email matches an
                  existing email/password account, the Google account is safely linked without
                  creating duplicates and without overwriting your password.
                </li>
              </ul>
              <h3 className="font-display font-semibold text-lg text-navy mb-2">B. User data &amp; activity</h3>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>Wishlist items, price alerts, savings tracker data, and order history.</li>
                <li>Recently viewed products and search queries (used for product search and recommendations).</li>
                <li>Shipping and billing details you provide at checkout.</li>
              </ul>
              <h3 className="font-display font-semibold text-lg text-navy mb-2">C. Cookies &amp; automatic data</h3>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Authentication cookies:</strong> A secure, httpOnly cookie stores your
                  session token so you remain signed in across page reloads. In production it uses
                  <code className="font-mono text-xs text-mustard">SameSite=None; Secure</code> over
                  HTTPS.
                </li>
                <li>
                  <strong>Analytics &amp; performance data:</strong> IP address, browser type, device
                  information, referring pages, and interaction data.
                </li>
                <li><strong>Preferences:</strong> Theme, language, and cookie-consent choices.</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>To create and manage your account (email/password or Google OAuth).</li>
                <li>To authenticate you and keep your session active via secure cookies.</li>
                <li>To power product search, live search results, price comparisons, and deal alerts.</li>
                <li>To process orders, manage wishlists, and track savings.</li>
                <li>To send account-related and service notifications (you can opt out of marketing).</li>
                <li>To prevent fraud, secure the platform, and comply with legal obligations.</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                4. Third-Party Services
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                PriceRadar integrates with third-party services to deliver core features. These
                services operate under their own privacy policies:
              </p>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Google OAuth / Google:</strong> "Continue with Google" sign-in and real-time
                  Live Search results via Google Shopping. Google independently controls the data it collects.
                </li>
                <li>
                  <strong>SerpApi:</strong> Powers real-time Google Shopping search results (product
                  images, prices, stores) for our Live Search feature.
                </li>
                <li><strong>Render:</strong> Hosts our backend API and frontend; may process infrastructure logs.</li>
                <li><strong>MongoDB:</strong> Stores account and application data.</li>
              </ul>
              <p className="text-slate-text text-sm leading-relaxed">
                We do not sell your personal information to third parties. Service providers only
                receive the data they need to perform their function.
              </p>
            </div>
            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                5. Your Rights &amp; Choices
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li><strong>Access:</strong> View and update your account data via your Profile page.</li>
                <li><strong>Correction:</strong> Update inaccurate personal information at any time.</li>
                <li><strong>Deletion:</strong> Request deletion of your account and personal data.</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails and manage cookies via your browser settings.</li>
                <li><strong>Data portability:</strong> Request a copy of your data in a common format.</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                6. Security &amp; Retention
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>Passwords are hashed with bcrypt; we never store plaintext passwords.</li>
                <li>Session tokens use Secure, SameSite=None, httpOnly cookies over HTTPS in production.</li>
                <li>Data is transmitted over encrypted TLS connections.</li>
                <li>We retain account data while your account is active and as long as needed to meet legal obligations.</li>
              </ul>
            </div>

            <div className="bg-navy/5 rounded-xl border border-navy/10 p-6 md:p-8 mt-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Globe className="text-mustard w-6 h-6 shrink-0" />
                <div>
                  <p className="font-display font-bold text-navy text-sm mb-1">Contact Us</p>
                  <p className="text-slate-text text-sm">
                    Questions about this Privacy Policy or your personal data? Contact us at{" "}
                    <a
                      href="mailto:privacy@priceradar.com"
                      className="text-mustard hover:underline font-medium"
                    >
                      privacy@priceradar.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;