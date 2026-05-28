import { chromium } from "playwright";

export interface TechResult {
  bookingPlatform: string | null;
  emailPlatform: string | null;
  chatPlatform: string | null;
  reviewPlatform: string | null;
  hasLiveChat: boolean;
  hasCookieBanner: boolean;
  hasPrivacyPolicy: boolean;
  techStack: string[];
}

const BOOKING_PLATFORMS: Record<string, string[]> = {
  fresha: ["fresha.com", "shedul.com"],
  cliniko: ["cliniko.com"],
  treatwell: ["treatwell.co.uk", "treatwell.com"],
  acuity: ["acuityscheduling.com"],
  calendly: ["calendly.com"],
  jane: ["janeapp.com"],
  mindbody: ["mindbodyonline.com", "booker.com"],
  timely: ["gettimely.com"],
  square: ["squareup.com/appointments", "squareup.com/book"],
  phorest: ["phorest.com"],
  shortcuts: ["shortcuts.net"],
  premier: ["premiersoftware.co.uk"],
};

const EMAIL_PLATFORMS: Record<string, string[]> = {
  mailchimp: ["list-manage.com", "mailchimp.com"],
  klaviyo: ["klaviyo.com"],
  activecampaign: ["activehosted.com"],
  constantcontact: ["constantcontact.com"],
  dotdigital: ["dotdigital.com", "dmtrk.com"],
  campaign_monitor: ["campaignmonitor.com", "cmail"],
};

const CHAT_PLATFORMS: Record<string, string[]> = {
  intercom: ["intercom.io"],
  tidio: ["tidio.com"],
  tawk: ["tawk.to"],
  drift: ["drift.com"],
  whatsapp_widget: ["wa.me", "api.whatsapp.com/send"],
  zendesk: ["zopim.com", "zendesk"],
};

const REVIEW_PLATFORMS: Record<string, string[]> = {
  trustpilot: ["trustpilot.com"],
  feefo: ["feefo.com"],
  reviews_io: ["reviews.io"],
  yotpo: ["yotpo.com"],
};

function detect(signals: Record<string, string[]>, urls: string[], html: string): string | null {
  for (const [platform, patterns] of Object.entries(signals)) {
    if (patterns.some((p) => urls.some((u) => u.includes(p)) || html.includes(p))) {
      return platform;
    }
  }
  return null;
}

export async function extendedTechScan(lead: { website?: string | null }): Promise<TechResult | null> {
  if (!lead.website) return null;

  const url = lead.website.startsWith("http") ? lead.website : `https://${lead.website}`;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const requestedUrls: string[] = [];
    page.on("request", (req) => requestedUrls.push(req.url()));

    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    const html = await page.content();

    const bookingPlatform = detect(BOOKING_PLATFORMS, requestedUrls, html);
    const emailPlatform = detect(EMAIL_PLATFORMS, requestedUrls, html);
    const chatPlatform = detect(CHAT_PLATFORMS, requestedUrls, html);
    const reviewPlatform = detect(REVIEW_PLATFORMS, requestedUrls, html);

    const htmlLower = html.toLowerCase();
    const hasLiveChat =
      chatPlatform !== null ||
      htmlLower.includes("live chat") ||
      htmlLower.includes("chat with us");
    const hasCookieBanner =
      htmlLower.includes("cookie") && (htmlLower.includes("accept") || htmlLower.includes("consent"));
    const hasPrivacyPolicy =
      requestedUrls.some((u) => u.includes("privacy")) || htmlLower.includes("privacy policy");

    const techStack: string[] = [];
    if (bookingPlatform) techStack.push(`booking:${bookingPlatform}`);
    if (emailPlatform) techStack.push(`email:${emailPlatform}`);
    if (chatPlatform) techStack.push(`chat:${chatPlatform}`);
    if (reviewPlatform) techStack.push(`reviews:${reviewPlatform}`);

    return { bookingPlatform, emailPlatform, chatPlatform, reviewPlatform, hasLiveChat, hasCookieBanner, hasPrivacyPolicy, techStack };
  } finally {
    await browser.close();
  }
}
