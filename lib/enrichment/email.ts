import { chromium } from "playwright";
import net from "net";
import { resolveMx } from "dns/promises";

export interface EmailResult {
  ownerEmail: string | null;
  ownerEmailConfidence: string;
  ownerEmailSource: string;
  ownerEmailVerified: boolean;
  emailPatternsTried: string[];
}

export function extractDomain(website: string): string | null {
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function extractEmailsFromText(text: string): string[] {
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(text.match(regex) ?? [])];
}

function prioritiseOwnerEmail(emails: string[]): string | null {
  const genericPrefixes = [
    "noreply", "no-reply", "donotreply", "mailer", "newsletter",
    "marketing", "support", "help", "privacy", "legal", "billing",
    "invoices", "postmaster", "abuse",
  ];
  const filtered = emails.filter(
    (e) => !genericPrefixes.some((p) => e.toLowerCase().startsWith(p)) &&
      !e.includes("example") &&
      !e.includes("placeholder") &&
      !e.includes("yourname") &&
      !e.includes(".png") &&
      !e.includes(".jpg") &&
      e.includes(".")
  );
  const domainEmails = filtered.filter(
    (e) => !e.includes("gmail.com") && !e.includes("hotmail.com") && !e.includes("yahoo.com")
  );
  return domainEmails[0] ?? filtered[0] ?? null;
}

async function scrapePageForEmails(url: string): Promise<string[]> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    const content = await page.content();
    const mailtoEmails = await page.$$eval(
      'a[href^="mailto:"]',
      (links) => links.map((l) => (l as HTMLAnchorElement).href.replace("mailto:", "").split("?")[0])
    );
    const textEmails = extractEmailsFromText(content);
    return [...new Set([...mailtoEmails, ...textEmails])];
  } finally {
    await browser.close();
  }
}

async function findEmailViaGoogle(businessName: string, location: string, domain: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const query = encodeURIComponent(`"${businessName}" "${location}" email "@${domain}"`);
    await page.goto(`https://www.google.com/search?q=${query}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    const content = await page.content();
    const regex = new RegExp(`[a-zA-Z0-9._%+\\-]+@${domain.replace(".", "\\.")}`, "gi");
    const matches = content.match(regex);
    return matches?.[0] ?? null;
  } finally {
    await browser.close();
  }
}

async function verifyEmailSMTP(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1];
    const mxRecords = await resolveMx(domain).catch(() => null);
    if (!mxRecords?.length) return false;
    mxRecords.sort((a, b) => a.priority - b.priority);
    const mxHost = mxRecords[0].exchange;

    return new Promise((resolve) => {
      const socket = net.createConnection(25, mxHost);
      let response = "";
      let step = 0;
      socket.setTimeout(5000);

      socket.on("data", (data) => {
        response += data.toString();
        if (step === 0 && response.includes("220")) {
          socket.write("HELO getvenn.agency\r\n");
          step = 1;
        } else if (step === 1 && response.includes("250")) {
          socket.write("MAIL FROM:<check@getvenn.agency>\r\n");
          step = 2;
        } else if (step === 2 && response.includes("250")) {
          socket.write(`RCPT TO:<${email}>\r\n`);
          step = 3;
        } else if (step === 3) {
          const valid =
            response.includes("250") ||
            response.includes("451") ||
            response.includes("452");
          socket.destroy();
          resolve(valid);
        }
      });
      socket.on("timeout", () => { socket.destroy(); resolve(false); });
      socket.on("error", () => resolve(false));
    });
  } catch {
    return false;
  }
}

export async function findOwnerEmail(lead: {
  website?: string | null;
  businessName: string;
  location: string;
  reviewSummary?: unknown;
  ownerName?: string | null;
}): Promise<EmailResult | null> {
  const domain = lead.website ? extractDomain(lead.website) : null;
  if (!domain) return null;

  const patternsTried: string[] = [];

  // Method 1: scrape website pages
  const pagesToScrape = [
    lead.website!,
    `https://${domain}/contact`,
    `https://${domain}/contact-us`,
    `https://${domain}/about`,
    `https://${domain}/about-us`,
    `https://${domain}/team`,
    `https://${domain}/get-in-touch`,
  ];

  for (const url of pagesToScrape) {
    try {
      const emails = await scrapePageForEmails(url);
      const best = prioritiseOwnerEmail(emails);
      if (best) {
        return {
          ownerEmail: best,
          ownerEmailConfidence: "high",
          ownerEmailSource: `website_page:${url}`,
          ownerEmailVerified: true,
          emailPatternsTried: patternsTried,
        };
      }
    } catch {
      continue;
    }
    // Brief pause between pages on same domain
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Method 2: GMB description
  const reviewSummary = lead.reviewSummary as Record<string, unknown> | null;
  if (reviewSummary?.description) {
    const emails = extractEmailsFromText(String(reviewSummary.description));
    if (emails.length > 0) {
      return {
        ownerEmail: emails[0],
        ownerEmailConfidence: "high",
        ownerEmailSource: "google_business_profile",
        ownerEmailVerified: true,
        emailPatternsTried: patternsTried,
      };
    }
  }

  // Method 3: Google search
  const googleEmail = await findEmailViaGoogle(lead.businessName, lead.location, domain).catch(() => null);
  if (googleEmail) {
    return {
      ownerEmail: googleEmail,
      ownerEmailConfidence: "medium",
      ownerEmailSource: "google_search",
      ownerEmailVerified: false,
      emailPatternsTried: patternsTried,
    };
  }

  // Method 4: Common patterns + SMTP verify
  const commonPatterns = [
    `info@${domain}`,
    `hello@${domain}`,
    `contact@${domain}`,
    `enquiries@${domain}`,
    `bookings@${domain}`,
    `admin@${domain}`,
  ];

  for (const email of commonPatterns) {
    patternsTried.push(email);
    const exists = await verifyEmailSMTP(email).catch(() => false);
    if (exists) {
      return {
        ownerEmail: email,
        ownerEmailConfidence: "medium",
        ownerEmailSource: "pattern_verified",
        ownerEmailVerified: true,
        emailPatternsTried: patternsTried,
      };
    }
  }

  // Method 5: Name-based patterns
  if (lead.ownerName) {
    const parts = lead.ownerName.trim().split(/\s+/);
    const firstName = parts[0].toLowerCase();
    const lastName = parts[1]?.toLowerCase();
    const namePatterns = [
      `${firstName}@${domain}`,
      lastName ? `${firstName}.${lastName}@${domain}` : null,
      lastName ? `${firstName[0]}${lastName}@${domain}` : null,
    ].filter(Boolean) as string[];

    for (const email of namePatterns) {
      patternsTried.push(email);
      const exists = await verifyEmailSMTP(email).catch(() => false);
      if (exists) {
        return {
          ownerEmail: email,
          ownerEmailConfidence: "medium",
          ownerEmailSource: "name_pattern_verified",
          ownerEmailVerified: true,
          emailPatternsTried: patternsTried,
        };
      }
    }
  }

  return null;
}
