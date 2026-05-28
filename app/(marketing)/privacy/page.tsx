import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy — Venn" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="May 2025"
      breadcrumb="Privacy Policy"
      intro="Your privacy matters. This policy explains exactly what data we collect, why we collect it and what we do with it. No hidden practices. No selling your data. Just honesty."
    >
      <h2>1. Who we are</h2>
      <p>
        Venn is operated by Luke Mitchell trading as Venn. We are the data controller for personal data you provide to us.
      </p>
      <p>
        Contact: <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a><br />
        Website: getvenn.agency
      </p>

      <h2>2. Data we collect about you</h2>
      <p><strong>When you create an account:</strong></p>
      <ul>
        <li>Your name and email address (via Clerk authentication)</li>
        <li>Your Google or other OAuth profile if you sign up that way</li>
      </ul>
      <p><strong>When you use Venn:</strong></p>
      <ul>
        <li>Search queries you run</li>
        <li>Leads you generate and their intelligence data</li>
        <li>Prospect cards you create</li>
        <li>Proposals you generate</li>
        <li>Client records you add</li>
        <li>Usage patterns and feature use</li>
      </ul>
      <p><strong>When you pay:</strong></p>
      <ul>
        <li>Payment is processed by Stripe</li>
        <li>We store your subscription status and plan — not your card details</li>
        <li>Stripe stores payment data under their own privacy policy</li>
      </ul>
      <p><strong>Communications:</strong></p>
      <ul>
        <li>Emails you send to us</li>
        <li>Replies to our onboarding and product emails</li>
      </ul>

      <h2>3. Data we collect about third parties</h2>
      <p>
        When you search for businesses using Venn we collect publicly available information about those businesses including:
      </p>
      <ul>
        <li>Business name, address, phone number and website</li>
        <li>Google rating and review content (publicly posted)</li>
        <li>Website content and technical information</li>
        <li>Public social media profile information</li>
        <li>Companies House registration data (public record)</li>
        <li>Contact email addresses that are publicly listed</li>
      </ul>
      <p>
        We only access information that is publicly available. We do not access private accounts, hack systems or breach any platform&apos;s terms of service.
      </p>
      <p>
        This data is used to generate intelligence for your outreach. It is stored associated with your account and is not shared with other Venn users.
      </p>

      <h2>4. How we use your data</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Provide and improve the Venn service</li>
        <li>Process your subscription and payments</li>
        <li>Send you product updates and onboarding emails</li>
        <li>Respond to your support requests</li>
        <li>Analyse how the product is used to make it better</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>We do not use your data to:</p>
      <ul>
        <li>Sell to advertisers</li>
        <li>Build profiles for third parties</li>
        <li>Send you marketing from other companies</li>
        <li>Make automated decisions that significantly affect you</li>
      </ul>

      <h2>5. Legal basis for processing</h2>
      <p>Under GDPR we process your data on these legal bases:</p>
      <ul>
        <li><strong>Contract performance</strong> — processing necessary to provide the Venn service you&apos;ve subscribed to</li>
        <li><strong>Legitimate interests</strong> — improving the product, preventing fraud, basic analytics</li>
        <li><strong>Legal obligation</strong> — complying with applicable laws</li>
        <li><strong>Consent</strong> — for any marketing communications beyond product updates (you can withdraw consent anytime)</li>
      </ul>

      <h2>6. Who we share data with</h2>
      <p>We share data with these service providers only:</p>
      <ul>
        <li><strong>Clerk</strong> (clerk.com) — Authentication and user management</li>
        <li><strong>Stripe</strong> (stripe.com) — Payment processing</li>
        <li><strong>Anthropic</strong> (anthropic.com) — AI intelligence generation. Your lead data is sent to Anthropic&apos;s API to generate opening lines and analysis</li>
        <li><strong>Supabase</strong> (supabase.com) — Database hosting (EU West — Ireland)</li>
        <li><strong>Upstash</strong> (upstash.com) — Redis queue for background jobs</li>
        <li><strong>Vercel</strong> (vercel.com) — Hosting infrastructure</li>
        <li><strong>Resend</strong> (resend.com) — Transactional email delivery</li>
      </ul>
      <p>
        We do not share your data with anyone else. <strong>We do not sell your data. Ever.</strong>
      </p>

      <h2>7. Data retention</h2>
      <ul>
        <li><strong>Account data</strong> — kept while your account is active and for 90 days after deletion, then permanently removed</li>
        <li><strong>Lead and pipeline data</strong> — preserved for 90 days after cancellation for export, then deleted permanently</li>
        <li><strong>Payment records</strong> — kept for 7 years as required by UK financial regulations</li>
        <li><strong>Support emails</strong> — kept for 2 years, then deleted</li>
      </ul>

      <h2>8. Your rights</h2>
      <p>Under GDPR you have the right to:</p>
      <ul>
        <li><strong>Access</strong> — request a copy of all data we hold about you</li>
        <li><strong>Correction</strong> — ask us to fix inaccurate data</li>
        <li><strong>Deletion</strong> — ask us to delete your data (right to be forgotten)</li>
        <li><strong>Portability</strong> — request your data in a machine-readable format</li>
        <li><strong>Restriction</strong> — ask us to stop processing your data in certain ways</li>
        <li><strong>Object</strong> — object to processing based on legitimate interests</li>
      </ul>
      <p>
        To exercise any of these rights: email <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a>. We will respond within 30 days and will never charge you for exercising your rights.
      </p>

      <h2>9. International data transfers</h2>
      <p>
        Your data is stored in the EU (Supabase — Ireland). Some service providers listed above may process data outside the UK/EU. Where this happens we ensure appropriate safeguards are in place through Standard Contractual Clauses or equivalent mechanisms.
      </p>

      <h2>10. Security</h2>
      <ul>
        <li>All data transmitted over HTTPS</li>
        <li>Database encrypted at rest</li>
        <li>Access controls limiting who can see your data</li>
        <li>Regular security reviews</li>
      </ul>
      <p>
        If we become aware of a data breach affecting your personal data we will notify you within 72 hours as required by GDPR.
      </p>

      <h2>11. Cookies</h2>
      <p>
        See our full <a href="/cookies">Cookie Policy</a>. Short version: we use essential cookies only. No advertising cookies. No third party tracking.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        If we make significant changes to this policy we will email you at least 14 days before they take effect. Minor updates will be reflected here with a new date.
      </p>

      <h2>13. Complaints</h2>
      <p>
        If you&apos;re unhappy with how we handle your data you can complain to the UK Information Commissioner:
      </p>
      <ul>
        <li><a href="https://ico.org.uk/make-a-complaint" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a></li>
        <li>0303 123 1113</li>
      </ul>
      <p>
        We&apos;d always rather you contact us first so we can put things right: <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a>
      </p>
    </LegalPage>
  );
}
