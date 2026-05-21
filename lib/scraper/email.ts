import { chromium } from "playwright";

function extractEmailsFromText(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(text.match(emailRegex) ?? [])];
}

function scoreEmail(email: string): number {
  const lower = email.toLowerCase();
  // Prefer these common business emails
  if (lower.startsWith("info@")) return 10;
  if (lower.startsWith("hello@")) return 9;
  if (lower.startsWith("contact@")) return 8;
  if (lower.startsWith("enquiries@")) return 7;
  if (lower.startsWith("bookings@")) return 6;
  if (lower.startsWith("admin@")) return 5;
  // Deprioritise no-reply and automated addresses
  if (lower.includes("noreply") || lower.includes("no-reply")) return -10;
  if (lower.includes("mailer") || lower.includes("postmaster")) return -10;
  return 1;
}

async function scrapeEmailFromWebsite(url: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (compatible; VennBot/1.0)",
  });

  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

    // Look for mailto links on homepage
    const homepageEmails = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href^="mailto:"]');
      return Array.from(links).map((a) =>
        (a as HTMLAnchorElement).href.replace("mailto:", "").split("?")[0]
      );
    });

    if (homepageEmails.length > 0) {
      await browser.close();
      return homepageEmails.sort((a, b) => scoreEmail(b) - scoreEmail(a))[0];
    }

    // Try contact page
    const contactPatterns = ["/contact", "/contact-us", "/get-in-touch", "/reach-us"];
    for (const path of contactPatterns) {
      try {
        const base = new URL(url);
        const contactUrl = `${base.origin}${path}`;
        await page.goto(contactUrl, { waitUntil: "domcontentloaded", timeout: 5000 });

        const contactEmails = await page.evaluate(() => {
          const links = document.querySelectorAll('a[href^="mailto:"]');
          const mailtos = Array.from(links).map((a) =>
            (a as HTMLAnchorElement).href.replace("mailto:", "").split("?")[0]
          );
          // Also scan body text
          const bodyText = document.body?.innerText ?? "";
          const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
          return [...new Set([...mailtos, ...(bodyText.match(emailRegex) ?? [])])];
        });

        if (contactEmails.length > 0) {
          await browser.close();
          return contactEmails.sort((a, b) => scoreEmail(b) - scoreEmail(a))[0];
        }
      } catch {
        continue;
      }
    }

    await browser.close();
    return null;
  } catch {
    await browser.close();
    return null;
  }
}

async function tryHunterIo(
  domain: string,
  firstName?: string
): Promise<string | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://api.hunter.io/v2/domain-search");
    url.searchParams.set("domain", domain);
    url.searchParams.set("api_key", apiKey);
    if (firstName) url.searchParams.set("first_name", firstName);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = await res.json();
    const emails: string[] = (data.data?.emails ?? [])
      .filter((e: { type: string }) => e.type === "generic" || e.type === "personal")
      .map((e: { value: string }) => e.value);

    return emails.length > 0 ? emails[0] : null;
  } catch {
    return null;
  }
}

function guessCommonEmails(domain: string): string[] {
  return [
    `info@${domain}`,
    `hello@${domain}`,
    `contact@${domain}`,
    `enquiries@${domain}`,
    `bookings@${domain}`,
  ];
}

export async function findEmail(
  websiteUrl: string | null | undefined,
  ownerFirstName?: string | null
): Promise<string | null> {
  if (!websiteUrl) return null;

  let domain: string;
  try {
    domain = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
    ).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }

  const normalised = websiteUrl.startsWith("http")
    ? websiteUrl
    : `https://${websiteUrl}`;

  // Run scraping and Hunter.io in parallel
  const [scrapedEmail, hunterEmail] = await Promise.all([
    scrapeEmailFromWebsite(normalised).catch(() => null),
    tryHunterIo(domain, ownerFirstName ?? undefined).catch(() => null),
  ]);

  if (scrapedEmail) return scrapedEmail;
  if (hunterEmail) return hunterEmail;

  // Fall back to common patterns (not verified, but useful as a starting point)
  const guesses = guessCommonEmails(domain);
  return guesses[0]; // info@ is the most likely to exist
}
