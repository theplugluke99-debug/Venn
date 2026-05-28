import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Acceptable Use Policy — Venn" };

export default function AcceptableUsePage() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      lastUpdated="May 2025"
      breadcrumb="Acceptable Use Policy"
      intro="Venn is built on the belief that outreach should feel like genuine attention — not harassment. This policy exists to make sure Venn is used in the spirit it was built. We built Venn to help agency owners reach the right clients in the right way. These rules protect that purpose."
    >
      <h2>1. What Venn is for</h2>
      <p>Venn is for:</p>
      <ul>
        <li>Agency owners doing genuine business development</li>
        <li>Finding businesses that could genuinely benefit from your services</li>
        <li>Making first contact in a personalised, respectful way</li>
        <li>Managing client relationships you win honestly</li>
      </ul>

      <h2>2. What you must not do</h2>
      <p>You must not use Venn to:</p>

      <p><strong>Spam</strong></p>
      <ul>
        <li>Send bulk unsolicited messages</li>
        <li>Send the same message to hundreds of people without personalisation</li>
        <li>Use Venn to power mass cold email campaigns</li>
      </ul>

      <p><strong>Harass</strong></p>
      <ul>
        <li>Continue contacting someone after they&apos;ve asked you to stop</li>
        <li>Send aggressive or threatening messages</li>
        <li>Make contact in ways designed to intimidate</li>
      </ul>

      <p><strong>Misrepresent</strong></p>
      <ul>
        <li>Pretend to be someone you&apos;re not</li>
        <li>Make false claims about your services or results</li>
        <li>Use fake testimonials or manufactured case studies</li>
      </ul>

      <p><strong>Violate privacy</strong></p>
      <ul>
        <li>Collect personal data beyond what is needed for outreach</li>
        <li>Store or redistribute contact data found by Venn</li>
        <li>Use Venn data for any purpose other than your own outreach</li>
      </ul>

      <p><strong>Break the law</strong></p>
      <ul>
        <li>Violate GDPR or PECR</li>
        <li>Breach any applicable marketing or data protection law</li>
        <li>Use Venn in any way that is illegal in your jurisdiction</li>
      </ul>

      <p><strong>Abuse the platform</strong></p>
      <ul>
        <li>Share your account with others</li>
        <li>Attempt to circumvent usage limits</li>
        <li>Reverse engineer or copy Venn&apos;s technology or design</li>
        <li>Use automated scripts to abuse the search functionality</li>
      </ul>

      <h2>3. GDPR and outreach</h2>
      <p>
        If you&apos;re contacting businesses in the UK or EU you must comply with GDPR and PECR.
      </p>
      <p>For B2B outreach to businesses:</p>
      <ul>
        <li>You can contact businesses at their publicly listed business contact details</li>
        <li>You must identify yourself clearly</li>
        <li>You must offer an easy way to opt out</li>
        <li>You must honour opt-out requests immediately</li>
      </ul>
      <p>
        Venn generates contact data from public sources. You are responsible for ensuring your use of that data is lawful. If you&apos;re unsure whether your outreach is GDPR compliant, consult the ICO guidance at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or seek legal advice.
      </p>

      <h2>4. Enforcement</h2>
      <p>If you violate this policy:</p>
      <ul>
        <li><strong>First violation</strong> — warning and required to delete any data misused</li>
        <li><strong>Serious or repeated violation</strong> — immediate account termination without refund</li>
      </ul>
      <p>
        We may report serious violations to relevant authorities where required by law.
      </p>
      <p>
        We take these rules seriously because our reputation depends on Venn being used ethically. One bad actor affects the deliverability and reputation of everyone using the platform.
      </p>

      <h2>5. Reporting misuse</h2>
      <p>
        If you&apos;ve been contacted using Venn in a way that felt like spam or harassment, or if you&apos;re a Venn user who&apos;s seen the platform misused:
      </p>
      <p>
        Email <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a>. We investigate every report and take action where needed.
      </p>
    </LegalPage>
  );
}
