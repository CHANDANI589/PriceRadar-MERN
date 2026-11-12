import { Link } from "react-router-dom";
import { ShieldCheck, FileCheck, Mail, Clock, Globe } from "lucide-react";

const LAST_UPDATED = "November 12, 2026";

const Terms = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-navy text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-mustard hover:text-mustard-light transition-colors">
              <span className="text-sm font-display font-bold">PriceRadar</span>
            </Link>
            <span className="text-xs text-white/50 mx-1">/</span>
            <span className="text-xs text-mustard/80 font-medium">Terms of Service</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-3 leading-tight">
            Terms of Service
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Please read these terms carefully. By accessing or using PriceRadar, you agree to be
            bound by these Terms of Service.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Clock size={14} /> Last updated: {LAST_UPDATED}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Binding agreement
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
                These Terms of Service ("Terms") govern your use of PriceRadar, a price-comparison
                shopping platform operated by PriceRadar ("we", "us", "our"). By accessing or using
                our website, products, and services, you agree to these Terms and our Privacy
                Policy. If you do not agree, you may not use the service.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                2. Acceptance of Terms
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                By registering, logging in, browsing, or placing an order on PriceRadar, you
                represent that you are at least 13 years old (or the minimum age required in your
                jurisdiction) and have the legal capacity to enter into a binding agreement. If you
                are accepting on behalf of an organization, you represent that you have authority to
                bind that organization.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                3. Accounts &amp; Registration
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Email/password accounts:</strong> You may register with your name, email,
                  and a password. You are responsible for keeping your credentials confidential and
                  for all activity under your account.
                </li>
                <li>
                  <strong>Google OAuth:</strong> You may register or log in with "Continue with
                  Google." Any verified Google account may sign up or log in. We receive your Google
                  profile ID, name, email, and profile picture solely for authentication.
                </li>
                <li>
                  <strong>Cookies:</strong> We use a secure, httpOnly authentication cookie to keep
                  you signed in. You may block or delete cookies via your browser, but some features
                  may not work without them.
                </li>
                <li>
                  <strong>Account accuracy:</strong> You agree to provide accurate, current, and
                  complete information and to update it as needed.
                </li>
                <li>
                  <strong>Account termination:</strong> We may suspend or terminate accounts that
                  violate these Terms, at our discretion, without prior notice.
                </li>
              </ul>
            </div>
            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                4. User Conduct &amp; Limitations
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>Use the service for any unlawful purpose or in violation of these Terms.</li>
                <li>Impersonate another person or entity, or misrepresent your affiliation.</li>
                <li>Interfere with, disrupt, or attempt unauthorized access to the service or its servers.</li>
                <li>Scrape, crawl, or otherwise automate collection of product or pricing data except through our provided search features.</li>
                <li>Post harmful, abusive, or illegal content, or attempt to reverse-engineer any part of the platform.</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                5. Product Search &amp; Third-Party Services
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Live Search:</strong> Real-time product results are powered by Google
                  Shopping via SerpApi. Prices, availability, and merchant information come from
                  third-party stores and may change without notice.
                </li>
                <li>
                  <strong>Catalog products:</strong> Our demo catalog uses simulated pricing for
                  demonstration purposes and may not reflect real-world prices.
                </li>
                <li>
                  <strong>Third-party links:</strong> Search results may link to external retailer
                  sites. We are not responsible for their content, prices, policies, or transactions.
                </li>
                <li>
                  <strong>No endorsement:</strong> Inclusion of a product or store does not imply
                  endorsement by PriceRadar.
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                6. Pricing, Availability &amp; Orders
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>All prices are subject to change. The price confirmed at checkout governs the order.</li>
                <li>Product availability is subject to stock; we do not guarantee availability.</li>
                <li>We may accept, reject, or cancel any order at our discretion (e.g., pricing errors or stock issues).</li>
                <li>Payments are processed through our integrated checkout; see Checkout for details.</li>
              </ul>
            </div>
            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                7. Intellectual Property
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                All content on PriceRadar — including text, graphics, logos, images, software, and
                trademarks — is owned by PriceRadar or its licensors and is protected by copyright
                and trademark laws. You may not reproduce, distribute, or create derivative works
                without our express written permission.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                8. Disclaimers &amp; Limitation of Liability
              </h2>
              <ul className="list-disc list-inside text-slate-text text-sm leading-relaxed mb-4 space-y-2">
                <li>
                  <strong>Service "as is":</strong> The service is provided on an "as is" and "as
                  available" basis, without warranties of any kind, express or implied.
                </li>
                <li>
                  <strong>No warranty:</strong> We do not warrant that the service will be
                  error-free, uninterrupted, secure, or free of viruses or harmful components.
                </li>
                <li>
                  <strong>Limitation of liability:</strong> To the fullest extent permitted by law,
                  PriceRadar and its providers are not liable for indirect, incidental, consequential,
                  or punitive damages, or for loss of profits, data, or use, arising out of or
                  related to your use of the service.
                </li>
                <li>
                  <strong>Third-party transactions:</strong> We are not a party to transactions
                  between you and external retailers and are not liable for any loss arising from
                  those transactions.
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                9. Termination
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                We may suspend or terminate your access to the service, without notice, for any
                reason, including violation of these Terms. Upon termination, your right to use the
                service immediately ceases. Provisions that by their nature should survive
                (including limitations of liability) will survive termination.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                10. Governing Law &amp; Disputes
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                These Terms are governed by the laws of India, without regard to conflict-of-law
                principles. Any disputes arising out of or relating to these Terms shall be
                resolved in the competent courts located in India. You may contact us with questions
                or disputes using the information below.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-display font-bold text-2xl text-navy mb-3">
                11. Changes to These Terms
              </h2>
              <p className="text-slate-text leading-relaxed text-sm mb-3">
                We may revise these Terms from time to time. The most current version will be
                posted on this page with a "Last updated" date. Your continued use of the service
                after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div className="bg-navy/5 rounded-xl border border-navy/10 p-6 md:p-8 mt-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Mail className="text-mustard w-6 h-6 shrink-0" />
                <div>
                  <p className="font-display font-bold text-navy text-sm mb-1">Contact Us</p>
                  <p className="text-slate-text text-sm">
                    Questions about these Terms? Contact us at{" "}
                    <a
                      href="mailto:legal@priceradar.com"
                      className="text-mustard hover:underline font-medium"
                    >
                      legal@priceradar.com
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

export default Terms;