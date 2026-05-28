import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Refund Policy — Venn" };

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="May 2025"
      breadcrumb="Refund Policy"
      intro="We believe in this product enough to offer a straightforward money back guarantee. Here's exactly how it works."
    >
      <h2>1. 14 day guarantee</h2>
      <p>
        All paid plans come with a <strong>14 day money back guarantee</strong>.
      </p>
      <p>
        If Venn isn&apos;t right for you in the first 14 days — for any reason — email us at <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a> and we&apos;ll refund your payment in full.
      </p>
      <ul>
        <li>No questions asked</li>
        <li>No lengthy process</li>
        <li>No jumping through hoops</li>
      </ul>
      <p>
        We process refunds within 5 working days. The money returns to your original payment method.
      </p>

      <h2>2. After 14 days</h2>
      <p>
        After the 14 day window we don&apos;t offer refunds for the current billing period.
      </p>
      <p>This is because:</p>
      <ul>
        <li>You&apos;ve had access to the full product</li>
        <li>Our costs (AI, infrastructure, data) are incurred as you use it</li>
      </ul>
      <p>
        If something has gone genuinely wrong — a technical fault, a billing error, something on our end — we will always make it right. Email <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a> and explain what happened.
      </p>
      <p>
        We use <strong>account credit</strong> as our primary resolution for issues outside the refund window. This lets you continue using Venn without being out of pocket.
      </p>

      <h2>3. Solopreneur tier</h2>
      <p>
        The solopreneur tier is free until you close your first deal through Venn.
      </p>
      <p>
        If you close a deal and the success fee is processed — we do not offer refunds on that payment. You&apos;ve used the product and it worked.
      </p>
      <p>
        If you believe a payment was processed in error contact us immediately at <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a>.
      </p>

      <h2>4. Annual plans</h2>
      <p>
        Annual plans are paid upfront for 12 months at a discounted rate. The 14 day guarantee applies as normal.
      </p>
      <p>
        After 14 days — if you cancel an annual plan we will refund the remaining unused months as <strong>account credit</strong>. We don&apos;t refund cash for annual plans after the 14 day window but we will ensure you&apos;re not paying for a service you&apos;re not using.
      </p>

      <h2>5. How to request a refund</h2>
      <p>
        Email <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a> with:
      </p>
      <ul>
        <li>Your account email address</li>
        <li>The date you subscribed</li>
        <li>What went wrong or why you&apos;d like a refund</li>
      </ul>
      <p>
        That&apos;s it. We&apos;ll respond within one business day.
      </p>
    </LegalPage>
  );
}
