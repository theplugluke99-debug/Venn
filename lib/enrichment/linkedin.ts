import { chromium } from "playwright";

export interface LinkedInResult {
  linkedInUrl: string | null;
  ownerName: string | null;
  ownerNameSource: string | null;
  linkedInConfidence: string;
}

function findOwnerNameFromReviews(reviewSummary: unknown): string | null {
  const summary = reviewSummary as Record<string, unknown> | null;
  const responses = (summary?.ownerResponses as string[]) ?? [];
  const patterns = [
    /thanks[,\s]+([A-Z][a-z]+)/i,
    /regards[,\s]+([A-Z][a-z]+)/i,
    /([A-Z][a-z]+)\s*[-–]\s*owner/i,
    /([A-Z][a-z]+)\s*[-–]\s*manager/i,
    /([A-Z][a-z]+)\s*[-–]\s*founder/i,
  ];
  for (const response of responses) {
    for (const pattern of patterns) {
      const match = response.match(pattern);
      if (match) return match[1];
    }
  }
  return null;
}

async function findOwnerNameOnWebsite(website: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const base = website.startsWith("http") ? website : `https://${website}`;
    const paths = ["/about", "/about-us", "/team", "/our-story"];
    const patterns = [
      /founded by ([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /owner[,\s:]+([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /([A-Z][a-z]+ [A-Z][a-z]+)[,\s]+founder/i,
      /([A-Z][a-z]+ [A-Z][a-z]+)[,\s]+owner/i,
      /meet ([A-Z][a-z]+)[,\s]+the founder/i,
    ];
    for (const path of paths) {
      try {
        await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 8000 });
        const text = await page.innerText("body").catch(() => "");
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match) return match[1];
        }
      } catch {
        continue;
      }
    }
    return null;
  } finally {
    await browser.close();
  }
}

export async function findLinkedInProfile(lead: {
  businessName: string;
  location: string;
  website?: string | null;
  ownerName?: string | null;
  ownerNameSource?: string | null;
  reviewSummary?: unknown;
  companiesHouseNumber?: string | null;
}): Promise<LinkedInResult | null> {
  let ownerName = lead.ownerName ?? null;
  let ownerNameSource = lead.ownerNameSource ?? null;

  if (!ownerName && lead.reviewSummary) {
    ownerName = findOwnerNameFromReviews(lead.reviewSummary);
    if (ownerName) ownerNameSource = "review_responses";
  }

  if (!ownerName && lead.website) {
    ownerName = await findOwnerNameOnWebsite(lead.website).catch(() => null);
    if (ownerName) ownerNameSource = "website_about_page";
  }

  if (!ownerName) {
    return { linkedInUrl: null, ownerName: null, ownerNameSource: null, linkedInConfidence: "none" };
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const query = encodeURIComponent(
      `"${ownerName}" "${lead.businessName}" site:linkedin.com/in`
    );
    await page.goto(`https://www.google.com/search?q=${query}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    const linkedInUrls = await page.$$eval("a[href]", (links) =>
      (links as HTMLAnchorElement[])
        .map((l) => l.href)
        .filter((href) => href.includes("linkedin.com/in/"))
    );

    if (linkedInUrls.length === 0) {
      return { linkedInUrl: null, ownerName, ownerNameSource, linkedInConfidence: "none" };
    }

    const raw = linkedInUrls[0].split("?")[0].replace("//", "/").replace(":/", "://");
    const slugMatch = raw.match(/linkedin\.com\/in\/([^/]+)/);
    const slug = slugMatch?.[1] ?? "";
    const namePart = ownerName.toLowerCase().replace(/\s+/g, "-");
    const confidence = slug.includes(namePart.split("-")[0]) ? "high" : "medium";

    return { linkedInUrl: raw, ownerName, ownerNameSource, linkedInConfidence: confidence };
  } finally {
    await browser.close();
  }
}
